import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Mode = 'idle' | 'listen' | 'speak'

/** Translucent shell with inner aurora ribbons; listen expands outer glow rings. */
export function AuroraCoreOrb({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [mode, setMode] = React.useState<Mode>('listen')
  const modes: Mode[] = ['idle', 'listen', 'speak']

  return (
    <div className={cn('flex w-full max-w-sm flex-col items-center gap-5', className)}>
      <div className="relative flex h-[220px] w-[220px] items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute rounded-full border border-signal-400/30"
            style={{ width: 140 + i * 28, height: 140 + i * 28 }}
            animate={
              reduced
                ? undefined
                : mode === 'listen'
                  ? { scale: [1, 1.08, 1], opacity: [0.25, 0.55, 0.25] }
                  : mode === 'speak'
                    ? { scale: [1, 1.12, 1], opacity: [0.3, 0.7, 0.3] }
                    : { scale: 1, opacity: 0.2 }
            }
            transition={{ duration: 2.2 + i * 0.35, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
          />
        ))}
        <div
          className="relative h-32 w-32 overflow-hidden rounded-full"
          style={{
            background: 'radial-gradient(circle at 40% 30%, rgba(255,255,255,0.2), rgba(30,20,50,0.4) 50%, rgba(10,8,20,0.85))',
            boxShadow: 'inset 0 0 30px rgba(167,139,250,0.35), 0 0 40px rgba(139,92,246,0.3)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <motion.div
            className="absolute -left-4 top-2 h-24 w-40 rounded-full opacity-70"
            style={{ background: 'linear-gradient(90deg, transparent, #67e8f9, #a78bfa, transparent)', filter: 'blur(10px)' }}
            animate={reduced ? undefined : { x: [-20, 30, -20], y: [0, 10, 0], rotate: [0, 15, 0] }}
            transition={{ duration: mode === 'speak' ? 2.2 : 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -right-6 bottom-0 h-20 w-36 rounded-full opacity-60"
            style={{ background: 'linear-gradient(90deg, transparent, #f472b6, #fb923c, transparent)', filter: 'blur(12px)' }}
            animate={reduced ? undefined : { x: [10, -30, 10], y: [0, -8, 0] }}
            transition={{ duration: mode === 'speak' ? 1.8 : 4.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute left-4 top-10 h-16 w-28 rounded-full opacity-50"
            style={{ background: 'linear-gradient(90deg, transparent, #34d399, #60a5fa, transparent)', filter: 'blur(8px)' }}
            animate={reduced ? undefined : { x: [-8, 18, -8], rotate: [0, -12, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
      <div className="flex gap-2">
        {modes.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition',
              mode === m ? 'bg-signal-500/30 text-signal-100 ring-1 ring-signal-400/50' : 'bg-white/5 text-zinc-400 hover:bg-white/10',
            )}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  )
}
