import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** SVG neon stroke draws around the button on hover. */
export function NeonStrokeButton({
  children = 'Neon draw',
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
        'relative inline-flex items-center justify-center rounded-2xl bg-zinc-950 px-6 py-2.5 text-sm font-semibold text-white focus-visible:outline-none dark:bg-zinc-100 dark:text-zinc-900',
        className,
      )}
      {...props}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        aria-hidden
      >
        <rect
          x="1.5"
          y="1.5"
          width="calc(100% - 3px)"
          height="calc(100% - 3px)"
          rx="14"
          fill="none"
          stroke="#d4cbe5"
          strokeWidth="2"
          strokeDasharray="240"
          strokeDashoffset={hot || reduced ? 0 : 240}
          style={{ transition: reduced ? undefined : 'stroke-dashoffset 520ms ease' }}
          pathLength={240}
        />
      </svg>
      <span className="relative z-10">{children}</span>
    </button>
  )
}
