import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Caption briefly follows pointer velocity, then settles to baseline. */
export function MomentumCaption({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLParagraphElement>(null)
  const [offset, setOffset] = React.useState({ x: 0, y: 0 })
  const vel = React.useRef({ x: 0, y: 0 })
  const last = React.useRef({ x: 0, y: 0, t: 0 })

  React.useEffect(() => {
    if (reduced) return
    let raf = 0
    const loop = () => {
      vel.current.x *= 0.86
      vel.current.y *= 0.86
      setOffset({
        x: Math.max(-14, Math.min(14, vel.current.x * 10)),
        y: Math.max(-10, Math.min(10, vel.current.y * 8)),
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  return (
    <p
      ref={ref}
      className={cn('text-sm text-zinc-500 transition-transform duration-100 will-change-transform', className)}
      onPointerMove={(e) => {
        if (reduced) return
        const now = performance.now()
        const dt = Math.max(16, now - (last.current.t || now))
        vel.current.x = (e.clientX - last.current.x) / dt
        vel.current.y = (e.clientY - last.current.y) / dt
        last.current = { x: e.clientX, y: e.clientY, t: now }
      }}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
    >
      {children}
    </p>
  )
}
