import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { GlowStatShell, SrDataTable, useChartCursor, useLiveTick, seeded, focusRing } from '@/lib/widget-kit'

export type Candle = { o: number; h: number; l: number; c: number; label?: string }

export type GlowCandleCardProps = {
  title?: string
  value?: number
  delta?: number
  subValue?: string
  candles?: Candle[]
  /** Stream a new candle every `liveMs` (0 = off). Pauses offscreen and under reduced motion. */
  liveMs?: number
  /** Neon accent. */
  accent?: string
  className?: string
}

function makeCandles(n: number, seed = 7): Candle[] {
  const r = seeded(seed)
  let p = 50
  return Array.from({ length: n }, (_, i) => {
    const o = p
    const c = Math.max(12, Math.min(88, o + (r() - 0.45) * 22))
    const h = Math.max(o, c) + r() * 8
    const l = Math.min(o, c) - r() * 8
    p = c
    return { o, h, l, c, label: `T${i + 1}` }
  })
}

export const DEFAULT_CANDLES = makeCandles(14)

/**
 * Glow Candle Card — an ink “Sales Report” stat card with a neon candlestick chart. Candles grow from their
 * body midpoints on entry, a new one streams in on a timer, and hover / ← → shows a crosshair with OHLC.
 */
export function GlowCandleCard({ title, value = 9134, delta = 2.5, subValue = '$185,301', candles, liveMs = 2600, accent = '#4dff9a', className }: GlowCandleCardProps) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const [data, setData] = React.useState<Candle[]>(() => candles ?? DEFAULT_CANDLES)
  const [tick, setTick] = React.useState(0)
  React.useEffect(() => { if (candles) setData(candles) }, [candles])
  const rnd = React.useRef(seeded(99))
  useLiveTick(ref, () => {
    setData((d) => {
      const last = d[d.length - 1]
      const o = last.c
      const c = Math.max(12, Math.min(88, o + (rnd.current() - 0.47) * 20))
      const next = { o, c, h: Math.max(o, c) + rnd.current() * 7, l: Math.min(o, c) - rnd.current() * 7, label: `T${tick + d.length + 1}` }
      return [...d.slice(1), next]
    })
    setTick((t) => t + 1)
  }, liveMs, !candles)

  const W = 180, H = 84, n = data.length
  const lo = Math.min(...data.map((d) => d.l)), hi = Math.max(...data.map((d) => d.h))
  const y = (v: number) => 4 + (1 - (v - lo) / Math.max(1, hi - lo)) * (H - 8)
  const step = W / n
  const bw = Math.max(4, step * 0.46)
  const { active, bind } = useChartCursor(n)
  const id = React.useId().replace(/:/g, '')
  const a = active !== null ? data[active] : null

  const chart = (
    <div ref={ref} className="relative">
      <div
        {...bind}
        role="group"
        aria-label={`Candlestick chart, ${n} periods. Use left and right arrows to inspect.`}
        className={cn('relative rounded-xl', focusRing, 'ring-offset-[#050505] dark:ring-offset-[#050505]')}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-[84px] w-full overflow-visible" aria-hidden="true">
          <defs>
            <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <AnimatePresence initial={!reduced} mode="popLayout">
            {data.map((d, i) => {
              const up = d.c >= d.o
              const x = i * step + step / 2
              const top = y(Math.max(d.o, d.c)), bot = y(Math.min(d.o, d.c))
              const dim = active !== null && active !== i
              const key = d.label ?? i
              return (
                <motion.g
                  key={key}
                  layout={!reduced}
                  initial={reduced ? false : { opacity: 0, scaleY: 0.1 }}
                  animate={{ opacity: dim ? 0.35 : 1, scaleY: 1, x: 0 }}
                  exit={{ opacity: 0, x: -step }}
                  transition={{ type: 'spring', stiffness: 260, damping: 30, delay: tick === 0 && !reduced ? 0.15 + i * 0.04 : 0 }}
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  filter={up ? `url(#${id}-glow)` : undefined}
                >
                  <line x1={x} x2={x} y1={y(d.h)} y2={y(d.l)} stroke={up ? accent : '#2c7a52'} strokeWidth={1.2} strokeLinecap="round" />
                  <rect x={x - bw / 2} y={top} width={bw} height={Math.max(2, bot - top)} rx={bw / 2.4} fill={up ? accent : '#1d5c3c'} />
                </motion.g>
              )
            })}
          </AnimatePresence>
          {a && active !== null && (
            <g pointerEvents="none">
              <line x1={active * step + step / 2} x2={active * step + step / 2} y1={0} y2={H} stroke="white" strokeOpacity={0.25} strokeDasharray="2 3" />
              <line x1={0} x2={W} y1={y(a.c)} y2={y(a.c)} stroke="white" strokeOpacity={0.15} strokeDasharray="2 3" />
            </g>
          )}
        </svg>
        <AnimatePresence>
          {a && active !== null && (
            <motion.div
              key="tip"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1, left: `${((active + 0.5) / n) * 100}%` }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 460, damping: 36 }}
              className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-zinc-900/95 px-2 py-1 font-mono text-[11px] tabular-nums text-white shadow-lg ring-1 ring-white/10"
              aria-live="polite"
            >
              O {a.o.toFixed(1)} · H {a.h.toFixed(1)} · L {a.l.toFixed(1)} · <span style={{ color: a.c >= a.o ? accent : '#ff8a9a' }}>C {a.c.toFixed(1)}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <SrDataTable caption="Candles" columns={['Period', 'Open', 'High', 'Low', 'Close']} rows={data.map((d, i) => [d.label ?? `${i + 1}`, d.o.toFixed(1), d.h.toFixed(1), d.l.toFixed(1), d.c.toFixed(1)])} />
    </div>
  )
  return <GlowStatShell title={title} value={value} delta={delta} subValue={subValue} chart={chart} className={className} />
}
