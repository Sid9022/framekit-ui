import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useResolvedTheme, type ThemeMode } from '@/lib/use-resolved-theme'

/** Soft lilac tidal bands that bend toward pointer velocity. Canvas 2D (not WebGL). */
export function PrismTidalField({
  className,
  children,
  theme = 'auto',
}: {
  className?: string
  children?: React.ReactNode
  /** `auto` follows the nearest `.dark` / `.light` ancestor. */
  theme?: ThemeMode
}) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const resolved = useResolvedTheme(rootRef, theme)
  const darkRef = React.useRef(resolved === 'dark')
  React.useLayoutEffect(() => {
    darkRef.current = resolved === 'dark'
  }, [resolved])
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()
  const pointer = React.useRef({ x: 0.5, y: 0.5, vx: 0, vy: 0 })

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let t = 0
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect()
      if (!reduced) t += 0.008
      const px = pointer.current.x * width
      const py = pointer.current.y * height
      const bend = Math.min(1, Math.hypot(pointer.current.vx, pointer.current.vy) * 8)

      const dark = darkRef.current
      const tone = dark ? '212, 203, 229' : '125, 104, 153'
      const g = ctx.createLinearGradient(0, 0, width, height)
      g.addColorStop(0, dark ? '#0b0b0f' : '#f8f7fb')
      g.addColorStop(1, dark ? '#16141c' : '#ebe7f2')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, width, height)

      for (let i = 0; i < 5; i++) {
        const phase = t * (0.4 + i * 0.12) + i
        ctx.beginPath()
        for (let x = 0; x <= width; x += 6) {
          const nx = x / width
          const influence = Math.exp(-((x - px) ** 2 + (height * 0.5 - py) ** 2) / (2 * (140 + bend * 180) ** 2))
          const y =
            height * (0.25 + i * 0.12) +
            Math.sin(nx * Math.PI * 2 + phase) * (28 + i * 6) +
            Math.sin(nx * Math.PI * 5 - phase * 1.3) * 10 +
            influence * bend * 50 * Math.sin(phase + i)
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.lineTo(width, height)
        ctx.lineTo(0, height)
        ctx.closePath()
        const alpha = 0.08 + i * 0.04
        ctx.fillStyle = `rgba(${tone}, ${Math.min(dark ? 0.55 : 0.4, alpha * (dark ? 1.35 : 0.9))})`
        ctx.fill()
      }

      // soft bloom near pointer
      const bloom = ctx.createRadialGradient(px, py, 0, px, py, 180)
      bloom.addColorStop(0, dark ? 'rgba(212,203,229,0.35)' : 'rgba(255,255,255,0.7)')
      bloom.addColorStop(1, dark ? 'rgba(212,203,229,0)' : 'rgba(255,255,255,0)')
      ctx.fillStyle = bloom
      ctx.fillRect(0, 0, width, height)

      pointer.current.vx *= 0.92
      pointer.current.vy *= 0.92
      if (!reduced) raf = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [reduced])

  return (
    <div
      ref={rootRef}
      data-theme={resolved}
      className={cn('relative overflow-hidden rounded-2xl', resolved === 'dark' ? 'bg-zinc-950' : 'bg-[#f3f1f7]', className)}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width
        const y = (e.clientY - r.top) / r.height
        pointer.current.vx += x - pointer.current.x
        pointer.current.vy += y - pointer.current.y
        pointer.current.x = x
        pointer.current.y = y
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
