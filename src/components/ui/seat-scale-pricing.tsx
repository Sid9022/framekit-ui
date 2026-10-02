import * as React from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { ArrowRight, Check, Loader2, RotateCcw, Sparkles } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type PricingTier = { id: string; name: string; minSeats: number; perSeat: number; hue: number; features: string[] }
export type Billing = 'monthly' | 'yearly'

export type SeatScalePricingProps = {
  tiers?: PricingTier[]
  seats?: number
  defaultSeats?: number
  onSeatsChange?: (seats: number) => void
  billing?: Billing
  defaultBilling?: Billing
  onBillingChange?: (b: Billing) => void
  maxSeats?: number
  /** Yearly discount, 0–0.5. */
  yearlyDiscount?: number
  currency?: string
  /** Async checkout; reject / return false to show the retry state. */
  onCheckout?: (sel: { tier: PricingTier; seats: number; billing: Billing; total: number }) => void | boolean | Promise<void | boolean>
  className?: string
}

export const DEFAULT_PRICING_TIERS: PricingTier[] = [
  { id: 'solo', name: 'Starter', minSeats: 1, perSeat: 14, hue: 200, features: ['Unlimited projects', 'Version history · 30 days', 'Community support'] },
  { id: 'team', name: 'Team', minSeats: 6, perSeat: 12, hue: 262, features: ['Shared libraries', 'Roles & permissions', 'Priority email support'] },
  { id: 'scale', name: 'Scale', minSeats: 26, perSeat: 10, hue: 316, features: ['SSO & SCIM', 'Audit log · 1 year', 'Uptime SLA 99.9%'] },
  { id: 'fleet', name: 'Fleet', minSeats: 101, perSeat: 8, hue: 28, features: ['Dedicated success lead', 'Custom contracts', 'Regional data residency'] },
]

const NAMES = ['Ava', 'Ben', 'Cy', 'Dee', 'Eli', 'Fay', 'Gus', 'Hana', 'Ivo', 'Jun', 'Kai', 'Lea', 'Max', 'Noor', 'Oli', 'Pia', 'Quin', 'Rae']

function Digit({ d, reduced }: { d: string; reduced: boolean }) {
  if (!/\d/.test(d)) return <span className="inline-block">{d}</span>
  const n = Number(d)
  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden align-top leading-none">
      <motion.span
        className="absolute left-0 top-0 flex flex-col"
        initial={false}
        animate={{ y: `${-n}em` }}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 22 }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="block h-[1em] leading-none">{i}</span>
        ))}
      </motion.span>
    </span>
  )
}

