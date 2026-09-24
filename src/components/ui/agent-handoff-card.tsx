import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { Headphones, Bot } from 'lucide-react'

/** Bot → human handoff card with agent avatar bloom and connecting state. */
export function AgentHandoffCard({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = React.useState<'bot' | 'connecting' | 'connected'>('bot')

  React.useEffect(() => {
    if (phase !== 'connecting') return
    const id = window.setTimeout(() => setPhase('connected'), 2200)
    return () => clearTimeout(id)
  }, [phase])

  return (
    <div className={cn('w-full max-w-sm overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-950', className)}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <motion.div
            className="flex h-12 w-12 items-center justify-center rounded-full bg-signal-500/20 text-signal-700 dark:text-signal-200"
            animate={
              reduced
                ? undefined
                : phase === 'connecting'
                  ? { scale: [1, 1.08, 1] }
                  : phase === 'connected'
                    ? { scale: 1 }
                    : { scale: [1, 1.02, 1] }
            }
            transition={{ duration: 1.4, repeat: phase === 'connecting' ? Infinity : 0 }}
            style={
              phase !== 'bot'
                ? { boxShadow: '0 0 28px rgba(154,134,184,0.55)' }
                : undefined
            }
          >
            {phase === 'bot' ? <Bot className="h-5 w-5" /> : <Headphones className="h-5 w-5" />}
          </motion.div>
          {phase === 'connecting' && !reduced && (
            <>
              {[0, 1].map((i) => (
                <motion.span
                  key={i}
                  className="pointer-events-none absolute inset-0 rounded-full border border-signal-400/50"
                  animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.35 }}
                />
              ))}
            </>
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">
            {phase === 'bot' && 'Framekit Assistant'}
            {phase === 'connecting' && 'Connecting you…'}
            {phase === 'connected' && 'Maya · Live agent'}
          </p>
          <p className="text-xs text-zinc-500">
            {phase === 'bot' && 'I can hand you to a human anytime.'}
            {phase === 'connecting' && 'Finding the next available specialist.'}
            {phase === 'connected' && 'Typically replies in under a minute.'}
          </p>
        </div>
      </div>
      <div className="mt-4">
        {phase === 'bot' && (
          <button
            type="button"
            onClick={() => setPhase('connecting')}
            className="w-full rounded-xl bg-signal-600 py-2.5 text-sm font-semibold text-white hover:bg-signal-700"
          >
            Talk to a person
          </button>
        )}
        {phase === 'connecting' && (
          <div className="flex h-10 items-center justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-2 w-2 rounded-full bg-signal-400"
                animate={reduced ? undefined : { y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        )}
        {phase === 'connected' && (
          <button
            type="button"
            onClick={() => setPhase('bot')}
            className="w-full rounded-xl border border-zinc-200 py-2.5 text-sm font-medium dark:border-zinc-700"
          >
            Reset demo
          </button>
        )}
      </div>
    </div>
  )
}
