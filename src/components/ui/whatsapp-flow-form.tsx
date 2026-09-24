import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { Check, Send } from 'lucide-react'

/** Interactive in-chat Flow / survey form card with submit confirmation. */
export function WhatsappFlowForm({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [rating, setRating] = React.useState('4')
  const [note, setNote] = React.useState('')
  const [sent, setSent] = React.useState(false)

  const submit = () => {
    setSent(true)
    window.setTimeout(() => setSent(false), 2800)
  }

  return (
    <div className={cn('w-full max-w-sm overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_20px_50px_-28px_rgba(53,43,66,0.45)] dark:border-zinc-800 dark:bg-zinc-950', className)}>
      <div className="border-b border-zinc-100 bg-gradient-to-r from-signal-500/20 to-transparent px-4 py-3 dark:border-zinc-800">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-signal-600 dark:text-signal-300">Business flow</p>
        <p className="text-sm font-semibold">Quick feedback</p>
      </div>
      <div className="space-y-3 p-4">
        <label className="block text-xs font-medium text-zinc-500">How was your experience?</label>
        <div className="flex gap-1.5">
          {['1', '2', '3', '4', '5'].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition',
                rating === n ? 'bg-signal-500 text-white shadow-md' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300',
              )}
            >
              {n}
            </button>
          ))}
        </div>
        <label className="block text-xs font-medium text-zinc-500">Anything else?</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="Optional note…"
          className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-signal-400 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <motion.button
          type="button"
          onClick={submit}
          whileTap={reduced ? undefined : { scale: 0.97 }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-signal-600 py-2.5 text-sm font-semibold text-white"
        >
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.span key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4" /> Submitted
              </motion.span>
            ) : (
              <motion.span key="go" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-1.5">
                <Send className="h-3.5 w-3.5" /> Submit
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  )
}
