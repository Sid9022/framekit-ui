import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

const EVENTS = [
  { id: '1', time: '09:14', title: 'Campaign queued', detail: 'Spring launch · 12.4k' },
  { id: '2', time: '09:22', title: 'Webhooks healthy', detail: 'Delivery p99 180ms' },
  { id: '3', time: '09:41', title: 'SLA breach risk', detail: 'Queue depth ↑ 18%' },
  { id: '4', time: '10:02', title: 'Agent surge', detail: '+6 agents online' },
  { id: '5', time: '10:18', title: 'Template approved', detail: 'otp_v3 · EN' },
  { id: '6', time: '10:33', title: 'Broadcast complete', detail: '98.2% delivered' },
]

/** Vertical timeline rail for ops/CPaaS — glowing active node + scroll sync. */
export function TimelineRailSidebar({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = React.useState('3')
  const listRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = listRef.current?.querySelector(`[data-id="${active}"]`)
    el?.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' })
  }, [active, reduced])

  return (
    <aside className={cn('flex h-[400px] w-[260px] flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-[#0d0b14] text-zinc-100', className)}>
      <div className="border-b border-zinc-800 px-4 py-3">
        <p className="text-sm font-semibold">Ops timeline</p>
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-500">Live event rail</p>
      </div>
      <div ref={listRef} className="framekit-scroll relative flex-1 overflow-y-auto px-4 py-4">
        <div className="absolute bottom-4 left-[27px] top-4 w-px bg-gradient-to-b from-signal-500/50 via-zinc-700 to-transparent" />
        <ul className="relative space-y-4">
          {EVENTS.map((ev) => {
            const on = active === ev.id
            return (
              <li key={ev.id} data-id={ev.id}>
                <button type="button" onClick={() => setActive(ev.id)} className="flex w-full gap-3 text-left">
                  <span className="relative mt-1 flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                    <span className={cn('h-2.5 w-2.5 rounded-full', on ? 'bg-framekit-500' : 'bg-zinc-600')} />
                    {on && !reduced && (
                      <motion.span
                        className="absolute inset-0 rounded-full bg-framekit-500/40"
                        animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
                        transition={{ repeat: Infinity, duration: 1.6 }}
                      />
                    )}
                  </span>
                  <span className={cn('min-w-0 flex-1 rounded-xl px-2.5 py-2 transition', on ? 'bg-signal-500/15 ring-1 ring-signal-400/30' : 'hover:bg-white/5')}>
                    <span className="font-mono text-[9px] text-zinc-500">{ev.time}</span>
                    <span className="block text-sm font-medium">{ev.title}</span>
                    <span className="block text-xs text-zinc-500">{ev.detail}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="flex gap-1 border-t border-zinc-800 p-2">
        {EVENTS.map((ev) => (
          <button
            key={ev.id}
            type="button"
            onClick={() => setActive(ev.id)}
            className={cn('h-1.5 flex-1 rounded-full transition', active === ev.id ? 'bg-framekit-500' : 'bg-zinc-700')}
            aria-label={ev.title}
          />
        ))}
      </div>
    </aside>
  )
}
