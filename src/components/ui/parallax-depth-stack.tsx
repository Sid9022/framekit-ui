import * as React from 'react'
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type DepthCard = { title: string; meta: string; from: string; to: string }

export type ParallaxDepthStackProps = { cards?: DepthCard[]; className?: string }

export const DEFAULT_DEPTH_CARDS: DepthCard[] = [
  { title: 'Aurora', meta: 'Collection · 24 shots', from: '#312e81', to: '#06b6d4' },
  { title: 'Solstice', meta: 'Collection · 18 shots', from: '#7c2d12', to: '#f59e0b' },
  { title: 'Bloom', meta: 'Collection · 31 shots', from: '#831843', to: '#f472b6' },
]

/**
 * Parallax Depth Stack — a fanned stack of cards on CSS 3D layers. Pointer
 * movement tilts the stack and each layer parallaxes by its depth; click or
 * press Enter/Space to cycle the front card to the back on a spring.
 */
export function ParallaxDepthStack({ cards = DEFAULT_DEPTH_CARDS, className }: ParallaxDepthStackProps) {
  const reduced = usePrefersReducedMotion()
  const [order, setOrder] = React.useState(() => cards.map((_, i) => i))
  const mx = useMotionValue(0), my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 150, damping: 18 }), sy = useSpring(my, { stiffness: 150, damping: 18 })
  const rY = useTransform(sx, [-0.5, 0.5], reduced ? [0, 0] : [-14, 14])
  const rX = useTransform(sy, [-0.5, 0.5], reduced ? [0, 0] : [12, -12])
  const cycle = () => setOrder((o) => [...o.slice(1), o[0]])
  const front = cards[order[0]]
  return (
    <div onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5) }} onPointerLeave={() => { mx.set(0); my.set(0) }}
      className={cn('relative grid min-h-[420px] w-full place-items-center [perspective:1100px]', className)}>
      <motion.button onClick={cycle} style={{ rotateX: rX, rotateY: rY, transformStyle: 'preserve-3d' }} className="relative h-[300px] w-[230px] rounded-[26px] outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-4 dark:ring-offset-zinc-950">
        <span className="sr-only">Show next card</span>
        {order.map((ci, depth) => <Card key={ci} c={cards[ci]} depth={depth} n={cards.length} sx={sx} sy={sy} reduced={reduced} />)}
      </motion.button>
      <p className="sr-only" aria-live="polite">{front.title}</p>
    </div>
  )
}

function Card({ c, depth, n, sx, sy, reduced }: { c: DepthCard; depth: number; n: number; sx: MotionValue<number>; sy: MotionValue<number>; reduced: boolean }) {
  const px = useTransform(sx, (v) => (reduced ? 0 : v * (n - depth) * 14))
  const py = useTransform(sy, (v) => (reduced ? 0 : v * (n - depth) * 10))
  const shineX = useTransform(sx, [-0.5, 0.5], ['0%', '100%'])
  return (
    <motion.div aria-hidden={depth > 0 || undefined} style={{ x: px, y: py, zIndex: n - depth, background: `linear-gradient(150deg, ${c.from}, ${c.to})` }}
      animate={{ z: -depth * 60, rotateZ: depth * 5, y: depth * -14, scale: 1 - depth * 0.04, opacity: depth > 2 ? 0 : 1 }}
      transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 26 }}
      className="absolute inset-0 overflow-hidden rounded-[26px] text-left shadow-[0_1px_2px_rgb(0_0_0/0.15),0_30px_60px_-30px_rgb(0_0_0/0.7)] ring-1 ring-white/15">
      <div className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.14)_1px,transparent_1px)] [background-size:12px_12px]" />
      <motion.div aria-hidden style={{ left: shineX }} className="absolute -top-1/2 h-[200%] w-24 -translate-x-1/2 rotate-12 bg-white/15 blur-xl" />
      <div className="absolute inset-x-5 bottom-5">
        <p className="text-2xl font-semibold tracking-[-0.02em] text-white">{c.title}</p>
        <p className="mt-1 text-xs font-medium text-white/80">{c.meta}</p>
      </div>
    </motion.div>
  )
}
