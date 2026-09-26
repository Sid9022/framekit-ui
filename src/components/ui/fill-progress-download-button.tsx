import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowDown, Check, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Phase = 'idle' | 'loading' | 'done' | 'error'

export type FillProgressDownloadButtonProps = {
  label?: string
  doneLabel?: string
  /** Optional file hint rendered under the button. */
  fileName?: string
  /**
   * Real work. Call `report(0..1)` to drive the fill. When omitted a simulated,
   * organically-paced ~2.6s download runs instead.
   */
  onDownload?: (report: (progress: number) => void) => Promise<unknown>
  /** Auto-reset delay after completion in ms. `0` keeps the done state. */
  resetAfter?: number
  disabled?: boolean
  className?: string
}

/** Organic pacing: quick start, a hesitant middle, and a confident finish. */
function simulate(report: (p: number) => void, isAlive: () => boolean) {
  return new Promise<void>((resolve) => {
    let p = 0
    let last = performance.now()
    const tick = (now: number) => {
      if (!isAlive()) return resolve()
      const dt = Math.min(64, now - last) / 1000
      last = now
      const base = p < 0.3 ? 0.62 : p < 0.72 ? 0.26 : 0.52
      const wobble = 0.55 + Math.abs(Math.sin(now / 170)) * 0.9
      p = Math.min(1, p + base * wobble * dt)
      report(p)
      if (p >= 1) return resolve()
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
}

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

/**
 * Fill Progress Download Button — the arrow sinks away, a deeper tone floods
 * the pill with a live percentage, then it condenses into a calm “done” chip.
 */
export function FillProgressDownloadButton({
  label = 'Download',
  doneLabel = 'Saved',
  fileName,
  onDownload,
  resetAfter = 2800,
  disabled,
  className,
}: FillProgressDownloadButtonProps) {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = React.useState<Phase>('idle')
  const [progress, setProgress] = React.useState(0)
  const [milestone, setMilestone] = React.useState(0)
  const run = React.useRef(0)
  React.useEffect(() => () => void (run.current += 1), [])

  const pct = Math.round(progress * 100)

  const start = async () => {
    if (phase === 'loading' || disabled) return
    const id = ++run.current
    const alive = () => id === run.current
    setProgress(0)
    setMilestone(0)
    setPhase('loading')
    const report = (v: number) => {
      if (!alive()) return
      const c = Math.max(0, Math.min(1, v))
      setProgress((prev) => Math.max(prev, c))
      setMilestone(Math.floor(c * 4) * 25)
    }
    try {
      await sleep(reduced ? 0 : 220)
      if (onDownload) await onDownload(report)
      else await simulate(report, alive)
      if (!alive()) return
      report(1)
      await sleep(reduced ? 100 : 260)
      if (!alive()) return
      setPhase('done')
      if (!resetAfter) return
      await sleep(resetAfter)
      if (alive()) {
        setPhase('idle')
        setProgress(0)
      }
    } catch {
      if (alive()) setPhase('error')
    }
  }

  const spring = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 340, damping: 30 }
  const done = phase === 'done'
  const status =
    phase === 'loading'
      ? `Downloading, ${milestone}%`
      : done
        ? `${doneLabel}. Download complete.`
        : phase === 'error'
          ? 'Download failed. Press to retry.'
          : ''

  return (
    <div className={cn('inline-flex flex-col items-center gap-2.5', className)}>
      <motion.button
        type="button"
        onClick={start}
        disabled={disabled}
        aria-busy={phase === 'loading'}
        aria-label={done ? doneLabel : phase === 'loading' ? `Downloading ${pct}%` : label}
        initial={false}
        animate={{
          width: done ? 136 : phase === 'loading' ? 208 : 184,
          backgroundColor: done ? '#2a2931' : phase === 'error' ? '#be123c' : '#3b82f6',
        }}
        whileTap={phase === 'loading' || reduced ? undefined : { scale: 0.97 }}
        transition={{ width: spring, backgroundColor: { duration: 0.35 } }}
        className={cn(
          'group relative h-14 overflow-hidden rounded-full text-[15px] font-semibold tracking-tight text-white',
          'shadow-[inset_0_1px_0_rgb(255_255_255/0.22),0_1px_2px_rgb(0_0_0/0.35),0_18px_40px_-18px_rgb(37_99_235/0.75)]',
          'outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0c0b10]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          phase === 'loading' && 'cursor-progress',
          done && 'shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_18px_40px_-20px_rgb(0_0_0/0.8)]',
        )}
      >
        {/* sheen */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(180deg,rgb(255_255_255/0.18),transparent_55%)]"
        />
        {/* fill */}
        <motion.span
          aria-hidden
          className="absolute inset-y-0 left-0 origin-left bg-[linear-gradient(90deg,#1d4ed8,#1e40af)]"
          initial={false}
          animate={{
            width: `${phase === 'loading' ? progress * 100 : done ? 100 : 0}%`,
            opacity: done ? 0 : 1,
          }}
          transition={{ width: { duration: 0.12, ease: 'linear' }, opacity: { duration: 0.3 } }}
        >
          {/* leading edge glow */}
          {phase === 'loading' && !reduced && (
            <span className="absolute inset-y-0 right-0 w-10 bg-[linear-gradient(90deg,transparent,rgb(147_197_253/0.3))]" />
          )}
        </motion.span>

        <AnimatePresence initial={false}>
          {(phase === 'idle' || phase === 'error') && (
            <motion.span
              key={`idle-${phase}`}
              className="absolute inset-0 flex items-center justify-center gap-2.5"
              variants={{
                show: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: -10 },
                gone: { opacity: 0, transition: { duration: 0.18, delay: 0.12 } },
              }}
              initial="hidden"
              animate="show"
              exit="gone"
            >
              {phase === 'error' ? (
                <RotateCcw className="h-4 w-4" strokeWidth={2.4} />
              ) : (
                <motion.span
                  className="grid h-6 w-6 place-items-center rounded-full bg-white/15"
                  variants={{
                    show: { y: 0, opacity: 1 },
                    hidden: { y: 0, opacity: 1 },
                    gone: reduced
                      ? { opacity: 0 }
                      : { y: 24, opacity: 0, transition: { duration: 0.28, ease: [0.5, 0, 0.9, 0.4] } },
                  }}
                >
                  <ArrowDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" strokeWidth={2.6} />
                </motion.span>
              )}
              {phase === 'error' ? 'Retry' : label}
            </motion.span>
          )}
          {phase === 'loading' && (
            <motion.span
              key="loading"
              className="absolute inset-0 flex items-center justify-center gap-2 tabular-nums"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              transition={{ delay: reduced ? 0 : 0.15 }}
            >
              <span className="text-white/75">Downloading</span>
              <span className="inline-block w-[3ch] text-right">{pct}%</span>
            </motion.span>
          )}
          {done && (
            <motion.span
              key="done"
              className="absolute inset-0 flex items-center justify-center gap-2.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <motion.span
                className="grid h-6 w-6 place-items-center rounded-full bg-emerald-400 text-emerald-950 shadow-[0_0_0_4px_rgb(52_211_153/0.18)]"
                initial={reduced ? false : { scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 560, damping: 15, delay: 0.18 }}
              >
                <Check className="h-3.5 w-3.5" strokeWidth={3.4} />
              </motion.span>
              <motion.span
                initial={reduced ? false : { x: 14, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 380, damping: 26, delay: 0.1 }}
              >
                {doneLabel}
              </motion.span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {fileName && (
        <span className="font-mono text-[11px] tracking-wide text-zinc-500">
          {fileName}
        </span>
      )}
      <span className="sr-only" role="status" aria-live="polite">
        {status}
      </span>
      {phase === 'loading' && (
        <span className="sr-only" role="progressbar" aria-label="Download progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} />
      )}
    </div>
  )
}
