import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useResolvedTheme, type ThemeMode } from '@/lib/use-resolved-theme'

type Ring = { x: number; y: number; r: number; life: number }

/** Concentric soft rings expand from pointer/click. Canvas 2D. */
export function PulseRings({
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
  const ref = React.useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()
  const rings = React.useRef<Ring[]>([])

  React.useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf = 0
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
      const dark = darkRef.current
      ctx.fillStyle = dark ? '#111113' : '#f7f6f9'
      ctx.fillRect(0, 0, width, height)
      for (let i = rings.current.length - 1; i >= 0; i--) {
        const ring = rings.current[i]
        if (!reduced) {
          ring.r += 2.2
          ring.life -= 0.012
        }
        if (ring.life <= 0) {
          rings.current.splice(i, 1)
          continue
        }
        ctx.beginPath()
        ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2)
        ctx.strokeStyle = dark ? `rgba(212,203,229,${ring.life * 0.7})` : `rgba(100,82,122,${ring.life * 0.55})`
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(ring.x, ring.y, ring.r * 0.65, 0, Math.PI * 2)
        ctx.strokeStyle = dark ? `rgba(255,255,255,${ring.life * 0.25})` : `rgba(154,134,184,${ring.life * 0.3})`
        ctx.lineWidth = 1
        ctx.stroke()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [reduced])

  const add = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    rings.current.push({
      x: e.clientX - r.left,
      y: e.clientY - r.top,
      r: 4,
      life: 1,
    })
  }

  return (
    <div
      ref={rootRef}
      data-theme={resolved}
      className={cn('relative overflow-hidden rounded-2xl', resolved === 'dark' ? 'bg-[#111113]' : 'bg-[#f7f6f9]', className)}
      onPointerDown={add}
      onPointerMove={(e) => {
        if (e.buttons === 1) add(e)
      }}
    >
      <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
