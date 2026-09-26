import * as React from 'react'
import { motion } from 'motion/react'
import { Archive, MoreHorizontal, Pin } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type InboxRow = {
  id: string
  name: string
  preview: string
  time: string
  unread?: number
  channel: 'WA' | 'SMS' | 'RCS'
  avatar: string
  tone?: string
}

const ROWS: InboxRow[] = [
  { id: '1', name: 'Maya Chen', preview: 'Can you reschedule the delivery?', time: '2m', unread: 3, channel: 'WA', avatar: 'MC', tone: 'from-violet-400 to-signal-500' },
  { id: '2', name: 'Ops Bot', preview: 'Campaign “Spring Drop” is 82% sent', time: '14m', channel: 'SMS', avatar: 'OB', tone: 'from-emerald-400 to-teal-600' },
  { id: '3', name: 'Jordan Lee', preview: 'Thanks — confirmed opt-in.', time: '1h', unread: 1, channel: 'RCS', avatar: 'JL', tone: 'from-amber-400 to-orange-500' },
  { id: '4', name: 'North Warehouse', preview: 'Slot locked for 16:00–18:00', time: '3h', channel: 'WA', avatar: 'NW', tone: 'from-sky-400 to-indigo-500' },
]

const CHIP: Record<InboxRow['channel'], string> = {
  WA: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  SMS: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
  RCS: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
}

/** Conversation list with unread bloom, channel chip, hover actions. */
export function InboxPulseList({
  rows = ROWS,
  className,
}: {
  rows?: InboxRow[]
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = React.useState(rows[0]?.id)
  const [hovered, setHovered] = React.useState<string | null>(null)

  return (
    <div
      className={cn(
        'w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_22px_50px_-28px_rgba(53,43,66,0.4)] dark:border-zinc-800 dark:bg-zinc-950',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <p className="text-sm font-semibold">Inbox</p>
        <span className="rounded-full bg-signal-400/20 px-2 py-0.5 font-mono text-[10px] text-signal-700 dark:text-signal-200">
          {rows.reduce((n, r) => n + (r.unread ?? 0), 0)} unread
        </span>
      </div>
      <ul className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
        {rows.map((row, i) => (
          <motion.li
            key={row.id}
            initial={reduced ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: reduced ? 0 : i * 0.05 }}
            onMouseEnter={() => setHovered(row.id)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              'relative flex cursor-pointer items-center gap-3 px-3 py-3 transition',
              active === row.id ? 'bg-signal-400/10' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/60',
            )}
            onClick={() => setActive(row.id)}
          >
            <div className="relative shrink-0">
              <span
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white',
                  row.tone ?? 'from-signal-400 to-signal-600',
                )}
              >
                {row.avatar}
              </span>
              {(row.unread ?? 0) > 0 && (
                <motion.span
                  className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-signal-500 px-1 text-[9px] font-bold text-white"
                  animate={reduced ? undefined : { scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  style={{ boxShadow: '0 0 12px rgba(154,134,184,0.8)' }}
                >
                  {row.unread}
                </motion.span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className={cn('truncate text-sm', row.unread ? 'font-semibold' : 'font-medium')}>{row.name}</p>
                <span className="shrink-0 text-[10px] text-zinc-500 dark:text-zinc-400">{row.time}</span>
              </div>
              <div className="mt-0.5 flex items-center gap-2">
                <p className="truncate text-xs text-zinc-500">{row.preview}</p>
                <span className={cn('shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[9px] font-semibold', CHIP[row.channel])}>
                  {row.channel}
                </span>
              </div>
            </div>
            {hovered === row.id && (
              <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1 rounded-lg border border-zinc-200 bg-white/95 p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                <button type="button" className="rounded p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Pin">
                  <Pin className="h-3.5 w-3.5" />
                </button>
                <button type="button" className="rounded p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Archive">
                  <Archive className="h-3.5 w-3.5" />
                </button>
                <button type="button" className="rounded p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="More">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
