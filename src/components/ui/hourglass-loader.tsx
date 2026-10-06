import * as React from 'react'
import { animate, motion, useInView, useMotionValue, useTransform } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type HourglassLoaderProps = {
  /** 0–100 for a determinate loader; omit for an endless pour that flips itself. */
  progress?: number
  /** Status line under the glass. */
  label?: string
  /** Seconds for one full pour in indeterminate mode (2–20). */
  duration?: number
  /** Sand colour. */
  accent?: string
  /** Rendered height in px (glass scales with it). */
  size?: number
  className?: string
}

// glass geometry in a 100 × 160 box
const TOP = 18
const NECK = 80
const BOT = 142
const bulb = 'M22 18 C22 52 44 64 47 78 Q50 82 53 78 C56 64 78 52 78 18 Z'
const bulbBottom = 'M22 142 C22 108 44 96 47 82 Q50 78 53 82 C56 96 78 108 78 142 Z'

/**
 * Hourglass Loader — a brass-and-glass hourglass. Sand drains from the upper
 * bulb through a trickling stream into a growing mound; in endless mode the
 * glass turns itself over on a spring when the top runs dry. Pass `progress`
 * and it becomes a determinate progressbar instead.
 */
export function HourglassLoader({ progress, label, duration = 6, accent = '#d4a24c', size = 168, className }: HourglassLoaderProps) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '40px' })
  const id = React.useId().replace(/:/g, '')
  const determinate = typeof progress === 'number'
  const pct = determinate ? Math.min(100, Math.max(0, progress!)) : 0
  const p = useMotionValue(determinate ? pct / 100 : reduced ? 0.45 : 0)
  const turn = useMotionValue(0)
  const [flowing, setFlowing] = React.useState(false)
  const dur = Math.min(20, Math.max(2, duration))

  // determinate: ease toward the value
  React.useEffect(() => {
    if (!determinate) return
    const c = animate(p, pct / 100, reduced ? { duration: 0 } : { type: 'spring', stiffness: 80, damping: 20 })
    setFlowing(!reduced && pct > 0 && pct < 100)
    return () => c.stop()
  }, [determinate, pct, reduced, p])

  // indeterminate: pour → flip → repeat
  React.useEffect(() => {
    if (determinate || reduced || !inView) {
      if (!determinate) setFlowing(false)
      return
    }
    let stopped = false
    let ctl: { stop: () => void } | null = null
    const cycle = () => {
      if (stopped) return
      setFlowing(true)
      ctl = animate(p, 1, {
        duration: dur * (1 - p.get()),
        ease: 'linear',
        onComplete: () => {
          if (stopped) return
          setFlowing(false)
          ctl = animate(turn, 180, {
            type: 'spring',
            stiffness: 120,
            damping: 15,
            onComplete: () => {
              if (stopped) return
              turn.set(0)
              p.set(0)
              cycle()
            },
          })
        },
      })
    }
    cycle()
    return () => {
      stopped = true
      ctl?.stop()
    }
  }, [determinate, reduced, inView, dur, p, turn])

  // sand geometry
  const moundH = useTransform(p, (v) => (BOT - NECK - 8) * Math.pow(v, 0.9))
  const moundPath = useTransform(moundH, (h) => {
    const base = BOT
    const peak = base - h
    const shoulder = base - h * 0.55
    return `M18 ${base} L18 ${shoulder} Q34 ${shoulder - 2} 44 ${peak + 3} Q50 ${peak - 2} 56 ${peak + 3} Q66 ${shoulder - 2} 82 ${shoulder} L82 ${base} Z`
  })
  const dip = useTransform(p, (v) => `M18 ${TOP + 6 + (NECK - TOP - 6) * Math.pow(v, 0.85)} Q50 ${TOP + 6 + (NECK - TOP - 6) * Math.pow(v, 0.85) + 4 + v * 6} 82 ${TOP + 6 + (NECK - TOP - 6) * Math.pow(v, 0.85)} L82 ${NECK + 4} L18 ${NECK + 4} Z`)

  const text = label ?? (determinate ? (pct >= 100 ? 'Done' : 'Restoring your backup…') : 'Still working on it…')
  const w = (size / 160) * 100

  return (
    <div ref={ref} className={cn('inline-flex flex-col items-center gap-4', className)}>
      <div
        role={determinate ? 'progressbar' : 'img'}
        aria-label={determinate ? text : `Loading: ${text}`}
        aria-valuemin={determinate ? 0 : undefined}
        aria-valuemax={determinate ? 100 : undefined}
        aria-valuenow={determinate ? Math.round(pct) : undefined}
        className="relative"
        style={{ width: w, height: size }}
      >
        <motion.svg viewBox="0 0 100 160" className="h-full w-full overflow-visible" style={{ rotate: turn }} aria-hidden>
          <defs>
            <clipPath id={`${id}t`}><path d={bulb} /></clipPath>
            <clipPath id={`${id}b`}><path d={bulbBottom} /></clipPath>
            <linearGradient id={`${id}sand`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={`color-mix(in oklab, ${accent} 70%, #fff)`} />
              <stop offset="1" stopColor={`color-mix(in oklab, ${accent} 80%, #5a3a10)`} />
            </linearGradient>
            <linearGradient id={`${id}brass`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f4dea6" />
              <stop offset="0.5" stopColor="#b88a3d" />
              <stop offset="1" stopColor="#6e4c1c" />
            </linearGradient>
            <linearGradient id={`${id}glass`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
              <stop offset="0.25" stopColor="#fff" stopOpacity="0.05" />
              <stop offset="0.8" stopColor="#fff" stopOpacity="0" />
              <stop offset="1" stopColor="#fff" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          {/* back glass tint */}
          <path d={bulb} className="fill-zinc-900/[0.04] dark:fill-white/[0.04]" />
          <path d={bulbBottom} className="fill-zinc-900/[0.04] dark:fill-white/[0.04]" />
          {/* sand: top */}
          <g clipPath={`url(#${id}t)`}>
            <motion.path d={dip} fill={`url(#${id}sand)`} />
          </g>
          {/* stream */}
          {flowing && (
            <motion.line x1="50" y1={NECK} x2="50" y2={BOT - 2} stroke={accent} strokeWidth="1.3" strokeDasharray="2.5 2.5" animate={{ strokeDashoffset: [0, -5] }} transition={{ repeat: Infinity, duration: 0.3, ease: 'linear' }} />
          )}
          {/* sand: bottom mound */}
          <g clipPath={`url(#${id}b)`}>
            <motion.path d={moundPath} fill={`url(#${id}sand)`} />
          </g>
          {/* glass outline + highlights */}
          <path d={bulb} fill={`url(#${id}glass)`} className="stroke-zinc-900/35 dark:stroke-white/35" strokeWidth="1.2" />
          <path d={bulbBottom} fill={`url(#${id}glass)`} className="stroke-zinc-900/35 dark:stroke-white/35" strokeWidth="1.2" />
          <path d="M28 24 C29 44 38 56 44 66" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M28 136 C29 118 36 106 42 98" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="1.4" strokeLinecap="round" />
          {/* frame */}
          <rect x="12" y="8" width="76" height="11" rx="3" fill={`url(#${id}brass)`} />
          <rect x="12" y="141" width="76" height="11" rx="3" fill={`url(#${id}brass)`} />
          {[16, 84].map((x) => (
            <rect key={x} x={x - 1.6} y="18" width="3.2" height="124" rx="1.6" fill={`url(#${id}brass)`} />
          ))}
          <rect x="12" y="8" width="76" height="2" rx="1" fill="#fff" opacity="0.45" />
        </motion.svg>
      </div>
      <div className="text-center">
        <p className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100">{text}</p>
        {determinate && <p className="mt-0.5 text-[12px] tabular-nums text-zinc-600 dark:text-zinc-400">{Math.round(pct)}%</p>}
      </div>
      <p role="status" aria-live="polite" className="sr-only">{determinate ? (pct >= 100 ? text : `${Math.round(pct / 10) * 10}%`) : text}</p>
    </div>
  )
}
