import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Panel = {
  id: string
  eyebrow: string
  title: string
  body: string
  badge: string
  gradient: string
  rate?: number
}

const DEFAULTS: Panel[] = [
  {
    id: '1',
    eyebrow: 'Near field',
    title: 'Orbit cards',
    body: 'Foreground panels track the reel almost 1:1 — tactile and sharp.',
    badge: 'Depth 01',
    gradient: 'linear-gradient(145deg, #1c1917 0%, #292524 50%, #431407 100%)',
    rate: 0.12,
  },
  {
    id: '2',
    eyebrow: 'Mid haze',
    title: 'Lilac drift',
    body: 'Mid layers lag behind — soft parallax that sells the volume.',
    badge: 'Depth 02',
    gradient: 'linear-gradient(145deg, #1e1530 0%, #2e2148 45%, #4c1d95 100%)',
    rate: 0.42,
  },
  {
    id: '3',
    eyebrow: 'Far signal',
    title: 'Ember horizon',
    body: 'Distant art barely moves; a quiet cue that space continues.',
    badge: 'Depth 03',
    gradient: 'linear-gradient(145deg, #1a100c 0%, #3b2118 50%, #9a3412 100%)',
    rate: 0.72,
  },
  {
    id: '4',
    eyebrow: 'Trail',
    title: 'Reel end',
    body: 'Closing panel with a peek of the next story waiting below.',
    badge: 'Depth 04',
    gradient: 'linear-gradient(145deg, #0c0c10 0%, #18181b 50%, #27203a 100%)',
    rate: 0.28,
  },
]

const STARS = Array.from({ length: 28 }, (_, i) => ({
  x: (i * 41) % 100,
  y: (i * 29) % 100,
  s: 1 + (i % 3) * 0.6,
}))

/** Multi-layer parallax reel with scrub progress, sticky titles, obvious depth. */
export function ParallaxReelScroll({
  className,
  panels = DEFAULTS,
  viewportClassName,
}: {
  className?: string
  panels?: Panel[]
  /** Classes merged onto the scrolling viewport (surface, border, radius, height). The reel brings its own dark backdrop. */
  viewportClassName?: string
}) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const [scroll, setScroll] = React.useState(0)
  const [max, setMax] = React.useState(1)

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    setScroll(el.scrollTop)
    setMax(Math.max(1, el.scrollHeight - el.clientHeight))
  }

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    setMax(Math.max(1, el.scrollHeight - el.clientHeight))
  }, [panels.length])

  const progress = Math.min(1, scroll / max)
  const active = Math.min(
    panels.length - 1,
    Math.floor(progress * panels.length + 0.01),
  )

  return (
    <div className={cn('relative w-full max-w-md', className)}>
      <div
        ref={ref}
        onScroll={onScroll}
        className={cn(
          'framekit-scroll relative h-[380px] overflow-y-auto rounded-2xl border border-zinc-800 bg-[#07060c] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
          viewportClassName,
        )}
      >
        {/* far star/grid layer */}
        <div
          aria-hidden
          className="pointer-events-none sticky top-0 z-0 h-0"
        >
          <div
            className="relative h-[380px] w-full"
            style={{
              transform: reduced ? undefined : `translateY(${scroll * 0.85}px)`,
            }}
          >
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(154,134,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(154,134,184,0.12) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
                transform: reduced ? undefined : `translateY(${-scroll * 0.2}px)`,
              }}
            />
            {STARS.map((s, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: s.s,
                  height: s.s,
                  opacity: 0.35 + (i % 4) * 0.1,
                  transform: reduced ? undefined : `translateY(${-scroll * (0.05 + (i % 3) * 0.04)}px)`,
                }}
              />
            ))}
            {/* mid nebula art */}
            <div
              className="absolute left-[10%] top-[20%] h-40 w-40 rounded-full bg-signal-500/20 blur-3xl"
              style={{
                transform: reduced ? undefined : `translateY(${-scroll * 0.35}px)`,
              }}
            />
            <div
              className="absolute right-[5%] top-[55%] h-48 w-48 rounded-full bg-framekit-500/15 blur-3xl"
              style={{
                transform: reduced ? undefined : `translateY(${-scroll * 0.5}px)`,
              }}
            />
          </div>
        </div>

        {/* sticky section label */}
        <div className="sticky top-3 z-30 mx-4 flex items-center justify-between rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-md">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-signal-300">
            {panels[active]?.eyebrow ?? 'Reel'}
          </p>
          <p className="font-mono text-[10px] text-zinc-500">
            {String(active + 1).padStart(2, '0')} / {String(panels.length).padStart(2, '0')}
          </p>
        </div>

        {/* foreground cards */}
        <div className="relative z-10" style={{ height: panels.length * 260 + 80 }}>
          {panels.map((p, i) => {
            const rate = p.rate ?? 0.3
            const y = reduced ? 0 : scroll * rate
            const peek = i < panels.length - 1
            return (
              <div
                key={p.id}
                className="absolute left-4 right-4 overflow-hidden rounded-2xl border border-white/10 p-5 shadow-[0_24px_50px_-28px_rgba(0,0,0,0.8)]"
                style={{
                  top: 56 + i * 240,
                  background: p.gradient,
                  transform: `translateY(${-y}px)`,
                  willChange: 'transform',
                }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl"
                />
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] text-framekit-300">
                    {p.badge}
                  </span>
                  <span className="font-mono text-[10px] text-white/30">LAYER {i + 1}</span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-white">
                  {p.title}
                </h3>
                <p className="mt-2 max-w-[90%] text-sm leading-relaxed text-zinc-300/90">
                  {p.body}
                </p>
                {peek && (
                  <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-white/35">
                    ↓ next layer peeks below
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* scrub progress */}
      <div className="mt-3 flex items-center gap-3 px-1">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-signal-400 to-framekit-500"
            style={{ width: `${progress * 100}%`, transition: 'width 60ms linear' }}
          />
        </div>
        <span className="font-mono text-[10px] tabular-nums text-zinc-500">
          {Math.round(progress * 100)}%
        </span>
      </div>
    </div>
  )
}
