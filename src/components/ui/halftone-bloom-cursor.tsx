import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Pointer blooms a soft lilac halftone matrix that fades behind. */
export function HalftoneBloomCursor({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [pos, setPos] = React.useState({ x: 140, y: 90 })
  const [trail, setTrail] = React.useState<{ x: number; y: number; id: number }[]>([])
  const id = React.useRef(0)

  return (
    <div
      className={cn(
        'relative h-56 w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950',
        className,
      )}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - r.left
        const y = e.clientY - r.top
        setPos({ x, y })
        if (reduced) return
        const next = { x, y, id: id.current++ }
        setTrail((t) => [...t.slice(-8), next])
      }}
    >
      <p className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
        Move to bloom
      </p>
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        {trail.map((t, i) => {
          const dots = []
          for (let row = -3; row <= 3; row++) {
            for (let col = -3; col <= 3; col++) {
              const d = Math.hypot(col, row)
              if (d > 3.2) continue
              dots.push(
                <circle
                  key={`${t.id}-${row}-${col}`}
                  cx={t.x + col * 7}
                  cy={t.y + row * 7}
                  r={Math.max(0.6, 3.2 - d)}
                  fill="#d4cbe5"
                  opacity={(0.15 + i / trail.length) * (1 - d / 4)}
                />,
              )
            }
          }
          return <g key={t.id}>{dots}</g>
        })}
        {/* live bloom */}
        {Array.from({ length: 7 }).map((_, row) =>
          Array.from({ length: 7 }).map((__, col) => {
            const dx = col - 3
            const dy = row - 3
            const d = Math.hypot(dx, dy)
            if (d > 3.2) return null
            return (
              <circle
                key={`live-${row}-${col}`}
                cx={pos.x + dx * 7}
                cy={pos.y + dy * 7}
                r={Math.max(0.8, 3.4 - d)}
                fill="#b9aad0"
                opacity={1 - d / 4}
              />
            )
          }),
        )}
      </svg>
    </div>
  )
}
