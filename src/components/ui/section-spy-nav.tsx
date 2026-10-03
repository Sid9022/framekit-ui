import * as React from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type SpySection = { id: string; label: string }

export type SectionSpyNavProps = {
  /** Sections to track — each `id` must exist in the DOM. */
  sections?: SpySection[]
  /** Scroll element (defaults to the window). */
  scrollContainer?: React.RefObject<HTMLElement | null>
  orientation?: 'horizontal' | 'vertical'
  value?: string
  onValueChange?: (id: string) => void
  'aria-label'?: string
  className?: string
}

const DEFAULT_SECTIONS: SpySection[] = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'journal', label: 'Journal' },
  { id: 'contact', label: 'Contact' },
]

/**
 * Section Spy Nav — a sticky in-page navigation that follows your reading position. A shared pill springs between
 * links as sections cross the reading line, a hairline fills with overall progress, and clicks glide to the section
 * and move focus into it. Works against the window or any scroll container.
 */
export function SectionSpyNav({ sections = DEFAULT_SECTIONS, scrollContainer, orientation = 'horizontal', value, onValueChange, 'aria-label': label = 'On this page', className }: SectionSpyNavProps) {
  const reduced = usePrefersReducedMotion()
  const uid = React.useId()
  const [inner, setInner] = React.useState(sections[0]?.id ?? '')
  const active = value ?? inner
  const { scrollYProgress } = useScroll({ container: scrollContainer })
  const prog = useSpring(scrollYProgress, { stiffness: 160, damping: 28, mass: 0.3 })
  const lock = React.useRef(0)
  const emit = React.useRef(onValueChange)
  emit.current = onValueChange

  React.useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e)
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        if (performance.now() < lock.current) return
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) { setInner(hit.target.id); emit.current?.(hit.target.id) }
      },
      { root: scrollContainer?.current ?? null, rootMargin: '-35% 0px -60% 0px', threshold: 0 },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [sections, scrollContainer])

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    lock.current = performance.now() + 900
    setInner(id)
    onValueChange?.(id)
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
    el.focus({ preventScroll: true })
  }
  const vertical = orientation === 'vertical'

  return (
    <nav aria-label={label} className={cn('relative', vertical ? 'w-44' : 'w-full', className)}>
      <ul className={cn('relative flex gap-1', vertical ? 'flex-col border-l border-zinc-200 pl-2 dark:border-zinc-800' : 'items-center justify-center rounded-full border border-zinc-200 bg-white/80 p-1.5 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80')}>
        {sections.map((s) => {
          const on = s.id === active
          return (
            <li key={s.id} className={vertical ? '' : 'flex-1'}>
              <a href={`#${s.id}`} onClick={(e) => go(e, s.id)} aria-current={on ? 'location' : undefined} className={cn('relative flex min-h-11 items-center justify-center px-2 text-sm font-medium sm:px-4 transition-colors duration-200', vertical ? 'justify-start rounded-lg' : 'rounded-full', on ? 'text-white dark:text-zinc-950' : 'text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white')}>
                {on && <motion.span layoutId={`${uid}-spy`} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }} className={cn('absolute inset-0 bg-zinc-950 dark:bg-zinc-50', vertical ? 'rounded-lg' : 'rounded-full')} />}
                <span className="relative">{s.label}</span>
              </a>
            </li>
          )
        })}
      </ul>
      {!vertical && (
        <span aria-hidden className="pointer-events-none absolute inset-x-5 -bottom-px h-px overflow-hidden"><motion.span className="block h-full origin-left bg-gradient-to-r from-signal-500 to-framekit-500" style={{ scaleX: prog }} /></span>
      )}
    </nav>
  )
}
