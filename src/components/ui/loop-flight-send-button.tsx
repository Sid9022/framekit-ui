import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Phase = 'idle' | 'fold' | 'fly' | 'land' | 'sent' | 'error'

export type LoopFlightSendButtonProps = {
  label?: string
  sendingLabel?: string
  sentLabel?: string
  errorLabel?: string
  /** Async work. The plane keeps looping until it settles; rejecting lands a retry state. */
  onSend?: () => void | Promise<unknown>
  /** Auto-reset delay after success in ms. `0` keeps the sent state. */
  resetAfter?: number
  /** Draw the looping ink trail behind the plane. */
  trail?: boolean
  disabled?: boolean
  className?: string
}

/* Flight plan in overlay px, origin = button centre.
   A: launch right, cursive loop, sweep back over the top to the left gate.
   B: holding orbit (repeats while the request is pending), gate → gate.
   C: glide in from the left and dock. */
const PATH_A =
  'M0 0C34 2 72 4 104-8C138-20 150-52 128-64C106-76 88-50 106-34C124-18 162-30 170-58C178-88 120-98 40-96C-40-94-120-92-158-64C-184-44-176-12-150-6'
const PATH_B =
  'M-150-6C-126-2-104 40-40 44C30 48 120 50 150 22C172 0 164-46 132-52C104-58 96-28 120-24C150-20 176-56 150-80C120-104 20-100-60-96C-130-92-178-70-176-40C-175-20-166-10-150-6'
const PATH_C = 'M-150-6C-126-2-110 14-84 14C-58 14-44 2-28 0C-16-1-8 0 0 0'

const PLANE = 'M-9-7.5 11 0-9 7.5-5.2 0Z'
const TRAIL_CHUNKS = 18
const TRAIL_LIFE = 1.05

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

function PlaneGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M3.4 11.1 20.2 4.2c.6-.25 1.2.35.95.95L14.3 21.9c-.3.72-1.33.66-1.55-.08l-1.9-6.1a1 1 0 0 0-.66-.66l-6.1-1.9c-.74-.22-.8-1.25-.07-1.55Z" fill="currentColor" />
      <path d="m10.6 13.4 5-5" stroke="rgb(0 0 0 / 0.25)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

/**
 * Loop Flight Send Button — the pill folds into a circle, the paper plane
 * launches out to the right and writes a looping cursive trail around the
 * button (holding in orbit while the request is pending), then glides back
 * in from the left, folds into a check and the pill springs open to "Sent!".
 */
