import * as React from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { PortfolioArt, SAMPLE_PROJECTS, type PortfolioProject } from '@/lib/portfolio-art'

export type PinnedProjectReelProps = {
  items?: PortfolioProject[]
  scrollContainer?: React.RefObject<HTMLElement | null>
  /** Height of the pinned stage (px or any CSS length). */
  height?: number | string
  heading?: string
  onSelect?: (p: PortfolioProject) => void
  titleAs?: 'h2' | 'h3' | 'h4'
  className?: string
}

/**
 * Pinned Project Reel — the section pins to the viewport and your vertical scroll slides a film-strip of project cards
 * sideways, with a counter and progress line. Focusing a card scrolls the page to it; reduced motion becomes a plain snap scroller.
 */
export function PinnedProjectReel({ items = SAMPLE_PROJECTS, scrollContainer, height = '100svh', heading = 'Selected work', onSelect, titleAs = 'h3', className }: PinnedProjectReelProps) {
  const reduced = usePrefersReducedMotion()
  const outer = React.useRef<HTMLDivElement>(null)
  const view = React.useRef<HTMLDivElement>(null)
  const track = React.useRef<HTMLDivElement>(null)
  const [dist, setDist] = React.useState(0)
  const [stageH, setStageH] = React.useState(0)
  const Title = titleAs

  React.useEffect(() => {
    const measure = () => { if (view.current && track.current) { setDist(Math.max(0, track.current.scrollWidth - view.current.clientWidth)); setStageH(view.current.clientHeight) } }
    measure()
    const ro = new ResizeObserver(measure)
    if (view.current) ro.observe(view.current)
    if (track.current) ro.observe(track.current)
    return () => ro.disconnect()
  }, [items.length])

  const { scrollYProgress } = useScroll({ target: outer, container: scrollContainer, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 })
  const x = useTransform(smooth, (v) => -v * dist)
  const bar = useTransform(smooth, [0, 1], ['0%', '100%'])
  const [idx, setIdx] = React.useState(1)
  React.useEffect(() => smooth.on('change', (v) => setIdx(Math.min(items.length, Math.max(1, Math.round(v * (items.length - 1)) + 1)))), [smooth, items.length])

  const focusCard = (i: number) => {
    if (reduced || !outer.current || !view.current || !track.current) return
    const card = track.current.children[i + 1] as HTMLElement | undefined
    if (!card || dist <= 0) return
    const target = Math.min(1, Math.max(0, (card.offsetLeft + card.offsetWidth / 2 - view.current.clientWidth / 2) / dist))
    const scroller = scrollContainer?.current ?? null
    const rect = outer.current.getBoundingClientRect()
    if (scroller) scroller.scrollTo({ top: rect.top - scroller.getBoundingClientRect().top + scroller.scrollTop + target * dist, behavior: 'auto' })
    else window.scrollTo({ top: rect.top + window.scrollY + target * dist, behavior: 'auto' })
  }

  if (reduced) {
    return (
      <section aria-label={heading} className={cn('w-full max-w-4xl', className)}>
        <h2 className="mb-4 font-display text-4xl text-zinc-950 dark:text-zinc-50">{heading}</h2>
        <div tabIndex={0} role="region" aria-label={`${heading} cards`} className="framekit-scroll flex snap-x gap-4 overflow-x-auto pb-4">
          {items.map((p, i) => <ReelCard key={p.id} p={p} i={i} n={items.length} Title={Title} onSelect={onSelect} className="snap-start" />)}
        </div>
      </section>
    )
  }

  const outerH = dist + (stageH || 0)
  return (
    <section aria-label={heading} className={cn('relative w-full', className)}>
      <div ref={outer} style={{ height: outerH || undefined }}>
        <div ref={view} className="sticky top-0 overflow-hidden" style={{ height }}>
          <motion.div ref={track} className="flex h-full items-stretch gap-4 px-4 py-6 will-change-transform sm:gap-5 sm:px-6" style={{ x }}>
            <div className="flex w-[15rem] shrink-0 flex-col justify-between pr-2 sm:w-[18rem]">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-600 dark:text-zinc-400">[ {items.length} projects ]</p>
                <h2 className="mt-3 font-display text-5xl leading-[0.92] tracking-tight text-zinc-950 sm:text-6xl dark:text-zinc-50">{heading}</h2>
              </div>
              <p className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">Keep scrolling <ArrowRight className="size-4" aria-hidden /></p>
            </div>
            {items.map((p, i) => <ReelCard key={p.id} p={p} i={i} n={items.length} Title={Title} onSelect={onSelect} onFocus={() => focusCard(i)} />)}
            <div aria-hidden className="w-4 shrink-0" />
          </motion.div>
          <div className="pointer-events-none absolute inset-x-4 bottom-3 flex items-center gap-3 sm:inset-x-6">
            <span aria-live="polite" className="rounded-full bg-zinc-950 px-2.5 py-1 font-mono text-[11px] tabular-nums text-white dark:bg-zinc-50 dark:text-zinc-950"><span className="sr-only">Card </span>{String(idx).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
            <span className="relative h-px flex-1 bg-zinc-300 dark:bg-zinc-700"><motion.span className="absolute inset-y-[-1px] left-0 bg-framekit-500" style={{ width: bar, height: 3 }} /></span>
          </div>
        </div>
      </div>
    </section>
  )
}

function ReelCard({ p, i, n, Title, onSelect, onFocus, className }: { p: PortfolioProject; i: number; n: number; Title: 'h2' | 'h3' | 'h4'; onSelect?: (p: PortfolioProject) => void; onFocus?: () => void; className?: string }) {
  const Tag = p.href ? 'a' : 'button'
  return (
    <article className={cn('group relative flex h-full w-[16.5rem] shrink-0 flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_20px_40px_-28px_rgb(0_0_0/0.5)] sm:w-[21rem] dark:border-zinc-800 dark:bg-zinc-900', className)} style={{ maxHeight: 460 }}>
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.06] group-focus-within:scale-[1.06]"><PortfolioArt seed={p.seed ?? i + 1} src={p.src} alt={p.src ? p.alt ?? p.title : ''} /></div>
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 font-mono text-[11px] text-zinc-900 backdrop-blur">{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
      </div>
      <div className="p-4 sm:p-5">
        <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400">{p.category} · {p.year}</p>
        <Title className="mt-1 font-display text-2xl leading-tight tracking-tight text-zinc-950 sm:text-[1.7rem] dark:text-zinc-50">
          <Tag {...(p.href ? { href: p.href } : { type: 'button' as const })} onClick={() => onSelect?.(p)} onFocus={onFocus} className="rounded-md outline-none after:absolute after:inset-0 after:content-[''] focus-visible:ring-2 focus-visible:ring-signal-600 dark:focus-visible:ring-signal-300">{p.title}</Tag>
        </Title>
        <p className="mt-1.5 line-clamp-2 text-sm text-zinc-700 dark:text-zinc-300">{p.blurb}</p>
      </div>
    </article>
  )
}
