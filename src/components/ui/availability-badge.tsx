import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type AvailabilityStatus = 'open' | 'limited' | 'booked'

export type AvailabilityBadgeProps = {
  status?: AvailabilityStatus
  /** Override the copy per status. */
  labels?: Partial<Record<AvailabilityStatus, { title: string; detail: string }>>
  /** IANA time zone — shows a live local clock (e.g. 'Europe/Lisbon'). Omit to hide. */
  timeZone?: string
  className?: string
}

const DEFAULT_LABELS: Record<AvailabilityStatus, { title: string; detail: string }> = {
  open: { title: 'Open to work', detail: 'Booking projects from November' },
  limited: { title: 'Limited availability', detail: 'One slot left this quarter' },
  booked: { title: 'Fully booked', detail: 'Waitlist open for January' },
}

const TONE: Record<AvailabilityStatus, { pill: string; dot: string; ring: string }> = {
  open: { pill: 'border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-500/40 dark:bg-emerald-950/50 dark:text-emerald-50', dot: 'bg-emerald-500', ring: 'bg-emerald-500' },
  limited: { pill: 'border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-500/40 dark:bg-amber-950/50 dark:text-amber-50', dot: 'bg-amber-500', ring: 'bg-amber-500' },
  booked: { pill: 'border-rose-300 bg-rose-50 text-rose-950 dark:border-rose-500/40 dark:bg-rose-950/50 dark:text-rose-50', dot: 'bg-rose-500', ring: 'bg-rose-500' },
}

function useClock(tz?: string) {
  const [t, setT] = React.useState('')
  React.useEffect(() => {
    if (!tz) return
    let f: Intl.DateTimeFormat
    try { f = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz, timeZoneName: 'short' }) } catch { return }
    const tick = () => setT(f.format(new Date()))
    tick()
    const id = window.setInterval(tick, 15000)
    return () => window.clearInterval(id)
  }, [tz])
  return t
}

/**
 * Availability Badge — a status pill with its own motion language per state: “open” sends two staggered radar
 * ripples, “limited” breathes slowly, “booked” holds perfectly still. Copy swaps on a vertical spring and an optional
 * local clock ticks beside it.
 */
export function AvailabilityBadge({ status = 'open', labels, timeZone, className }: AvailabilityBadgeProps) {
  const reduced = usePrefersReducedMotion()
  const L = { ...DEFAULT_LABELS, ...labels }[status] ?? DEFAULT_LABELS[status]
  const tone = TONE[status]
  const clock = useClock(timeZone)
  return (
    <div role="status" aria-live="polite" className={cn('inline-flex max-w-full items-center gap-3 rounded-full border py-2 pl-3.5 pr-4 text-left transition-colors duration-500', tone.pill, className)}>
      <span className="relative grid h-3 w-3 shrink-0 place-items-center" aria-hidden>
        {!reduced && status === 'open' && [0, 1].map((k) => <motion.span key={k} className={cn('absolute inset-0 rounded-full', tone.ring)} animate={{ scale: [1, 3.2], opacity: [0.55, 0] }} transition={{ duration: 2.1, repeat: Infinity, delay: k * 1.05, ease: 'easeOut' }} />)}
        {!reduced && status === 'limited' && <motion.span className={cn('absolute inset-0 rounded-full', tone.ring)} animate={{ scale: [1, 2.2, 1], opacity: [0.35, 0, 0.35] }} transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }} />}
        <motion.span key={status} className={cn('relative h-3 w-3 rounded-full', tone.dot)} initial={reduced ? false : { scale: 0.3 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 16 }} />
      </span>
      <span className="relative grid min-w-0 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={status} className="flex flex-col leading-tight" initial={reduced ? { opacity: 0 } : { y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduced ? { opacity: 0 } : { y: -18, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }}>
            <span className="text-sm font-semibold">{L.title}</span>
            <span className="text-xs opacity-90">{L.detail}</span>
          </motion.span>
        </AnimatePresence>
      </span>
      {clock && <span className="ml-1 hidden border-l border-current/20 pl-3 font-mono text-xs tabular-nums opacity-90 sm:block"><span className="sr-only">Local time </span>{clock}</span>}
    </div>
  )
}
