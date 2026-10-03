import * as React from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type GrainGradientPalette = 'aurora' | 'ember' | 'lagoon' | 'orchid'

export interface GrainGradientFieldProps {
  /** Colour family of the drifting blobs. */
  palette?: GrainGradientPalette
  /** Film-grain strength 0–1. */
  grain?: number
  /** Drift speed multiplier (0 pauses). */
  speed?: number
  /** Soft light that follows the pointer. */
  pointerGlow?: boolean
  children?: React.ReactNode
  className?: string
}

/* [light blobs ×4], [dark blobs ×4] — soft, desaturated so copy on top stays AA with a scrim */
const PALETTES: Record<GrainGradientPalette, { light: string[]; dark: string[]; baseLight: string; baseDark: string }> = {
  aurora: { light: ['#a7f3d0', '#bae6fd', '#ddd6fe', '#fde68a'], dark: ['#047857', '#0369a1', '#5b21b6', '#134e4a'], baseLight: '#f8fafc', baseDark: '#050a10' },
  ember: { light: ['#fed7aa', '#fecdd3', '#fde68a', '#fbcfe8'], dark: ['#9a3412', '#9f1239', '#854d0e', '#6b21a8'], baseLight: '#fffaf5', baseDark: '#0c0605' },
  lagoon: { light: ['#a5f3fc', '#bfdbfe', '#c7d2fe', '#99f6e4'], dark: ['#0e7490', '#1d4ed8', '#4338ca', '#0f766e'], baseLight: '#f5fbff', baseDark: '#03090f' },
  orchid: { light: ['#f5d0fe', '#e9d5ff', '#fbcfe8', '#c7d2fe'], dark: ['#86198f', '#6d28d9', '#9d174d', '#3730a3'], baseLight: '#fdf8ff', baseDark: '#08040c' },
}

const BLOBS = [
  { x: '8%', y: '4%', s: 62, dx: [0, 18, -8, 0], dy: [0, 12, 22, 0], t: 19 },
  { x: '52%', y: '-8%', s: 56, dx: [0, -20, 10, 0], dy: [0, 18, 6, 0], t: 23 },
  { x: '-6%', y: '48%', s: 58, dx: [0, 14, 26, 0], dy: [0, -16, 8, 0], t: 27 },
  { x: '48%', y: '42%', s: 64, dx: [0, -14, -26, 0], dy: [0, -10, -22, 0], t: 21 },
]

const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 1.4 -0.2'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
)}")`

/**
 * Grain Gradient Field — a full-bleed background of four slowly drifting colour blobs under real film grain
 * (SVG feTurbulence), with an optional pointer-following glow. Children sit above; pair copy with a scrim for AA.
 */
export function GrainGradientField({ palette = 'aurora', grain = 0.5, speed = 1, pointerGlow = true, children, className }: GrainGradientFieldProps) {
  const reduced = usePrefersReducedMotion()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [dark, setDark] = React.useState(false)
  React.useLayoutEffect(() => {
    const el = rootRef.current
    const read = () => setDark(!!el?.closest('.dark, .light')?.classList.contains('dark'))
    read()
    const mo = new MutationObserver(read)
    for (let n = el?.parentElement; n; n = n.parentElement) mo.observe(n, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [])
  const p = PALETTES[palette]
  const colors = dark ? p.dark : p.light
  const mx = useMotionValue(50)
  const my = useMotionValue(40)
  const sx = useSpring(mx, { stiffness: 90, damping: 20 })
  const sy = useSpring(my, { stiffness: 90, damping: 20 })
  const glow = useMotionTemplate`radial-gradient(420px circle at ${sx}% ${sy}%, ${dark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.7)'}, transparent 70%)`
  const animate = !reduced && speed > 0

  return (
    <div
      ref={rootRef}
      className={cn('relative isolate w-full overflow-hidden rounded-[2rem] border border-zinc-200 dark:border-zinc-800', className)}
      style={{ backgroundColor: dark ? p.baseDark : p.baseLight }}
      onPointerMove={pointerGlow && !reduced ? (e) => { const b = e.currentTarget.getBoundingClientRect(); mx.set(((e.clientX - b.left) / b.width) * 100); my.set(((e.clientY - b.top) / b.height) * 100) } : undefined}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {BLOBS.map((b, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ left: b.x, top: b.y, width: `${b.s}%`, aspectRatio: '1', background: `radial-gradient(circle at 50% 50%, ${colors[i]} 0%, ${colors[i]}00 68%)`, opacity: dark ? 0.85 : 0.95, filter: 'blur(28px)', willChange: 'transform' }}
            animate={animate ? { x: b.dx.map((v) => `${v}%`), y: b.dy.map((v) => `${v}%`), scale: [1, 1.08, 0.96, 1] } : undefined}
            transition={{ duration: b.t / speed, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        {pointerGlow && !reduced && <motion.div className="absolute inset-0" style={{ background: glow }} />}
        <div className="absolute inset-0" style={{ backgroundImage: GRAIN, backgroundSize: '180px 180px', opacity: Math.max(0, Math.min(1, grain)) * (dark ? 0.5 : 0.7), mixBlendMode: dark ? 'overlay' : 'multiply' }} />
      </div>
      <div className="relative">{children}</div>
    </div>
  )
}
