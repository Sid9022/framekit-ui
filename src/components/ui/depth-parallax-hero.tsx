import * as React from 'react'
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type DepthParallaxHeroProps = {
  eyebrow?: string
  name?: string
  title?: string
  description?: string
  ctaLabel?: string
  onCta?: () => void
  /** Parallax strength multiplier (0 disables pointer parallax). */
  strength?: number
  className?: string
}

/** Deterministic ridge path across a 1200×400 viewBox. */
function ridge(seed: number, base: number, amp: number, rough: number) {
  let s = seed * 9301 + 49297
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  const pts: [number, number][] = []
  const n = 14
  for (let i = 0; i <= n; i++) pts.push([(i / n) * 1240 - 20, base - amp * (0.35 + r() * rough) * (i % 2 ? 1 : 0.6)])
  let d = `M-20 420 L${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]
    d += ` C${x0 + (x1 - x0) / 2} ${y0} ${x0 + (x1 - x0) / 2} ${y1} ${x1} ${y1}`
  }
  return d + ' L1220 420 Z'
}

function Layer({ depth, px, py, className, children, rise }: { depth: number; px: MotionValue<number>; py: MotionValue<number>; className?: string; children: React.ReactNode; rise: number }) {
  const x = useTransform(px, (v) => v * depth * 60)
  const y = useTransform(py, (v) => v * depth * 30)
  return (
    <motion.div className={cn('pointer-events-none absolute inset-x-[-6%] bottom-0', className)} style={{ x, y }} aria-hidden>
      <motion.div initial={{ y: 80 * rise, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.4, delay: 0.1 + (1 - depth) * 0.45, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>
    </motion.div>
  )
}

/**
 * Depth Parallax Hero — a layered landscape built from generated SVG ridges: sky and sun, three mountain planes, a
 * tree line and drifting motes. Each plane shifts at its own factor with the pointer (or a slow idle sway), rises into
 * place in a depth-ordered stagger, and a giant name sits between the planes so mountains pass in front of it.
 */
export function DepthParallaxHero({ eyebrow = 'Portfolio · 2026', name = 'Mira Castell', title = 'I design interfaces with real depth.', description = 'Product design and front-end craft for teams who want software that feels like a place, not a page.', ctaLabel = 'Enter the portfolio', onCta, strength = 1, className }: DepthParallaxHeroProps) {
  const reduced = usePrefersReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 60, damping: 18, mass: 0.8 })
  const sy = useSpring(py, { stiffness: 60, damping: 18, mass: 0.8 })
  const paths = React.useMemo(() => [ridge(3, 250, 190, 0.9), ridge(8, 290, 150, 0.8), ridge(14, 330, 120, 0.7), ridge(21, 372, 70, 0.6)], [])
  const motes = React.useMemo(() => Array.from({ length: 22 }, (_, i) => ({ x: (i * 37) % 100, y: 12 + ((i * 53) % 55), s: 2 + (i % 3), d: 7 + (i % 5) * 2.2, delay: (i % 7) * 0.8 })), [])
  const tx = useTransform(sx, (v) => v * -10)
  const ty = useTransform(sy, (v) => v * -6)

  React.useEffect(() => {
    if (reduced || !strength) return
    let raf = 0
    const t0 = performance.now()
    const idle = (now: number) => {
      raf = requestAnimationFrame(idle)
      if (hovering.current) return
      const t = (now - t0) / 1000
      px.set(Math.sin(t * 0.3) * 0.5 * strength)
      py.set(Math.sin(t * 0.21 + 1) * 0.3 * strength)
    }
    raf = requestAnimationFrame(idle)
    return () => cancelAnimationFrame(raf)
  }, [reduced, strength, px, py])
  const hovering = React.useRef(false)

  return (
    <section
      aria-label="Introduction"
      onPointerMove={(e) => {
        if (reduced || !strength) return
        const b = e.currentTarget.getBoundingClientRect()
        hovering.current = true
        px.set(((e.clientX - b.left) / b.width - 0.5) * 2 * strength)
        py.set(((e.clientY - b.top) / b.height - 0.5) * 2 * strength)
      }}
      onPointerLeave={() => { hovering.current = false }}
      className={cn('relative isolate flex min-h-[720px] sm:min-h-[620px] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-gradient-to-b from-[#fde8d3] via-[#f9c9a5] to-[#f3a88a] text-zinc-950 ring-1 ring-black/5 dark:from-[#07061a] dark:via-[#1a1240] dark:to-[#4a2467] dark:text-zinc-50 dark:ring-white/10', className)}
    >
      {/* sky: sun / moon + stars */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ x: tx, y: ty }}>
        <div className="absolute left-1/2 top-[60%] h-36 w-36 -translate-x-1/2 sm:left-[74%] sm:top-[16%] sm:h-44 sm:w-44 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fffbeb,#fdba74_55%,#fb923c)] shadow-[0_0_120px_40px_rgb(251_146_60/0.45)] dark:bg-[radial-gradient(circle_at_35%_30%,#fff,#e9d5ff_60%,#a78bfa)] dark:shadow-[0_0_120px_30px_rgb(167_139_250/0.4)]" />
        <div className="absolute inset-0 hidden dark:block" style={{ backgroundImage: 'radial-gradient(1.2px 1.2px at 12% 18%,#fff,transparent),radial-gradient(1px 1px at 78% 12%,#fff,transparent),radial-gradient(1.4px 1.4px at 62% 28%,#fff,transparent),radial-gradient(1px 1px at 30% 36%,#fff,transparent),radial-gradient(1.2px 1.2px at 90% 40%,#fff,transparent),radial-gradient(1px 1px at 8% 48%,#fff,transparent)' }} />
      </motion.div>

      {/* giant name between mountain planes */}
      <motion.p aria-hidden className="pointer-events-none absolute inset-x-0 top-[46%] text-center font-display text-[clamp(90px,24vw,260px)] leading-none tracking-[-0.03em] text-white/55 dark:text-white/10" style={{ x: useTransform(sx, (v) => v * 22), y: useTransform(sy, (v) => v * 10) }} initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}>{name.split(' ')[0]}</motion.p>

      <Layer depth={0.25} px={sx} py={sy} rise={1} className="h-[70%]"><svg viewBox="0 0 1200 420" preserveAspectRatio="none" className="h-full w-full"><path d={paths[0]} className="fill-[#e9a88f] dark:fill-[#2a1d5c]" /></svg></Layer>
      <Layer depth={0.5} px={sx} py={sy} rise={1.2} className="h-[58%]"><svg viewBox="0 0 1200 420" preserveAspectRatio="none" className="h-full w-full"><path d={paths[1]} className="fill-[#d98a78] dark:fill-[#1f1650]" /></svg></Layer>
      <Layer depth={0.8} px={sx} py={sy} rise={1.4} className="h-[44%]"><svg viewBox="0 0 1200 420" preserveAspectRatio="none" className="h-full w-full"><path d={paths[2]} className="fill-[#b9627a] dark:fill-[#150f3a]" /></svg></Layer>

      {/* readable content sits above the far planes */}
      <div className="relative z-10 px-6 pt-10 sm:px-12 sm:pt-14">
        <motion.p initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-950 dark:text-zinc-100">{eyebrow}</motion.p>
        <motion.h2 initial={reduced ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 1, ease: [0.16, 1, 0.3, 1] }} className="mt-3 max-w-[14ch] font-display text-[clamp(40px,7vw,76px)] leading-[0.98] tracking-[-0.02em] text-zinc-950 dark:text-white">{title}</motion.h2>
        <motion.p initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85, duration: 1 }} className="mt-4 max-w-[40ch] text-base leading-relaxed text-zinc-900 dark:text-zinc-100">{description}</motion.p>
        <motion.button type="button" onClick={onCta} initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }} className="group mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-zinc-950 px-6 text-sm font-semibold text-white shadow-lg transition-transform hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-orange-50 active:scale-95 motion-reduce:active:scale-100">{ctaLabel}<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden /></motion.button>
      </div>

      {/* foreground: trees + motes (in front of the text for depth) */}
      <Layer depth={1.2} px={sx} py={sy} rise={1.6} className="h-[22%]">
        <svg viewBox="0 0 1200 420" preserveAspectRatio="none" className="h-full w-full">
          <path d={paths[3]} className="fill-[#7c3a5e] dark:fill-[#0a0722]" />
          {Array.from({ length: 16 }, (_, i) => { const x = 20 + i * 76 + (i % 3) * 14, h = 90 + ((i * 47) % 70); return <path key={i} d={`M${x} 420 L${x + 20} ${420 - h} L${x + 40} 420Z`} className="fill-[#5c2748] dark:fill-[#07051a]" /> })}
        </svg>
      </Layer>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        {!reduced && motes.map((m, i) => (
          <motion.span key={i} className="absolute rounded-full bg-amber-100/90 shadow-[0_0_8px_2px_rgb(253_230_138/0.6)] dark:bg-violet-200/90 dark:shadow-[0_0_8px_2px_rgb(196_181_253/0.6)]" style={{ left: `${m.x}%`, top: `${m.y}%`, width: m.s, height: m.s }} animate={{ y: [0, -26, 0], x: [0, 10, 0], opacity: [0, 0.9, 0] }} transition={{ duration: m.d, repeat: Infinity, delay: m.delay, ease: 'easeInOut' }} />
        ))}
      </div>
    </section>
  )
}
