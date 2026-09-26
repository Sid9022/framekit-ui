import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

const METRICS = [
  { id: 'queue', label: 'Queue', value: 62, color: '#b9aad0' },
  { id: 'sla', label: 'SLA', value: 91, color: '#34d399' },
  { id: 'cap', label: 'Capacity', value: 74, color: '#fb923c' },
]

/** Cluster of animated progress rings (queue / SLA / capacity). */
export function RingProgressCluster({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [vals, setVals] = React.useState(METRICS.map((m) => m.value))

  React.useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      setVals((vs) => vs.map((v) => Math.max(40, Math.min(98, v + (Math.random() * 6 - 3)))))
    }, 1800)
    return () => clearInterval(id)
  }, [reduced])

  return (
    <div
      className={cn(
        'flex w-full max-w-md items-center justify-around gap-2 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950',
        className,
      )}
    >
      {METRICS.map((m, i) => {
        const r = 28
        const c = 2 * Math.PI * r
        const pct = vals[i] / 100
        return (
          <div key={m.id} className="flex flex-col items-center gap-1">
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r={r} fill="none" stroke="currentColor" className="text-zinc-100 dark:text-zinc-800" strokeWidth="6" />
              <motion.circle
                cx="36"
                cy="36"
                r={r}
                fill="none"
                stroke={m.color}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={c}
                animate={{ strokeDashoffset: c * (1 - pct) }}
                transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 100, damping: 18 }}
                transform="rotate(-90 36 36)"
              />
              <text x="36" y="40" textAnchor="middle" className="fill-zinc-900 text-sm font-semibold dark:fill-zinc-50">
                {Math.round(vals[i])}%
              </text>
            </svg>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">{m.label}</p>
          </div>
        )
      })}
    </div>
  )
}
