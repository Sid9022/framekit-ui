import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Soft pulsating status indicator with accessible label. */
export function BreathingDot({
  status = 'online',
  label,
  className,
}: {
  status?: 'online' | 'away' | 'busy' | 'offline'
  label?: string
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const colors = {
    online: 'bg-emerald-500',
    away: 'bg-amber-400',
    busy: 'bg-red-500',
    offline: 'bg-zinc-400',
  }
  const text = label ?? status
  return (
    <span className={cn('inline-flex items-center gap-2 text-sm', className)} title={text}>
      <span className="relative flex h-3 w-3">
        {status !== 'offline' && !reduced && (
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-60',
              colors[status],
            )}
          />
        )}
        <span className={cn('relative inline-flex h-3 w-3 rounded-full', colors[status])} />
      </span>
      <span className="capitalize text-zinc-600 dark:text-zinc-300">{text}</span>
    </span>
  )
}
