import * as React from 'react'
import { animate, motion, useInView, useMotionValue, useTransform } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type BubbleBuddyState = 'idle' | 'listening' | 'thinking' | 'speaking'

export type GlassBubbleBuddyProps = {
  state?: BubbleBuddyState
  /** Diameter of the glass sphere in px. */
  size?: number
  /** Body hue (0–360). */
  hue?: number
  /** External voice level 0–1 while speaking; simulated when omitted. */
  level?: number
  /** Accessible name prefix. */
  label?: string
  onClick?: () => void
  className?: string
}

const STATE_COPY: Record<BubbleBuddyState, string> = {
  idle: 'idle',
  listening: 'listening',
  thinking: 'thinking',
  speaking: 'speaking',
}

const BLOB_LOOPS: Record<BubbleBuddyState, { animate: Record<string, number[] | string[]>; duration: number }> = {
  idle: {
    animate: {
      y: [0, -5, 0],
      borderRadius: ['48% 52% 46% 54% / 55% 50% 50% 45%', '54% 46% 52% 48% / 48% 55% 45% 52%', '48% 52% 46% 54% / 55% 50% 50% 45%'],
    },
    duration: 3.4,
  },
  listening: {
    animate: {
      y: [-6, -9, -6],
      borderRadius: ['46% 54% 44% 56% / 58% 52% 48% 42%', '52% 48% 50% 50% / 52% 58% 42% 48%', '46% 54% 44% 56% / 58% 52% 48% 42%'],
    },
    duration: 1.9,
  },
  thinking: {
    animate: {
      y: [0, -3, 0],
      rotate: [-4, 4, -4],
      borderRadius: ['50% 50% 44% 56% / 52% 48% 52% 48%', '44% 56% 54% 46% / 56% 46% 54% 44%', '50% 50% 44% 56% / 52% 48% 52% 48%'],
    },
    duration: 2.6,
  },
  speaking: {
    animate: {
      y: [0, -2, 0],
      borderRadius: ['50% 50% 48% 52% / 54% 50% 50% 46%', '52% 48% 50% 50% / 50% 54% 46% 50%', '50% 50% 48% 52% / 54% 50% 50% 46%'],
    },
    duration: 1.2,
  },
}

/**
 * Glass Bubble Buddy — a soft blob character floating inside a glossy glass
 * sphere, crossed by a tilted inner ring. It blinks and watches the pointer;
 * listening leans in with wide eyes, thinking glances around while the ring
 * spins, speaking pulses the body to the voice level. Pure CSS + SVG-free DOM.
 */
