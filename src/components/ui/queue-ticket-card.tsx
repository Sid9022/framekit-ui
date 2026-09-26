import * as React from 'react'
import { motion } from 'motion/react'
import { ArrowRightLeft, Hand } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Call queue card: wait ticker, priority, skill tags, claim/transfer. */
export function QueueTicketCard({
  caller = 'Jordan Lee',
  priority = 'High',
  skills = ['Billing', 'EN', 'VIP'],
  className,
}: {
  caller?: string
  priority?: string
  skills?: string[]
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const [wait, setWait] = React.useState(47)
  const [status, setStatus] = React.useState<'waiting' | 'claimed' | 'transfer'>('waiting')

  React.useEffect(() => {
    if (status !== 'waiting') return
    const id = window.setInterval(() => setWait((w) => w + 1), 1000)
    return () => clearInterval(id)
  }, [status])

  const mm = String(Math.floor(wait / 60)).padStart(2, '0')
  const ss = String(wait % 60).padStart(2, '0')

  return (
    <motion.div
      layout
      className={cn(
        'w-full max-w-sm overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_22px_50px_-28px_rgba(53,43,66,0.4)] dark:border-zinc-800 dark:bg-zinc-950',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-signal-400 to-signal-600 text-xs font-bold text-white">
            {caller.split(' ').map((p) => p[0]).join('').slice(0, 2)}
          </span>
          <div>
            <p className="text-sm font-semibold">{caller}</p>
            <p className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">Ticket · Q-{1800 + (wait % 90)}</p>
          </div>
        </div>
        <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-300">
          {priority}
        </span>
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">Wait time</p>
          <p className="font-mono text-2xl font-semibold tabular-nums">
            {mm}:{ss}
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-1">
          {skills.map((s) => (
            <span key={s} className="rounded-md bg-signal-400/15 px-2 py-0.5 text-[10px] font-medium text-signal-800 dark:text-signal-200">
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-2 px-4 pb-4">
        <motion.button
          type="button"
          whileTap={reduced ? undefined : { scale: 0.96 }}
          onClick={() => setStatus('claimed')}
          disabled={status !== 'waiting'}
          className={cn(
            'inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition',
            status === 'claimed'
              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
              : 'bg-signal-500 text-white shadow-md shadow-signal-500/30 disabled:opacity-50',
          )}
        >
          <Hand className="h-3.5 w-3.5" />
          {status === 'claimed' ? 'Claimed' : 'Claim'}
        </motion.button>
        <motion.button
          type="button"
          whileTap={reduced ? undefined : { scale: 0.96 }}
          onClick={() => setStatus('transfer')}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-zinc-200 py-2.5 text-xs font-semibold dark:border-zinc-700"
        >
          <ArrowRightLeft className="h-3.5 w-3.5" />
          {status === 'transfer' ? 'Sent' : 'Transfer'}
        </motion.button>
      </div>
    </motion.div>
  )
}
