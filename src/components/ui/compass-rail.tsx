import * as React from 'react'
import { cn } from '@/lib/cn'

/** Vertical nav rail with a compass marker that takes the shortest path. */
export function CompassRail({
  items,
  className,
}: {
  items: { id: string; label: string }[]
  className?: string
}) {
  const [active, setActive] = React.useState(items[0]?.id)
  const idx = Math.max(0, items.findIndex((i) => i.id === active))

  return (
    <nav className={cn('relative w-44', className)} aria-label="Compass rail">
      <div className="absolute bottom-2 left-[15px] top-2 w-px bg-zinc-200 dark:bg-zinc-800" />
      <svg className="pointer-events-none absolute left-[7px] top-2 h-[calc(100%-16px)] w-4 overflow-visible" aria-hidden>
        <line
          x1="8"
          x2="8"
          y1="0"
          y2={`${(idx / Math.max(1, items.length - 1)) * 100}%`}
          stroke="#d4cbe5"
          strokeWidth="2"
        />
      </svg>
      <ul className="relative space-y-1">
        {items.map((item, i) => {
          const selected = item.id === active
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setActive(item.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition',
                  selected ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200',
                )}
                aria-current={selected ? 'page' : undefined}
              >
                <span
                  className={cn(
                    'relative z-10 flex h-4 w-4 items-center justify-center rounded-full border',
                    selected ? 'border-signal-400 bg-signal-300' : 'border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-900',
                  )}
                >
                  {selected && (
                    <span
                      className="h-0 w-0 border-x-[3px] border-b-[6px] border-x-transparent border-b-zinc-900 dark:border-b-zinc-950"
                      style={{ transform: `rotate(${i * 45}deg)` }}
                    />
                  )}
                </span>
                {item.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
