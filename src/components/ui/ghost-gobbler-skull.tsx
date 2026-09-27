import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useResolvedTheme } from '@/lib/use-resolved-theme'

/* ------------------------------------------------------------------------------------------------
 * Ghost Gobbler Skull
 * A glossy vinyl-toy skull that tracks black-smoke ghosts drifting in from every direction,
 * sucks each one into its mouth, CHOMPS, and levels up a little after every bite.
 * SVG skull (layered gradients, speculars, AO) + a single canvas for the smoke.
 * --------------------------------------------------------------------------------------------- */

export type GhostGobblerMode = 'determinate' | 'indeterminate' | 'idle'

export type GhostGobblerSkullProps = {
  /** determinate: eat `total` ghosts (driven by `progress`, or autoplay when omitted). indeterminate: loop forever. idle: mascot only. */
  mode?: GhostGobblerMode
  /** 0–1. Controls how many of `total` ghosts may be eaten. Omit in determinate mode to autoplay to the finale. */
  progress?: number
  /** Number of ghosts in a full run. */
  total?: number
  /** Skull width in px. */
  size?: number
  /** Stage size relative to the skull (room for ghosts to fly in). */
  spread?: number
  /** Smoke colour of the ghosts. */
  ghostColor?: string
  /** Eight eye-glow colours, one per transformation level. */
  glowPalette?: string[]
  /** Animation speed multiplier. */
  speed?: number
  /** Eyes follow the pointer, hover = cheeky grin, click / Enter = chomp. */
  interactive?: boolean
  /** Async work to wait for. While pending the skull eats endlessly; resolve = finale, reject = failure + Retry. */
  task?: () => Promise<unknown>
  /** Fires once when the finale plays (all ghosts eaten / task resolved). */
  onComplete?: () => void
  /** Fires when `task` rejects. */
  onError?: (error: unknown) => void
  /** Accessible name + visible caption prefix. */
  label?: string
  /** Show the caption row (count, Replay / Retry). */
  showLabel?: boolean
  /** Show a Replay button after the finale. */
  replayable?: boolean
  /** Change to restart the run from zero. */
  resetKey?: React.Key
  className?: string
}

export const DEFAULT_GHOST_GLOW = ['#5eead4', '#34d399', '#a3e635', '#fbbf24', '#fb923c', '#f472b6', '#a78bfa', '#fde047']

type Phase = 'run' | 'finale' | 'done' | 'failed'
type Vec = { x: number; y: number }
type Puff = { ox: number; oy: number; s: number; ph: number }
type Ghost = {
  state: 'lurk' | 'fly' | 'suck' | 'flee' | 'rm'
  x: number
  y: number
  p0: Vec
  c: Vec
  dirIn: Vec
  t: number
  dur: number
  r: number
  alpha: number
  heading: number
  lurkA: number
  lurkV: number
  vx: number
  vy: number
  wob: number
  wobAmp: number
  hist: Vec[]
  puffs: Puff[]
  blink: number
  eaten: boolean
}
type Particle = {
  kind: 0 | 1 | 2 // 0 smoke, 1 spark star, 2 clack line
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  size: number
  grow: number
  alpha: number
  color?: string
  pull?: boolean
  rot?: number
}

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const rand = (a: number, b: number) => a + Math.random() * (b - a)
const hexRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '')
  const f = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.padEnd(6, '0')
  const n = parseInt(f.slice(0, 6), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const mix = (a: string, b: string, t: number) => {
  const A = hexRgb(a)
  const B = hexRgb(b)
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * t))
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

