import { cn } from '@/lib/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'framekit' | 'success' | 'warning'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variant === 'default' && 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900',
        variant === 'secondary' && 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200',
        variant === 'outline' && 'border border-zinc-200 text-zinc-700 dark:border-zinc-700 dark:text-zinc-200',
        variant === 'framekit' && 'bg-framekit-100 text-framekit-800 dark:bg-framekit-950 dark:text-framekit-200',
        variant === 'success' && 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
        variant === 'warning' && 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
        className,
      )}
      {...props}
    />
  )
}