export function GlassBubbleBuddy({
  state = 'idle',
  size = 220,
  hue = 212,
  level,
  label = 'Assistant',
  onClick,
  className,
}: GlassBubbleBuddyProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const inView = useInView(ref, { margin: '60px' })
  const S = size
  const live = inView && !reduced

  // motion values driven from one rAF loop
  const lvl = useMotionValue(0)
  const eyeX = useMotionValue(0)
  const eyeY = useMotionValue(0)
  const leanX = useMotionValue(0)
  const leanR = useMotionValue(0)
  const ringX = useMotionValue(70)
  const ringY = useMotionValue(0)
  const hiX = useMotionValue(0)
  const hiY = useMotionValue(0)

  const bodySX = useTransform(lvl, (v) => 1 + v * 0.06)
  const bodySY = useTransform(lvl, (v) => 1 + v * 0.13)
  const eyeSquash = useTransform(lvl, (v) => 1 - v * 0.28)
  const bloomScale = useTransform(lvl, (v) => 1 + v * 0.22)

  const pointer = React.useRef({ x: 0, y: 0 })
  const levelRef = React.useRef(level)
  levelRef.current = level
  const stateRef = React.useRef(state)
  stateRef.current = state

  React.useEffect(() => {
    if (!live) return
    const onMove = (e: PointerEvent) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const k = Math.max(r.width * 1.6, 240)
      pointer.current.x = Math.max(-1, Math.min(1, (e.clientX - cx) / k))
      pointer.current.y = Math.max(-1, Math.min(1, (e.clientY - cy) / k))
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const t = (now - t0) / 1000
      const st = stateRef.current
      const { x: px, y: py } = pointer.current
      // level
      let target = 0
      if (st === 'speaking') {
        const ext = levelRef.current
        const env = Math.sin(t * 1.3) > -0.35 ? 1 : 0.12
        target = ext ?? env * (0.35 + 0.65 * Math.abs(Math.sin(t * 8.7) * Math.sin(t * 2.9 + 1)))
      } else if (st === 'listening') target = 0.12 + 0.06 * Math.sin(t * 3)
      lvl.set(lvl.get() + (target - lvl.get()) * 0.22)
      // eyes
      let ex = px * S * 0.04
      let ey = py * S * 0.03
      if (st === 'thinking') {
        ex = Math.sin(t * 1.7) * S * 0.045
        ey = -S * 0.028 + Math.cos(t * 1.1) * S * 0.012
      }
      eyeX.set(eyeX.get() + (ex - eyeX.get()) * 0.12)
      eyeY.set(eyeY.get() + (ey - eyeY.get()) * 0.12)
      // lean
      const leanAmt = st === 'listening' ? 1 : 0.3
      leanX.set(leanX.get() + (px * S * 0.035 * leanAmt - leanX.get()) * 0.08)
      leanR.set(leanR.get() + (px * 10 * leanAmt - leanR.get()) * 0.08)
      // ring + highlights
      ringX.set(ringX.get() + (70 + py * 9 - ringX.get()) * 0.07)
      ringY.set(ringY.get() + (px * 14 - ringY.get()) * 0.07)
      hiX.set(hiX.get() + (-px * S * 0.015 - hiX.get()) * 0.08)
      hiY.set(hiY.get() + (-py * S * 0.012 - hiY.get()) * 0.08)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [live, S, lvl, eyeX, eyeY, leanX, leanR, ringX, ringY, hiX, hiY])

  // reset values when paused / reduced
  React.useEffect(() => {
    if (live) return
    const lv = state === 'speaking' ? 0.4 : 0
    lvl.set(lv)
    ;[eyeX, eyeY, leanX, leanR, ringY, hiX, hiY].forEach((m) => m.set(0))
    ringX.set(70)
  }, [live, state, lvl, eyeX, eyeY, leanX, leanR, ringX, ringY, hiX, hiY])

  // blinking
  const [blink, setBlink] = React.useState(0)
  React.useEffect(() => {
    if (!live) return
    let t: number
    const loop = () => {
      t = window.setTimeout(() => {
        setBlink((b) => b + 1)
        loop()
      }, 2200 + Math.random() * 3200)
    }
    loop()
    return () => window.clearTimeout(t)
  }, [live])

  const loop = BLOB_LOOPS[state]
  const widen = state === 'listening' ? 1.2 : state === 'thinking' ? 0.92 : 1
  const ringSpin = state === 'thinking' ? 2.2 : state === 'speaking' ? 7 : 16

  const Root = onClick ? 'button' : 'div'
  return (
    <Root
      ref={ref as React.Ref<HTMLButtonElement & HTMLDivElement>}
      {...(onClick ? { type: 'button' as const, onClick } : { role: 'img' })}
      aria-label={`${label}: ${STATE_COPY[state]}`}
      className={cn(
        'relative inline-block shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-sky-400 focus-visible:ring-offset-transparent',
        className,
      )}
      style={{ width: S, height: S * 1.14 }}
    >
      {/* bloom */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 rounded-full opacity-40 blur-2xl dark:opacity-80"
        style={{
          width: S * 1.05,
          height: S * 1.05,
          marginLeft: -S * 0.525,
          top: -S * 0.025,
          background: `radial-gradient(circle, hsla(${hue}, 95%, 62%, 0.55), hsla(${hue + 30}, 95%, 60%, 0.15) 55%, transparent 70%)`,
          scale: bloomScale,
        }}
      />

      {/* listening ripple */}
      {state === 'listening' && live && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 rounded-full border"
          style={{ width: S, height: S, borderColor: `hsla(${hue}, 90%, 60%, 0.5)` }}
          animate={{ scale: [1, 1.28], opacity: [0.7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
        />
      )}

      {/* floor shadow */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-1/2 rounded-[50%] bg-slate-900/25 blur-md dark:bg-black/60"
        style={{ width: S * 0.56, height: S * 0.07, marginLeft: -S * 0.28, top: S * 1.04 }}
        animate={live ? { scaleX: [1, 0.9, 1], opacity: [0.9, 0.65, 0.9] } : undefined}
        transition={{ duration: loop.duration, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* sphere */}
      <motion.span
        className="absolute left-0 top-0 block rounded-full"
        style={{ width: S, height: S, perspective: S * 3 }}
        animate={live ? { y: [0, -S * 0.02, 0] } : { y: 0 }}
        transition={{ duration: loop.duration * 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* glass body */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full ring-1 ring-slate-900/10 backdrop-blur-[3px] dark:ring-white/25"
          style={{
            background: `radial-gradient(circle at 50% 58%, hsla(${hue}, 90%, 80%, 0.08), hsla(${hue}, 90%, 62%, 0.16) 60%, hsla(${hue + 8}, 95%, 55%, 0.5) 100%)`,
            boxShadow: `inset 0 -${S * 0.08}px ${S * 0.16}px hsla(${hue}, 95%, 55%, 0.35), inset 0 ${S * 0.04}px ${S * 0.1}px rgba(255,255,255,0.55), 0 ${S * 0.1}px ${S * 0.2}px -${S * 0.08}px hsla(${hue}, 80%, 40%, 0.45)`,
          }}
        />

        <Ring S={S} hue={hue} half="back" rx={ringX} ry={ringY} spin={ringSpin} live={live} />

        {/* blob */}
        <motion.span
          aria-hidden
          className="absolute left-1/2 block"
          style={{ width: S * 0.55, height: S * 0.49, marginLeft: -S * 0.275, top: S * 0.3, x: leanX, rotate: leanR }}
        >
          <motion.span
            className="absolute inset-0 block"
            animate={live ? loop.animate : { y: state === 'listening' ? -6 : 0 }}
            transition={live ? { duration: loop.duration, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
            style={{ borderRadius: '50% 50% 46% 54% / 55% 50% 50% 45%' }}
          >
            <motion.span
              className="absolute inset-0 block"
              style={{
                borderRadius: 'inherit',
                scaleX: bodySX,
                scaleY: bodySY,
                transformOrigin: '50% 85%',
                background: `radial-gradient(circle at 34% 28%, hsl(${hue - 6} 100% 95%), hsl(${hue} 95% 78%) 38%, hsl(${hue + 6} 90% 62%) 78%, hsl(${hue + 12} 85% 52%))`,
                boxShadow: `inset -${S * 0.03}px -${S * 0.05}px ${S * 0.09}px hsla(${hue + 10}, 90%, 42%, 0.45), inset ${S * 0.025}px ${S * 0.035}px ${S * 0.06}px rgba(255,255,255,0.7), 0 ${S * 0.03}px ${S * 0.1}px hsla(${hue}, 95%, 55%, 0.55)`,
              }}
            >
              {/* eyes */}
              <motion.span
                className="absolute left-1/2 flex -translate-x-1/2 items-center"
                style={{ top: '30%', gap: S * 0.075, x: eyeX, y: eyeY }}
              >
                {[0, 1].map((i) => (
                  <motion.span
                    key={i}
                    className="block"
                    style={{ scaleY: eyeSquash }}
                    animate={{ scale: widen }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  >
                    <motion.span
                      key={blink}
                      className="relative block rounded-full"
                      style={{ width: S * 0.058, height: S * 0.13, background: `hsl(${hue + 12} 70% 16%)` }}
                      initial={blink && live ? { scaleY: 1 } : false}
                      animate={blink && live ? { scaleY: [1, 0.08, 1] } : { scaleY: 1 }}
                      transition={{ duration: 0.2, delay: i * 0.02 }}
                    >
                      <span className="absolute left-[22%] top-[12%] block h-[24%] w-[44%] rounded-full bg-white/85" />
                    </motion.span>
                  </motion.span>
                ))}
              </motion.span>
              {/* cheeks */}
              <span className="absolute left-[16%] top-[56%] h-[10%] w-[16%] rounded-full bg-pink-300/40 blur-[2px]" />
              <span className="absolute right-[16%] top-[56%] h-[10%] w-[16%] rounded-full bg-pink-300/40 blur-[2px]" />
            </motion.span>
          </motion.span>
        </motion.span>

        <Ring S={S} hue={hue} half="front" rx={ringX} ry={ringY} spin={ringSpin} live={live} />

        {/* specular highlights */}
        <motion.span aria-hidden className="pointer-events-none absolute inset-0 rounded-full" style={{ x: hiX, y: hiY }}>
          <span
            className="absolute rounded-full"
            style={{
              left: '14%',
              top: '8%',
              width: '44%',
              height: '26%',
              transform: 'rotate(-28deg)',
              background: 'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.95), rgba(255,255,255,0.25) 55%, transparent 72%)',
            }}
          />
          <span className="absolute rounded-full bg-white" style={{ left: '66%', top: '18%', width: S * 0.045, height: S * 0.045, opacity: 0.9 }} />
          <span
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at 50% 110%, hsla(${hue - 10}, 100%, 85%, 0.55), transparent 42%)`,
            }}
          />
          <span
            className="absolute inset-0 rounded-full"
            style={{ boxShadow: `inset ${S * 0.02}px -${S * 0.01}px ${S * 0.02}px rgba(255,255,255,0.35), inset -${S * 0.015}px 0 ${S * 0.03}px hsla(${hue}, 90%, 70%, 0.35)` }}
          />
        </motion.span>
      </motion.span>
    </Root>
  )
}

function Ring({
  S,
  hue,
  half,
  rx,
  ry,
  spin,
  live,
}: {
  S: number
  hue: number
  half: 'back' | 'front'
  rx: ReturnType<typeof useMotionValue<number>>
  ry: ReturnType<typeof useMotionValue<number>>
  spin: number
  live: boolean
}) {
  const d = S * 0.84
  const rot = useMotionValue(0)
  React.useEffect(() => {
    if (!live) return
    const c = animate(rot, rot.get() + 360, { duration: spin, repeat: Infinity, ease: 'linear' })
    return () => c.stop()
  }, [live, spin, rot])
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute block"
      style={{
        width: d,
        height: d,
        left: (S - d) / 2,
        top: (S - d) / 2 + S * 0.07,
        rotateX: rx,
        rotateY: ry,
        rotateZ: -16,
        clipPath: half === 'back' ? 'inset(0 0 50% 0)' : 'inset(50% 0 0 0)',
        opacity: half === 'back' ? 0.55 : 1,
      }}
    >
      <span
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: `0 0 0 ${Math.max(1.5, S * 0.009)}px rgba(255,255,255,0.55), 0 0 ${S * 0.05}px hsla(${hue}, 95%, 70%, 0.6)` }}
      />
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{
          rotate: rot,
          background: `conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.95) 40deg, hsla(${hue}, 100%, 75%, 0.9) 70deg, transparent 120deg, transparent 200deg, hsla(${hue + 40}, 100%, 80%, 0.8) 240deg, transparent 290deg)`,
          WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${S * 0.022}px), #000 calc(100% - ${S * 0.018}px))`,
          mask: `radial-gradient(farthest-side, transparent calc(100% - ${S * 0.022}px), #000 calc(100% - ${S * 0.018}px))`,
        }}
      />
    </motion.span>
  )
}
