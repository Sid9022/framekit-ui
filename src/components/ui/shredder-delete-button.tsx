import * as React from 'react'
import { AnimatePresence, motion, useAnimate } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Phase = 'idle' | 'open' | 'feed' | 'shred' | 'close' | 'done' | 'jam'
export type ShredderVariant = 'violet' | 'light' | 'danger'

export type ShredderDeleteButtonProps = {
  label?: string
  busyLabel?: string
  doneLabel?: string
  jamLabel?: string
  variant?: ShredderVariant
  /** Number of paper strips (4–9). */
  strips?: number
  /** Show a running “× N” tally after each shred. */
  showCount?: boolean
  /** Deletion work. Rejecting jams the shredder and spits the sheet back out. */
  onDelete?: () => void | Promise<unknown>
  /** Fixed pill width in px — the pill never resizes while it works. */
  width?: number
  /** Delay before the label returns, in ms. */
  resetAfter?: number
  disabled?: boolean
  className?: string
}

const VARIANTS: Record<
  ShredderVariant,
  { base: string; ink: string; paper: string; paperLine: string; strip: string; badge: string; focus: string; offset: string }
> = {
  violet: {
    base: 'bg-[linear-gradient(180deg,#7c5cff,#5b3df0)] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.28),0_1px_2px_rgb(0_0_0/0.35),0_18px_36px_-18px_rgb(91_61_240/0.95)]',
    ink: '#ffffff',
    paper: '#f7f5ff',
    paperLine: '#a594ff',
    strip: '#efeaff',
    badge: 'bg-white/18 text-white',
    focus: 'focus-visible:ring-violet-300',
    offset: 'focus-visible:ring-offset-[#0c0b10]',
  },
  light: {
    base: 'bg-[linear-gradient(180deg,#ffffff,#eeedf2)] text-zinc-800 shadow-[inset_0_1px_0_#fff,0_0_0_1px_rgb(24_24_27/0.08),0_1px_2px_rgb(0_0_0/0.12),0_18px_36px_-20px_rgb(24_24_27/0.55)]',
    ink: '#27272a',
    paper: '#ffffff',
    paperLine: '#a1a1aa',
    strip: '#d4d4d8',
    badge: 'bg-zinc-900/8 text-zinc-600',
    focus: 'focus-visible:ring-zinc-400',
    offset: 'focus-visible:ring-offset-[#0c0b10]',
  },
  danger: {
    base: 'bg-[linear-gradient(180deg,#f0445f,#c81e45)] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.28),0_1px_2px_rgb(0_0_0/0.35),0_18px_36px_-18px_rgb(200_30_69/0.95)]',
    ink: '#ffffff',
    paper: '#fff5f6',
    paperLine: '#fb7185',
    strip: '#ffe1e6',
    badge: 'bg-white/18 text-white',
    focus: 'focus-visible:ring-rose-300',
    offset: 'focus-visible:ring-offset-[#0c0b10]',
  },
}

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

/**
 * Shredder Delete Button — the pill holds still while its icon does the work:
 * the lid flips up, a sheet feeds in, ribbons of paper tumble out below and
 * the lid clicks shut. A jam spits the sheet back out.
 */
