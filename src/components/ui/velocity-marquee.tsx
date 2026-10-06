import * as React from 'react'
import { motion, useAnimationFrame, useInView, useMotionValue, useScroll, useSpring, useTransform, useVelocity, type MotionValue } from 'motion/react'
import { Pause, Play } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type VelocityMarqueeProps = {
  /** One array of phrases per row. Rows alternate direction and style (solid / outline). */
  rows?: string[][]
  /** Idle drift in % of one copy per second. Clamped 0.5–12. */
  baseVelocity?: number
  /** How strongly scroll speed boosts the drift. Clamped 0–10. */
  boost?: number
  /** Scroll container to read velocity from (defaults to the window). */
  scrollContainer?: React.RefObject<HTMLElement | null>
  showControls?: boolean
  className?: string
}

export const DEFAULT_ROWS = [
  ['Design systems', 'Motion', 'Accessibility', 'Typography'],
  ['Prototypes', 'Launch pages', 'Docs that read well', 'Detail'],
]

const wrap = (min: number, max: number, v: number) => {
  const r = max - min
  return ((((v - min) % r) + r) % r) + min
}

function Row({ phrases, dir, base, boostMv, skew, running, outline }: { phrases: string[]; dir: 1 | -1; base: number; boostMv: MotionValue<number>; skew: MotionValue<number>; running: boolean; outline: boolean }) {
  const x = useMotionValue(0)
  const sign = React.useRef<1 | -1>(dir)
  const tx = useTransform(x, (v) => `${wrap(-25, 0, v)}%`)
  useAnimationFrame((_, delta) => {
    if (!running) return
    const dt = Math.min(0.05, delta / 1000)
    const f = boostMv.get()
    if (f < -0.02) sign.current = (-dir) as 1 | -1
    else if (f > 0.02) sign.current = dir
    x.set(x.get() + sign.current * base * dt * (1 + Math.abs(f)))
  })
  const copy = (k: number) => (
    <span key={k} className="flex shrink-0 items-center" aria-hidden={k > 0 || undefined}>
      {phrases.map((p, i) => (
        <span key={i} className="flex items-center">
          <span
            className={cn(
              'whitespace-nowrap px-[0.35em]',
              outline ? 'text-transparent [-webkit-text-stroke:1.25px_rgb(24_24_27/0.85)] dark:[-webkit-text-stroke:1.25px_rgb(250_250_250/0.85)]' : 'text-zinc-950 dark:text-white',
            )}
          >
            {p}
          </span>
          <span aria-hidden className="text-[0.5em] text-signal-600 dark:text-signal-300">✦</span>
        </span>
      ))}
    </span>
  )
  return (
    <div className="flex overflow-hidden">
      <motion.div className="flex w-max will-change-transform" style={{ x: tx, skewX: skew }}>
        {[0, 1, 2, 3].map(copy)}
      </motion.div>
    </div>
  )
}

/**
 * Velocity Marquee — oversized editorial rails that idle along, then answer your scroll. Scroll faster and the
 * rows speed up and lean into the motion; scroll back up and they reverse. Solid and outline rows alternate for
 * rhythm. Pauses offscreen, has a Pause control, and becomes a still composition under reduced motion.
 */
export function VelocityMarquee({ rows = DEFAULT_ROWS, baseVelocity = 3, boost = 4, scrollContainer, showControls = true, className }: VelocityMarqueeProps) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0 })
  const [playing, setPlaying] = React.useState(true)
  const { scrollY } = useScroll(scrollContainer ? { container: scrollContainer } : undefined)
  const vel = useVelocity(scrollY)
  const smooth = useSpring(vel, { stiffness: 160, damping: 40, mass: 0.6 })
  const b = Math.min(10, Math.max(0, boost))
  const boostMv = useTransform(smooth, [-1200, 0, 1200], [-b, 0, b], { clamp: false })
  const skew = useTransform(smooth, [-2000, 0, 2000], reduced ? [0, 0, 0] : [6, 0, -6])
  const base = Math.min(12, Math.max(0.5, baseVelocity))
  const running = !reduced && playing && inView

  return (
    <div ref={ref} className={cn('relative w-full overflow-hidden py-6', className)}>
      <p className="sr-only">{rows.map((r) => r.join(', ')).join('. ')}</p>
      <div aria-hidden className="flex flex-col gap-1 text-[2.6rem] font-semibold leading-[1.1] tracking-[-0.04em] sm:text-7xl [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
        {rows.map((r, i) => (
          <Row key={i} phrases={r} dir={i % 2 ? -1 : 1} base={base} boostMv={boostMv} skew={skew} running={running} outline={i % 2 === 1} />
        ))}
      </div>
      {showControls && !reduced && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-xs font-medium text-zinc-700 ring-1 ring-black/[0.08] transition-[background-color,transform] duration-150 hover:bg-white active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-600 dark:text-zinc-300 dark:ring-white/[0.1] dark:hover:bg-zinc-900 dark:focus-visible:ring-signal-300"
          >
            {playing ? <Pause className="h-3.5 w-3.5" aria-hidden /> : <Play className="h-3.5 w-3.5" aria-hidden />}
            {playing ? 'Pause' : 'Play'} · scroll to speed up
          </button>
        </div>
      )}
    </div>
  )
}
