import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

const EVENTS = [
  'WA message delivered to +1···4821',
  'Agent Mira claimed ticket #1842',
  'SMS fallback fired for template order_v3',
  'Opt-in captured from checkout flow',
  'ASR peaked at 97.2% on trunk EU-2',
  'Queue wait crossed 45s — overflow armed',
  'RCS rich card opened by Maya C.',
  'Webhook crm.sync acknowledged 200',
]

/** Live-feeling activity feed with staggered row inserts. */
export function ActivityStreamWidget({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [rows, setRows] = React.useState(() =>
    EVENTS.slice(0, 4).map((text, i) => ({ id: `s-${i}`, text, t: `${i + 1}s ago` })),
  )

  React.useEffect(() => {
    if (reduced) return
    let n = 4
    const id = window.setInterval(() => {
      const text = EVENTS[n % EVENTS.length]
      n++
      setRows((prev) => [{ id: `e-${n}`, text, t: 'just now' }, ...prev].slice(0, 6))
    }, 2200)
    return () => clearInterval(id)
  }, [reduced])

  return (
    <div
      className={cn(
        'h-[320px] w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
        <p className="text-sm font-semibold">Live activity</p>
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
      </div>
      <ul className="space-y-1 p-2">
        <AnimatePresence initial={false}>
          {rows.map((row) => (
            <motion.li
              key={row.id}
              layout
              initial={reduced ? false : { opacity: 0, y: -12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-start gap-2 rounded-xl bg-zinc-50 px-3 py-2 dark:bg-zinc-900/70">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal-500" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">{row.text}</p>
                  <p className="mt-0.5 font-mono text-[9px] text-zinc-400">{row.t}</p>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}
