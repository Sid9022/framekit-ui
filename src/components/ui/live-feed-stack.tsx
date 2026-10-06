import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Activity, CalendarDays, ChevronDown, CreditCard, MessageCircle, Pause, Play, Rocket, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type FeedTone = 'violet' | 'orange' | 'emerald' | 'sky' | 'rose' | 'teal'

export type FeedItem = {
  id: string
  app: string
  title: string
  body: string
  icon?: React.ReactNode
  tone?: FeedTone
}

export type LiveFeedStackProps = {
  /** Pool of notifications that arrive in order (and loop). */
  items?: FeedItem[]
  /** ms between arrivals. Clamped 900–20000. */
  interval?: number
  /** Cards shown before older ones fold into the pile. */
  visible?: number
  /** Start streaming immediately. A pause button is always shown. */
  autoPlay?: boolean
  /** Paint the generated wallpaper behind the glass (turn off to sit on your own backdrop). */
  wallpaper?: boolean
  /** Fires when a notification arrives. */
  onArrive?: (item: FeedItem) => void
  className?: string
}

export const DEFAULT_FEED: FeedItem[] = [
  { id: 'deploy', app: 'Deploys', title: 'Production is live', body: '“Faster cold starts” shipped by Mara · built in 41 s', icon: <Rocket />, tone: 'violet' },
  { id: 'review', app: 'Calendar', title: 'Design review in 10 min', body: 'Room 4B · Priya, Mateo and 3 others', icon: <CalendarDays />, tone: 'orange' },
  { id: 'msg', app: 'Messages', title: 'Amara Okafor', body: 'Pushed the new onboarding copy. Can you take a look before 3?', icon: <MessageCircle />, tone: 'emerald' },
  { id: 'paid', app: 'Billing', title: 'Payment received', body: '$2,400.00 from Lumen & Co. · Invoice #1042', icon: <CreditCard />, tone: 'sky' },
  { id: 'signin', app: 'Security', title: 'New sign-in from Lisbon', body: 'Desktop browser · Not you? Review your activity.', icon: <ShieldAlert />, tone: 'rose' },
  { id: 'uptime', app: 'Uptime', title: 'API latency back to normal', body: 'p95 142 ms across 6 regions', icon: <Activity />, tone: 'teal' },
]

const TONES: Record<FeedTone, string> = {
  violet: 'from-violet-500 to-indigo-600',
  orange: 'from-amber-400 to-orange-600',
  emerald: 'from-emerald-400 to-green-600',
  sky: 'from-sky-400 to-blue-600',
  rose: 'from-rose-400 to-red-600',
  teal: 'from-teal-400 to-cyan-600',
}

type Entry = FeedItem & { key: number; at: number }

function ago(ms: number) {
  const s = Math.floor(ms / 1000)
  if (s < 10) return 'now'
  if (s < 60) return `${s}s ago`
  return `${Math.floor(s / 60)}m ago`
}

/**
 * Live Feed Stack — a notification centre on glass. New alerts drop in at the top on a crisp spring, the list makes
 * room with a layout animation, and anything older than the first few folds into a soft pile you can expand.
 * Relative times tick, each arrival is announced politely, and the stream can be paused.
 */
