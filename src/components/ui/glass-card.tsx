import { cn } from '@/lib/cn'

/** Frosted liquid-glass surface with subtle refraction edge. */
export function GlassCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-white/30 bg-white/20 p-6 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-white/5',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
