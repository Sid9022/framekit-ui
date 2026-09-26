import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Thin ring orbits the pointer continuously. */
export function OrbitRingCursor({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [pos, setPos] = React.useState({ x: 180, y: 110 })
  const [angle, setAngle] = React.useState(0)

  React.useEffect(() => {
    if (reduced) return
    let raf = 0
    const tick = () => {
      setAngle((a) => a + 0.06)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  const ox = Math.cos(angle) * 22
  const oy = Math.sin(angle) * 16

  return (
    <div
      className={cn(
        'relative h-56 w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950',
        className,
      )}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
      }}
    >
      <p className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
        Move — ring orbits
      </p>
      <span
        className="pointer-events-none absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-900 dark:bg-white"
        style={{ left: pos.x, top: pos.y }}
      />
      <span
        className="pointer-events-none absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-signal-400/80"
        style={{ left: pos.x + ox, top: pos.y + oy }}
      />
      <span
        className="pointer-events-none absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal-500"
        style={{ left: pos.x + ox, top: pos.y + oy }}
      />
    </div>
  )
}
