import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Animated semicircle gauge for delivery rate / ASR / concurrent calls. */
export function LiveMeterDial({
  label = 'Delivery rate',
  value = 94,
  max = 100,
  unit = '%',
  className,
}: {
  label?: string
  value?: number
  max?: number
  unit?: string
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const [live, setLive] = React.useState(value)
  const pct = Math.max(0, Math.min(1, live / max))
  const r = 54
  const circ = Math.PI * r

  React.useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      setLive((v) => {
        const next = v + (Math.random() * 4 - 2)
        return Math.max(70, Math.min(99, next))
      })
    }, 1200)
    return () => clearInterval(id)
  }, [reduced])

  return (
    <div
      className={cn(
        'flex w-full max-w-[220px] flex-col items-center rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950',
        className,
      )}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400">{label}</p>
      <svg viewBox="0 0 140 90" className="mt-2 w-full">
        <path
          d="M 16 78 A 54 54 0 0 1 124 78"
          fill="none"
          stroke="currentColor"
          className="text-zinc-200 dark:text-zinc-800"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <motion.path
          d="M 16 78 A 54 54 0 0 1 124 78"
          fill="none"
          stroke="url(#fkDial)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          animate={{ strokeDashoffset: circ * (1 - pct) }}
          transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 20 }}
        />
        <defs>
          <linearGradient id="fkDial" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#d4cbe5" />
            <stop offset="100%" stopColor="#7d6899" />
          </linearGradient>
        </defs>
        <text x="70" y="72" textAnchor="middle" className="fill-zinc-900 text-2xl font-semibold dark:fill-zinc-50">
          {Math.round(live)}
          <tspan className="text-sm fill-zinc-400">{unit}</tspan>
        </text>
      </svg>
    </div>
  )
}
