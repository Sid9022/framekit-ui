import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { GlowStatShell, SrDataTable, useChartCursor, useLiveTick, focusRing } from '@/lib/widget-kit'

export type HistogramBin = { label: string; value: number }

export type GlowHistogramCardProps = {
  title?: string
  value?: number
  delta?: number
  subValue?: string
  bins?: HistogramBin[]
  liveMs?: number
  accent?: string
  className?: string
}

export const DEFAULT_BINS: HistogramBin[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'].map((label, i) => ({ label: `${label}${i === 7 ? ' (wk 2)' : ''}`, value: [46, 62, 82, 74, 64, 86, 72, 58][i] }))

/**
 * Glow Histogram Card — a gradient histogram on the left of the ink stat card. Bars rise on a soft spring with
 * a neon cap and a fade into the card, values drift live, and hover / ← → lifts a bar with its value.
 */
export function GlowHistogramCard({ title, value = 9134, delta = 2.5, subValue = '$185,301', bins, liveMs = 2800, accent = '#5bff7a', className }: GlowHistogramCardProps) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const [data, setData] = React.useState(bins ?? DEFAULT_BINS)
  React.useEffect(() => { if (bins) setData(bins) }, [bins])
  useLiveTick(ref, () => setData((d) => d.map((b) => ({ ...b, value: Math.max(28, Math.min(96, b.value + Math.round((Math.random() - 0.5) * 14))) }))), liveMs, !bins)
  const { active, bind } = useChartCursor(data.length)
  const max = Math.max(...data.map((d) => d.value), 1)
  const id = React.useId().replace(/:/g, '')

  const chart = (
    <div ref={ref} className="relative">
      <div {...bind} role="group" aria-label={`Histogram, ${data.length} bars. Use left and right arrows to inspect.`} className={cn('relative flex h-[92px] items-end gap-[3px] rounded-xl', focusRing, 'ring-offset-[#050505] dark:ring-offset-[#050505]')}>
        <svg width="0" height="0" className="absolute" aria-hidden="true"><defs><linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={accent} stopOpacity="0.75" /><stop offset="1" stopColor={accent} stopOpacity="0" /></linearGradient></defs></svg>
        {data.map((b, i) => {
          const on = active === i
          return (
            <motion.div
              key={i}
              aria-hidden="true"
              className="relative flex-1 origin-bottom"
              initial={reduced ? false : { scaleY: 0 }}
              animate={{ scaleY: 1, height: `${(b.value / max) * 100}%`, opacity: active === null || on ? 1 : 0.45, y: on && !reduced ? -3 : 0 }}
              transition={{ type: 'spring', stiffness: 160, damping: 22, delay: reduced ? 0 : 0.12 + i * 0.05 }}
            >
              <span className="absolute inset-0 rounded-t-[3px]" style={{ background: `linear-gradient(to bottom, ${accent}cc, ${accent}22 70%, transparent)` }} />
              <span className="absolute inset-x-0 top-0 h-[3px] rounded-full" style={{ background: accent, boxShadow: `0 0 10px ${accent}, 0 0 2px ${accent}` }} />
            </motion.div>
          )
        })}
        <AnimatePresence>
          {active !== null && (
            <motion.div
              key="tip"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0, left: `${((active + 0.5) / data.length) * 100}%` }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 460, damping: 36 }}
              className="pointer-events-none absolute -top-3 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-zinc-900/95 px-2 py-1 text-[11px] font-medium tabular-nums text-white ring-1 ring-white/10"
              aria-live="polite"
            >
              {data[active].label} · ${(data[active].value * 112).toLocaleString('en-US')}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <SrDataTable caption="Sales by day" columns={['Day', 'Sales']} rows={data.map((b) => [b.label, `$${(b.value * 112).toLocaleString('en-US')}`])} />
    </div>
  )
  return <GlowStatShell title={title} value={value} delta={delta} subValue={subValue} chart={chart} chartSide="left" className={className} />
}
