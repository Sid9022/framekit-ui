import * as React from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'motion/react'
import {
  ArrowRight,
  Camera,
  Cloud,
  Flame,
  Gem,
  Heart,
  Leaf,
  Moon,
  Music,
  Sparkles,
  Star,
  Sun,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type GlowArcItem = {
  id: string
  /** Accessible name / tooltip for the tile. */
  label: string
  /** Optional image URL — replaces the generated gradient art. */
  src?: string
  /** Hue (0–360) for the gradient face and the halo. */
  hue?: number
  /** Glyph drawn on the generated tile. */
  icon?: LucideIcon
}

export type GlowArcHeroProps = {
  items?: GlowArcItem[]
  eyebrow?: string
  /** Headline; the `highlight` words get the gradient ink. */
  title?: string
  highlight?: string
  description?: string
  ctaLabel?: string
  onCta?: () => void
  secondaryLabel?: string
  onSecondary?: () => void
  /** Makes tiles focusable buttons and fires on click / Enter. */
  onItemSelect?: (item: GlowArcItem) => void
  /** Pointer parallax tilt of the arc. */
  parallax?: boolean
  /** Slow pendulum drift of the arc. */
  drift?: boolean
  className?: string
}

const ICONS: LucideIcon[] = [Music, Camera, Leaf, Sun, Zap, Heart, Gem, Cloud, Moon, Flame, Star, Sparkles]
const HUES = [338, 12, 32, 48, 96, 152, 174, 194, 214, 246, 272, 304]
const LABELS = ['Soundroom', 'Snapshot', 'Grove', 'Daybreak', 'Circuit', 'Kindred', 'Facet', 'Drift', 'Nightfall', 'Kindle', 'Northstar', 'Spark']

export const DEFAULT_GLOW_ARC_ITEMS: GlowArcItem[] = LABELS.map((label, i) => ({
  id: label.toLowerCase(),
  label,
  hue: HUES[i],
  icon: ICONS[i],
}))

function useSize(ref: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = React.useState({ w: 720, h: 520 })
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return size
}

/**
 * Glow Arc Hero — a rainbow of glossy tiles fans in around a centred headline.
 * Every tile casts its own coloured halo that breathes out of sync; the arc
 * sways slowly and tilts toward the pointer. On light pages the neon turns
 * into soft coloured drop shadows.
 */
export function GlowArcHero({
  items = DEFAULT_GLOW_ARC_ITEMS,
  eyebrow = 'New · Motion kit 2.0',
  title = 'Interfaces that feel alive',
  highlight = 'feel alive',
  description = 'Drop-in React components with springs, light and depth baked in. Ship the polish without the late nights.',
  ctaLabel = 'Start building',
  onCta,
  secondaryLabel = 'Browse the gallery',
  onSecondary,
  onItemSelect,
  parallax = true,
  drift = true,
  className,
}: GlowArcHeroProps) {
  const ref = React.useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const inView = useInView(ref, { margin: '80px' })
  const { w, h } = useSize(ref)
  const animated = inView && !reduced

  const compact = w < 520
  const tile = w < 420 ? 40 : compact ? 48 : w < 760 ? 58 : 64
  const cy = h * (compact ? 0.44 : 0.75)
  const R = Math.min(w * (compact ? 0.43 : 0.44), h * (compact ? 0.4 : 0.62))
  const n = items.length
  const a0 = 194
  const a1 = 346

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.8 })
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.8 })
  const rotX = useTransform(sy, (v) => v * -8)
  const rotY = useTransform(sx, (v) => v * 10)
  const textX = useTransform(sx, (v) => v * -4)
  const textY = useTransform(sy, (v) => v * -3)

  const onMove = (e: React.PointerEvent) => {
    if (!parallax || reduced || e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1)
    my.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const words = title.split(' ')
  const hlWords = new Set(highlight.split(' ').filter(Boolean))

  return (
    <section
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn(
        'relative isolate w-full overflow-hidden rounded-3xl bg-[#f7f6f2] text-zinc-900 ring-1 ring-black/[0.06] dark:bg-[#07070b] dark:text-white dark:ring-white/[0.07]',
        compact ? 'h-[520px]' : 'h-[540px]',
        className,
      )}
    >
      {/* backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_70%,rgb(255_255_255/0.9),transparent_70%)] dark:bg-[radial-gradient(55%_45%_at_50%_68%,rgb(99_102_241/0.16),transparent_70%)]" />
        <div className="absolute -left-[10%] top-[10%] h-[60%] w-[45%] rounded-full bg-[radial-gradient(closest-side,rgb(251_113_133/0.14),transparent)] dark:bg-[radial-gradient(closest-side,rgb(236_72_153/0.14),transparent)]" />
        <div className="absolute -right-[10%] top-[5%] h-[60%] w-[45%] rounded-full bg-[radial-gradient(closest-side,rgb(56_189_248/0.14),transparent)] dark:bg-[radial-gradient(closest-side,rgb(34_211_238/0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgb(0_0_0/0.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(70%_60%_at_50%_60%,black,transparent)] dark:bg-[radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1px)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#f7f6f2] to-transparent dark:from-[#07070b]" />
      </div>

      {/* arc */}
      <motion.div
        aria-hidden={onItemSelect ? undefined : true}
        className="absolute inset-0 [perspective:1100px]"
        style={{ rotateX: rotX, rotateY: rotY, transformOrigin: `50% ${(cy / h) * 100}%` }}
      >
        <motion.div
          className="absolute h-0 w-0"
          style={{ left: w / 2, top: cy }}
          animate={animated && drift ? { rotate: [-2.5, 2.5] } : { rotate: 0 }}
          transition={animated && drift ? { duration: 11, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : { duration: 0.6 }}
        >
          {items.map((item, i) => {
            const t = n === 1 ? 0.5 : i / (n - 1)
            const ang = a0 + (a1 - a0) * t
            const rad = (ang * Math.PI) / 180
            return (
              <ArcTile
                key={item.id}
                item={item}
                index={i}
                size={tile}
                x={Math.cos(rad) * R}
                y={Math.sin(rad) * R}
                rotate={ang + 90}
                animated={animated}
                reduced={reduced}
                onSelect={onItemSelect}
              />
            )
          })}
        </motion.div>
      </motion.div>

      {/* copy */}
      <motion.div
        className="absolute inset-x-0 flex flex-col items-center px-6 text-center"
        style={{ top: Math.max(cy - R * (compact ? 0.5 : 0.64), 24), x: textX, y: textY }}
      >
        <motion.span
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium text-zinc-600 shadow-[0_1px_2px_rgb(0_0_0/0.06)] ring-1 ring-black/[0.06] backdrop-blur dark:bg-white/[0.06] dark:text-zinc-300 dark:shadow-none dark:ring-white/10"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-pink-500 to-sky-500" />
          {eyebrow}
        </motion.span>
        <h2
          className={cn(
            'max-w-[12ch] text-balance font-semibold leading-[1.02] tracking-[-0.035em]',
            w < 420 ? 'text-[28px]' : compact ? 'text-[34px]' : 'text-5xl md:text-[56px]',
          )}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              className={cn(
                'inline-block pr-[0.22em] last:pr-0',
                hlWords.has(word) &&
                  'bg-gradient-to-r from-fuchsia-600 via-rose-500 to-amber-500 bg-clip-text text-transparent dark:from-fuchsia-400 dark:via-rose-300 dark:to-amber-200',
              )}
              initial={reduced ? false : { opacity: 0, y: 24, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.45 + i * 0.07, type: 'spring', stiffness: 200, damping: 24 }}
            >
              {word}
            </motion.span>
          ))}
        </h2>
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className={cn('mt-4 max-w-[40ch] text-balance text-zinc-600 dark:text-zinc-400', compact ? 'text-[13px]' : 'text-[15px]')}
        >
          {description}
        </motion.p>
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2"
        >
          <button
            type="button"
            onClick={onCta}
            className="group inline-flex h-11 items-center gap-2 rounded-full bg-zinc-900 pl-5 pr-4 text-sm font-medium text-white shadow-[0_10px_30px_-10px_rgb(24_24_27/0.6)] outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-fuchsia-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f6f2] active:translate-y-0 dark:bg-white dark:text-zinc-900 dark:shadow-[0_0_40px_-8px_rgb(255_255_255/0.45)] dark:focus-visible:ring-offset-[#07070b]"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          {secondaryLabel && (
            <button
              type="button"
              onClick={onSecondary}
              className="inline-flex h-11 items-center rounded-full px-4 text-sm font-medium text-zinc-600 outline-none transition-colors hover:bg-black/[0.04] hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-fuchsia-400 dark:text-zinc-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
            >
              {secondaryLabel}
            </button>
          )}
        </motion.div>
      </motion.div>
    </section>
  )
}

