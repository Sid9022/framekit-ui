import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Home, Inbox, BarChart3, Settings, Users, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type RailBloomItem = {
  id: string
  label: string
  icon?: LucideIcon
}

const DEFAULTS: RailBloomItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
]

/** Collapsible icon rail that blooms labels + soft glow; liquid active indicator. */
export function RailBloomSidebar({
  items = DEFAULTS,
  defaultExpanded = false,
  className,
}: {
  items?: RailBloomItem[]
  defaultExpanded?: boolean
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const [expanded, setExpanded] = React.useState(defaultExpanded)
  const [active, setActive] = React.useState(items[0]?.id)
  const [hovered, setHovered] = React.useState<string | null>(null)
  const activeIdx = Math.max(0, items.findIndex((i) => i.id === active))

  return (
    <motion.aside
      className={cn(
        'relative flex h-[360px] flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-gradient-to-b from-white to-zinc-50 shadow-[0_24px_60px_-32px_rgba(53,43,66,0.45)] dark:border-zinc-800 dark:from-zinc-950 dark:to-[#121018]',
        className,
      )}
      animate={{ width: expanded ? 220 : 72 }}
      transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="flex items-center gap-2 px-4 pb-2 pt-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-signal-500/20 text-xs font-bold text-signal-700 dark:text-signal-300">
          Fk
        </span>
        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={reduced ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="truncate text-sm font-semibold tracking-tight"
            >
              Framekit
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <nav className="relative mt-2 flex-1 px-2" aria-label="Rail bloom">
        <motion.div
          className="pointer-events-none absolute left-2 right-2 h-10 rounded-xl bg-signal-400/15 dark:bg-signal-500/20"
          animate={{ y: activeIdx * 44 }}
          transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 28 }}
          style={{ boxShadow: '0 0 24px -4px rgba(154,134,184,0.55)' }}
        />
        <ul className="relative space-y-1">
          {items.map((item) => {
            const Icon = item.icon ?? Home
            const selected = item.id === active
            const glow = hovered === item.id || selected
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setActive(item.id)}
                  onMouseEnter={() => setHovered(item.id)}
                  onMouseLeave={() => setHovered(null)}
                  className={cn(
                    'relative flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm transition',
                    selected
                      ? 'text-zinc-900 dark:text-zinc-50'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200',
                  )}
                  aria-current={selected ? 'page' : undefined}
                >
                  <span
                    className={cn(
                      'relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition',
                      glow && 'bg-signal-400/25 text-signal-700 dark:text-signal-200',
                    )}
                    style={
                      glow && !reduced
                        ? { boxShadow: '0 0 18px -2px rgba(185,170,208,0.7)' }
                        : undefined
                    }
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <AnimatePresence>
                    {expanded && (
                      <motion.span
                        initial={reduced ? false : { opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="truncate font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-zinc-100 px-3 py-3 dark:border-zinc-800">
        <p className="truncate font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-400">
          {expanded ? 'Hover bloom · liquid active' : 'Rail'}
        </p>
      </div>
    </motion.aside>
  )
}
