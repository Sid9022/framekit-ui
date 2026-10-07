import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { GlowStatShell, useLiveTick, focusRing } from '@/lib/widget-kit'

export type LevelRow = { label: string; level: number }

export type GlowLevelCardProps = {
  title?: string
  value?: number
  delta?: number
  subValue?: string
  rows?: LevelRow[]
  /** Segments per row. */
  segments?: number
  /** Re-balance levels every `liveMs` (0 = off). */
  liveMs?: number
  accent?: string
  className?: string
}

export const DEFAULT_LEVEL_ROWS: LevelRow[] = [
  { label: 'Direct', level: 2 },
  { label: 'Search', level: 1 },
  { label: 'Social', level: 2 },
  { label: 'Partners', level: 4 },
]

/**
 * Glow Level Card — the ink stat card with segmented level meters. Segments light up left to right with a neon
 * bloom; levels re-balance live, and hovering or focusing a row reveals its channel and share.
 */
export function GlowLevelCard({ title, value = 9134, delta = 2.5, subValue = '$185,301', rows, segments = 6, liveMs = 3200, accent = '#7dff6a', className }: GlowLevelCardProps) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const [data, setData] = React.useState(rows ?? DEFAULT_LEVEL_ROWS)
  React.useEffect(() => { if (rows) setData(rows) }, [rows])
  const [hover, setHover] = React.useState<number | null>(null)
  useLiveTick(ref, () => setData((d) => d.map((r) => ({ ...r, level: Math.max(1, Math.min(segments, r.level + (Math.random() < 0.5 ? -1 : 1))) }))), liveMs, !rows)

  const chart = (
    <div ref={ref}>
      <ul className="grid gap-1" aria-label="Channel levels">
        {data.map((r, ri) => (
          <li
            key={r.label}
            tabIndex={0}
            aria-label={`${r.label}: ${r.level} of ${segments}`}
            onPointerEnter={() => setHover(ri)}
            onPointerLeave={() => setHover(null)}
            onFocus={() => setHover(ri)}
            onBlur={() => setHover(null)}
            className={cn('group relative flex items-center gap-1.5 rounded-lg px-1 py-1.5 transition-colors duration-150 hover:bg-white/[0.04]', focusRing, 'ring-offset-[#050505] dark:ring-offset-[#050505]', ri < data.length - 1 && 'after:absolute after:inset-x-1 after:-bottom-0.5 after:h-px after:bg-white/[0.06]')}
          >
            {Array.from({ length: segments }, (_, si) => {
              const on = si < r.level
              return (
                <motion.span
                  key={si}
                  aria-hidden="true"
                  className="h-[7px] flex-1 rounded-full"
                  initial={reduced ? false : { opacity: 0, scaleX: 0.3 }}
                  animate={{
                    opacity: 1,
                    scaleX: 1,
                    backgroundColor: on ? accent : 'rgb(255 255 255 / 0.16)',
                    boxShadow: on ? `0 0 10px ${accent}aa, 0 0 2px ${accent}` : '0 0 0px rgba(0,0,0,0)',
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32, delay: reduced ? 0 : 0.1 + ri * 0.06 + si * 0.035 }}
                  style={{ transformOrigin: 'left center' }}
                />
              )
            })}
            <motion.span
              aria-hidden="true"
              initial={false}
              animate={{ opacity: hover === ri ? 1 : 0, x: hover === ri ? 0 : 4 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 rounded-md bg-zinc-900 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-white ring-1 ring-white/10"
            >
              {r.label} · {Math.round((r.level / segments) * 100)}%
            </motion.span>
          </li>
        ))}
      </ul>
    </div>
  )
  return <GlowStatShell title={title} value={value} delta={delta} subValue={subValue} chart={chart} className={className} />
}
