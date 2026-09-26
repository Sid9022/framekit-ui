import * as React from 'react'
import { AnimatePresence, motion, useAnimate } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Phase = 'idle' | 'working' | 'filling' | 'done' | 'error'
export type OrbitDotShape = 'teardrop' | 'diamond' | 'spark' | 'bead'

export type OrbitDotExportButtonProps = {
  label?: string
  /** Label once the export finishes (the pill becomes an “open” action). */
  doneLabel?: string
  errorLabel?: string
  /** Shape of the orbiting marker. */
  dot?: OrbitDotShape
  /** Accent for the marker, progress arc and filled circle (`#rrggbb`). */
  accent?: string
  /** Real work; call `report(0..1)`. Omit for a simulated ~2.4s export. */
  onExport?: (report: (progress: number) => void) => Promise<unknown>
  /** Called when the finished pill is pressed. The button resets afterwards. */
  onOpen?: () => void
  /** Auto-reset delay after completion in ms. `0` waits for a press. */
  resetAfter?: number
  disabled?: boolean
  className?: string
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
      const pace = p < 0.25 ? 0.7 : p < 0.8 ? 0.34 : 0.6
      p = Math.min(1, p + pace * (0.6 + Math.abs(Math.sin(now / 210)) * 0.8) * dt)
      report(p)
      if (p >= 1) return resolve()
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
}

/** Marker shapes drawn pointing along +x (direction of travel), centred on the orbit. */
const DOTS: Record<OrbitDotShape, string> = {
  teardrop: 'M-8 0C-4.2-1 -2.4-3.1 0.6-3.1A3.1 3.1 0 0 1 0.6 3.1C-2.4 3.1-4.2 1-8 0Z',
  diamond: 'M4 0L0-3.2L-7 0L0 3.2Z',
  spark: 'M4 0L0.9-0.9L0-4L-0.9-0.9L-6.5 0L-0.9 0.9L0 4L0.9 0.9Z',
  bead: 'M3 0A3 3 0 1 1 -3 0A3 3 0 1 1 3 0Z',
}

// arrow → check share one structure: shaft (M L) + head (M L L)
const ARROW = { shaft: 'M7.5 12L16.5 12', head: 'M12.8 8.2L16.6 12L12.8 15.8' }
const CHECK = { shaft: 'M10.6 15.6L10.6 15.6', head: 'M16.8 8.8L10.6 15.6L7.2 12.2' }

const R = 17 // orbit radius in a 44px box
const C = 2 * Math.PI * R

/**
 * Orbit Dot Export Button — the pill tucks down to its icon, a shaped comet
 * orbits the ring while a progress arc trails it, then the ring floods solid,
 * the arrow bends into a check and the pill reopens as the next action.
 */
