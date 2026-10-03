import * as React from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { ArrowDownRight, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type KineticNameHeroProps = {
  /** Your name — words become lines (e.g. “Nova Reyes”). */
  name?: string
  role?: string
  intro?: string
  ctaLabel?: string
  onCta?: () => void
  secondaryLabel?: string
  onSecondary?: () => void
  /** Text that circles the badge. */
  badge?: string
  /** Radius (px) of the pointer’s influence on the letters. */
  radius?: number
  className?: string
}

const RADIUS = 230

function Letter({ ch, index, mx, my, radius, ready, reduced }: { ch: string; index: number; mx: MotionValue<number>; my: MotionValue<number>; radius: number; ready: boolean; reduced: boolean }) {
  const wrap = React.useRef<HTMLSpanElement>(null)
  const calc = (x: number, y: number) => {
    const el = wrap.current
    if (!el || reduced) return { dx: 0, dy: 0, f: 0, s: 0 }
    const b = el.getBoundingClientRect()
    const cx = b.left + b.width / 2, cy = b.top + b.height / 2
    const vx = cx - x, vy = cy - y
    const d = Math.hypot(vx, vy) || 1
    const f = Math.pow(Math.max(0, 1 - d / radius), 2)
    return { dx: (vx / d) * f * 46, dy: (vy / d) * f * 46, f, s: Math.sign(vx) }
  }
  const rawX = useTransform([mx, my], ([x, y]: number[]) => calc(x, y).dx)
  const rawY = useTransform([mx, my], ([x, y]: number[]) => calc(x, y).dy)
  const rawR = useTransform([mx, my], ([x, y]: number[]) => { const r = calc(x, y); return r.s * r.f * 16 })
  const rawS = useTransform([mx, my], ([x, y]: number[]) => 1 + calc(x, y).f * 0.14)
  const cfg = { stiffness: 170, damping: 15, mass: 0.7 }
  const x = useSpring(rawX, cfg), y = useSpring(rawY, cfg), rotate = useSpring(rawR, cfg), scale = useSpring(rawS, cfg)
  return (
    <span ref={wrap} className={cn('inline-block pb-[0.08em] align-bottom', !ready && 'overflow-hidden')}>
      <motion.span
        className="inline-block will-change-transform"
        initial={reduced ? false : { y: '115%', rotate: 8 }}
        animate={{ y: 0, rotate: 0 }}
        transition={{ duration: 1, delay: 0.15 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.span className="inline-block" style={{ x, y, rotate, scale }}>{ch}</motion.span>
      </motion.span>
    </span>
  )
}

/**
 * Kinetic Name Hero — your name set huge, with every letter reacting to the pointer on its own spring: letters are
 * pushed away, tilt and swell as the cursor passes, then ease home. Letters rise out of masks on load, a soft light
 * trails the cursor and a rotating badge circles the role. Touch drags work the same.
 */
export function KineticNameHero({ name = 'Nova Reyes', role = 'Design engineer & motion designer', intro = 'I build calm, tactile interfaces for teams that care how software feels — from first sketch to the last 1% of polish.', ctaLabel = 'See selected work', onCta, secondaryLabel = 'About me', onSecondary, badge = 'Available · Autumn 2026 · ', radius = RADIUS, className }: KineticNameHeroProps) {
  const reduced = usePrefersReducedMotion()
  const circId = `kn-circ-${React.useId().replace(/:/g, '')}`
  const root = React.useRef<HTMLElement>(null)
  const mx = useMotionValue(-9999)
  const my = useMotionValue(-9999)
  const gx = useSpring(useMotionValue(400), { stiffness: 60, damping: 20 })
  const gy = useSpring(useMotionValue(200), { stiffness: 60, damping: 20 })
  const glow = useMotionTemplate`radial-gradient(520px circle at ${gx}px ${gy}px, rgb(154 134 184 / 0.28), transparent 70%)`
  const [ready, setReady] = React.useState(false)
  React.useEffect(() => { const t = window.setTimeout(() => setReady(true), 1900); return () => window.clearTimeout(t) }, [])
  const words = name.trim().split(/\s+/)
  const last = words.length - 1

  const move = (e: React.PointerEvent) => {
    mx.set(e.clientX); my.set(e.clientY)
    const b = root.current?.getBoundingClientRect()
    if (b) { gx.set(e.clientX - b.left); gy.set(e.clientY - b.top) }
  }
  return (
    <section
      ref={root}
      aria-label={`${name} — ${role}`}
      onPointerMove={move}
      onPointerLeave={() => { mx.set(-9999); my.set(-9999) }}
      className={cn('relative isolate flex min-h-[600px] w-full max-w-4xl flex-col justify-between overflow-hidden rounded-3xl bg-stone-100 p-6 text-zinc-950 ring-1 ring-black/5 sm:p-10 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-white/10', className)}
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: glow }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.5] [background-image:radial-gradient(rgb(0_0_0/0.07)_1px,transparent_1px)] [background-size:22px_22px] dark:[background-image:radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1px)]" />

      <div className="flex items-start justify-between gap-4">
        <motion.p initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }} className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          <span className="h-px w-8 bg-zinc-400 dark:bg-zinc-600" aria-hidden />{role}
        </motion.p>
        <div className="relative hidden h-24 w-24 shrink-0 sm:block" aria-hidden>
          <motion.svg viewBox="0 0 100 100" className="h-full w-full" animate={reduced ? undefined : { rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}>
            <defs><path id={circId} d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" /></defs>
            <text className="fill-zinc-800 text-[10.5px] font-semibold uppercase dark:fill-zinc-200"><textPath href={`#${circId}`} textLength="236" lengthAdjust="spacing">{badge.replace(/[\s·]+$/, '')} · </textPath></text>
          </motion.svg>
          <ArrowDownRight className="absolute inset-0 m-auto h-6 w-6 text-framekit-600 dark:text-framekit-400" />
        </div>
      </div>

      <h2 aria-hidden className="my-8 font-display text-[clamp(76px,17.5vw,190px)] leading-[0.82] tracking-[-0.03em]">
        {words.map((w, wi) => (
          <span key={wi} className="block">
            {Array.from(w).map((ch, i) => <Letter key={i} ch={ch} index={wi * 6 + i} mx={mx} my={my} radius={radius} ready={ready} reduced={reduced} />)}
            {wi === last && <span className="inline-block text-framekit-600 dark:text-framekit-400">.</span>}
          </span>
        ))}
      </h2>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <motion.p initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="max-w-[44ch] text-base leading-relaxed text-zinc-700 dark:text-zinc-300">{intro}</motion.p>
        <motion.div initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="flex flex-wrap gap-2.5">
          <button type="button" onClick={onCta} className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-zinc-950 px-6 text-sm font-semibold text-white transition-[transform,background-color] hover:bg-zinc-800 active:scale-95 motion-reduce:active:scale-100 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200">{ctaLabel}<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden /></button>
          <button type="button" onClick={onSecondary} className="inline-flex min-h-12 items-center rounded-full px-6 text-sm font-semibold text-zinc-900 ring-1 ring-inset ring-zinc-400 transition-colors hover:bg-white dark:text-zinc-100 dark:ring-zinc-600 dark:hover:bg-zinc-900">{secondaryLabel}</button>
        </motion.div>
      </div>
      <span className="sr-only">{name}, {role}</span>
    </section>
  )
}
