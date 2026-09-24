import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Diagonal prismatic light band; intensity follows pointer X. */
export function PrismSweepShimmer({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const [x, setX] = React.useState(0.5)

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setX((e.clientX - r.left) / r.width)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setX(0.5)}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950 p-8 dark:border-zinc-800',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(${110 + x * 40}deg,
            transparent 0%,
            transparent ${Math.max(5, x * 100 - 28)}%,
            rgba(249,115,22,${0.15 + x * 0.35}) ${x * 100 - 8}%,
            rgba(212,203,229,${0.45 + x * 0.4}) ${x * 100}%,
            rgba(155,134,184,${0.2 + x * 0.3}) ${x * 100 + 10}%,
            transparent ${Math.min(95, x * 100 + 32)}%,
            transparent 100%)`,
          transition: reduced ? 'none' : 'background 80ms linear',
          mixBlendMode: 'screen',
        }}
      />
      {!reduced && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-y-8 w-24 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          style={{
            left: `${x * 100}%`,
            transform: `translateX(-50%) skewX(-12deg)`,
            transition: 'left 90ms linear',
            filter: 'blur(6px)',
          }}
        />
      )}
      <div className="relative z-10 text-center text-white">{children ?? (
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-signal-300">Prism Sweep</p>
          <p className="mt-2 text-lg font-semibold">Move to bend the band</p>
        </div>
      )}</div>
    </div>
  )
}
