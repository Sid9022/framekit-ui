import * as React from 'react'
import { cn } from '@/lib/cn'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS = [9, 11, 13, 15, 17, 19]

function cell(d: number, h: number) {
  const v = (Math.sin(d * 1.7 + h * 0.4) + 1) * 0.5
  const bump = h >= 2 && h <= 4 && d < 5 ? 0.35 : 0
  return Math.min(1, v * 0.7 + bump)
}

/** Compact hour×day heatmap for message volume with hover tooltip. */
export function StatusHeatmapGrid({ className }: { className?: string }) {
  const [tip, setTip] = React.useState<{ d: string; h: number; v: number; x: number; y: number } | null>(null)

  return (
    <div
      className={cn(
        'relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950',
        className,
      )}
    >
      <p className="mb-3 text-sm font-semibold">Message volume</p>
      <div className="grid grid-cols-[36px_repeat(6,1fr)] gap-1">
        <div />
        {HOURS.map((h) => (
          <div key={h} className="text-center font-mono text-[9px] text-zinc-400">
            {h}:00
          </div>
        ))}
        {DAYS.map((day, di) => (
          <React.Fragment key={day}>
            <div className="flex items-center font-mono text-[9px] text-zinc-400">{day}</div>
            {HOURS.map((h, hi) => {
              const v = cell(di, hi)
              return (
                <button
                  key={`${day}-${h}`}
                  type="button"
                  className="aspect-square rounded-md transition hover:ring-2 hover:ring-signal-400/50"
                  style={{
                    background: `rgba(125, 104, 153, ${0.12 + v * 0.85})`,
                  }}
                  onMouseEnter={(e) => {
                    const rect = (e.target as HTMLElement).getBoundingClientRect()
                    const parent = (e.target as HTMLElement).closest('.relative')!.getBoundingClientRect()
                    setTip({
                      d: day,
                      h,
                      v: Math.round(v * 100),
                      x: rect.left - parent.left + rect.width / 2,
                      y: rect.top - parent.top,
                    })
                  }}
                  onMouseLeave={() => setTip(null)}
                />
              )
            })}
          </React.Fragment>
        ))}
      </div>
      {tip && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[10px] shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
          style={{ left: tip.x, top: tip.y - 6 }}
        >
          {tip.d} {tip.h}:00 · <strong>{tip.v}</strong> idx
        </div>
      )}
      <div className="mt-3 flex items-center gap-2 font-mono text-[9px] text-zinc-400">
        Low
        <span className="h-2 flex-1 rounded-full bg-gradient-to-r from-signal-200/30 to-signal-700" />
        High
      </div>
    </div>
  )
}
