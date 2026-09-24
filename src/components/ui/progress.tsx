import { cn } from '@/lib/cn'

export function Progress({
  value,
  className,
}: {
  value: number
  className?: string
}) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800', className)}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-forge-500 to-amber-400 transition-[width] duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
