import * as React from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { PortfolioArt, SAMPLE_PROJECTS, type PortfolioProject } from '@/lib/portfolio-art'

export type StickyCardStackProps = {
  items?: PortfolioProject[]
  /** Scrolling element that holds the stack (defaults to the window). */
  scrollContainer?: React.RefObject<HTMLElement | null>
  /** Height of each card in px. */
  cardHeight?: number
  onSelect?: (p: PortfolioProject) => void
  titleAs?: 'h2' | 'h3' | 'h4'
  className?: string
}

function StackCard({ p, i, n, progress, height, Title, onSelect, reduced }: { p: PortfolioProject; i: number; n: number; progress: MotionValue<number>; height: number; Title: 'h2' | 'h3' | 'h4'; onSelect?: (p: PortfolioProject) => void; reduced: boolean }) {
  const from = i / n
  const scale = useTransform(progress, [from, 1], [1, 1 - (n - 1 - i) * 0.045])
  const shade = useTransform(progress, [from, Math.min(1, from + 0.32)], [0, 0.34])
  const hue = ((p.seed ?? i) * 47) % 360
  const Tag = p.href ? 'a' : 'button'
  return (
    <div className="sticky" style={{ top: 12 + i * 16, height, marginBottom: 28, zIndex: i + 1 }}>
      <motion.article
        className="relative grid h-full origin-top overflow-hidden rounded-[2rem] border border-black/10 bg-[hsl(var(--h)_70%_93%)] shadow-[0_-14px_40px_-22px_rgb(0_0_0/0.45)] sm:grid-cols-[1.05fr_1fr] dark:border-white/10 dark:bg-[hsl(var(--h)_32%_13%)]"
        style={{ ['--h' as string]: hue, scale: reduced ? 1 : scale }}
      >
        <div className="relative z-10 flex min-h-0 flex-col justify-between gap-3 p-5 sm:p-8">
          <div className="flex items-center justify-between font-mono text-xs text-zinc-700 dark:text-zinc-300">
            <span>{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
            <span>{p.category} · {p.year}</span>
          </div>
          <div>
            <Title className="font-display text-[2rem] leading-[0.98] tracking-tight text-zinc-950 sm:text-5xl dark:text-zinc-50">
              <Tag {...(p.href ? { href: p.href } : { type: 'button' as const })} onClick={() => onSelect?.(p)} className="rounded-md outline-none after:absolute after:inset-0 after:z-20 after:content-[''] focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white">{p.title}</Tag>
            </Title>
            <p className="mt-2 line-clamp-3 max-w-md text-sm leading-relaxed text-zinc-800 sm:mt-3 sm:text-base dark:text-zinc-200">{p.blurb}</p>
          </div>
          <div className="flex items-end justify-between gap-3">
            <ul className="flex flex-wrap gap-1.5">{(p.tags ?? []).map((t) => <li key={t} className="rounded-full border border-black/15 bg-white/60 px-2.5 py-1 text-xs text-zinc-900 dark:border-white/20 dark:bg-white/10 dark:text-zinc-100">{t}</li>)}</ul>
            <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950"><ArrowUpRight className="size-5" /></span>
          </div>
        </div>
        <div className="relative order-first h-32 overflow-hidden sm:order-none sm:h-auto sm:m-3 sm:rounded-[1.5rem]">
          <PortfolioArt seed={p.seed ?? i + 1} src={p.src} alt={p.src ? p.alt ?? p.title : ''} />
        </div>
        <motion.span aria-hidden className="pointer-events-none absolute inset-0 z-30 bg-black" style={{ opacity: reduced ? 0 : shade }} />
      </motion.article>
    </div>
  )
}

/**
 * Sticky Card Stack — project cards that pin one over the next like a deck being dealt: every card shrinks back and dims as
 * the following one slides up over it, each peeking out by a few pixels. Scroll-driven, no JS layout.
 */
export function StickyCardStack({ items = SAMPLE_PROJECTS.slice(0, 5), scrollContainer, cardHeight = 380, onSelect, titleAs = 'h3', className }: StickyCardStackProps) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, container: scrollContainer, offset: ['start start', 'end end'] })
  return (
    <div ref={ref} className={cn('relative w-full max-w-3xl pb-4', className)}>
      {items.map((p, i) => <StackCard key={p.id} p={p} i={i} n={items.length} progress={scrollYProgress} height={cardHeight} Title={titleAs} onSelect={onSelect} reduced={reduced} />)}
    </div>
  )
}
