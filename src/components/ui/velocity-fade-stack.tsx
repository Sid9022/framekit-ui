import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Item = { id: string; title: string; note: string }

const DEFAULTS: Item[] = [
  { id: '1', title: 'Velocity', note: 'Faster scroll softens neighbors.' },
  { id: '2', title: 'Distance', note: 'Items fade by distance to center.' },
  { id: '3', title: 'Focus', note: 'The middle card holds scale.' },
  { id: '4', title: 'Settle', note: 'Slow down — stack clarifies.' },
  { id: '5', title: 'Trail', note: 'Motion leaves a soft echo.' },
]

/** Fade/scale from scroll velocity & distance to center. */
export function VelocityFadeStack({
  className,
  items = DEFAULTS,
}: {
  className?: string
  items?: Item[]
}) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const [scroll, setScroll] = React.useState(0)
  const [vel, setVel] = React.useState(0)
  const last = React.useRef({ t: 0, y: 0 })

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const y = e.currentTarget.scrollTop
    const now = performance.now()
    const dt = Math.max(1, now - last.current.t)
    const v = Math.min(2.5, Math.abs(y - last.current.y) / dt)
    last.current = { t: now, y }
    setScroll(y)
    setVel(v)
  }

  return (
    <div
      ref={ref}
      onScroll={onScroll}
      className={cn(
        'framekit-scroll relative h-[300px] w-full max-w-md overflow-y-auto rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950',
        className,
      )}
    >
      <div className="flex flex-col gap-4 px-4 py-[110px]">
        {items.map((item, i) => {
          const center = scroll + 150
          const itemCenter = 110 + i * 96 + 40
          const dist = Math.abs(center - itemCenter)
          const prox = Math.max(0, 1 - dist / 180)
          const scale = reduced ? 1 : 0.88 + prox * 0.14 - vel * 0.04
          const opacity = reduced ? 1 : 0.35 + prox * 0.65 - vel * 0.12
          return (
            <div
              key={item.id}
              className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              style={{
                transform: `scale(${Math.max(0.82, scale)})`,
                opacity: Math.max(0.2, Math.min(1, opacity)),
                transition: 'transform 80ms linear, opacity 80ms linear',
              }}
            >
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="mt-1 text-xs text-zinc-500">{item.note}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
