import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

const VERBS = {
  idle: 'listening…',
  working: 'weaving thoughts…',
  mapping: 'mapping contours…',
  done: 'ready',
} as const

/** Tiny procedural noise pebble with status verb + optional progress ring. */
export function SignalPebble({
  status = 'working',
  progress,
  className,
}: {
  status?: keyof typeof VERBS
  progress?: number
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const visible = React.useRef(true)

  React.useEffect(() => {
    const onVis = () => {
      visible.current = document.visibilityState === 'visible'
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf = 0
    let t = 0
    const size = 36
    canvas.width = size * 2
    canvas.height = size * 2
    ctx.setTransform(2, 0, 0, 2, 0, 0)

    const draw = () => {
      if (visible.current && !reduced) t += status === 'idle' ? 0.01 : 0.03
      ctx.clearRect(0, 0, size, size)
      const g = ctx.createRadialGradient(18, 16, 2, 18, 18, 16)
      g.addColorStop(0, '#f5f1fa')
      g.addColorStop(0.5, '#d4cbe5')
      g.addColorStop(1, '#8f7aa8')
      ctx.fillStyle = g
      ctx.beginPath()
      for (let i = 0; i <= 64; i++) {
        const a = (i / 64) * Math.PI * 2
        const n = Math.sin(a * 3 + t) * 1.4 + Math.cos(a * 5 - t * 1.2) * 0.8
        const r = 12 + (reduced ? 0 : n)
        const x = 18 + Math.cos(a) * r
        const y = 18 + Math.sin(a) * r * 0.92
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.fill()
      if (!reduced) raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [reduced, status])

  const pct = progress != null ? Math.max(0, Math.min(100, progress)) : null

  return (
    <span className={cn('inline-flex items-center gap-3 rounded-full border border-zinc-200 bg-white/80 px-3 py-1.5 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80', className)}>
      <span className="relative h-9 w-9">
        <canvas ref={canvasRef} className="h-9 w-9" aria-hidden />
        {pct != null && (
          <svg className="absolute inset-0 h-9 w-9 -rotate-90" viewBox="0 0 36 36" aria-hidden>
            <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-200 dark:text-zinc-800" />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#d4cbe5"
              strokeWidth="1.5"
              strokeDasharray={`${(pct / 100) * 100.5} 100.5`}
            />
          </svg>
        )}
      </span>
      <span className="text-zinc-600 dark:text-zinc-300">{VERBS[status]}</span>
    </span>
  )
}
