import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { Home, Search, Bell, User, Settings } from 'lucide-react'

const ICONS = [Home, Search, Bell, User, Settings]

/** Compact dock with magnetic magnification — nav-flavored sibling to Magnify Dock. */
export function MagneticDockNav({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = React.useState(0)
  const [hover, setHover] = React.useState<number | null>(null)

  return (
    <nav
      className={cn(
        'inline-flex items-end gap-1 rounded-[1.6rem] border border-zinc-200/80 bg-white/80 px-2 py-2 shadow-xl backdrop-blur dark:border-zinc-700 dark:bg-zinc-950/80',
        className,
      )}
      aria-label="Magnetic dock"
      onMouseLeave={() => setHover(null)}
    >
      {ICONS.map((Icon, i) => {
        const dist = hover === null ? 99 : Math.abs(hover - i)
        const scale = reduced ? 1 : hover === null ? 1 : Math.max(1, 1.55 - dist * 0.28)
        return (
          <button
            key={i}
            type="button"
            aria-current={active === i ? 'page' : undefined}
            aria-label={`Item ${i + 1}`}
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            onClick={() => setActive(i)}
            className={cn(
              'flex items-center justify-center rounded-2xl transition-colors',
              active === i ? 'bg-signal-100 text-zinc-900 dark:bg-signal-900/50 dark:text-signal-100' : 'text-zinc-600 dark:text-zinc-300',
            )}
            style={{
              width: 40 * scale,
              height: 40 * scale,
              transition: reduced ? undefined : 'width 160ms ease, height 160ms ease',
            }}
          >
            <Icon className="h-4 w-4" style={{ transform: `scale(${0.9 + (scale - 1) * 0.5})` }} />
          </button>
        )
      })}
    </nav>
  )
}
