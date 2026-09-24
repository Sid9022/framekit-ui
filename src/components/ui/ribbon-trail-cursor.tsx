import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Pt = { x: number; y: number }

/** Soft lilac ribbon trail with springy spacing behind the pointer. */
export function RibbonTrailCursor({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [points, setPoints] = React.useState<Pt[]>([])

  return (
    <div
      className={cn(
        'relative h-56 w-full max-w-lg cursor-none overflow-hidden rounded-2xl border border-zinc-200 bg-[#f6f5f2] dark:border-zinc-800 dark:bg-zinc-950',
        className,
      )}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        const next = { x: e.clientX - r.left, y: e.clientY - r.top }
        setPoints((prev) => {
          const pts = reduced ? [next] : [...prev, next].slice(-18)
          return pts
        })
      }}
      onPointerLeave={() => !reduced && setPoints([])}
    >
      <p className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400">
        Move — ribbon follows
      </p>
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        {points.length > 1 && (
          <path
            d={points
              .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
              .join(' ')}
            fill="none"
            stroke="#d4cbe5"
            strokeWidth={10}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.85}
          />
        )}
        {points.length > 1 && (
          <path
            d={points
              .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
              .join(' ')}
            fill="none"
            stroke="#faf8ff"
            strokeWidth={3}
            strokeLinecap="round"
            opacity={0.9}
          />
        )}
      </svg>
      {points[points.length - 1] && (
        <span
          className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-900 dark:bg-white"
          style={{ left: points[points.length - 1].x, top: points[points.length - 1].y }}
        />
      )}
    </div>
  )
}
