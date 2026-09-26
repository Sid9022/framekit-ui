import * as React from 'react'
import { AnimatePresence, motion, useAnimate } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Phase = 'idle' | 'launch' | 'publishing' | 'landing' | 'done' | 'error'
export type CloudLaunchVariant = 'dark' | 'light'

export type CloudLaunchPublishButtonProps = {
  label?: string
  busyLabel?: string
  doneLabel?: string
  errorLabel?: string
  variant?: CloudLaunchVariant
  /** Real work; call `report(0..1)` to draw the bottom progress line. Omit to simulate. */
  onPublish?: (report: (progress: number) => void) => Promise<unknown>
  /** Auto-reset delay after completion in ms. `0` keeps the done state. */
  resetAfter?: number
  disabled?: boolean
  className?: string
}

const THEMES: Record<
  CloudLaunchVariant,
  { base: string; ink: string; sub: string; track: string; line: string; glow: string; done: string; puff: string; focus: string }
> = {
  dark: {
    base: 'bg-[linear-gradient(180deg,#1f2330,#141720)] text-slate-50 shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_0_0_1px_rgb(255_255_255/0.07),0_1px_2px_rgb(0_0_0/0.5),0_22px_44px_-22px_rgb(0_0_0/0.95)]',
    ink: '#f1f5f9',
    sub: 'text-slate-400',
    track: 'rgb(255 255 255 / 0.07)',
    line: 'linear-gradient(90deg,#60a5fa,#a78bfa)',
    glow: '#a78bfa',
    done: '#6ee7b7',
    puff: '#cbd5e1',
    focus: 'focus-visible:ring-violet-300 focus-visible:ring-offset-[#0c0b10]',
  },
  light: {
    base: 'bg-[linear-gradient(180deg,#ffffff,#f3f3f7)] text-slate-800 shadow-[inset_0_1px_0_#fff,0_0_0_1px_rgb(15_23_42/0.08),0_1px_2px_rgb(15_23_42/0.1),0_22px_44px_-24px_rgb(15_23_42/0.45)]',
    ink: '#1e293b',
    sub: 'text-slate-500',
    track: 'rgb(15 23 42 / 0.06)',
    line: 'linear-gradient(90deg,#6366f1,#ec4899)',
    glow: '#8b5cf6',
    done: '#059669',
    puff: '#94a3b8',
    focus: 'focus-visible:ring-indigo-400 focus-visible:ring-offset-white',
  },
}

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

