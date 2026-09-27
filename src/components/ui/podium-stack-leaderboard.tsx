import * as React from 'react'
import { animate, motion, useInView, useMotionValue, useTransform } from 'motion/react'
import { ArrowUp, Shuffle, Sparkles } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useResolvedTheme } from '@/lib/use-resolved-theme'

export type PodiumItem = {
  id: string
  name: string
  points: number
  /** Small line under the name. */
  note?: string
  /** Optional avatar URL; falls back to gradient initials. */
  src?: string
  hue?: number
}

export type PodiumStackLeaderboardProps = {
  items?: PodiumItem[]
  title?: string
  /** Cards visible in the stack (the last one is faded). */
  visible?: number
  /** Shuffle a rank on an interval. */
  autoShuffle?: boolean
  /** Milliseconds between automatic promotions. */
  interval?: number
  /** Show the header with the shuffle button. */
  showHeader?: boolean
  onRankChange?: (items: PodiumItem[]) => void
  className?: string
}

export const DEFAULT_PODIUM_ITEMS: PodiumItem[] = [
  { id: 'sol', name: 'Solenne Ward', points: 9840, note: '14-day streak', hue: 38 },
  { id: 'ike', name: 'Ikaika Moss', points: 9215, note: 'Most helpful', hue: 205 },
  { id: 'dara', name: 'Dara Okafor', points: 8760, note: 'Rising fast', hue: 12 },
  { id: 'lin', name: 'Linnea Park', points: 8120, note: 'Consistent', hue: 280 },
  { id: 'rue', name: 'Rue Castillo', points: 7690, note: 'New this week', hue: 150 },
]

type Medal = { bg: string; text: string; sub: string; badge: string; badgeText: string; shadow: string; on: number }

const MEDALS: Medal[] = [
  {
    bg: 'linear-gradient(135deg, rgb(254, 243, 160) 0%, rgb(247, 185, 45) 48%, rgb(190, 110, 14) 100%)',
    text: 'rgb(66, 32, 6)',
    sub: 'rgb(120, 64, 10)',
    badge: 'rgb(255, 251, 230)',
    badgeText: 'rgb(161, 98, 7)',
    shadow: '0px 22px 44px -18px rgba(245, 158, 11, 0.7)',
    on: 1,
  },
  {
    bg: 'linear-gradient(135deg, rgb(250, 251, 253) 0%, rgb(205, 214, 226) 48%, rgb(128, 141, 162) 100%)',
    text: 'rgb(30, 41, 59)',
    sub: 'rgb(71, 85, 105)',
    badge: 'rgb(255, 255, 255)',
    badgeText: 'rgb(71, 85, 105)',
    shadow: '0px 18px 36px -18px rgba(100, 116, 139, 0.6)',
    on: 1,
  },
  {
    bg: 'linear-gradient(135deg, rgb(255, 214, 170) 0%, rgb(214, 122, 62) 48%, rgb(124, 52, 20) 100%)',
    text: 'rgb(255, 247, 237)',
    sub: 'rgb(255, 222, 196)',
    badge: 'rgb(255, 237, 213)',
    badgeText: 'rgb(154, 52, 18)',
    shadow: '0px 18px 36px -18px rgba(194, 65, 12, 0.6)',
    on: 1,
  },
]
const PLAIN: Medal = {
  bg: 'linear-gradient(135deg, rgb(148, 163, 184) 0%, rgb(100, 116, 139) 48%, rgb(71, 85, 105) 100%)',
  text: 'rgb(0, 0, 0)',
  sub: 'rgb(0, 0, 0)',
  badge: 'rgb(0, 0, 0)',
  badgeText: 'rgb(0, 0, 0)',
  shadow: '0px 10px 24px -18px rgba(15, 23, 42, 0.4)',
  on: 0,
}
const ROT = [0, -2.6, 2, -1.4, 1]
const fmt = (n: number) => Math.round(n).toLocaleString('en-US')

function Points({ value, reduced }: { value: number; reduced: boolean }) {
  const mv = useMotionValue(value)
  const text = useTransform(mv, (v) => fmt(v))
  React.useEffect(() => {
    if (reduced) return void mv.set(value)
    const c = animate(mv, value, { duration: 1, ease: [0.22, 1, 0.36, 1] })
    return () => c.stop()
  }, [value, mv, reduced])
  return <motion.span className="tabular-nums">{text}</motion.span>
}

function Star({ className, delay, animated }: { className: string; delay: number; animated: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn('pointer-events-none absolute text-amber-300 drop-shadow-[0_0_6px_rgb(252_211_77/0.9)]', className)}
      animate={animated ? { scale: [0.2, 1, 0.2], opacity: [0, 1, 0], rotate: [0, 90] } : { scale: 0.8, opacity: 0.9 }}
      transition={animated ? { duration: 1.8, repeat: Infinity, delay, ease: 'easeInOut' } : undefined}
    >
      <path fill="currentColor" d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0Z" />
    </motion.svg>
  )
}

