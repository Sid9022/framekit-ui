import * as React from 'react'
import { animate, motion, useMotionValue, useTransform, type MotionValue } from 'motion/react'
import { Bookmark, Check, ChevronDown, Loader2, MapPin, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type OrigamiStop = { name: string; time: string }

export type OrigamiUnfoldCardProps = {
  title?: string
  subtitle?: string
  tag?: string
  /** Optional cover image; a generated dawn-ridge illustration is used otherwise. */
  src?: string
  stops?: OrigamiStop[]
  stats?: { label: string; value: string }[]
  actionLabel?: string
  /** Async action on the last panel; reject / return false to show the retry state. */
  onAction?: () => void | boolean | Promise<void | boolean>
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

const H = 176
const W = 320
const DEFAULT_STOPS: OrigamiStop[] = [
  { name: 'Trailhead', time: '07:30' },
  { name: 'Footbridge', time: '08:05' },
  { name: 'Lookout', time: '08:50' },
  { name: 'Lakeside', time: '09:40' },
]
const DEFAULT_STATS = [
  { label: 'Distance', value: '6.2 km' },
  { label: 'Climb', value: '410 m' },
  { label: 'Pace', value: 'Easy' },
]
const ROUTE = 'M36 128 C 60 118, 70 92, 96 88 S 132 104, 150 78 S 170 30, 206 38 S 250 70, 284 44'
const PINS = [
  [36, 128],
  [96, 88],
  [206, 38],
  [284, 44],
]

function Face({ className, children, back, shade }: { className?: string; children?: React.ReactNode; back?: boolean; shade?: MotionValue<number> }) {
  return (
    <div
      className={cn('absolute inset-0 overflow-hidden [backface-visibility:hidden]', back && '[transform:rotateX(180deg)]', className)}
    >
      {children}
      {shade && <motion.div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 to-black/10" style={{ opacity: shade }} />}
    </div>
  )
}

/**
 * Origami Unfold Card — a trail ticket that unfolds like a paper map. The
 * cover panel is the button; press it and a second panel swings down on its
 * crease, then a third, each catching light as it flattens. The route draws
 * itself across the map and the last panel carries an async action.
 */
export function OrigamiUnfoldCard({
  title = 'Cedar Ridge Loop',
  subtitle = 'Sat, Oct 18 · 07:30 start',
  tag = 'Trail 04',
  src,
  stops = DEFAULT_STOPS,
  stats = DEFAULT_STATS,
  actionLabel = 'Save to trail log',
  onAction,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
}: OrigamiUnfoldCardProps) {
  const reduced = usePrefersReducedMotion()
  const [innerOpen, setInnerOpen] = React.useState(defaultOpen)
  const open = openProp ?? innerOpen
  const [action, setAction] = React.useState<'idle' | 'busy' | 'done' | 'error'>('idle')
  const id = React.useId()
  const CLOSED2 = -179.4
  const CLOSED3 = 179.4
  const a2 = useMotionValue(defaultOpen ? 0 : CLOSED2)
  const a3 = useMotionValue(defaultOpen ? 0 : CLOSED3)
  const height = useMotionValue(defaultOpen ? H * 3 : H)
  const shade2 = useTransform(a2, (v) => Math.min(1, Math.abs(v) / 110))
  const shade3 = useTransform(a3, (v) => Math.min(1, Math.abs(v) / 110))
  const light2 = useTransform(a2, (v) => {
    const k = Math.abs(v)
    return k > 20 && k < 150 ? (1 - Math.abs(k - 85) / 65) * 0.35 : 0
  })
  const [drawn, setDrawn] = React.useState(defaultOpen)

  React.useEffect(() => {
    const spring = { type: 'spring' as const, stiffness: 60, damping: 12, mass: 1 }
    if (reduced) {
      a2.set(open ? 0 : CLOSED2)
      a3.set(open ? 0 : CLOSED3)
      height.set(open ? H * 3 : H)
      setDrawn(open)
      return
    }
    const ctrls = open
      ? [
          animate(height, H * 3, { duration: 1.1, ease: [0.3, 0.9, 0.3, 1] }),
          animate(a2, 0, spring),
          animate(a3, 0, { ...spring, delay: 0.45 }),
        ]
      : [
          animate(a3, CLOSED3, { duration: 0.45, ease: [0.5, 0, 0.7, 0.4] }),
          animate(a2, CLOSED2, { duration: 0.5, ease: [0.5, 0, 0.7, 0.4], delay: 0.3 }),
          animate(height, H, { duration: 0.6, ease: [0.5, 0, 0.3, 1], delay: 0.3 }),
        ]
    const t = window.setTimeout(() => setDrawn(open), open ? 800 : 0)
    return () => {
      ctrls.forEach((c) => c.stop())
      clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reduced])

  const toggle = () => {
    const next = !open
    if (openProp === undefined) setInnerOpen(next)
    onOpenChange?.(next)
  }

  const run = async () => {
    if (action === 'busy') return
    if (action === 'done') return setAction('idle')
    setAction('busy')
    try {
      const r = await (onAction ? onAction() : new Promise((res) => setTimeout(res, 1200)))
      setAction(r === false ? 'error' : 'done')
    } catch {
      setAction('error')
    }
  }

  return (
    <motion.div
      className={cn('relative [perspective:1100px]', className)}
      style={{ width: W, height, maxWidth: '100%' }}
    >
      {/* panel 1 · cover */}
      <div className="relative [transform-style:preserve-3d]" style={{ height: H }}>
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls={id}
          className="group absolute inset-0 z-10 overflow-hidden rounded-t-[20px] text-left outline-none ring-1 ring-black/[0.08] focus-visible:ring-2 focus-visible:ring-emerald-500 dark:ring-white/10"
          style={{ borderBottomLeftRadius: open ? 0 : 20, borderBottomRightRadius: open ? 0 : 20, transition: 'border-radius 300ms' }}
        >
          {src ? (
            <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <svg viewBox="0 0 320 168" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
              <defs>
                <linearGradient id={id + 'sky'} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#ffd9b5" />
                  <stop offset="1" stopColor="#f7a98b" />
                </linearGradient>
              </defs>
              <rect width="320" height="168" fill={`url(#${id}sky)`} />
              <circle cx="228" cy="70" r="30" fill="#fff4dc" opacity="0.9" />
              <path d="M0 110 L50 72 L92 98 L140 58 L196 102 L250 70 L320 104 V168 H0Z" fill="#d9856f" opacity="0.7" />
              <path d="M0 132 L60 100 L120 124 L180 92 L240 126 L320 106 V168 H0Z" fill="#9c5a5a" opacity="0.85" />
              <path d="M0 152 L40 136 L64 146 L110 124 L150 148 L210 130 L262 150 L320 136 V168 H0Z" fill="#4c3346" />
              {[40, 70, 262, 290].map((x, i) => (
                <path key={i} d={`M${x} 150 l6 -18 l6 18 Z`} fill="#2f2233" />
              ))}
            </svg>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-white/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-800 backdrop-blur">
            {tag}
          </span>
          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white">
            <div>
              <div className="font-display text-[26px] leading-none tracking-tight">{title}</div>
              <div className="mt-1.5 text-xs text-white/80">{subtitle}</div>
            </div>
            <span className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-white/15 pl-3 pr-2 text-[11px] font-medium ring-1 ring-white/30 backdrop-blur transition group-hover:bg-white/25">
              {open ? 'Fold' : 'Unfold'}
              <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <ChevronDown className="h-4 w-4" />
              </motion.span>
            </span>
          </div>
        </button>

        {/* panel 2 · map */}
        <motion.div
          id={id}
          role="region"
          aria-label={`${title} route`}
          aria-hidden={!open}
          className="absolute left-0 top-full w-full [transform-origin:50%_0%] [transform-style:preserve-3d]"
          style={{ height: H, rotateX: a2 }}
        >
          <Face className="bg-[#f6f1e7] dark:bg-[#17181c]" shade={shade2}>
            <svg viewBox="0 0 320 168" className="absolute inset-0 h-full w-full" aria-hidden>
              <defs>
                <pattern id={id + 'grid'} width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M20 0H0V20" fill="none" className="stroke-black/[0.05] dark:stroke-white/[0.05]" />
                </pattern>
              </defs>
              <rect width="320" height="168" fill={`url(#${id}grid)`} />
              {[0, 1, 2, 3, 4].map((i) => (
                <ellipse key={i} cx="210" cy="46" rx={24 + i * 22} ry={14 + i * 14} fill="none" className="stroke-emerald-700/15 dark:stroke-emerald-300/15" strokeWidth="1" />
              ))}
              {[0, 1, 2].map((i) => (
                <ellipse key={'b' + i} cx="70" cy="140" rx={20 + i * 18} ry={10 + i * 9} fill="none" className="stroke-emerald-700/10 dark:stroke-emerald-300/10" />
              ))}
              <path d="M0 150 C 60 140, 120 160, 180 148 S 280 150, 320 140" fill="none" className="stroke-sky-400/40" strokeWidth="6" strokeLinecap="round" />
              <path d={ROUTE} fill="none" className="stroke-black/10 dark:stroke-white/10" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 7" />
              <motion.path
                d={ROUTE}
                fill="none"
                stroke="#e0664f"
                strokeWidth="3"
                strokeLinecap="round"
                initial={false}
                animate={{ pathLength: drawn ? 1 : 0 }}
                transition={reduced ? { duration: 0 } : { duration: 1.4, ease: [0.45, 0, 0.2, 1] }}
              />
              {PINS.map(([x, y], i) => (
                <motion.g
                  key={i}
                  initial={false}
                  animate={{ scale: drawn ? 1 : 0, opacity: drawn ? 1 : 0 }}
                  transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 16, delay: drawn ? 0.2 + i * 0.32 : 0 }}
                  style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
                >
                  <circle cx={x} cy={y} r="6.5" fill="white" className="dark:fill-zinc-900" stroke="#e0664f" strokeWidth="2.5" />
                  <circle cx={x} cy={y} r="2.2" fill="#e0664f" />
                </motion.g>
              ))}
            </svg>
            <span className="absolute left-4 top-3 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">1 : 25 000</span>
            <span className="absolute right-4 top-3 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">N ↑</span>
            <motion.div className="pointer-events-none absolute inset-0 bg-white" style={{ opacity: light2 }} />
          </Face>
          <Face back className="bg-[#e9e2d4] dark:bg-[#222329]">
            <div className="absolute inset-0 opacity-50 [background-image:repeating-linear-gradient(45deg,rgb(0_0_0/0.05)_0_2px,transparent_2px_10px)]" />
          </Face>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-black/10 dark:bg-white/10" />

          {/* panel 3 · details */}
          <motion.div
            className="absolute left-0 top-full w-full [transform-origin:50%_0%] [transform-style:preserve-3d]"
            style={{ height: H, rotateX: a3 }}
          >
            <Face className="rounded-b-[20px] bg-white dark:bg-zinc-900" shade={shade3}>
              <div className="flex h-full flex-col px-4 pb-4 pt-3">
                <ol className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {stops.slice(0, 4).map((s, i) => (
                    <motion.li
                      key={s.name}
                      className="flex items-center gap-2 text-[12px] text-zinc-700 dark:text-zinc-300"
                      initial={false}
                      animate={{ opacity: drawn ? 1 : 0, x: drawn || reduced ? 0 : -6 }}
                      transition={{ delay: drawn ? 0.5 + i * 0.08 : 0 }}
                    >
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[#e0664f]" />
                      <span className="truncate">{s.name}</span>
                      <span className="ml-auto font-mono text-[10px] text-zinc-400">{s.time}</span>
                    </motion.li>
                  ))}
                </ol>
                <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-dashed border-black/10 pt-3 dark:border-white/10">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <dt className="text-[10px] uppercase tracking-[0.14em] text-zinc-400">{s.label}</dt>
                      <dd className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{s.value}</dd>
                    </div>
                  ))}
                </dl>
                <button
                  type="button"
                  onClick={run}
                  tabIndex={open ? 0 : -1}
                  className={cn(
                    'mt-auto inline-flex h-10 items-center justify-center gap-2 rounded-xl text-[13px] font-medium outline-none transition active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900',
                    action === 'done' ? 'bg-emerald-700 text-white' : action === 'error' ? 'bg-rose-500 text-white' : 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900',
                  )}
                >
                  {action === 'busy' ? <Loader2 className="h-4 w-4 animate-spin" /> : action === 'done' ? <Check className="h-4 w-4" /> : action === 'error' ? <RotateCcw className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                  {action === 'busy' ? 'Saving…' : action === 'done' ? 'Saved to your log' : action === 'error' ? 'Couldn’t save — retry' : actionLabel}
                </button>
                <span className="sr-only" aria-live="polite">
                  {action === 'done' ? 'Saved to your trail log' : action === 'error' ? 'Saving failed. Press to retry.' : ''}
                </span>
              </div>
            </Face>
            <Face back className="rounded-t-[20px] bg-[#e9e2d4] dark:bg-[#222329]">
              <div className="absolute inset-0 opacity-50 [background-image:repeating-linear-gradient(45deg,rgb(0_0_0/0.05)_0_2px,transparent_2px_10px)]" />
            </Face>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-black/10 dark:bg-white/10" />
          </motion.div>
        </motion.div>
      </div>
      {/* drop shadow that grows with the unfold */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-4 bottom-0 -z-10 h-10 translate-y-4 rounded-[50%] bg-black/25 blur-xl dark:bg-black/60"
      />
    </motion.div>
  )
}