function simulate(report: (p: number) => void, alive: () => boolean) {
  return new Promise<void>((resolve) => {
    let p = 0
    let last = performance.now()
    const tick = (now: number) => {
      if (!alive()) return resolve()
      const dt = Math.min(64, now - last) / 1000
      last = now
      const pace = p < 0.2 ? 0.55 : p < 0.85 ? 0.38 : 0.7
      p = Math.min(1, p + pace * (0.55 + Math.abs(Math.sin(now / 260)) * 0.9) * dt)
      report(p)
      if (p >= 1) return resolve()
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
}

const CLOUD = 'M7.2 18.5h9.9a4.1 4.1 0 0 0 .6-8.15A5.6 5.6 0 0 0 6.9 9.1a4.7 4.7 0 0 0 .3 9.4z'
const PUFFS = [
  { x: -9, y: 3, s: 4.4, d: 0 },
  { x: 9, y: 3.5, s: 3.8, d: 0.04 },
  { x: -4, y: 7, s: 3.2, d: 0.08 },
  { x: 5, y: 7.5, s: 3.4, d: 0.02 },
  { x: -12, y: -1, s: 2.6, d: 0.1 },
  { x: 12, y: -0.5, s: 2.4, d: 0.12 },
]

/**
 * Cloud Launch Publish Button — the arrow launches out of the cloud on a puff
 * of vapour, a progress seam draws along the bottom edge, and a check settles
 * back into the cloud when the release is live.
 */
export function CloudLaunchPublishButton({
  label = 'Publish',
  busyLabel = 'Publishing',
  doneLabel = 'Live now',
  errorLabel = 'Retry publish',
  variant = 'dark',
  onPublish,
  resetAfter = 2800,
  disabled,
  className,
}: CloudLaunchPublishButtonProps) {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = React.useState<Phase>('idle')
  const [progress, setProgress] = React.useState(0)
  const [launchId, setLaunchId] = React.useState(0)
  const [scope, animateEl] = useAnimate<HTMLButtonElement>()
  const run = React.useRef(0)
  const t = THEMES[variant]
  React.useEffect(() => () => void (run.current += 1), [])

  const busy = phase === 'launch' || phase === 'publishing' || phase === 'landing'
  const pct = Math.round(progress * 100)

  const start = async () => {
    if (busy || disabled) return
    const id = ++run.current
    const alive = () => id === run.current
    setProgress(0)
    setLaunchId((n) => n + 1)
    setPhase('launch')
    const report = (v: number) => alive() && setProgress((p) => Math.max(p, Math.min(1, Math.max(0, v))))
    try {
      await sleep(reduced ? 0 : 380)
      if (!alive()) return
      setPhase('publishing')
      if (onPublish) await onPublish(report)
      else await simulate(report, alive)
      if (!alive()) return
      report(1)
      await sleep(reduced ? 80 : 240)
      if (!alive()) return
      setPhase('landing')
      await sleep(reduced ? 80 : 520)
      if (!alive()) return
      setPhase('done')
      if (!resetAfter) return
      await sleep(resetAfter)
      if (alive()) setPhase('idle')
    } catch {
      if (!alive()) return
      setPhase('error')
      if (!reduced && scope.current) void animateEl(scope.current, { x: [0, -6, 6, -3, 2, 0] }, { duration: 0.4 })
    }
  }

  const showCheck = phase === 'landing' || phase === 'done'
  const arrowHome = phase === 'idle' || phase === 'error'
  const text =
    phase === 'done' || phase === 'landing' ? doneLabel : phase === 'error' ? errorLabel : busy ? busyLabel : label
  const lineColor = phase === 'error' ? '#fb7185' : showCheck ? t.done : undefined
  const status =
    phase === 'publishing'
      ? `${busyLabel}, ${Math.floor(pct / 25) * 25}%`
      : phase === 'done'
        ? `${doneLabel}. Published.`
        : phase === 'error'
          ? 'Publishing failed. Press to retry.'
          : ''

  return (
    <div className={cn('relative inline-flex', className)}>
      <motion.button
        ref={scope}
        type="button"
        onClick={start}
        disabled={disabled}
        aria-busy={busy}
        aria-label={busy ? `${busyLabel} ${pct}%` : text}
        whileTap={busy || reduced ? undefined : { scale: 0.97 }}
        className={cn(
          'group relative inline-flex h-14 w-[212px] items-center gap-3 rounded-2xl pl-4 pr-5 text-[15px] font-semibold tracking-tight outline-none',
          'focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          t.base,
          t.focus,
          busy && 'cursor-progress',
        )}
      >
        {/* bottom progress seam (clipped to the rounded body) */}
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden>
          <span className="absolute inset-x-0 bottom-0 h-[3px]" style={{ background: t.track }} />
          <motion.span
            className="absolute bottom-0 left-0 h-[3px] w-full origin-left"
            style={{ background: lineColor ?? t.line }}
            initial={false}
            animate={{
              scaleX: phase === 'idle' ? 0 : phase === 'launch' ? 0 : phase === 'error' ? Math.max(progress, 0.02) : showCheck ? 1 : progress,
              opacity: phase === 'idle' ? 0 : 1,
            }}
            transition={{ scaleX: { duration: 0.14, ease: 'linear' }, opacity: { duration: phase === 'idle' ? 0.4 : 0.15 } }}
          />
          {phase === 'publishing' && !reduced && (
            <motion.span
              className="absolute bottom-0 h-3 w-10 -translate-x-1/2 rounded-full blur-md"
              style={{ left: `${progress * 100}%`, background: t.glow, opacity: 0.55 }}
            />
          )}
        </span>

        {/* icon */}
        <span className="relative grid h-7 w-7 shrink-0 place-items-center">
          <svg viewBox="0 0 24 24" className="h-7 w-7 overflow-visible" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <motion.path
              d={CLOUD}
              strokeWidth={1.9}
              initial={false}
              animate={{
                stroke: phase === 'error' ? '#fb7185' : showCheck ? t.done : t.ink,
                scale: phase === 'launch' ? [1, 0.9, 1.04, 1] : phase === 'landing' ? [1, 1.08, 0.97, 1] : 1,
              }}
              transition={{ scale: { duration: 0.45, delay: phase === 'landing' ? 0.12 : 0 }, stroke: { duration: 0.3 } }}
              style={{ transformOrigin: '12px 14px' }}
            />
            {/* resting / returning arrow */}
            <AnimatePresence>
              {arrowHome && (
                <motion.g
                  key="arrow-home"
                  stroke={phase === 'error' ? '#fb7185' : t.ink}
                  strokeWidth={1.9}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                  transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                  className="transition-transform duration-200 group-hover:-translate-y-[1.5px]"
                >
                  <path d="M12 16.4v-5.6M9.7 12.9 12 10.6l2.3 2.3" />
                </motion.g>
              )}
            </AnimatePresence>
            {/* launched arrow */}
            <AnimatePresence>
              {phase === 'launch' && !reduced && (
                <motion.g
                  key={`rocket-${launchId}`}
                  stroke={t.ink}
                  strokeWidth={1.9}
                  initial={{ y: 0, opacity: 1, scaleY: 1 }}
                  animate={{ y: [0, 2, -38], scaleY: [1, 0.8, 1.35], opacity: [1, 1, 0] }}
                  transition={{ duration: 0.55, times: [0, 0.18, 1], ease: [0.5, 0, 0.75, 0] }}
                  style={{ transformOrigin: '12px 13px' }}
                >
                  <path d="M12 16.4v-5.6M9.7 12.9 12 10.6l2.3 2.3" />
                  <motion.path
                    d="M12 17v6"
                    strokeWidth={1.4}
                    strokeOpacity={0.45}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: [0, 1, 0] }}
                    transition={{ duration: 0.55 }}
                  />
                </motion.g>
              )}
            </AnimatePresence>
            {/* vapour puffs */}
            <AnimatePresence>
              {phase === 'launch' && !reduced &&
                PUFFS.map((p, i) => (
                  <motion.circle
                    key={`puff-${launchId}-${i}`}
                    cx={12}
                    cy={16}
                    r={p.s / 2}
                    fill={t.puff}
                    initial={{ x: 0, y: 0, scale: 0.3, opacity: 0.7 }}
                    animate={{ x: p.x, y: p.y, scale: 1.3, opacity: 0 }}
                    transition={{ duration: 0.7, delay: 0.06 + p.d, ease: [0.2, 0.7, 0.3, 1] }}
                  />
                ))}
            </AnimatePresence>
            {/* landing check */}
            <AnimatePresence>
              {showCheck && (
                <motion.path
                  key="check"
                  d="M9.3 13.7l1.9 1.9 3.6-3.8"
                  stroke={t.done}
                  strokeWidth={2.1}
                  initial={reduced ? { opacity: 0 } : { y: -18, opacity: 0, pathLength: 1 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ type: 'spring', stiffness: 520, damping: 17 }}
                />
              )}
            </AnimatePresence>
          </svg>
        </span>

        {/* label */}
        <span className="relative grid flex-1 overflow-hidden text-left">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={text}
              className={cn('col-start-1 row-start-1 flex items-baseline gap-2 whitespace-nowrap', phase === 'error' && 'text-rose-400')}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -14, filter: 'blur(4px)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              {text}
              {phase === 'publishing' && (
                <span className={cn('font-mono text-xs tabular-nums', t.sub)}>{pct}%</span>
              )}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.button>
      <span className="sr-only" role="status" aria-live="polite">
        {status}
      </span>
      {busy && (
        <span className="sr-only" role="progressbar" aria-label="Publish progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} />
      )}
    </div>
  )
}
