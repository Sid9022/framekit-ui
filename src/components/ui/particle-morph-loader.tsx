import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type ParticleShape = 'sphere' | 'shell' | 'ring' | 'ribbon' | 'tetra' | 'helix'
export type ParticleMorphState = 'loading' | 'done' | 'error'

export type ParticleMorphLoaderProps = {
  /** Shapes to cycle through, in order. Pass a single shape to lock it. */
  shapes?: ParticleShape[]
  /** Canvas edge in px (the swarm itself takes ~70% of it). */
  size?: number
  /** Particle tint as `#rrggbb`. */
  color?: string
  /** Status words; one per morph, cycled. */
  labels?: string[]
  /** Speed multiplier for rotation and morph cadence. */
  speed?: number
  /** Number of particles (clamped 80–600). */
  points?: number
  /** Show the status word under the swarm. */
  showLabel?: boolean
  /** `done` condenses the swarm and tints it mint; `error` scatters it in rose. */
  state?: ParticleMorphState
  doneLabel?: string
  errorLabel?: string
  /** When provided, the error state renders a retry pill that calls this. */
  onRetry?: () => void
  className?: string
}

const DEFAULT_SHAPES: ParticleShape[] = ['sphere', 'ribbon', 'shell', 'tetra', 'ring', 'helix']
const DEFAULT_LABELS = ['Gathering context…', 'Weighing options…', 'Cross-checking…', 'Sketching an answer…', 'Tightening details…', 'Almost there…']
const DONE_TINT = '#6ee7b7'
const ERROR_TINT = '#fb7185'
const TAU = Math.PI * 2

/* ---------- shape generation (unit radius, deterministic) ---------- */

function rng(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildShape(kind: ParticleShape, n: number): Float32Array {
  const r = rng(kind.length * 977 + n)
  const pts: [number, number, number][] = []
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) / n
    switch (kind) {
      case 'sphere': {
        // solid ball, denser core
        const rad = Math.pow(r(), 0.45) * 0.95
        const th = r() * TAU
        const ph = Math.acos(2 * r() - 1)
        pts.push([rad * Math.sin(ph) * Math.cos(th), rad * Math.cos(ph), rad * Math.sin(ph) * Math.sin(th)])
        break
      }
      case 'shell': {
        // golden-spiral hollow sphere
        const y = 1 - 2 * u
        const rr = Math.sqrt(1 - y * y)
        const th = i * 2.399963
        pts.push([rr * Math.cos(th), y, rr * Math.sin(th)])
        break
      }
      case 'ring': {
        const th = u * TAU * 3 + r() * 0.05
        const rad = 1 + (r() - 0.5) * 0.16
        pts.push([rad * Math.cos(th), (r() - 0.5) * 0.05, rad * Math.sin(th)])
        break
      }
      case 'ribbon': {
        const lanes = 5
        const t = (Math.floor(i / lanes) / Math.ceil(n / lanes)) * TAU
        const v = ((i % lanes) / (lanes - 1) - 0.5) * 0.62
        const phi = t * 1.5
        const R = 0.78
        pts.push([(R + v * Math.cos(phi)) * Math.cos(t), v * Math.sin(phi), (R + v * Math.cos(phi)) * Math.sin(t)])
        break
      }
      case 'tetra': {
        const V: [number, number, number][] = [
          [0, 1, 0],
          [0.943, -0.333, 0],
          [-0.471, -0.333, 0.816],
          [-0.471, -0.333, -0.816],
        ]
        const E = [[0, 1], [0, 2], [0, 3], [1, 2], [2, 3], [3, 1]]
        const e = E[i % 6]
        const t = (Math.floor(i / 6) + 0.5) / Math.ceil(n / 6)
        const a = V[e[0]]
        const b = V[e[1]]
        const j = 0.018
        pts.push([
          a[0] + (b[0] - a[0]) * t + (r() - 0.5) * j,
          a[1] + (b[1] - a[1]) * t + (r() - 0.5) * j,
          a[2] + (b[2] - a[2]) * t + (r() - 0.5) * j,
        ])
        break
      }
      case 'helix': {
        const strand = i % 2
        const t = u * TAU * 1.75
        const y = (u - 0.5) * 1.9
        const off = strand * Math.PI
        const rungs = i % 11 === 0
        const k = rungs ? r() * 2 - 1 : strand ? -1 : 1
        const rad = 0.55
        pts.push([rungs ? Math.cos(t) * rad * k : Math.cos(t + off) * rad, y, rungs ? Math.sin(t) * rad * k : Math.sin(t + off) * rad])
        break
      }
    }
  }
  // sort by longitude so morphs sweep around the axis instead of scrambling
  pts.sort((p, q) => Math.atan2(p[2], p[0]) - Math.atan2(q[2], q[0]))
  const out = new Float32Array(n * 3)
  pts.forEach((p, i) => out.set(p, i * 3))
  return out
}

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex.trim())
  if (!m) return [167, 139, 250]
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)]
}

