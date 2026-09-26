import * as React from 'react'
import { AnimatePresence, animate, motion, useAnimate, useMotionValue, useTransform } from 'motion/react'
import { CreditCard, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Phase = 'idle' | 'scanning' | 'verified' | 'success' | 'error'

export type FaceScanPayButtonProps = {
  /** Resting label. */
  label?: string
  /** Amount hint shown beside the label and in the success copy. */
  amount?: string
  successLabel?: string
  errorLabel?: string
  /** Payment work. The scan keeps looping until it settles; rejecting shows the retry state. */
  onPay?: () => void | Promise<unknown>
  /** Minimum scan loops before the result lands. */
  minLoops?: number
  /** Duration of one perimeter loop in ms. */
  loopMs?: number
  /** Auto-reset delay after success in ms. `0` keeps the success state. */
  resetAfter?: number
  disabled?: boolean
  className?: string
}

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

const PILL = { w: 216, h: 60, r: 30 }
const SQUARE = { w: 96, h: 96, r: 30 }
const TRAIL = [
  { len: 36, w: 1.6, o: 0.1 },
  { len: 24, w: 2.2, o: 0.2 },
  { len: 13, w: 2.8, o: 0.4 },
  { len: 6, w: 3.4, o: 0.75 },
]

/** Landmarks of an abstract face mesh (x, y, r) in a 56px box. */
const MESH_NODES: [number, number, number][] = [
  [28, 17.5, 1.1],
  [22.5, 25, 1.7],
  [33.5, 25, 1.7],
  [28, 30.5, 1.2],
  [19, 31, 1],
  [37, 31, 1],
  [24, 36.2, 1.1],
  [32, 36.2, 1.1],
  [28, 41.5, 1.1],
]
const MESH_LINES =
  'M28 17.5L22.5 25L33.5 25L28 17.5M22.5 25L28 30.5L33.5 25M22.5 25L19 31L24 36.2L28 30.5L32 36.2L37 31L33.5 25M24 36.2L32 36.2L28 41.5L24 36.2'

/**
 * Face Scan Pay Button — the pill folds into a lit square, a biometric reticle
 * sweeps a face glyph while a comet runs the rim, then it unfolds with a check.
 */
export function FaceScanPayButton({
  label = 'Pay',
  amount = '$48.00',
  successLabel = 'Paid',
  errorLabel = 'Try again',
  onPay,
  minLoops = 1,
  loopMs = 1500,
  resetAfter = 2600,
  disabled,
  className,
}: FaceScanPayButtonProps) {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = React.useState<Phase>('idle')
  const run = React.useRef(0)
  const head = useMotionValue(0)
  React.useEffect(() => () => void (run.current += 1), [])

  const o0 = useTransform(head, (h) => TRAIL[0].len - h)
  const o1 = useTransform(head, (h) => TRAIL[1].len - h)
  const o2 = useTransform(head, (h) => TRAIL[2].len - h)
  const o3 = useTransform(head, (h) => TRAIL[3].len - h)
  const offsets = [o0, o1, o2, o3]
  const [scope, animateEl] = useAnimate<HTMLDivElement>()
  const dotOffset = useTransform(head, (h) => 0.5 - h)

  const busy = phase === 'scanning' || phase === 'verified'
  const square = busy

  const start = async () => {
    if (busy || disabled) return
    const id = ++run.current
    const alive = () => id === run.current
    let settled = false
    let failed = false
    const work = Promise.resolve()
      .then(() => onPay?.())
      .catch(() => {
        failed = true
      })
      .finally(() => {
        settled = true
      })
    head.set(0)
    setPhase('scanning')

    if (reduced) {
      await Promise.all([work, sleep(900)])
    } else {
      await sleep(260)
      let loops = 0
      while (alive() && (loops < minLoops || !settled)) {
        await animate(head, head.get() + 100, { duration: loopMs / 1000, ease: loops === 0 ? [0.4, 0, 1, 1] : 'linear' })
        loops++
      }
    }
    if (!alive()) return
    if (failed) {
      setPhase('error')
      if (!reduced && scope.current) void animateEl(scope.current, { x: [0, -9, 8, -6, 4, -2, 0] }, { duration: 0.5 })
      return
    }
    setPhase('verified')
    await sleep(reduced ? 150 : 520)
    if (!alive()) return
    setPhase('success')
    if (!resetAfter) return
    await sleep(resetAfter)
    if (alive()) setPhase('idle')
  }

  const spring = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 380, damping: 28, mass: 0.9 }
  const dims = square ? SQUARE : PILL
  const verified = phase === 'verified'
  const glyph = verified ? '#6ee7b7' : '#bdf4ff'

  const status =
    phase === 'scanning'
      ? 'Scanning face to authorize payment'
      : phase === 'verified'
        ? 'Face verified'
        : phase === 'success'
          ? `${successLabel} ${amount}. Payment complete.`
          : phase === 'error'
            ? 'Payment was not authorized. Press to try again.'
            : ''

  return (
    <div ref={scope} className={cn('inline-grid h-[104px] place-items-center', className)}>
      <motion.button
        type="button"
        onClick={start}
        disabled={disabled}
        aria-busy={busy}
        aria-label={
          phase === 'success' ? `${successLabel} ${amount}` : phase === 'error' ? errorLabel : busy ? 'Verifying' : `${label} ${amount}`
        }
        initial={false}
        animate={{
          width: dims.w,
          height: dims.h,
          borderRadius: dims.r,
        }}
        transition={{ width: spring, height: spring, borderRadius: spring }}
        whileTap={busy || reduced ? undefined : { scale: 0.97 }}
        className={cn(
          'group relative isolate overflow-visible text-[15px] font-semibold tracking-tight text-white outline-none',
          'focus-visible:ring-2 focus-visible:ring-cyan-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090d18]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          busy && 'cursor-progress',
        )}
      >
        {/* body */}
        <span aria-hidden className="absolute inset-0 overflow-hidden" style={{ borderRadius: 'inherit' }}>
          <motion.span
            className="absolute inset-0"
            initial={false}
            animate={{
              background:
                phase === 'error'
                  ? 'linear-gradient(180deg, #4a1624 0%, #2a0c15 100%)'
                  : phase === 'success'
                    ? 'linear-gradient(180deg, #11304a 0%, #0a1c2e 100%)'
                    : 'linear-gradient(180deg, #1a2547 0%, #0c1328 100%)',
            }}
            transition={{ duration: 0.4 }}
          />
          <span className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgb(255_255_255/0.14),transparent_60%)]" />
          <motion.span
            className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgb(94_234_212/0.22),transparent_70%)]"
            initial={false}
            animate={{ opacity: busy ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />
        </span>
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 transition-shadow duration-500',
            'shadow-[inset_0_1px_0_rgb(255_255_255/0.14),inset_0_0_0_1px_rgb(148_163_255/0.12),0_1px_2px_rgb(0_0_0/0.5),0_22px_44px_-20px_rgb(40_60_160/0.9)]',
            busy && 'shadow-[inset_0_1px_0_rgb(255_255_255/0.14),inset_0_0_0_1px_rgb(94_234_212/0.25),0_0_40px_-6px_rgb(45_212_191/0.45),0_22px_44px_-20px_rgb(40_60_160/0.9)]',
            phase === 'error' && 'shadow-[inset_0_1px_0_rgb(255_255_255/0.1),inset_0_0_0_1px_rgb(251_113_133/0.3),0_22px_44px_-20px_rgb(190_18_60/0.8)]',
          )}
          style={{ borderRadius: 'inherit' }}
        />

        {/* comet on the rim */}
        <AnimatePresence>
          {busy && !reduced && (
            <motion.svg
              key="rim"
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              viewBox={`0 0 ${SQUARE.w} ${SQUARE.h}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: verified ? 0 : 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.25, delay: verified ? 0 : 0.18 }}
              style={{ filter: 'drop-shadow(0 0 5px rgb(125 249 255 / 0.9)) drop-shadow(0 0 12px rgb(45 212 191 / 0.6))' }}
            >
              <rect x={1} y={1} width={SQUARE.w - 2} height={SQUARE.h - 2} rx={SQUARE.r - 1} fill="none" stroke="rgb(148 197 255 / 0.12)" strokeWidth={1} />
              {TRAIL.map((t, i) => (
                <motion.rect
                  key={i}
                  x={1}
                  y={1}
                  width={SQUARE.w - 2}
                  height={SQUARE.h - 2}
                  rx={SQUARE.r - 1}
                  pathLength={100}
                  fill="none"
                  stroke="#7df9ff"
                  strokeOpacity={t.o}
                  strokeWidth={t.w}
                  strokeLinecap="round"
                  strokeDasharray={`${t.len} ${100 - t.len}`}
                  style={{ strokeDashoffset: offsets[i] }}
                />
              ))}
              <motion.rect
                x={1}
                y={1}
                width={SQUARE.w - 2}
                height={SQUARE.h - 2}
                rx={SQUARE.r - 1}
                pathLength={100}
                fill="none"
                stroke="#ffffff"
                strokeWidth={4.5}
                strokeLinecap="round"
                strokeDasharray="0.5 99.5"
                style={{ strokeDashoffset: dotOffset }}
              />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* content */}
        <AnimatePresence initial={false} mode="popLayout">
          {(phase === 'idle' || phase === 'error') && (
            <motion.span
              key={`rest-${phase}`}
              className="absolute inset-0 flex items-center justify-center gap-2.5 whitespace-nowrap"
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.85, filter: 'blur(4px)', transition: { duration: 0.14 } }}
              transition={{ duration: 0.25, delay: 0.08 }}
            >
              {phase === 'error' ? (
                <>
                  <RotateCcw className="h-4 w-4 text-rose-200" strokeWidth={2.4} />
                  <span>{errorLabel}</span>
                </>
              ) : (
                <>
                  <span className="grid h-7 w-9 place-items-center rounded-md bg-white/10 ring-1 ring-white/15 transition-transform duration-200 group-hover:-rotate-6">
                    <CreditCard className="h-4 w-4" strokeWidth={2.2} />
                  </span>
                  <span>{label}</span>
                  <span className="text-white/45">·</span>
                  <span className="tabular-nums text-white/70">{amount}</span>
                </>
              )}
            </motion.span>
          )}

          {busy && (
            <motion.span
              key="scan"
              aria-hidden
              className="absolute inset-0 grid place-items-center"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: verified ? 0 : 1, scale: verified ? 0.82 : 1 }}
              exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.18 } }}
              transition={verified ? { duration: 0.35, delay: 0.2, ease: 'easeIn' } : { type: 'spring', stiffness: 300, damping: 22, delay: 0.12 }}
            >
              <svg viewBox="0 0 56 56" className="h-14 w-14 overflow-visible" fill="none" strokeLinecap="round" strokeLinejoin="round">
                {/* brackets */}
                <motion.g
                  stroke={glyph}
                  strokeWidth={2.6}
                  initial={false}
                  animate={{ scale: verified ? 0.86 : reduced ? 1 : [1, 1.05, 1] }}
                  transition={verified ? { type: 'spring', stiffness: 500, damping: 18 } : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformOrigin: '28px 28px', filter: `drop-shadow(0 0 4px ${glyph})` }}
                >
                  {['M4 15V9a5 5 0 0 1 5-5h6', 'M41 4h6a5 5 0 0 1 5 5v6', 'M52 41v6a5 5 0 0 1-5 5h-6', 'M15 52H9a5 5 0 0 1-5-5v-6'].map((d, i) => (
                    <motion.path
                      key={d}
                      d={d}
                      initial={reduced ? false : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.35, delay: 0.15 + i * 0.05, ease: 'easeOut' }}
                    />
                  ))}
                </motion.g>
                {/* face mesh glyph: dashed contour + landmark nodes */}
                <g stroke={glyph} style={{ transition: 'stroke 0.3s' }}>
                  <motion.ellipse
                    cx={28}
                    cy={29}
                    rx={12}
                    ry={15}
                    strokeWidth={1.4}
                    strokeDasharray="2.2 3"
                    opacity={0.75}
                    initial={false}
                    animate={reduced ? {} : { rotate: verified ? 0 : 360 }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                    style={{ transformOrigin: '28px 29px' }}
                  />
                  <motion.path
                    d={MESH_LINES}
                    strokeWidth={0.9}
                    opacity={0.55}
                    initial={reduced ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, delay: 0.3, ease: 'easeInOut' }}
                  />
                </g>
                <g fill={glyph} style={{ transition: 'fill 0.3s' }}>
                  {MESH_NODES.map(([x, y, r], i) => (
                    <motion.circle
                      key={i}
                      cx={x}
                      cy={y}
                      r={r}
                      initial={reduced ? false : { scale: 0 }}
                      animate={reduced ? { scale: 1 } : { scale: verified ? 1.25 : [1, 1.35, 1] }}
                      transition={
                        verified
                          ? { type: 'spring', stiffness: 600, damping: 14 }
                          : { duration: 1.8, repeat: Infinity, delay: 0.25 + i * 0.07, ease: 'easeInOut' }
                      }
                      style={{ transformOrigin: `${x}px ${y}px`, filter: `drop-shadow(0 0 2px ${glyph})` }}
                    />
                  ))}
                </g>
                {/* scan line */}
                {!reduced && !verified && (
                  <motion.g
                    initial={{ y: 8 }}
                    animate={{ y: [8, 46, 8] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <rect x={6} y={-6} width={44} height={6} fill="url(#fsp-sweep)" />
                    <line x1={7} x2={49} y1={0} y2={0} stroke="#e0fdff" strokeWidth={1.4} style={{ filter: 'drop-shadow(0 0 3px #7df9ff)' }} />
                  </motion.g>
                )}
                <defs>
                  <linearGradient id="fsp-sweep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#7df9ff" stopOpacity="0" />
                    <stop offset="1" stopColor="#7df9ff" stopOpacity="0.35" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.span>
          )}

          {phase === 'success' && (
            <motion.span
              key="done"
              className="absolute inset-0 flex items-center justify-center gap-2.5 whitespace-nowrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <motion.span
                className="grid h-7 w-7 place-items-center rounded-full bg-emerald-300 text-emerald-950 shadow-[0_0_0_5px_rgb(110_231_183/0.16),0_0_18px_rgb(110_231_183/0.5)]"
                initial={reduced ? false : { scale: 0, rotate: -120 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 520, damping: 16, delay: 0.12 }}
              >
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                  <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={reduced ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.25 }} />
                </svg>
              </motion.span>
              <motion.span
                initial={reduced ? false : { opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 26, delay: 0.18 }}
              >
                {successLabel} <span className="tabular-nums text-emerald-200/80">{amount}</span>
              </motion.span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
      <span className="sr-only" role="status" aria-live="polite">
        {status}
      </span>
    </div>
  )
}
