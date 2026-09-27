import * as React from 'react'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useResolvedTheme, type ThemeMode } from '@/lib/use-resolved-theme'

export type RidgelineHorizonHeroProps = {
  eyebrow?: string
  /** Headline; words listed in `highlight` get the dawn gradient. */
  title?: string
  highlight?: string
  description?: string
  ctaLabel?: string
  onCta?: () => void
  secondaryLabel?: string
  onSecondary?: () => void
  /** Number of ridgelines (12–48). */
  lines?: number
  /** Pointer swells + click ripples. */
  interactive?: boolean
  theme?: ThemeMode
  className?: string
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

/**
 * Ridgeline Horizon Hero — a landing hero set above a terrain of stacked
 * ridgelines that recede to a glowing horizon. Moving the pointer raises a
 * swell that travels back toward the horizon; clicking sends a ripple.
 */
export function RidgelineHorizonHero({
  eyebrow = 'Field notes · Issue 12',
  title = 'Build quietly. Launch like a sunrise.',
  highlight = 'like a sunrise.',
  description = 'A calm canvas for loud ideas. Ridgelines breathe beneath your headline and answer every move with a swell that rolls to the horizon.',
  ctaLabel = 'Start the climb',
  onCta,
  secondaryLabel = 'Read the notes',
  onSecondary,
  lines = 30,
  interactive = true,
  theme = 'auto',
  className,
}: RidgelineHorizonHeroProps) {
  const reduced = usePrefersReducedMotion()
  const rootRef = React.useRef<HTMLElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const resolved = useResolvedTheme(rootRef, theme)
  const pointer = React.useRef({ x: 0.5, y: 0.5, amp: 0, inside: false, pulse: 0, pulseX: 0.5 })
  const L = clamp(Math.round(lines), 12, 48)

  React.useEffect(() => {
    const canvas = canvasRef.current
    const root = rootRef.current
    if (!canvas || !root) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dark = resolved === 'dark'
    let W = 0
    let H = 0
    let dpr = 1
    const resize = () => {
      const r = root.getBoundingClientRect()
      dpr = Math.min(2, window.devicePixelRatio || 1)
      W = Math.max(1, r.width)
      H = Math.max(1, r.height)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      if (reduced) draw(0)
    }
    /* history ring of the swell, read with a per-line delay so it travels to the horizon */
    const HIST = 256
    const histX = new Float32Array(HIST).fill(0.5)
    const histA = new Float32Array(HIST)
    let head = 0
    let t = Math.random() * 100
    let sx = 0.5
    let sa = 0
    const stars = Array.from({ length: 46 }, () => ({ x: Math.random(), y: Math.random() * 0.5, p: Math.random() * 6.28, s: Math.random() * 1.1 + 0.3 }))

    const bg = dark ? '#06070d' : '#f5efe4'
    function draw(dt: number) {
      if (!ctx) return
      t += dt
      const P = pointer.current
      // smooth pointer swell
      sx += (P.x - sx) * 0.12
      sa += ((P.inside ? 1 : 0) - sa) * 0.05
      P.pulse *= 0.94
      head = (head + 1) % HIST
      histX[head] = P.pulse > 0.05 ? P.pulseX : sx
      histA[head] = sa * 0.55 + P.pulse * 1.6
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const horizon = H * 0.645
      // sky
      const sky = ctx.createLinearGradient(0, 0, 0, horizon)
      if (dark) {
        sky.addColorStop(0, '#05060b')
        sky.addColorStop(0.7, '#0c0d1f')
        sky.addColorStop(1, '#1c1636')
      } else {
        sky.addColorStop(0, '#f7f2ea')
        sky.addColorStop(0.75, '#f6e7d8')
        sky.addColorStop(1, '#f3d6c0')
      }
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, W, horizon + 2)
      ctx.fillStyle = bg
      ctx.fillRect(0, horizon, W, H - horizon)
      // stars
      if (dark) {
        for (const s of stars) {
          const a = 0.25 + 0.35 * Math.sin(t * 1.3 + s.p)
          ctx.fillStyle = `rgba(220,225,255,${clamp(a, 0, 1)})`
          ctx.fillRect(s.x * W, s.y * horizon, s.s, s.s)
        }
      }
      // sun
      const sunY = horizon - H * 0.02 + Math.sin(t * 0.15) * 3
      const sunR = Math.min(W, H) * 0.14
      const glow = ctx.createRadialGradient(W / 2, sunY, 0, W / 2, sunY, sunR * 3.2)
      glow.addColorStop(0, dark ? 'rgba(255,150,120,0.35)' : 'rgba(255,160,110,0.40)')
      glow.addColorStop(1, 'rgba(255,150,120,0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, W, horizon + sunR)
      const disc = ctx.createLinearGradient(0, sunY - sunR, 0, sunY + sunR)
      disc.addColorStop(0, dark ? '#ffd29a' : '#ffcf9e')
      disc.addColorStop(0.6, dark ? '#ff7a86' : '#ff9a7a')
      disc.addColorStop(1, dark ? '#a24bd6' : '#ff7f8a')
      ctx.fillStyle = disc
      ctx.beginPath()
      ctx.arc(W / 2, sunY, sunR, 0, Math.PI * 2)
      ctx.fill()

      // ridgelines, far → near (painter's order)
      const step = Math.max(4, Math.round(W / 180))
      for (let i = 0; i < L; i++) {
        const d = i / (L - 1) // 0 far → 1 near
        const y0 = horizon + (H - horizon + 30) * Math.pow(d, 1.55) + 2
        const scale = 0.18 + 0.82 * d
        const amp = (H * 0.2) * scale
        const hi = (head - Math.round((1 - d) * (L * 2.2)) + HIST * 4) % HIST
        const bx = histX[hi] * W
        const ba = histA[hi]
        const ph = i * 0.73
        ctx.beginPath()
        ctx.moveTo(-10, H + 10)
        for (let x = -step; x <= W + step; x += step) {
          const u = x / W
          const env = Math.exp(-Math.pow((u - 0.5) / 0.26, 2)) * 0.85 + 0.15
          let n =
            Math.sin(u * 13.0 + ph + t * 0.35) * 0.5 +
            Math.sin(u * 27.0 - ph * 1.7 + t * 0.6) * 0.28 +
            Math.sin(u * 51.0 + ph * 2.3 - t * 0.9) * 0.14
          n = Math.pow(clamp(0.5 + 0.5 * n, 0, 1), 2.2)
          const bump = Math.exp(-Math.pow((x - bx) / (W * 0.07 + 30 * scale), 2)) * ba
          const y = y0 - amp * (env * n + bump * 0.9)
          ctx.lineTo(x, y)
        }
        ctx.lineTo(W + 10, H + 10)
        ctx.closePath()
        ctx.fillStyle = bg
        ctx.fill()
        const alpha = 0.18 + 0.72 * d
        if (dark) {
          const hue = 280 - 90 * d
          ctx.strokeStyle = `hsla(${hue}, 85%, ${72 - d * 10}%, ${alpha})`
        } else {
          ctx.strokeStyle = `rgba(${Math.round(70 - d * 40)}, ${Math.round(48 - d * 20)}, ${Math.round(90 - d * 30)}, ${alpha * 0.9})`
        }
        ctx.lineWidth = 0.8 + d * 0.9
        ctx.stroke()
      }
      // horizon haze
      const haze = ctx.createLinearGradient(0, horizon - 10, 0, horizon + H * 0.12)
      haze.addColorStop(0, dark ? 'rgba(28,22,54,0)' : 'rgba(243,214,192,0)')
      haze.addColorStop(0.5, dark ? 'rgba(28,22,54,0.35)' : 'rgba(243,214,192,0.45)')
      haze.addColorStop(1, dark ? 'rgba(6,7,13,0)' : 'rgba(245,239,228,0)')
      ctx.fillStyle = haze
      ctx.fillRect(0, horizon - 10, W, H * 0.14)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(root)
    if (reduced) {
      draw(0)
      return () => ro.disconnect()
    }
    let raf = 0
    let last = performance.now()
    let visible = true
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      draw(dt)
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (raf || !visible || document.hidden) return
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(root)
    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVis)
    start()
    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [resolved, reduced, L])

  const onMove = (e: React.PointerEvent) => {
    if (!interactive) return
    const r = e.currentTarget.getBoundingClientRect()
    pointer.current.x = (e.clientX - r.left) / r.width
    pointer.current.y = (e.clientY - r.top) / r.height
    pointer.current.inside = true
  }
  const onDown = (e: React.PointerEvent) => {
    if (!interactive) return
    if ((e.target as HTMLElement).closest('button,a')) return
    const r = e.currentTarget.getBoundingClientRect()
    pointer.current.pulse = 1
    pointer.current.pulseX = (e.clientX - r.left) / r.width
  }

  const words = title.split(' ')
  const hiWords = new Set(highlight.split(' ').filter(Boolean))
  const hiStart = title.indexOf(highlight)

  return (
    <section
      ref={rootRef}
      onPointerMove={onMove}
      onPointerLeave={() => (pointer.current.inside = false)}
      onPointerDown={onDown}
      className={cn(
        'relative isolate flex min-h-[600px] w-full flex-col items-center overflow-hidden rounded-[28px] px-6 pt-14 text-center ring-1',
        resolved === 'dark' ? 'bg-[#06070d] text-white ring-white/[0.06]' : 'bg-[#f5efe4] text-zinc-900 ring-black/[0.06]',
        className,
      )}
    >
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 -z-10" />
      <motion.span
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em] ring-1 backdrop-blur-sm',
          resolved === 'dark' ? 'bg-white/[0.04] text-zinc-300 ring-white/10' : 'bg-white/60 text-zinc-600 ring-black/[0.06]',
        )}
      >
        {eyebrow}
      </motion.span>
      <h1 className="mt-5 max-w-2xl font-display text-[clamp(34px,5.6vw,60px)] leading-[1.02] tracking-tight">
        {words.map((w, i) => {
          const offset = words.slice(0, i).join(' ').length + (i ? 1 : 0)
          const hl = hiStart >= 0 ? offset >= hiStart && offset < hiStart + highlight.length : hiWords.has(w)
          return (
            <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span
                className={cn(
                  'inline-block',
                  hl && 'bg-clip-text italic text-transparent',
                  hl && (resolved === 'dark' ? 'bg-[linear-gradient(100deg,#ffd29a,#ff7a86_55%,#b36bff)]' : 'bg-[linear-gradient(100deg,#e2803e,#e0506a_55%,#8a4bd0)]'),
                )}
                initial={reduced ? false : { y: '110%', rotate: 4 }}
                animate={{ y: '0%', rotate: 0 }}
                transition={{ type: 'spring', stiffness: 170, damping: 22, delay: 0.15 + i * 0.06 }}
              >
                {w}
              </motion.span>
              {i < words.length - 1 && '\u00a0'}
            </span>
          )
        })}
      </h1>
      <motion.p
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.55 }}
        className={cn('mt-4 max-w-lg text-[15px] leading-relaxed', resolved === 'dark' ? 'text-zinc-300 [text-shadow:0_1px_12px_rgb(6_7_13/0.9)]' : 'text-zinc-700 [text-shadow:0_1px_12px_rgb(245_239_228/0.9)]')}
      >
        {description}
      </motion.p>
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="mt-7 flex flex-wrap justify-center gap-3"
      >
        <button
          type="button"
          onClick={onCta}
          className={cn(
            'group inline-flex h-11 items-center gap-2 rounded-full pl-5 pr-4 text-sm font-medium outline-none transition active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-offset-2',
            resolved === 'dark'
              ? 'bg-white text-zinc-950 shadow-[0_0_40px_-8px_rgb(255_140_130/0.6)] focus-visible:ring-rose-300 focus-visible:ring-offset-[#06070d]'
              : 'bg-zinc-900 text-white shadow-[0_12px_30px_-12px_rgb(120_40_40/0.5)] focus-visible:ring-rose-400 focus-visible:ring-offset-[#f5efe4]',
          )}
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
        {secondaryLabel && (
          <button
            type="button"
            onClick={onSecondary}
            className={cn(
              'inline-flex h-11 items-center rounded-full px-5 text-sm font-medium ring-1 outline-none backdrop-blur-sm transition active:scale-[0.97] focus-visible:ring-2',
              resolved === 'dark' ? 'text-zinc-200 ring-white/15 hover:bg-white/5 focus-visible:ring-rose-300' : 'bg-white/40 text-zinc-800 ring-black/10 hover:bg-white/70 focus-visible:ring-rose-400',
            )}
          >
            {secondaryLabel}
          </button>
        )}
      </motion.div>
    </section>
  )
}