export function LiveFeedStack({
  items = DEFAULT_FEED,
  interval = 2600,
  visible = 3,
  autoPlay = true,
  wallpaper = true,
  onArrive,
  className,
}: LiveFeedStackProps) {
  const reduced = usePrefersReducedMotion()
  const [feed, setFeed] = React.useState<Entry[]>(() => {
    const now = Date.now()
    return items.slice(0, 2).map((it, i) => ({ ...it, key: i, at: now - (i ? 0 : 74_000) })).reverse()
  })
  const [playing, setPlaying] = React.useState(autoPlay)
  const [expanded, setExpanded] = React.useState(false)
  const [now, setNow] = React.useState(() => Date.now())
  const [announce, setAnnounce] = React.useState('')
  const cursor = React.useRef(2)
  const keyRef = React.useRef(2)
  const onArriveRef = React.useRef(onArrive)
  onArriveRef.current = onArrive
  const gap = Math.min(20000, Math.max(900, interval))

  React.useEffect(() => {
    if (!playing || !items.length) return
    const t = window.setInterval(() => {
      const it = items[cursor.current % items.length]
      cursor.current += 1
      const entry: Entry = { ...it, key: keyRef.current++, at: Date.now() }
      setFeed((f) => [entry, ...f].slice(0, 10))
      setAnnounce(`${it.app}: ${it.title}`)
      onArriveRef.current?.(it)
    }, gap)
    return () => window.clearInterval(t)
  }, [playing, items, gap])

  React.useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 5000)
    return () => window.clearInterval(t)
  }, [])

  const shown = expanded ? feed.slice(0, 6) : feed.slice(0, visible)
  const hidden = feed.length - shown.length
  const spring = { type: 'spring' as const, stiffness: 420, damping: 34, mass: 0.8 }

  return (
    <div
      className={cn(
        'relative isolate w-full max-w-[400px] overflow-hidden rounded-[32px] p-3 ring-1 ring-black/[0.06] sm:p-4 dark:ring-white/[0.08]',
        wallpaper && 'bg-[#eef0f6] dark:bg-[#0d0d14]',
        className,
      )}
    >
      {wallpaper && (
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute -left-16 -top-10 h-64 w-64 rounded-full bg-[#b9a6e0] opacity-70 blur-3xl dark:bg-[#4b3a78] dark:opacity-80" />
          <div className="absolute -right-10 top-24 h-56 w-56 rounded-full bg-[#ffc59a] opacity-70 blur-3xl dark:bg-[#7a3a1c] dark:opacity-60" />
          <div className="absolute -bottom-16 left-10 h-64 w-64 rounded-full bg-[#9cc9f5] opacity-60 blur-3xl dark:bg-[#1d3f6e] dark:opacity-70" />
        </div>
      )}

      <div className="mb-3 flex items-center justify-between px-1.5">
        <p className="text-[13px] font-semibold tracking-tight text-zinc-900 dark:text-white">
          Notifications <span className="ml-1 font-normal tabular-nums text-zinc-700 dark:text-zinc-300">{feed.length}</span>
        </p>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pause live notifications' : 'Resume live notifications'}
          className="grid h-11 w-11 place-items-center rounded-full bg-white/50 text-zinc-800 ring-1 ring-black/[0.06] backdrop-blur-md transition-[background-color,transform] duration-150 hover:bg-white/80 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-600 dark:bg-white/10 dark:text-zinc-100 dark:ring-white/10 dark:hover:bg-white/15 dark:focus-visible:ring-signal-300"
        >
          {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
        </button>
      </div>

      <ol aria-label="Recent notifications" className="relative flex min-h-[372px] flex-col gap-2">
        <AnimatePresence initial={false} mode="popLayout">
          {shown.map((e) => (
            <motion.li
              key={e.key}
              layout={!reduced}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: -24, scale: 0.94, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8, filter: 'blur(4px)', transition: { duration: 0.2 } }}
              transition={reduced ? { duration: 0.15 } : spring}
              className={cn(
                'flex items-start gap-3 rounded-[22px] bg-white/70 p-3 pr-4 ring-1 ring-black/[0.05] backdrop-blur-xl backdrop-saturate-150',
                'shadow-[inset_0_1px_0_rgb(255_255_255/0.7),0_1px_2px_rgb(0_0_0/0.04),0_12px_28px_-16px_rgb(24_24_27/0.35)]',
                'dark:bg-zinc-900/65 dark:ring-white/[0.08] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.07),0_12px_28px_-16px_rgb(0_0_0/0.8)]',
              )}
            >
              <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-[11px] bg-gradient-to-b text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35)] [&_svg]:h-5 [&_svg]:w-5', TONES[e.tone ?? 'violet'])} aria-hidden>
                {e.icon ?? <Activity />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-600 dark:text-zinc-400">{e.app}</p>
                  <time className="shrink-0 text-[11px] tabular-nums text-zinc-600 dark:text-zinc-400" dateTime={new Date(e.at).toISOString()}>{ago(now - e.at)}</time>
                </div>
                <p className="mt-0.5 truncate text-sm font-semibold tracking-tight text-zinc-950 dark:text-white">{e.title}</p>
                <p className="line-clamp-2 text-[13px] leading-snug text-zinc-700 dark:text-zinc-300">{e.body}</p>
              </div>
            </motion.li>
          ))}
          {(hidden > 0 || expanded) && (
            <motion.li key="pile" layout={!reduced} transition={reduced ? { duration: 0.15 } : spring} className="relative">
              {!expanded && (
                <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-2 flex flex-col items-center">
                  <div className="h-2.5 w-[94%] rounded-b-[16px] bg-white/50 ring-1 ring-black/[0.04] backdrop-blur-md dark:bg-zinc-900/50 dark:ring-white/[0.06]" />
                  <div className="h-2.5 w-[86%] rounded-b-[14px] bg-white/35 ring-1 ring-black/[0.03] backdrop-blur-md dark:bg-zinc-900/35 dark:ring-white/[0.04]" />
                </div>
              )}
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setExpanded((x) => !x)}
                className="relative mx-auto mt-4 flex min-h-11 items-center gap-1.5 rounded-full bg-white/55 px-4 text-[13px] font-medium text-zinc-800 ring-1 ring-black/[0.06] backdrop-blur-md transition-[background-color,transform] duration-150 hover:bg-white/80 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-600 dark:bg-white/10 dark:text-zinc-100 dark:ring-white/10 dark:hover:bg-white/15 dark:focus-visible:ring-signal-300"
              >
                {expanded ? 'Show less' : <span className="tabular-nums">{hidden} older</span>}
                <ChevronDown aria-hidden className={cn('h-4 w-4 transition-transform duration-200', expanded && 'rotate-180')} />
              </button>
            </motion.li>
          )}
        </AnimatePresence>
      </ol>
      <p role="status" aria-live="polite" className="sr-only">{announce}</p>
    </div>
  )
}
