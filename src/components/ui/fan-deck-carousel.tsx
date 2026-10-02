import * as React from 'react'
import { AnimatePresence, animate, motion, useInView, useMotionValue, useTransform, type PanInfo } from 'motion/react'
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type FanDeckItem = {
  id: string
  title: string
  subtitle?: string
  /** Optional image URL — replaces the generated poster art. */
  src?: string
  /** Hue (0–360) for the generated art and accent. */
  hue?: number
}

export type FanDeckCarouselProps = {
  items?: FanDeckItem[]
  headline?: string
  description?: string
  ctaLabel?: string
  onCta?: (item: FanDeckItem) => void
  autoplay?: boolean
  /** Milliseconds per slide while autoplaying. */
  interval?: number
  /** Controlled active index. */
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  className?: string
}

export const DEFAULT_FAN_DECK_ITEMS: FanDeckItem[] = [
  { id: 'neon-tide', title: 'Neon Tide', subtitle: 'Synth sessions · 12 tracks', hue: 280 },
  { id: 'dune', title: 'Dune Letters', subtitle: 'Travel diary · 8 stories', hue: 28 },
  { id: 'glass', title: 'Glass Garden', subtitle: 'Botanical series · 16 plates', hue: 150 },
  { id: 'transit', title: 'Night Transit', subtitle: 'City photo walk · 24 frames', hue: 222 },
  { id: 'choir', title: 'Solar Choir', subtitle: 'Live recording · 9 tracks', hue: 44 },
  { id: 'planets', title: 'Paper Planets', subtitle: 'Kids illustration · 10 pages', hue: 330 },
  { id: 'afterglow', title: 'Afterglow', subtitle: 'Short film · 14 minutes', hue: 190 },
]

/** Procedural poster used when an item has no `src`. */
export function PosterArt({ hue = 260, seed = 0, className }: { hue?: number; seed?: number; className?: string }) {
  const id = React.useId().replace(/:/g, '')
  const kind = seed % 3
  return (
    <svg viewBox="0 0 200 280" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={`hsl(${hue} 80% 62%)`} />
          <stop offset="0.55" stopColor={`hsl(${hue + 30} 70% 38%)`} />
          <stop offset="1" stopColor={`hsl(${hue + 60} 65% 16%)`} />
        </linearGradient>
        <radialGradient id={`${id}s`} cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor={`hsl(${hue - 30} 100% 88%)`} />
          <stop offset="1" stopColor={`hsl(${hue - 20} 95% 60%)`} />
        </radialGradient>
        <clipPath id={`${id}c`}>
          <circle cx="100" cy="112" r="62" />
        </clipPath>
      </defs>
      <rect width="200" height="280" fill={`url(#${id}b)`} />
      {kind === 0 && (
        <>
          <circle cx="100" cy="112" r="62" fill={`url(#${id}s)`} />
          <g clipPath={`url(#${id}c)`}>
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x="30" y={128 + i * 10} width="140" height={2 + i * 1.4} fill={`hsl(${hue + 30} 70% 38%)`} />
            ))}
          </g>
          <path d="M0 200 Q50 170 100 196 T200 186 V280 H0Z" fill={`hsl(${hue + 50} 60% 14%)`} opacity="0.9" />
        </>
      )}
      {kind === 1 && (
        <g fill="none" stroke={`hsl(${hue - 30} 100% 85%)`}>
          {[18, 36, 54, 72, 90, 108].map((r, i) => (
            <circle key={r} cx="140" cy="90" r={r} strokeWidth={i === 2 ? 5 : 1.4} opacity={1 - i * 0.13} />
          ))}
          <circle cx="140" cy="90" r="10" fill={`hsl(${hue - 30} 100% 88%)`} stroke="none" />
        </g>
      )}
      {kind === 2 && (
        <g style={{ mixBlendMode: 'screen' }}>
          <circle cx="70" cy="90" r="56" fill={`hsl(${hue - 40} 95% 60%)`} opacity="0.85" />
          <circle cx="128" cy="120" r="50" fill={`hsl(${hue + 50} 95% 60%)`} opacity="0.75" />
          <circle cx="96" cy="160" r="40" fill={`hsl(${hue + 150} 95% 65%)`} opacity="0.6" />
        </g>
      )}
    </svg>
  )
}

function wrapOffset(i: number, active: number, n: number) {
  let o = (i - active) % n
  if (o > n / 2) o -= n
  if (o < -n / 2) o += n
  return o
}

/**
 * Fan Deck Carousel — a hand of poster cards fanned around an upright hero
 * card. Swipe, use arrows or the buttons and the hand re-fans on springs
 * while a blurred copy of the active art crossfades in as the backdrop.
 */
