import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Seamless horizontal marquee that pauses on hover. */
export function InfiniteMarquee({
  children,
  className,
  speed = 28,
  reverse = false,
}: {
  children: React.ReactNode
  className?: string
  speed?: number
  reverse?: boolean
}) {
  const reduced = usePrefersReducedMotion()
  return (
    <div className={cn('group relative overflow-hidden', className)}>
      <div
        className={cn(
          'flex w-max gap-8',
          !reduced && (reverse ? 'animate-[marquee-reverse_var(--dur)_linear_infinite]' : 'animate-[marquee_var(--dur)_linear_infinite]'),
          'group-hover:[animation-play-state:paused]',
        )}
        style={{ ['--dur' as string]: `${speed}s` }}
      >
        <div className="flex shrink-0 gap-8">{children}</div>
        <div className="flex shrink-0 gap-8" aria-hidden>
          {children}
        </div>
      </div>
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes marquee-reverse { from { transform: translateX(-50%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  )
}
