import * as React from 'react'
import { motion } from 'motion/react'
import { Pin, PinOff, Home, Inbox, Layers, Settings, Info } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

const RAIL = [
  { id: 'home', label: 'Home', icon: Home, context: 'Dashboard overview, KPIs, and live delivery health.' },
  { id: 'inbox', label: 'Inbox', icon: Inbox, context: 'Unified messaging threads across WA, SMS, and RCS.' },
  { id: 'layers', label: 'Flows', icon: Layers, context: 'Orchestration graphs, retries, and fallback routes.' },
  { id: 'settings', label: 'Settings', icon: Settings, context: 'Workspace prefs, API keys, and webhooks.' },
]

/** Dual-mode slim rail ↔ wide frosted context drawer with pin toggle. */
export function ContextDrawerSidebar({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [wide, setWide] = React.useState(false)
  const [pinned, setPinned] = React.useState(false)
  const [active, setActive] = React.useState(RAIL[0].id)
  const current = RAIL.find((r) => r.id === active) ?? RAIL[0]
  const open = pinned || wide

  return (
    <div
      className={cn(
        'relative flex h-[380px] w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100/80 dark:border-zinc-800 dark:bg-zinc-900/50',
        className,
      )}
      onMouseLeave={() => !pinned && setWide(false)}
    >
      <motion.aside
        className="relative z-10 flex h-full flex-col border-r border-zinc-200/80 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/80"
        animate={{ width: open ? 280 : 64 }}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 340, damping: 30 }}
        onMouseEnter={() => setWide(true)}
      >
        <div className="flex items-center justify-between gap-2 px-3 py-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-signal-500/25 text-[10px] font-bold text-signal-800 dark:text-signal-200">
            Cx
          </span>
          {open && (
            <button
              type="button"
              onClick={() => setPinned((p) => !p)}
              className={cn(
                'rounded-lg p-1.5 transition',
                pinned
                  ? 'bg-signal-400/30 text-signal-800 dark:text-signal-100'
                  : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800',
              )}
              aria-label={pinned ? 'Unpin drawer' : 'Pin drawer'}
            >
              {pinned ? <Pin className="h-3.5 w-3.5" /> : <PinOff className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-2" aria-label="Context drawer">
          {RAIL.map((item) => {
            const Icon = item.icon
            const selected = item.id === active
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(item.id)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-sm transition',
                  selected
                    ? 'bg-signal-400/20 text-zinc-900 dark:text-zinc-50'
                    : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {open && <span className="truncate font-medium">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {open && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="m-2 rounded-xl border border-signal-300/30 bg-signal-50/80 p-3 dark:border-signal-700/40 dark:bg-signal-900/30"
          >
            <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-signal-600 dark:text-signal-300">
              <Info className="h-3 w-3" />
              Context
            </div>
            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">{current.context}</p>
          </motion.div>
        )}
      </motion.aside>

      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">{current.label}</p>
        <p className="max-w-[200px] text-xs text-zinc-500">Hover the rail to expand · pin to keep context open</p>
      </div>
    </div>
  )
}
