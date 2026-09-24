import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Beads orbit a core; hover speeds up. */
export function OrbitalBeadLoader({
  className,
  beads = 6,
}: {
  className?: string
  beads?: number
}) {
  const reduced = usePrefersReducedMotion()
  const [hover, setHover] = React.useState(false)
  const speed = reduced ? 0 : hover ? 1.1 : 2.6

  return (
    <div
      className={cn('relative flex h-28 w-28 items-center justify-center', className)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      role="status"
      aria-label="Loading"
    >
      <div className="absolute h-5 w-5 rounded-full bg-gradient-to-br from-framekit-400 to-signal-400 shadow-[0_0_20px_rgba(249,115,22,0.45)]" />
      {Array.from({ length: beads }).map((_, i) => {
        const angle = (360 / beads) * i
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              animation: speed ? `orbital-spin ${speed}s linear infinite` : undefined,
              animationDelay: `${(-speed * i) / beads}s`,
              transform: `rotate(${angle}deg)`,
            }}
          >
            <span
              className="absolute left-1/2 top-1 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-signal-300 shadow-[0_0_8px_rgba(154,134,184,0.7)]"
              style={{ opacity: 0.55 + (i % 3) * 0.15 }}
            />
          </div>
        )
      })}
      <style>{`@keyframes orbital-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