export function LoopFlightSendButton({
  label = 'Send',
  sendingLabel = 'Sending',
  sentLabel = 'Sent!',
  errorLabel = 'Retry',
  onSend,
  resetAfter = 2400,
  trail = true,
  disabled,
  className,
}: LoopFlightSendButtonProps) {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = React.useState<Phase>('idle')
  const [widths, setWidths] = React.useState<Record<string, number>>({})
  const run = React.useRef(0)
  const outcome = React.useRef<'pending' | 'ok' | 'fail'>('pending')
  const measureRef = React.useRef<HTMLSpanElement>(null)
  const refs = {
    a: React.useRef<SVGPathElement>(null),
    b: React.useRef<SVGPathElement>(null),
    c: React.useRef<SVGPathElement>(null),
    plane: React.useRef<SVGGElement>(null),
    chunks: React.useRef<(SVGPathElement | null)[]>([]),
  }
  React.useEffect(() => () => void (run.current += 1), [])

  /* measure label widths so the pill can spring between exact sizes */
  React.useLayoutEffect(() => {
    const el = measureRef.current
    if (!el) return
    const measure = () => {
      const w: Record<string, number> = {}
      el.querySelectorAll<HTMLElement>('[data-k]').forEach((n) => (w[n.dataset.k!] = Math.ceil(n.getBoundingClientRect().width)))
      setWidths(w)
    }
    measure()
    document.fonts?.ready.then(measure).catch(() => {})
  }, [label, sentLabel, errorLabel, sendingLabel])

  const flying = phase === 'fold' || phase === 'fly' || phase === 'land'
  const collapsed = !reduced && flying
  const textKey = phase === 'sent' ? 'sent' : phase === 'error' ? 'error' : reduced && flying ? 'sending' : 'idle'
  const text = { idle: label, sent: sentLabel, error: errorLabel, sending: sendingLabel }[textKey]
  const pillW = collapsed ? 52 : 6 + 40 + 12 + (widths[textKey] ?? 40) + 22 + 6

  const start = async () => {
    if (flying || disabled) return
    const id = ++run.current
    const alive = () => id === run.current
    outcome.current = 'pending'
    const work = (async () => {
      try {
        await onSend?.()
        if (!onSend) await sleep(reduced ? 700 : 0)
        outcome.current = 'ok'
      } catch {
        outcome.current = 'fail'
      }
    })()
    if (reduced) {
      setPhase('fly')
      await Promise.all([work, sleep(450)])
      if (!alive()) return
      setPhase((outcome.current as string) === 'ok' ? 'sent' : 'error')
    } else {
      setPhase('fold')
      await sleep(300)
      if (!alive()) return
      setPhase('fly')
      // the flight loop takes it from here
    }
  }

  /* flight loop (keeps running after docking so the trail can fade out) */
  const inFlight = phase === 'fly' || phase === 'land' || phase === 'sent' || phase === 'error'
  React.useEffect(() => {
    if (phase !== 'fly' || reduced) return
    const id = run.current
    const segs = { A: refs.a.current!, B: refs.b.current!, C: refs.c.current! }
    const lens = { A: segs.A.getTotalLength(), B: segs.B.getTotalLength(), C: segs.C.getTotalLength() }
    let seg: 'A' | 'B' | 'C' = 'A'
    let s = 0
    let v = 0
    let time = 0
    let landed = false
    let landT = 0
    const pts: { x: number; y: number; t: number }[] = []
    let raf = 0
    let last = performance.now()
    const VMAX = 560

    const draw = () => {
      const plane = refs.plane.current
      const now = time
      while (pts.length && now - pts[0].t > TRAIL_LIFE) pts.shift()
      const chunks = refs.chunks.current
      const n = pts.length
      for (let k = 0; k < TRAIL_CHUNKS; k++) {
        const el = chunks[k]
        if (!el) continue
        const i0 = Math.floor((k / TRAIL_CHUNKS) * n)
        const i1 = Math.min(n - 1, Math.ceil(((k + 1) / TRAIL_CHUNKS) * n))
        if (!trail || i1 - i0 < 1) {
          el.setAttribute('d', '')
          continue
        }
        let d = `M${pts[i0].x.toFixed(1)} ${pts[i0].y.toFixed(1)}`
        for (let i = i0 + 1; i <= i1; i++) d += `L${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`
        el.setAttribute('d', d)
        const f = (k + 1) / TRAIL_CHUNKS
        el.setAttribute('stroke-width', (0.6 + f * 2.4).toFixed(2))
        el.setAttribute('opacity', (f * 0.95).toFixed(2))
      }
      if (plane && landed) plane.setAttribute('opacity', '0')
    }

    const tick = (nowMs: number) => {
      if (id !== run.current) return
      const dt = Math.min(0.04, (nowMs - last) / 1000)
      last = nowMs
      time += dt
      if (!landed) {
        const len = lens[seg]
        let target = VMAX
        if (seg === 'A') target = VMAX * Math.min(1, 0.25 + s / 140)
        if (seg === 'C') target = Math.max(120, VMAX * Math.min(1, (len - s) / 110))
        v += (target - v) * Math.min(1, dt * 9)
        if (seg === 'A' && s < 1) v = 160
        s += v * dt
        if (s >= len) {
          if (seg === 'C') {
            landed = true
            landT = time
            setPhase('land')
          } else {
            s -= len
            seg = outcome.current === 'pending' ? 'B' : 'C'
          }
        }
        if (!landed) {
          const p = segs[seg].getPointAtLength(s)
          const q = segs[seg].getPointAtLength(Math.min(lens[seg], s + 2))
          const back = segs[seg].getPointAtLength(Math.max(0, s - 2))
          const ang = (Math.atan2(q.y - back.y, q.x - back.x) * 180) / Math.PI
          // a little bank on turns, a little squash at launch
          const launch = seg === 'A' ? Math.min(1, s / 40) : 1
          const dockShrink = seg === 'C' ? 0.75 + 0.25 * Math.min(1, (lens.C - s) / 60) : 1
          refs.plane.current?.setAttribute(
            'transform',
            `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) rotate(${ang.toFixed(1)}) scale(${(dockShrink * (0.7 + 0.3 * launch)).toFixed(3)})`,
          )
          refs.plane.current?.setAttribute('opacity', '1')
          pts.push({ x: p.x, y: p.y, t: time })
        }
      }
      draw()
      if (landed && (time - landT > TRAIL_LIFE + 0.1 || !pts.length)) {
        refs.chunks.current.forEach((c) => c?.setAttribute('d', ''))
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inFlight, reduced])

  /* docking → open */
  React.useEffect(() => {
    if (phase !== 'land') return
    const id = run.current
    const ok = outcome.current === 'ok'
    const t = window.setTimeout(() => id === run.current && setPhase(ok ? 'sent' : 'error'), 380)
    return () => window.clearTimeout(t)
  }, [phase])

  React.useEffect(() => {
    if (phase !== 'sent' || !resetAfter) return
    const t = window.setTimeout(() => setPhase('idle'), resetAfter)
    return () => window.clearTimeout(t)
  }, [phase, resetAfter])

  const ok = phase === 'sent' || (phase === 'land' && outcome.current === 'ok')
  const bad = phase === 'error' || (phase === 'land' && outcome.current === 'fail')
  const status =
    phase === 'fly' || phase === 'fold' ? `${sendingLabel}…` : phase === 'sent' ? `${sentLabel.replace(/!$/, '')}. Message delivered.` : phase === 'error' ? 'Sending failed. Press to retry.' : ''

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ minWidth: 6 + 40 + 12 + (widths.idle ?? 40) + 28, height: 52 }}>
      {/* invisible measurer */}
      <span ref={measureRef} aria-hidden className="pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap text-[15px] font-semibold tracking-tight">
        <span data-k="idle">{label}</span>
        <span data-k="sent">{sentLabel}</span>
        <span data-k="error">{errorLabel}</span>
        <span data-k="sending">{sendingLabel}…</span>
      </span>

      <motion.button
        type="button"
        onClick={start}
        disabled={disabled}
        aria-busy={flying}
        aria-label={flying ? `${sendingLabel}…` : text}
        initial={false}
        animate={{ width: pillW }}
        transition={
          collapsed
            ? { type: 'spring', stiffness: 460, damping: 36 }
            : phase === 'sent' || phase === 'error'
              ? { type: 'spring', stiffness: 420, damping: 14, mass: 0.9 }
              : { type: 'spring', stiffness: 380, damping: 30 }
        }
        whileTap={flying || reduced ? undefined : { scale: 0.96 }}
        className={cn(
          'group relative z-0 flex h-[52px] items-center overflow-hidden rounded-full p-1.5 text-[15px] font-semibold tracking-tight outline-none',
          'bg-white text-zinc-900 shadow-[inset_0_1px_0_#fff,0_0_0_1px_rgb(24_24_27/0.06),0_1px_2px_rgb(24_24_27/0.08),0_14px_30px_-14px_rgb(79_70_229/0.45)]',
          'dark:bg-zinc-900 dark:text-white dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_0_0_1px_rgb(255_255_255/0.08),0_1px_2px_rgb(0_0_0/0.6),0_18px_36px_-18px_rgb(99_102_241/0.6)]',
          'focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950',
          'disabled:cursor-not-allowed disabled:opacity-50',
          flying ? 'cursor-progress' : 'cursor-pointer',
        )}
      >
        {/* icon disc */}
        <motion.span
          className={cn(
            'relative grid h-10 w-10 shrink-0 place-items-center rounded-full text-white transition-colors duration-300',
            'shadow-[inset_0_1px_0_rgb(255_255_255/0.35),inset_0_-2px_6px_rgb(0_0_0/0.18),0_4px_10px_-3px_rgb(79_70_229/0.6)]',
            ok ? 'bg-[linear-gradient(160deg,#34d399,#059669)]' : bad ? 'bg-[linear-gradient(160deg,#fb7185,#e11d48)]' : 'bg-[linear-gradient(160deg,#818cf8,#4f46e5_60%,#4338ca)]',
          )}
          animate={phase === 'land' && !reduced ? { scale: [1, 1.18, 0.94, 1] } : { scale: 1 }}
          transition={{ duration: 0.45 }}
        >
          {/* waiting halo while the plane is out */}
          {phase === 'fly' && !reduced && (
            <motion.span
              className="absolute inset-0 rounded-full ring-2 ring-indigo-300/70 dark:ring-indigo-300/50"
              animate={{ scale: [1, 1.35], opacity: [0.8, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
          <AnimatePresence mode="popLayout" initial={false}>
            {(phase === 'idle' || phase === 'fold') && (
              <motion.span
                key="plane"
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.4, rotate: -30 }}
                animate={phase === 'fold' && !reduced ? { opacity: 1, scale: 0.9, x: -2, rotate: -12 } : { opacity: 1, scale: 1, x: 0, rotate: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.05 } }}
                transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                className="grid place-items-center transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px"
              >
                <PlaneGlyph className="h-[18px] w-[18px]" />
              </motion.span>
            )}
            {reduced && phase === 'fly' && (
              <motion.span key="dots" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-0.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-1 w-1 rounded-full bg-white/90" />
                ))}
              </motion.span>
            )}
            {ok && (
              <motion.svg key="check" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ type: 'spring', stiffness: 520, damping: 20 }} aria-hidden>
                <motion.path d="M5 12.5 10 17.2 19 7.5" initial={{ pathLength: reduced ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.32, ease: [0.3, 0.7, 0.3, 1] }} />
              </motion.svg>
            )}
            {bad && (
              <motion.svg key="retry" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 18 }} aria-hidden>
                <path d="M20 11a8 8 0 1 0-2.3 5.7" />
                <path d="M20 4.5V11h-6.5" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.span>

        {/* label */}
        <span className="relative ml-3 mr-[22px] grid h-full flex-1 items-center overflow-hidden whitespace-nowrap text-left">
          <AnimatePresence mode="popLayout" initial={false}>
            {!collapsed && (
              <motion.span
                key={textKey}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: textKey === 'idle' ? -14 : 16, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10, filter: 'blur(4px)', transition: { duration: 0.14 } }}
                transition={textKey === 'sent' || textKey === 'error' ? { type: 'spring', stiffness: 420, damping: 20, delay: 0.06 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className={cn('col-start-1 row-start-1', textKey === 'error' && 'text-rose-600 dark:text-rose-300')}
              >
                {text}
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </motion.button>

      {/* flight overlay */}
      <svg
        viewBox="-200 -110 400 220"
        width={400}
        height={220}
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 overflow-visible"
        aria-hidden
      >
        <path ref={refs.a} d={PATH_A} fill="none" stroke="none" />
        <path ref={refs.b} d={PATH_B} fill="none" stroke="none" />
        <path ref={refs.c} d={PATH_C} fill="none" stroke="none" />
        <g className="stroke-indigo-500 dark:stroke-white" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {Array.from({ length: TRAIL_CHUNKS }, (_, k) => (
            <path key={k} ref={(el) => void (refs.chunks.current[k] = el)} />
          ))}
        </g>
        <g ref={refs.plane} opacity={0}>
          <path d={PLANE} className="fill-indigo-500 dark:fill-white" />
          <path d="M-5.2 0 11 0" className="stroke-white/70 dark:stroke-indigo-400/60" strokeWidth={1} />
        </g>
      </svg>

      <span className="sr-only" aria-live="polite">
        {status}
      </span>
    </div>
  )
}
