import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type Announcement = { tag?: string; text: string; href?: string; cta?: string }

export type AnnouncementBarProps = {
  messages?: Announcement[]
  /** ms each message stays before rotating. */
  interval?: number
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

export const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  { tag: 'New', text: 'Branch databases are now in public beta', cta: 'Read the post' },
  { tag: 'Event', text: 'Ship Week starts Oct 21 — five launches in five days', cta: 'Save a seat' },
  { tag: 'Pricing', text: 'Pro is 20% off when billed yearly', cta: 'See plans' },
]

/**
 * Announcement Bar — a slim top-of-page bar on an ink gradient with a light
 * sheen that sweeps across, rotating messages that roll vertically with a
 * blur, dots to pick one, pause on hover/focus, and a dismiss that collapses
 * the bar’s height smoothly.
 */
export function AnnouncementBar({ messages = DEFAULT_ANNOUNCEMENTS, interval = 4500, dismissible = true, onDismiss, className }: AnnouncementBarProps) {
  const reduced = usePrefersReducedMotion()
  const [i, setI] = React.useState(0)
  const [hold, setHold] = React.useState(false)
  const [open, setOpen] = React.useState(true)
  React.useEffect(() => {
    if (hold || messages.length < 2 || !open || reduced) return
    const t = window.setTimeout(() => setI((x) => (x + 1) % messages.length), interval)
    return () => window.clearTimeout(t)
  }, [i, hold, messages.length, interval, open, reduced])
  const m = messages[i]
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.aside aria-label="Announcement" key="bar" exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}
          className={cn('relative w-full overflow-hidden bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white', className)}>
          {!reduced && <motion.span aria-hidden className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" animate={{ x: ['-100%', '400%'] }} transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }} />}
          <div className="relative mx-auto flex min-h-11 max-w-5xl items-center justify-center gap-3 px-12 py-2 text-[13px]">
            <div className="relative grid min-w-0 overflow-hidden" aria-live="polite">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.a key={i} href={m.href ?? '#'}
                  initial={reduced ? { opacity: 0 } : { y: 16, opacity: 0, filter: 'blur(4px)' }} animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }} exit={reduced ? { opacity: 0 } : { y: -16, opacity: 0, filter: 'blur(4px)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="group flex min-w-0 items-center gap-2 rounded-[6px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
                  {m.tag && <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] ring-1 ring-white/15">{m.tag}</span>}
                  <span className="truncate text-zinc-100">{m.text}</span>
                  {m.cta && <span className="hidden shrink-0 items-center gap-1 font-medium text-white sm:inline-flex">{m.cta}<ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" /></span>}
                </motion.a>
              </AnimatePresence>
            </div>
            {messages.length > 1 && (
              <div className="hidden items-center gap-1 md:flex">
                {messages.map((_, k) => (
                  <button key={k} type="button" aria-label={`Announcement ${k + 1} of ${messages.length}`} aria-current={k === i || undefined} onClick={() => setI(k)} className="grid size-5 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
                    <span className={cn('h-1.5 rounded-full bg-white transition-all duration-300', k === i ? 'w-4 opacity-100' : 'w-1.5 opacity-40')} />
                  </button>
                ))}
              </div>
            )}
            {dismissible && (
              <button type="button" aria-label="Dismiss announcement" onClick={() => { setOpen(false); onDismiss?.() }} className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-zinc-300 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
                <X className="size-4" />
              </button>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
