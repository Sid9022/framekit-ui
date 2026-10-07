import * as React from 'react'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type ActivityRing = { label: string; value: number; goal: number; unit: string; from: string; to: string; track: string }

export type ActivityRingsProps = {
  rings?: ActivityRing[]
  /** Diameter in px. */
  size?: number
  /** Stroke width in px. */
  stroke?: number
  /** Show the legend with numbers. */
  showLegend?: boolean
  className?: string
}

export const DEFAULT_RINGS: ActivityRing[] = [
  { label: 'Move', value: 486, goal: 420, unit: 'KCAL', from: '#ff2d55', to: '#ff6b8b', track: 'rgb(255 45 85 / 0.18)' },
  { label: 'Exercise', value: 24, goal: 30, unit: 'MIN', from: '#7cfc00', to: '#c4ff4d', track: 'rgb(124 252 0 / 0.18)' },
  { label: 'Stand', value: 9, goal: 12, unit: 'HRS', from: '#00d4ff', to: '#6ff0ff', track: 'rgb(0 212 255 / 0.18)' },
]

/**
 * Activity Rings — Apple Watch-style concentric progress rings. Each ring
 * sweeps in on a spring with a gradient stroke; going past 100% laps over
 * itself with a shadowed tip. Numbers roll up beside it.
 */
export function ActivityRings({ rings = DEFAULT_RINGS, size = 200, stroke = 20, showLegend = true, className }: ActivityRingsProps) {
  const id = React.useId().replace(/:/g, '')
  const gap = 4
  return (
    <figure className={cn('flex flex-col items-center gap-6 sm:flex-row sm:gap-10', className)}>
      <div className="rounded-full bg-zinc-950 p-3 shadow-[0_1px_2px_rgb(0_0_0/0.1),0_24px_48px_-24px_rgb(0_0_0/0.5)] ring-1 ring-white/[0.06]">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={rings.map((r) => `${r.label} ${r.value} of ${r.goal} ${r.unit.toLowerCase()}`).join(', ')}>
          <defs>
            {rings.map((r, i) => (
              <linearGradient key={i} id={`${id}-g${i}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={r.from} /><stop offset="1" stopColor={r.to} /></linearGradient>
            ))}
            <filter id={`${id}-tip`} x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="2" floodOpacity="0.6" /></filter>
          </defs>
          {rings.map((r, i) => {
            const radius = size / 2 - stroke / 2 - i * (stroke + gap)
            return radius > stroke / 2 ? <Ring key={r.label} r={r} i={i} radius={radius} stroke={stroke} size={size} gid={`${id}-g${i}`} tip={`${id}-tip`} /> : null
          })}
        </svg>
      </div>
      {showLegend && (
        <figcaption className="grid gap-3">
          {rings.map((r, i) => <Legend key={r.label} r={r} delay={i * 0.12} />)}
        </figcaption>
      )}
    </figure>
  )
}

function Ring({ r, i, radius, stroke, size, gid, tip }: { r: ActivityRing; i: number; radius: number; stroke: number; size: number; gid: string; tip: string }) {
  const reduced = usePrefersReducedMotion()
  const p = useMotionValue(0)
  const target = r.value / r.goal
  React.useEffect(() => {
    if (reduced) { p.set(target); return }
    const c = animate(p, target, { type: 'spring', stiffness: 40, damping: 14, delay: 0.15 + i * 0.12 })
    return () => c.stop()
  }, [target, reduced, p, i])
  const C = 2 * Math.PI * radius
  const first = useTransform(p, (v) => C * (1 - Math.min(v, 1)))
  const lap = useTransform(p, (v) => C * (1 - Math.max(0, Math.min(v - 1, 1))))
  const tipRot = useTransform(p, (v) => v * 360 - 90)
  const tipOpacity = useTransform(p, (v) => (v > 0.98 ? 1 : 0))
  const cx = size / 2
  return (
    <g>
      <circle cx={cx} cy={cx} r={radius} fill="none" stroke={r.track} strokeWidth={stroke} />
      <motion.circle cx={cx} cy={cx} r={radius} fill="none" stroke={`url(#${gid})`} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={C} style={{ strokeDashoffset: first }} transform={`rotate(-90 ${cx} ${cx})`} />
      <motion.circle cx={cx} cy={cx} r={radius} fill="none" stroke={r.to} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={C} style={{ strokeDashoffset: lap }} transform={`rotate(-90 ${cx} ${cx})`} />
      <motion.g style={{ rotate: tipRot, opacity: tipOpacity, originX: `${cx}px`, originY: `${cx}px` }}>
        <circle cx={cx + radius} cy={cx} r={stroke / 2} fill={r.to} filter={`url(#${tip})`} />
      </motion.g>
    </g>
  )
}

function Legend({ r, delay }: { r: ActivityRing; delay: number }) {
  const reduced = usePrefersReducedMotion()
  const [n, setN] = React.useState(reduced ? r.value : 0)
  React.useEffect(() => {
    if (reduced) { setN(r.value); return }
    const c = animate(0, r.value, { duration: 1.2, delay: 0.15 + delay, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [r.value, reduced, delay])
  return (
    <div>
      <div className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">{r.label}</div>
      <div className="font-mono text-2xl font-semibold tabular-nums tracking-tight" style={{ color: r.from }}>
        <span className="text-zinc-900 dark:text-white">{n}</span><span className="text-zinc-500 dark:text-zinc-400">/{r.goal}</span>
        <span className="ml-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">{r.unit}</span>
      </div>
      <div className="mt-1 h-1 w-32 rounded-full bg-black/[0.06] dark:bg-white/10" aria-hidden><div className="h-full rounded-full" style={{ width: `${Math.min(100, (r.value / r.goal) * 100)}%`, background: `linear-gradient(90deg, ${r.from}, ${r.to})` }} /></div>
    </div>
  )
}
