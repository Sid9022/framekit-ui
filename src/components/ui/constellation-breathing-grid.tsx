import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Node = { x: number; y: number; phase: number }

/** Sparse breathing nodes that link when close; pointer proximity brightens edges. */
export function ConstellationBreathingGrid({
  className,
  children,
  count = 48,
}: {
  className?: string
  children?: React.ReactNode
  count?: number
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()
  const pointer = React.useRef({ x: -999, y: -999 })
  const nodes = React.useRef<Node[]>([])

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf = 0
    let t = 0

    const seed = () => {
      const { width, height } = canvas.getBoundingClientRect()
      nodes.current = Array.from({ length: count }, (_, i) => ({
        x: ((i * 97) % 1000) / 1000 * width,
        y: ((i * 53) % 1000) / 1000 * height,
        phase: (i * 0.37) % (Math.PI * 2),
      }))
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect()
      if (!reduced) t += 0.016
      ctx.fillStyle = '#0c0c0c'
      ctx.fillRect(0, 0, width, height)

      const pts = nodes.current.map((n) => {
        const breath = reduced ? 0 : Math.sin(t + n.phase) * 6
        return { x: n.x + breath, y: n.y + Math.cos(t * 0.7 + n.phase) * 4 }
      })

      const threshold = 110
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const d = Math.hypot(dx, dy)
          if (d > threshold) continue
          const midX = (pts[i].x + pts[j].x) / 2
          const midY = (pts[i].y + pts[j].y) / 2
          const near = Math.hypot(midX - pointer.current.x, midY - pointer.current.y)
          const glow = Math.max(0, 1 - near / 160)
          const a = (1 - d / threshold) * (0.15 + glow * 0.55)
          ctx.strokeStyle = `rgba(212,203,229,${a})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(pts[i].x, pts[i].y)
          ctx.lineTo(pts[j].x, pts[j].y)
          ctx.stroke()
        }
      }

      for (const p of pts) {
        const near = Math.hypot(p.x - pointer.current.x, p.y - pointer.current.y)
        const r = near < 80 ? 2.6 : 1.6
        ctx.fillStyle = near < 80 ? '#d4cbe5' : 'rgba(244,244,245,0.7)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!reduced) raf = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [count, reduced])

  return (
    <div
      className={cn('relative overflow-hidden rounded-2xl bg-zinc-950', className)}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top }
      }}
      onPointerLeave={() => {
        pointer.current = { x: -999, y: -999 }
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
