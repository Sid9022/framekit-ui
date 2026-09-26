import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import {
  Bell, ChevronDown, ChevronsUpDown, Home, Inbox, Layers, Settings, Users, type LucideIcon,
} from 'lucide-react'

type Item = { id: string; label: string; icon: LucideIcon }
type Group = { id: string; label: string; items: Item[] }

const GROUPS: Group[] = [
  {
    id: 'main',
    label: 'Workspace',
    items: [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'inbox', label: 'Inbox', icon: Inbox },
      { id: 'campaigns', label: 'Campaigns', icon: Layers },
    ],
  },
  {
    id: 'team',
    label: 'Team',
    items: [
      { id: 'members', label: 'Members', icon: Users },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
]

/** Frosted glass pro sidebar — workspace switcher, collapsible groups, notif pip, user footer. */
export function GlassWorkspaceSidebar({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [expanded, setExpanded] = React.useState(true)
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({ main: true, team: true })
  const [active, setActive] = React.useState('inbox')
  const [wsOpen, setWsOpen] = React.useState(false)

  return (
    <motion.aside
      className={cn(
        'relative flex h-[400px] flex-col overflow-hidden rounded-2xl border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(246,244,250,0.72))] text-zinc-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(0,0,0,0.05),0_30px_60px_-36px_rgba(53,43,66,0.35)] backdrop-blur-2xl dark:border-white/15 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(20,16,30,0.55))] dark:text-zinc-100 dark:shadow-[0_30px_80px_-40px_rgba(0,0,0,0.7)]',
        className,
      )}
      animate={{ width: expanded ? 240 : 72 }}
      transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
    >
      <div className="flex items-center justify-between px-3 pb-2 pt-3">
        <button
          type="button"
          onClick={() => setWsOpen((o) => !o)}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-white/10"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-signal-500/30 text-xs font-bold">Fk</span>
          <AnimatePresence>
            {expanded && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-semibold">Acme Ops</p>
                <p className="truncate font-mono text-[9px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Pro plan</p>
              </motion.div>
            )}
          </AnimatePresence>
          {expanded && <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-zinc-500 dark:text-zinc-400" />}
        </button>
        <button type="button" onClick={() => setExpanded((e) => !e)} className="relative rounded-lg p-1.5 hover:bg-white/10" aria-label="Toggle width">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-framekit-500 shadow-[0_0_8px_#f97316]" />
        </button>
      </div>

      <AnimatePresence>
        {wsOpen && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden px-3"
          >
            <div className="mb-2 space-y-1 rounded-xl border border-zinc-900/10 dark:border-white/10 bg-zinc-100/80 dark:bg-black/30 p-1.5 text-xs">
              {['Acme Ops', 'Northwind', 'Sandbox'].map((w) => (
                <button key={w} type="button" onClick={() => setWsOpen(false)} className="block w-full rounded-lg px-2 py-1.5 text-left hover:bg-zinc-900/[0.06] dark:hover:bg-white/10">
                  {w}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="framekit-scroll flex-1 space-y-3 overflow-y-auto px-2 py-2">
        {GROUPS.map((g) => (
          <div key={g.id}>
            {expanded && (
              <button
                type="button"
                onClick={() => setOpenGroups((o) => ({ ...o, [g.id]: !o[g.id] }))}
                className="mb-1 flex w-full items-center justify-between px-2 font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-500"
              >
                {g.label}
                <ChevronDown className={cn('h-3 w-3 transition', openGroups[g.id] && 'rotate-180')} />
              </button>
            )}
            <AnimatePresence initial={false}>
              {(openGroups[g.id] || !expanded) && (
                <motion.ul
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-0.5 overflow-hidden"
                >
                  {g.items.map((item) => {
                    const Icon = item.icon
                    const on = active === item.id
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => setActive(item.id)}
                          className={cn(
                            'flex h-9 w-full items-center gap-2.5 rounded-xl px-2.5 text-sm transition',
                            on ? 'bg-signal-500/25 text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-900/[0.05] dark:hover:bg-white/8 hover:text-zinc-900 dark:hover:text-zinc-100',
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {expanded && <span className="truncate">{item.label}</span>}
                        </button>
                      </li>
                    )
                  })}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      <div className="mt-auto flex items-center gap-2 border-t border-zinc-900/10 dark:border-white/10 px-3 py-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-signal-400 to-framekit-500 text-[10px] font-bold">JR</span>
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-w-0">
              <p className="truncate text-xs font-semibold">Jordan Rhee</p>
              <p className="truncate text-[10px] text-zinc-500">jordan@acme.io</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  )
}
