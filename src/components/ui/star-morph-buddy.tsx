import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Phase = 'rest' | 'busy' | 'done' | 'error'

export type StarMorphBuddyProps = {
  /** Assistant name, used in the default intro and the accessible label. */
  name?: string
  /** Line shown while resting. */
  idleText?: string
  /** Intro line shown on hover / focus. Defaults to an intro using `name`. */
  hoverText?: string
  /** Phrase inside `hoverText` that gets gradient ink (appended if not found). */
  highlight?: string
  busyText?: string
  doneText?: string
  errorText?: string
  /** Click / Enter / Space. Return a promise to show busy → done, or reject to show a retry state. */
  onActivate?: () => void | Promise<unknown>
  /** Avatar size in px. */
  size?: number
  /** Eyes follow the pointer. */
  interactive?: boolean
  /** Force the star pose (e.g. to preview it). */
  forceHover?: boolean
  className?: string
}

/* ---------------------------------------------------------------- geometry */

type Spring = { v: number; a: number }
const sp = (v: number): Spring => ({ v, a: 0 })
function step(s: Spring, target: number, k: number, c: number, dt: number) {
  const n = Math.max(1, Math.ceil(dt / 0.008))
  const h = dt / n
  for (let i = 0; i < n; i++) {
    s.a += (-k * (s.v - target) - c * s.a) * h
    s.v += s.a * h
  }
}
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const rand = (a: number, b: number) => a + Math.random() * (b - a)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

const N = 10
const R = 58
const ANG = Array.from({ length: N }, (_, i) => -Math.PI / 2 + (i * Math.PI * 2) / N)

/** Blob ↔ rounded star, both from the same 10 anchors so the path interpolates cleanly. */
function shapePath(m: number, t: number, wobble: number) {
  const pts: [number, number][] = []
  const tens: number[] = []
  for (let i = 0; i < N; i++) {
    const a = ANG[i]
    const tip = i % 2 === 0
    const blobR = R * (1 + wobble * (0.03 * Math.sin(t * 1.3 + i * 1.7) + 0.022 * Math.sin(t * 0.8 + i * 2.9)))
    const starR = tip ? R * 1.16 : R * 0.6
    const rr = lerp(blobR, starR, m)
    const sx = lerp(1.05, 1, m)
    const sy = lerp(0.95, 1, m)
    pts.push([Math.cos(a) * rr * sx, Math.sin(a) * rr * sy + lerp(3, 0, m)])
    tens.push(lerp(1, tip ? 0.5 : 0.62, m))
  }
  let d = `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`
  for (let i = 0; i < N; i++) {
    const p0 = pts[(i - 1 + N) % N]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % N]
    const p3 = pts[(i + 2) % N]
    const t1 = tens[i] / 6
    const t2 = tens[(i + 1) % N] / 6
    const c1x = p1[0] + (p2[0] - p0[0]) * t1
    const c1y = p1[1] + (p2[1] - p0[1]) * t1
    const c2x = p2[0] - (p3[0] - p1[0]) * t2
    const c2y = p2[1] - (p3[1] - p1[1]) * t2
    d += `C${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`
  }
  return d + 'Z'
}

const SPARKLE = 'M0-6C.6-1.6 1.6-.6 6 0 1.6.6.6 1.6 0 6-.6 1.6-1.6.6-6 0-1.6-.6-.6-1.6 0-6Z'

function renderHighlighted(text: string, highlight?: string) {
  if (!highlight) return text
  const i = text.indexOf(highlight)
  const ink = (
    <span className="bg-[linear-gradient(90deg,#ec4899,#f97316_55%,#eab308)] bg-clip-text font-semibold text-transparent dark:bg-[linear-gradient(90deg,#f472b6,#fb923c_55%,#fde047)]">
      {highlight}
    </span>
  )
  if (i < 0)
    return (
      <>
        {text} {ink}
      </>
    )
  return (
    <>
      {text.slice(0, i)}
      {ink}
      {text.slice(i + highlight.length)}
    </>
  )
}

/**
 * Star Morph Buddy — a floating indigo blob with a warm glowing core. Hover
 * or focus and it springs into a soft five-point star: the core flares, its
 * eyes tilt, cheeks blush, sparkles pop at the tips and the greeting
 * crossfades into an intro with a gradient-inked phrase. Leave and it
 * relaxes back into a blob on a softer spring.
 */
