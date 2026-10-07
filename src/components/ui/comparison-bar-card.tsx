import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { RollNumber, DeltaChip, SrDataTable, focusRing } from '@/lib/widget-kit'

export type ComparisonSeries = { label: string; current: number; previous: number }

export type ComparisonBarCardProps = {
  title?: string
  ranges?: Record<string, ComparisonSeries[]>
  defaultRange?: string
  currency?: string
  className?: string
}

export const DEFAULT_RANGES: Record<string, ComparisonSeries[]> = {
  Week: ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((l, i) => ({ label: l, current: [42, 58, 51, 72, 66, 88, 61][i], previous: [38, 44, 49, 55, 60, 70, 64][i] })),
  Month: ['W1', 'W2', 'W3', 'W4'].map((l, i) => ({ label: l, current: [310, 362, 298, 410][i], previous: [280, 300, 320, 350][i] })),
  Year: ['Q1', 'Q2', 'Q3', 'Q4'].map((l, i) => ({ label: l, current: [1200, 1460, 1610, 1890][i], previous: [1100, 1280, 1350, 1500][i] })),
}

/**
 * Comparison Bar Card — this period vs last as paired bars. A segmented control slides a pill between ranges and
 * the bars re-grow on a spring; hovering or focusing a pair lifts it and reveals both values.
 */
export function ComparisonBarCard({ title = 'Revenue', ranges = DEFAULT_RANGES, defaultRange = 'Week', currency = '$', className }: ComparisonBarCardProps) {
  const reduced = usePrefersReducedMotion()
  const keys = Object.keys(ranges)
  const [range, setRange] = React.useState(defaultRange)
  const [hover, setHover] = React.useState<number | null>(null)
  const data = ranges[range]
  const max = Math.max(...data.flatMap((d) => [d.current, d.previous]))
  const cur = data.reduce((a, d) => a + d.current, 0), prev = data.reduce((a, d) => a + d.previous, 0)
  const id = React.useId()
  return (
    <div className={cn('w-full max-w-[460px] rounded-[24px] bg-white p-5 shadow-[0_1px_2px_rgb(0_0_0/0.05),0_8px_24px_-12px_rgb(0_0_0/0.18)] ring-1 ring-black/[0.06] dark:bg-zinc-900 dark:ring-white/[0.08] sm:p-6', className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">{title}</p>
          <p className="mt-1 flex items-baseline gap-2"><RollNumber value={cur * 10} prefix={currency} duration={0.6} className="text-[28px] font-semibold leading-none tracking-[-0.03em] text-zinc-950 dark:text-white" /><DeltaChip value={((cur - prev) / prev) * 100} /></p>
        </div>
        <div role="radiogroup" aria-label="Range" className="flex rounded-full bg-zinc-100 p-1 dark:bg-white/[0.06]" onKeyDown={(e) => { const i = keys.indexOf(range); if (e.key === 'ArrowRight') setRange(keys[(i + 1) % keys.length]); if (e.key === 'ArrowLeft') setRange(keys[(i - 1 + keys.length) % keys.length]) }}>
          {keys.map((k) => (
            <button key={k} type="button" role="radio" aria-checked={k === range} tabIndex={k === range ? 0 : -1} onClick={() => setRange(k)} className={cn('relative min-h-8 rounded-full px-3 text-[13px] font-medium transition-colors duration-150', k === range ? 'text-zinc-950 dark:text-white' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white', focusRing)}>
              {k === range && <motion.span layoutId={`${id}-pill`} className="absolute inset-0 rounded-full bg-white shadow-[0_1px_2px_rgb(0_0_0/0.08)] dark:bg-zinc-700" transition={{ type: 'spring', stiffness: 460, damping: 36 }} />}
              <span className="relative">{k}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 flex h-40 items-end gap-2 sm:gap-3">
        {data.map((d, i) => (
          <div key={`${range}-${i}`} tabIndex={0} aria-label={`${d.label}: this period ${currency}${d.current * 10}, last period ${currency}${d.previous * 10}`} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} className={cn('relative flex h-full flex-1 flex-col justify-end rounded-lg', focusRing)}>
            {hover === i && <span className="absolute -top-1 left-1/2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-zinc-950 px-2 py-1 text-[11px] font-medium tabular-nums text-white dark:bg-white dark:text-zinc-950" aria-hidden="true">{currency}{d.current * 10} · {currency}{d.previous * 10}</span>}
            <div className="flex h-full items-end justify-center gap-1">
              {(['previous', 'current'] as const).map((k, j) => (
                <motion.span key={k} aria-hidden="true" className={cn('w-full max-w-4 origin-bottom rounded-t-[6px] rounded-b-[2px]', k === 'current' ? 'bg-gradient-to-t from-violet-600 to-fuchsia-500 shadow-[0_0_12px_rgb(168_85_247/0.35)]' : 'bg-zinc-200 dark:bg-zinc-700')}
                  initial={reduced ? false : { scaleY: 0 }} animate={{ scaleY: 1, height: `${(d[k] / max) * 100}%`, y: hover === i && !reduced ? -3 : 0 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 26, delay: reduced ? 0 : i * 0.05 + j * 0.03 }} />
              ))}
            </div>
            <span className="mt-2 text-center text-[12px] text-zinc-600 dark:text-zinc-400" aria-hidden="true">{d.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-4 text-[12px] text-zinc-600 dark:text-zinc-400" aria-hidden="true">
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-violet-600" />This {range.toLowerCase()}</span>
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />Last {range.toLowerCase()}</span>
      </div>
      <SrDataTable caption={`${title}, ${range}`} columns={['Period', 'This', 'Last']} rows={data.map((d) => [d.label, d.current * 10, d.previous * 10])} />
    </div>
  )
}
