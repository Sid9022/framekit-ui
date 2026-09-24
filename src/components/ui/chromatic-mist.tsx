import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Dual-tone mist; pointer motion adds chromatic split. Canvas 2D. */
export function ChromaticMist({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  const ref = React.useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()
  const ptr = React.useRef({ x: 0.5, y: 0.5, vx: 0, vy: 0 })

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

    const blob = (x: number, y: number, r: number, color: string) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, color)
      g.addColorStop(1, 'transparent')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect()
      if (!reduced) t += 0.01
      ctx.fillStyle = '#f4f2ef'
      ctx.fillRect(0, 0, width, height)
      const speed = Math.min(1, Math.hypot(ptr.current.vx, ptr.current.vy) * 8)
      const split = reduced ? 0 : 6 + speed * 14
      const ax = width * (0.35 + Math.sin(t) * 0.08 + (ptr.current.x - 0.5) * 0.1)
      const ay = height * (0.4 + Math.cos(t * 0.8) * 0.1)
      const bx = width * (0.65 + Math.cos(t * 0.7) * 0.08)
      const by = height * (0.55 + Math.sin(t * 0.9) * 0.1)
      ctx.globalCompositeOperation = 'multiply'
      blob(ax - split, ay, width * 0.35, 'rgba(180,160,210,0.55)')
      blob(ax + split, ay, width * 0.35, 'rgba(140,190,210,0.5)')
      blob(bx + split * 0.5, by, width * 0.3, 'rgba(210,170,190,0.45)')
      blob(bx - split * 0.5, by, width * 0.28, 'rgba(160,180,220,0.4)')
      ctx.globalCompositeOperation = 'source-over'
      ptr.current.vx *= 0.9
      ptr.current.vy *= 0.9
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
      className={cn('relative overflow-hidden rounded-2xl bg-[#f4f2ef]', className)}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width
        const y = (e.clientY - r.top) / r.height
        ptr.current.vx = x - ptr.current.x
        ptr.current.vy = y - ptr.current.y
        ptr.current.x = x
        ptr.current.y = y
      }}
    >
      <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