function makeSprite(rgb: [number, number, number], stops: [number, number][]) {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  for (const [o, a] of stops) grd.addColorStop(o, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`)
  g.fillStyle = grd
  g.fillRect(0, 0, 64, 64)
  return c
}

/* skull geometry (viewBox 0 0 240 240) */
const EYE_L = { x: 84, y: 104 }
const EYE_R = { x: 156, y: 104 }
const NOSE = { x: 120, y: 140 }
const MOUTH = { x: 120, y: 171 }
const CRANIUM =
  'M120 16 C170 16 210 48 212 96 C213 118 207 134 198 144 C194 150 190 156 182 160 C174 164 166 164 162 170 L78 170 C74 164 66 164 58 160 C50 156 46 150 42 144 C33 134 27 118 28 96 C30 48 70 16 120 16 Z'
const JAW = 'M60 148 C58 172 66 194 90 203 C104 208 136 208 150 203 C174 194 182 172 180 148 C170 158 150 167 120 167 C90 167 70 158 60 148 Z'
const NOSE_PATH = 'M120 125 C126 125 133 136 133 143 C133 149 127 151 123 148 L120 145 L117 148 C113 151 107 149 107 143 C107 136 114 125 120 125 Z'
const UPPER_TEETH = [
  { x: 80, w: 12, h: 15 },
  { x: 92.5, w: 13, h: 18 },
  { x: 106, w: 13.5, h: 20 },
  { x: 120.5, w: 13.5, h: 20 },
  { x: 134.5, w: 13, h: 18 },
  { x: 148, w: 12, h: 15 },
]
const LOWER_TEETH = [
  { x: 83, w: 11.5, h: 14 },
  { x: 95, w: 12.5, h: 16 },
  { x: 108, w: 11.5, h: 17 },
  { x: 120.5, w: 11.5, h: 17 },
  { x: 132.5, w: 12.5, h: 16 },
  { x: 145.5, w: 11.5, h: 14 },
]

export function GhostGobblerSkull({
  mode = 'determinate',
  progress,
  total = 8,
  size = 200,
  spread = 1.9,
  ghostColor = '#16121c',
  glowPalette = DEFAULT_GHOST_GLOW,
  speed = 1,
  interactive = true,
  task,
  onComplete,
  onError,
  label = 'Loading',
  showLabel = true,
  replayable = true,
  resetKey,
  className,
}: GhostGobblerSkullProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '')
  const id = (s: string) => `gg${uid}${s}`
  const rootRef = React.useRef<HTMLDivElement>(null)
  const stageRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const headRef = React.useRef<HTMLDivElement>(null)
  const shadowRef = React.useRef<SVGGElement>(null)
  const featRef = React.useRef<SVGGElement>(null)
  const specRef = React.useRef<SVGGElement>(null)
  const jawRef = React.useRef<SVGGElement>(null)
  const cavityRef = React.useRef<SVGEllipseElement>(null)
  const tongueRef = React.useRef<SVGEllipseElement>(null)
  const eyeRefs = [React.useRef<SVGGElement>(null), React.useRef<SVGGElement>(null)]
  const happyRefs = [React.useRef<SVGPathElement>(null), React.useRef<SVGPathElement>(null)]
  const dizzyRefs = [React.useRef<SVGGElement>(null), React.useRef<SVGGElement>(null)]
  const glowRefs = [React.useRef<SVGCircleElement>(null), React.useRef<SVGCircleElement>(null)]
  const browRefs = [React.useRef<SVGGElement>(null), React.useRef<SVGGElement>(null)]
  const flameRef = React.useRef<SVGGElement>(null)
  const burstRef = React.useRef<HTMLDivElement>(null)
  const chompRef = React.useRef<() => void>(() => {})

  const reduced = usePrefersReducedMotion()
  const theme = useResolvedTheme(rootRef)
  const effMode: GhostGobblerMode | 'task' = task ? 'task' : mode
  const target = effMode === 'determinate' ? (progress == null ? total : Math.round(clamp(progress) * total)) : 0

  const [eaten, setEaten] = React.useState(0)
  const [level, setLevel] = React.useState(0)
  const [phase, setPhase] = React.useState<Phase>('run')
  const [runId, setRunId] = React.useState(0)

  const W = Math.round(size * spread)
  const H = Math.round(size * spread * 0.88)
  const k = size / 240
  const skullLeft = (W - size) / 2
  const skullTop = (H - size) / 2 + size * 0.03

  const sim = React.useRef({
    time: 0,
    ghosts: [] as Ghost[],
    parts: [] as Particle[],
    eatenAnim: 0,
    cycleBase: 0,
    level: 0,
    phase: 'run' as Phase,
    target: 0,
    total: 8,
    mode: 'determinate' as GhostGobblerMode | 'task',
    taskState: 'idle' as 'idle' | 'pending' | 'resolved' | 'rejected',
    cooldown: 0.5,
    lastAngle: rand(0, Math.PI * 2),
    yaw: 0,
    pitch: 0,
    tilt: 0,
    lean: 0,
    eye: { x: 0, y: 0 },
    eyeJitter: { x: 0, y: 0 },
    jitterT: 1,
    jaw: 0,
    jawV: 0,
    snap: 0,
    sq: 0,
    sqV: 0,
    shake: 0,
    nod: 0,
    blinkIn: 2.5,
    blinkT: -1,
    happy: [0, 0],
    happyHold: [0, 0],
    cheeky: 0,
    cheekyHold: 0,
    sad: 0,
    flash: 0,
    flashDelay: 0,
    burp: 0,
    airChomp: -1,
    finaleT: 0,
    miniT: -1,
    pendingLevel: -1,
    hover: false,
    pointer: null as Vec | null,
    pointerAt: -10,
    wander: { x: 0, y: 0 },
    wanderIn: 1,
  })

  const cbRef = React.useRef({ onComplete, onError, speed, glowPalette, ghostColor, reduced, interactive, theme })
  cbRef.current = { onComplete, onError, speed, glowPalette, ghostColor, reduced, interactive, theme }

  /* keep sim in sync with props */
  sim.current.target = target
  sim.current.total = Math.max(1, total)
  sim.current.mode = effMode

  /* geometry shared with the loop */
  const geomRef = React.useRef({ W, H, k, skullLeft, skullTop, cx: W / 2, cy: skullTop + size * 0.45, mx: W / 2, my: skullTop + MOUTH.y * k })
  geomRef.current = { ...geomRef.current, W, H, k, skullLeft, skullTop, cx: W / 2, cy: skullTop + size * 0.45 }

  const newGhost = React.useCallback(
    (x: number, y: number): Ghost => {
      const r = size * rand(0.105, 0.12)
      const puffs: Puff[] = Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2 + rand(-0.3, 0.3)
        const d = i === 0 ? 0 : r * rand(0.28, 0.5)
        return { ox: Math.cos(a) * d, oy: Math.sin(a) * d * 0.85 - (i === 0 ? r * 0.08 : 0), s: r * rand(0.55, 0.78), ph: rand(0, 6.28) }
      })
      return {
        state: 'lurk', x, y, p0: { x, y }, c: { x, y }, dirIn: { x: 0, y: -1 }, t: 0, dur: 1.8, r, alpha: 0, heading: 0,
        lurkA: 0, lurkV: rand(0.25, 0.45) * (Math.random() < 0.5 ? -1 : 1), vx: 0, vy: 0, wob: rand(0, 6.28), wobAmp: rand(0.5, 1),
        hist: [], puffs, blink: rand(1, 4), eaten: false,
      }
    },
    [size],
  )

  const levelFor = React.useCallback((n: number) => {
    const S = sim.current
    if (S.mode === 'determinate') return n <= 0 ? 0 : Math.min(8, Math.ceil((n / S.total) * 8))
    if (S.mode === 'task') return Math.min(7, n)
    return Math.min(8, n - S.cycleBase)
  }, [])

  const reset = React.useCallback(() => {
    const S = sim.current
    S.ghosts = []
    S.parts = []
    S.eatenAnim = 0
    S.cycleBase = 0
    S.level = 0
    S.phase = 'run'
    S.cooldown = 0.45
    S.happy = [0, 0]
    S.happyHold = [0, 0]
    S.sad = 0
    S.miniT = -1
    S.pendingLevel = -1
    setEaten(0)
    setLevel(0)
    setPhase('run')
  }, [])

  const fail = React.useCallback(() => {
    const S = sim.current
    if (S.phase === 'failed') return
    S.phase = 'failed'
    setPhase('failed')
    const g = geomRef.current
    // ghosts in flight escape, plus a few break back out of the belly
    for (const gh of S.ghosts) {
      gh.state = 'flee'
      const a = Math.atan2(gh.y - g.cy, gh.x - g.cx)
      gh.vx = Math.cos(a) * 40
      gh.vy = Math.sin(a) * 40
    }
    if (!cbRef.current.reduced) {
      const n = Math.min(3, Math.max(1, S.eatenAnim))
      for (let i = 0; i < n; i++) {
        const gh = newGhost(g.mx, g.my)
        gh.state = 'flee'
        const a = -Math.PI / 2 + (i - (n - 1) / 2) * 0.9 + rand(-0.2, 0.2)
        gh.vx = Math.cos(a) * 60
        gh.vy = Math.sin(a) * 60
        gh.alpha = 0.2
        S.ghosts.push(gh)
      }
    }
    S.jawV += 4
  }, [newGhost])

  /* reset on key / mode change */
  const firstReset = React.useRef(true)
  React.useEffect(() => {
    if (firstReset.current) {
      firstReset.current = false
      return
    }
    reset()
  }, [resetKey, effMode, total, reset])

  /* progress moved backwards → rewind */
  React.useEffect(() => {
    const S = sim.current
    if (effMode !== 'determinate' || progress == null) return
    if (S.eatenAnim > target) {
      S.eatenAnim = target
      S.ghosts = S.ghosts.filter((g) => g.state === 'lurk')
      const L = levelFor(target)
      S.level = L
      setLevel(L)
      setEaten(target)
      if (S.phase !== 'run') {
        S.phase = 'run'
        setPhase('run')
      }
    }
  }, [target, progress, effMode, levelFor])

  /* async task */
  React.useEffect(() => {
    if (!task) return
    const S = sim.current
    let alive = true
    S.taskState = 'pending'
    task().then(
      () => {
        if (alive) S.taskState = 'resolved'
      },
      (err) => {
        if (!alive) return
        S.taskState = 'rejected'
        fail()
        cbRef.current.onError?.(err)
      },
    )
    return () => {
      alive = false
    }
  }, [task, runId, fail])

  const retry = () => {
    reset()
    setRunId((r) => r + 1)
  }

  /* sprites */
  const spritesRef = React.useRef<{ puff: HTMLCanvasElement; halo: HTMLCanvasElement } | null>(null)
  React.useEffect(() => {
    spritesRef.current = {
      puff: makeSprite(hexRgb(theme === 'dark' ? mix(ghostColor, '#000000', 0.55) : ghostColor), theme === 'dark' ? [[0, 0.95], [0.3, 0.8], [0.62, 0.34], [0.85, 0.08], [1, 0]] : [[0, 0.85], [0.3, 0.66], [0.62, 0.26], [0.85, 0.07], [1, 0]]),
      halo: makeSprite(theme === 'dark' ? [206, 196, 255] : [120, 110, 150], [[0, 0.6], [0.55, 0.3], [0.8, 0.1], [1, 0]]),
    }
  }, [ghostColor, theme])

  /* main loop */
  React.useEffect(() => {
    const canvas = canvasRef.current
    const stage = stageRef.current
    if (!canvas || !stage) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const S = sim.current
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)

    let raf = 0
    let last = 0
    let inView = true
    let running = false

    const onPointer = (e: PointerEvent) => {
      if (!cbRef.current.interactive) return
      const r = stage.getBoundingClientRect()
      S.pointer = { x: e.clientX - r.left, y: e.clientY - r.top }
      S.pointerAt = S.time
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    const emitSmoke = (x: number, y: number, n: number, spd: number, up: number, alpha: number, sz: number, life = 1.1) => {
      if (S.parts.length > 260) return
      for (let i = 0; i < n; i++) {
        const a = rand(0, Math.PI * 2)
        S.parts.push({ kind: 0, x, y, vx: Math.cos(a) * spd * rand(0.3, 1), vy: Math.sin(a) * spd * rand(0.3, 1) - up, life: 0, max: life * rand(0.7, 1.2), size: sz * rand(0.7, 1.2), grow: 1.4, alpha })
      }
    }
    const emitSparks = (x: number, y: number, n: number, color: string, spd: number) => {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + rand(-0.3, 0.3)
        const v = spd * rand(0.6, 1.1)
        S.parts.push({ kind: 1, x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: rand(0.5, 0.8), size: size * rand(0.018, 0.03), grow: 0, alpha: 1, color, rot: rand(0, 3) })
      }
    }

    const snapShut = (eatIt: boolean) => {
      S.snap = 0.14
      S.jawV = Math.min(S.jawV, -3)
      S.sqV += eatIt ? 7 : 4
      S.shake = eatIt ? 1 : 0.6
      const g = geomRef.current
      for (const side of [-1, 1]) {
        for (let i = 0; i < 3; i++) {
          const a = (side < 0 ? Math.PI : 0) + (i - 1) * 0.5
          S.parts.push({ kind: 2, x: g.mx + side * size * 0.24, y: g.my, vx: Math.cos(a) * size * 0.5, vy: Math.sin(a) * size * 0.5, life: 0, max: 0.22, size: size * 0.05, grow: 0, alpha: 0.9, rot: a })
        }
      }
    }

    const startFinale = () => {
      S.phase = 'finale'
      S.finaleT = 0
      setPhase('finale')
      for (const gh of S.ghosts) if (gh.state === 'lurk') gh.state = 'flee'
    }

    const eat = () => {
      const g = geomRef.current
      S.eatenAnim += 1
      setEaten(S.eatenAnim)
      const L = levelFor(S.eatenAnim)
      if (!cbRef.current.reduced) {
        snapShut(true)
        // smoke leaks out of the nose and the sockets
        emitSmoke(g.skullLeft + NOSE.x * k, g.skullTop + NOSE.y * k, 5, size * 0.12, size * 0.28, 0.32, size * 0.05, 0.9)
        emitSmoke(g.skullLeft + EYE_L.x * k, g.skullTop + (EYE_L.y - 18) * k, 3, size * 0.1, size * 0.25, 0.22, size * 0.045, 0.8)
        emitSmoke(g.skullLeft + EYE_R.x * k, g.skullTop + (EYE_R.y - 18) * k, 3, size * 0.1, size * 0.25, 0.22, size * 0.045, 0.8)
      } else {
        S.nod = 1
      }
      S.pendingLevel = L
      S.flashDelay = cbRef.current.reduced ? 0 : 0.2
      // per-level reaction: odd = happy squint, even = cheeky wink, 5 & 7 = burp puff
      if (L % 2 === 1) S.happyHold = [0.95, 0.95]
      else S.cheekyHold = 1.1
      if ((L === 5 || L === 7) && !cbRef.current.reduced) S.burp = 0.55
      if (S.mode === 'determinate' && S.eatenAnim >= S.total) startFinale()
      else if (S.mode === 'task' && S.taskState === 'resolved') startFinale()
      else if (S.mode === 'indeterminate' && L >= 8) S.miniT = 0
      S.cooldown = 0.32
    }

    const burpRing = () => {
      const g = geomRef.current
      if (cbRef.current.reduced) return
      const n = 26
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2
        S.parts.push({ kind: 0, x: g.mx, y: g.my + size * 0.02, vx: Math.cos(a) * size * 0.62, vy: Math.sin(a) * size * 0.2 - size * 0.34, life: 0, max: 1.3, size: size * 0.05, grow: 1.1, alpha: 0.38 })
      }
    }

    const fireBurst = (color: string) => {
      const el = burstRef.current
      if (!el) return
      el.style.background = `radial-gradient(closest-side, ${color}cc, ${color}33 55%, transparent)`
      el.animate(
        [
          { opacity: 0, transform: 'scale(0.4)' },
          { opacity: 0.9, transform: 'scale(1)', offset: 0.25 },
          { opacity: 0, transform: 'scale(1.5)' },
        ],
        { duration: cbRef.current.reduced ? 500 : 1100, easing: 'cubic-bezier(.2,.7,.2,1)' },
      )
    }

    const step = (dtRaw: number) => {
      const dt = Math.min(0.05, dtRaw)
      const cb = cbRef.current
      const rm = cb.reduced
      const sp = Math.max(0.2, cb.speed)
      const g = geomRef.current
      const pal = cb.glowPalette.length ? cb.glowPalette : DEFAULT_GHOST_GLOW
      S.time += dt
      const T = S.time

      /* ---------- scheduling ---------- */
      const active = S.ghosts.find((q) => q.state === 'fly' || q.state === 'suck' || q.state === 'rm')
      const lurker = S.ghosts.find((q) => q.state === 'lurk')
      const committed = active ? 1 : 0
      const pendingTask = S.mode === 'task' && S.taskState === 'pending'
      const moreNow = S.phase === 'run' && S.miniT < 0 && (S.mode === 'indeterminate' || pendingTask || (S.mode === 'determinate' && S.eatenAnim + committed < S.target))
      const moreLater = S.phase === 'run' && (S.mode === 'indeterminate' || pendingTask || (S.mode === 'determinate' && S.eatenAnim + committed < S.total))
      S.cooldown -= dt * sp
      if (S.mode === 'task' && S.taskState === 'resolved' && S.phase === 'run' && !active) startFinale()

      const hoverDist = size * 0.44
      const launch = (gh: Ghost) => {
        gh.state = rm ? 'rm' : 'fly'
        gh.t = 0
        gh.p0 = { x: gh.x, y: gh.y }
        const dx = gh.x - g.mx
        const dy = gh.y - g.my
        const d = Math.hypot(dx, dy) || 1
        // final approach always from the side / low front so the ghost never crosses the face
        let ha = Math.atan2(dy, dx)
        const right = Math.cos(ha) >= 0
        let low = Math.sin(ha)
        if (Math.abs(Math.cos(ha)) < 0.12) low = 0.5
        const lift = clamp(low, 0.08, 0.75) * rand(0.8, 1.1)
        ha = right ? Math.asin(lift) : Math.PI - Math.asin(lift)
        gh.dirIn = { x: Math.cos(ha), y: Math.sin(ha) }
        // control point pushed out around the head
        const sx0 = (gh.x - g.cx) / (Math.hypot(gh.x - g.cx, gh.y - g.cy) || 1)
        const sy0 = (gh.y - g.cy) / (Math.hypot(gh.x - g.cx, gh.y - g.cy) || 1)
        let bx = sx0 + gh.dirIn.x
        let by = sy0 + gh.dirIn.y
        const bl = Math.hypot(bx, by)
        if (bl < 0.3) {
          bx = right ? 1 : -1
          by = 0
        } else {
          bx /= bl
          by /= bl
        }
        const cr = size * rand(0.72, 0.9)
        gh.c = { x: g.cx + bx * cr * 1.15, y: g.cy + by * cr * 0.95 }
        gh.dur = rand(1.35, 1.8) * Math.min(1.2, Math.max(0.6, d / (size * 0.95)))
        if (rm) {
          gh.x = g.mx + gh.dirIn.x * hoverDist
          gh.y = g.my + gh.dirIn.y * hoverDist
          gh.alpha = 0
        }
      }
      const spawnAt = () => {
        S.lastAngle += 2.4 + rand(-0.35, 0.35)
        const R = Math.hypot(g.W, g.H) * 0.5
        return { x: g.cx + Math.cos(S.lastAngle) * R, y: g.cy + Math.sin(S.lastAngle) * R * 0.95 }
      }
      if (!active && moreNow && S.cooldown <= 0) {
        if (lurker && !rm) launch(lurker)
        else {
          const p = spawnAt()
          const gh = newGhost(p.x, p.y)
          S.ghosts.push(gh)
          launch(gh)
        }
      } else if (!rm && !lurker && moreLater && S.miniT < 0) {
        const busy = active && (active.state === 'suck' || active.t > 0.45)
        const waiting = !active && !moreNow
        if (busy || waiting) {
          const p = spawnAt()
          const gh = newGhost(p.x, p.y)
          gh.lurkA = S.lastAngle
          S.ghosts.push(gh)
        }
      }

      /* ---------- ghosts ---------- */
      let look: Vec | null = null
      let approach = 0
      let suckE = 0
      for (const gh of S.ghosts) {
        const px = gh.x
        const py = gh.y
        gh.wob += dt * 3.1
        gh.blink -= dt
        if (gh.blink < -0.14) gh.blink = rand(1.5, 4)
        if (gh.state === 'lurk') {
          gh.lurkA += gh.lurkV * dt * sp
          const R = Math.min(g.W, g.H) * 0.44
          const tx = g.cx + Math.cos(gh.lurkA) * R * 1.05
          const ty = g.cy + Math.sin(gh.lurkA) * R * 0.85 + Math.sin(gh.wob * 0.7) * size * 0.04
          const f = 1 - Math.exp(-dt * 1.3 * sp)
          gh.x += (tx - gh.x) * f
          gh.y += (ty - gh.y) * f
          gh.alpha = Math.min(0.85, gh.alpha + dt * 1.2)
          if (!look) look = { x: gh.x, y: gh.y }
        } else if (gh.state === 'fly') {
          gh.t += (dt * sp) / gh.dur
          const u = smooth(0, 1, gh.t) * 0.55 + Math.min(1, gh.t) * 0.45
          const hx = g.mx + gh.dirIn.x * hoverDist
          const hy = g.my + gh.dirIn.y * hoverDist
          const a = (1 - u) * (1 - u)
          const b = 2 * (1 - u) * u
          const c = u * u
          const wob = Math.sin(gh.wob * 1.6) * size * 0.05 * gh.wobAmp * (1 - u)
          gh.x = a * gh.p0.x + b * gh.c.x + c * hx - gh.dirIn.y * wob
          gh.y = a * gh.p0.y + b * gh.c.y + c * hy + gh.dirIn.x * wob
          gh.alpha = Math.min(1, gh.alpha + dt * 2.5)
          approach = Math.max(approach, smooth(0.45, 1, gh.t))
          look = { x: gh.x, y: gh.y }
          if (gh.t >= 1) {
            gh.state = 'suck'
            gh.t = 0
            gh.p0 = { x: gh.x, y: gh.y }
          }
        } else if (gh.state === 'suck') {
          gh.t = Math.min(1, gh.t + (dt * sp) / 0.5)
          const e = gh.t * gh.t * gh.t
          gh.x = gh.p0.x + (g.mx - gh.p0.x) * e + Math.sin(gh.wob * 9) * size * 0.006 * (1 - e)
          gh.y = gh.p0.y + (g.my - gh.p0.y) * e
          approach = 1
          suckE = Math.max(suckE, gh.t)
          look = { x: g.mx, y: g.my + size * 0.3 }
          if (gh.t >= 1 && !gh.eaten) {
            gh.eaten = true
            eat()
          }
        } else if (gh.state === 'rm') {
          gh.t += dt / 1.3
          gh.alpha = gh.t < 0.4 ? gh.t / 0.4 : gh.t < 0.75 ? 1 : Math.max(0, (1.1 - gh.t) / 0.35)
          look = { x: gh.x, y: gh.y }
          if (gh.t >= 0.75 && !gh.eaten) {
            gh.eaten = true
            eat()
          }
        } else if (gh.state === 'flee') {
          const a = Math.atan2(gh.y - g.cy, gh.x - g.cx)
          gh.vx += Math.cos(a) * size * 3 * dt
          gh.vy += Math.sin(a) * size * 3 * dt
          gh.x += gh.vx * dt + Math.sin(gh.wob * 2) * size * 0.3 * dt
          gh.y += gh.vy * dt
          gh.alpha = Math.min(1, gh.alpha + dt * 3)
        }
        const mvx = gh.x - px
        const mvy = gh.y - py
        if (Math.abs(mvx) + Math.abs(mvy) > 0.05) {
          const h = Math.atan2(mvy, mvx)
          let dh = h - gh.heading
          while (dh > Math.PI) dh -= Math.PI * 2
          while (dh < -Math.PI) dh += Math.PI * 2
          gh.heading += dh * Math.min(1, dt * 8)
        }
        gh.hist.push({ x: gh.x, y: gh.y })
        if (gh.hist.length > 60) gh.hist.shift()
        // wispy trail
        if (!rm && gh.state !== 'rm' && Math.random() < dt * (gh.state === 'suck' ? 80 : 46) && S.parts.length < 240) {
          const tail = gh.hist[Math.max(0, gh.hist.length - 1 - Math.floor(rand(6, 30)))]
          S.parts.push({ kind: 0, x: tail.x + rand(-1, 1) * gh.r * 0.3, y: tail.y + rand(-1, 1) * gh.r * 0.3, vx: rand(-1, 1) * size * 0.05, vy: rand(-1, 1) * size * 0.05 - size * 0.02, life: 0, max: rand(0.6, 1.1), size: gh.r * rand(0.35, 0.55), grow: 1.3, alpha: 0.26 * gh.alpha, pull: gh.state === 'suck' })
        }
      }
      S.ghosts = S.ghosts.filter((gh) => {
        if (gh.state === 'suck') return !gh.eaten
        if (gh.state === 'rm') return gh.t < 1.1
        if (gh.state === 'flee') return gh.x > -size && gh.x < g.W + size && gh.y > -size && gh.y < g.H + size
        return true
      })

      /* ---------- level up / finale timers ---------- */
      if (S.pendingLevel >= 0) {
        S.flashDelay -= dt
        if (S.flashDelay <= 0) {
          const L = S.pendingLevel
          S.pendingLevel = -1
          if (L !== S.level) {
            S.level = L
            setLevel(L)
            if (L > 0) {
              S.flash = 1
              if (!rm) emitSparks(g.cx, g.cy - size * 0.05, 10, pal[(L - 1) % pal.length], size * 0.9)
            }
          }
        }
      }
      if (S.miniT >= 0) {
        const prev = S.miniT
        S.miniT += dt * sp
        if (prev < 0.35 && S.miniT >= 0.35) {
          if (!rm) S.burp = 0.6
          burpRing()
          fireBurst(pal[7 % pal.length])
          S.happyHold = [1.4, 1.4]
        }
        if (S.miniT > 2.2) {
          S.miniT = -1
          S.cycleBase = S.eatenAnim
          S.level = 0
          setLevel(0)
          if (!rm) emitSmoke(g.cx, g.cy - size * 0.35, 8, size * 0.15, size * 0.2, 0.18, size * 0.06)
        }
      }
      if (S.phase === 'finale') {
        const prev = S.finaleT
        S.finaleT += dt * (rm ? 1 : sp)
        const at = (s: number) => prev < s && S.finaleT >= s
        if (at(0.1) && S.level < 8) {
          S.level = 8
          setLevel(8)
        }
        if (at(0.45)) {
          if (!rm) S.burp = 0.7
          burpRing()
          fireBurst(pal[7 % pal.length])
          if (!rm) emitSparks(g.cx, g.cy - size * 0.1, 16, pal[7 % pal.length], size * 1.2)
        }
        if (S.finaleT > 0.9) S.happyHold = [9, 9]
        if (at(1.3)) {
          S.phase = 'done'
          setPhase('done')
          cb.onComplete?.()
        }
      }
      if (S.phase === 'done') S.happyHold = S.hover ? [0, 0.4] : [9, 9]

      /* ---------- look target ---------- */
      const recentPointer = S.pointer && T - S.pointerAt < 2.5
      if (!look && recentPointer && S.pointer) look = S.pointer
      if (!look) {
        S.wanderIn -= dt
        if (S.wanderIn <= 0) {
          S.wanderIn = rand(1.2, 2.8)
          S.wander = { x: g.cx + rand(-1, 1) * size * 0.9, y: g.cy + rand(-0.8, 0.6) * size * 0.6 }
        }
        look = rm ? { x: g.cx, y: g.cy + size * 0.2 } : S.wander.x === 0 ? { x: g.cx, y: g.cy + size * 0.2 } : S.wander
      }
      const lx = clamp((look.x - g.cx) / (size * 0.9), -1, 1)
      const ly = clamp((look.y - g.cy) / (size * 0.8), -1, 1)

      /* ---------- expression state ---------- */
      const failed = S.phase === 'failed'
      S.sad += ((failed ? 1 : 0) - S.sad) * Math.min(1, dt * 5)
      S.cheekyHold -= dt
      const cheekyT = (S.hover && S.phase === 'run') || S.cheekyHold > 0 ? 1 : 0
      S.cheeky += (cheekyT - S.cheeky) * Math.min(1, dt * 8)
      for (let i = 0; i < 2; i++) {
        S.happyHold[i] -= dt
        const tgt = S.happyHold[i] > 0 && !failed ? 1 : 0
        S.happy[i] += (tgt - S.happy[i]) * Math.min(1, dt * 12)
      }
      S.flash = Math.max(0, S.flash - dt * 1.6)

      /* head angles */
      const turn = rm ? 0.35 : 1
      let yawT = lx * 24 * turn
      let pitchT = -ly * 14 * turn
      let tiltT = S.cheeky * 7 - lx * 3
      if (failed) {
        yawT = Math.sin(T * 2.6) * 10
        pitchT = Math.cos(T * 2.6) * 5 - 4
        tiltT = Math.sin(T * 1.3) * 7
      }
      if (S.phase === 'done') {
        yawT *= 0.3
        pitchT = pitchT * 0.3 + 3
        tiltT = -6 + Math.sin(T * 0.9) * 2
      }
      const fl = 1 - Math.exp(-dt * 6.5)
      S.yaw += (yawT - S.yaw) * fl
      S.pitch += (pitchT - S.pitch) * fl
      S.tilt += (tiltT - S.tilt) * fl
      S.lean += (lx * size * 0.04 - S.lean) * fl
      S.nod = Math.max(0, S.nod - dt * 1.6)
      const nodDip = Math.sin((1 - S.nod) * Math.PI) * S.nod * 14

      /* eyes */
      S.jitterT -= dt
      if (S.jitterT <= 0) {
        S.jitterT = rand(0.8, 2)
        S.eyeJitter = rm ? { x: 0, y: 0 } : { x: rand(-1, 1) * 0.8, y: rand(-1, 1) * 0.6 }
      }
      const ef = 1 - Math.exp(-dt * 14)
      S.eye.x += (lx * 6 + S.eyeJitter.x - S.eye.x) * ef
      S.eye.y += (ly * 5 + S.eyeJitter.y - S.eye.y) * ef
      let blink = 1
      if (!rm) {
        S.blinkIn -= dt
        if (S.blinkIn <= 0 && S.blinkT < 0) S.blinkT = 0
        if (S.blinkT >= 0) {
          S.blinkT += dt / 0.17
          blink = 1 - 0.92 * Math.sin(Math.PI * clamp(S.blinkT))
          if (S.blinkT >= 1) {
            S.blinkT = -1
            S.blinkIn = rand(2.2, 5.2)
          }
        }
      }

      /* jaw spring */
      const prevAir = S.airChomp
      S.airChomp -= dt
      if (prevAir > 0 && S.airChomp <= 0) snapShut(false)
      let jawT = approach * 0.9 + suckE * 0.15
      if (S.airChomp > 0) jawT = 1
      if (S.burp > 0) {
        S.burp -= dt
        jawT = Math.max(jawT, 0.5)
        if (S.burp <= 0) {
          snapShut(false)
          emitSmoke(g.mx, g.my, 5, size * 0.2, size * 0.25, 0.3, size * 0.05, 0.9)
        }
      }
      if (S.cheeky > 0.3 && approach < 0.1) jawT = Math.max(jawT, 0.1 * S.cheeky)
      if (failed) jawT = 0.34 + Math.sin(T * 5) * 0.05
      if (!rm && S.phase === 'run' && approach < 0.05) jawT += Math.sin(T * 1.9) * 0.02 + 0.02
      if (rm) jawT = Math.min(jawT, 0.3)
      if (S.snap > 0) {
        S.snap -= dt
        jawT = 0
      }
      const kj = S.snap > 0 ? 1600 : 170
      const cj = S.snap > 0 ? 34 : 19
      S.jawV += (kj * (jawT - S.jaw) - cj * S.jawV) * dt
      S.jaw += S.jawV * dt
      if (S.jaw < 0) {
        S.jaw = 0
        S.jawV = -S.jawV * 0.32
      }
      if (S.jaw > 1.15) {
        S.jaw = 1.15
        S.jawV = 0
      }

      /* squash & stretch */
      const sqT = -suckE * 0.5 - approach * 0.1
      S.sqV += (-320 * (S.sq - sqT) - 13 * S.sqV) * dt
      S.sq += S.sqV * dt
      S.shake = Math.max(0, S.shake - dt * 5)

      /* ---------- write DOM ---------- */
      const breath = rm ? 0 : S.phase === 'done' ? Math.sin(T * 1.2) * size * 0.012 : Math.sin(T * 1.9) * size * 0.016
      const shakeX = S.shake > 0 ? Math.sin(T * 90) * S.shake * size * 0.012 : 0
      const sq = rm ? 0 : S.sq
      const sx = 1 + sq * 0.07
      const sy = 1 - sq * 0.09
      if (headRef.current) {
        headRef.current.style.transform = `translate3d(${(S.lean + shakeX).toFixed(2)}px, ${(breath - sq * size * 0.02).toFixed(2)}px, 0) rotateX(${(S.pitch - nodDip).toFixed(2)}deg) rotateY(${S.yaw.toFixed(2)}deg) rotateZ(${S.tilt.toFixed(2)}deg) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`
      }
      if (shadowRef.current) {
        const s = 1 - breath / (size * 0.08) + sq * 0.05
        shadowRef.current.setAttribute('transform', `translate(${(120 + S.lean / k).toFixed(1)} 226) scale(${s.toFixed(3)} 1)`)
      }
      const fx = (S.yaw / 24) * 8
      const fy = (-S.pitch / 14) * 5
      featRef.current?.setAttribute('transform', `translate(${fx.toFixed(2)} ${fy.toFixed(2)})`)
      specRef.current?.setAttribute('transform', `translate(${(-fx * 0.8).toFixed(2)} ${(-fy * 0.7).toFixed(2)})`)
      const drop = S.jaw * 32
      jawRef.current?.setAttribute('transform', `translate(${(fx * 0.6).toFixed(2)} ${(fy * 0.4 + drop).toFixed(2)}) rotate(${(S.jaw * 3).toFixed(2)} 120 150)`)
      if (cavityRef.current) {
        cavityRef.current.setAttribute('ry', (5 + drop * 0.62).toFixed(2))
        cavityRef.current.setAttribute('cy', (171 + drop * 0.45 + fy * 0.5).toFixed(2))
        cavityRef.current.setAttribute('cx', (120 + fx * 0.8).toFixed(2))
      }
      if (tongueRef.current) {
        tongueRef.current.setAttribute('cy', (170 + drop * 0.85 + fy * 0.5).toFixed(2))
        tongueRef.current.setAttribute('cx', (120 + fx * 0.8).toFixed(2))
      }
      g.mx = g.skullLeft + (MOUTH.x + fx) * k + S.lean
      g.my = g.skullTop + (MOUTH.y + fy + drop * 0.45) * k + breath

      const surprise = approach > 0.3 && !failed ? 1.08 : 1
      const eyes = [EYE_L, EYE_R]
      for (let i = 0; i < 2; i++) {
        const e = eyes[i]
        const hap = S.happy[i]
        const scY = blink * (1 - hap) * (1 - S.sad) * surprise * (1 - S.cheeky * (i === 1 ? 0.25 : 0.05))
        const eg = eyeRefs[i].current
        if (eg) {
          eg.setAttribute('transform', `translate(${(e.x + S.eye.x).toFixed(2)} ${(e.y + S.eye.y).toFixed(2)}) scale(${surprise.toFixed(3)} ${Math.max(0.02, scY).toFixed(3)})`)
          eg.setAttribute('opacity', (1 - S.sad).toFixed(3))
        }
        happyRefs[i].current?.setAttribute('opacity', (hap * (1 - S.sad)).toFixed(3))
        const dz = dizzyRefs[i].current
        if (dz) {
          dz.setAttribute('transform', `translate(${e.x} ${e.y}) rotate(${((T * 320 * (i ? -1 : 1)) % 360).toFixed(1)})`)
          dz.setAttribute('opacity', S.sad.toFixed(3))
        }
        const gl = S.level > 0 ? (0.35 + (S.level / 8) * 0.5 + Math.sin(T * 2.4 + i) * 0.07 + S.flash * 0.4) * (1 - S.sad * 0.85) : S.flash * 0.5
        const gr = glowRefs[i].current
        if (gr) {
          gr.setAttribute('opacity', clamp(gl).toFixed(3))
          gr.setAttribute('r', (22 + S.flash * 6 + approach * 2).toFixed(2))
        }
        const raise = -approach * 3 - S.happy[i] * 2 - (i === 0 ? S.cheeky * 5 : -S.cheeky * 1.5)
        const rot = (i === 0 ? 1 : -1) * (S.sad * 14 - S.cheeky * (i === 0 ? 6 : -4))
        browRefs[i].current?.setAttribute('transform', `translate(0 ${raise.toFixed(2)}) rotate(${rot.toFixed(2)} ${e.x} ${e.y - 34})`)
      }
      if (flameRef.current && S.level === 7) {
        const f = 1 + Math.sin(T * 13) * 0.08 + Math.sin(T * 7.3) * 0.05
        flameRef.current.style.setProperty('--gg-flick', f.toFixed(3))
      }

      /* ---------- canvas ---------- */
      const sprites = spritesRef.current
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, g.W, g.H)
      if (!sprites) return
      const dark = cb.theme === 'dark'
      const haloA = 0.22

      // particles
      for (const p of S.parts) {
        p.life += dt
        if (p.pull) {
          const dx = g.mx - p.x
          const dy = g.my - p.y
          p.vx += (dx * 9 - dy * 4) * dt
          p.vy += (dy * 9 + dx * 4) * dt
        }
        const drag = p.kind === 0 ? 1.6 : 2.2
        p.vx *= Math.exp(-drag * dt)
        p.vy *= Math.exp(-drag * dt)
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.size += p.size * p.grow * dt * 0.6
      }
      S.parts = S.parts.filter((p) => p.life < p.max)
      for (const p of S.parts) {
        const a = p.alpha * (1 - p.life / p.max)
        if (p.kind === 0) {
          if (dark) {
            ctx.globalAlpha = a * 0.22
            ctx.drawImage(sprites.halo, p.x - p.size * 1.3, p.y - p.size * 1.3, p.size * 2.6, p.size * 2.6)
          }
          ctx.globalAlpha = a
          ctx.drawImage(sprites.puff, p.x - p.size, p.y - p.size, p.size * 2, p.size * 2)
        } else if (p.kind === 1) {
          ctx.globalAlpha = a
          ctx.fillStyle = p.color || '#fff'
          const s = p.size * (1 - (p.life / p.max) * 0.5)
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate((p.rot || 0) + p.life * 3)
          ctx.beginPath()
          for (let i = 0; i < 8; i++) {
            const rr = i % 2 ? s * 0.28 : s
            const an = (i / 8) * Math.PI * 2
            ctx.lineTo(Math.cos(an) * rr, Math.sin(an) * rr)
          }
          ctx.closePath()
          ctx.fill()
          ctx.restore()
        } else {
          ctx.globalAlpha = a
          ctx.strokeStyle = dark ? '#f4f4f5' : '#3f3f46'
          ctx.lineWidth = Math.max(1, size * 0.012)
          ctx.lineCap = 'round'
          const t = p.life / p.max
          const r0 = p.size * (0.4 + t)
          const ro = p.rot || 0
          ctx.beginPath()
          ctx.moveTo(p.x + Math.cos(ro) * r0, p.y + Math.sin(ro) * r0)
          ctx.lineTo(p.x + Math.cos(ro) * (r0 + p.size * 0.6), p.y + Math.sin(ro) * (r0 + p.size * 0.6))
          ctx.stroke()
        }
      }

      // ghosts
      for (const gh of S.ghosts) {
        const suck = gh.state === 'suck' ? gh.t : 0
        const e = suck * suck
        const scale = 1 - e * 0.85
        const ga = gh.alpha
        if (ga <= 0.01) continue
        const toM = Math.atan2(g.my - gh.y, g.mx - gh.x)
        const draw = (x: number, y: number, s: number, a: number) => {
          if (e > 0.02) {
            ctx.save()
            ctx.translate(x, y)
            ctx.rotate(toM)
            ctx.scale(1 + e * 2.2, 1 - e * 0.5)
            if (dark) {
              ctx.globalAlpha = a * haloA
              ctx.drawImage(sprites.halo, -s * 1.35, -s * 1.35, s * 2.7, s * 2.7)
            }
            ctx.globalAlpha = a
            ctx.drawImage(sprites.puff, -s, -s, s * 2, s * 2)
            ctx.restore()
          } else {
            if (dark) {
              ctx.globalAlpha = a * haloA
              ctx.drawImage(sprites.halo, x - s * 1.35, y - s * 1.35, s * 2.7, s * 2.7)
            }
            ctx.globalAlpha = a
            ctx.drawImage(sprites.puff, x - s, y - s, s * 2, s * 2)
          }
        }
        // tail strands follow the path history, sampled by arc length so the smoke stays continuous
        const hs = gh.hist
        const seg = gh.r * 0.26 * (1 - e * 0.3)
        const N = 12
        const pts: { x: number; y: number; d: number }[] = []
        {
          let hi = hs.length - 1
          let cx0 = gh.x
          let cy0 = gh.y
          let dir = gh.heading
          let need = seg
          for (let n = 1; n <= N; n++) {
            while (hi > 0) {
              const qx = hs[hi - 1].x
              const qy = hs[hi - 1].y
              const L = Math.hypot(qx - cx0, qy - cy0)
              if (L >= need) {
                const f = need / L
                dir = Math.atan2(cy0 - qy, cx0 - qx)
                cx0 += (qx - cx0) * f
                cy0 += (qy - cy0) * f
                need = seg
                break
              }
              need -= L
              cx0 = qx
              cy0 = qy
              hi--
            }
            if (hi <= 0) {
              cx0 -= Math.cos(dir) * seg * 0.6
              cy0 -= Math.sin(dir) * seg * 0.6
            }
            pts.push({ x: cx0, y: cy0, d: dir })
          }
        }
        for (let j = 0; j < 3; j++) {
          for (let i = N; i >= 1; i--) {
            const q = pts[i - 1]
            const u = i / N
            const off = (j - 1) * gh.r * 0.42 * Math.sin(Math.PI * Math.min(1, u * 1.3)) + Math.sin(T * 5.5 + i * 0.7 + j * 2.1) * gh.r * 0.28 * u
            const nx = -Math.sin(q.d)
            const ny = Math.cos(q.d)
            const s = gh.r * (0.62 - u * 0.44) * scale
            draw(q.x + nx * off, q.y + ny * off + (1 - e) * gh.r * 0.06 * i * 0.5, s, ga * 0.6 * (1 - u * 0.85))
          }
        }
        // head
        for (const p of gh.puffs) {
          const jx = Math.sin(T * 2.3 + p.ph) * gh.r * 0.11
          const jy = Math.cos(T * 1.9 + p.ph) * gh.r * 0.11
          const sqz = 1 - e * 0.7
          draw(gh.x + (p.ox + jx) * scale, gh.y + (p.oy + jy) * scale * sqz, p.s * scale * (1 + Math.sin(T * 3 + p.ph) * 0.05), ga)
        }
        // curling wisps around the head
        for (let w = 0; w < 3; w++) {
          const wa = T * (1.6 + w * 0.4) + w * 2.1 + gh.wob * 0.2
          const wr = gh.r * (0.72 + Math.sin(T * 2 + w) * 0.12) * scale
          draw(gh.x + Math.cos(wa) * wr, gh.y + Math.sin(wa) * wr * 0.8, gh.r * 0.32 * scale, ga * 0.45)
        }
        // eyes
        const scared = gh.state === 'suck' || gh.state === 'flee'
        const eyeOff = gh.r * 0.14
        const ex = gh.x + Math.cos(gh.heading) * eyeOff
        const ey = gh.y + Math.sin(gh.heading) * eyeOff * 0.6 - gh.r * 0.08 * scale
        const blinkS = gh.blink < 0 ? 0.15 : 1
        const ew = gh.r * (scared ? 0.15 : 0.12) * scale
        const eh = gh.r * (scared ? 0.19 : 0.2) * scale * blinkS
        ctx.globalAlpha = ga * (1 - e * 0.6)
        ctx.fillStyle = '#f7f5ff'
        ctx.shadowColor = dark ? 'rgba(200,190,255,0.95)' : 'rgba(255,255,255,0.6)'
        ctx.shadowBlur = gh.r * 0.5
        for (const s of [-1, 1]) {
          ctx.beginPath()
          ctx.ellipse(ex + s * gh.r * 0.26 * scale, ey, ew, eh, 0, 0, Math.PI * 2)
          ctx.fill()
        }
        if (scared) {
          ctx.beginPath()
          ctx.ellipse(ex, ey + gh.r * 0.3 * scale, gh.r * 0.08 * scale, gh.r * 0.11 * scale, 0, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.shadowBlur = 0
      }

      // orbiting embers (level 5+)
      if (S.level >= 5 && !rm && S.phase !== 'failed') {
        const col = pal[(S.level - 1) % pal.length]
        ctx.fillStyle = col
        ctx.shadowColor = col
        ctx.shadowBlur = size * 0.05
        for (let i = 0; i < 3; i++) {
          const a = T * 1.5 + (i * Math.PI * 2) / 3
          const x = g.cx + S.lean + Math.cos(a) * size * 0.6
          const y = g.cy - size * 0.02 + Math.sin(a) * size * 0.14 + breath
          const front = Math.sin(a) > -0.1
          ctx.globalAlpha = front ? 0.95 : 0.3
          ctx.beginPath()
          ctx.arc(x, y, size * (front ? 0.014 : 0.009), 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.shadowBlur = 0
      }
      ctx.globalAlpha = 1
    }

    const frame = (now: number) => {
      const dt = last ? (now - last) / 1000 : 0.016
      last = now
      step(dt)
      raf = requestAnimationFrame(frame)
    }
    const sync = () => {
      const should = inView && !document.hidden
      if (should && !running) {
        running = true
        last = 0
        raf = requestAnimationFrame(frame)
      } else if (!should && running) {
        running = false
        cancelAnimationFrame(raf)
      }
    }
    const io = new IntersectionObserver(([en]) => {
      inView = en.isIntersecting
      sync()
    })
    io.observe(stage)
    document.addEventListener('visibilitychange', sync)
    sync()
    chompRef.current = () => {
      if (S.airChomp > 0 || S.ghosts.some((q) => q.state === 'suck')) return
      if (cbRef.current.reduced) {
        S.nod = 1
        return
      }
      S.airChomp = 0.16
    }
    return () => {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [W, H, size, k, levelFor, newGhost])

  /* ---------- colours ---------- */
  const dark = theme === 'dark'
  const glow = level > 0 ? glowPalette[(level - 1) % glowPalette.length] : glowPalette[0]
  const tint = level >= 8 ? '#ffe7a3' : level >= 6 ? '#d9ccff' : level >= 4 ? '#ffd9a8' : '#ffffff'
  const tintAmt = level >= 8 ? 0.28 : level >= 4 ? 0.24 : 0
  const bone = (dark ? ['#ffffff', '#f1eee8', '#d6d0c6', '#8e8790'] : ['#ffffff', '#f6f2ea', '#e1dacd', '#b3a898']).map((c, i) => (i === 0 ? c : mix(c, tint, tintAmt * (i === 3 ? 0.6 : 1))))
  const aoColor = dark ? '#221c2a' : '#6d5a48'
  const rim = dark ? '#b8c6ff' : '#ffffff'
  const done = phase === 'done' || phase === 'finale'
  const dotColor = (i: number) => glowPalette[(Math.min(8, Math.ceil(((i + 1) / total) * 8)) - 1) % glowPalette.length]

  const caption =
    phase === 'failed'
      ? 'The ghosts got away'
      : done
        ? effMode === 'determinate'
          ? `All ${total} ghosts gobbled`
          : 'Done — belly full'
        : effMode === 'determinate'
          ? `${eaten} / ${total} ghosts`
          : effMode === 'idle'
            ? label
            : `${label}…`
  const live =
    phase === 'failed'
      ? `${label} failed. Retry available.`
      : done
        ? `${label} complete.`
        : effMode === 'determinate'
          ? `${label}, ${eaten} of ${total}`
          : effMode === 'idle'
            ? ''
            : `${label}…`

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      chompRef.current()
    }
  }
  const url = (s: string) => `url(#${id(s)})`

  return (
    <div ref={rootRef} className={cn('inline-flex flex-col items-center', className)}>
      <div
        ref={stageRef}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-label={interactive ? 'Skull mascot, press Enter to make it chomp' : undefined}
        aria-hidden={interactive ? undefined : true}
        onKeyDown={interactive ? onKey : undefined}
        onPointerDown={interactive ? () => chompRef.current() : undefined}
        onPointerEnter={() => (sim.current.hover = interactive)}
        onPointerLeave={() => (sim.current.hover = false)}
        className={cn(
          'relative select-none rounded-3xl outline-none [-webkit-tap-highlight-color:transparent]',
          interactive && 'cursor-pointer focus-visible:ring-2 focus-visible:ring-violet-400/70',
        )}
        style={{ width: W, height: H }}
      >
        {/* glow burst behind the skull */}
        <div
          ref={burstRef}
          className="pointer-events-none absolute rounded-full opacity-0"
          style={{ left: W / 2 - size * 0.75, top: skullTop + size * 0.45 - size * 0.75, width: size * 1.5, height: size * 1.5 }}
        />
        {/* floor shadow */}
        <svg className="pointer-events-none absolute overflow-visible" style={{ left: skullLeft, top: skullTop, width: size, height: size }} viewBox="0 0 240 240" aria-hidden>
          <defs>
            <radialGradient id={id('floor')}>
              <stop offset="0" stopColor={dark ? '#000' : '#3f3428'} stopOpacity={dark ? 0.75 : 0.34} />
              <stop offset="0.6" stopColor={dark ? '#000' : '#3f3428'} stopOpacity={dark ? 0.28 : 0.1} />
              <stop offset="1" stopColor="#000" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={id('floorGlow')}>
              <stop offset="0" stopColor={glow} stopOpacity={level > 0 && phase !== 'failed' ? (dark ? 0.4 : 0.25) : 0} />
              <stop offset="1" stopColor={glow} stopOpacity="0" />
            </radialGradient>
          </defs>
          <g ref={shadowRef} transform="translate(120 226)">
            <ellipse rx="96" ry="15" fill={url('floorGlow')} />
            <ellipse rx="72" ry="9" fill={url('floor')} />
          </g>
        </svg>

        {/* the skull */}
        <div className="pointer-events-none absolute" style={{ left: skullLeft, top: skullTop, width: size, height: size, perspective: size * 4 }}>
          <div ref={headRef} className="h-full w-full will-change-transform" style={{ transformOrigin: '50% 62%' }}>
            <svg viewBox="0 0 240 240" width={size} height={size} className="overflow-visible" aria-hidden>
              <defs>
                <radialGradient id={id('bone')} cx="0.38" cy="0.28" r="0.8">
                  <stop offset="0" stopColor={bone[0]} />
                  <stop offset="0.32" stopColor={bone[1]} />
                  <stop offset="0.72" stopColor={bone[2]} />
                  <stop offset="1" stopColor={bone[3]} />
                </radialGradient>
                <radialGradient id={id('jawBone')} cx="0.4" cy="0.05" r="1">
                  <stop offset="0" stopColor={bone[1]} />
                  <stop offset="0.55" stopColor={bone[2]} />
                  <stop offset="1" stopColor={bone[3]} />
                </radialGradient>
                <linearGradient id={id('ao')} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0.55" stopColor={aoColor} stopOpacity="0" />
                  <stop offset="1" stopColor={aoColor} stopOpacity={dark ? 0.55 : 0.32} />
                </linearGradient>
                <linearGradient id={id('rim')} x1="0.2" y1="0" x2="0.8" y2="1">
                  <stop offset="0.45" stopColor={rim} stopOpacity="0" />
                  <stop offset="1" stopColor={rim} stopOpacity={dark ? 0.9 : 0.8} />
                </linearGradient>
                <linearGradient id={id('bevel')} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={aoColor} stopOpacity={dark ? 0.7 : 0.5} />
                  <stop offset="0.5" stopColor={aoColor} stopOpacity="0.12" />
                  <stop offset="1" stopColor="#ffffff" stopOpacity="0.95" />
                </linearGradient>
                <radialGradient id={id('socket')} cx="0.5" cy="0.62" r="0.62">
                  <stop offset="0" stopColor="#2a211d" />
                  <stop offset="0.7" stopColor="#140f0d" />
                  <stop offset="1" stopColor="#070505" />
                </radialGradient>
                <radialGradient id={id('eyeGlow')}>
                  <stop offset="0" stopColor={glow} stopOpacity="0.95" />
                  <stop offset="0.55" stopColor={glow} stopOpacity="0.45" />
                  <stop offset="1" stopColor={glow} stopOpacity="0" />
                </radialGradient>
                <radialGradient id={id('ball')} cx="0.36" cy="0.3" r="0.75">
                  <stop offset="0" stopColor={level >= 4 ? mix('#5e4d45', glow, 0.35) : '#5e4d45'} />
                  <stop offset="0.45" stopColor="#261c18" />
                  <stop offset="1" stopColor="#040303" />
                </radialGradient>
                <linearGradient id={id('tooth')} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ffffff" />
                  <stop offset="0.6" stopColor={mix('#f3efe7', tint, tintAmt * 0.5)} />
                  <stop offset="1" stopColor={mix(dark ? '#bdb5ab' : '#cfc6b8', tint, tintAmt * 0.5)} />
                </linearGradient>
                <linearGradient id={id('toothLow')} x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0" stopColor="#ffffff" />
                  <stop offset="0.55" stopColor={mix('#f1ece3', tint, tintAmt * 0.5)} />
                  <stop offset="1" stopColor={mix(dark ? '#aaa298' : '#c6bcad', tint, tintAmt * 0.5)} />
                </linearGradient>
                <radialGradient id={id('cavity')} cx="0.5" cy="0.35" r="0.7">
                  <stop offset="0" stopColor={level > 0 ? mix('#3a1d1d', glow, 0.35) : '#3a1d1d'} />
                  <stop offset="1" stopColor="#0b0606" />
                </radialGradient>
                <radialGradient id={id('tongue')} cx="0.45" cy="0.3" r="0.8">
                  <stop offset="0" stopColor="#ff9fb0" />
                  <stop offset="1" stopColor="#c2415d" />
                </radialGradient>
                <linearGradient id={id('gold')} x1="0" y1="0" x2="0.3" y2="1">
                  <stop offset="0" stopColor="#fff6c2" />
                  <stop offset="0.45" stopColor="#f7c948" />
                  <stop offset="1" stopColor="#b7791f" />
                </linearGradient>
                <linearGradient id={id('flame')} x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0" stopColor={glow} />
                  <stop offset="0.7" stopColor="#fde68a" />
                  <stop offset="1" stopColor="#fffbeb" stopOpacity="0.6" />
                </linearGradient>
                <clipPath id={id('clipC')}>
                  <path d={CRANIUM} />
                </clipPath>
                <clipPath id={id('clipJ')}>
                  <path d={JAW} />
                </clipPath>
                <filter id={id('blur6')} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
                <filter id={id('blur3')} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" />
                </filter>
                <filter id={id('glowF')} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2.2" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* mouth cavity + tongue (revealed when the jaw drops) */}
              <ellipse ref={cavityRef} cx="120" cy="171" rx="41" ry="5" fill={url('cavity')} />
              <ellipse ref={tongueRef} cx="120" cy="170" rx="19" ry="8" fill={url('tongue')} />

              {/* jaw */}
              <g ref={jawRef}>
                <path d={JAW} fill={url('jawBone')} />
                <g clipPath={url('clipJ')}>
                  <path d={JAW} fill="none" stroke={url('rim')} strokeWidth="6" />
                  <ellipse cx="120" cy="214" rx="70" ry="16" fill={aoColor} opacity={dark ? 0.45 : 0.22} filter={url('blur6')} />
                  <ellipse cx="98" cy="188" rx="24" ry="8" fill="#fff" opacity="0.55" filter={url('blur6')} />
                </g>
                {LOWER_TEETH.map((t, i) => (
                  <g key={i}>
                    <rect x={t.x} y={167} width={t.w} height={t.h} rx={5} fill={url('toothLow')} stroke={aoColor} strokeOpacity="0.3" strokeWidth="0.8" />
                    <rect x={t.x + 2.5} y={169} width={t.w * 0.28} height={t.h * 0.4} rx={1.5} fill="#fff" opacity="0.7" />
                  </g>
                ))}
              </g>

              {/* cranium */}
              <path d={CRANIUM} fill={url('bone')} />
              <g clipPath={url('clipC')}>
                <rect x="0" y="0" width="240" height="175" fill={url('ao')} />
                <ellipse cx="24" cy="126" rx="14" ry="30" fill={aoColor} opacity={dark ? 0.34 : 0.2} filter={url('blur6')} />
                <ellipse cx="216" cy="126" rx="14" ry="30" fill={aoColor} opacity={dark ? 0.42 : 0.26} filter={url('blur6')} />
                <path d={CRANIUM} fill="none" stroke={url('rim')} strokeWidth="8" filter={url('blur3')} />
                <path d={CRANIUM} fill="none" stroke={url('rim')} strokeWidth="2" opacity="0.8" />
                {level > 0 && <ellipse cx="120" cy="60" rx="80" ry="46" fill={glow} opacity={0.05 + level * 0.012} filter={url('blur6')} />}
              </g>

              {/* face features (parallax with head turn) */}
              <g ref={featRef}>
                <ellipse cx="62" cy="142" rx="14" ry="8" fill="#fff" opacity="0.7" filter={url('blur3')} />
                <ellipse cx="178" cy="142" rx="12" ry="7" fill="#fff" opacity="0.45" filter={url('blur3')} />
                <motion.g initial={false} animate={{ opacity: level >= 2 && phase !== 'failed' ? 1 : 0 }} transition={{ duration: 0.6 }}>
                  <ellipse cx="60" cy="146" rx="13" ry="7.5" fill="#ff7f9c" opacity="0.45" filter={url('blur3')} />
                  <ellipse cx="180" cy="146" rx="13" ry="7.5" fill="#ff7f9c" opacity="0.45" filter={url('blur3')} />
                </motion.g>

                {[0, 1].map((i) => (
                  <g key={i} ref={browRefs[i]}>
                    <path d={i === 0 ? 'M60 70 Q82 55 106 65' : 'M134 65 Q158 55 180 70'} fill="none" stroke={aoColor} strokeOpacity={dark ? 0.5 : 0.3} strokeWidth="10" strokeLinecap="round" transform="translate(0 4)" filter={url('blur3')} />
                    <path d={i === 0 ? 'M60 70 Q82 55 106 65' : 'M134 65 Q158 55 180 70'} fill="none" stroke={bone[1]} strokeWidth="9" strokeLinecap="round" />
                    <path d={i === 0 ? 'M66 66 Q82 57 98 61' : 'M142 61 Q158 57 172 65'} fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
                  </g>
                ))}

                {[EYE_L, EYE_R].map((e, i) => (
                  <g key={i}>
                    <ellipse cx={e.x} cy={e.y} rx="33" ry="30.5" fill={url('bevel')} transform={`rotate(${i ? 7 : -7} ${e.x} ${e.y})`} />
                    <ellipse cx={e.x} cy={e.y + 0.5} rx="29" ry="26.5" fill={url('socket')} transform={`rotate(${i ? 7 : -7} ${e.x} ${e.y})`} />
                    <circle ref={glowRefs[i]} cx={e.x} cy={e.y + 2} r="22" fill={url('eyeGlow')} opacity="0" />
                    <g ref={eyeRefs[i]} transform={`translate(${e.x} ${e.y})`}>
                      <circle r="15" fill={url('ball')} />
                      <path d="M-11 8 A 14 14 0 0 0 11 8" fill="none" stroke={level > 0 ? glow : '#8a7a70'} strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" />
                      <ellipse cx="-5" cy="-6" rx="5.2" ry="3.8" fill="#fff" transform="rotate(-30 -5 -6)" />
                      {level >= 4 ? (
                        <path d="M5.5 1.5 l1.1 2.7 2.7 1.1 -2.7 1.1 -1.1 2.7 -1.1 -2.7 -2.7 -1.1 2.7 -1.1z" fill="#fff" opacity="0.95" />
                      ) : (
                        <circle cx="5.5" cy="5" r="1.9" fill="#fff" opacity="0.75" />
                      )}
                    </g>
                    <path ref={happyRefs[i]} d={`M${e.x - 13} ${e.y + 5} Q${e.x} ${e.y - 11} ${e.x + 13} ${e.y + 5}`} fill="none" stroke={level > 0 ? glow : '#f4efe6'} strokeWidth="5" strokeLinecap="round" opacity="0" filter={url('glowF')} />
                    <g ref={dizzyRefs[i]} opacity="0" transform={`translate(${e.x} ${e.y})`}>
                      <path d="M0 -2 a2 2 0 1 1 -2 2 a4 4 0 1 1 4 4 a6.5 6.5 0 1 1 -6.5 -6.5 a9.5 9.5 0 1 1 9.5 9.5" fill="none" stroke="#e9e4ff" strokeWidth="2.4" strokeLinecap="round" />
                    </g>
                  </g>
                ))}

                <path d={NOSE_PATH} fill={url('bevel')} transform="translate(120 140) scale(1.2) translate(-120 -140)" />
                <path d={NOSE_PATH} fill={url('socket')} />

                <ellipse cx="120" cy="154" rx="46" ry="6" fill={aoColor} opacity={dark ? 0.45 : 0.25} filter={url('blur3')} />
                {UPPER_TEETH.map((t, i) => (
                  <g key={i}>
                    <rect x={t.x} y={173 - t.h} width={t.w} height={t.h} rx={5} fill={url('tooth')} stroke={aoColor} strokeOpacity="0.32" strokeWidth="0.8" />
                    <rect x={t.x + 2.4} y={173 - t.h + 2.5} width={t.w * 0.28} height={t.h * 0.42} rx={1.6} fill="#fff" opacity="0.85" />
                  </g>
                ))}

                <motion.path d="M131 24 L124 38 L132 46 L125 60" fill="none" stroke={glow} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" filter={url('glowF')} initial={false} animate={{ pathLength: level >= 3 ? 1 : 0, opacity: level >= 3 ? 1 : 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} />
                <motion.path d="M78 36 L86 46 L80 54 L88 62" fill="none" stroke={glow} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" filter={url('glowF')} initial={false} animate={{ pathLength: level >= 6 ? 1 : 0, opacity: level >= 6 ? 1 : 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} />
              </g>

              {/* specular highlights (slide opposite the turn) */}
              <g ref={specRef} clipPath={url('clipC')}>
                <ellipse cx="86" cy="44" rx="36" ry="17" fill="#fff" opacity={dark ? 0.8 : 0.95} transform="rotate(-24 86 44)" filter={url('blur6')} />
                <ellipse cx="78" cy="40" rx="11" ry="5" fill="#fff" opacity="0.95" transform="rotate(-28 78 40)" />
                <ellipse cx="190" cy="86" rx="5" ry="16" fill="#fff" opacity="0.5" transform="rotate(12 190 86)" filter={url('blur3')} />
              </g>

              {/* sweat drop (failure) */}
              <motion.g initial={false} animate={{ opacity: phase === 'failed' ? 1 : 0, y: phase === 'failed' ? 0 : -8 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}>
                <path d="M196 58 C196 58 186 72 186 79 C186 85 191 89 196 89 C201 89 206 85 206 79 C206 72 196 58 196 58 Z" fill="#9fd8ff" stroke="#5aa9e6" strokeWidth="1.2" />
                <ellipse cx="192" cy="78" rx="2.4" ry="4" fill="#fff" opacity="0.85" />
              </motion.g>

              {/* flames (level 7) */}
              <motion.g ref={flameRef} initial={false} animate={{ opacity: level === 7 && phase !== 'failed' ? 1 : 0, scale: level === 7 ? 1 : 0.4 }} style={{ transformOrigin: '120px 30px' }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
                {[
                  [94, 30, -14, 0.8],
                  [120, 20, 0, 1.1],
                  [146, 30, 14, 0.8],
                ].map(([x, y, r, s], i) => (
                  <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
                    <path d="M0 0 C-8 -4 -8 -15 0 -28 C8 -15 8 -4 0 0 Z" fill={url('flame')} filter={url('glowF')} style={{ transform: 'scaleY(var(--gg-flick, 1))', transformOrigin: '0 0' }} />
                  </g>
                ))}
              </motion.g>

              {/* crown (level 8) */}
              <AnimatePresence>
                {level >= 8 && phase !== 'failed' && (
                  <motion.g
                    key="crown"
                    initial={{ opacity: 0, y: -40, rotate: -30 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 13 }}
                    style={{ transformOrigin: '150px 24px' }}
                  >
                    <g transform="translate(150 26) rotate(16)">
                      <ellipse cx="0" cy="4" rx="34" ry="6" fill={aoColor} opacity="0.25" filter={url('blur3')} />
                      <path d="M-30 2 L-34 -24 L-16 -10 L0 -32 L16 -10 L34 -24 L30 2 Q0 8 -30 2 Z" fill={url('gold')} stroke="#a16207" strokeOpacity="0.5" strokeWidth="1" strokeLinejoin="round" />
                      <path d="M-26 -4 Q0 2 26 -4" fill="none" stroke="#fff7d1" strokeWidth="2" opacity="0.8" />
                      {[-34, 0, 34].map((x, i) => (
                        <circle key={i} cx={x} cy={i === 1 ? -33 : -25} r="3.4" fill="#fff4bf" />
                      ))}
                      <circle cx="0" cy="-8" r="4.6" fill={glowPalette[5 % glowPalette.length]} stroke="#fff" strokeOpacity="0.6" />
                      <circle cx="-17" cy="-5" r="3.2" fill={glowPalette[0]} />
                      <circle cx="17" cy="-5" r="3.2" fill={glowPalette[6 % glowPalette.length]} />
                      <ellipse cx="-14" cy="-16" rx="3" ry="6" fill="#fff" opacity="0.6" transform="rotate(20 -14 -16)" />
                    </g>
                  </motion.g>
                )}
              </AnimatePresence>
            </svg>
          </div>
        </div>

        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" style={{ width: W, height: H }} aria-hidden />
      </div>

      {showLabel && (
        <div className="mt-1 flex min-h-8 items-center gap-2 text-[12px] font-medium tabular-nums text-zinc-600 dark:text-zinc-400">
          <div
            role="progressbar"
            aria-label={label}
            aria-valuemin={effMode === 'determinate' ? 0 : undefined}
            aria-valuemax={effMode === 'determinate' ? total : undefined}
            aria-valuenow={effMode === 'determinate' ? eaten : undefined}
            aria-valuetext={effMode === 'determinate' ? `${eaten} of ${total}` : undefined}
            className="flex items-center gap-2"
          >
            {effMode === 'determinate' && (
              <span className="flex gap-1" aria-hidden>
                {Array.from({ length: total }, (_, i) => (
                  <span
                    key={i}
                    className={cn('h-1.5 w-1.5 rounded-full transition-all duration-300', i < eaten ? 'scale-125' : 'bg-zinc-300 dark:bg-zinc-700')}
                    style={i < eaten ? { background: dotColor(i), boxShadow: `0 0 6px ${dotColor(i)}` } : undefined}
                  />
                ))}
              </span>
            )}
            <span>{caption}</span>
          </div>
          {phase === 'failed' && (
            <button
              type="button"
              onClick={task ? retry : reset}
              className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-2.5 py-1 text-[11px] font-semibold text-white outline-none transition hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-violet-400 active:scale-95 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <RotateCcw className="h-3 w-3" aria-hidden /> Retry
            </button>
          )}
          {phase === 'done' && replayable && (
            <button
              type="button"
              onClick={task ? retry : reset}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold text-zinc-700 ring-1 ring-black/10 outline-none transition hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-violet-400 active:scale-95 dark:text-zinc-200 dark:ring-white/15 dark:hover:bg-white/10"
            >
              <RotateCcw className="h-3 w-3" aria-hidden /> Replay
            </button>
          )}
        </div>
      )}
      <span role="status" aria-live="polite" className="sr-only">
        {live}
      </span>
    </div>
  )
}
