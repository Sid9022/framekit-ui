import * as React from 'react'
import { cn } from '@/lib/cn'

/** Contour-offset stack — hover separates layers; click selects with aria-selected. */
export function TopographicStack({
  items,
  className,
}: {
  items: { id: string; title: string; note: string }[]
  className?: string
}) {
  const [selected, setSelected] = React.useState(items[0]?.id)
  const [hover, setHover] = React.useState(false)

  return (
    <div
      className={cn('relative mx-auto h-56 w-full max-w-sm', className)}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-30" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <ellipse
            key={i}
            cx="50%"
            cy="55%"
            rx={40 + i * 12}
            ry={22 + i * 8}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-zinc-500 dark:text-zinc-400"
          />
        ))}
      </svg>
      {items.map((item, i) => {
        const active = selected === item.id
        const spread = hover ? 18 : 8
        return (
          <button
            key={item.id}
            type="button"
            aria-selected={active}
            role="option"
            onClick={() => setSelected(item.id)}
            className={cn(
              'absolute left-1/2 w-[86%] -translate-x-1/2 rounded-2xl border bg-white/90 p-4 text-left shadow-md backdrop-blur transition-all duration-300 dark:bg-zinc-950/90',
              active ? 'border-signal-400 ring-1 ring-signal-300' : 'border-zinc-200 dark:border-zinc-800',
            )}
            style={{
              top: 24 + i * spread,
              zIndex: active ? 20 : 10 - i,
              transform: `translateX(-50%) scale(${active ? 1 : 0.98 - i * 0.01})`,
            }}
          >
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="mt-1 text-xs text-zinc-500">{item.note}</p>
          </button>
        )
      })}
    </div>
  )
}
