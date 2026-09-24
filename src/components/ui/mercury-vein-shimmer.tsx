import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Liquid-metal highlight veins crawl a rounded surface. */
export function MercuryVeinShimmer({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  const reduced = usePrefersReducedMotion()
  const [t, setT] = React.useState(0)

  React.useEffect(() => {
    if (reduced) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      setT(((now - start) / 1000) % 8)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  const veins = [
    { d: 'M10 60 C40 20, 80 100, 120 40 S200 20, 230 70', delay: 0 },
    { d: 'M20 100 C60 80, 100 140, 150 90 S220 110, 240 50', delay: 1.2 },
    { d: 'M5 30 C50 50, 90 10, 140 55 S190 90, 245 35', delay: 2.4 },
  ]

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-zinc-300 bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-300 p-8 shadow-inner dark:border-zinc-700 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800',
        className,
      )}
    >
      <svg
        aria-hidden
        viewBox="0 0 250 140"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="mercury-glow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="45%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="55%" stopColor="rgba(212,203,229,0.9)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        {veins.map((v, i) => {
          const progress = reduced ? 0.5 : ((t + v.delay) % 4) / 4
          return (
            <path
              key={i}
              d={v.d}
              fill="none"
              stroke="url(#mercury-glow)"
              strokeWidth={2.2}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={`0.18 0.82`}
              strokeDashoffset={1 - progress}
              opacity={0.55 + Math.sin(progress * Math.PI) * 0.35}
              style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.6))' }}
            />
          )
        })}
      </svg>
      <div className="relative z-10 text-center">
        {children ?? (
          <>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Mercury Vein</p>
            <p className="mt-2 text-lg font-semibold text-zinc-800 dark:text-zinc-100">Liquid metal crawl</p>
          </>
        )}
      </div>
    </div>
  )
}
