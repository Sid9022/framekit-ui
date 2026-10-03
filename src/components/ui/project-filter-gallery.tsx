import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { PortfolioArt, SAMPLE_PROJECTS, type PortfolioProject } from '@/lib/portfolio-art'

export type ProjectFilterGalleryProps = {
  items?: PortfolioProject[]
  /** Label of the “show everything” chip. */
  allLabel?: string
  /** Controlled / uncontrolled active category. */
  value?: string
  defaultValue?: string
  onValueChange?: (category: string) => void
  onSelect?: (project: PortfolioProject) => void
  titleAs?: 'h2' | 'h3' | 'h4' | 'p'
  className?: string
}

/**
 * Project Filter Gallery — category chips share a sliding pill (layout animation) while the grid re-flows:
 * survivors glide to their new cells, newcomers bloom in with a blur-to-sharp stagger. Announces the result count.
 */
export function ProjectFilterGallery({ items = SAMPLE_PROJECTS, allLabel = 'All work', value, defaultValue, onValueChange, onSelect, titleAs = 'h3', className }: ProjectFilterGalleryProps) {
  const reduced = usePrefersReducedMotion()
  const [inner, setInner] = React.useState(defaultValue ?? allLabel)
  const current = value ?? inner
  const uid = React.useId()
  const Title = titleAs
  const cats = React.useMemo(() => [allLabel, ...Array.from(new Set(items.map((i) => i.category)))], [items, allLabel])
  const shown = current === allLabel ? items : items.filter((i) => i.category === current)
  const set = (c: string) => { setInner(c); onValueChange?.(c) }
  const spring = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 380, damping: 34 }

  return (
    <section aria-label="Selected work" className={cn('w-full max-w-3xl', className)}>
      <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-1.5">
        {cats.map((c) => {
          const on = c === current
          const n = c === allLabel ? items.length : items.filter((i) => i.category === c).length
          return (
            <button
              key={c}
              type="button"
              aria-pressed={on}
              onClick={() => set(c)}
              className={cn('relative min-h-11 rounded-full px-4 text-sm font-medium transition-colors duration-150 active:scale-[0.97] motion-reduce:active:scale-100', on ? 'text-white dark:text-zinc-950' : 'text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white')}
            >
              {on && <motion.span layoutId={`${uid}-pill`} transition={spring} className="absolute inset-0 rounded-full bg-zinc-950 dark:bg-zinc-50" />}
              {!on && <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700" />}
              <span className="relative flex items-center gap-1.5">{c}<span className={cn('rounded-full px-1.5 text-[11px] tabular-nums', on ? 'bg-white/20 dark:bg-black/15' : 'bg-zinc-200/70 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300')}>{n}</span></span>
            </button>
          )
        })}
      </div>
      <p className="sr-only" role="status" aria-live="polite">Showing {shown.length} of {items.length} projects{current === allLabel ? '' : ` in ${current}`}</p>

      <motion.ul layout className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((p, i) => (
            <motion.li
              key={p.id}
              layout={reduced ? false : 'position'}
              initial={reduced ? false : { opacity: 0, scale: 0.88, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.88, filter: 'blur(8px)', transition: { duration: 0.2 } }}
              transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 340, damping: 30, delay: i * 0.04 }}
            >
              <button type="button" onClick={() => onSelect?.(p)} className="group block w-full rounded-2xl text-left">
                <span className="relative block aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-black/10 dark:ring-white/10">
                  <span className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07] group-focus-visible:scale-[1.07] motion-reduce:transition-none"><PortfolioArt seed={p.seed} src={p.src} alt={p.alt ?? ''} /></span>
                  <span className="absolute inset-x-0 bottom-0 flex translate-y-2 items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-3 pt-10 text-xs font-medium text-white opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none">
                    <span>{p.role ?? p.category}</span><span aria-hidden>View →</span>
                  </span>
                </span>
                <span className="mt-3 flex items-baseline justify-between gap-3 px-0.5">
                  <Title className="font-display text-2xl leading-tight text-zinc-950 dark:text-zinc-50">{p.title}</Title>
                  <span className="shrink-0 text-xs tabular-nums text-zinc-600 dark:text-zinc-400">{p.year}</span>
                </span>
                <span className="mt-0.5 block px-0.5 text-sm text-zinc-600 dark:text-zinc-400">{p.category}</span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </section>
  )
}
