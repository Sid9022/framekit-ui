import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type AgentState = 'listening' | 'thinking' | 'speaking'

const LABELS: Record<AgentState, string> = {
  listening: 'Listening',
  thinking: 'Thinking',
  speaking: 'Speaking',
}

const ORDER: AgentState[] = ['listening', 'thinking', 'speaking']

/** Listening / thinking / speaking orb; click cycles states. */
export function AgentStateOrb({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [state, setState] = React.useState<AgentState>('listening')

  const cycle = () => setState((s) => ORDER[(ORDER.indexOf(s) + 1) % ORDER.length])

  const anim =
    reduced
      ? { scale: 1 }
      : state === 'listening'
        ? { scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }
        : state === 'thinking'
          ? { rotate: [0, 360], scale: [1, 0.96, 1] }
          : { scale: [1, 1.12, 0.96, 1.08, 1] }

  const transition =
    reduced
      ? undefined
      : state === 'thinking'
        ? { rotate: { repeat: Infinity, duration: 3, ease: 'linear' as const }, scale: { repeat: Infinity, duration: 1.6 } }
        : { repeat: Infinity, duration: state === 'speaking' ? 0.9 : 2.2, ease: 'easeInOut' as const }

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <button type="button" onClick={cycle} className="relative" aria-label={`Agent state: ${state}. Click to cycle.`}>
        <motion.div
          className={cn(
            'h-28 w-28 rounded-full',
            state === 'listening' && 'bg-gradient-to-br from-sky-300 to-signal-500',
            state === 'thinking' && 'bg-gradient-to-br from-violet-400 to-signal-700',
            state === 'speaking' && 'bg-gradient-to-br from-emerald-300 to-teal-600',
          )}
          animate={anim}
          transition={transition}
          style={{
            boxShadow:
              state === 'listening'
                ? '0 0 40px rgba(125,104,153,0.55)'
                : state === 'thinking'
                  ? '0 0 40px rgba(139,92,246,0.5)'
                  : '0 0 48px rgba(52,211,153,0.55)',
          }}
        />
        {!reduced && state === 'speaking' && (
          <>
            {[0, 1].map((i) => (
              <motion.span
                key={i}
                className="pointer-events-none absolute inset-0 rounded-full border border-emerald-300/50"
                animate={{ scale: [1, 1.45], opacity: [0.5, 0] }}
                transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.45 }}
              />
            ))}
          </>
        )}
      </button>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">{LABELS[state]} · click to cycle</p>
    </div>
  )
}
