import * as React from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type IslandSection = { id: string; label: string; icon: React.ReactNode }

export type IslandSectionNavProps = {
  sections: IslandSection[]
  /** Scrolling element that holds the sections (defaults to the window). */
  scrollContainer?: React.RefObject<HTMLElement | null>
  /** Accessible name for the landmark. */
  label?: string
  className?: string
}

/**
 * Island Section Nav — a floating pill that shows where you are (current section + a scroll-progress ring) and swells into
 * a full jump bar on hover, focus or tap, then settles back. Place it as a `sticky bottom-4` child of the scrolling area.
 */
export function IslandSectionNav({ sections, scrollContainer, label = 'Page sections', className }: IslandSectionNavProps) {
  const reduced = usePrefersReducedMotion()
  const [current, setCurrent] = React.useState(sections[0]?.id)
  const [open, setOpen] = React.useState(false)
  const rootRef = React.useRef<HTMLElement>(null)
  const timer = React.useRef<number>(undefined)
  const { scrollYProgress } = useScroll({ container: scrollContainer })
  const prog = useSpring(scrollYProgress, { stiffness: 140, damping: 26 })
  const dash = React.useRef<SVGCircleElement>(null)
  useMotionValueEvent(prog, 'change', (v) => dash.current?.setAttribute('stroke-dashoffset', String(100 - Math.max(0, Math.min(1, v)) * 100)))

  React.useEffect(() => {
    const root = scrollContainer?.current ?? null
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
    if (!els.length) return
    const io = new IntersectionObserver((entries) => { for (const e of entries) if (e.isIntersecting) setCurrent(e.target.id) }, { root, rootMargin: '-45% 0px -50% 0px', threshold: 0 })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [sections, scrollContainer])

  const arm = () => { window.clearTimeout(timer.current) }
  const settle = () => { arm(); timer.current = window.setTimeout(() => setOpen(false), 1400) }
  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    setCurrent(id); settle()
  }
  const cur = sections.find((s) => s.id === current) ?? sections[0]

  return (
    <nav
      ref={rootRef}
      aria-label={label}
      className={cn('pointer-events-none sticky bottom-4 z-30 flex justify-center', className)}
      onPointerEnter={() => { arm(); setOpen(true) }}
      onPointerLeave={settle}
      onFocus={() => { arm(); setOpen(true) }}
      onBlur={(e) => { if (!rootRef.current?.contains(e.relatedTarget as Node)) settle() }}
      onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false) }}
    >
      <motion.div
        layout
        className="pointer-events-auto flex items-center gap-1 rounded-full border border-zinc-300 bg-white/90 p-1.5 shadow-[0_14px_40px_-12px_rgb(0_0_0/0.4)] backdrop-blur-xl dark:border-zinc-700 dark:bg-zinc-900/90"
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 32 }}
      >
        <motion.button
          layout
          type="button"
          aria-expanded={open}
          aria-label={`Current section: ${cur?.label}. ${open ? 'Collapse' : 'Expand'} navigation`}
          onClick={() => setOpen(!open)}
          className="relative flex min-h-11 items-center gap-2.5 rounded-full py-1 pl-1.5 pr-3.5 text-sm font-medium text-zinc-950 outline-none focus-visible:ring-2 focus-visible:ring-signal-600 dark:text-zinc-50 dark:focus-visible:ring-signal-300"
        >
          <span className="relative grid size-9 place-items-center">
            <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden>
              <circle cx="18" cy="18" r="15.9" fill="none" strokeWidth="2.5" className="stroke-zinc-200 dark:stroke-zinc-700" />
              <circle ref={dash} cx="18" cy="18" r="15.9" fill="none" strokeWidth="2.5" strokeLinecap="round" pathLength="100" strokeDasharray="100" strokeDashoffset="100" className="stroke-framekit-500" />
            </svg>
            <span className="relative text-zinc-800 dark:text-zinc-100 [&>svg]:size-4">{cur?.icon}</span>
          </span>
          <AnimatePresence mode="popLayout" initial={false}>
            {!open && (
              <motion.span key={cur?.id} initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }} className="whitespace-nowrap">
                {cur?.label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.ul
              initial={reduced ? { opacity: 0 } : { opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, width: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 34 }}
              className="flex items-center gap-0.5 overflow-hidden"
            >
              {sections.map((s) => {
                const on = s.id === current
                return (
                  <li key={s.id}>
                    <button type="button" onClick={() => go(s.id)} aria-current={on ? 'location' : undefined} aria-label={s.label} className="relative flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full px-3 text-sm text-zinc-700 outline-none transition-colors hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-signal-600 dark:text-zinc-300 dark:hover:text-white dark:focus-visible:ring-signal-300 [&>span>svg]:size-[18px]">
                      {on && <motion.span layoutId="island-pill" aria-hidden className="absolute inset-0 rounded-full bg-zinc-950/[0.07] dark:bg-white/10" transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 36 }} />}
                      <span className="relative" aria-hidden>{s.icon}</span>
                      <span className={cn('relative hidden whitespace-nowrap font-medium sm:inline', on && 'text-zinc-950 dark:text-white')}>{s.label}</span>
                    </button>
                  </li>
                )
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  )
}
