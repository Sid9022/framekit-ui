import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Liquid rises to fill the button on hover/press. */
export function LiquidFillButton({
  children = 'Liquid fill',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const reduced = usePrefersReducedMotion()
  const [hot, setHot] = React.useState(false)

  return (
    <button
      type="button"
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
      className={cn(
        'relative inline-flex overflow-hidden rounded-full border border-zinc-900 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400 dark:border-zinc-100 dark:bg-zinc-950 dark:text-zinc-50',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 bg-zinc-950 dark:bg-signal-300"
        style={{
          height: hot ? '100%' : '0%',
          transition: reduced ? undefined : 'height 420ms cubic-bezier(.2,.8,.2,1)',
          borderRadius: hot ? 0 : '50% 50% 0 0',
        }}
      />
      <span className={cn('relative z-10 transition-colors', hot && 'text-white dark:text-zinc-900')}>
        {children}
      </span>
    </button>
  )
}
