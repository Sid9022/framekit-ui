import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Animated audio waveform bars reacting to simulated level; latency chip. */
export function VoiceWaveformLane({
  bars = 28,
  latencyMs = 142,
  className,
}: {
  bars?: number
  latencyMs?: number
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const [level, setLevel] = React.useState(0.45)
  const [heights, setHeights] = React.useState(() => Array.from({ length: bars }, () => 0.3))

  React.useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      setLevel(0.25 + Math.random() * 0.7)
    }, 180)
    return () => clearInterval(id)
  }, [reduced])

  React.useEffect(() => {
    setHeights((hs) => hs.map((_, i) => {
      const wave = Math.sin(i * 0.45 + level * 8) * 0.5 + 0.5
      return Math.max(0.12, Math.min(1, wave * level + Math.random() * 0.15))
    }))
  }, [level])

  return (
    <div
      className={cn(
        'flex w-full max-w-md flex-col gap-3 rounded-2xl border border-zinc-200 bg-zinc-950 p-4 text-zinc-50 dark:border-zinc-800',
        className,
      )}
      onPointerMove={(e) => {
        if (reduced) return
        const rect = e.currentTarget.getBoundingClientRect()
        setLevel(0.2 + ((e.clientX - rect.left) / rect.width) * 0.8)
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Voice lane</p>
        <span className="rounded-full bg-signal-500/25 px-2.5 py-0.5 font-mono text-[10px] text-signal-200">
          {latencyMs} ms RTT
        </span>
      </div>
      <div className="flex h-20 items-end justify-between gap-0.5">
        {heights.map((h, i) => (
          <motion.span
            key={i}
            className="flex-1 rounded-full bg-gradient-to-t from-signal-700 to-signal-300"
            animate={{ height: `${h * 100}%` }}
            transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 22 }}
          />
        ))}
      </div>
      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-500">Move pointer to drive level</p>
    </div>
  )
}
