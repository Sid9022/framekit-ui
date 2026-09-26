import * as React from 'react'
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'
import { Lock, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Brand = 'wave' | 'prism' | 'arc' | 'grid' | null
type Field = 'number' | 'name' | 'expiry' | 'cvc' | null
type Phase = 'form' | 'paying' | 'success'

export type CheckoutDetails = { number: string; name: string; expiry: string; cvc: string; brand: Brand }

export type FlipCheckoutCardProps = {
  amount?: number
  currency?: string
  merchant?: string
  /** Name printed on the card face. */
  issuer?: string
  /** Async payment handler. Rejecting shows an inline error. */
  onPay?: (details: CheckoutDetails) => Promise<unknown> | void
  className?: string
}

const BRAND_LABEL: Record<Exclude<Brand, null>, string> = { wave: 'Wave', prism: 'Prism', arc: 'Arc', grid: 'Grid' }

export function detectBrand(digits: string): Brand {
  if (/^3[47]/.test(digits)) return 'arc'
  if (/^4/.test(digits)) return 'wave'
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'prism'
  if (/^6/.test(digits)) return 'grid'
  return null
}

const groupsFor = (brand: Brand) => (brand === 'arc' ? [4, 6, 5] : [4, 4, 4, 4])
const maxLen = (brand: Brand) => (brand === 'arc' ? 15 : 16)

function formatNumber(digits: string, brand: Brand) {
  const out: string[] = []
  let i = 0
  for (const g of groupsFor(brand)) {
    if (i >= digits.length) break
    out.push(digits.slice(i, i + g))
    i += g
  }
  return out.join(' ')
}

function formatExpiry(raw: string) {
  let d = raw.replace(/\D/g, '').slice(0, 4)
  if (d.length === 1 && Number(d) > 1) d = `0${d}`
  if (d.length >= 2) {
    const m = Math.min(12, Math.max(1, Number(d.slice(0, 2)) || 1))
    d = String(m).padStart(2, '0') + d.slice(2)
  }
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

function expiryValid(exp: string) {
  const m = /^(\d{2})\/(\d{2})$/.exec(exp)
  if (!m) return false
  const month = Number(m[1])
  const year = 2000 + Number(m[2])
  const now = new Date()
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1)
}

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

/**
 * Flip Checkout Card — a frosted payment card mirrors every keystroke, flips
 * to its back for the security code, and the whole checkout condenses into a
 * receipt once paid.
 */
export function FlipCheckoutCard({
  amount = 129,
  currency = 'USD',
  merchant = 'Atelier Nine',
  issuer = 'Lumen',
  onPay,
  className,
}: FlipCheckoutCardProps) {
  const reduced = usePrefersReducedMotion()
  const [digits, setDigits] = React.useState('')
  const [name, setName] = React.useState('')
  const [expiry, setExpiry] = React.useState('')
  const [cvc, setCvc] = React.useState('')
  const [focus, setFocus] = React.useState<Field>(null)
  const [phase, setPhase] = React.useState<Phase>('form')
  const [error, setError] = React.useState<string | null>(null)
  const [shakeKey, setShakeKey] = React.useState(0)
  const uid = React.useId()
  const brand = detectBrand(digits)
  const cvcLen = brand === 'arc' ? 4 : 3
  const price = React.useMemo(
    () => new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount),
    [amount, currency],
  )

  // content-height morph
  const innerRef = React.useRef<HTMLDivElement>(null)
  const [height, setHeight] = React.useState<number | 'auto'>('auto')
  React.useLayoutEffect(() => {
    const el = innerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const flipped = focus === 'cvc'
  const spring = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 210, damping: 22, mass: 0.9 }

  const pay = async (e: React.FormEvent) => {
    e.preventDefault()
    if (phase !== 'form') return
    const problem =
      digits.length < maxLen(brand)
        ? 'Enter the full card number.'
        : name.trim().length < 2
          ? 'Add the name shown on the card.'
          : !expiryValid(expiry)
            ? 'Check the expiry date.'
            : cvc.length < cvcLen
              ? `Security code needs ${cvcLen} digits.`
              : null
    if (problem) {
      setError(problem)
      setShakeKey((k) => k + 1)
      return
    }
    setError(null)
    setPhase('paying')
    try {
      await Promise.all([onPay?.({ number: digits, name, expiry, cvc, brand }), sleep(reduced ? 300 : 1500)])
      setPhase('success')
    } catch {
      setPhase('form')
      setError('Payment was declined. Try another card.')
      setShakeKey((k) => k + 1)
    }
  }

  const replay = () => {
    setDigits('')
    setName('')
    setExpiry('')
    setCvc('')
    setError(null)
    setPhase('form')
  }

  const inputCls =
    'h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/80 px-3.5 text-[15px] text-zinc-900 outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-violet-400 focus:bg-white focus:shadow-[0_0_0_4px_rgb(167_139_250/0.18)]'
  const labelCls = 'mb-1.5 block text-[12px] font-medium tracking-wide text-zinc-500'

  return (
    <motion.div
      className={cn('relative w-full max-w-[372px]', className)}
      initial={false}
      animate={{ paddingTop: phase === 'success' ? 0 : 104 }}
      transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 30, delay: phase === 'success' ? 0.1 : 0 }}
    >
      {/* card */}
      <AnimatePresence>
        {phase !== 'success' && (
          <motion.div
            key="card"
            className="absolute left-1/2 top-0 z-10 -ml-[160px] h-[200px] w-[320px]"
            style={{ perspective: 1200 }}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -36, scale: 0.86, rotateX: 24, transition: { duration: 0.4, ease: [0.5, 0, 0.75, 0] } }}
          >
            <PaymentCard
              digits={digits}
              brand={brand}
              name={name}
              expiry={expiry}
              cvc={cvc}
              cvcLen={cvcLen}
              focus={focus}
              flipped={flipped}
              issuer={issuer}
              reduced={reduced}
              flipTransition={spring}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* surface */}
      <motion.div
        className="relative overflow-hidden rounded-[28px] bg-white shadow-[0_1px_0_rgb(255_255_255)_inset,0_0_0_1px_rgb(0_0_0/0.04),0_30px_70px_-30px_rgb(0_0_0/0.7),0_8px_20px_-12px_rgb(0_0_0/0.35)]"
        initial={false}
        animate={{ height }}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 240, damping: 30 }}
      >
        <div ref={innerRef}>
          <AnimatePresence mode="wait" initial={false}>
            {phase !== 'success' ? (
              <motion.form
                key="form"
                onSubmit={pay}
                noValidate
                className="px-6 pb-6 pt-[116px]"
                exit={{ opacity: 0, filter: 'blur(4px)', transition: { duration: 0.22 } }}
              >
                <div className="mb-4 flex items-baseline justify-between">
                  <p className="text-[15px] font-semibold tracking-tight text-zinc-900">Payment details</p>
                  <p className="text-[12px] text-zinc-500 dark:text-zinc-400">{merchant}</p>
                </div>
                <fieldset disabled={phase === 'paying'} className="space-y-3.5">
                  <div>
                    <label htmlFor={`${uid}-n`} className={labelCls}>
                      Card number
                    </label>
                    <div className="relative">
                      <input
                        id={`${uid}-n`}
                        className={cn(inputCls, 'pr-12 font-mono tracking-[0.06em]')}
                        inputMode="numeric"
                        autoComplete="cc-number"
                        placeholder="1234 5678 9012 3456"
                        value={formatNumber(digits, brand)}
                        onChange={(e) => {
                          const d = e.target.value.replace(/\D/g, '')
                          setDigits(d.slice(0, maxLen(detectBrand(d))))
                        }}
                        onFocus={() => setFocus('number')}
                        onBlur={() => setFocus(null)}
                        aria-describedby={`${uid}-brand`}
                      />
                      <span id={`${uid}-brand`} className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-500">
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.span
                            key={brand ?? 'none'}
                            className="block h-5 w-7"
                            initial={{ scale: 0.4, opacity: 0, rotate: -30 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.4, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 520, damping: 22 }}
                          >
                            <BrandGlyph brand={brand} mono />
                          </motion.span>
                        </AnimatePresence>
                        <span className="sr-only">{brand ? `${BRAND_LABEL[brand]} card detected` : ''}</span>
                      </span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`${uid}-h`} className={labelCls}>
                      Name on card
                    </label>
                    <input
                      id={`${uid}-h`}
                      className={inputCls}
                      autoComplete="cc-name"
                      placeholder="Mira Okafor"
                      maxLength={26}
                      value={name}
                      onChange={(e) => setName(e.target.value.replace(/[^\p{L} .'-]/gu, ''))}
                      onFocus={() => setFocus('name')}
                      onBlur={() => setFocus(null)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor={`${uid}-e`} className={labelCls}>
                        Expiry
                      </label>
                      <input
                        id={`${uid}-e`}
                        className={cn(inputCls, 'font-mono')}
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => {
                          const v = e.target.value
                          // allow deleting the slash naturally
                          setExpiry(v.length < expiry.length && expiry.endsWith('/') ? v.replace('/', '') : formatExpiry(v))
                        }}
                        onFocus={() => setFocus('expiry')}
                        onBlur={() => setFocus(null)}
                      />
                    </div>
                    <div>
                      <label htmlFor={`${uid}-c`} className={labelCls}>
                        Security code
                      </label>
                      <input
                        id={`${uid}-c`}
                        className={cn(inputCls, 'font-mono')}
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        placeholder={'•'.repeat(cvcLen)}
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, cvcLen))}
                        onFocus={() => setFocus('cvc')}
                        onBlur={() => setFocus(null)}
                        aria-describedby={`${uid}-cvc-hint`}
                      />
                      <span id={`${uid}-cvc-hint`} className="sr-only">
                        {cvcLen} digits on the back of the card
                      </span>
                    </div>
                  </div>
                </fieldset>

                <div className="min-h-[22px] pt-2" role="alert" aria-live="assertive">
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        className="text-[12.5px] font-medium text-rose-600"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  key={shakeKey}
                  type="submit"
                  disabled={phase === 'paying'}
                  aria-busy={phase === 'paying'}
                  initial={shakeKey && !reduced ? { x: 0 } : false}
                  animate={shakeKey && !reduced ? { x: [0, -7, 7, -4, 4, 0] } : { x: 0 }}
                  transition={{ duration: 0.38 }}
                  whileTap={reduced ? undefined : { scale: 0.98 }}
                  className="relative mt-1 flex h-12 w-full items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#27242f,#131118)] text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.14),0_10px_24px_-12px_rgb(0_0_0/0.8)] outline-none transition-[filter] hover:brightness-125 focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 disabled:cursor-progress"
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    {phase === 'paying' ? (
                      <motion.span
                        key="spin"
                        className="flex items-center gap-2.5"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.svg
                          viewBox="0 0 24 24"
                          className="h-[18px] w-[18px]"
                          animate={reduced ? undefined : { rotate: 360 }}
                          transition={{ duration: 0.8, ease: 'linear', repeat: Infinity }}
                        >
                          <circle cx={12} cy={12} r={9} fill="none" stroke="rgb(255 255 255/0.2)" strokeWidth={2.6} />
                          <path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke="#c4b5fd" strokeWidth={2.6} strokeLinecap="round" />
                        </motion.svg>
                        Processing
                      </motion.span>
                    ) : (
                      <motion.span
                        key="pay"
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Lock className="h-4 w-4 opacity-70" strokeWidth={2.4} />
                        Pay {price}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
                <p className="mt-3 text-center text-[11px] text-zinc-500 dark:text-zinc-400">Demo only — nothing is charged or stored.</p>
              </motion.form>
            ) : (
              <motion.div
                key="done"
                className="flex flex-col items-center px-6 pb-6 pt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="relative grid h-16 w-16 place-items-center rounded-full bg-emerald-500 shadow-[0_0_0_8px_rgb(16_185_129/0.14),0_12px_30px_-10px_rgb(16_185_129/0.8)]"
                  initial={reduced ? false : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 16, delay: 0.1 }}
                >
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                    <motion.path
                      d="M5 12.5l4.5 4.5L19 7.5"
                      initial={reduced ? false : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, delay: 0.35, ease: [0.65, 0, 0.35, 1] }}
                    />
                  </svg>
                </motion.div>
                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 26 }}
                >
                  <p className="mt-4 text-[13px] font-medium text-emerald-600">Payment complete</p>
                  <p className="mt-1 text-[32px] font-semibold tabular-nums tracking-tight text-zinc-900">{price}</p>
                  <p className="mt-1 text-[13px] text-zinc-500">
                    Paid to {merchant} · {brand ? BRAND_LABEL[brand] : 'Card'} •••• {digits.slice(-4)}
                  </p>
                </motion.div>
                <motion.button
                  type="button"
                  onClick={replay}
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-5 inline-flex h-10 items-center gap-2 rounded-full border border-zinc-200 px-4 text-[13px] font-medium text-zinc-700 outline-none transition-colors hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-violet-400"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  New payment
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <span className="sr-only" role="status" aria-live="polite">
        {phase === 'paying' ? 'Processing payment…' : phase === 'success' ? `Payment of ${price} to ${merchant} complete.` : ''}
      </span>
    </motion.div>
  )
}