/**
 * Podium Stack Leaderboard — gold, silver and bronze cards stacked like a
 * hand of trophies. A shimmer sweeps the gold card, sparkles twinkle, and
 * promoting someone lifts their card, swings it past its rival and re-stacks
 * the pile while the medal finishes morph into their new rank.
 */
export function PodiumStackLeaderboard({
  items = DEFAULT_PODIUM_ITEMS,
  title = 'Hall of fame',
  visible = 4,
  autoShuffle = true,
  interval = 3800,
  showHeader = true,
  onRankChange,
  className,
}: PodiumStackLeaderboardProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const inView = useInView(ref, { margin: '60px' })
  const dark = useResolvedTheme(ref) === 'dark'
  const plainText = dark ? 'rgb(250, 250, 250)' : 'rgb(24, 24, 27)'
  const plainSub = dark ? 'rgb(161, 161, 170)' : 'rgb(113, 113, 122)'
  const plainPts = dark ? 'rgb(228, 228, 231)' : 'rgb(63, 63, 70)'
  const [list, setList] = React.useState(() => [...items].sort((a, b) => b.points - a.points))
  const [swap, setSwap] = React.useState<{ up: string; down: string; key: number } | null>(null)
  const [paused, setPaused] = React.useState(false)
  const [announce, setAnnounce] = React.useState('')
  const listRef = React.useRef(list)
  listRef.current = list

  React.useEffect(() => {
    setList([...items].sort((a, b) => b.points - a.points))
  }, [items])

  const promote = React.useCallback(
    (rank: number) => {
      const cur = listRef.current
      if (rank <= 0 || rank >= cur.length) return
      const next = cur.map((c) => ({ ...c }))
      const up = next[rank]
      const down = next[rank - 1]
      up.points = down.points + 40 + Math.round(Math.random() * 360)
      next[rank - 1] = up
      next[rank] = down
      setList(next)
      setSwap({ up: up.id, down: down.id, key: Date.now() })
      setAnnounce(`${up.name} moves up to rank ${rank}`)
      onRankChange?.(next)
    },
    [onRankChange],
  )

  React.useEffect(() => {
    if (!swap) return
    const t = window.setTimeout(() => setSwap(null), 850)
    return () => window.clearTimeout(t)
  }, [swap])

  React.useEffect(() => {
    if (!autoShuffle || reduced || !inView || paused) return
    const id = window.setInterval(() => {
      if (document.hidden) return
      const max = Math.min(listRef.current.length - 1, visible)
      const rank = 1 + Math.floor(Math.random() ** 1.4 * max)
      promote(rank)
    }, interval)
    return () => window.clearInterval(id)
  }, [autoShuffle, reduced, inView, paused, interval, visible, promote])

  const cardH = 84
  const step = 62
  const stageH = cardH + (visible - 1) * step + 36

  return (
    <div
      ref={ref}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setPaused(false)}
      className={cn(
        'relative w-full max-w-sm rounded-3xl bg-[radial-gradient(120%_80%_at_50%_0%,#fffaf0,#f3f1ec)] p-5 ring-1 ring-black/[0.06] dark:bg-[radial-gradient(120%_80%_at_50%_0%,#1a150d,#09090b)] dark:ring-white/[0.07]',
        className,
      )}
    >
      {showHeader && (
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">{title}</p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Tap a card to promote it</p>
          </div>
          <button
            type="button"
            onClick={() => promote(1 + Math.floor(Math.random() * Math.min(list.length - 1, visible)))}
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white px-3 text-[11px] font-medium text-zinc-700 shadow-[0_1px_2px_rgb(0_0_0/0.06)] ring-1 ring-black/[0.06] outline-none transition-transform hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-amber-400 active:translate-y-0 dark:bg-white/[0.06] dark:text-zinc-200 dark:shadow-none dark:ring-white/10"
          >
            <Shuffle className="h-3.5 w-3.5" /> Shuffle
          </button>
        </div>
      )}

      <ol aria-label={title} className="relative" style={{ height: stageH }}>
        {list.map((item, r) => {
          const shown = r < visible
          const medal = MEDALS[r] ?? PLAIN
          const isUp = swap?.up === item.id
          const isDown = swap?.down === item.id
          const y = 28 + Math.min(r, visible) * step
          const scale = 1 - Math.min(r, visible) * 0.045
          const rotate = ROT[Math.min(r, ROT.length - 1)]
          const opacity = !shown ? 0 : r === visible - 1 ? 0.55 : 1
          const target =
            isUp && !reduced
              ? { y: [null, y - 34, y], x: [null, 34, 0], rotate: [null, 8, rotate], scale: [null, scale * 1.07, scale], opacity }
              : isDown && !reduced
                ? { y: [null, y + 8, y], x: [null, -22, 0], rotate: [null, -6, rotate], scale, opacity }
                : { y, x: 0, rotate, scale, opacity }
          const swapT = { duration: 0.8, times: [0, 0.45, 1], ease: 'easeInOut' as const }
          const hue = item.hue ?? 30
          return (
            <motion.li
              key={item.id}
              className="absolute inset-x-0 top-0"
              style={{ zIndex: isUp ? 60 : 50 - r, height: cardH, transformOrigin: '50% 0%' }}
              initial={reduced ? false : { y: -200, opacity: 0, rotate: (r % 2 ? -1 : 1) * 14, scale: 0.9 }}
              animate={target}
              transition={
                isUp || isDown
                  ? swapT
                  : { type: 'spring', stiffness: 260, damping: 22, delay: swap || reduced ? 0 : 0.1 + (visible - r) * 0.12 }
              }
              aria-hidden={!shown || undefined}
            >
              <button
                type="button"
                disabled={r === 0 || !shown}
                tabIndex={shown ? 0 : -1}
                onClick={() => promote(r)}
                aria-label={`Rank ${r + 1}: ${item.name}, ${fmt(item.points)} points${r > 0 ? '. Promote' : ''}`}
                className="group relative flex h-full w-full items-center gap-3 rounded-2xl bg-white px-4 text-left text-zinc-900 shadow-[0_1px_2px_rgb(0_0_0/0.05)] ring-1 ring-black/[0.06] outline-none transition-transform duration-200 enabled:hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-default dark:bg-zinc-900 dark:text-white dark:ring-white/10"
              >
                {/* medal finish */}
                <motion.span
                  aria-hidden
                  className="absolute inset-0 overflow-hidden rounded-2xl"
                  initial={false}
                  animate={{ background: medal.bg, opacity: medal.on, boxShadow: medal.shadow }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgb(255_255_255/0.6),inset_0_-10px_20px_rgb(0_0_0/0.08)]" />
                  {r === 0 && !reduced && inView && (
                    <motion.span
                      className="absolute inset-y-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent"
                      initial={{ left: '-60%' }}
                      animate={{ left: ['-60%', '130%'] }}
                      transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 2.2, ease: 'easeInOut', delay: 0.9 }}
                    />
                  )}
                </motion.span>
                {/* glowing top edge */}
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 -top-px"
                  animate={{ opacity: r === 0 ? 1 : 0 }}
                >
                  <span className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                  <span className="absolute inset-x-10 -top-3 h-6 rounded-full bg-amber-300/60 blur-xl dark:bg-amber-300/70" />
                </motion.span>
                {r === 0 && (
                  <>
                    <Star className="-top-3 right-10 h-4 w-4" delay={0} animated={!reduced && inView} />
                    <Star className="-top-5 right-20 h-2.5 w-2.5" delay={0.7} animated={!reduced && inView} />
                    <Star className="top-2 -left-2 h-3 w-3" delay={1.2} animated={!reduced && inView} />
                  </>
                )}

                <motion.span
                  className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ring-1 ring-black/5 dark:ring-white/10"
                  initial={false}
                  animate={medal.on ? { backgroundColor: medal.badge, color: medal.badgeText } : { backgroundColor: 'rgba(120, 120, 130, 0.14)', color: 'rgba(120, 120, 130, 1)' }}
                  transition={{ duration: 0.5 }}
                >
                  {r + 1}
                </motion.span>
                <span
                  className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full text-xs font-semibold text-white ring-2 ring-white/70 dark:ring-white/20"
                  style={{ background: `linear-gradient(140deg, hsl(${hue} 85% 64%), hsl(${hue + 35} 75% 40%))` }}
                >
                  {item.src ? <img src={item.src} alt="" className="h-full w-full object-cover" /> : item.name.split(' ').map((p) => p[0]).join('').slice(0, 2)}
                </span>
                <motion.span className="relative min-w-0 flex-1" initial={false} animate={{ color: medal.on ? medal.text : plainText }}>
                  <span className="block truncate text-sm font-semibold tracking-tight">{item.name}</span>
                  <motion.span
                    className="block truncate text-[11px] font-medium"
                    initial={false}
                    animate={{ color: medal.on ? medal.sub : plainSub }}
                  >
                    {item.note}
                  </motion.span>
                </motion.span>
                <motion.span
                  className="relative flex items-center gap-1 text-sm font-bold"
                  initial={false}
                  animate={{ color: medal.on ? medal.text : plainPts }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <Points value={item.points} reduced={reduced} />
                  <span className="text-[10px] font-semibold opacity-70">pts</span>
                </motion.span>
                {r > 0 && shown && (
                  <span className="pointer-events-none absolute -right-1.5 -top-1.5 grid h-5 w-5 scale-75 place-items-center rounded-full bg-zinc-900 text-white opacity-0 shadow transition-all group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 dark:bg-white dark:text-zinc-900">
                    <ArrowUp className="h-3 w-3" />
                  </span>
                )}
              </button>
            </motion.li>
          )
        })}
      </ol>
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </div>
  )
}
