import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Face splits open to reveal the action label. */
export function SplitRevealButton({
  label = 'Reveal',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label?: string }) {
  const reduced = usePrefersReducedMotion()
  const [open, setOpen] = React.useState(false)

  return (
    <button
      type="button"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      className={cn(
        'relative inline-flex h-11 w-40 items-center justify-center overflow-hidden rounded-2xl bg-zinc-950 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400 dark:bg-zinc-100 dark:text-zinc-900',
        className,
      )}
      {...props}
    >
      <span className="relative z-0">{label}</span>
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1/2 bg-signal-300"
        style={{
          transform: open ? 'translateX(-105%)' : 'translateX(0)',
          transition: reduced ? undefined : 'transform 380ms cubic-bezier(.2,.8,.2,1)',
        }}
      />
      <span
        aria-hidden
        className="absolute inset-y-0 right-0 w-1/2 bg-signal-400"
        style={{
          transform: open ? 'translateX(105%)' : 'translateX(0)',
          transition: reduced ? undefined : 'transform 380ms cubic-bezier(.2,.8,.2,1)',
        }}
      />
    </button>
  )
}
