import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Panel = { id: string; title: string; body: string; tone: string; rate?: number }

const DEFAULTS: Panel[] = [
  { id: '1', title: 'Near field', body: 'Scrolls almost 1:1 with the reel.', tone: '#1c1917', rate: 0.15 },
  { id: '2', title: 'Mid haze', body: 'Drifts slower — soft parallax lag.', tone: '#27203a', rate: 0.45 },
  { id: '3', title: 'Far signal', body: 'Barely moves; depth cue.', tone: '#3b2118', rate: 0.75 },
  { id: '4', title: 'Horizon', body: 'Trailing panel for the reel end.', tone: '#18181b', rate: 0.35 },
]

/** Stacked panels with different parallax rates in a fixed scroller. */
export function ParallaxReelScroll({
  className,
  panels = DEFAULTS,
}: {
  className?: string
  panels?: Panel[]
}) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const [scroll, setScroll] = React.useState(0)

  return (
    <div
      ref={ref}
      onScroll={(e) => setScroll(e.currentTarget.scrollTop)}
      className={cn(
        'framekit-scroll relative h-[300px] w-full max-w-md overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950',
        className,
      )}
    >
      <div className="relative" style={{ height: panels.length * 220 }}>
        {panels.map((p, i) => {
          const rate = p.rate ?? 0.3
          const y = reduced ? 0 : scroll * rate
          return (
            <div
              key={p.id}
              className="absolute left-4 right-4 rounded-2xl border border-white/10 p-5 shadow-xl"
              style={{
                top: 24 + i * 200,
                background: `linear-gradient(145deg, ${p.tone}, #0c0c0c)`,
                transform: `translateY(${-y}px)`,
                willChange: 'transform',
              }}
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-signal-300">Layer {i + 1}</p>
              <h3 className="mt-1 text-lg font-semibold text-white">{p.title}</h3>
              <p className="mt-1 text-sm text-zinc-400">{p.body}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