export function ShredderDeleteButton({
  label = 'Delete file',
  busyLabel = 'Shredding…',
  doneLabel = 'Shredded',
  jamLabel = 'Jammed — retry',
  variant = 'violet',
  strips = 7,
  showCount = true,
  onDelete,
  resetAfter = 1800,
  width = 208,
  disabled,
  className,
}: ShredderDeleteButtonProps) {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = React.useState<Phase>('idle')
  const [count, setCount] = React.useState(0)
  const [batch, setBatch] = React.useState(0)
  const [scope, animateEl] = useAnimate<HTMLButtonElement>()
  const run = React.useRef(0)
  const v = VARIANTS[variant]
  React.useEffect(() => () => void (run.current += 1), [])

  const n = Math.max(4, Math.min(9, Math.round(strips)))
  const pieces = React.useMemo(() => {
    // deterministic-but-irregular strip physics per batch
    const out: { x: number; w: number; drop: number; drift: number; rot: number; delay: number; len: number }[] = []
    for (let i = 0; i < n; i++) {
      const s = Math.sin((i + 1) * 12.9898 + batch * 78.233) * 43758.5453
      const r = s - Math.floor(s)
      const span = 11
      out.push({
        x: 12 - span / 2 + (span / (n - 1)) * i,
        w: 1.5,
        drop: 15 + r * 10,
        drift: (i - (n - 1) / 2) * 1.1 + (r - 0.5) * 3,
        rot: (r - 0.5) * 70,
        delay: (i % 2 ? 0.05 : 0) + r * 0.12 + i * 0.022,
        len: 5 + r * 3.5,
      })
    }
    return out
  }, [n, batch])

  const busy = phase !== 'idle' && phase !== 'done' && phase !== 'jam'
  const lidOpen = phase === 'open' || phase === 'feed'

  const go = async () => {
    if (busy || disabled) return
    const id = ++run.current
    const alive = () => id === run.current
    let failed = false
    const work = Promise.resolve()
      .then(() => onDelete?.())
      .catch(() => {
        failed = true
      })

    if (reduced) {
      setPhase('shred')
      await Promise.all([work, sleep(500)])
      if (!alive()) return
      if (failed) return setPhase('jam')
      setCount((c) => c + 1)
      setPhase('done')
      await sleep(resetAfter)
      if (alive()) setPhase('idle')
      return
    }

    setPhase('open')
    await sleep(200)
    if (!alive()) return
    setPhase('feed')
    await sleep(420)
    await work
    if (!alive()) return
    if (failed) {
      setPhase('jam')
      if (scope.current) void animateEl(scope.current, { x: [0, -6, 6, -4, 3, 0] }, { duration: 0.42 })
      return
    }
    setBatch((b) => b + 1)
    setPhase('shred')
    await sleep(760)
    if (!alive()) return
    setPhase('close')
    setCount((c) => c + 1)
    await sleep(220)
    if (!alive()) return
    setPhase('done')
    await sleep(resetAfter)
    if (alive()) setPhase('idle')
  }

  const text = phase === 'jam' ? jamLabel : phase === 'done' || phase === 'close' ? doneLabel : busy ? busyLabel : label
  const status =
    phase === 'shred' ? busyLabel : phase === 'done' ? `${doneLabel}. ${count} item${count === 1 ? '' : 's'} removed.` : phase === 'jam' ? 'Delete failed. Press to retry.' : ''

  return (
    <div className={cn('relative inline-flex', className)}>
      <motion.button
        ref={scope}
        type="button"
        onClick={go}
        disabled={disabled}
        aria-busy={busy}
        aria-label={phase === 'jam' ? jamLabel : label}
        whileTap={busy || reduced ? undefined : { scale: 0.97 }}
        style={{ width }}
        className={cn(
          'group relative inline-flex h-12 items-center gap-2.5 rounded-full pl-3.5 pr-5 text-[15px] font-semibold tracking-tight outline-none',
          'focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          v.base,
          v.focus,
          v.offset,
          busy && 'cursor-progress',
        )}
      >
        <span className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(180deg,rgb(255_255_255/0.14),transparent_55%)]" aria-hidden />
        {/* shredder icon */}
        <span className="relative z-10 grid h-7 w-7 shrink-0 place-items-center">
          <motion.svg
            viewBox="0 0 24 24"
            className="h-7 w-7 overflow-visible"
            fill="none"
            stroke={v.ink}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            initial={false}
            animate={phase === 'shred' && !reduced ? { x: [0, -0.6, 0.6, -0.4, 0.5, 0], y: [0, 0.3, -0.2, 0.3, 0] } : { x: 0, y: 0 }}
            transition={phase === 'shred' ? { duration: 0.18, repeat: 3 } : { duration: 0.1 }}
          >
            <defs>
              <clipPath id={`shred-mouth-${variant}`}>
                <rect x={-4} y={-20} width={32} height={29.2} />
              </clipPath>
            </defs>
            {/* sheet feeding in */}
            <g clipPath={`url(#shred-mouth-${variant})`}>
              <AnimatePresence>
                {(phase === 'feed' || phase === 'jam') && !reduced && (
                  <motion.g
                    key={`sheet-${phase}`}
                    initial={phase === 'jam' ? { y: 2 } : { y: -16, rotate: -8, opacity: 0 }}
                    animate={phase === 'jam' ? { y: [2, -9, -6], rotate: [0, 6, 4], opacity: [1, 1, 0] } : { y: [-16, -7, 8], rotate: [-8, 0, 0], opacity: [0, 1, 1] }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    transition={phase === 'jam' ? { duration: 0.9, times: [0, 0.35, 1] } : { duration: 0.42, times: [0, 0.45, 1], ease: ['easeOut', 'easeIn'] }}
                    style={{ transformOrigin: '12px 4px' }}
                  >
                    <path d="M8.2 -1.5h5.6l2 2v6.8H8.2z" fill={v.paper} stroke="none" />
                    <path d="M13.8 -1.5v2h2" stroke={v.paperLine} strokeWidth={0.9} />
                    <path d="M9.6 2.2h4.4M9.6 4h4.4M9.6 5.8h3" stroke={v.paperLine} strokeWidth={0.9} />
                  </motion.g>
                )}
              </AnimatePresence>
            </g>
            {/* lid */}
            <motion.g
              initial={false}
              animate={{ rotate: lidOpen ? -62 : phase === 'close' ? [6, 0] : 0, y: lidOpen ? -1.2 : 0, x: lidOpen ? -0.6 : 0 }}
              transition={lidOpen ? { type: 'spring', stiffness: 520, damping: 15 } : { type: 'spring', stiffness: 900, damping: 20 }}
              style={{ transformBox: 'fill-box', originX: 0.08, originY: 1 }}
            >
              <path d="M4 8.2h16" />
              <path d="M9.5 8.2V6.6a1.2 1.2 0 0 1 1.2-1.2h2.6a1.2 1.2 0 0 1 1.2 1.2v1.6" />
            </motion.g>
            {/* body with feed slot + teeth */}
            <path d="M5.5 11.2h13" strokeOpacity={0.55} strokeWidth={1.4} />
            <path d="M6 8.2l.9 9.4a1.8 1.8 0 0 0 1.8 1.6h6.6a1.8 1.8 0 0 0 1.8-1.6l.9-9.4" />
            <motion.path
              d="M8.6 19.4v1M11 19.4v1M13.4 19.4v1M15.6 19.4v1"
              strokeWidth={1.3}
              initial={false}
              animate={{ opacity: phase === 'shred' ? 1 : 0.0 }}
              transition={{ duration: 0.12 }}
            />
            {/* strips */}
            <AnimatePresence>
              {phase === 'shred' && !reduced &&
                pieces.map((p, i) => (
                  <motion.rect
                    key={`${batch}-${i}`}
                    x={p.x - p.w / 2}
                    y={19.6}
                    width={p.w}
                    height={p.len}
                    rx={0.5}
                    fill={i % 3 === 1 ? v.paperLine : v.strip}
                    stroke="none"
                    initial={{ scaleY: 0, y: 0, x: 0, rotate: 0, opacity: 1 }}
                    animate={{
                      scaleY: [0, 1, 1, 1],
                      y: [0, 1.5, p.drop * 0.55, p.drop],
                      x: [0, 0, p.drift * 0.5, p.drift],
                      rotate: [0, 0, p.rot * 0.4, p.rot],
                      opacity: [1, 1, 0.9, 0],
                    }}
                    transition={{ duration: 0.66, delay: p.delay, times: [0, 0.22, 0.6, 1], ease: 'easeIn' }}
                    style={{ transformBox: 'fill-box', originX: 0.5, originY: 0 }}
                  />
                ))}
            </AnimatePresence>
          </motion.svg>
        </span>

        {/* label */}
        <span className="relative z-10 grid flex-1 overflow-hidden text-left">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={text}
              className="col-start-1 row-start-1 truncate whitespace-nowrap"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12, filter: 'blur(3px)' }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            >
              {text}
            </motion.span>
          </AnimatePresence>
        </span>
        <AnimatePresence>
          {showCount && count > 0 && phase !== 'jam' && (
            <motion.span
              key={count}
              className={cn('relative z-10 -mr-2 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums', v.badge)}
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.4, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.1 } }}
              transition={{ type: 'spring', stiffness: 600, damping: 20 }}
              aria-hidden
            >
              ×{count}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
      <span className="sr-only" role="status" aria-live="polite">
        {status}
      </span>
    </div>
  )
}
