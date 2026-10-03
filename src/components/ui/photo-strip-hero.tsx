import * as React from 'react'
import { motion, useAnimationFrame, useMotionValue, useScroll, useVelocity } from 'motion/react'
import { ArrowRight, Pause, Play } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { PortfolioArt, type PortfolioProject } from '@/lib/portfolio-art'

export type PhotoStripHeroProps = {
  eyebrow?: string
  title?: string
  description?: string
  ctaLabel?: string
  onCta?: () => void
  /** Cards for the two rails; each may carry an optional `src`. Defaults to generated art. */
  photos?: Pick<PortfolioProject, 'id' | 'title' | 'seed' | 'src' | 'alt'>[]
  /** px / second base speed. */
  speed?: number
  className?: string
}

const DEFAULT_PHOTOS = Array.from({ length: 8 }, (_, i) => ({ id: `p${i}`, title: ['Dawn study', 'Paper city', 'Salt flats', 'Night market', 'Quiet tide', 'Concrete bloom', 'Field notes', 'Glasshouse'][i], seed: i * 4 + 3 }))
const HEIGHTS = ['h-52', 'h-60', 'h-48', 'h-64', 'h-56']

function Rail({ photos, dir, speed, paused, hold, reduced }: { photos: NonNullable<PhotoStripHeroProps['photos']>; dir: 1 | -1; speed: number; paused: boolean; hold: React.RefObject<boolean>; reduced: boolean }) {
  const track = React.useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const mult = React.useRef(1)
  const { scrollY } = useScroll()
  const sv = useVelocity(scrollY)
  useAnimationFrame((_, delta) => {
    if (reduced) return
    const el = track.current
    if (!el) return
    const half = el.scrollWidth / 2
    const target = paused ? 0 : hold.current ? 0.18 : 1
    mult.current += (target - mult.current) * 0.06
    const boost = Math.min(4, Math.abs(sv.get()) / 900)
    let nx = x.get() - dir * (speed * (mult.current + boost) * delta) / 1000
    if (dir === 1 && nx <= -half) nx += half
    if (dir === -1 && nx >= 0) nx -= half
    x.set(nx)
  })
  React.useEffect(() => { if (dir === -1) x.set(-(track.current?.scrollWidth ?? 0) / 2) }, [dir, x])
  const row = [...photos, ...photos]
  return (
    <div className="overflow-hidden py-2">
      <motion.div ref={track} style={{ x }} className="flex w-max items-end gap-4">
        {row.map((p, i) => (
          <figure key={i} aria-hidden={i >= photos.length || undefined} className={cn('group relative w-40 shrink-0 overflow-hidden rounded-2xl shadow-[0_12px_30px_-12px_rgb(0_0_0/0.45)] ring-1 ring-black/10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:rotate-[-1.5deg] sm:w-48 dark:ring-white/10', HEIGHTS[(i + (dir === 1 ? 0 : 2)) % HEIGHTS.length])}>
            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"><PortfolioArt seed={p.seed} src={p.src} alt={i < photos.length ? p.alt ?? '' : ''} /></div>
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-8 text-xs font-medium text-white">{p.title}</figcaption>
          </figure>
        ))}
      </motion.div>
    </div>
  )
}

/**
 * Photo Strip Hero — a bold headline over two tilted rails of photo cards drifting in opposite directions. The rails
 * ease to a crawl under the pointer, surge with your scroll velocity, and cards lift and tilt on hover. Swap the
 * generated art for real photography via `photos[].src`. A visible Pause button stops the motion.
 */
export function PhotoStripHero({ eyebrow = 'Photographer & visual designer', title = 'Pictures that make people stop scrolling.', description = 'Editorial, product and street work shot on location and finished in-house — available worldwide.', ctaLabel = 'Browse the archive', onCta, photos = DEFAULT_PHOTOS, speed = 38, className }: PhotoStripHeroProps) {
  const reduced = usePrefersReducedMotion()
  const [paused, setPaused] = React.useState(false)
  const hold = React.useRef(false)
  const top = photos
  const bottom = React.useMemo(() => [...photos].reverse(), [photos])
  return (
    <section aria-label="Introduction" onPointerEnter={() => { hold.current = true }} onPointerLeave={() => { hold.current = false }} className={cn('relative isolate flex min-h-[640px] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-[#faf7f2] ring-1 ring-black/5 dark:bg-zinc-950 dark:ring-white/10', className)}>
      <div className="relative z-10 px-6 pt-10 text-center sm:px-12 sm:pt-14">
        <motion.p initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-700 dark:text-zinc-300">{eyebrow}</motion.p>
        <h2 className="mx-auto mt-3 max-w-[18ch] font-display text-[clamp(42px,7.4vw,82px)] leading-[0.98] tracking-[-0.02em] text-zinc-950 dark:text-zinc-50">
          {title.split(' ').map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-bottom"><motion.span className="inline-block" initial={reduced ? false : { y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}>{w}&nbsp;</motion.span></span>
          ))}
        </h2>
        <p className="mx-auto mt-4 max-w-[46ch] text-base leading-relaxed text-zinc-700 dark:text-zinc-300">{description}</p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <button type="button" onClick={onCta} className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-zinc-950 px-6 text-sm font-semibold text-white transition-transform hover:bg-zinc-800 active:scale-95 motion-reduce:active:scale-100 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200">{ctaLabel}<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden /></button>
          {!reduced && <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play photo strip' : 'Pause photo strip'} className="grid h-12 w-12 place-items-center rounded-full text-zinc-800 ring-1 ring-inset ring-zinc-300 hover:bg-white dark:text-zinc-100 dark:ring-zinc-700 dark:hover:bg-zinc-900">{paused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}</button>}
        </div>
      </div>
      <div className="relative mt-auto -rotate-3 scale-[1.06] space-y-3 pb-8 pt-10 [mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)]">
        {reduced ? (
          <ul className="flex flex-wrap justify-center gap-3 px-6" aria-label="Selected photographs">{photos.slice(0, 6).map((p) => <li key={p.id} className="h-40 w-32 overflow-hidden rounded-2xl ring-1 ring-black/10 dark:ring-white/10"><PortfolioArt seed={p.seed} src={p.src} alt={p.alt ?? ''} /></li>)}</ul>
        ) : (
          <>
            <Rail photos={top} dir={1} speed={speed} paused={paused} hold={hold} reduced={reduced} />
            <Rail photos={bottom} dir={-1} speed={speed * 0.8} paused={paused} hold={hold} reduced={reduced} />
          </>
        )}
      </div>
    </section>
  )
}
