import * as React from 'react'
import { motion } from 'motion/react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

function buildSpark(seed = 42) {
  const pts: number[] = []
  let v = 40
  let s = seed
  for (let i = 0; i < 24; i++) {
    s = (s * 16807) % 2147483647
    v = Math.max(8, Math.min(92, v + ((s % 17) - 8)))
    pts.push(v)
  }
  return pts
}

/** KPI ticker + mini sparkline that draws on mount; trend delta pill. */
export function KpiSparkWidget({
  label = 'Messages delivered',
  value = 128470,
  delta = 12.4,
  className,
}: {
  label?: string
  value?: number
  delta?: number
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const spark = React.useMemo(() => buildSpark(), [])
  const [display, setDisplay] = React.useState(reduced ? value : 0)
  const path = React.useMemo(() => {
    const w = 160
    const h = 48
    return spark
      .map((y, i) => {
        const x = (i / (spark.length - 1)) * w
        const yy = h - (y / 100) * h
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${yy.toFixed(1)}`
      })
      .join(' ')
  }, [spark])

  React.useEffect(() => {
    if (reduced) {
      setDisplay(value)
      return
    }
    const start = performance.now()
    const dur = 900
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(value * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, reduced])

  const up = delta >= 0

  return (
    <div
      className={cn(
        'w-full max-w-xs rounded-2xl border border-zinc-200 bg-gradient-to-b from-white to-zinc-50 p-4 shadow-[0_22px_50px_-28px_rgba(53,43,66,0.4)] dark:border-zinc-800 dark:from-zinc-950 dark:to-[#121018]',
        className,
      )}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">{label}</p>
      <div className="mt-1 flex items-end justify-between gap-3">
        <p className="text-3xl font-semibold tracking-tight tabular-nums">{display.toLocaleString()}</p>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
            up ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
          )}
        >
          {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {up ? '+' : ''}
          {delta}%
        </span>
      </div>
      <svg viewBox="0 0 160 48" className="mt-3 h-14 w-full overflow-visible">
        <motion.path
          d={path}
          fill="none"
          stroke="url(#fkSpark)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reduced ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="fkSpark" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#b9aad0" />
            <stop offset="100%" stopColor="#7d6899" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