function Odometer({ value, reduced }: { value: string; reduced: boolean }) {
  const chars = value.split('')
  return (
    <span className="inline-flex tabular-nums" aria-hidden>
      <AnimatePresence initial={false} mode="popLayout">
        {chars.map((c, i) => (
          <motion.span
            key={chars.length - i}
            layout={!reduced}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          >
            <Digit d={c} reduced={reduced} />
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  )
}

/**
 * Seat Scale Pricing — one card that morphs through every plan as you drag
 * the team size. A crowd of avatars pops in seat by seat, the price rolls on
 * odometer reels, the tier badge and accent colour cross-fade, newly
 * unlocked features slide in with a glow, and yearly billing bursts a
 * savings chip. The CTA runs an async checkout with retry.
 */
export function SeatScalePricing({
  tiers = DEFAULT_PRICING_TIERS,
  seats: seatsProp,
  defaultSeats = 8,
  onSeatsChange,
  billing: billingProp,
  defaultBilling = 'yearly',
  onBillingChange,
  maxSeats = 150,
  yearlyDiscount = 0.2,
  currency = '$',
  onCheckout,
  className,
}: SeatScalePricingProps) {
  const reduced = usePrefersReducedMotion()
  const [innerSeats, setInnerSeats] = React.useState(defaultSeats)
  const seats = seatsProp ?? innerSeats
  const [innerBilling, setInnerBilling] = React.useState<Billing>(defaultBilling)
  const billing = billingProp ?? innerBilling
  const [state, setState] = React.useState<'idle' | 'busy' | 'done' | 'error'>('idle')
  const id = React.useId()

  const sorted = [...tiers].sort((a, b) => a.minSeats - b.minSeats)
  const tierIndex = sorted.reduce((acc, t, i) => (seats >= t.minSeats ? i : acc), 0)
  const tier = sorted[tierIndex]
  const mult = billing === 'yearly' ? 1 - yearlyDiscount : 1
  const monthly = Math.round(seats * tier.perSeat * mult)
  const saved = Math.round(seats * tier.perSeat * yearlyDiscount * 12)
  const unlocked = sorted.slice(0, tierIndex + 1).flatMap((t, ti) => t.features.map((f) => ({ f, ti })))

  const setSeats = (v: number) => {
    const c = Math.max(1, Math.min(maxSeats, Math.round(v)))
    if (seatsProp === undefined) setInnerSeats(c)
    onSeatsChange?.(c)
    if (state !== 'busy') setState('idle')
  }
  const setBilling = (b: Billing) => {
    if (billingProp === undefined) setInnerBilling(b)
    onBillingChange?.(b)
  }

  const checkout = async () => {
    if (state === 'busy') return
    if (state === 'done') return setState('idle')
    setState('busy')
    try {
      const r = await (onCheckout ? onCheckout({ tier, seats, billing, total: monthly }) : new Promise((res) => setTimeout(res, 1300)))
      setState(r === false ? 'error' : 'done')
    } catch {
      setState('error')
    }
  }

  const accent = `hsl(${tier.hue} 80% 60%)`
  const shownAvatars = Math.min(seats, 11)
  /* piecewise scale: every tier owns an equal slice of the track */
  const bounds = sorted.map((t) => t.minSeats).concat(maxSeats)
  const segs = sorted.length
  const posFromSeats = (n: number) => {
    for (let k = 0; k < segs; k++) {
      const a = bounds[k]
      const b = bounds[k + 1]
      if (n < b || k === segs - 1) return ((k + Math.min(1, Math.max(0, (n - a) / Math.max(1, b - a)))) / segs) * 1000
    }
    return 1000
  }
  const seatsFromPos = (p: number) => {
    const f = (p / 1000) * segs
    const k = Math.min(segs - 1, Math.floor(f))
    const a = bounds[k]
    const b = bounds[k + 1]
    return Math.round(a + (f - k) * (b - a))
  }
  const pct = posFromSeats(seats) / 10

  return (
    <div
      className={cn(
        'relative w-full max-w-[400px] overflow-hidden rounded-[28px] p-6',
        'bg-white ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgb(0_0_0/0.04),0_30px_60px_-30px_rgb(24_24_27/0.35)]',
        'dark:bg-zinc-950 dark:ring-white/[0.08] dark:shadow-none',
        className,
      )}
      style={{ ['--accent' as string]: accent }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full blur-3xl"
        animate={{ backgroundColor: `hsl(${tier.hue} 90% 65% / 0.28)` }}
        transition={{ duration: 0.8 }}
      />
      {/* header */}
      <div className="relative flex items-center justify-between">
        <div className="relative h-7 overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={tier.id}
              initial={reduced ? { opacity: 0 } : { y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { y: -24, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-semibold"
              style={{ backgroundColor: `hsl(${tier.hue} 90% 60% / 0.14)`, color: `hsl(${tier.hue} 60% 45%)` }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
              {tier.name}
            </motion.span>
          </AnimatePresence>
        </div>
        <LayoutGroup id={id}>
          <div role="radiogroup" aria-label="Billing period" className="flex rounded-full bg-zinc-100 p-0.5 text-[11px] font-medium dark:bg-white/[0.06]">
            {(['monthly', 'yearly'] as Billing[]).map((b) => (
              <button
                key={b}
                type="button"
                role="radio"
                aria-checked={billing === b}
                onClick={() => setBilling(b)}
                className={cn('relative rounded-full px-3 py-1.5 capitalize outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]', billing === b ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400')}
              >
                {billing === b && <motion.span layoutId="billing-pill" className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-white/10" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
                <span className="relative">{b}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>

      {/* price */}
      <div className="relative mt-6 flex items-end gap-2">
        <div className="text-[52px] font-semibold leading-none tracking-tight text-zinc-900 dark:text-white">
          <span className="mr-0.5 align-top text-[26px] font-medium text-zinc-400">{currency}</span>
          <Odometer value={monthly.toLocaleString('en-US')} reduced={reduced} />
          <span className="sr-only">{`${currency}${monthly.toLocaleString('en-US')} per month`}</span>
        </div>
        <div className="pb-1.5 text-sm text-zinc-500 dark:text-zinc-400">/ month</div>
      </div>
      <div className="relative mt-2 flex h-6 items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span>
          {currency}
          {Math.round(tier.perSeat * mult)} per seat{billing === 'yearly' ? ', billed yearly' : ''}
        </span>
        <AnimatePresence>
          {billing === 'yearly' && (
            <motion.span
              key="save"
              initial={reduced ? { opacity: 0 } : { scale: 0.4, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              className="relative inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2 py-0.5 font-medium text-emerald-700 dark:text-emerald-300"
            >
              <Sparkles className="h-3 w-3" /> Save {currency}
              {saved.toLocaleString('en-US')}/yr
              {!reduced &&
                Array.from({ length: 6 }, (_, i) => (
                  <motion.span
                    key={i}
                    className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-emerald-400"
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{ x: Math.cos((i / 6) * Math.PI * 2) * 34, y: Math.sin((i / 6) * Math.PI * 2) * 16, opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                ))}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* seats */}
      <div className="relative mt-6">
        <div className="flex items-center justify-between">
          <label htmlFor={id + '-seats'} className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Team size
          </label>
          <span className="font-mono text-sm tabular-nums text-zinc-900 dark:text-white">{seats} seats</span>
        </div>
        <div className="mt-3 flex h-8 items-center" aria-hidden>
          <AnimatePresence initial={false}>
            {Array.from({ length: shownAvatars }, (_, i) => (
              <motion.span
                key={i}
                initial={reduced ? { opacity: 0 } : { scale: 0, y: 10 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={reduced ? { opacity: 0 } : { scale: 0, y: 10 }}
                transition={{ type: 'spring', stiffness: 520, damping: 20 }}
                className="-ml-2 grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px] font-semibold text-white ring-2 ring-white first:ml-0 dark:ring-zinc-950"
                style={{ background: `linear-gradient(135deg, hsl(${(i * 47 + 10) % 360} 70% 62%), hsl(${(i * 47 + 50) % 360} 70% 48%))`, zIndex: 20 - i }}
              >
                {NAMES[i % NAMES.length].slice(0, 2)}
              </motion.span>
            ))}
          </AnimatePresence>
          <AnimatePresence>
            {seats > shownAvatars && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="-ml-2 grid h-8 min-w-8 place-items-center rounded-full bg-zinc-100 px-2 text-[10px] font-semibold text-zinc-600 ring-2 ring-white dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-950"
              >
                +{seats - shownAvatars}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="relative mt-4 h-6">
          <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <motion.div className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full" style={{ width: `${pct}%` }} animate={{ backgroundColor: accent }} />
          {sorted.slice(1).map((t) => (
            <span
              key={t.id}
              aria-hidden
              className={cn('absolute top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-full transition-colors', seats >= t.minSeats ? 'bg-white/90 dark:bg-zinc-950/80' : 'bg-zinc-300 dark:bg-zinc-700')}
              style={{ left: `${posFromSeats(t.minSeats) / 10}%` }}
            />
          ))}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_2px_6px_rgb(0_0_0/0.25)] ring-4"
            style={{ left: `${pct}%` }}
            animate={{ ['--tw-ring-color' as string]: `hsl(${tier.hue} 80% 60% / 0.35)` }}
          />
          <input
            id={id + '-seats'}
            type="range"
            min={0}
            max={1000}
            step={1}
            value={Math.round(posFromSeats(seats))}
            onChange={(e) => setSeats(seatsFromPos(Number(e.target.value)))}
            onKeyDown={(e) => {
              const d = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 10, PageDown: -10 }[e.key]
              if (d) {
                e.preventDefault()
                setSeats(seats + d * (e.shiftKey ? 10 : 1))
              } else if (e.key === 'Home') {
                e.preventDefault()
                setSeats(1)
              } else if (e.key === 'End') {
                e.preventDefault()
                setSeats(maxSeats)
              }
            }}
            aria-valuetext={`${seats} seats, ${tier.name} plan`}
            className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <span aria-hidden className="pointer-events-none absolute -inset-x-2 inset-y-0 rounded-full opacity-0 ring-2 ring-[color:var(--accent)]/40 peer-focus-visible:opacity-100" />
        </div>
        <div className="relative mt-1.5 h-4 text-[10px] uppercase tracking-[0.14em] text-zinc-400">
          {sorted.map((t, k) => (
            <button key={t.id} type="button" onClick={() => setSeats(t.minSeats)} style={{ left: `${((k + 0.5) / segs) * 100}%` }} className={cn('absolute -translate-x-1/2 rounded px-0.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]', t.id === tier.id && 'text-zinc-800 dark:text-zinc-100')}>
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* features */}
      <ul className="relative mt-5 space-y-1.5 border-t border-dashed border-black/10 pt-4 dark:border-white/10">
        <AnimatePresence initial={false}>
          {unlocked.slice(-6).map(({ f, ti }) => (
            <motion.li
              key={f}
              layout={!reduced}
              initial={reduced ? { opacity: 0 } : { opacity: 0, x: -14, backgroundColor: `hsl(${tier.hue} 90% 60% / 0.18)` }}
              animate={{ opacity: 1, x: 0, backgroundColor: `hsl(${tier.hue} 90% 60% / 0)` }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, x: 14 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28, backgroundColor: { duration: 1.2 } }}
              className="-mx-2 flex items-center gap-2 rounded-lg px-2 py-0.5 text-[13px] text-zinc-700 dark:text-zinc-300"
            >
              <Check className="h-3.5 w-3.5 shrink-0" style={{ color: `hsl(${sorted[ti].hue} 70% 55%)` }} strokeWidth={3} />
              {f}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <button
        type="button"
        onClick={checkout}
        className={cn(
          'group relative mt-5 inline-flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl text-sm font-medium text-white outline-none transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--accent)] dark:focus-visible:ring-offset-zinc-950',
          state === 'error' ? 'bg-rose-500' : state === 'done' ? 'bg-emerald-500' : 'bg-zinc-900 dark:bg-white dark:text-zinc-900',
        )}
      >
        {state === 'idle' && !reduced && (
          <motion.span
            aria-hidden
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent dark:via-black/10"
            animate={{ x: ['-150%', '350%'] }}
            transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut' }}
          />
        )}
        {state === 'busy' ? <Loader2 className="h-4 w-4 animate-spin" /> : state === 'done' ? <Check className="h-4 w-4" /> : state === 'error' ? <RotateCcw className="h-4 w-4" /> : null}
        <span className="relative">
          {state === 'busy' ? 'Reserving seats…' : state === 'done' ? `${tier.name} is ready for ${seats}` : state === 'error' ? 'Checkout failed — retry' : `Start with ${tier.name}`}
        </span>
        {state === 'idle' && <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
      </button>
      <p className="sr-only" aria-live="polite">
        {state === 'done' ? 'Checkout complete.' : state === 'error' ? 'Checkout failed. Press to retry.' : ''}
      </p>
    </div>
  )
}
