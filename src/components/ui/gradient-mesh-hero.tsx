import * as React from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type GradientMeshHeroProps = {
  eyebrow?: string
  title?: React.ReactNode
  description?: string
  primaryLabel?: string
  secondaryLabel?: string
  onPrimary?: () => void
  onSecondary?: () => void
  /** Four blob colours. */
  colors?: [string, string, string, string]
  className?: string
}

/**
 * Gradient Mesh Hero — four soft colour fields drift on slow, offset orbits
 * and lean toward the pointer, under a fine grain and a glass pill eyebrow.
 * Headline words rise with a blur stagger. Reduced motion freezes the mesh.
 */
export function GradientMeshHero({
  eyebrow = 'Introducing Framekit 2.0',
  title = 'Interfaces that feel alive.',
  description = 'Motion-first components with the restraint of a design system, ready to drop into any React app.',
  primaryLabel = 'Get started', secondaryLabel = 'View components', onPrimary, onSecondary,
  colors = ['#6366f1', '#ec4899', '#f59e0b', '#06b6d4'], className,
}: GradientMeshHeroProps) {
  const reduced = usePrefersReducedMotion()
  const mx = useMotionValue(0), my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 20 }), sy = useSpring(my, { stiffness: 60, damping: 20 })
  const tx = useTransform(sx, (v) => v * 40), ty = useTransform(sy, (v) => v * 40)
  const words = typeof title === 'string' ? title.split(' ') : null
  const orbits = [
    { x: [0, 60, -30, 0], y: [0, -40, 30, 0], d: 18, pos: 'left-[-10%] top-[-20%]' },
    { x: [0, -50, 40, 0], y: [0, 50, -20, 0], d: 22, pos: 'right-[-10%] top-[-10%]' },
    { x: [0, 40, -60, 0], y: [0, 30, -40, 0], d: 26, pos: 'left-[20%] bottom-[-30%]' },
    { x: [0, -30, 50, 0], y: [0, -50, 20, 0], d: 20, pos: 'right-[10%] bottom-[-20%]' },
  ]
  return (
    <section
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5) }}
      className={cn('relative isolate flex min-h-[520px] w-full items-center justify-center overflow-hidden rounded-[28px] bg-white px-6 py-20 text-center ring-1 ring-black/[0.06] dark:bg-zinc-950 dark:ring-white/[0.08]', className)}
    >
      <motion.div aria-hidden style={{ x: tx, y: ty }} className="absolute inset-0 -z-10 opacity-70 blur-3xl saturate-150 dark:opacity-60">
        {orbits.map((o, i) => (
          <motion.div key={i} className={cn('absolute size-[55%] rounded-full', o.pos)} style={{ background: colors[i] }}
            animate={reduced ? undefined : { x: o.x, y: o.y, scale: [1, 1.12, 0.94, 1] }} transition={{ duration: o.d, repeat: Infinity, ease: 'easeInOut' }} />
        ))}
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-white/40 dark:bg-zinc-950/45" />
      <div aria-hidden className="absolute inset-0 -z-10 opacity-[0.12] mix-blend-overlay [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')]" />
      <div className="relative max-w-[720px]">
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 26 }} className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-zinc-800 shadow-[inset_0_1px_0_rgb(255_255_255/0.8)] ring-1 ring-black/[0.06] backdrop-blur-md dark:bg-white/10 dark:text-zinc-100 dark:shadow-none dark:ring-white/15">
          <span className="size-1.5 rounded-full bg-emerald-500" />{eyebrow}
        </motion.p>
        <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-zinc-950 sm:text-6xl dark:text-white" aria-label={typeof title === 'string' ? title : undefined}>
          {words ? words.map((w, i) => (
            <motion.span aria-hidden key={i} className="inline-block" initial={reduced ? false : { opacity: 0, y: 24, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.1 + i * 0.07 }}>{w}{i < words.length - 1 ? '\u00a0' : ''}</motion.span>
          )) : title}
        </h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mx-auto mt-5 max-w-[52ch] text-pretty text-base leading-relaxed text-zinc-700 sm:text-lg dark:text-zinc-300">{description}</motion.p>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, type: 'spring', stiffness: 260, damping: 26 }} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button onClick={onPrimary} className="group inline-flex h-11 items-center gap-2 rounded-full bg-zinc-950 px-5 text-sm font-medium text-white shadow-[0_1px_2px_rgb(0_0_0/0.2),0_8px_24px_-8px_rgb(0_0_0/0.5)] transition-transform active:scale-[0.97] outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:bg-white dark:text-zinc-950 dark:ring-offset-zinc-950">
            {primaryLabel}<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <button onClick={onSecondary} className="inline-flex h-11 items-center rounded-full bg-white/60 px-5 text-sm font-medium text-zinc-900 ring-1 ring-black/10 backdrop-blur-md transition-colors hover:bg-white/80 active:scale-[0.97] outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-white/10 dark:text-white dark:ring-white/15 dark:hover:bg-white/15">{secondaryLabel}</button>
        </motion.div>
      </div>
    </section>
  )
}
