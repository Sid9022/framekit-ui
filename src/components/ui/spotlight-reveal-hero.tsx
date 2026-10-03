import * as React from 'react'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type SpotlightRevealHeroProps = {
  eyebrow?: string
  title?: string
  /** What the spotlight reveals — the same message in its “lit” voice. */
  revealTitle?: string
  description?: string
  ctaLabel?: string
  onCta?: () => void
  /** Spotlight radius in px. */
  radius?: number
  className?: string
}

/**
 * Spotlight Reveal Hero — the page rests in a quiet paper (or ink) voice; a soft lens follows the cursor and reveals
 * the lit version underneath: saturated gradient, drawn grid, floating marks and a bolder headline. When nobody is
 * pointing the beam wanders on its own, presses widen it, and keyboard focus on the button pulls it onto the button.
 */
export function SpotlightRevealHero({ eyebrow = 'Portfolio 2026', title = 'Quiet work. Loud results.', revealTitle = 'Switch the lights on.', description = 'Interfaces, identities and motion for products that deserve a second look. Move across the page to turn the lights up.', ctaLabel = 'View the work', onCta, radius = 190, className }: SpotlightRevealHeroProps) {
  const reduced = usePrefersReducedMotion()
  const root = React.useRef<HTMLElement>(null)
  const cta = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    const el = root.current
    if (!el) return
    const s = { x: 0.5, y: 0.45, r: radius * 0.75, tx: 0.5, ty: 0.45, tr: radius, hover: false, focus: false, down: false, t: Math.random() * 10 }
    let W = 1, H = 1
    const size = () => { const b = el.getBoundingClientRect(); W = b.width || 1; H = b.height || 1 }
    size()
    const ro = new ResizeObserver(size)
    ro.observe(el)
    const set = () => {
      el.style.setProperty('--sx', `${s.x * W}px`)
      el.style.setProperty('--sy', `${s.y * H}px`)
      el.style.setProperty('--sr', `${s.r}px`)
    }
    const onMove = (e: PointerEvent) => {
      const b = el.getBoundingClientRect()
      s.tx = (e.clientX - b.left) / b.width; s.ty = (e.clientY - b.top) / b.height; s.hover = true
    }
    const onLeave = () => { s.hover = false }
    const onDown = () => { s.down = true }
    const onUp = () => { s.down = false }
    const onFocus = () => { s.focus = true }
    const onBlur = () => { s.focus = false }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    const btn = cta.current
    btn?.addEventListener('focus', onFocus)
    btn?.addEventListener('blur', onBlur)
    if (reduced) { s.x = 0.5; s.y = 0.5; s.r = radius * 1.1; set(); return () => { ro.disconnect(); el.removeEventListener('pointermove', onMove) } }
    let raf = 0, last = performance.now(), visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0 })
    io.observe(el)
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (!visible) { last = now; return }
      const dt = Math.min(0.05, (now - last) / 1000); last = now
      s.t += dt
      if (s.focus && btn) {
        const b = btn.getBoundingClientRect(), r = el.getBoundingClientRect()
        s.tx = (b.left + b.width / 2 - r.left) / r.width; s.ty = (b.top + b.height / 2 - r.top) / r.height
      } else if (!s.hover) {
        s.tx = 0.5 + Math.sin(s.t * 0.55) * 0.34
        s.ty = 0.5 + Math.sin(s.t * 0.83 + 1) * 0.26
      }
      s.tr = radius * (s.down ? 1.7 : s.hover || s.focus ? 1 : 0.85)
      const k = 1 - Math.pow(0.0009, dt) // frame-rate independent lerp (~0.12 @60fps)
      s.x += (s.tx - s.x) * k
      s.y += (s.ty - s.y) * k
      s.r += (s.tr - s.r) * k
      set()
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect()
      el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerleave', onLeave); el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp); btn?.removeEventListener('focus', onFocus); btn?.removeEventListener('blur', onBlur)
    }
  }, [radius, reduced])

  const mask = 'radial-gradient(circle var(--sr) at var(--sx) var(--sy), #000 0%, #000 52%, transparent 100%)'
  return (
    <section ref={root} aria-label="Introduction" className={cn('relative isolate flex min-h-[560px] w-full max-w-4xl flex-col justify-center overflow-hidden rounded-3xl bg-[#f3efe7] p-6 text-zinc-950 ring-1 ring-black/5 sm:p-12 dark:bg-[#0b0b10] dark:text-zinc-50 dark:ring-white/10', className)} style={{ ['--sx' as string]: '50%', ['--sy' as string]: '45%', ['--sr' as string]: `${radius}px` }}>
      {/* quiet voice */}
      <div className="relative z-10 max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-700 dark:text-zinc-300">{eyebrow}</p>
        <motion.h2 initial={reduced ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="mt-4 font-display text-[clamp(52px,10vw,104px)] leading-[0.92] tracking-[-0.02em]">{title}</motion.h2>
        <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-zinc-700 dark:text-zinc-300">{description}</p>
        <button ref={cta} type="button" onClick={onCta} className="group mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-zinc-950 px-6 text-sm font-semibold text-white transition-transform hover:bg-zinc-800 active:scale-95 motion-reduce:active:scale-100 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200">{ctaLabel}<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden /></button>
      </div>

      {/* soft bloom under the lens */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] mix-blend-multiply dark:mix-blend-screen" style={{ background: 'radial-gradient(calc(var(--sr) * 1.5) circle at var(--sx) var(--sy), rgb(251 146 60 / 0.22), transparent 70%)' }} />

      {/* lit voice — masked by the lens */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-hidden bg-[radial-gradient(90%_90%_at_20%_10%,#4c1d95,#1e1b4b_55%,#0c0a1f)] text-[#fdf2e4]" style={{ WebkitMaskImage: mask, maskImage: mask }}>
        <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden><defs><pattern id="sr-grid" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" fill="none" stroke="#c4b5fd" strokeWidth="0.6" /></pattern></defs><rect width="100%" height="100%" fill="url(#sr-grid)" /></svg>
        <div className="absolute -right-10 top-6 h-56 w-56 rounded-full bg-[conic-gradient(from_90deg,#fb923c,#f472b6,#a78bfa,#fb923c)] opacity-90 blur-[1px]" />
        <div className="absolute bottom-10 right-1/4 h-24 w-24 rotate-12 rounded-3xl border-2 border-[#fdba74]" />
        <div className="absolute bottom-24 right-8 h-3 w-3 rounded-full bg-[#fde68a]" />
        <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#fdba74]">{eyebrow} · lit</p>
          <p className="mt-4 max-w-xl font-display text-[clamp(52px,10vw,104px)] italic leading-[0.92] tracking-[-0.02em] [text-shadow:0_0_40px_rgb(251_146_60/0.45)]">{revealTitle}</p>
          <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-violet-100">{description}</p>
          <span className="mt-8 inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-[#fdba74] px-6 text-sm font-semibold text-zinc-950">{ctaLabel}<ArrowRight className="h-4 w-4" /></span>
        </div>
      </div>
    </section>
  )
}
