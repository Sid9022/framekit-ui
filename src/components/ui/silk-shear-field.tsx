import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Slow shearing silk ribbons that bend toward the pointer. Canvas 2D. */
export function SilkShearField({
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
    let t = 0
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
      if (!reduced) t += 0.008
      ctx.clearRect(0, 0, width, height)
      const g = ctx.createLinearGradient(0, 0, width, height)
      g.addColorStop(0, '#0f0e12')
      g.addColorStop(1, '#1a1622')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, width, height)

      const ribbons = 7
      for (let i = 0; i < ribbons; i++) {
        const baseY = height * (0.15 + i * 0.12)
        const shear = (ptr.current.x - 0.5) * 90
        const lift = (ptr.current.y - 0.5) * 40
        ctx.beginPath()
        for (let x = 0; x <= width; x += 6) {
          const n = x / width
          const y =
            baseY +
            Math.sin(n * Math.PI * 3 + t * (1.2 + i * 0.15) + i) * (18 + i * 2) +
            Math.sin(n * Math.PI * 7 - t) * 6 +
            shear * Math.sin(n * Math.PI) +
            lift * n
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.lineTo(width, height)
        ctx.lineTo(0, height)
        ctx.closePath()
        ctx.fillStyle = `rgba(212,203,229,${0.04 + i * 0.03})`
        ctx.fill()
        ctx.strokeStyle = `rgba(212,203,229,${0.12 + i * 0.04})`
        ctx.lineWidth = 1.2
        ctx.stroke()
      }
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
      className={cn('relative overflow-hidden rounded-2xl bg-zinc-950', className)}
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
