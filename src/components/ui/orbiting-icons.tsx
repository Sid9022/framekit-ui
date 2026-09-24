import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Icons orbit around a center hub on animated circular paths. */
export function OrbitingIcons({
  icons,
  className,
  radius = 88,
  duration = 18,
}: {
  icons: React.ReactNode[]
  className?: string
  radius?: number
  duration?: number
}) {
  const reduced = usePrefersReducedMotion()
  return (
    <div className={cn('relative mx-auto h-56 w-56', className)}>
      <div className="absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-gradient-to-br from-forge-500 to-orange-600 text-sm font-bold text-white shadow-lg">
        UI
      </div>
      {icons.map((icon, i) => {
        const angle = (360 / icons.length) * i
        return (
          <div
            key={i}
            className={cn('absolute left-1/2 top-1/2', !reduced && 'animate-[orbit_var(--od)_linear_infinite]')}
            style={{
              ['--od' as string]: `${duration}s`,
              ['--start' as string]: `${angle}deg`,
              width: radius * 2,
              height: radius * 2,
              marginLeft: -radius,
              marginTop: -radius,
              animationDelay: `${-(duration / icons.length) * i}s`,
              transform: reduced ? `rotate(${angle}deg)` : undefined,
            }}
          >
            <div
              className="absolute left-1/2 top-0 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-md dark:border-zinc-700 dark:bg-zinc-900"
              style={{ transform: reduced ? `rotate(-${angle}deg)` : undefined }}
            >
              {icon}
            </div>
          </div>
        )
      })}
      <style>{`
        @keyframes orbit {
          from { transform: rotate(var(--start, 0deg)); }
          to { transform: rotate(calc(var(--start, 0deg) + 360deg)); }
        }
      `}</style>
    </div>
  )
}
