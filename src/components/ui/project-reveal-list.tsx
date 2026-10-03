import * as React from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { PortfolioArt, SAMPLE_PROJECTS, type PortfolioProject } from '@/lib/portfolio-art'

export type ProjectRevealListProps = {
  /** Projects to list. Each may carry an optional `src`; otherwise generated art is shown. */
  items?: PortfolioProject[]
  onSelect?: (project: PortfolioProject) => void
  /** Heading level used for the project titles (keeps the page outline valid). */
  titleAs?: 'h2' | 'h3' | 'h4' | 'p'
  className?: string
}

/**
 * Project Reveal List — an editorial index of work. Hovering (or focusing) a row dims its siblings, nudges the
 * title and floats a tilting preview that chases the cursor on a spring and unmasks with a clip-path.
 * Touch screens get an inline thumbnail on every row instead.
 */
export function ProjectRevealList({ items = SAMPLE_PROJECTS, onSelect, titleAs = 'h3', className }: ProjectRevealListProps) {
  const reduced = usePrefersReducedMotion()
  const wrap = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState<string | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.7 })
  const sy = useSpring(y, { stiffness: 260, damping: 26, mass: 0.7 })
  const vx = useVelocity(sx)
  const rotate = useSpring(useTransform(vx, [-1800, 0, 1800], [-9, 0, 9]), { stiffness: 200, damping: 20 })
  const Title = titleAs
  const W = 280
  const H = 196

  const place = (clientX: number, clientY: number) => {
    const b = wrap.current?.getBoundingClientRect()
    if (!b) return
    x.set(Math.max(-20, Math.min(b.width - W + 20, clientX - b.left - W / 2)))
    y.set(clientY - b.top - H / 2)
  }
  const placeFromRow = (el: HTMLElement) => {
    const b = wrap.current?.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    if (!b) return
    x.set(Math.max(0, b.width - W - 24))
    y.set(r.top - b.top + r.height / 2 - H / 2)
  }
  const Tag = (p: PortfolioProject) => (p.href ? 'a' : 'button')

  return (
    <div ref={wrap} className={cn('relative w-full max-w-3xl', className)} onPointerLeave={() => setActive(null)}>
      <ul className="divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {items.map((p, i) => {
          const T = Tag(p) as 'a' | 'button'
          const dim = active !== null && active !== p.id
          return (
            <li key={p.id}>
              <T
                {...(p.href ? { href: p.href } : { type: 'button' as const })}
                onClick={() => onSelect?.(p)}
                onPointerEnter={(e: React.PointerEvent) => { if (e.pointerType === 'mouse') { setActive(p.id); place(e.clientX, e.clientY) } }}
                onPointerMove={(e: React.PointerEvent) => { if (e.pointerType === 'mouse') place(e.clientX, e.clientY) }}
                onFocus={(e: React.FocusEvent<HTMLElement>) => { setActive(p.id); if (e.currentTarget.matches(':focus-visible')) placeFromRow(e.currentTarget) }}
                onBlur={() => setActive(null)}
                className="group flex min-h-[72px] w-full items-center gap-4 px-2 py-4 text-left outline-offset-[-2px] sm:gap-6 sm:px-4"
              >
                <span className="w-7 shrink-0 font-mono text-xs tabular-nums text-zinc-600 dark:text-zinc-400" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                <motion.span
                  className="flex min-w-0 flex-1 flex-col gap-0.5"
                  animate={{ x: active === p.id && !reduced ? 14 : 0, opacity: dim ? 0.55 : 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                >
                  <Title className="font-display text-3xl leading-[1.05] tracking-tight text-zinc-950 sm:text-5xl dark:text-zinc-50">{p.title}</Title>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">{p.category} · {p.year}</span>
                </motion.span>
                <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg ring-1 ring-black/10 sm:hidden dark:ring-white/10"><PortfolioArt seed={p.seed} src={p.src} alt={p.alt ?? ''} /></span>
                <motion.span
                  className="hidden shrink-0 text-zinc-700 sm:block dark:text-zinc-300"
                  animate={{ x: active === p.id && !reduced ? 0 : -6, y: active === p.id && !reduced ? 0 : 6, opacity: active === p.id ? 1 : 0.5 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                  aria-hidden
                >
                  <ArrowUpRight className="h-6 w-6" />
                </motion.span>
              </T>
            </li>
          )
        })}
      </ul>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-10 hidden overflow-hidden rounded-2xl shadow-[0_2px_4px_rgb(0_0_0/0.12),0_24px_48px_-12px_rgb(0_0_0/0.4)] ring-1 ring-black/10 sm:block dark:ring-white/15"
        style={{ width: W, height: H, x: reduced ? x : sx, y: reduced ? y : sy, rotate: reduced ? 0 : rotate }}
        initial={false}
        animate={{ clipPath: active ? 'inset(0% 0% 0% 0% round 16px)' : 'inset(50% 50% 50% 50% round 16px)', scale: active ? 1 : 0.8, opacity: active ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
      >
        <AnimatePresence initial={false}>
          {items.map((p) => active === p.id && (
            <motion.div key={p.id} className="absolute inset-0" initial={{ opacity: 0, scale: 1.18 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
              <PortfolioArt seed={p.seed} src={p.src} alt="" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
