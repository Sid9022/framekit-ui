import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronRight, Search, LayoutDashboard, MessageSquare, Phone, Shield } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type NavLeaf = { id: string; label: string }
type NavSection = { id: string; title: string; icon?: React.ReactNode; items: NavLeaf[] }

const DEFAULT_SECTIONS: NavSection[] = [
  {
    id: 'workspace',
    title: 'Workspace',
    icon: <LayoutDashboard className="h-3.5 w-3.5" />,
    items: [
      { id: 'overview', label: 'Overview' },
      { id: 'pipelines', label: 'Pipelines' },
      { id: 'reports', label: 'Reports' },
    ],
  },
  {
    id: 'messaging',
    title: 'Messaging',
    icon: <MessageSquare className="h-3.5 w-3.5" />,
    items: [
      { id: 'threads', label: 'Threads' },
      { id: 'templates', label: 'Templates' },
      { id: 'campaigns', label: 'Campaigns' },
    ],
  },
  {
    id: 'voice',
    title: 'Voice',
    icon: <Phone className="h-3.5 w-3.5" />,
    items: [
      { id: 'queues', label: 'Queues' },
      { id: 'agents', label: 'Agents' },
      { id: 'recordings', label: 'Recordings' },
    ],
  },
  {
    id: 'compliance',
    title: 'Compliance',
    icon: <Shield className="h-3.5 w-3.5" />,
    items: [
      { id: 'opt-ins', label: 'Opt-ins' },
      { id: 'audit', label: 'Audit log' },
    ],
  },
]

/** Nested accordion sections with spring height, sticky header + search capsule. */
export function SectionAccordionSidebar({
  sections = DEFAULT_SECTIONS,
  workspace = 'Northstar Ops',
  className,
}: {
  sections?: NavSection[]
  workspace?: string
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const [open, setOpen] = React.useState<Record<string, boolean>>({ workspace: true, messaging: true })
  const [active, setActive] = React.useState('overview')
  const [query, setQuery] = React.useState('')

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sections
    return sections
      .map((s) => ({
        ...s,
        items: s.items.filter((i) => i.label.toLowerCase().includes(q) || s.title.toLowerCase().includes(q)),
      }))
      .filter((s) => s.items.length > 0)
  }, [sections, query])

  return (
    <aside
      className={cn(
        'flex h-[400px] w-[260px] flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_24px_60px_-32px_rgba(53,43,66,0.4)] dark:border-zinc-800 dark:bg-zinc-950',
        className,
      )}
    >
      <div className="sticky top-0 z-10 space-y-3 border-b border-zinc-100 bg-white/90 px-3 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-signal-400 to-signal-600 text-[10px] font-bold text-white">
            NS
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{workspace}</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-400">Workspace</p>
          </div>
        </div>
        <label className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 dark:border-zinc-700 dark:bg-zinc-900">
          <Search className="h-3.5 w-3.5 text-zinc-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search nav…"
            className="w-full bg-transparent text-xs outline-none placeholder:text-zinc-400"
          />
        </label>
      </div>

      <div className="framekit-scroll flex-1 overflow-y-auto px-2 py-2">
        {filtered.map((section) => {
          const isOpen = open[section.id] ?? false
          return (
            <div key={section.id} className="mb-1">
              <button
                type="button"
                onClick={() => setOpen((o) => ({ ...o, [section.id]: !isOpen }))}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                <motion.span
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 24 }}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </motion.span>
                {section.icon}
                {section.title}
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.ul
                    initial={reduced ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 32 }}
                    className="overflow-hidden pl-2"
                  >
                    {section.items.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => setActive(item.id)}
                          className={cn(
                            'mb-0.5 w-full rounded-lg px-3 py-1.5 text-left text-sm transition',
                            active === item.id
                              ? 'bg-signal-400/20 font-medium text-signal-800 dark:text-signal-200'
                              : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900',
                          )}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
