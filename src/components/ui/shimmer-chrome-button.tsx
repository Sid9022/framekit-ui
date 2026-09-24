import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Quiet white chrome pill with a traveling shimmer highlight. */
export function ShimmerChromeButton({
  className,
  children = 'Shimmer',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const reduced = usePrefersReducedMotion()

  return (
    <button
      type="button"
      className={cn(
        'relative inline-flex overflow-hidden rounded-full border border-zinc-200 bg-white px-6 py-2.5 text-sm font-medium text-zinc-900 shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition hover:shadow-[0_10px_28px_rgba(0,0,0,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50',
        className,
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {!reduced && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/20"
          style={{ animation: 'forge-shimmer 2.4s ease-in-out infinite' }}
        />
      )}
      <style>{`@keyframes forge-shimmer{0%{transform:translateX(-120%)}100%{transform:translateX(120%)}}`}</style>
    </button>
  )
}
