import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Dot = { id: number; x: number; y: number }

/** Soft glowing trail that follows the pointer inside a stage. */
export function CursorTrail({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  const [dots, setDots] = React.useState<Dot[]>([])
  const id = React.useRef(0)
  const reduced = usePrefersReducedMotion()

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    const next = { id: id.current++, x: e.clientX - r.left, y: e.clientY - r.top }
    setDots((d) => [...d.slice(-18), next])
  }

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={() => setDots([])}
      className={cn('relative h-56 overflow-hidden rounded-2xl bg-zinc-950', className)}
    >
      {dots.map((d, i) => (
        <span
          key={d.id}
          className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-framekit-400 blur-[1px]"
          style={{
            left: d.x,
            top: d.y,
            opacity: (i + 1) / dots.length,
            transform: `translate(-50%, -50%) scale(${0.4 + (i / dots.length) * 0.8})`,
          }}
        />
      ))}
      <div className="relative z-10 flex h-full items-center justify-center text-sm text-zinc-400">
        {children ?? 'Move your cursor'}
      </div>
    </div>
  )
}
