import * as React from 'react'
import { Pause, Play } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useResolvedTheme, type ThemeMode } from '@/lib/use-resolved-theme'

export type FlickerDotFieldProps = {
  /** Square cells (LED panel) or round dots (dot pattern). */
  shape?: 'square' | 'dot'
  /** Size of each mark in px. Clamped 1–8. */
  size?: number
  /** Distance between mark centres in px. Clamped 6–48. */
  spacing?: number
  /** How lively the field is, 0 (still dot pattern) – 1. */
  flicker?: number
  /** Brightest a mark gets, 0–1. */
  maxOpacity?: number
  /** Mark colour. Defaults to lilac tuned per theme. */
  color?: string
  /** Marks near the pointer brighten. */
  pointerGlow?: boolean
  /** Soft vignette mask so the field fades at the edges. */
  vignette?: boolean
  /** Show a Pause / Play control. */
  showControls?: boolean
  theme?: ThemeMode
  children?: React.ReactNode
  className?: string
}

/**
 * Flicker Dot Field — a calm LED-like matrix. Each mark drifts between brightness levels on its own clock, so the
 * field shimmers without ever syncing; pass the pointer through and nearby marks glow. Set `flicker` to 0 for a still
 * dot pattern. Canvas 2D, DPR-aware, paused offscreen, and drawn once under reduced motion.
 */
export function FlickerDotField({
  shape = 'square',
  size = 3,
  spacing = 12,
  flicker = 0.5,
  maxOpacity = 0.6,
  color,
  pointerGlow = true,
  vignette = true,
  showControls = true,
  theme = 'auto',
  children,
  className,
}: FlickerDotFieldProps) {
  const reduced = usePrefersReducedMotion()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const resolved = useResolvedTheme(rootRef, theme)
  const darkRef = React.useRef(resolved === 'dark')
  darkRef.current = resolved === 'dark'
  const pointer = React.useRef({ x: -9999, y: -9999 })
  const [playing, setPlaying] = React.useState(true)
  const s = Math.min(8, Math.max(1, size))
  const sp = Math.min(48, Math.max(6, spacing))
  const fl = Math.min(1, Math.max(0, flicker))
  const mo = Math.min(1, Math.max(0.05, maxOpacity))
  const live = !reduced && playing && fl > 0

  React.useEffect(() => {
    const canvas = canvasRef.current, root = rootRef.current
    if (!canvas || !root) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf = 0, visible = true, last = 0, w = 0, h = 0, cols = 0, rows = 0
    let cur = new Float32Array(0), tgt = new Float32Array(0)
    const seed = () => {
      cols = Math.ceil(w / sp) + 1
      rows = Math.ceil(h / sp) + 1
      cur = new Float32Array(cols * rows)
      tgt = new Float32Array(cols * rows)
      for (let i = 0; i < cur.length; i++) {
        const v = fl > 0 ? Math.random() : 0.55
        cur[i] = v
        tgt[i] = v
      }
    }
    const resize = () => {
      const r = root.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1)
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = color ?? (darkRef.current ? '#c4b5fd' : '#6d5a8c')
      const px = pointer.current.x, py = pointer.current.y
      const off = (sp - s) / 2
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x
          let a = 0.12 + cur[i] * 0.88
          if (pointerGlow && px > -999) {
            const dx = x * sp - px, dy = y * sp - py
            const d = Math.sqrt(dx * dx + dy * dy)
            if (d < 120) a = Math.min(1, a + (1 - d / 120) * 0.9)
          }
          ctx.globalAlpha = a * mo
          const cx = x * sp + off, cy = y * sp + off
          if (shape === 'dot') {
            ctx.beginPath()
            ctx.arc(cx + s / 2, cy + s / 2, s / 2, 0, Math.PI * 2)
            ctx.fill()
          } else ctx.fillRect(cx, cy, s, s)
        }
      }
      ctx.globalAlpha = 1
    }
    const step = (dt: number) => {
      const chance = fl * dt * 1.6
      for (let i = 0; i < cur.length; i++) {
        if (Math.random() < chance) tgt[i] = Math.random() < 0.15 ? 1 : Math.random() * 0.6
        cur[i] += (tgt[i] - cur[i]) * Math.min(1, dt * 6)
      }
    }
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      step(dt)
      draw()
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (!raf && visible && !document.hidden && live) {
        last = performance.now()
        raf = requestAnimationFrame(loop)
      }
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }
    resize()
    draw()
    const ro = new ResizeObserver(() => {
      resize()
      draw()
    })
    ro.observe(root)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(root)
    const vis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', vis)
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect()
      pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top }
      if (!raf) draw()
    }
    const onLeave = () => {
      pointer.current = { x: -9999, y: -9999 }
      if (!raf) draw()
    }
    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    start()
    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', vis)
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
    }
  }, [live, s, sp, fl, mo, shape, color, pointerGlow, resolved])

  return (
    <div ref={rootRef} className={cn('relative isolate flex min-h-[360px] w-full items-center justify-center overflow-hidden rounded-[28px] bg-white ring-1 ring-black/[0.06] dark:bg-zinc-950 dark:ring-white/[0.08]', className)}>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 -z-10"
        style={vignette ? { maskImage: 'radial-gradient(75% 70% at 50% 50%, #000 30%, transparent 100%)', WebkitMaskImage: 'radial-gradient(75% 70% at 50% 50%, #000 30%, transparent 100%)' } : undefined}
      />
      {children && <div className="relative z-10 px-6 py-12 text-center">{children}</div>}
      {showControls && !reduced && fl > 0 && (
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pause flicker' : 'Play flicker'}
          className="absolute bottom-3 right-3 z-20 grid h-11 w-11 place-items-center rounded-full bg-white/70 text-zinc-800 ring-1 ring-black/[0.06] backdrop-blur-xl transition-[background-color,transform] duration-150 hover:bg-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-600 dark:bg-white/10 dark:text-zinc-100 dark:ring-white/10 dark:hover:bg-white/15 dark:focus-visible:ring-signal-300"
        >
          {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
        </button>
      )}
    </div>
  )
}
