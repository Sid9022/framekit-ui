import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Faint perspective lattice drifting in a void. Canvas 2D. */
export function VoidLatticeDrift({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  const ref = React.useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()
  const ptr = React.useRef({ x: 0.5, y: 0.5 })

  React.useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf = 0
    let z = 0
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect()
      if (!reduced) z += 0.35
      ctx.fillStyle = '#09090b'
      ctx.fillRect(0, 0, width, height)
      const cx = width * (0.5 + (ptr.current.x - 0.5) * 0.08)
      const cy = height * (0.55 + (ptr.current.y - 0.5) * 0.06)
      ctx.strokeStyle = 'rgba(212,203,229,0.22)'
      ctx.lineWidth = 1
      for (let depth = 0; depth < 18; depth++) {
        const d = ((depth * 40 + z) % 720) / 720
        const scale = 0.15 + d * 1.6
        const alpha = Math.min(0.35, d * 0.4)
        const w = width * 0.55 * scale
        const h = height * 0.4 * scale
        ctx.globalAlpha = alpha
        ctx.strokeRect(cx - w / 2, cy - h / 2, w, h)
        // cross lines
        ctx.beginPath()
        ctx.moveTo(cx - w / 2, cy)
        ctx.lineTo(cx + w / 2, cy)
        ctx.moveTo(cx, cy - h / 2)
        ctx.lineTo(cx, cy + h / 2)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
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
      className={cn('relative overflow-hidden rounded-2xl bg-black', className)}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        ptr.current = {
          x: (e.clientX - r.left) / r.width,
          y: (e.clientY - r.top) / r.height,
        }
      }}
    >
      <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
