import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Mode = 'idle' | 'listen' | 'speak'

/** Mercury / liquid-metal ball with traveling highlight; morphs when speaking. */
export function LiquidMetalOrb({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [mode, setMode] = React.useState<Mode>('idle')
  const modes: Mode[] = ['idle', 'listen', 'speak']

  const cycle = () => setMode((m) => modes[(modes.indexOf(m) + 1) % modes.length])

  return (
    <div className={cn('flex w-full max-w-sm flex-col items-center gap-5', className)}>
      <button type="button" onClick={cycle} className="relative h-[200px] w-[200px]" aria-label={`Liquid metal orb · ${mode}. Click to cycle.`}>
        <motion.div
          className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 32% 28%, #f8fafc 0%, #cbd5e1 28%, #64748b 55%, #1e293b 100%)',
            boxShadow:
              'inset -18px -24px 40px rgba(0,0,0,0.55), inset 10px 12px 24px rgba(255,255,255,0.35), 0 20px 50px rgba(0,0,0,0.45)',
          }}
          animate={
            reduced
              ? undefined
              : mode === 'speak'
                ? { borderRadius: ['50%', '46% 54% 48% 52%', '52% 48% 54% 46%', '50%'], scale: [1, 1.05, 0.98, 1.03, 1] }
                : mode === 'listen'
                  ? { scale: [1, 1.04, 1], borderRadius: '50%' }
                  : { scale: [1, 1.01, 1], borderRadius: '50%' }
          }
          transition={{ duration: mode === 'speak' ? 1.1 : 2.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            className="absolute h-16 w-10 rounded-full opacity-70"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.85), transparent)',
              filter: 'blur(2px)',
              left: '22%',
              top: '18%',
            }}
            animate={reduced ? undefined : { x: [0, 40, 10, 0], y: [0, 10, 30, 0], rotate: [0, 20, -10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-[18%] right-[20%] h-8 w-14 rounded-full opacity-40"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.5), transparent)', filter: 'blur(3px)' }}
            animate={reduced ? undefined : { opacity: [0.25, 0.5, 0.25] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          />
        </motion.div>
        {mode === 'speak' && !reduced && (
          <>
            {[0, 1].map((i) => (
              <motion.span
                key={i}
                className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-300/40"
                animate={{ scale: [1, 1.45], opacity: [0.45, 0] }}
                transition={{ repeat: Infinity, duration: 1.3, delay: i * 0.4 }}
              />
            ))}
          </>
        )}
      </button>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">{mode} · click to cycle</p>
      <div className="flex gap-2">
        {modes.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition',
              mode === m ? 'bg-slate-400/30 text-slate-900 dark:text-slate-100 ring-1 ring-slate-300/40' : 'bg-zinc-900/[0.04] dark:bg-white/5 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-900/[0.06] dark:hover:bg-white/10',
            )}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  )
}
