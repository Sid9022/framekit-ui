import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Item = {
  id: string
  icon: string
  title: string
  meta: string
  note: string
  accent: string
}

const DEFAULTS: Item[] = [
  {
    id: '1',
    icon: '⚡',
    title: 'Velocity',
    meta: 'Inertia · 0–2.5',
    note: 'Faster scroll softens neighbors into a motion blur echo.',
    accent: '#f97316',
  },
  {
    id: '2',
    icon: '◎',
    title: 'Distance',
    meta: 'Proximity field',
    note: 'Opacity and scale fall off from the stage centerline.',
    accent: '#9a86b8',
  },
  {
    id: '3',
    icon: '◈',
    title: 'Focus',
    meta: 'Center lock',
    note: 'The middle card holds full scale with a lilac rim glow.',
    accent: '#fdba74',
  },
  {
    id: '4',
    icon: '↝',
    title: 'Settle',
    meta: 'Coast → rest',
    note: 'Slow down and the stack clarifies — inertia fades out.',
    accent: '#22d3ee',
  },
  {
    id: '5',
    icon: '✦',
    title: 'Trail',
    meta: 'Soft echo',
    note: 'A last card that peeks — proof the reel continues.',
    accent: '#e879f9',
  },
  {
    id: '6',
    icon: '◉',
    title: 'Bloom',
    meta: 'Highlight',
    note: 'Focus highlight blooms only when velocity drops.',
    accent: '#f97316',
  },
]

const CARD_H = 104
const PAD = 140

/** Cards with icon/title/meta; scale/blur/opacity from distance + velocity. */
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
  const velRef = React.useRef(0)
  const last = React.useRef({ t: 0, y: 0 })
  const raf = React.useRef<number | null>(null)

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const y = e.currentTarget.scrollTop
    const now = performance.now()
    const dt = Math.max(1, now - last.current.t)
    const instant = Math.min(2.8, Math.abs(y - last.current.y) / dt)
    last.current = { t: now, y }
    setScroll(y)
    // inertia: ease velocity toward instant, then decay
    velRef.current = Math.max(instant, velRef.current * 0.85 + instant * 0.15)
    setVel(velRef.current)
  }

  React.useEffect(() => {
    if (reduced) return
    const tick = () => {
      if (velRef.current > 0.01) {
        velRef.current *= 0.92
        setVel(velRef.current)
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [reduced])

  const stageH = 380
  const center = scroll + stageH / 2

  return (
    <div className={cn('relative w-full max-w-md', className)}>
      <div
        ref={ref}
        onScroll={onScroll}
        className="framekit-scroll relative h-[380px] overflow-y-auto rounded-2xl border border-zinc-800 bg-gradient-to-b from-[#0c0b12] via-[#101014] to-[#0a0a0c]"
      >
        {/* center focus band */}
        <div
          aria-hidden
          className="pointer-events-none sticky top-0 z-20 h-0"
        >
          <div className="relative h-[380px]">
            <div className="absolute inset-x-0 top-1/2 h-28 -translate-y-1/2 border-y border-dashed border-white/5 bg-gradient-to-b from-signal-500/5 via-transparent to-framekit-500/5" />
            <div className="absolute left-3 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/10 bg-black/50 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-signal-300 backdrop-blur">
              focus
            </div>
            <div className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/40 px-2 py-1 font-mono text-[9px] tabular-nums text-zinc-400 backdrop-blur">
              v {vel.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-3 px-4" style={{ paddingTop: PAD, paddingBottom: PAD }}>
          {items.map((item, i) => {
            const itemCenter = PAD + i * (CARD_H + 12) + CARD_H / 2
            const dist = Math.abs(center - itemCenter)
            const prox = Math.max(0, 1 - dist / 200)
            const v = reduced ? 0 : vel
            const scale = reduced ? 1 : Math.max(0.84, 0.88 + prox * 0.14 - v * 0.05)
            const opacity = reduced ? 1 : Math.max(0.22, 0.3 + prox * 0.7 - v * 0.15)
            const blur = reduced ? 0 : Math.max(0, (1 - prox) * 2.5 + v * 1.8)
            const focused = prox > 0.72 && v < 0.35

            return (
              <div
                key={item.id}
                className={cn(
                  'relative flex gap-3 overflow-hidden rounded-2xl border p-4',
                  focused
                    ? 'border-signal-400/40 bg-zinc-900/95 shadow-[0_0_0_1px_rgba(154,134,184,0.25),0_20px_40px_-20px_rgba(249,115,22,0.35)]'
                    : 'border-zinc-800/80 bg-zinc-900/70',
                )}
                style={{
                  height: CARD_H,
                  transform: `scale(${scale})`,
                  opacity,
                  filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
                  transition: 'transform 70ms linear, opacity 70ms linear, filter 70ms linear, box-shadow 200ms ease',
                  willChange: 'transform, opacity, filter',
                }}
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg shadow-inner"
                  style={{
                    background: `linear-gradient(145deg, ${item.accent}33, ${item.accent}10)`,
                    boxShadow: focused ? `0 0 20px ${item.accent}44` : undefined,
                  }}
                >
                  <span aria-hidden>{item.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="truncate text-sm font-semibold text-white">{item.title}</h3>
                    <span
                      className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em]"
                      style={{ color: item.accent }}
                    >
                      {item.meta}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                    {item.note}
                  </p>
                </div>
                {focused && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-0 w-0.5 rounded-full"
                    style={{ background: item.accent, boxShadow: `0 0 12px ${item.accent}` }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
