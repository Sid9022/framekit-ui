import { cn } from '@/lib/cn'

export function Avatar({
  src,
  alt,
  fallback,
  className,
}: {
  src?: string
  alt?: string
  fallback: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800',
        className,
      )}
    >
      {src ? (
        <img src={src} alt={alt ?? ''} className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-zinc-600 dark:text-zinc-300">
          {fallback.slice(0, 2).toUpperCase()}
        </span>
      )}
    </span>
  )
}
