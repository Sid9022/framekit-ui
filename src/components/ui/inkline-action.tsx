import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Neutral text button with a seeded SVG ink underline that draws toward hover direction. */
export function InklineAction({
  children,
  className,
  seed = 7,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { seed?: number }) {
  const reduced = usePrefersReducedMotion()
  const [dir, setDir] = React.useState<'l' | 'r'>('r')
  const [hover, setHover] = React.useState(false)
  const path = React.useMemo(() => {
    // deterministic wiggle from seed
    const pts: string[] = []
    for (let i = 0; i <= 8; i++) {
      const x = (i / 8) * 100
      const y = 4 + Math.sin(i * 1.7 + seed) * 2.2 + ((seed * (i + 3)) % 5) * 0.15
      pts.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`)
    }
    return pts.join(' ')
  }, [seed])

  return (
    <button
      type="button"
      className={cn(
        'relative inline-flex items-center px-1 pb-2 text-sm font-medium text-zinc-900 outline-none focus-visible:ring-2 focus-visible:ring-signal-400 dark:text-zinc-50',
        className,
      )}
      onPointerEnter={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        setDir(e.clientX < r.left + r.width / 2 ? 'l' : 'r')
        setHover(true)
      }}
      onPointerLeave={() => setHover(false)}
      {...props}
    >
      {children}
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3 w-full overflow-visible"
        viewBox="0 0 100 8"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: reduced ? 0 : hover ? 0 : 1,
            transform: dir === 'l' ? 'scaleX(-1)' : undefined,
            transformOrigin: 'center',
            transition: reduced ? undefined : 'stroke-dashoffset 420ms cubic-bezier(.2,.8,.2,1)',
          }}
        />
      </svg>
    </button>
  )
}