function ArcTile({
  item,
  index,
  size,
  x,
  y,
  rotate,
  animated,
  reduced,
  onSelect,
}: {
  item: GlowArcItem
  index: number
  size: number
  x: number
  y: number
  rotate: number
  animated: boolean
  reduced: boolean
  onSelect?: (item: GlowArcItem) => void
}) {
  const hue = item.hue ?? (index * 30) % 360
  const Icon = item.icon ?? ICONS[index % ICONS.length]
  const glow = `hsl(${hue} 95% 60%)`
  const face = `linear-gradient(145deg, hsl(${hue} 95% 70%), hsl(${hue + 18} 90% 52%) 55%, hsl(${hue + 40} 85% 36%))`
  const Tag = onSelect ? motion.button : motion.div
  return (
    <motion.div
      className="absolute"
      style={{ left: -size / 2, top: -size / 2, width: size, height: size }}
      initial={reduced ? false : { x: 0, y: 30, rotate: 0, scale: 0.2, opacity: 0 }}
      animate={{ x, y, rotate, scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 150, damping: 19, mass: 0.9, delay: reduced ? 0 : 0.12 + index * 0.055 }}
    >
      <Tag
        {...(onSelect ? { type: 'button' as const, onClick: () => onSelect(item), 'aria-label': item.label } : {})}
        title={item.label}
        className="group relative block h-full w-full rounded-[28%] outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-black"
        style={{ ['--tile-glow' as string]: glow }}
        whileHover={reduced ? undefined : { y: -10, scale: 1.12 }}
        whileTap={reduced ? undefined : { scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      >
        {/* breathing halo */}
        <motion.span
          aria-hidden
          className="absolute -inset-[35%] -z-10"
          animate={animated ? { opacity: [0.45, 1, 0.45], scale: [0.9, 1.08, 0.9] } : { opacity: 0.75, scale: 1 }}
          transition={animated ? { duration: 2.8 + (index % 4) * 0.45, repeat: Infinity, ease: 'easeInOut', delay: (index * 0.37) % 2.4 } : { duration: 0.3 }}
        >
          <span className="absolute inset-[18%] rounded-full bg-[var(--tile-glow)] opacity-40 blur-lg dark:opacity-75 dark:blur-2xl" />
        </motion.span>
        {/* hover boost */}
        <span aria-hidden className="absolute -inset-[30%] -z-10 rounded-full bg-[var(--tile-glow)] opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-50 group-focus-visible:opacity-50 dark:group-hover:opacity-90 dark:group-focus-visible:opacity-90" />
        {/* face */}
        <span
          className="absolute inset-0 overflow-hidden rounded-[28%] shadow-[0_12px_22px_-10px_var(--tile-glow),inset_0_1px_0_rgb(255_255_255/0.45),inset_0_-6px_12px_rgb(0_0_0/0.18)] ring-1 ring-white/30 dark:shadow-[0_0_24px_-4px_var(--tile-glow),inset_0_1px_0_rgb(255_255_255/0.45),inset_0_-6px_12px_rgb(0_0_0/0.25)] dark:ring-white/20"
          style={{ background: face }}
        >
          {item.src ? (
            <img src={item.src} alt="" className="h-full w-full object-cover" draggable={false} />
          ) : (
            <Icon className="absolute left-1/2 top-1/2 h-[44%] w-[44%] -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-[0_2px_4px_rgb(0_0_0/0.25)]" strokeWidth={2.2} />
          )}
          <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent" />
        </span>
      </Tag>
    </motion.div>
  )
}