function makeSprite(rgb: [number, number, number]) {
  const c = document.createElement('canvas')
  c.width = c.height = 32
  const g = c.getContext('2d')!
  const grd = g.createRadialGradient(16, 16, 0, 16, 16, 16)
  const [r, gg, b] = rgb
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.18, `rgba(${Math.min(255, r + 70)},${Math.min(255, gg + 70)},${Math.min(255, b + 70)},0.95)`)
  grd.addColorStop(0.42, `rgba(${r},${gg},${b},0.45)`)
  grd.addColorStop(1, `rgba(${r},${gg},${b},0)`)
  g.fillStyle = grd
  g.fillRect(0, 0, 32, 32)
  return c
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * Particle Morph Loader — a swarm of depth-lit motes spins in 3D and melts
 * between precomputed forms while a status word rolls underneath.
 * Pure canvas 2D with a hand-rolled perspective projection.
 */
export function ParticleMorphLoader({
  shapes = DEFAULT_SHAPES,
  size = 180,
  color = '#a78bfa',
  labels = DEFAULT_LABELS,
  speed = 1,
  points = 320,
  showLabel = true,
  state = 'loading',
  doneLabel = 'Ready',
  errorLabel = 'Lost the thread',
  onRetry,
  className,
}: ParticleMorphLoaderProps) {
  const reduced = usePrefersReducedMotion()
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const [step, setStep] = React.useState(0)
  const n = Math.max(80, Math.min(600, Math.round(points)))
  const shapeKey = shapes.join(',')

  const sets = React.useMemo(
    () => (shapes.length ? shapes : DEFAULT_SHAPES).map((s) => buildShape(s, n)),
    [shapeKey, n],
  )

  // live values the loop reads without restarting
  const live = React.useRef({ state, color, speed, reduced, size })
  live.current = { state, color, speed, reduced, size }
  const stepRef = React.useRef(setStep)
  stepRef.current = setStep

  React.useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const W = live.current.size
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(W * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const doneSet = buildShape('shell', n)
    const cur = new Float32Array(n * 3)
    cur.set(sets[0])
    let from = 0
    let to = sets.length > 1 ? 1 : 0
    let phaseT = 0 // seconds into hold+morph cycle
    let angle = 0.6
    let last = performance.now()
    let visible = true
    let raf = 0
    let rgb = hexToRgb(live.current.color)
    let spriteKey = ''
    let sprite = makeSprite(rgb)
    let condense = 0 // 0..1 toward done
    let scatter = 0 // 0..1 toward error
    const HOLD = 1.5
    const MORPH = 1.25
    const STAGGER = 0.4

    const frame = (now: number) => {
      raf = 0
      if (!visible) return
      const L = live.current
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const sp = Math.max(0.1, L.speed)

      // color lerp toward state tint
      const target = hexToRgb(L.state === 'done' ? DONE_TINT : L.state === 'error' ? ERROR_TINT : L.color)
      rgb = rgb.map((c, i) => c + (target[i] - c) * Math.min(1, dt * 5)) as [number, number, number]
      const key = rgb.map((c) => Math.round(c / 4)).join(',')
      if (key !== spriteKey) {
        spriteKey = key
        sprite = makeSprite(rgb.map(Math.round) as [number, number, number])
      }
      condense += ((L.state === 'done' ? 1 : 0) - condense) * Math.min(1, dt * 3)
      scatter += ((L.state === 'error' ? 1 : 0) - scatter) * Math.min(1, dt * 4)

      // morph clock
      const cycling = L.state === 'loading' && !L.reduced && sets.length > 1
      if (cycling) {
        phaseT += dt * sp
        if (phaseT >= HOLD + MORPH) {
          phaseT = 0
          from = to
          to = (to + 1) % sets.length
          stepRef.current((s) => s + 1)
        }
      }
      const settled = L.state === 'done'
      const A = settled ? doneSet : sets[from]
      const B = settled ? doneSet : sets[to]
      const mt = cycling ? Math.max(0, phaseT - HOLD) / MORPH : 0
      const follow = Math.min(1, dt * (L.state === 'loading' ? 14 : 4.5))
      for (let i = 0; i < n; i++) {
        const d = (i / n) * STAGGER
        const t = easeInOut(Math.min(1, Math.max(0, (mt - d) / (1 - STAGGER))))
        const bulge = 1 + Math.sin(Math.PI * t) * 0.14
        const k = i * 3
        const tx = (A[k] + (B[k] - A[k]) * t) * bulge
        const ty = (A[k + 1] + (B[k + 1] - A[k + 1]) * t) * bulge
        const tz = (A[k + 2] + (B[k + 2] - A[k + 2]) * t) * bulge
        // ease the live buffer toward the target (smooths state changes)
        const f = follow
        cur[k] += (tx - cur[k]) * f
        cur[k + 1] += (ty - cur[k + 1]) * f
        cur[k + 2] += (tz - cur[k + 2]) * f
      }

      angle += dt * (L.reduced ? 0 : 0.9 * sp * (1 - condense * 0.6))
      const tilt = 0.42 + (L.reduced ? 0 : Math.sin(now / 2600) * 0.12)
      const ca = Math.cos(angle)
      const sa = Math.sin(angle)
      const cb = Math.cos(tilt)
      const sb = Math.sin(tilt)
      const breathe = L.reduced ? 1 + Math.sin(now / 1400) * 0.035 : 1
      const cx = W / 2
      const cy = W / 2
      const R = W * 0.35 * breathe * (1 - condense * 0.38)
      const cam = 3.2
      const base = Math.max(1.4, W / 90)

      ctx.clearRect(0, 0, W, W)
      ctx.globalCompositeOperation = 'lighter'
      for (let i = 0; i < n; i++) {
        const k = i * 3
        let x = cur[k]
        let y = cur[k + 1]
        let z = cur[k + 2]
        if (scatter > 0.001) {
          const j = scatter * 0.16
          x += Math.sin(now / 90 + i * 1.7) * j
          y += Math.cos(now / 110 + i * 2.3) * j
          z += Math.sin(now / 130 + i) * j
          const s = 1 + scatter * 0.12
          x *= s
          y *= s
          z *= s
        }
        const x1 = x * ca + z * sa
        const z1 = -x * sa + z * ca
        const y2 = y * cb - z1 * sb
        const z2 = y * sb + z1 * cb
        const p = cam / (cam - z2)
        const depth = Math.min(1, Math.max(0, (z2 + 1.1) / 2.2))
        const s = base * (0.5 + depth * 1.05) * p
        ctx.globalAlpha = 0.12 + depth * 0.78
        ctx.drawImage(sprite, cx + x1 * R * p - s, cy + y2 * R * p - s, s * 2, s * 2)
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(frame)
    }

    const kick = () => {
      if (!raf && visible) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting && !document.hidden
      kick()
    })
    io.observe(wrap)
    const onVis = () => {
      visible = !document.hidden
      kick()
    }
    document.addEventListener('visibilitychange', onVis)
    kick()
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [sets, n, size])

  const cycledLabel = labels.length ? labels[(reduced ? 0 : step) % labels.length] : ''
  const text = state === 'done' ? doneLabel : state === 'error' ? errorLabel : cycledLabel
  const tint = state === 'done' ? DONE_TINT : state === 'error' ? ERROR_TINT : color
  const fontSize = Math.max(11, Math.min(15, size / 13))

  return (
    <div ref={wrapRef} className={cn('inline-flex flex-col items-center', className)} aria-busy={state === 'loading'}>
      <div className="relative" style={{ width: size, height: size }}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[18%] rounded-full blur-2xl transition-[background-color,opacity] duration-700"
          style={{ backgroundColor: tint, opacity: state === 'done' ? 0.22 : 0.14 }}
        />
        <canvas ref={canvasRef} aria-hidden className="relative block" style={{ width: size, height: size }} />
      </div>
      {showLabel && (
        <div className="relative -mt-1 flex h-7 items-center justify-center overflow-hidden" style={{ minWidth: size }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={text}
              className="whitespace-nowrap font-medium tracking-tight"
              style={{ fontSize, color: state === 'loading' ? 'rgb(228 228 231 / 0.78)' : tint }}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12, filter: 'blur(6px)' }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            >
              {text}
            </motion.span>
          </AnimatePresence>
        </div>
      )}
      {onRetry && (
        <div className="mt-2 flex h-8 items-center justify-center">
      <AnimatePresence>
        {state === 'error' && (
          <motion.button
            type="button"
            onClick={onRetry}
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-rose-500/12 px-3 text-xs font-semibold text-rose-200 ring-1 ring-rose-400/30 outline-none transition-colors hover:bg-rose-500/20 focus-visible:ring-2 focus-visible:ring-rose-300"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.4} /> Try again
          </motion.button>
        )}
      </AnimatePresence>
        </div>
      )}
      <span className="sr-only" role="status" aria-live="polite">
        {state === 'loading' ? labels[0] || 'Loading' : text}
      </span>
    </div>
  )
}
