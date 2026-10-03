import * as React from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type ArticleSection = { id: string; title: string; paragraphs: string[] }

export type ReadingProgressTocProps = {
  title?: string
  meta?: string
  sections?: ArticleSection[]
  scrollContainer?: React.RefObject<HTMLElement | null>
  /** Words per minute for the “min left” estimate. */
  wpm?: number
  className?: string
}

const SECTIONS: ArticleSection[] = [
  { id: 'why', title: 'Why motion needs a budget', paragraphs: ['Every animation spends attention. A page that moves everywhere teaches visitors to stop noticing — so decide where motion earns its keep: state changes, hierarchy, and the one moment you want remembered.', 'On this site that budget is three moments: the intro, the project hover, and the contact confirmation. Everything else stays still.'] },
  { id: 'springs', title: 'Springs, not curves', paragraphs: ['Springs carry momentum, so interrupted motion feels physical instead of restarted. A stiffness around 300 with damping near 30 settles quickly without wobble — perfect for UI chrome.', 'Reserve the bouncy settings (damping under 18) for rewards: a confirmed form, a copied email, a toggled switch.'] },
  { id: 'scroll', title: 'Scroll-linked, not scroll-jacked', paragraphs: ['Tie visuals to scroll progress, but never take the wheel away. A drawn timeline, a filling bar and a lit table of contents all respond to the reader; none of them move the page for the reader.', 'Smooth the raw progress through a spring so quick flicks don’t make the UI jitter.'] },
  { id: 'a11y', title: 'Respect the reader', paragraphs: ['Honour prefers-reduced-motion by keeping layout and final states while dropping travel. Keep focus rings visible, keep contrast above 4.5:1, and give every moving thing a pause.', 'Fast sites and accessible sites are the same site: fewer surprises, more clarity.'] },
]

/**
 * Reading Progress + TOC — a spring-smoothed reading bar and a sticky table of contents that lights the section on
 * screen, shows each section's own progress and a live “min left” estimate. Built for long-form blog posts.
 */
export function ReadingProgressToc({ title = 'A motion budget for portfolios', meta = 'Journal · 6 min read', sections = SECTIONS, scrollContainer, wpm = 220, className }: ReadingProgressTocProps) {
  const reduced = usePrefersReducedMotion()
  const article = React.useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: article, container: scrollContainer, offset: ['start start', 'end end'] })
  const bar = useSpring(scrollYProgress, { stiffness: 150, damping: 28, mass: 0.3 })
  const [active, setActive] = React.useState(sections[0]?.id ?? '')
  const [p, setP] = React.useState(0)
  React.useEffect(() => scrollYProgress.on('change', (v) => setP(v)), [scrollYProgress])
  const words = React.useMemo(() => sections.reduce((a, s) => a + s.paragraphs.join(' ').split(/\s+/).length, 0), [sections])
  const left = Math.max(0, Math.ceil((words / wpm) * (1 - p)))

  React.useEffect(() => {
    const els = sections.map((s) => article.current?.querySelector<HTMLElement>(`[data-sec="${s.id}"]`)).filter((e): e is HTMLElement => !!e)
    const io = new IntersectionObserver((es) => { const hit = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]; if (hit) setActive((hit.target as HTMLElement).dataset.sec ?? '') }, { root: scrollContainer?.current ?? null, rootMargin: '-20% 0px -65% 0px' })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [sections, scrollContainer])

  const jump = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    const el = article.current?.querySelector<HTMLElement>(`[data-sec="${id}"]`)
    el?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    el?.focus({ preventScroll: true })
  }

  return (
    <div className={cn('relative w-full max-w-4xl', className)}>
      <div className="sticky top-0 z-20 h-1 w-full bg-zinc-200/70 dark:bg-zinc-800/70" role="progressbar" aria-label="Reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(p * 100)}>
        <motion.div className="h-full origin-left bg-gradient-to-r from-signal-500 via-signal-600 to-framekit-500" style={{ scaleX: bar }} />
      </div>
      <div className="grid gap-8 px-1 pt-8 lg:grid-cols-[1fr_210px]">
        <article ref={article} className="min-w-0">
          <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">{meta}</p>
          <h2 className="mt-2 font-display text-4xl leading-[1.05] tracking-tight text-zinc-950 sm:text-5xl dark:text-zinc-50">{title}</h2>
          <div className="mt-8 space-y-10">
            {sections.map((s) => (
              <section key={s.id} data-sec={s.id} tabIndex={-1} aria-labelledby={`rp-${s.id}`} className="scroll-mt-6 outline-none">
                <h3 id={`rp-${s.id}`} className="font-display text-2xl text-zinc-950 dark:text-zinc-50">{s.title}</h3>
                {s.paragraphs.map((t, i) => <p key={i} className="mt-3 max-w-[62ch] text-base leading-[1.75] text-zinc-700 dark:text-zinc-300">{t}</p>)}
              </section>
            ))}
          </div>
        </article>
        <aside className="hidden lg:block">
          <nav aria-label="Table of contents" className="sticky top-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-400">On this page</p>
            <ol className="mt-3 space-y-0.5 border-l border-zinc-200 dark:border-zinc-800">
              {sections.map((s) => {
                const on = s.id === active
                return (
                  <li key={s.id} className="relative">
                    {on && <motion.span layoutId="rp-toc-mark" className="absolute -left-px top-1 bottom-1 w-0.5 rounded-full bg-signal-600 dark:bg-signal-300" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                    <a href={`#${s.id}`} onClick={(e) => jump(e, s.id)} aria-current={on ? 'location' : undefined} className={cn('block min-h-11 py-2.5 pl-4 pr-2 text-sm leading-snug transition-[color,transform] duration-200', on ? 'translate-x-0.5 font-semibold text-zinc-950 dark:text-zinc-50' : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100')}>{s.title}</a>
                  </li>
                )
              })}
            </ol>
            <p className="mt-4 pl-4 font-mono text-xs tabular-nums text-zinc-600 dark:text-zinc-400" aria-live="off">{Math.round(p * 100)}% · {left || '<1'} min left</p>
          </nav>
        </aside>
      </div>
    </div>
  )
}
