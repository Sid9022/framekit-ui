import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** 24h messaging session window countdown ring with urgency color shift. */
export function SessionWindowTimer({
  totalSeconds = 24 * 3600,
  remainingSeconds: remainingProp,
  className,
}: {
  totalSeconds?: number
  remainingSeconds?: number
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const [remaining, setRemaining] = React.useState(remainingProp ?? 3 * 3600 + 24 * 60 + 18)

  React.useEffect(() => {
    if (remainingProp != null) return
    const id = window.setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000)
    return () => clearInterval(id)
  }, [remainingProp])

  const pct = remaining / totalSeconds
  const urgent = pct < 0.15
  const warn = pct < 0.35
  const r = 42
  const c = 2 * Math.PI * r
  const dash = c * pct

  const h = Math.floor(remaining / 3600)
  const m = Math.floor((remaining % 3600) / 60)
  const s = remaining % 60
  const pad = (n: number) => String(n).padStart(2, '0')

  const stroke = urgent ? '#f97316' : warn ? '#eab308' : '#9a86b8'

  return (
    <div className={cn('flex w-full max-w-xs flex-col items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950', className)}>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">Session window</p>
      <div className="relative h-28 w-28">
        <svg viewBox="0 0 100 100" className="-rotate-90 h-full w-full">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(154,134,184,0.15)" strokeWidth="8" />
          <motion.circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
            animate={reduced || !urgent ? undefined : { opacity: [1, 0.55, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{ filter: `drop-shadow(0 0 6px ${stroke}88)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-mono text-lg font-bold tabular-nums', urgent ? 'text-framekit-500' : 'text-zinc-800 dark:text-zinc-100')}>
            {pad(h)}:{pad(m)}:{pad(s)}
          </span>
          <span className="font-mono text-[8px] uppercase tracking-wider text-zinc-500">remaining</span>
        </div>
      </div>
      <p className="text-center text-xs text-zinc-500">
        {urgent ? 'Window closing — reply soon' : warn ? 'Under 8 hours left' : 'Customer can still message freely'}
      </p>
    </div>
  )
}
