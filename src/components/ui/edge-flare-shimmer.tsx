import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Soft flare travels the border edge (distinct from BorderBeam). */
export function EdgeFlareShimmer({
  className,
  children,
  duration = 3.2,
}: {
  className?: string
  children?: React.ReactNode
  duration?: number
}) {
  const reduced = usePrefersReducedMotion()

  return (
    <div className={cn('relative rounded-2xl p-[1.5px]', className)}>
      <div
        aria-hidden
        className="absolute inset-0 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#e4e4e7,#d4d4d8)] dark:bg-[linear-gradient(135deg,#27272a,#18181b)]"
      >
        {!reduced && (
          <div
            className="absolute h-24 w-24 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(249,115,22,0.95) 0%, rgba(212,203,229,0.55) 35%, transparent 70%)',
              filter: 'blur(10px)',
              offsetPath: 'inset(0 round 16px)',
              offsetDistance: '0%',
              animation: `edge-flare-travel ${duration}s linear infinite`,
            }}
          />
        )}
      </div>
      <div className="relative z-10 rounded-[14.5px] bg-white p-6 dark:bg-zinc-950">
        {children ?? (
          <>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">Edge Flare</p>
            <p className="mt-1 text-base font-semibold">Soft border traveler</p>
            <p className="mt-1 text-sm text-zinc-500">A localized flare, not a full beam sweep.</p>
          </>
        )}
      </div>
      <style>{`@keyframes edge-flare-travel{0%{offset-distance:0%}100%{offset-distance:100%}}`}</style>
    </div>
  )
}
