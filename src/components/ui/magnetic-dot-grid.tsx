import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useResolvedTheme } from '@/lib/use-resolved-theme'

export type MagneticDotGridProps = {
  /** Gap between dots in px. */
  gap?: number
  /** Influence radius in px. */
  radius?: number
  /** Pull strength (negative repels). */
  strength?: number
  height?: number
  children?: React.ReactNode
  className?: string
}

/**
 * Magnetic Dot Grid — a canvas field of dots that lean toward the pointer on
 * spring physics, swell and pick up an accent tint near it, then settle back
 * with a soft wobble. Click sends a ripple. Static grid on reduced motion.
 */
export function MagneticDotGrid({ gap = 22, radius = 140, strength = 0.35, height = 420, children, className }: MagneticDotGridProps) {
  const cv = React.useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()
  const theme = useResolvedTheme(cv)
  const ptr = React.useRef({ x: -9999, y: -9999 })
  const ripple = React.useRef<{ x: number; y: number; t: number } | null>(null)
  React.useEffect(() => {
    const c = cv.current; if (!c) return
    const ctx = c.getContext('2d')!; let raf = 0
    type D = { ox: number; oy: number; x: number; y: number; vx: number; vy: number }
    let dots: D[] = [], w = 0, h = 0
    const dark = theme === 'dark'
    const setup = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1); w = c.clientWidth; h = c.clientHeight
      c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dots = []
      for (let y = gap / 2; y < h; y += gap) for (let x = gap / 2; x < w; x += gap) dots.push({ ox: x, oy: y, x, y, vx: 0, vy: 0 })
    }
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const { x: px, y: py } = ptr.current
      const rp = ripple.current; const rt = rp ? (performance.now() - rp.t) / 1000 : 0
      if (rp && rt > 1.2) ripple.current = null
      for (const d of dots) {
        let tx = d.ox, ty = d.oy
        const dx = px - d.ox, dy = py - d.oy, dist = Math.hypot(dx, dy)
        const f = !reduced && dist < radius ? (1 - dist / radius) ** 2 : 0
        tx += dx * f * strength; ty += dy * f * strength
        if (rp && !reduced) { const rd = Math.hypot(d.ox - rp.x, d.oy - rp.y); const wave = Math.exp(-((rd - rt * 520) ** 2) / 900) * (1 - rt / 1.2); tx += ((d.ox - rp.x) / (rd || 1)) * wave * 14; ty += ((d.oy - rp.y) / (rd || 1)) * wave * 14 }
        d.vx = (d.vx + (tx - d.x) * 0.12) * 0.78; d.vy = (d.vy + (ty - d.y) * 0.12) * 0.78
        d.x += d.vx; d.y += d.vy
        const s = 1.2 + f * 2.4
        ctx.fillStyle = f > 0.02 ? `rgba(${dark ? '129,140,248' : '79,70,229'},${0.35 + f * 0.65})` : dark ? 'rgba(255,255,255,0.18)' : 'rgba(24,24,27,0.18)'
        ctx.beginPath(); ctx.arc(d.x, d.y, s, 0, Math.PI * 2); ctx.fill()
      }
      if (!reduced) raf = requestAnimationFrame(draw)
    }
    setup(); draw()
    const ro = new ResizeObserver(() => { setup(); if (reduced) draw() }); ro.observe(c)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [gap, radius, strength, reduced, theme])
  return (
    <div className={cn('relative w-full overflow-hidden rounded-[24px] bg-white ring-1 ring-black/[0.06] dark:bg-zinc-950 dark:ring-white/[0.08]', className)} style={{ height }}
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); ptr.current = { x: e.clientX - r.left, y: e.clientY - r.top } }}
      onPointerLeave={() => { ptr.current = { x: -9999, y: -9999 } }}
      onPointerDown={(e) => { const r = e.currentTarget.getBoundingClientRect(); ripple.current = { x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() } }}>
      <canvas ref={cv} aria-hidden className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none relative grid h-full place-items-center p-6 text-center">{children ?? (
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-indigo-700 dark:text-indigo-300">Field</p>
          <p className="mt-2 text-balance text-3xl font-semibold tracking-[-0.03em] text-zinc-950 sm:text-5xl dark:text-white">Move. Click. Feel it.</p>
        </div>
      )}</div>
    </div>
  )
}
