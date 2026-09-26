import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { Plus, SmilePlus } from 'lucide-react'

const EMOJIS = ['👍', '❤️', '😂', '😮', '🔥', '👏']

/** Message reactions as popping emoji chips with add-reaction affordance. */
export function ReactionChipBar({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [reactions, setReactions] = React.useState<{ emoji: string; count: number }[]>([
    { emoji: '👍', count: 3 },
    { emoji: '🔥', count: 1 },
  ])
  const [open, setOpen] = React.useState(false)

  const add = (emoji: string) => {
    setReactions((rs) => {
      const hit = rs.find((r) => r.emoji === emoji)
      if (hit) return rs.map((r) => (r.emoji === emoji ? { ...r, count: r.count + 1 } : r))
      return [...rs, { emoji, count: 1 }]
    })
    setOpen(false)
  }

  return (
    <div className={cn('w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950', className)}>
      <div className={cn('mb-3 max-w-[85%] rounded-2xl rounded-bl-md px-3 py-2 text-sm', 'border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900')}>
        Shipped the new flow — reactions welcome ✨
      </div>
      <div className="relative flex flex-wrap items-center gap-1.5">
        <AnimatePresence>
          {reactions.map((r) => (
            <motion.button
              key={r.emoji}
              type="button"
              layout
              initial={reduced ? false : { scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0 }}
              whileTap={reduced ? undefined : { scale: 1.2 }}
              onClick={() => add(r.emoji)}
              className="inline-flex items-center gap-1 rounded-full border border-signal-300/50 bg-signal-500/10 px-2 py-0.5 text-sm dark:border-signal-500/40"
            >
              <span>{r.emoji}</span>
              <span className="font-mono text-[10px] text-zinc-500">{r.count}</span>
            </motion.button>
          ))}
        </AnimatePresence>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-zinc-300 text-zinc-500 dark:text-zinc-400 hover:border-signal-400 hover:text-signal-500 dark:border-zinc-600"
          aria-label="Add reaction"
        >
          <SmilePlus className="h-3.5 w-3.5" />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4 }}
              className="absolute bottom-9 left-0 z-10 flex gap-1 rounded-full border border-zinc-200 bg-white p-1.5 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
            >
              {EMOJIS.map((e) => (
                <button key={e} type="button" onClick={() => add(e)} className="flex h-8 w-8 items-center justify-center rounded-full text-base hover:bg-signal-500/15">
                  {e}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
