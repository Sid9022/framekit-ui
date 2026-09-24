import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** 3×3 nodes pulse in a traveling wave. */
export function LatticePulseLoader({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()

  return (
    <div
      className={cn('grid h-20 w-20 grid-cols-3 grid-rows-3 place-items-center gap-2', className)}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: 9 }).map((_, i) => {
        const row = Math.floor(i / 3)
        const col = i % 3
        const delay = (row + col) * 0.12
        return (
          <span
            key={i}
            className="h-3 w-3 rounded-full bg-signal-400 shadow-[0_0_10px_rgba(154,134,184,0.5)]"
            style={{
              animation: reduced ? undefined : `lattice-pulse 1.4s ease-in-out ${delay}s infinite`,
              opacity: reduced ? 0.5 + ((row + col) % 3) * 0.15 : undefined,
            }}
          />
        )
      })}
      <style>{`@keyframes lattice-pulse{0%,100%{transform:scale(0.55);opacity:0.35}50%{transform:scale(1.15);opacity:1}}`}</style>
    </div>
  )
}
