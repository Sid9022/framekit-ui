import * as React from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type CtaGlowBannerProps = {
  eyebrow?: string
  title?: React.ReactNode
  description?: string
  primaryLabel?: string
  secondaryLabel?: string
  onPrimary?: () => void
  onSecondary?: () => void
  className?: string
}

/**
 * CTA Glow Banner — a closing call-to-action on an ink panel: a soft aurora
 * follows the pointer behind a fine dot grid, the primary button carries an
 * arrow that slides on hover, and the whole block rises in on scroll. It is an
 * ink surface in both themes (a deliberate closing block).
 */
export function CtaGlowBanner({ eyebrow = 'Ready when you are', title = 'Ship your next idea this afternoon.', description = 'Free for personal projects. Upgrade when your team grows — no migrations, no surprises.', primaryLabel = 'Start for free', secondaryLabel = 'Talk to sales', onPrimary, onSecondary, className }: CtaGlowBannerProps) {
  const reduced = usePrefersReducedMotion()
  const mx = useMotionValue(50); const my = useMotionValue(30)
  const sx = useSpring(mx, { stiffness: 80, damping: 20 }); const sy = useSpring(my, { stiffness: 80, damping: 20 })
  const bg = useMotionTemplate`radial-gradient(520px circle at ${sx}% ${sy}%, rgb(154 134 184 / 0.45), transparent 60%), radial-gradient(420px circle at calc(100% - ${sx}%) 100%, rgb(249 115 22 / 0.22), transparent 60%)`
  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 24, scale: 0.98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onPointerMove={(e) => { if (reduced) return; const r = e.currentTarget.getBoundingClientRect(); mx.set(((e.clientX - r.left) / r.width) * 100); my.set(((e.clientY - r.top) / r.height) * 100) }}
      className={cn('relative isolate w-full overflow-hidden rounded-[28px] bg-zinc-950 px-6 py-14 text-center shadow-[0_1px_2px_rgb(0_0_0/0.1),0_32px_64px_-32px_rgb(24_24_27/0.6)] ring-1 ring-white/10 sm:px-12 sm:py-20', className)}
    >
      <motion.div aria-hidden className="absolute inset-0 -z-10" style={{ background: bg }} />
      <div aria-hidden className="absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(rgb(255_255_255/0.18)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div aria-hidden className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-300">{eyebrow}</p>
      <h2 className="mx-auto mt-3 max-w-[20ch] text-balance text-3xl font-semibold tracking-[-0.035em] text-white sm:text-5xl">{title}</h2>
      <p className="mx-auto mt-4 max-w-[52ch] text-pretty text-[15px] text-zinc-300">{description}</p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button type="button" onClick={onPrimary} className="group inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-zinc-950 shadow-[0_1px_2px_rgb(0_0_0/0.2),0_8px_24px_-8px_rgb(255_255_255/0.4)] transition-transform active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950">
          {primaryLabel}<ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
        <button type="button" onClick={onSecondary} className="inline-flex h-11 items-center rounded-full px-5 text-sm font-medium text-white ring-1 ring-white/20 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">{secondaryLabel}</button>
      </div>
    </motion.section>
  )
}
