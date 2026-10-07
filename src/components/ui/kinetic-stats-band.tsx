import * as React from 'react'
import { animate, motion, useInView, useMotionValue, useTransform } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type KineticStat = { value: number; prefix?: string; suffix?: string; decimals?: number; label: string; spark?: number[] }

export type KineticStatsBandProps = { stats?: KineticStat[]; duration?: number; className?: string }

export const DEFAULT_KINETIC_STATS: KineticStat[] = [
  { value: 99.99, suffix: '%', decimals: 2, label: 'Uptime, last 12 months', spark: [6, 7, 7, 8, 8, 9, 9, 9, 10, 10] },
  { value: 4.2, suffix: 'B', decimals: 1, label: 'Requests served monthly', spark: [2, 3, 3, 4, 5, 5, 6, 8, 9, 10] },
  { value: 38, suffix: 'ms', label: 'Median edge latency', spark: [10, 9, 8, 8, 7, 6, 6, 5, 4, 4] },
  { value: 120, suffix: '+', label: 'Regions worldwide', spark: [1, 2, 3, 4, 4, 5, 7, 8, 9, 10] },
]

/**
 * Kinetic Stats Band — a row of big numbers that count up on an eased curve
 * when scrolled into view, with a digit-column blur on the fast part, a
 * sparkline that draws itself and hairline dividers that grow in.
 */
export function KineticStatsBand({ stats = DEFAULT_KINETIC_STATS, duration = 1.8, className }: KineticStatsBandProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  return (
    <div ref={ref} className={cn('grid w-full grid-cols-2 overflow-hidden rounded-[24px] bg-white ring-1 ring-black/[0.06] lg:grid-cols-4 dark:bg-zinc-950 dark:ring-white/[0.08]', className)}>
      {stats.map((s, i) => <Stat key={i} s={s} i={i} run={inView} duration={duration} />)}
    </div>
  )
}

function Stat({ s, i, run, duration }: { s: KineticStat; i: number; run: boolean; duration: number }) {
  const reduced = usePrefersReducedMotion()
  const v = useMotionValue(0)
  const text = useTransform(v, (n) => n.toLocaleString('en-US', { minimumFractionDigits: s.decimals ?? 0, maximumFractionDigits: s.decimals ?? 0 }))
  const blur = useMotionValue(0)
  const filter = useTransform(blur, (b) => `blur(${b}px)`)
  React.useEffect(() => {
    if (!run) return
    if (reduced) { v.set(s.value); return }
    const c = animate(v, s.value, { duration, delay: i * 0.12, ease: [0.16, 1, 0.3, 1], onUpdate: (n) => blur.set(Math.max(0, 2.5 * (1 - n / s.value) - 0.3)) })
    return () => c.stop()
  }, [run, reduced, s.value, duration, i, v, blur])
  const pts = s.spark ?? []
  const max = Math.max(...pts, 1)
  const d = pts.map((p, j) => `${j ? 'L' : 'M'}${(j / Math.max(1, pts.length - 1)) * 100},${28 - (p / max) * 24}`).join(' ')
  return (
    <div className={cn('relative p-6 sm:p-8', i % 2 === 1 && 'border-l border-black/[0.06] dark:border-white/[0.08]', i >= 2 && 'border-t border-black/[0.06] lg:border-t-0 dark:border-white/[0.08]', i > 0 && 'lg:border-l')}>
      <p className="flex items-baseline text-3xl font-semibold tabular-nums tracking-[-0.04em] text-zinc-950 sm:text-5xl dark:text-white" aria-label={`${s.prefix ?? ''}${s.value}${s.suffix ?? ''}`}>
        <span aria-hidden>{s.prefix}</span><motion.span aria-hidden style={{ filter }}>{text}</motion.span><span aria-hidden className="ml-0.5 text-[0.55em] font-medium text-zinc-500 dark:text-zinc-400">{s.suffix}</span>
      </p>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{s.label}</p>
      {pts.length > 1 && (
        <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="mt-4 h-8 w-full overflow-visible" aria-hidden>
          <motion.path d={d} fill="none" stroke="currentColor" strokeWidth={1.5} vectorEffect="non-scaling-stroke" strokeLinecap="round" className="text-indigo-600 dark:text-indigo-400"
            initial={{ pathLength: reduced ? 1 : 0 }} animate={run ? { pathLength: 1 } : undefined} transition={{ duration: duration * 0.9, delay: i * 0.12 + 0.2, ease: [0.16, 1, 0.3, 1] }} />
        </svg>
      )}
    </div>
  )
}
