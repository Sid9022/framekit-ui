import * as React from 'react'
import { AnimatePresence, LayoutGroup, animate, motion, useInView, useMotionValue, useTransform } from 'motion/react'
import { Crown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type LeaderboardItem = {
  id: string
  name: string
  score: number
  level?: number
  /** Optional avatar URL; falls back to a gradient initials avatar. */
  src?: string
  /** Avatar hue (0–360). */
  hue?: number
}

export type GlowLeaderboardListProps = {
  items?: LeaderboardItem[]
  title?: string
  subtitle?: string
  /** Controlled live state. */
  live?: boolean
  /** Uncontrolled initial live state. */
  defaultLive?: boolean
  onLiveChange?: (live: boolean) => void
  /** Milliseconds between live score ticks. */
  interval?: number
  /** Prefix for amounts. */
  currency?: string
  /** Rows rendered (the rest keep competing off-screen). */
  visibleRows?: number
  /** Show the header with the live switch. */
  showHeader?: boolean
  className?: string
}

export const DEFAULT_LEADERBOARD_ITEMS: LeaderboardItem[] = [
  { id: 'nova', name: 'nova.byte', level: 48, score: 18420, hue: 212 },
  { id: 'kite', name: 'kitewarden', level: 44, score: 17260, hue: 268 },
  { id: 'miso', name: 'miso_rune', level: 41, score: 16115, hue: 20 },
  { id: 'arlo', name: 'arlo.vex', level: 39, score: 15380, hue: 160 },
  { id: 'juno', name: 'junopixel', level: 37, score: 14240, hue: 330 },
  { id: 'teo', name: 'teo_quartz', level: 35, score: 13390, hue: 45 },
  { id: 'rhea', name: 'rhea.loop', level: 33, score: 12870, hue: 190 },
  { id: 'bram', name: 'bramblefox', level: 30, score: 11905, hue: 100 },
]

const fmt = (n: number) => Math.round(n).toLocaleString('en-US')

function RollingAmount({ value, prefix, reduced }: { value: number; prefix: string; reduced: boolean }) {
  const mv = useMotionValue(value)
  const text = useTransform(mv, (v) => `+${prefix}${fmt(v)}`)
  React.useEffect(() => {
    if (reduced) {
      mv.set(value)
      return
    }
    const c = animate(mv, value, { duration: 0.9, ease: [0.22, 1, 0.36, 1] })
    return () => c.stop()
  }, [value, mv, reduced])
  return <motion.span className="tabular-nums">{text}</motion.span>
}

function Avatar({ item, size = 36 }: { item: LeaderboardItem; size?: number }) {
  const hue = item.hue ?? 220
  const initials = item.name.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase()
  return (
    <span
      className="relative grid shrink-0 place-items-center overflow-hidden rounded-full text-[11px] font-semibold text-white ring-2 ring-white/70 dark:ring-white/15"
      style={{ width: size, height: size, background: `linear-gradient(140deg, hsl(${hue} 90% 66%), hsl(${hue + 40} 80% 42%))` }}
    >
      {item.src ? <img src={item.src} alt="" className="h-full w-full object-cover" /> : initials}
      <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent" />
    </span>
  )
}

/**
 * Glow Leaderboard List — glass pill rows that genuinely compete. Scores tick
 * up live, rows re-rank with layout springs, amounts roll to their new value
 * and the glowing leader highlight glides to whoever takes first place.
 */
export function GlowLeaderboardList({
  items = DEFAULT_LEADERBOARD_ITEMS,
  title = 'Weekly payouts',
  subtitle = 'Top creators · resets Monday',
  live: liveProp,
  defaultLive = true,
  onLiveChange,
  interval = 2200,
  currency = '$',
  visibleRows = 6,
  showHeader = true,
  className,
}: GlowLeaderboardListProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const inView = useInView(ref, { margin: '60px' })
  const [liveState, setLiveState] = React.useState(defaultLive)
  const live = liveProp ?? liveState
  const setLive = (v: boolean) => {
    if (liveProp === undefined) setLiveState(v)
    onLiveChange?.(v)
  }
  const [rows, setRows] = React.useState(() => [...items].sort((a, b) => b.score - a.score))
  const [deltas, setDeltas] = React.useState<Record<string, { amount: number; key: number }>>({})
  const [announce, setAnnounce] = React.useState('')
  const leaderRef = React.useRef(rows[0]?.id)

  const rowsRef = React.useRef(rows)
  React.useEffect(() => {
    const sorted = [...items].sort((a, b) => b.score - a.score)
    rowsRef.current = sorted
    setRows(sorted)
  }, [items])

  React.useEffect(() => {
    if (!live || !inView) return
    const id = window.setInterval(() => {
      if (document.hidden) return
      const next = rowsRef.current.map((r) => ({ ...r }))
      const bumps = 1 + Math.floor(Math.random() * 2)
      const d: Record<string, { amount: number; key: number }> = {}
      for (let k = 0; k < bumps; k++) {
        // underdogs get bigger swings so the ranking actually moves
        const idx = Math.min(next.length - 1, Math.floor(Math.random() ** 0.8 * next.length))
        const gap = idx > 0 ? next[idx - 1].score - next[idx].score : 400
        const amount = Math.round((120 + Math.random() * (gap + 600)) / 5) * 5
        next[idx].score += amount
        next[idx].level = (next[idx].level ?? 1) + (Math.random() < 0.25 ? 1 : 0)
        d[next[idx].id] = { amount, key: Date.now() + k }
      }
      next.sort((a, b) => b.score - a.score)
      rowsRef.current = next
      setRows(next)
      setDeltas(d)
      if (next[0].id !== leaderRef.current) {
        leaderRef.current = next[0].id
        setAnnounce(`${next[0].name} takes first place`)
      }
    }, interval)
    return () => window.clearInterval(id)
  }, [live, inView, interval])

  const layoutT = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 320, damping: 32, mass: 0.9 }
  const shown = rows.slice(0, visibleRows)

  return (
    <div
      ref={ref}
      className={cn(
        'relative w-full max-w-md overflow-hidden rounded-3xl bg-[#f5f6f9] p-4 ring-1 ring-black/[0.06] sm:p-5 dark:bg-[#07080d] dark:ring-white/[0.07]',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgb(15_23_42/0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(15_23_42/0.05)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(80%_70%_at_50%_20%,black,transparent)] dark:bg-[linear-gradient(rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.04)_1px,transparent_1px)]"
      />
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-500/20" />

      {showHeader && (
        <div className="relative mb-4 flex items-center justify-between gap-3 px-1">
          <div>
            <p className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">{title}</p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{subtitle}</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={live}
            onClick={() => setLive(!live)}
            className="inline-flex items-center gap-2 rounded-full bg-white px-2.5 py-1.5 text-[11px] font-medium text-zinc-600 shadow-[0_1px_2px_rgb(0_0_0/0.06)] ring-1 ring-black/[0.06] outline-none transition-colors hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-sky-400 dark:bg-white/[0.05] dark:text-zinc-300 dark:shadow-none dark:ring-white/10 dark:hover:text-white"
          >
            <span className="relative flex h-2 w-2">
              {live && !reduced && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />}
              <span className={cn('relative h-2 w-2 rounded-full', live ? 'bg-emerald-500' : 'bg-zinc-400 dark:bg-zinc-600')} />
            </span>
            {live ? 'Live' : 'Paused'}
          </button>
        </div>
      )}

      <LayoutGroup>
        <ol
          aria-label={title}
          className="relative flex flex-col gap-2 pb-2 [mask-image:linear-gradient(to_bottom,black_58%,transparent_100%)]"
        >
          {shown.map((row, i) => {
            const leader = i === 0
            const delta = deltas[row.id]
            return (
              <motion.li
                key={row.id}
                layout="position"
                transition={layoutT}
                tabIndex={0}
                aria-label={`Rank ${i + 1}, ${row.name}, level ${row.level ?? 1}, ${currency}${fmt(row.score)}`}
                className="group relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <div
                  className={cn(
                    'relative flex h-14 items-center gap-3 rounded-full pl-2 pr-4 transition-[transform,box-shadow,background-color] duration-200 group-hover:-translate-y-0.5',
                    leader
                      ? 'text-white'
                      : 'bg-white/75 text-zinc-900 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_20px_-14px_rgb(15_23_42/0.25)] ring-1 ring-black/[0.05] backdrop-blur group-hover:bg-white group-hover:shadow-[0_12px_28px_-14px_rgb(15_23_42/0.35)] dark:bg-white/[0.035] dark:text-white dark:shadow-none dark:ring-white/[0.08] dark:group-hover:bg-white/[0.06]',
                  )}
                >
                  {leader && (
                    <motion.span
                      layoutId="glow-leaderboard-leader"
                      transition={layoutT}
                      aria-hidden
                      className="absolute inset-0 -z-0 rounded-full bg-[linear-gradient(100deg,#38bdf8,#2563eb_55%,#4f46e5)] shadow-[0_10px_30px_-8px_rgb(37_99_235/0.55),inset_0_1px_0_rgb(255_255_255/0.35)] ring-1 ring-white/30 dark:shadow-[0_0_44px_-6px_rgb(56_189_248/0.65),inset_0_1px_0_rgb(255_255_255/0.35)]"
                    >
                      {!reduced && (
                        <motion.span
                          className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent"
                          animate={{ left: ['-35%', '110%'] }}
                          transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.6, ease: 'easeInOut' }}
                        />
                      )}
                    </motion.span>
                  )}
                  <span className={cn('relative w-5 text-center text-xs font-semibold tabular-nums', leader ? 'text-white/90' : 'text-zinc-400 dark:text-zinc-400')}>
                    {leader ? <Crown className="mx-auto h-4 w-4" /> : i + 1}
                  </span>
                  <span className="relative">
                    <Avatar item={row} />
                  </span>
                  <span className="relative min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold tracking-tight">{row.name}</span>
                    <span className={cn('text-[11px] font-medium', leader ? 'text-sky-100' : 'text-zinc-500 dark:text-zinc-400')}>
                      Level {row.level ?? 1}
                    </span>
                  </span>
                  <span
                    className={cn(
                      'relative flex items-center gap-1 text-sm font-semibold',
                      leader ? 'text-white' : 'text-emerald-600 dark:text-emerald-400',
                    )}
                  >
                    <TrendingUp className="h-3.5 w-3.5 opacity-70" />
                    <RollingAmount value={row.score} prefix={currency} reduced={reduced} />
                    <AnimatePresence>
                      {delta && !reduced && (
                        <motion.span
                          key={delta.key}
                          initial={{ opacity: 0, y: 6, scale: 0.8 }}
                          animate={{ opacity: [0, 1, 1, 0], y: [6, -14, -18, -26], scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.5, times: [0, 0.2, 0.75, 1], ease: 'easeOut' }}
                          className={cn(
                            'pointer-events-none absolute -top-1 right-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                            leader ? 'bg-white text-blue-600' : 'bg-emerald-700 text-white',
                          )}
                        >
                          +{fmt(delta.amount)}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </div>
              </motion.li>
            )
          })}
        </ol>
      </LayoutGroup>
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </div>
  )
}
