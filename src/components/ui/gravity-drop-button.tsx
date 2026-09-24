import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { ArrowDown } from 'lucide-react'

/** Icon falls in with a bounce on hover. */
export function GravityDropButton({
  children = 'Drop in',
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
        'inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400 dark:bg-zinc-100 dark:text-zinc-900',
        className,
      )}
      {...props}
    >
      <ArrowDown
        className="h-4 w-4"
        style={{
          transform: hot ? 'translateY(0)' : 'translateY(-12px)',
          opacity: hot ? 1 : 0.35,
          transition: reduced
            ? undefined
            : 'transform 500ms cubic-bezier(.34,1.56,.64,1), opacity 200ms',
        }}
      />
      {children}
    </button>
  )
}
