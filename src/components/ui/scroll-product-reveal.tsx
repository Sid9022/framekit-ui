import * as React from 'react'
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type RevealChapter = { eyebrow: string; title: string; body: string }

export type ScrollProductRevealProps = {
  chapters?: RevealChapter[]
  /** Height of the scroll viewport in px (the component scrolls inside itself). */
  height?: number
  className?: string
}

export const DEFAULT_CHAPTERS: RevealChapter[] = [
  { eyebrow: 'Design', title: 'Forged from a single block.', body: 'A unibody shell machined to 0.01 mm, with edges that catch the light.' },
  { eyebrow: 'Display', title: 'Brighter than daylight.', body: '2,000 nits of peak brightness and an always-on canvas that sips power.' },
  { eyebrow: 'Performance', title: 'Silent. Relentless.', body: 'A new chip that renders a frame before you finish the thought.' },
]

/**
 * Scroll Product Reveal — an Apple-style pinned sequence. The device stays put
 * while scroll scrubs its 3D rotation, screen glow and exploded layers; copy
 * chapters cross-fade with a blur on each step. Scrolls inside its own frame.
 */
export function ScrollProductReveal({ chapters = DEFAULT_CHAPTERS, height = 560, className }: ScrollProductRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ container: ref })
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })
  const rotY = useTransform(p, [0, 0.5, 1], reduced ? [0, 0, 0] : [-28, 0, 18])
  const rotX = useTransform(p, [0, 0.5, 1], reduced ? [0, 0, 0] : [18, 0, 8])
  const scale = useTransform(p, [0, 0.5, 1], reduced ? [1, 1, 1] : [0.86, 1, 0.94])
  const explode = useTransform(p, [0.55, 1], [0, 1])
  const glow = useTransform(p, [0.2, 0.55], [0, 1])
  const bar = useTransform(p, [0, 1], [0, 1])
  return (
    <div ref={ref} tabIndex={0} role="region" aria-label="Product story, scroll to explore" className={cn('relative w-full overflow-y-auto overscroll-contain rounded-[24px] bg-zinc-50 ring-1 ring-black/[0.06] outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-zinc-950 dark:ring-white/[0.08] [scrollbar-width:none]', className)} style={{ height }}>
      <div style={{ height: height * (chapters.length + 1) }} className="relative">
        <div className="sticky top-0 grid h-full items-center gap-6 px-6 sm:grid-cols-2 sm:px-12" style={{ height }}>
          <div className="relative order-2 h-[180px] sm:order-1 sm:h-auto">
            {chapters.map((c, i) => <Chapter key={i} c={c} i={i} n={chapters.length} p={p} reduced={reduced} />)}
          </div>
          <div className="order-1 flex justify-center [perspective:1200px] sm:order-2">
            <motion.div style={{ rotateY: rotY, rotateX: rotX, scale, transformStyle: 'preserve-3d' }} className="relative h-[260px] w-[150px] sm:h-[340px] sm:w-[190px]">
              <Layer explode={explode} z={-60} className="bg-gradient-to-br from-zinc-300 to-zinc-500 dark:from-zinc-700 dark:to-zinc-900" />
              <Layer explode={explode} z={-20} className="bg-zinc-800 ring-1 ring-white/10" inset />
              <motion.div style={{ translateZ: 0 }} className="absolute inset-0 overflow-hidden rounded-[32px] bg-zinc-950 p-[7px] shadow-[0_1px_2px_rgb(0_0_0/0.2),0_40px_80px_-30px_rgb(0_0_0/0.6)] ring-1 ring-black/40">
                <div className="relative h-full w-full overflow-hidden rounded-[26px] bg-gradient-to-b from-indigo-950 to-zinc-950">
                  <motion.div style={{ opacity: glow }} className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,#6366f1_0%,#ec4899_45%,transparent_75%)]" />
                  <div className="absolute left-1/2 top-2 h-[18px] w-[56px] -translate-x-1/2 rounded-full bg-black" />
                  <motion.div style={{ opacity: glow }} className="absolute bottom-6 left-0 right-0 text-center font-medium tracking-tight text-white/90">
                    <span className="text-3xl tabular-nums">9:41</span>
                  </motion.div>
                </div>
              </motion.div>
              <motion.div aria-hidden style={{ opacity: glow }} className="pointer-events-none absolute inset-0 rounded-[32px] bg-[linear-gradient(115deg,transparent_35%,rgb(255_255_255/0.18)_50%,transparent_65%)]" />
            </motion.div>
          </div>
          <div className="absolute bottom-4 left-6 right-6 h-[2px] overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/[0.08] sm:left-12 sm:right-12">
            <motion.div style={{ scaleX: bar }} className="h-full origin-left bg-zinc-900 dark:bg-white" />
          </div>
        </div>
      </div>
    </div>
  )
}

function Layer({ explode, z, className, inset }: { explode: MotionValue<number>; z: number; className: string; inset?: boolean }) {
  const tz = useTransform(explode, [0, 1], [z * 0.1, z * 1.6])
  const op = useTransform(explode, [0, 0.2], [0, 1])
  return <motion.div aria-hidden style={{ translateZ: tz, opacity: op }} className={cn('absolute rounded-[32px]', inset ? 'inset-3' : 'inset-0', className)} />
}

function Chapter({ c, i, n, p, reduced }: { c: RevealChapter; i: number; n: number; p: MotionValue<number>; reduced: boolean }) {
  const a = i / n, b = (i + 1) / n, m = 0.08
  const range = i === 0 ? [0, 0, b - m, b] : i === n - 1 ? [a, a + m, 1, 1] : [a, a + m, b - m, b]
  const opacity = useTransform(p, range, i === 0 ? [1, 1, 1, 0] : i === n - 1 ? [0, 1, 1, 1] : [0, 1, 1, 0])
  const y = useTransform(p, range, reduced ? [0, 0, 0, 0] : i === 0 ? [0, 0, 0, -24] : i === n - 1 ? [24, 0, 0, 0] : [24, 0, 0, -24])
  const blur = useTransform(opacity, [0, 1], reduced ? ['blur(0px)', 'blur(0px)'] : ['blur(8px)', 'blur(0px)'])
  return (
    <motion.div style={{ opacity, y, filter: blur }} className="absolute inset-0 flex flex-col justify-center">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-indigo-700 dark:text-indigo-300">{c.eyebrow}</p>
      <h3 className="mt-2 text-balance text-2xl font-semibold tracking-[-0.03em] text-zinc-950 sm:text-4xl dark:text-white">{c.title}</h3>
      <p className="mt-3 max-w-[40ch] text-pretty text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-400">{c.body}</p>
    </motion.div>
  )
}
