import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Dab = { id: number; x: number; y: number; r: number; life: number }

/** Pointer leaves fading ink stamps. */
export function InkStampCursor({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [dabs, setDabs] = React.useState<Dab[]>([])
  const id = React.useRef(0)
  const last = React.useRef(0)

  React.useEffect(() => {
    if (reduced) return
    const t = window.setInterval(() => {
      setDabs((d) =>
        d
          .map((x) => ({ ...x, life: x.life - 0.04, r: x.r * 1.02 }))
          .filter((x) => x.life > 0),
      )
    }, 40)
    return () => clearInterval(t)
  }, [reduced])

  return (
    <div
      className={cn(
        'relative h-56 w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-[#f7f5f0] dark:border-zinc-800 dark:bg-zinc-950',
        className,
      )}
      onPointerMove={(e) => {
        const now = performance.now()
        if (!reduced && now - last.current < 32) return
        last.current = now
        const r = e.currentTarget.getBoundingClientRect()
        setDabs((d) => [
          ...d.slice(-24),
          {
            id: id.current++,
            x: e.clientX - r.left,
            y: e.clientY - r.top,
            r: 6 + Math.random() * 10,
            life: 1,
          },
        ])
      }}
    >
      <p className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
        Move — ink stamps
      </p>
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        {dabs.map((d) => (
          <ellipse
            key={d.id}
            cx={d.x}
            cy={d.y}
            rx={d.r}
            ry={d.r * 0.78}
            fill={`rgba(24,24,27,${d.life * 0.45})`}
            transform={`rotate(${(d.id * 17) % 40} ${d.x} ${d.y})`}
          />
        ))}
      </svg>
    </div>
  )
}
