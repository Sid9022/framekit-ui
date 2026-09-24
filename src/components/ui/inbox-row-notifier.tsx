import * as React from 'react'
import { motion } from 'motion/react'
import { Archive, Bell, Check, MessageSquare, ShieldAlert, Zap } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Row = {
  id: string
  title: string
  meta: string
  time: string
  kind: 'message' | 'alert' | 'system' | 'zap'
}

const ROWS: Row[] = [
  { id: '1', title: 'New inbound from Maya Chen', meta: 'WA · Priority', time: 'Just now', kind: 'message' },
  { id: '2', title: 'SLA breach risk on Queue B', meta: 'Voice · Warn', time: '4m ago', kind: 'alert' },
  { id: '3', title: 'Webhook signature rotated', meta: 'System', time: '22m ago', kind: 'system' },
  { id: '4', title: 'Burst send completed', meta: 'Campaign · 12.4k', time: '1h ago', kind: 'zap' },
]

const GLYPH = {
  message: MessageSquare,
  alert: ShieldAlert,
  system: Bell,
  zap: Zap,
}

/** Dense notification feed row with glyph morph, hover reveal actions. */
export function InboxRowNotifier({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [hover, setHover] = React.useState<string | null>(null)

  return (
    <div
      className={cn(
        'w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950',
        className,
      )}
    >
      <div className="border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
        <p className="text-sm font-semibold">Activity feed</p>
      </div>
      <ul>
        {ROWS.map((r, i) => {
          const Icon = GLYPH[r.kind]
          return (
            <motion.li
              key={r.id}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduced ? 0 : i * 0.05 }}
              onMouseEnter={() => setHover(r.id)}
              onMouseLeave={() => setHover(null)}
              className="relative flex items-center gap-3 border-b border-zinc-50 px-3 py-3 last:border-0 dark:border-zinc-900"
            >
              <motion.span
                layout
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-signal-400/15 text-signal-700 dark:text-signal-200"
              >
                <Icon className="h-4 w-4" />
              </motion.span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{r.title}</p>
                <p className="text-[11px] text-zinc-500">
                  {r.meta} · {r.time}
                </p>
              </div>
              {hover === r.id && (
                <motion.div
                  initial={reduced ? false : { opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-1"
                >
                  <button type="button" className="rounded-lg border border-zinc-200 p-1.5 dark:border-zinc-700" aria-label="Mark read">
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" className="rounded-lg border border-zinc-200 p-1.5 dark:border-zinc-700" aria-label="Archive">
                    <Archive className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              )}
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}
