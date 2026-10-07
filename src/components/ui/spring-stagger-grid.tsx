import * as React from 'react'
import { AnimatePresence, motion, MotionConfig } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type StaggerItem = { id: string; title: string; tag: string; hue: number }

export type SpringStaggerGridProps = { items?: StaggerItem[]; tags?: string[]; className?: string }

const T = ['Motion', 'Layout', 'Color', 'Type']
export const DEFAULT_STAGGER_ITEMS: StaggerItem[] = Array.from({ length: 12 }, (_, i) => ({ id: `s${i}`, title: ['Orbit', 'Flux', 'Grain', 'Prism', 'Drift', 'Pulse', 'Glyph', 'Halo', 'Tide', 'Ember', 'Quill', 'Nimbus'][i], tag: T[i % 4], hue: (i * 37) % 360 }))

/**
 * Spring Stagger Grid — a filterable grid whose tiles enter on a diagonal
 * ripple from the top-left (delay = row + column), re-flow on layout springs
 * when filtered and exit with a quick scale-down. Filter is a radio group.
 */
export function SpringStaggerGrid({ items = DEFAULT_STAGGER_ITEMS, tags = ['All', ...T], className }: SpringStaggerGridProps) {
  const reduced = usePrefersReducedMotion()
  const [tag, setTag] = React.useState('All')
  const [cols, setCols] = React.useState(4)
  const ref = React.useRef<HTMLUListElement>(null)
  React.useEffect(() => {
    const el = ref.current; if (!el) return
    const ro = new ResizeObserver(() => setCols(getComputedStyle(el).gridTemplateColumns.split(' ').length))
    ro.observe(el); return () => ro.disconnect()
  }, [])
  const shown = items.filter((x) => tag === 'All' || x.tag === tag)
  return (
    <MotionConfig transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 30 }}>
      <div className={cn('w-full', className)}>
        <div role="radiogroup" aria-label="Filter" className="mb-5 inline-flex flex-wrap gap-1 rounded-full bg-zinc-100 p-1 dark:bg-zinc-900">
          {tags.map((t) => (
            <button key={t} role="radio" aria-checked={tag === t} onClick={() => setTag(t)} className="relative h-8 rounded-full px-3.5 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
              {tag === t && <motion.span layoutId="ssg-pill" className="absolute inset-0 rounded-full bg-white shadow-[0_1px_2px_rgb(0_0_0/0.1)] ring-1 ring-black/5 dark:bg-zinc-700 dark:ring-white/10" />}
              <span className={cn('relative', tag === t ? 'text-zinc-950 dark:text-white' : 'text-zinc-600 dark:text-zinc-400')}>{t}</span>
            </button>
          ))}
        </div>
        <motion.ul ref={ref} layout className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-live="polite">
          <AnimatePresence mode="popLayout">
            {shown.map((x, i) => {
              const r = Math.floor(i / cols), c = i % cols
              return (
                <motion.li key={x.id + tag} layout initial={reduced ? false : { opacity: 0, y: 24, scale: 0.92, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: reduced ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 24, delay: (r + c) * 0.055 } }} exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                  whileHover={reduced ? undefined : { y: -3 }} className="group relative aspect-[4/3] overflow-hidden rounded-[18px] ring-1 ring-black/[0.06] dark:ring-white/[0.08]"
                  style={{ background: `linear-gradient(140deg, hsl(${x.hue} 80% 62%), hsl(${(x.hue + 50) % 360} 75% 42%))` }}>
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/55 to-transparent p-3 pt-8">
                    <span className="text-sm font-semibold text-white">{x.title}</span>
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">{x.tag}</span>
                  </div>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </motion.ul>
      </div>
    </MotionConfig>
  )
}
