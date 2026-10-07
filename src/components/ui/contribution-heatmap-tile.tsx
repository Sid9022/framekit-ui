import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { RollNumber, seeded, focusRing } from '@/lib/widget-kit'

export type ContributionHeatmapTileProps = {
  title?: string
  /** values[week][day], 0–4. */
  values?: number[][]
  weeks?: number
  unit?: string
  /** Hue for the scale (CSS colour). */
  color?: string
  className?: string
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function makeValues(weeks: number) {
  const r = seeded(11)
  return Array.from({ length: weeks }, (_, w) => DAYS.map((_, d) => { const base = d > 4 ? 0.5 : 1.6 + w / weeks; return Math.max(0, Math.min(4, Math.round(base + (r() - 0.4) * 3))) }))
}

/**
 * Contribution Heatmap Tile — a weeks × days activity calendar. Cells pop in on a diagonal wave, the streak and
 * total roll up, and the grid is a single roving tab stop: arrows move a ring that shows the day’s count.
 */
export function ContributionHeatmapTile({ title = 'Focus sessions', values, weeks = 16, unit = 'sessions', color = '#22c55e', className }: ContributionHeatmapTileProps) {
  const reduced = usePrefersReducedMotion()
  const data = React.useMemo(() => values ?? makeValues(weeks), [values, weeks])
  const W = data.length
  const [cur, setCur] = React.useState<[number, number] | null>(null)
  const total = data.flat().reduce((a, v) => a + v * 2, 0)
  let streak = 0
  for (const v of data.flat().reverse()) { if (v > 0) streak++; else break }
  const shade = (v: number) => (v === 0 ? undefined : `color-mix(in oklab, ${color} ${[0, 30, 55, 78, 100][v]}%, transparent)`)
  const onKey = (e: React.KeyboardEvent) => {
    const map: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }
    if (e.key === 'Escape') return setCur(null)
    const m = map[e.key]; if (!m) return
    e.preventDefault()
    setCur((c) => { const [w, d] = c ?? [W - 1, 6]; return [Math.max(0, Math.min(W - 1, w + m[0])), Math.max(0, Math.min(6, d + m[1]))] })
  }
  return (
    <div className={cn('w-full max-w-[520px] rounded-[24px] bg-white p-5 shadow-[0_1px_2px_rgb(0_0_0/0.05),0_8px_24px_-12px_rgb(0_0_0/0.18)] ring-1 ring-black/[0.06] dark:bg-zinc-900 dark:ring-white/[0.08] sm:p-6', className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">{title}</p>
          <p className="mt-1 text-[28px] font-semibold leading-none tracking-[-0.03em] text-zinc-950 dark:text-white"><RollNumber value={total} /> <span className="text-sm font-medium tracking-normal text-zinc-600 dark:text-zinc-400">{unit}</span></p>
        </div>
        <p className="rounded-full bg-zinc-100 px-3 py-1 text-[13px] font-medium tabular-nums text-zinc-800 dark:bg-white/[0.06] dark:text-zinc-200">🔥 {streak}-day streak</p>
      </div>
      <div className="relative mt-5 overflow-x-auto pb-1">
        <div
          role="grid"
          tabIndex={0}
          aria-label={`${title} heatmap, ${W} weeks. Use arrow keys to inspect days.`}
          onKeyDown={onKey}
          onBlur={() => setCur(null)}
          className={cn('inline-grid grid-flow-col gap-[3px] rounded-md p-0.5 sm:gap-1', focusRing)}
          style={{ gridTemplateRows: 'repeat(7, minmax(0, 1fr))' }}
        >
          {data.map((week, w) => week.map((v, d) => {
            const on = cur?.[0] === w && cur?.[1] === d
            return (
              <motion.div
                key={`${w}-${d}`}
                role="gridcell"
                aria-label={`Week ${w + 1} ${DAYS[d]}: ${v * 2} ${unit}`}
                aria-selected={on}
                onPointerEnter={() => setCur([w, d])}
                onPointerLeave={() => setCur(null)}
                initial={reduced ? false : { opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: on && !reduced ? 1.25 : 1 }}
                transition={{ type: 'spring', stiffness: 420, damping: 28, delay: reduced || on ? 0 : (w + d) * 0.012 }}
                className={cn('size-[13px] rounded-[4px] bg-zinc-100 dark:bg-white/[0.06] sm:size-4', on && 'ring-2 ring-zinc-950 dark:ring-white')}
                style={{ backgroundColor: shade(v) }}
              />
            )
          }))}
        </div>
      </div>
      <div className="mt-3 flex min-h-6 items-center justify-between text-[12px] text-zinc-600 dark:text-zinc-400">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={cur ? cur.join() : 'none'} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={{ duration: 0.15 }} className="tabular-nums" aria-live="polite">
            {cur ? `Week ${cur[0] + 1}, ${DAYS[cur[1]]}: ${data[cur[0]][cur[1]] * 2} ${unit}` : 'Hover or use the arrow keys'}
          </motion.span>
        </AnimatePresence>
        <span className="flex items-center gap-1" aria-hidden="true">Less {[0, 1, 2, 3, 4].map((v) => <span key={v} className="size-2.5 rounded-[3px] bg-zinc-100 dark:bg-white/[0.06]" style={{ backgroundColor: shade(v) }} />)} More</span>
      </div>
    </div>
  )
}