export function StarMorphBuddy({
  name = 'Nova',
  idleText = 'Hey there — stuck on something?',
  hoverText,
  highlight = 'clear next steps',
  busyText = 'Waking up…',
  doneText = 'Ready when you are!',
  errorText = 'Lost the signal. Tap to try again.',
  onActivate,
  size = 176,
  interactive = true,
  forceHover = false,
  className,
}: StarMorphBuddyProps) {
  const reduced = usePrefersReducedMotion()
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '')
  const [hovered, setHovered] = React.useState(false)
  const [phase, setPhase] = React.useState<Phase>('rest')
  const [burst, setBurst] = React.useState(0)
  const run = React.useRef(0)
  React.useEffect(() => () => void (run.current += 1), [])

  const intro = hoverText ?? `I'm ${name} — I turn messy ideas into ${highlight}.`
  const starred = (hovered || forceHover || phase === 'busy' || phase === 'done') && phase !== 'error'
  const text =
    phase === 'busy' ? busyText : phase === 'done' ? doneText : phase === 'error' ? errorText : hovered || forceHover ? intro : idleText
  const textKey = phase === 'rest' ? (hovered || forceHover ? 'hover' : 'idle') : phase

  const bodyRef = React.useRef<SVGPathElement>(null)
  const clipRef = React.useRef<SVGPathElement>(null)
  const glowRef = React.useRef<SVGPathElement>(null)
  const floatRef = React.useRef<SVGGElement>(null)
  const eyesRef = React.useRef<SVGGElement>(null)
  const eyeL = React.useRef<SVGEllipseElement>(null)
  const eyeR = React.useRef<SVGEllipseElement>(null)
  const coreRef = React.useRef<SVGCircleElement>(null)
  const blushRef = React.useRef<SVGGElement>(null)
  const mouthRef = React.useRef<SVGPathElement>(null)
  const shadowRef = React.useRef<SVGEllipseElement>(null)
  const svgRef = React.useRef<SVGSVGElement>(null)

  const live = React.useRef({ starred, phase, reduced, interactive })
  live.current = { starred, phase, reduced, interactive }
  const kick = React.useRef(0)

  React.useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const S = {
      t: rand(0, 10),
      m: sp(0),
      rot: sp(0),
      scale: sp(1),
      gx: sp(0),
      gy: sp(0),
      droop: sp(0),
      blink: 0,
      blinkT: -1,
      nextBlink: rand(1.5, 3.5),
      pointer: null as null | { x: number; y: number },
      was: false,
    }
    const onMove = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect()
      S.pointer = { x: e.clientX - (r.left + r.width / 2), y: e.clientY - (r.top + r.height / 2) }
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const frame = (dt: number, snap: boolean) => {
      const L = live.current
      const still = L.reduced
      if (!still) S.t += dt
      const t = S.t
      const target = L.starred ? 1 : 0
      if (L.starred !== S.was) {
        if (!still) {
          S.rot.a += L.starred ? -140 : 60
          S.scale.a += L.starred ? 2.2 : -0.8
        }
        S.was = L.starred
      }
      if (kick.current) {
        S.scale.a -= 5 * kick.current
        S.rot.a += 260 * kick.current
        kick.current = 0
      }
      if (snap || still) {
        S.m.v = target
        S.m.a = 0
      } else if (L.starred) step(S.m, target, 520, 17, dt)
      else step(S.m, target, 150, 15, dt)
      const m = S.m.v
      const busySpin = L.phase === 'busy' && !still ? Math.sin(t * 3) * 10 : 0
      step(S.rot, busySpin, 180, 12, still ? 1 : dt)
      step(S.scale, 1, 260, 11, still ? 1 : dt)
      if (still) {
        S.rot.v = 0
        S.scale.v = 1
      }
      step(S.droop, L.phase === 'error' ? 1 : 0, 200, 20, still ? 1 : dt)

      // blink
      if (!still) {
        S.nextBlink -= dt
        if (S.nextBlink <= 0 && S.blinkT < 0) S.blinkT = 0
        if (S.blinkT >= 0) {
          S.blinkT += dt
          const p = S.blinkT / 0.15
          S.blink = p < 1 ? Math.sin(p * Math.PI) : 0
          if (p >= 1) {
            S.blinkT = -1
            S.nextBlink = Math.random() < 0.2 ? 0.12 : rand(2.2, 5)
          }
        }
      }

      // gaze
      let gx = 0
      let gy = 0
      if (L.interactive && S.pointer && !still) {
        const d = Math.hypot(S.pointer.x, S.pointer.y) || 1
        const pull = clamp(d / 220, 0, 1)
        gx = (S.pointer.x / d) * 6 * pull
        gy = (S.pointer.y / d) * 4.5 * pull
      } else if (!still) {
        gx = Math.sin(t * 0.5) * 2.5
        gy = Math.sin(t * 0.37) * 1.2
      }
      step(S.gx, gx, 120, 16, still ? 1 : dt)
      step(S.gy, gy, 120, 16, still ? 1 : dt)

      const d = shapePath(m, t, still ? 0 : 1 - m * 0.8)
      bodyRef.current?.setAttribute('d', d)
      clipRef.current?.setAttribute('d', d)
      glowRef.current?.setAttribute('d', d)

      const floatY = still ? 0 : Math.sin(t * 1.7) * lerp(5, 2.5, m) - m * 5
      floatRef.current?.setAttribute(
        'transform',
        `translate(0 ${floatY.toFixed(2)}) rotate(${S.rot.v.toFixed(2)}) scale(${S.scale.v.toFixed(3)})`,
      )
      shadowRef.current?.setAttribute('rx', (40 - floatY * 1.2 + m * 4).toFixed(1))
      shadowRef.current?.setAttribute('opacity', (0.55 + floatY * 0.03).toFixed(2))

      const tilt = lerp(0, -11, m) + S.droop.v * 0
      eyesRef.current?.setAttribute(
        'transform',
        `translate(${S.gx.v.toFixed(2)} ${(S.gy.v - m * 3 + S.droop.v * 4).toFixed(2)}) rotate(${tilt.toFixed(2)})`,
      )
      const ry = 10.5 * (1 - 0.88 * S.blink) * lerp(1, 0.86, m) * (1 - S.droop.v * 0.35)
      const rx = 6.4 * (1 + 0.15 * S.blink) * lerp(1, 1.06, m)
      for (const [el, side] of [
        [eyeL.current, -1],
        [eyeR.current, 1],
      ] as const) {
        if (!el) continue
        el.setAttribute('ry', ry.toFixed(2))
        el.setAttribute('rx', rx.toFixed(2))
        const droopRot = S.droop.v * side * -18
        const playRot = m * side * 8
        el.setAttribute('transform', `rotate(${(droopRot + playRot).toFixed(2)} ${side * 15} -4)`)
      }
      const breathe = still ? 0 : Math.sin(t * 2.2) * 0.04
      coreRef.current?.setAttribute('opacity', clamp(0.55 + m * 0.45 - S.droop.v * 0.3 + breathe, 0, 1).toFixed(2))
      coreRef.current?.setAttribute('transform', `translate(0 ${lerp(18, 17, m).toFixed(2)}) scale(${(1 + m * 0.18 + breathe).toFixed(3)})`)
      glowRef.current?.setAttribute('opacity', (0.28 + m * 0.5 - S.droop.v * 0.15).toFixed(2))
      blushRef.current?.setAttribute('opacity', clamp(m * 0.9, 0, 1).toFixed(2))
      mouthRef.current?.setAttribute('opacity', clamp(S.droop.v, 0, 1).toFixed(2))
    }

    let raf = 0
    let last = performance.now()
    let visible = true
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      frame(dt, false)
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      cancelAnimationFrame(raf)
      if (!visible || document.hidden) return
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      start()
    })
    io.observe(svg)
    document.addEventListener('visibilitychange', start)
    frame(0.016, true)
    start()
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', start)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  const activate = async () => {
    if (phase === 'busy') return
    kick.current = 1
    setBurst((b) => b + 1)
    const res = onActivate?.()
    if (!res || typeof (res as Promise<unknown>).then !== 'function') {
      setPhase('rest')
      return
    }
    const id = ++run.current
    setPhase('busy')
    try {
      await res
      if (id !== run.current) return
      setPhase('done')
      window.setTimeout(() => id === run.current && setPhase('rest'), 2200)
    } catch {
      if (id === run.current) setPhase('error')
    }
  }

  const announce = phase === 'busy' ? busyText : phase === 'done' ? doneText : phase === 'error' ? errorText : ''
  const tips = [0, 2, 4, 6, 8].map((i) => ANG[i])

  return (
    <div className={cn('inline-flex flex-col items-center', className)}>
      <button
        type="button"
        onClick={activate}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        aria-label={`${name}, assistant. ${idleText}`}
        aria-describedby={`${uid}-line`}
        aria-busy={phase === 'busy'}
        className="group flex cursor-pointer flex-col items-center gap-3 rounded-[28px] px-6 pb-4 pt-2 outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950"
      >
        <svg ref={svgRef} viewBox="-100 -100 200 200" width={size} height={size} className="overflow-visible" aria-hidden>
          <defs>
            <linearGradient id={`${uid}-body`} x1="0" y1="-70" x2="0" y2="70" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#7c7cff" />
              <stop offset="0.55" stopColor="#4f46e5" />
              <stop offset="1" stopColor="#2e1f8f" />
            </linearGradient>
            <radialGradient id={`${uid}-core`}>
              <stop offset="0" stopColor="#fff3b0" />
              <stop offset="0.28" stopColor="#ffc15e" />
              <stop offset="0.55" stopColor="#ff7a59" stopOpacity="0.9" />
              <stop offset="0.8" stopColor="#f0509e" stopOpacity="0.45" />
              <stop offset="1" stopColor="#f0509e" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`${uid}-spec`} cx="-22" cy="-34" r="40" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`${uid}-shade`} cx="0" cy="0" r="72" gradientUnits="userSpaceOnUse">
              <stop offset="0.6" stopColor="#1e1065" stopOpacity="0" />
              <stop offset="1" stopColor="#1e1065" stopOpacity="0.55" />
            </radialGradient>
            <linearGradient id={`${uid}-glow`} x1="-60" y1="-60" x2="60" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#818cf8" />
              <stop offset="0.6" stopColor="#f472b6" />
              <stop offset="1" stopColor="#fb923c" />
            </linearGradient>
            <filter id={`${uid}-blur`} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="11" />
            </filter>
            <filter id={`${uid}-soft`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
            <clipPath id={`${uid}-clip`}>
              <path ref={clipRef} />
            </clipPath>
          </defs>

          <ellipse ref={shadowRef} cx="0" cy="78" rx="46" ry="6" className="fill-indigo-950/25 dark:fill-black/60" filter={`url(#${uid}-soft)`} />

          <g ref={floatRef}>
            <path ref={glowRef} fill={`url(#${uid}-glow)`} filter={`url(#${uid}-blur)`} opacity="0.3" />
            <path ref={bodyRef} fill={`url(#${uid}-body)`} />
            <g clipPath={`url(#${uid}-clip)`}>
              <circle ref={coreRef} r="46" fill={`url(#${uid}-core)`} />
              <rect x="-100" y="-100" width="200" height="200" fill={`url(#${uid}-shade)`} />
              <rect x="-100" y="-100" width="200" height="200" fill={`url(#${uid}-spec)`} />
            </g>
            <g ref={blushRef} opacity="0">
              <ellipse cx="-27" cy="9" rx="7" ry="3.6" fill="#ff8fc7" opacity="0.7" filter={`url(#${uid}-soft)`} />
              <ellipse cx="27" cy="9" rx="7" ry="3.6" fill="#ff8fc7" opacity="0.7" filter={`url(#${uid}-soft)`} />
            </g>
            <path ref={mouthRef} d="M-7 17Q0 11.5 7 17" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" opacity="0" />
            <g ref={eyesRef}>
              <ellipse ref={eyeL} cx="-15" cy="-4" rx="6.4" ry="10.5" fill="#fff" />
              <ellipse ref={eyeR} cx="15" cy="-4" rx="6.4" ry="10.5" fill="#fff" />
            </g>
          </g>

          {/* sparkles at the tips */}
          <AnimatePresence>
            {starred &&
              tips.map((a, i) => (
                <motion.path
                  key={`sp-${i}-${burst}`}
                  d={SPARKLE}
                  className="fill-amber-300 dark:fill-amber-200"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0, x: Math.cos(a) * 62, y: Math.sin(a) * 62 - 4 }}
                  animate={
                    reduced
                      ? { opacity: 0.8, x: Math.cos(a) * 84, y: Math.sin(a) * 84 - 4 }
                      : {
                          opacity: [0, 1, 0.85],
                          scale: [0, 1.25, 0.8 + (i % 2) * 0.25],
                          rotate: [0, 90],
                          x: Math.cos(a) * (84 + (i % 2) * 6),
                          y: Math.sin(a) * (84 + (i % 2) * 6) - 4,
                        }
                  }
                  exit={{ opacity: 0, scale: 0, transition: { duration: 0.18 } }}
                  transition={{ type: 'spring', stiffness: 420, damping: 18, delay: reduced ? 0 : 0.05 + i * 0.04 }}
                />
              ))}
          </AnimatePresence>
        </svg>

        <span id={`${uid}-line`} className="relative grid min-h-[3rem] max-w-[80vw] place-items-center text-center text-balance" style={{ width: Math.max(190, Math.min(340, size * 1.95)) }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={textKey}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6, filter: 'blur(6px)' }}
              transition={{ duration: reduced ? 0.12 : 0.32, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'col-start-1 row-start-1 text-[15px] leading-snug tracking-tight',
                phase === 'error' ? 'text-rose-600 dark:text-rose-300' : 'text-zinc-700 dark:text-zinc-200',
              )}
            >
              {textKey === 'hover' ? renderHighlighted(intro, highlight) : text}
            </motion.span>
          </AnimatePresence>
        </span>
      </button>
      <span className="sr-only" aria-live="polite">
        {announce}
      </span>
    </div>
  )
}
