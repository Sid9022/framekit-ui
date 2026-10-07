import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { RollNumber, DeltaChip, SrDataTable, useChartCursor, useLiveTick, seeded, focusRing } from '@/lib/widget-kit'

export type SparklineKpiTileProps = {
  label?: string
  value?: number
  prefix?: string
  suffix?: string
  delta?: number
  data?: number[]
  /** Append a live point every `liveMs` (0 = off). */
  liveMs?: number
  /** Stroke + fill hue. */
  color?: string
  className?: string
}

const DEFAULT_DATA = (() => { const r = seeded(3); let v = 40; return Array.from({ length: 24 }, () => (v = Math.max(8, Math.min(92, v + (r() - 0.42) * 16)))) })()

function smooth(pts: [number, number][]) {
  if (pts.length < 2) return ''
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]
    const cx = (x0 + x1) / 2
    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`
  }
  return d
}

/**
 * Sparkline KPI Tile — a compact metric tile: rolling numerals, a delta chip and a smooth sparkline that draws in,
 * streams new points live and shows a crosshair dot with the value on hover or ← →.
 */
export function SparklineKpiTile({ label = 'Active users', value = 12480, prefix = '', suffix = '', delta = 8.2, data, liveMs = 2400, color = '#7c5cff', className }: SparklineKpiTileProps) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const [series, setSeries] = React.useState(data ?? DEFAULT_DATA)
  const [live, setLive] = React.useState(value)
  React.useEffect(() => { if (data) setSeries(data) }, [data])
  React.useEffect(() => setLive(value), [value])
  useLiveTick(ref, () => {
    setSeries((s) => [...s.slice(1), Math.max(8, Math.min(92, s[s.length - 1] + (Math.random() - 0.45) * 14))])
    setLive((v) => v + Math.round((Math.random() - 0.3) * 40))
  }, liveMs, !data)
  const W = 240, H = 64
  const pts = series.map((v, i) => [(i / (series.length - 1)) * W, H - 4 - (v / 100) * (H - 8)] as [number, number])
  const line = smooth(pts)
  const id = React.useId().replace(/:/g, '')
  const { active, bind } = useChartCursor(series.length)
  return (
    <div ref={ref} className={cn('w-full max-w-[320px] rounded-[20px] bg-white p-5 shadow-[0_1px_2px_rgb(0_0_0/0.05),0_8px_24px_-12px_rgb(0_0_0/0.18)] ring-1 ring-black/[0.06] dark:bg-zinc-900 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] dark:ring-white/[0.08]', className)}>
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">{label}</p>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-600 dark:text-zinc-400"><span className="relative flex size-1.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:hidden" /><span className="relative size-1.5 rounded-full bg-emerald-500" /></span>Live</span>
      </div>
      <p className="mt-2 flex items-baseline gap-2">
        <RollNumber value={live} prefix={prefix} suffix={suffix} className="text-[32px] font-semibold leading-none tracking-[-0.03em] text-zinc-950 dark:text-white" />
        <DeltaChip value={delta} />
      </p>
      <div {...bind} role="group" aria-label={`${label} trend, ${series.length} points. Use left and right arrows to inspect.`} className={cn('relative mt-4 rounded-lg', focusRing)}>
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-16 w-full overflow-visible" preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id={`${id}-f`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity="0.28" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>
          <motion.path d={`${line} L ${W} ${H} L 0 ${H} Z`} fill={`url(#${id}-f)`} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1, d: `${line} L ${W} ${H} L 0 ${H} Z` }} transition={{ duration: 0.6 }} />
          <motion.path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" vectorEffect="non-scaling-stroke" initial={reduced ? false : { pathLength: 0 }} animate={{ pathLength: 1, d: line }} transition={{ pathLength: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }, d: { duration: 0.5 } }} />
          {active !== null && <line x1={pts[active][0]} x2={pts[active][0]} y1={0} y2={H} stroke="currentColor" className="text-zinc-400 dark:text-zinc-600" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />}
        </svg>
        <AnimatePresence>
          {active !== null && (
            <motion.div key="dot" className="pointer-events-none absolute" initial={{ opacity: 0 }} animate={{ opacity: 1, left: `${(pts[active][0] / W) * 100}%`, top: `${(pts[active][1] / H) * 100}%` }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 460, damping: 36 }}>
              <span className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white dark:border-zinc-900" style={{ background: color, boxShadow: `0 0 0 4px ${color}33` }} />
              <span className="absolute bottom-2.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-950 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-white dark:bg-white dark:text-zinc-950" aria-live="polite">{Math.round(series[active] * 140).toLocaleString('en-US')}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <SrDataTable caption={`${label} trend`} columns={['Point', 'Value']} rows={series.map((v, i) => [i + 1, Math.round(v * 140)])} />
    </div>
  )
}
