import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Bell, CheckCheck } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Note = { id: string; title: string; body: string; unread: boolean; time: string }

const SEED: Note[] = [
  { id: '1', title: 'Delivery spike', body: 'WA throughput up 18% in the last hour.', unread: true, time: '2m' },
  { id: '2', title: 'Template approved', body: 'order_update_v3 cleared compliance.', unread: true, time: '18m' },
  { id: '3', title: 'Agent handoff', body: 'Maya joined queue “Priority EU”.', unread: false, time: '1h' },
  { id: '4', title: 'Webhook retry', body: 'crm.events recovered after 3 retries.', unread: true, time: '3h' },
]

/** Bell opens notification panel; items stack with unread glow; mark-all-read. */
export function NotificationOrbitCenter({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [open, setOpen] = React.useState(true)
  const [items, setItems] = React.useState(SEED)
  const unread = items.filter((i) => i.unread).length

  return (
    <div className={cn('relative flex h-[380px] w-full max-w-sm flex-col items-center justify-start pt-6', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-zinc-700 dark:text-zinc-200" />
        {unread > 0 && (
          <motion.span
            className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-signal-500 px-1 text-[10px] font-bold text-white"
            animate={reduced ? undefined : { scale: [1, 1.12, 1] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            style={{ boxShadow: '0 0 14px rgba(154,134,184,0.85)' }}
          >
            {unread}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="mt-4 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_28px_60px_-30px_rgba(53,43,66,0.5)] dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 px-3 py-2.5 dark:border-zinc-800">
              <p className="text-sm font-semibold">Notifications</p>
              <button
                type="button"
                onClick={() => setItems((xs) => xs.map((x) => ({ ...x, unread: false })))}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium text-signal-700 hover:bg-signal-400/15 dark:text-signal-300"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            </div>
            <ul className="max-h-[260px] space-y-1 overflow-y-auto p-2">
              <AnimatePresence initial={false}>
                {items.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={reduced ? false : { opacity: 0, x: 20, rotate: 2 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    transition={{ delay: reduced ? 0 : i * 0.06, type: 'spring', stiffness: 380, damping: 26 }}
                    className={cn(
                      'rounded-xl border px-3 py-2.5',
                      item.unread
                        ? 'border-signal-400/40 bg-signal-400/10 shadow-[0_0_20px_-8px_rgba(154,134,184,0.7)]'
                        : 'border-transparent bg-zinc-50 dark:bg-zinc-900/60',
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">{item.title}</p>
                      <span className="text-[10px] text-zinc-400">{item.time}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-500">{item.body}</p>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
