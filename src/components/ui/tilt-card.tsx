import * as React from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Perspective tilt card that tracks pointer position, with a specular glare. */
export function TiltCard({
  children,
  className,
  maxTilt = 10,
  glare = true,
  scale = 1.02,
}: {
  children: React.ReactNode
  className?: string
  maxTilt?: number
  /** Soft light sheen that follows the pointer. */
  glare?: boolean
  /** Scale while hovered. */
  scale?: number
}) {
  const reduced = usePrefersReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const hover = useMotionValue(0)
  const spring = { stiffness: 260, damping: 26, mass: 0.6 }
  const sx = useSpring(x, spring)
  const sy = useSpring(y, spring)
  const sh = useSpring(hover, { stiffness: 320, damping: 32 })
  const rotateX = useTransform(sy, [-0.5, 0.5], [maxTilt, -maxTilt])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-maxTilt, maxTilt])
  const s = useTransform(sh, [0, 1], [1, scale])
  const gx = useTransform(sx, [-0.5, 0.5], [0, 100])
  const gy = useTransform(sy, [-0.5, 0.5], [0, 100])
  const glareBg = useMotionTemplate`radial-gradient(520px circle at ${gx}% ${gy}%, rgba(255,255,255,0.28), transparent 55%)`

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width - 0.5)
    y.set((e.clientY - r.top) / r.height - 0.5)
    hover.set(1)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
    hover.set(0)
  }

  return (
    <motion.div
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{
        rotateX: reduced ? 0 : rotateX,
        rotateY: reduced ? 0 : rotateY,
        scale: reduced ? 1 : s,
        transformPerspective: 900,
        transformStyle: 'preserve-3d',
      }}
      className={cn(
        'relative isolate rounded-2xl bg-gradient-to-b from-white to-zinc-50 p-6 ring-1 ring-zinc-950/[0.07] shadow-[0_1px_2px_rgba(15,15,20,0.05),0_18px_40px_-18px_rgba(15,15,20,0.28)] dark:from-zinc-900 dark:to-zinc-950 dark:ring-white/10 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_40px_-18px_rgba(0,0,0,0.9)]',
        className,
      )}
    >
      {glare && !reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] mix-blend-soft-light dark:mix-blend-overlay"
          style={{ background: glareBg, opacity: sh }}
        />
      )}
      <div style={{ transform: 'translateZ(28px)' }}>{children}</div>
    </motion.div>
  )
}
