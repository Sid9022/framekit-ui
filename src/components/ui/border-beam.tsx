import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Animated light beam that travels around a rounded border. */
export function BorderBeam({
  children,
  className,
  duration = 6,
}: {
  children: React.ReactNode
  className?: string
  duration?: number
}) {
  const reduced = usePrefersReducedMotion()
  return (
    <div className={cn('relative overflow-hidden rounded-2xl p-[1px]', className)}>
      <div
        className={cn('absolute inset-0 rounded-2xl', !reduced && 'animate-[spin_var(--bd)_linear_infinite]')}
        style={{
          ['--bd' as string]: `${duration}s`,
          background:
            'conic-gradient(from 0deg, transparent 0%, transparent 60%, #f97316 75%, #fdba74 85%, transparent 100%)',
        }}
      />
      <div className="relative z-10 rounded-[15px] bg-white dark:bg-zinc-950">{children}</div>
    </div>
  )
}
