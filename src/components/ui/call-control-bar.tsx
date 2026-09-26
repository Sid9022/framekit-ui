import * as React from 'react'
import { motion } from 'motion/react'
import { Mic, MicOff, Pause, PhoneOff, Grid3X3 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Mute / hold / end / keypad toggles with glowing active states + hold pulse. */
export function CallControlBar({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [muted, setMuted] = React.useState(false)
  const [hold, setHold] = React.useState(false)
  const [keypad, setKeypad] = React.useState(false)
  const [ended, setEnded] = React.useState(false)

  if (ended) {
    return (
      <div className={cn('flex flex-col items-center gap-3', className)}>
        <p className="text-sm text-zinc-500">Call ended</p>
        <button
          type="button"
          onClick={() => setEnded(false)}
          className="rounded-full bg-signal-500 px-4 py-2 text-xs font-semibold text-white"
        >
          Start new call
        </button>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-zinc-200 bg-gradient-to-b from-white to-zinc-50 p-5 text-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_50px_-28px_rgba(24,24,27,0.3)] dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-900 dark:text-zinc-50 dark:shadow-[0_28px_60px_-28px_rgba(0,0,0,0.6)]',
        className,
      )}
    >
      <div className="text-center">
        <p className="text-sm font-semibold">Maya Chen</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal-600 dark:text-signal-300">
          {hold ? 'On hold' : muted ? 'Muted' : 'Connected · 04:12'}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full border transition',
            muted
              ? 'border-amber-400/50 bg-amber-500/20 text-amber-700 dark:text-amber-200'
              : 'border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200',
          )}
          style={muted && !reduced ? { boxShadow: '0 0 20px rgba(251,191,36,0.45)' } : undefined}
          aria-pressed={muted}
          aria-label="Mute"
        >
          {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>
        <motion.button
          type="button"
          onClick={() => setHold((h) => !h)}
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full border transition',
            hold
              ? 'border-signal-400/60 bg-signal-500/25 text-signal-800 dark:text-signal-100'
              : 'border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200',
          )}
          animate={hold && !reduced ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={hold ? { repeat: Infinity, duration: 1.4 } : undefined}
          style={hold ? { boxShadow: '0 0 22px rgba(154,134,184,0.55)' } : undefined}
          aria-pressed={hold}
          aria-label="Hold"
        >
          <Pause className="h-5 w-5" />
        </motion.button>
        <button
          type="button"
          onClick={() => setKeypad((k) => !k)}
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full border transition',
            keypad
              ? 'border-sky-400/50 bg-sky-500/20 text-sky-800 dark:text-sky-100'
              : 'border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200',
          )}
          aria-pressed={keypad}
          aria-label="Keypad"
        >
          <Grid3X3 className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => setEnded(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/40"
          aria-label="End call"
        >
          <PhoneOff className="h-5 w-5" />
        </button>
      </div>
      {keypad && (
        <div className="grid w-48 grid-cols-3 gap-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
            <button
              key={k}
              type="button"
              className="rounded-xl bg-zinc-100 dark:bg-zinc-800 py-2 text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700"
            >
              {k}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