export function FanDeckCarousel({
  items = DEFAULT_FAN_DECK_ITEMS,
  headline = 'Stories worth staying up for',
  description = 'Hand-picked collections, refreshed every week.',
  ctaLabel = 'Explore',
  onCta,
  autoplay = true,
  interval = 4000,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  className,
}: FanDeckCarouselProps) {
  const ref = React.useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const inView = useInView(ref, { margin: '60px' })
  const n = items.length
  const [inner, setInner] = React.useState(defaultIndex)
  const active = ((indexProp ?? inner) % n + n) % n
  const [hover, setHover] = React.useState(false)
  const [focusWithin, setFocusWithin] = React.useState(false)
  const [userPaused, setUserPaused] = React.useState(false)
  const [width, setWidth] = React.useState(720)
  const dragX = useMotionValue(0)
  const deckRotate = useTransform(dragX, (v) => v * 0.02)
  const deckX = useTransform(dragX, (v) => v * 0.35)
  const panned = React.useRef(false)

  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setWidth(el.clientWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const go = React.useCallback(
    (i: number) => {
      const next = ((i % n) + n) % n
      if (indexProp === undefined) setInner(next)
      onIndexChange?.(next)
    },
    [n, indexProp, onIndexChange],
  )

  const playing = autoplay && !reduced && !userPaused && !hover && !focusWithin && inView
  React.useEffect(() => {
    if (!playing) return
    const t = window.setTimeout(() => !document.hidden && go(active + 1), interval)
    return () => window.clearTimeout(t)
  }, [playing, active, interval, go])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(active + 1)
    else if (e.key === 'ArrowLeft') go(active - 1)
    else if (e.key === 'Home') go(0)
    else if (e.key === 'End') go(n - 1)
    else return
    e.preventDefault()
  }

  const onPan = (_: PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 6) panned.current = true
    dragX.set(info.offset.x)
  }
  const onPanEnd = (_: PointerEvent, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -450) go(active + 1)
    else if (info.offset.x > 60 || info.velocity.x > 450) go(active - 1)
    animate(dragX, 0, { type: 'spring', stiffness: 300, damping: 30 })
    window.setTimeout(() => (panned.current = false), 0)
  }

  const compact = width < 560
  const cardW = compact ? 148 : 204
  const cardH = compact ? 208 : 284
  const cur = items[active]
  const spring = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 210, damping: 26, mass: 0.9 }

  return (
    <section
      ref={ref}
      role="region"
      aria-roledescription="carousel"
      aria-label={headline}
      onKeyDown={onKeyDown}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setFocusWithin(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setFocusWithin(false)}
      className={cn(
        'relative isolate w-full overflow-hidden rounded-3xl bg-[#f6f5f3] text-zinc-900 ring-1 ring-black/[0.06] dark:bg-[#060608] dark:text-white dark:ring-white/[0.07]',
        className,
      )}
    >
      {/* blurred backdrop of the active art */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={cur.id}
            className="absolute -inset-[15%] opacity-40 blur-3xl saturate-150 dark:opacity-50"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.9, ease: 'easeOut' }}
          >
            <div className="h-full w-full opacity-45 dark:opacity-70">
              {cur.src ? <img src={cur.src} alt="" className="h-full w-full object-cover" /> : <PosterArt hue={cur.hue} seed={active} className="h-full w-full" />}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_45%,transparent,rgb(246_245_243/0.9))] dark:bg-[radial-gradient(90%_70%_at_50%_45%,transparent,rgb(6_6_8/0.9))]" />
      </div>

      <div className="px-6 pt-8 text-center sm:pt-10">
        <h2 className={cn('mx-auto max-w-[20ch] font-semibold leading-[1.05] tracking-[-0.035em]', compact ? 'text-[28px]' : 'text-4xl md:text-[44px]')}>
          {headline}
        </h2>
        <p className="mt-2 text-[13px] text-zinc-600 dark:text-zinc-400">{description}</p>
      </div>

      {/* deck */}
      <motion.div
        onPan={onPan}
        onPanEnd={onPanEnd}
        className="relative mx-auto cursor-grab touch-pan-y select-none active:cursor-grabbing"
        style={{ height: cardH + 64 }}
      >
        <motion.div className="absolute left-1/2 top-1/2 h-0 w-0" style={{ x: deckX, rotate: deckRotate }}>
          {items.map((item, i) => {
            const o = wrapOffset(i, active, n)
            const a = Math.abs(o)
            const s = Math.sign(o)
            const x = a === 0 ? 0 : s * cardW * (0.62 + (a - 1) * 0.46)
            const isActive = o === 0
            return (
              <motion.div
                key={item.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${n}: ${item.title}`}
                aria-hidden={!isActive || undefined}
                onClick={() => !panned.current && !isActive && go(i)}
                className={cn('absolute overflow-hidden rounded-[22px] bg-zinc-300 dark:bg-zinc-800', !isActive && 'cursor-pointer')}
                style={{ width: cardW, height: cardH, left: -cardW / 2, top: -cardH / 2, zIndex: 20 - a, transformPerspective: 1100 }}
                initial={false}
                animate={{
                  x,
                  y: a * 16 + a * a * 6,
                  rotate: o * 7,
                  rotateY: -o * 16,
                  scale: isActive ? 1.04 : Math.max(0.6, 0.88 - (a - 1) * 0.12),
                  opacity: a > 2 ? 0 : 1,
                  boxShadow: isActive
                    ? `0px 30px 60px -24px hsla(${item.hue ?? 260}, 80%, 45%, 0.65)`
                    : '0px 16px 30px -20px rgba(0, 0, 0, 0.45)',
                }}
                transition={spring}
              >
                {item.src ? (
                  <img src={item.src} alt="" draggable={false} className="h-full w-full object-cover" />
                ) : (
                  <PosterArt hue={item.hue} seed={i} className="h-full w-full" />
                )}
                <div className="absolute inset-0 rounded-[22px] shadow-[inset_0_1px_0_rgb(255_255_255/0.35),inset_0_0_0_1px_rgb(255_255_255/0.12)]" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-3 pt-10 text-left text-white">
                  <p className={cn('font-semibold leading-tight tracking-tight', compact ? 'text-[13px]' : 'text-base')}>{item.title}</p>
                  {item.subtitle && <p className="mt-0.5 truncate text-[10px] text-white/70">{item.subtitle}</p>}
                </div>
                <motion.div
                  className="pointer-events-none absolute inset-0 bg-black"
                  initial={false}
                  animate={{ opacity: isActive ? 0 : Math.min(0.5, a * 0.2) }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>

      {/* controls */}
      <div className="flex flex-col items-center gap-4 px-6 pb-8">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => go(active - 1)} aria-label="Previous slide" className={ctrl}>
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5 px-1">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === active ? 'true' : undefined}
                onClick={() => go(i)}
                className="group flex h-6 min-w-6 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-white"
              >
               <span
                className={cn(
                  'relative block h-1.5 overflow-hidden rounded-full transition-[width,background-color] duration-300',
                  i === active ? 'w-7 bg-zinc-900/15 dark:bg-white/20' : 'w-1.5 bg-zinc-900/20 group-hover:bg-zinc-900/40 dark:bg-white/25 dark:group-hover:bg-white/50',
                )}
               >
                {i === active && (
                  <motion.span
                    key={`${active}-${playing}`}
                    className="absolute inset-y-0 left-0 rounded-full bg-zinc-900 dark:bg-white"
                    initial={{ width: playing ? '0%' : '100%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: playing ? interval / 1000 : 0, ease: 'linear' }}
                  />
                )}
               </span>
              </button>
            ))}
          </div>
          <button type="button" onClick={() => go(active + 1)} aria-label="Next slide" className={ctrl}>
            <ChevronRight className="h-4 w-4" />
          </button>
          {autoplay && !reduced && (
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-label={userPaused ? 'Start autoplay' : 'Pause autoplay'}
              className={ctrl}
            >
              {userPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => onCta?.(cur)}
          className="group inline-flex h-11 items-center gap-3 rounded-full bg-zinc-900 pl-5 pr-1.5 text-sm font-medium text-white shadow-[0_12px_30px_-12px_rgb(0_0_0/0.5)] outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-900 active:translate-y-0 dark:bg-white dark:text-zinc-900 dark:focus-visible:ring-white dark:focus-visible:ring-offset-black"
        >
          <span className="max-w-[12rem] truncate">
            {ctaLabel} <span className="opacity-60">{cur.title}</span>
          </span>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 dark:bg-zinc-900/10">
            <motion.span
              animate={reduced || !inView ? { x: 0 } : { x: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="grid place-items-center"
            >
              <ArrowRight className="h-4 w-4" />
            </motion.span>
          </span>
        </button>
      </div>
      <p className="sr-only" aria-live={playing ? 'off' : 'polite'}>
        {`Slide ${active + 1} of ${n}: ${cur.title}`}
      </p>
    </section>
  )
}

const ctrl =
  'grid h-10 w-10 place-items-center rounded-full bg-white/70 text-zinc-700 shadow-[0_1px_2px_rgb(0_0_0/0.06)] ring-1 ring-black/[0.06] backdrop-blur outline-none transition-colors hover:bg-white hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:bg-white/[0.06] dark:text-zinc-200 dark:shadow-none dark:ring-white/10 dark:hover:bg-white/[0.12] dark:hover:text-white dark:focus-visible:ring-white'
