import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Soft drifting aurora / mesh gradient backdrop. */
export function AuroraBackground({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  return (
    <div className={cn('relative overflow-hidden rounded-2xl', className)}>
      <div
        className={cn(
          'absolute inset-0 bg-zinc-950',
          !reduced && 'animate-[forge-shimmer_8s_linear_infinite]',
        )}
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 60% at 20% 30%, rgba(249,115,22,0.45), transparent), radial-gradient(ellipse 70% 50% at 80% 20%, rgba(168,85,247,0.35), transparent), radial-gradient(ellipse 60% 50% at 50% 80%, rgba(59,130,246,0.3), transparent)',
          backgroundSize: reduced ? undefined : '200% 200%',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