export function OrbitDotExportButton({
  label = 'Export report',
  doneLabel = 'Open file',
  errorLabel = 'Retry export',
  dot = 'teardrop',
  accent = '#f5b14c',
  onExport,
  onOpen,
  resetAfter = 3600,
  disabled,
  className,
}: OrbitDotExportButtonProps) {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = React.useState<Phase>('idle')
  const [progress, setProgress] = React.useState(0)
  const [scope, animateEl] = useAnimate<HTMLButtonElement>()
  const run = React.useRef(0)
  React.useEffect(() => () => void (run.current += 1), [])

  const collapsed = phase === 'working' || phase === 'filling'
  const filled = phase === 'filling' || phase === 'done'
  const pct = Math.round(progress * 100)

  const start = async () => {
    const id = ++run.current
    const alive = () => id === run.current
    setProgress(0)
    setPhase('working')
    const report = (v: number) => alive() && setProgress((p) => Math.max(p, Math.min(1, Math.max(0, v))))
    try {
      await sleep(reduced ? 0 : 280)
      if (onExport) await onExport(report)
      else await simulate(report, alive)
      if (!alive()) return
      report(1)
      await sleep(reduced ? 60 : 260)
      if (!alive()) return
      setPhase('filling')
      await sleep(reduced ? 120 : 620)
      if (!alive()) return
      setPhase('done')
      if (!resetAfter) return
      await sleep(resetAfter)
      if (alive()) setPhase('idle')
    } catch {
      if (!alive()) return
      setPhase('error')
      if (!reduced && scope.current) void animateEl(scope.current, { x: [0, -7, 6, -4, 2, 0] }, { duration: 0.42 })
    }
  }

  const onClick = () => {
    if (disabled || collapsed) return
    if (phase === 'done') {
      onOpen?.()
      run.current += 1
      setPhase('idle')
      return
    }
    void start()
  }

  const spring = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 360, damping: 30, mass: 0.85 }
  const text = phase === 'done' ? doneLabel : phase === 'error' ? errorLabel : label
  const err = phase === 'error'
  const status =
    phase === 'working'
      ? `Exporting, ${Math.floor(pct / 25) * 25}%`
      : phase === 'done'
        ? `Export complete. ${doneLabel} is ready.`
        : err
          ? 'Export failed. Press to retry.'
          : ''

  return (
    <div className={cn('inline-flex flex-col items-center', className)}>
      <motion.button
        ref={scope}
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-busy={collapsed}
        aria-label={collapsed ? `Exporting ${pct}%` : text}
        whileTap={collapsed || reduced ? undefined : { scale: 0.97 }}
        className={cn(
          'group relative flex h-14 items-center overflow-hidden rounded-full p-1.5 text-[15px] font-semibold tracking-tight text-zinc-50 outline-none',
          'bg-[linear-gradient(180deg,#26242c,#17161b)] shadow-[inset_0_1px_0_rgb(255_255_255/0.09),0_0_0_1px_rgb(255_255_255/0.06),0_1px_2px_rgb(0_0_0/0.5),0_20px_40px_-20px_rgb(0_0_0/0.9)]',
          'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0c0b10] disabled:cursor-not-allowed disabled:opacity-50',
          collapsed && 'cursor-progress',
        )}
        style={{ ['--tw-ring-color' as string]: accent }}
      >
        {/* ring + icon */}
        <span className="relative grid h-11 w-11 shrink-0 place-items-center">
          <svg viewBox="0 0 44 44" className="absolute inset-0 h-11 w-11 overflow-visible" aria-hidden>
            {/* track */}
            <motion.circle
              cx={22}
              cy={22}
              r={R}
              fill="none"
              strokeWidth={2}
              initial={false}
              animate={{ stroke: collapsed ? 'rgb(255 255 255 / 0.1)' : err ? 'rgb(251 113 133 / 0.55)' : 'rgb(255 255 255 / 0.28)' }}
              transition={{ duration: 0.3 }}
            />
            {/* progress arc */}
            <motion.circle
              cx={22}
              cy={22}
              r={R}
              fill="none"
              stroke={accent}
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeDasharray={C}
              initial={false}
              animate={{ strokeDashoffset: C * (1 - (collapsed ? progress : 0)), opacity: collapsed ? 0.55 : 0 }}
              transition={{ strokeDashoffset: { duration: 0.15, ease: 'linear' }, opacity: { duration: 0.25 } }}
              transform="rotate(-90 22 22)"
            />
            {/* solid fill */}
            <motion.circle
              cx={22}
              cy={22}
              r={R + 1}
              fill={accent}
              initial={false}
              animate={{ scale: filled ? 1 : 0, opacity: filled ? 1 : 0 }}
              transition={filled ? { type: 'spring', stiffness: 420, damping: 20 } : { duration: 0.2 }}
              style={{ transformOrigin: '22px 22px' }}
            />
            {/* orbiting comet */}
            <AnimatePresence>
              {phase === 'working' && !reduced && (
                <motion.g
                  key="orbit"
                  initial={{ opacity: 0, rotate: 0 }}
                  animate={{ opacity: 1, rotate: 360 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ rotate: { duration: 1.05, repeat: Infinity, ease: 'linear' }, opacity: { duration: 0.2 } }}
                  style={{ transformOrigin: '22px 22px' }}
                >
                  {/* tail: short arc ending at the marker */}
                  <circle
                    cx={22}
                    cy={22}
                    r={R}
                    fill="none"
                    stroke={accent}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeOpacity={0.45}
                    strokeDasharray={`${C * 0.28} ${C}`}
                    transform={`rotate(${-90 - 101} 22 22)`}
                  />
                  <circle
                    cx={22}
                    cy={22}
                    r={R}
                    fill="none"
                    stroke={accent}
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeOpacity={0.8}
                    strokeDasharray={`${C * 0.08} ${C}`}
                    transform={`rotate(${-90 - 29} 22 22)`}
                  />
                  <path
                    d={DOTS[dot]}
                    transform={`translate(22 ${22 - R}) scale(1.3)`}
                    fill="#fff"
                    stroke={accent}
                    strokeWidth={1.2}
                    style={{ filter: `drop-shadow(0 0 3px ${accent}) drop-shadow(0 0 7px ${accent})` }}
                  />
                </motion.g>
              )}
            </AnimatePresence>
            {phase === 'working' && reduced && (
              <circle cx={22} cy={22} r={R} fill="none" stroke={accent} strokeWidth={2} strokeOpacity={0.35} />
            )}
          </svg>
          {/* arrow ↔ check */}
          <svg
            viewBox="0 0 24 24"
            className="relative h-6 w-6"
            fill="none"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <motion.g
              initial={false}
              animate={{
                stroke: filled ? '#1b1206' : err ? '#fecdd3' : '#fafafa',
                opacity: phase === 'working' ? 0.55 : 1,
                scale: phase === 'working' ? 0.8 : 1,
              }}
              transition={{ duration: 0.25 }}
              style={{ transformOrigin: '12px 12px' }}
            >
              <motion.path
                initial={false}
                animate={{ d: filled ? CHECK.shaft : ARROW.shaft, opacity: filled ? 0 : 1 }}
                transition={reduced ? { duration: 0 } : { duration: 0.32, ease: [0.65, 0, 0.35, 1], delay: filled ? 0.12 : 0 }}
              />
              <motion.path
                initial={false}
                animate={{ d: filled ? CHECK.head : ARROW.head }}
                transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 18, delay: filled ? 0.12 : 0 }}
              />
            </motion.g>
          </svg>
        </span>

        {/* label */}
        <motion.span
          className="relative block overflow-hidden whitespace-nowrap"
          initial={false}
          animate={{ width: collapsed ? 0 : 'auto', opacity: collapsed ? 0 : 1 }}
          transition={{ width: spring, opacity: { duration: collapsed ? 0.12 : 0.3, delay: collapsed ? 0 : 0.1 } }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={text}
              className={cn('block pl-3 pr-4', err && 'text-rose-100')}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -14, filter: 'blur(4px)' }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            >
              {text}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      </motion.button>

      <div className="mt-2 h-4 font-mono text-[11px] tabular-nums tracking-wide text-zinc-500" aria-hidden>
        <AnimatePresence mode="wait">
          {collapsed && (
            <motion.span key="p" initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {phase === 'filling' ? 'done' : `${pct}%`}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <span className="sr-only" role="status" aria-live="polite">
        {status}
      </span>
    </div>
  )
}
