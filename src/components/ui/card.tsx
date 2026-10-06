import { cn } from '@/lib/cn'

type CardVariant = 'default' | 'raised' | 'glass' | 'outline'

const VARIANTS: Record<CardVariant, string> = {
  default:
    'bg-white ring-1 ring-zinc-950/[0.07] shadow-[0_1px_2px_rgba(15,15,20,0.04),0_4px_16px_-8px_rgba(15,15,20,0.10)] dark:bg-zinc-900/70 dark:ring-white/[0.08] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_1px_2px_rgba(0,0,0,0.5)]',
  raised:
    'bg-white ring-1 ring-zinc-950/[0.06] shadow-[0_1px_2px_rgba(15,15,20,0.05),0_12px_32px_-12px_rgba(15,15,20,0.22)] dark:bg-zinc-900 dark:ring-white/10 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_16px_40px_-16px_rgba(0,0,0,0.8)]',
  glass:
    'bg-white/60 ring-1 ring-zinc-950/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_8px_32px_-12px_rgba(15,15,20,0.18)] backdrop-blur-xl backdrop-saturate-150 dark:bg-zinc-900/55 dark:ring-white/10 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_32px_-12px_rgba(0,0,0,0.7)]',
  outline: 'bg-transparent ring-1 ring-zinc-950/10 dark:ring-white/12',
}

export function Card({
  className,
  variant = 'default',
  interactive = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  /** Surface treatment. All variants use hairline rings and layered shadows. */
  variant?: CardVariant
  /** Adds a subtle lift on hover / focus-within for clickable cards. */
  interactive?: boolean
}) {
  return (
    <div
      className={cn(
        'relative rounded-2xl text-zinc-950 dark:text-zinc-50',
        VARIANTS[variant],
        interactive &&
          'transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(15,15,20,0.05),0_16px_40px_-16px_rgba(15,15,20,0.28)] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-signal-600 motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:has-[:focus-visible]:ring-signal-300',
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1.5 p-6', className)} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-[17px] leading-6 font-semibold tracking-[-0.012em] text-balance', className)} {...props} />
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm leading-relaxed text-pretty text-zinc-600 dark:text-zinc-400', className)} {...props} />
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
}
