import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

const CHIPS = [
  'Track order', 'Talk to agent', 'Store hours', 'Pricing',
  'Reset password', 'Book a demo', 'Unsubscribe', 'Speak Portuguese',
]

/** Cloud of quick-reply chips with magnetic hover + select. */
export function QuickReplyChipCloud({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [selected, setSelected] = React.useState<string | null>('Book a demo')
  const [mag, setMag] = React.useState<Record<string, { x: number; y: number }>>({})

  const onMove = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width - 0.5) * 10
    const y = ((e.clientY - r.top) / r.height - 0.5) * 8
    setMag((m) => ({ ...m, [id]: { x, y } }))
  }

  return (
    <div className={cn('w-full max-w-md rounded-2xl border border-zinc-200 bg-gradient-to-b from-zinc-50 to-white p-5 dark:border-zinc-800 dark:from-zinc-950 dark:to-[#121018]', className)}>
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">Quick replies</p>
      <div className="flex flex-wrap gap-2">
        {CHIPS.map((chip) => {
          const active = selected === chip
          const pull = mag[chip] ?? { x: 0, y: 0 }
          return (
            <motion.button
              key={chip}
              type="button"
              onClick={() => setSelected(chip)}
              onMouseMove={(e) => onMove(chip, e)}
              onMouseLeave={() => setMag((m) => ({ ...m, [chip]: { x: 0, y: 0 } }))}
              animate={{ x: pull.x, y: pull.y, scale: active ? 1.05 : 1 }}
              transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 22 }}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-xs font-medium transition',
                active
                  ? 'bg-signal-600 text-white shadow-[0_8px_24px_-8px_rgba(125,104,153,0.7)]'
                  : 'border border-zinc-200 bg-white text-zinc-600 hover:border-signal-400/60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300',
              )}
            >
              {chip}
            </motion.button>
          )
        })}
      </div>
      {selected && (
        <p className="mt-4 text-xs text-zinc-500">
          Selected: <span className="font-semibold text-signal-600 dark:text-signal-300">{selected}</span>
        </p>
      )}
    </div>
  )
}
