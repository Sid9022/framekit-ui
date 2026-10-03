import * as React from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type IntroPreloaderProps = {
  /** Content revealed once the curtain lifts. */
  children?: React.ReactNode
  /** Greeting words cycled while counting. */
  words?: string[]
  /** Total count-up time in seconds. */
  duration?: number
  /** Start automatically. Use `runKey` to replay. */
  autoStart?: boolean
  runKey?: number
  onComplete?: () => void
  skipLabel?: string
  className?: string
}

const WORDS = ['Hello', 'Bonjour', 'Hola', 'Ciao', 'Olá', 'Hello']

/**
 * Intro Preloader — a full-frame intro: greeting words flick by while a big counter climbs 0→100, then the ink panel
 * lifts away with a curved trailing edge that flattens as it leaves, and the page behind settles from a slight zoom.
 * Skippable (button or Esc); reduced motion gets a short fade.
 */
export function IntroPreloader({ children, words = WORDS, duration = 2.6, autoStart = true, runKey = 0, onComplete, skipLabel = 'Skip intro', className }: IntroPreloaderProps) {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = React.useState<'idle' | 'count' | 'lift' | 'done'>(autoStart ? 'count' : 'idle')
  const n = useMotionValue(0)
  const label = useTransform(n, (v) => String(Math.round(v)).padStart(3, '0'))
  const bar = useTransform(n, [0, 100], [0, 1])
  const [wi, setWi] = React.useState(0)
  const [pct, setPct] = React.useState(0)
  const done = React.useRef(onComplete)
  done.current = onComplete

  React.useEffect(() => {
    if (!autoStart && runKey === 0) return
    n.set(0); setWi(0); setPhase('count')
  }, [runKey]) // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (phase !== 'count') return
    const dur = reduced ? 0.2 : duration
    const c = animate(n, 100, { duration: dur, ease: [0.65, 0, 0.35, 1], onUpdate: (v) => { setWi(Math.min(words.length - 1, Math.floor((v / 100) * words.length))); setPct(Math.round(v)) }, onComplete: () => setPhase('lift') })
    return () => c.stop()
  }, [phase, reduced, duration, n, words.length])

  React.useEffect(() => {
    if (phase !== 'lift') return
    const t = window.setTimeout(() => { setPhase('done'); done.current?.() }, reduced ? 250 : 1250)
    return () => window.clearTimeout(t)
  }, [phase, reduced])

  const skip = () => { if (phase === 'count') { n.set(100); setPct(100); setPhase('lift') } }
  const covered = phase === 'idle' || phase === 'count'
  const flat = 'M0 0H100V100Q50 100 0 100Z'
  const bulge = 'M0 0H100V100Q50 132 0 100Z'

  return (
    <div className={cn('relative isolate w-full overflow-hidden rounded-2xl bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50', className)} onKeyDown={(e) => e.key === 'Escape' && skip()} aria-busy={covered}>
      <motion.div
        className="h-full w-full"
        inert={covered}
        initial={false}
        animate={{ opacity: covered ? 0.4 : 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div className="h-full w-full" initial={false} animate={{ scale: phase === 'lift' || phase === 'done' ? 1 : 1.07 }} transition={{ duration: reduced ? 0 : 1.3, ease: [0.16, 1, 0.3, 1] }}>
          {children}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {phase !== 'done' && (
          <motion.div
            key="curtain"
            className="absolute inset-0 z-20"
            initial={false}
            animate={phase === 'lift' ? { y: reduced ? 0 : '-120%', opacity: reduced ? 0 : 1 } : { y: 0, opacity: 1 }}
            transition={phase === 'lift' ? { duration: reduced ? 0.2 : 1.05, ease: [0.76, 0, 0.24, 1] } : { duration: 0 }}
            exit={{ opacity: 0 }}
          >
            <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              <motion.path fill="currentColor" className="text-zinc-950 dark:text-signal-900" initial={false} animate={{ d: phase === 'lift' && !reduced ? [flat, bulge, bulge, flat] : flat }} transition={{ duration: phase === 'lift' ? 1.05 : 0, times: [0, 0.3, 0.7, 1], ease: 'easeInOut' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col justify-between p-6 text-white sm:p-10">
              <div className="flex items-start justify-between">
                <div className="relative h-10 overflow-hidden font-display text-3xl sm:text-4xl" aria-hidden>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span key={wi} className="flex items-center gap-2" initial={reduced ? false : { y: 36, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduced ? undefined : { y: -36, opacity: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
                      <span className="h-2 w-2 rounded-full bg-framekit-500" />{words[wi]}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <button type="button" onClick={skip} className="min-h-11 rounded-full border border-white/40 px-4 text-sm font-medium text-white hover:bg-white/10">{skipLabel}</button>
              </div>
              <div className="flex items-end justify-between gap-4">
                <div role="progressbar" aria-label="Loading" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} className="font-display text-[clamp(88px,22vw,200px)] leading-[0.8] tabular-nums tracking-tight"><motion.span>{label}</motion.span></div>
                <div className="mb-2 hidden h-px flex-1 bg-white/25 sm:block" aria-hidden><motion.div className="h-full origin-left bg-framekit-500" style={{ scaleX: bar }} /></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
