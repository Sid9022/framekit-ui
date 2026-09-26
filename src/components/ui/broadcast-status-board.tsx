import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

const ROWS = [
  { key: 'queued', label: 'Queued', color: 'text-zinc-500 dark:text-zinc-400', target: 1280 },
  { key: 'sent', label: 'Sent', color: 'text-sky-400', target: 1104 },
  { key: 'delivered', label: 'Delivered', color: 'text-signal-600 dark:text-signal-300', target: 986 },
  { key: 'read', label: 'Read', color: 'text-emerald-400', target: 742 },
  { key: 'failed', label: 'Failed', color: 'text-rose-400', target: 18 },
] as const

/** Mini campaign status board with animated counters. */
export function BroadcastStatusBoard({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [counts, setCounts] = React.useState(() => Object.fromEntries(ROWS.map((r) => [r.key, 0])) as Record<string, number>)

  React.useEffect(() => {
    if (reduced) {
      setCounts(Object.fromEntries(ROWS.map((r) => [r.key, r.target])) as Record<string, number>)
      return
    }
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1400)
      const ease = 1 - Math.pow(1 - t, 3)
      setCounts(Object.fromEntries(ROWS.map((r) => [r.key, Math.round(r.target * ease)])) as Record<string, number>)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  return (
    <div className={cn('w-full max-w-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0a12] p-4 text-zinc-900 dark:text-zinc-50', className)}>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Spring launch</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-500">Broadcast · live</p>
        </div>
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
      </div>
      <ul className="space-y-2">
        {ROWS.map((r) => (
          <li key={r.key} className="flex items-center justify-between rounded-xl bg-zinc-900/[0.04] dark:bg-white/5 px-3 py-2">
            <span className={cn('text-xs font-medium', r.color)}>{r.label}</span>
            <motion.span className="font-mono text-sm tabular-nums" layout>
              {counts[r.key].toLocaleString()}
            </motion.span>
          </li>
        ))}
      </ul>
    </div>
  )
}
