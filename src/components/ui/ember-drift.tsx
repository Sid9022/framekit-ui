import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useResolvedTheme, type ThemeMode } from '@/lib/use-resolved-theme'

type Ember = { x: number; y: number; r: number; vy: number; vx: number; life: number; hue: number }

/** Warm rising embers with soft bloom. Canvas 2D. */
export function EmberDrift({
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

  React.useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf = 0
    const embers: Ember[] = []
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

    const spawn = (w: number, h: number) => {
      embers.push({
        x: Math.random() * w,
        y: h + 10,
        r: 1 + Math.random() * 2.5,
        vy: -0.4 - Math.random() * 1.2,
        vx: (Math.random() - 0.5) * 0.6,
        life: 1,
        hue: 20 + Math.random() * 30,
      })
    }

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect()
      ctx.fillStyle = darkRef.current ? 'rgba(12,8,6,0.28)' : 'rgba(253,246,238,0.3)'
      ctx.fillRect(0, 0, width, height)
      if (!reduced && embers.length < 60) spawn(width, height)
      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i]
        if (!reduced) {
          e.x += e.vx
          e.y += e.vy
          e.life -= 0.004
        }
        if (e.life <= 0 || e.y < -20) {
          embers.splice(i, 1)
          continue
        }
        const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 6)
        g.addColorStop(0, darkRef.current ? `hsla(${e.hue},90%,70%,${e.life})` : `hsla(${e.hue},95%,55%,${e.life * 0.85})`)
        g.addColorStop(0.4, darkRef.current ? `hsla(${e.hue},80%,50%,${e.life * 0.45})` : `hsla(${e.hue},90%,60%,${e.life * 0.3})`)
        g.addColorStop(1, `hsla(${e.hue},90%,60%,0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.r * 6, 0, Math.PI * 2)
        ctx.fill()
      }
      if (!reduced) raf = requestAnimationFrame(draw)
      else {
        // static embers
        for (let i = 0; i < 20; i++) {
          const x = (i * 47) % width
          const y = height * 0.3 + ((i * 73) % (height * 0.5))
          ctx.fillStyle = `hsla(${25 + i},90%,65%,0.5)`
          ctx.beginPath()
          ctx.arc(x, y, 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }
    ctx.fillStyle = darkRef.current ? '#0c0806' : '#fdf6ee'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
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
      className={cn('relative overflow-hidden rounded-2xl', resolved === 'dark' ? 'bg-[#0c0806]' : 'bg-[#fdf6ee]', className)}
    >
      <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