function PaymentCard({
  digits,
  brand,
  name,
  expiry,
  cvc,
  cvcLen,
  focus,
  flipped,
  issuer,
  reduced,
  flipTransition,
}: {
  digits: string
  brand: Brand
  name: string
  expiry: string
  cvc: string
  cvcLen: number
  focus: Field
  flipped: boolean
  issuer: string
  reduced: boolean
  flipTransition: object
}) {
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const gx = useMotionValue(30)
  const gy = useMotionValue(20)
  const srx = useSpring(rx, { stiffness: 220, damping: 20 })
  const sry = useSpring(ry, { stiffness: 220, damping: 20 })
  const glare = useMotionTemplate`radial-gradient(260px circle at ${gx}% ${gy}%, rgb(255 255 255/0.55), transparent 60%)`

  const onMove = (e: React.PointerEvent) => {
    if (reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * 14)
    rx.set(-(py - 0.5) * 12)
    gx.set(px * 100)
    gy.set(py * 100)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
    gx.set(30)
    gy.set(20)
  }

  const groups = groupsFor(brand)
  const slots: string[] = []
  let k = 0
  groups.forEach((g, gi) => {
    for (let i = 0; i < g; i++) slots.push(digits[k++] ?? '')
    if (gi < groups.length - 1) slots.push(' ')
  })

  const face =
    'absolute inset-0 overflow-hidden rounded-[20px] border border-white/70 shadow-[inset_0_1px_0_rgb(255_255_255/0.9),0_24px_50px_-18px_rgb(30_20_80/0.55),0_6px_14px_-6px_rgb(30_20_80/0.3)]'
  const faceBg = {
    background:
      'linear-gradient(135deg, rgb(199 184 255/0.92) 0%, rgb(160 205 255/0.88) 48%, rgb(248 250 255/0.94) 100%)',
    backdropFilter: 'blur(18px) saturate(1.4)',
    WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
    backfaceVisibility: 'hidden' as const,
    WebkitBackfaceVisibility: 'hidden' as const,
  }

  const ring = (field: Field) =>
    focus === field && (
      <motion.span
        layoutId="fk-card-focus"
        className="pointer-events-none absolute -inset-x-2 -inset-y-1 rounded-lg border border-white/90 bg-white/20 shadow-[0_0_0_3px_rgb(139_92_246/0.18)]"
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      />
    )

  return (
    <motion.div
      aria-hidden
      className="relative h-full w-full"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={flipTransition}
      >
        {/* front */}
        <div className={face} style={faceBg}>
          <div className="absolute -left-10 -top-16 h-44 w-44 rounded-full bg-violet-400/40 blur-2xl" />
          <div className="absolute -bottom-20 right-0 h-44 w-52 rounded-full bg-sky-300/50 blur-2xl" />
          <motion.div className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ background: glare }} />
          <div className="relative flex h-full flex-col justify-between p-5 text-[#1f1a44]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold tracking-tight">{issuer}</span>
                <svg viewBox="0 0 16 16" className="h-4 w-4 opacity-60" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round">
                  <path d="M5 4.5a5 5 0 0 1 0 7M8 3a7.5 7.5 0 0 1 0 10M11 1.8a9.5 9.5 0 0 1 0 12.4" />
                </svg>
              </div>
              <div className="flex flex-col items-end">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={brand ?? 'none'}
                    className="block h-7 w-10"
                    initial={{ opacity: 0, scale: 0.5, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: 'spring', stiffness: 480, damping: 22 }}
                  >
                    <BrandGlyph brand={brand} />
                  </motion.span>
                </AnimatePresence>
                <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] opacity-60">
                  {brand ? BRAND_LABEL[brand] : 'Card'}
                </span>
              </div>
            </div>

            <Chip />

            <div className="relative font-mono text-[19px] font-medium tracking-[0.08em]">
              {ring('number')}
              <span className="relative flex">
                {slots.map((c, i) =>
                  c === ' ' ? (
                    <span key={i} className="w-3" />
                  ) : (
                    <span key={i} className="relative inline-block w-[0.66em] text-center">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={c || 'dot'}
                          className={cn('inline-block', !c && 'opacity-40')}
                          initial={reduced ? false : { y: -10, opacity: 0, filter: 'blur(3px)' }}
                          animate={{ y: 0, opacity: c ? 1 : 0.4, filter: 'blur(0px)' }}
                          exit={{ y: 10, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 520, damping: 30 }}
                        >
                          {c || '•'}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                  ),
                )}
              </span>
            </div>

            <div className="flex items-end justify-between gap-4 text-[#1f1a44]">
              <div className="relative min-w-0 flex-1">
                {ring('name')}
                <p className="relative text-[8.5px] font-semibold uppercase tracking-[0.2em] opacity-55">Card holder</p>
                <p className="relative truncate text-[13px] font-semibold uppercase tracking-[0.08em]">
                  {name.trim() || 'Your name'}
                </p>
              </div>
              <div className="relative text-right">
                {ring('expiry')}
                <p className="relative text-[8.5px] font-semibold uppercase tracking-[0.2em] opacity-55">Valid thru</p>
                <p className="relative font-mono text-[13px] font-semibold">{expiry || 'MM/YY'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* back */}
        <div className={face} style={{ ...faceBg, transform: 'rotateY(180deg)' }}>
          <div className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-violet-400/40 blur-2xl" />
          <div className="absolute inset-x-0 top-6 h-10 bg-[linear-gradient(180deg,#221c3f,#0f0c22)]" />
          <div className="absolute inset-x-5 top-[76px] flex items-center gap-3">
            <div
              className="h-9 flex-1 rounded-md"
              style={{
                background:
                  'repeating-linear-gradient(-12deg, rgb(255 255 255/0.95) 0 6px, rgb(226 222 255/0.95) 6px 12px)',
              }}
            />
            <div className="relative grid h-9 w-16 place-items-center rounded-md bg-white font-mono text-[15px] font-semibold italic tracking-[0.15em] text-[#1f1a44] shadow-[0_0_0_3px_rgb(139_92_246/0.25)]">
              <span className="flex">
                {Array.from({ length: cvcLen }, (_, i) => (
                  <span key={i} className="relative inline-block w-[0.7em] text-center">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={cvc[i] ?? 'dot'}
                        className={cn('inline-block', !cvc[i] && 'opacity-30')}
                        initial={reduced ? false : { scale: 0.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: cvc[i] ? 1 : 0.3 }}
                        exit={{ scale: 0.3, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 600, damping: 24 }}
                      >
                        {cvc[i] ?? '•'}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                ))}
              </span>
            </div>
          </div>
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-[#1f1a44]">
            <p className="max-w-[170px] text-[8px] leading-snug opacity-55">
              Security code is printed beside the signature strip. Keep it private.
            </p>
            <div
              className="h-9 w-9 rounded-full opacity-90"
              style={{
                background: 'conic-gradient(from 0deg,#f9a8d4,#a5b4fc,#67e8f9,#bef264,#fde68a,#f9a8d4)',
                boxShadow: 'inset 0 0 0 2px rgb(255 255 255/0.6)',
              }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Chip() {
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "")
  return (
    <svg viewBox="0 0 40 30" className="h-[26px] w-[36px]">
      <defs>
        <linearGradient id={`chip${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbe7a8" />
          <stop offset="0.5" stopColor="#d9b25a" />
          <stop offset="1" stopColor="#f5dc92" />
        </linearGradient>
      </defs>
      <rect x={0.5} y={0.5} width={39} height={29} rx={6} fill={`url(#chip${id})`} stroke="rgb(120 90 30/0.35)" />
      <path d="M0.5 10.5h12M0.5 19.5h12M27.5 10.5h12M27.5 19.5h12M12.5 0.5v29M27.5 0.5v29M12.5 15h15" stroke="rgb(120 90 30/0.45)" fill="none" />
    </svg>
  )
}

/** Generic, invented network marks — deliberately not real brand logos. */
function BrandGlyph({ brand, mono }: { brand: Brand; mono?: boolean }) {
  const c1 = mono ? 'currentColor' : '#4c3fd1'
  const c2 = mono ? 'currentColor' : '#2d8ee6'
  switch (brand) {
    case 'wave':
      return (
        <svg viewBox="0 0 40 28" className="h-full w-full" fill="none" strokeLinecap="round" strokeWidth={2.6}>
          <path d="M4 10c4-5 8-5 12 0s8 5 12 0 6-4 8-2" stroke={c1} />
          <path d="M4 18c4-5 8-5 12 0s8 5 12 0 6-4 8-2" stroke={c2} opacity={0.8} />
        </svg>
      )
    case 'prism':
      return (
        <svg viewBox="0 0 40 28" className="h-full w-full">
          <path d="M20 3l14 22H6z" fill={c1} opacity={0.9} />
          <path d="M20 3l14 22H20z" fill={c2} opacity={0.85} />
          <path d="M20 3v22" stroke="white" strokeOpacity={0.6} strokeWidth={1} />
        </svg>
      )
    case 'arc':
      return (
        <svg viewBox="0 0 40 28" className="h-full w-full" fill="none" strokeLinecap="round" strokeWidth={2.8}>
          <path d="M8 23a12 12 0 0 1 24 0" stroke={c1} />
          <path d="M14 23a6 6 0 0 1 12 0" stroke={c2} />
        </svg>
      )
    case 'grid':
      return (
        <svg viewBox="0 0 40 28" className="h-full w-full">
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <rect key={`${r}${c}`} x={11 + c * 7} y={4 + r * 7} width={5} height={5} rx={1.4} fill={(r + c) % 2 ? c2 : c1} />
            )),
          )}
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 40 28" className="h-full w-full" fill="none">
          <rect x={6} y={5} width={28} height={18} rx={4} stroke={mono ? 'currentColor' : '#1f1a44'} strokeOpacity={0.35} strokeWidth={1.8} strokeDasharray="3 3" />
        </svg>
      )
  }
}
