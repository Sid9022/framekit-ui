import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Soft optical flare that lags slightly behind the pointer. */
export function LensFlareCursor({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [pos, setPos] = React.useState({ x: 160, y: 100 })
  const lag = React.useRef({ x: 160, y: 100 })
  const [, bump] = React.useState(0)

  React.useEffect(() => {
    if (reduced) return
    let raf = 0
    const tick = () => {
      lag.current.x += (pos.x - lag.current.x) * 0.12
      lag.current.y += (pos.y - lag.current.y) * 0.12
      bump((n) => n + 1)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [pos, reduced])

  const fx = reduced ? pos.x : lag.current.x
  const fy = reduced ? pos.y : lag.current.y

  return (
    <div
      className={cn(
        'relative h-56 w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950 dark:border-zinc-800',
        className,
      )}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
      }}
    >
      <p className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
        Move — flare lags
      </p>
      <div
        className="pointer-events-none absolute h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: fx,
          top: fy,
          background:
            'radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(212,203,229,0.25) 28%, transparent 60%)',
          mixBlendMode: 'screen',
        }}
      />
      <div
        className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{ left: pos.x, top: pos.y, boxShadow: '0 0 12px white' }}
      />
    </div>
  )
}
