import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { MessageCircle, Phone, Search, Mail } from 'lucide-react'

type Filter = 'open' | 'pending' | 'snoozed'
type Channel = 'all' | 'wa' | 'sms' | 'voice'

const CONVOS = [
  { id: '1', name: 'Aisha Khan', preview: 'Can we reschedule Thursday?', channel: 'wa' as const, unread: 2, filter: 'open' as const, time: '2m' },
  { id: '2', name: 'Nord Logistics', preview: 'POD uploaded for #4481', channel: 'sms' as const, unread: 0, filter: 'open' as const, time: '14m' },
  { id: '3', name: 'Leo Martins', preview: 'Waiting on refund confirmation', channel: 'wa' as const, unread: 5, filter: 'pending' as const, time: '1h' },
  { id: '4', name: 'Clinic Desk', preview: 'Missed voice · callback?', channel: 'voice' as const, unread: 1, filter: 'pending' as const, time: '3h' },
  { id: '5', name: 'Mira Chen', preview: 'Snoozed until tomorrow 9am', channel: 'wa' as const, unread: 0, filter: 'snoozed' as const, time: 'yday' },
]

const CH_ICON = { wa: MessageCircle, sms: Mail, voice: Phone }

/** Dense messaging-ops inbox sidebar — filters, channel tabs, unread bloom. */
export function PriorityInboxSidebar({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [filter, setFilter] = React.useState<Filter>('open')
  const [channel, setChannel] = React.useState<Channel>('all')
  const [q, setQ] = React.useState('')
  const [active, setActive] = React.useState('1')

  const list = CONVOS.filter((c) => c.filter === filter)
    .filter((c) => channel === 'all' || c.channel === channel)
    .filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.preview.toLowerCase().includes(q.toLowerCase()))

  return (
    <aside className={cn('flex h-[400px] w-[280px] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-[#0e0c14]', className)}>
      <div className="space-y-2 border-b border-zinc-100 p-3 dark:border-zinc-800">
        <p className="text-sm font-semibold">Priority inbox</p>
        <div className="flex gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-900">
          {(['open', 'pending', 'snoozed'] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                'flex-1 rounded-lg py-1 text-[11px] font-semibold capitalize transition',
                filter === f ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white' : 'text-zinc-500',
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search conversations"
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-signal-400 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex gap-1">
          {([
            ['all', 'All'],
            ['wa', 'Chat'],
            ['sms', 'SMS'],
            ['voice', 'Voice'],
          ] as [Channel, string][]).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setChannel(id)}
              className={cn(
                'rounded-full px-2.5 py-0.5 text-[10px] font-medium',
                channel === id ? 'bg-signal-500/20 text-signal-700 dark:text-signal-200' : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ul className="framekit-scroll flex-1 overflow-y-auto">
        <AnimatePresence initial={false}>
          {list.map((c) => {
            const Icon = CH_ICON[c.channel]
            const on = active === c.id
            return (
              <motion.li
                key={c.id}
                layout
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <button
                  type="button"
                  onClick={() => setActive(c.id)}
                  className={cn(
                    'flex w-full gap-2.5 border-b border-zinc-100 px-3 py-2.5 text-left transition dark:border-zinc-800/80',
                    on ? 'bg-signal-500/10' : 'hover:bg-zinc-50 dark:hover:bg-white/5',
                  )}
                >
                  <span className="relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-signal-500/20 text-[10px] font-bold">
                    {c.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                    {c.unread > 0 && (
                      <motion.span
                        className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-framekit-500 px-0.5 text-[8px] font-bold text-white"
                        animate={reduced ? undefined : { scale: [1, 1.15, 1] }}
                        transition={{ repeat: Infinity, duration: 1.8 }}
                        style={{ boxShadow: '0 0 10px rgba(249,115,22,0.65)' }}
                      >
                        {c.unread}
                      </motion.span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs font-semibold">{c.name}</span>
                      <span className="shrink-0 font-mono text-[9px] text-zinc-500">{c.time}</span>
                    </span>
                    <span className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-500">
                      <Icon className="h-3 w-3 shrink-0" />
                      <span className="truncate">{c.preview}</span>
                    </span>
                  </span>
                </button>
              </motion.li>
            )
          })}
        </AnimatePresence>
        {list.length === 0 && (
          <li className="px-4 py-8 text-center text-xs text-zinc-500">No conversations</li>
        )}
      </ul>
    </aside>
  )
}
