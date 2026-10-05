import * as React from 'react'
import { AnimatePresence, motion, useSpring, useTransform } from 'motion/react'
import { ArrowRight, Check, CircleAlert, Pause, Play, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useResolvedTheme, type ThemeMode } from '@/lib/use-resolved-theme'

export type SnakeLoaderState = 'loading' | 'done' | 'error'
export type SnakeLoaderSkin = 'tiles' | 'lcd'

export type SnakeLoaderProps = {
  /** Progress 0–100. Omit for an indeterminate loader. Reaching 100 counts as done. */
  progress?: number
  /** Loader state. `error` crashes the snake and tints progress rose. */
  state?: SnakeLoaderState
  /** Status line while loading. */
  label?: string
  /** Optional secondary line (current step, file count, ETA…). Shown in every state. */
  description?: string
  /** Status line when done. */
  readyLabel?: string
  /** Status line on error. */
  errorLabel?: string
  /** Renders a continue button when done. */
  onContinue?: () => void
  continueLabel?: string
  /** Renders a retry button on error. */
  onRetry?: () => void
  retryLabel?: string
  /** Show the percentage (determinate progress only). */
  showPercent?: boolean
  /** Show the row of progress tiles under the board. */
  showProgress?: boolean
  /** `card` brings its own surface; `plain` drops it so the loader sits in your layout. */
  variant?: 'card' | 'plain'
  /** Accent (#rrggbb) for the snake, trail and progress. Defaults to emerald. */
  color?: string
  /** Let people take over the snake (click, arrow keys, swipe). `false` makes it a pure animation. */
  interactive?: boolean
  /** The snake plays itself. Always off under reduced motion. */
  autoPlay?: boolean
  /** Board size in tiles (cols 10–30, rows 6–20). */
  cols?: number
  rows?: number
  /** ms per step when someone is playing (70–260). */
  speed?: number
  /** Walls wrap around instead of ending a round. */
  wrap?: boolean
  /** `tiles` — glossy snake on soft tiles; `lcd` — a pixel nod to the classic phone screen. */
  skin?: SnakeLoaderSkin
  /** `auto` follows the nearest `.dark` / `.light` ancestor. */
  theme?: ThemeMode
  onGameOver?: (score: number, best: number) => void
  className?: string
  boardClassName?: string
}

type Pt = { x: number; y: number }
type Mode = 'auto' | 'idle' | 'play' | 'paused' | 'over'
type Game = {
  body: Pt[]
  prev: Pt[]
  dir: Pt
  queue: Pt[]
  food: Pt
  foodAt: number
  alive: boolean
  retire: boolean
  acc: number
  tick: number
  bornAt: number
  deadAt: number
  ate: number
}
type Fx = { text: boolean; x: number; y: number; vx: number; vy: number; age: number; life: number; color: string }

const UP: Pt = { x: 0, y: -1 }
const DOWN: Pt = { x: 0, y: 1 }
const LEFT: Pt = { x: -1, y: 0 }
const RIGHT: Pt = { x: 1, y: 0 }
const DIR4 = [UP, RIGHT, DOWN, LEFT]
const KEYS: Record<string, Pt> = {
  ArrowUp: UP, ArrowDown: DOWN, ArrowLeft: LEFT, ArrowRight: RIGHT,
  w: UP, s: DOWN, a: LEFT, d: RIGHT, W: UP, S: DOWN, A: LEFT, D: RIGHT,
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const opposite = (a: Pt, b: Pt) => a.x === -b.x && a.y === -b.y
const sameDir = (a: Pt, b: Pt) => a.x === b.x && a.y === b.y

function cellIndex(x: number, y: number, cols: number, rows: number, wrap: boolean) {
  if (wrap) {
    x = (x + cols) % cols
    y = (y + rows) % rows
  } else if (x < 0 || y < 0 || x >= cols || y >= rows) return -1
  return y * cols + x
}

function placeFood(body: Pt[], cols: number, rows: number): Pt {
  const taken = new Set(body.map((p) => p.y * cols + p.x))
  const free: number[] = []
  for (let i = 0; i < cols * rows; i++) if (!taken.has(i)) free.push(i)
  if (!free.length) return { x: -1, y: -1 }
  const i = free[Math.floor(Math.random() * free.length)]
  return { x: i % cols, y: Math.floor(i / cols) }
}

function newGame(cols: number, rows: number, dir: Pt, now: number, tick: number): Game {
  const cx = Math.floor(cols / 2)
  const cy = Math.floor(rows / 2)
  const body = Array.from({ length: 4 }, (_, i) => ({ x: cx - dir.x * i, y: cy - dir.y * i }))
  return { body, prev: body.map((p) => ({ ...p })), dir, queue: [], food: placeFood(body, cols, rows), foodAt: now, alive: true, retire: false, acc: 0, tick, bornAt: now, deadAt: 0, ate: 0 }
}

function stepGame(g: Game, cols: number, rows: number, wrap: boolean): 'eat' | 'die' | null {
  const next = g.queue.shift()
  if (next && !opposite(next, g.dir)) g.dir = next
  let hx = g.body[0].x + g.dir.x
  let hy = g.body[0].y + g.dir.y
  if (wrap) {
    hx = (hx + cols) % cols
    hy = (hy + rows) % rows
  } else if (hx < 0 || hy < 0 || hx >= cols || hy >= rows) {
    g.alive = false
    return 'die'
  }
  const eating = hx === g.food.x && hy === g.food.y
  const solid = eating ? g.body : g.body.slice(0, -1)
  if (solid.some((p) => p.x === hx && p.y === hy)) {
    g.alive = false
    return 'die'
  }
  g.prev = g.body.map((p) => ({ ...p }))
  const head = { x: hx, y: hy }
  g.body = eating ? [head, ...g.body] : [head, ...g.body.slice(0, -1)]
  if (!eating) return null
  g.ate++
  g.food = placeFood(g.body, cols, rows)
  return 'eat'
}

/** Cells reachable from `start` (flood fill), stopping early at `cap`. */
function reach(start: number, blocked: Uint8Array, cols: number, rows: number, wrap: boolean, cap: number) {
  const seen = new Uint8Array(blocked.length)
  const stack = [start]
  seen[start] = 1
  let n = 0
  while (stack.length && n < cap) {
    const c = stack.pop()!
    n++
    const x = c % cols
    const y = (c - x) / cols
    for (const d of DIR4) {
      const k = cellIndex(x + d.x, y + d.y, cols, rows, wrap)
      if (k < 0 || seen[k] || blocked[k]) continue
      seen[k] = 1
      stack.push(k)
    }
  }
  return n
}

/** Autopilot: shortest path to the berry if the snake keeps enough room afterwards, otherwise the roomiest turn. */
function autopilot(g: Game, cols: number, rows: number, wrap: boolean): Pt {
  const N = cols * rows
  const blocked = new Uint8Array(N)
  for (let i = 0; i < g.body.length - 1; i++) blocked[g.body[i].y * cols + g.body[i].x] = 1
  const h = g.body[0]
  const first = new Int8Array(N).fill(-1)
  const queue: number[] = []
  const options: { d: number; k: number }[] = []
  DIR4.forEach((d, i) => {
    if (opposite(d, g.dir)) return
    const k = cellIndex(h.x + d.x, h.y + d.y, cols, rows, wrap)
    if (k < 0 || blocked[k]) return
    options.push({ d: i, k })
    first[k] = i
    queue.push(k)
  })
  if (!options.length) return g.dir
  const target = g.food.x < 0 ? -1 : g.food.y * cols + g.food.x
  for (let head = 0; head < queue.length; head++) {
    const c = queue[head]
    if (c === target) break
    const x = c % cols
    const y = (c - x) / cols
    for (const d of DIR4) {
      const k = cellIndex(x + d.x, y + d.y, cols, rows, wrap)
      if (k < 0 || blocked[k] || first[k] >= 0) continue
      first[k] = first[c]
      queue.push(k)
    }
  }
  const room = g.body.length + 2
  if (target >= 0 && first[target] >= 0) {
    const pick = options.find((o) => o.d === first[target])!
    if (reach(pick.k, blocked, cols, rows, wrap, room) >= room) return DIR4[pick.d]
  }
  let best = options[0]
  let bestScore = -1
  for (const o of options) {
    const score = reach(o.k, blocked, cols, rows, wrap, N) + (sameDir(DIR4[o.d], g.dir) ? 0.5 : 0)
    if (score > bestScore) {
      bestScore = score
      best = o
    }
  }
  return DIR4[best.d]
}

/* ---------- palettes (tuned per theme so the board reads as a lit object, not a flat grid) ---------- */

type Pal = {
  bg: string; tileA: string; tileB: string; tileHi: string; vignette: string; heat: string
  head: string; tail: string; dead: string; shadow: string; gloss: string; eye: string; pupil: string; tongue: string
  fruit: string; fruitHi: string; fruitRim: string; leaf: string; leafDark: string; stem: string; ground: string; text: string; flash: string
}
const PAL: Record<'light' | 'dark', Pal> = {
  light: {
    bg: '#efede8', tileA: '#f8f7f4', tileB: '#f5f4f0', tileHi: 'rgba(255,255,255,0.6)', vignette: 'rgba(63,63,70,0.07)', heat: '16,185,129',
    head: '#10a877', tail: '#0d6d63', dead: '#a1a1aa', shadow: 'rgba(24,24,27,0.16)', gloss: 'rgba(255,255,255,0.38)', eye: '#ffffff', pupil: '#0a1f17', tongue: '#e11d48',
    fruit: '#f43f5e', fruitHi: '#ffe4e6', fruitRim: '#9f1239', leaf: '#4ade80', leafDark: '#15803d', stem: '#713f12', ground: 'rgba(24,24,27,0.18)', text: '#047857', flash: '244,63,94',
  },
  dark: {
    bg: '#0a0a0c', tileA: '#161619', tileB: '#141417', tileHi: 'rgba(255,255,255,0.045)', vignette: 'rgba(0,0,0,0.45)', heat: '52,211,153',
    head: '#34d399', tail: '#0f766e', dead: '#52525b', shadow: 'rgba(0,0,0,0.6)', gloss: 'rgba(255,255,255,0.24)', eye: '#f8fafc', pupil: '#04261a', tongue: '#fb7185',
    fruit: '#fb7185', fruitHi: '#fff1f2', fruitRim: '#be123c', leaf: '#4ade80', leafDark: '#166534', stem: '#a16207', ground: 'rgba(0,0,0,0.55)', text: '#6ee7b7', flash: '251,113,133',
  },
}
const LCD = {
  light: { bg: '#c2ce99', off: 'rgba(30,46,16,0.08)', on: '#24321a' },
  dark: { bg: '#121a0c', off: 'rgba(163,199,118,0.07)', on: '#a3c776' },
}

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const rgbHex = (rgb: string) => '#' + (rgb.match(/\d+/g) ?? []).map((v) => Number(v).toString(16).padStart(2, '0')).join('')
function mix(a: string, b: string, k: number) {
  const A = hex(a)
  const B = hex(b)
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',')})`
}

const isHex = (c?: string): c is string => !!c && /^#[0-9a-f]{6}$/i.test(c)
const palCache = new Map<string, Pal>()
/** Theme palette, re-tinted to a custom accent when one is given. */
function palette(dark: boolean, color?: string): Pal {
  const base = PAL[dark ? 'dark' : 'light']
  if (!isHex(color)) return base
  const key = `${dark}${color}`
  let p = palCache.get(key)
  if (!p) {
    p = { ...base, head: color, tail: rgbHex(mix(color, '#000000', dark ? 0.45 : 0.38)), heat: hex(color).join(','), text: color }
    palCache.set(key, p)
  }
  return p
}

/* ---------- status pieces ---------- */

function StatusGlyph({ status, accent, reduced }: { status: SnakeLoaderState; accent: string; reduced: boolean }) {
  const order = [0, 1, 3, 2] // clockwise around the 2×2
  return (
    <span aria-hidden className="relative grid h-4 w-4 shrink-0 place-items-center">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'loading' ? (
          <motion.span key="l" className="grid h-3.5 w-3.5 grid-cols-2 gap-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                className="rounded-[1.5px]"
                style={{ backgroundColor: accent }}
                initial={false}
                animate={reduced ? { opacity: i === 0 ? 1 : 0.35 } : { opacity: [0.25, 1, 0.25, 0.25] }}
                transition={reduced ? { duration: 0 } : { duration: 1.2, times: [0, 0.22, 0.6, 1], repeat: Infinity, ease: 'easeInOut', delay: order.indexOf(i) * 0.3 }}
              />
            ))}
          </motion.span>
        ) : (
          <motion.span
            key={status}
            className={cn('grid', status === 'error' && 'text-rose-600 dark:text-rose-400')}
            style={status === 'done' ? { color: accent } : undefined}
            initial={reduced ? { opacity: 0 } : { scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 520, damping: 20 }}
          >
            {status === 'done' ? <Check className="h-4 w-4" strokeWidth={3} /> : <CircleAlert className="h-4 w-4" strokeWidth={2.5} />}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

/** Percentage that counts toward its value on a spring. */
function Percent({ value, reduced }: { value: number; reduced: boolean }) {
  const mv = useSpring(value, { stiffness: 140, damping: 26 })
  const text = useTransform(mv, (v) => `${Math.round(v)}%`)
  React.useEffect(() => {
    if (reduced) mv.jump(value)
    else mv.set(value)
  }, [value, reduced, mv])
  return (
    <motion.span aria-hidden className="shrink-0 font-mono text-[13px] font-medium tabular-nums text-zinc-800 dark:text-zinc-200">
      {text}
    </motion.span>
  )
}

const actionBtn =
  'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-medium outline-none transition-[background-color,transform] duration-150 active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white pointer-coarse:h-11 dark:focus-visible:ring-signal-300 dark:focus-visible:ring-offset-zinc-950'

/**
 * Snake Loader — a loader whose visual is a tiny snake board. While you wait the snake plays itself on
 * autopilot; progress fills a row of tiles beneath it and the status line carries the label, the current
 * step and the percentage. Click the board (or press an arrow key) and the snake is yours until you hand
 * it back. `state="error"` crashes the snake and offers a retry; `done` offers continue.
 */
export function SnakeLoader({
  progress,
  state: stateProp = 'loading',
  label = 'Loading',
  description,
  readyLabel = 'Ready',
  errorLabel = 'Something went wrong',
  onContinue,
  continueLabel = 'Continue',
  onRetry,
  retryLabel = 'Try again',
  showPercent = true,
  showProgress = true,
  variant = 'card',
  color,
  interactive = true,
  autoPlay = true,
  cols: colsProp = 18,
  rows: rowsProp = 10,
  speed: speedProp = 120,
  wrap = false,
  skin = 'tiles',
  theme = 'auto',
  onGameOver,
  className,
  boardClassName,
}: SnakeLoaderProps) {
  const reduced = usePrefersReducedMotion()
  const cols = Math.round(clamp(colsProp, 10, 30))
  const rows = Math.round(clamp(rowsProp, 6, 20))
  const speed = clamp(speedProp, 70, 260)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const boardRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const resolved = useResolvedTheme(rootRef, theme)
  const dark = resolved === 'dark'
  const uid = React.useId()

  const indeterminate = progress === undefined
  const pct = Math.round(clamp(progress ?? 0, 0, 100))
  const status: SnakeLoaderState = stateProp === 'error' ? 'error' : stateProp === 'done' || pct >= 100 ? 'done' : 'loading'
  const error = status === 'error'
  const autoOK = autoPlay && !reduced
  const accent = isHex(color) ? color : dark ? '#34d399' : '#10b981'

  const [rawMode, setModeState] = React.useState<Mode>('auto')
  // Errors freeze the board; without autopilot (or under reduced motion) it rests until someone plays.
  const mode: Mode = error || (rawMode === 'auto' && !autoOK) ? 'idle' : rawMode
  const [score, setScore] = React.useState(0)
  const [best, setBest] = React.useState(0)
  const [msg, setMsg] = React.useState('')
  const modeRef = React.useRef(rawMode)
  const scoreRef = React.useRef(0)
  const bestRef = React.useRef(0)
  const wake = React.useRef<() => void>(() => {})
  const G = React.useRef<Game>(null!) // created by the loop effect on mount

  const latest = { cols, rows, wrap, speed, skin, reduced, autoOK, error, interactive, dark, color }
  const cfg = React.useRef(latest)
  React.useLayoutEffect(() => {
    cfg.current = latest
  })

  /** Mode as the loop and input handlers see it. */
  const live = (): Mode => {
    const c = cfg.current
    const m = modeRef.current
    return c.error || (m === 'auto' && !c.autoOK) ? 'idle' : m
  }
  const setMode = (m: Mode) => {
    modeRef.current = m
    setModeState(m)
    wake.current()
  }

  /** Take the wheel of the snake that's already moving (or start one if the board is resting). */
  const takeOver = (d?: Pt) => {
    const c = cfg.current
    if (!c.interactive || c.error) return
    let g = G.current
    if (live() !== 'auto' || !g.alive) g = G.current = newGame(c.cols, c.rows, d ?? RIGHT, performance.now(), c.speed)
    g.tick = c.speed
    g.ate = 0
    g.queue = d && !opposite(d, g.dir) && !sameDir(d, g.dir) ? [d] : []
    scoreRef.current = 0
    setScore(0)
    setMode('play')
    setMsg('You are steering. Arrow keys turn, Space pauses, Escape hands back to autopilot.')
  }
  const steer = (d: Pt) => {
    const m = live()
    const g = G.current
    if (m === 'play' || m === 'paused') {
      const last = g.queue[g.queue.length - 1] ?? g.dir
      if (!opposite(d, last) && !sameDir(d, last) && g.queue.length < 3) g.queue.push(d)
      if (m === 'paused') setMode('play')
    } else takeOver(d)
  }
  const pause = () => {
    setMode('paused')
    setMsg('Paused.')
  }
  const handBack = () => {
    setMode('auto')
    setMsg(cfg.current.autoOK ? 'Autopilot is back.' : '')
  }

  // Loop → React bridge, refreshed after every render so the rAF loop never reads stale props.
  const handlers = React.useRef({ eat: () => {}, die: () => {}, hidden: () => {}, settle: () => {} })
  React.useLayoutEffect(() => {
    handlers.current = {
      eat: () => {
        scoreRef.current += 1
        setScore(scoreRef.current)
      },
      die: () => {
        const s = scoreRef.current
        const nb = Math.max(bestRef.current, s)
        bestRef.current = nb
        setBest(nb)
        setMode('over')
        onGameOver?.(s, nb)
        setMsg(`Round over: ${s} ${s === 1 ? 'berry' : 'berries'}.`)
      },
      hidden: () => {
        if (modeRef.current === 'play') pause()
      },
      // after a round ends or an error interrupts play, quietly return to autopilot
      settle: () => {
        if (modeRef.current !== 'auto') setMode('auto')
      },
    }
  })

  // Loading status for assistive tech, derived during render: changes only at 25% milestones and on done.
  const milestone = Math.floor(pct / 25) * 25
  const loadStatus =
    status === 'done' ? `${readyLabel}.` : status === 'loading' && !indeterminate && milestone > 0 ? `${label}: ${milestone}%` : ''

  React.useEffect(() => {
    const canvas = canvasRef.current
    const board = boardRef.current
    if (!canvas || !board) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    G.current = newGame(cols, rows, RIGHT, performance.now(), cfg.current.speed)
    const heat = new Float32Array(cols * rows)
    const fx: Fx[] = []
    let W = 0
    let H = 0
    let t = 0
    let dpr = 1
    let layer: HTMLCanvasElement | null = null
    let layerKey = ''
    let raf = 0
    let last = 0
    let visible = true
    let shake = 0
    let flash = 0

    const resize = () => {
      const r = board.getBoundingClientRect()
      W = r.width
      t = W / cols
      H = t * rows
      dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.max(1, Math.round(W * dpr))
      canvas.height = Math.max(1, Math.round(H * dpr))
      layerKey = ''
    }

    const buildLayer = (dark: boolean, lcd: boolean) => {
      const key = `${dark}${lcd}${W}${dpr}`
      if (key === layerKey && layer) return layer
      layerKey = key
      layer = layer ?? document.createElement('canvas')
      layer.width = canvas.width
      layer.height = canvas.height
      const l = layer.getContext('2d')!
      l.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (lcd) {
        const p = LCD[dark ? 'dark' : 'light']
        l.fillStyle = p.bg
        l.fillRect(0, 0, W, H)
        l.fillStyle = p.off
        const ins = t * 0.09
        for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) l.fillRect(x * t + ins, y * t + ins, t - ins * 2, t - ins * 2)
        return layer
      }
      const p = PAL[dark ? 'dark' : 'light']
      l.fillStyle = p.bg
      l.fillRect(0, 0, W, H)
      const gap = Math.max(1, t * 0.07)
      const rad = t * 0.22
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = x * t + gap / 2
          const py = y * t + gap / 2
          l.fillStyle = (x + y) % 2 ? p.tileB : p.tileA
          l.beginPath()
          l.roundRect(px, py, t - gap, t - gap, rad)
          l.fill()
          l.fillStyle = p.tileHi
          l.fillRect(px + rad * 0.7, py + 0.5, t - gap - rad * 1.4, 1)
        }
      }
      const v = l.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.75)
      v.addColorStop(0, 'rgba(0,0,0,0)')
      v.addColorStop(1, p.vignette)
      l.fillStyle = v
      l.fillRect(0, 0, W, H)
      return layer
    }

    const center = (p: Pt) => ({ x: (p.x + 0.5) * t, y: (p.y + 0.5) * t })
    const lerpPt = (a: Pt, b: Pt, k: number) => (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) > 1 ? b : { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k })

    const drawFood = (p: Pal, g: Game, now: number, reducedMotion: boolean) => {
      if (g.food.x < 0) return
      const age = (now - g.foodAt) / 1000
      const s = reducedMotion ? 1 : Math.max(0, 1 - Math.exp(-age * 9) * Math.cos(age * 16))
      const bob = reducedMotion ? 0 : Math.sin(now / 380) * t * 0.035
      const { x: fx0, y: fy0 } = center(g.food)
      const r = t * 0.29 * s
      if (r <= 0.2) return
      const fy = fy0 + bob - t * 0.03
      ctx.fillStyle = p.ground
      ctx.beginPath()
      ctx.ellipse(fx0, fy0 + t * 0.3, r * (0.95 - bob / t), r * 0.28, 0, 0, Math.PI * 2)
      ctx.fill()
      const grad = ctx.createRadialGradient(fx0 - r * 0.35, fy - r * 0.4, r * 0.08, fx0, fy, r * 1.1)
      grad.addColorStop(0, p.fruitHi)
      grad.addColorStop(0.42, p.fruit)
      grad.addColorStop(1, p.fruitRim)
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(fx0, fy, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = 'rgba(255,255,255,0.75)'
      ctx.beginPath()
      ctx.ellipse(fx0 - r * 0.38, fy - r * 0.42, r * 0.22, r * 0.13, -0.6, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = p.stem
      ctx.lineWidth = Math.max(1, t * 0.06)
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(fx0, fy - r * 0.82)
      ctx.quadraticCurveTo(fx0 + r * 0.05, fy - r * 1.15, fx0 + r * 0.22, fy - r * 1.32)
      ctx.stroke()
      ctx.save()
      ctx.translate(fx0 + r * 0.55, fy - r * 1.1)
      ctx.rotate(-0.45)
      const lg = ctx.createLinearGradient(-r * 0.45, 0, r * 0.45, 0)
      lg.addColorStop(0, p.leafDark)
      lg.addColorStop(1, p.leaf)
      ctx.fillStyle = lg
      ctx.beginPath()
      ctx.ellipse(0, 0, r * 0.46, r * 0.2, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.35)'
      ctx.lineWidth = Math.max(0.6, t * 0.025)
      ctx.beginPath()
      ctx.moveTo(-r * 0.36, 0)
      ctx.lineTo(r * 0.36, 0)
      ctx.stroke()
      ctx.restore()
    }

    const drawSnake = (p: Pal, g: Game, alpha: number, now: number, reducedMotion: boolean) => {
      const n = g.body.length
      const pts = [center(lerpPt(g.prev[0] ?? g.body[0], g.body[0], alpha))]
      for (let i = 1; i < n; i++) pts.push(center(g.body[i]))
      const prevTail = g.prev.length === n ? g.prev[n - 1] : g.body[n - 1]
      pts.push(center(lerpPt(prevTail, g.body[n - 1], alpha)))
      const w = t * 0.68
      const deadK = !g.alive && !g.retire ? clamp((now - g.deadAt) / 380, 0, 1) : 0
      const fade = g.retire ? clamp(1 - (now - g.deadAt) / 550, 0, 1) : clamp((now - g.bornAt) / 350, 0, 1)
      if (fade <= 0) return
      ctx.globalAlpha = reducedMotion ? 1 : fade
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      const segs = pts.length - 1
      const widthAt = (f: number) => w * (f > 0.68 ? 1 - ((f - 0.68) / 0.32) * 0.5 : 1)
      const jump = (a: Pt, b: Pt) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y) > t * 1.5
      // Translucent passes (shadow, gloss) are one continuous path so overlapping caps don't stack into dots.
      const trace = (dx: number, dy: number, width: number, color: string, upto = 1) => {
        ctx.strokeStyle = color
        ctx.lineWidth = width
        ctx.beginPath()
        let open = false
        for (let j = 0; j < segs; j++) {
          const a = pts[j]
          const b = pts[j + 1]
          if ((segs > 1 ? j / (segs - 1) : 0) > upto) break
          if (jump(a, b)) {
            open = false
            continue
          }
          if (!open) ctx.moveTo(a.x + dx, a.y + dy)
          ctx.lineTo(b.x + dx, b.y + dy)
          open = true
        }
        ctx.stroke()
      }
      trace(0, t * 0.08, w * 0.94, p.shadow)
      // Opaque body: per-segment so it can carry the head→tail gradient and the tapered tail.
      for (let j = 0; j < segs; j++) {
        const a = pts[j]
        const b = pts[j + 1]
        if (jump(a, b)) continue
        const f = segs > 1 ? j / (segs - 1) : 0
        const body = mix(p.head, p.tail, f)
        ctx.strokeStyle = deadK ? mix(rgbHex(body), p.dead, deadK * 0.9) : body
        ctx.lineWidth = widthAt(f)
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
      trace(-w * 0.06, -w * 0.18, w * 0.2, p.gloss, 0.8)

      // head
      const hd = pts[0]
      const hr = w * 0.56
      ctx.fillStyle = p.shadow
      ctx.beginPath()
      ctx.arc(hd.x, hd.y + t * 0.09, hr, 0, Math.PI * 2)
      ctx.fill()
      const hg = ctx.createRadialGradient(hd.x - hr * 0.35, hd.y - hr * 0.45, hr * 0.1, hd.x, hd.y, hr)
      hg.addColorStop(0, mix(deadK ? p.dead : p.head, '#ffffff', 0.35))
      hg.addColorStop(1, deadK ? mix(p.head, p.dead, deadK) : p.head)
      ctx.fillStyle = hg
      ctx.beginPath()
      ctx.arc(hd.x, hd.y, hr, 0, Math.PI * 2)
      ctx.fill()

      const d = g.dir
      const perp = { x: -d.y, y: d.x }
      const fc = center(g.food)
      const lx = fc.x - hd.x
      const ly = fc.y - hd.y
      const ll = Math.hypot(lx, ly) || 1
      const blink = !reducedMotion && g.alive && now % 3900 < 120
      for (const side of [-1, 1]) {
        const ex = hd.x + d.x * hr * 0.3 + perp.x * hr * 0.46 * side
        const ey = hd.y + d.y * hr * 0.3 + perp.y * hr * 0.46 * side
        const er = hr * 0.3
        if (!g.alive && !g.retire) {
          ctx.strokeStyle = p.pupil
          ctx.lineWidth = Math.max(1, t * 0.05)
          ctx.beginPath()
          ctx.moveTo(ex - er * 0.6, ey - er * 0.6)
          ctx.lineTo(ex + er * 0.6, ey + er * 0.6)
          ctx.moveTo(ex + er * 0.6, ey - er * 0.6)
          ctx.lineTo(ex - er * 0.6, ey + er * 0.6)
          ctx.stroke()
          continue
        }
        ctx.fillStyle = p.eye
        ctx.beginPath()
        ctx.ellipse(ex, ey, er, blink ? er * 0.18 : er, 0, 0, Math.PI * 2)
        ctx.fill()
        if (blink) continue
        ctx.fillStyle = p.pupil
        ctx.beginPath()
        ctx.arc(ex + (lx / ll) * er * 0.38, ey + (ly / ll) * er * 0.38, er * 0.55, 0, Math.PI * 2)
        ctx.fill()
      }
      // tongue flicks when the berry is close
      const near = Math.abs(g.food.x - g.body[0].x) + Math.abs(g.food.y - g.body[0].y) <= 3
      if (g.alive && !reducedMotion && near && now % 1100 < 240) {
        const bx = hd.x + d.x * hr * 0.95
        const by = hd.y + d.y * hr * 0.95
        const tx = bx + d.x * t * 0.26
        const ty = by + d.y * t * 0.26
        ctx.strokeStyle = p.tongue
        ctx.lineWidth = Math.max(1, t * 0.045)
        ctx.beginPath()
        ctx.moveTo(bx, by)
        ctx.lineTo(tx, ty)
        ctx.lineTo(tx + d.x * t * 0.09 + perp.x * t * 0.08, ty + d.y * t * 0.09 + perp.y * t * 0.08)
        ctx.moveTo(tx, ty)
        ctx.lineTo(tx + d.x * t * 0.09 - perp.x * t * 0.08, ty + d.y * t * 0.09 - perp.y * t * 0.08)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }

    const drawLcd = (dark: boolean, g: Game, k: number, now: number) => {
      const p = LCD[dark ? 'dark' : 'light']
      const ins = t * 0.09
      const cell = (q: Pt) => ctx.fillRect(q.x * t + ins, q.y * t + ins, t - ins * 2, t - ins * 2)
      ctx.fillStyle = p.on
      if (g.food.x >= 0) {
        const c = center(g.food)
        const s = t * 0.22
        ctx.fillRect(c.x - s / 2, c.y - s * 1.5, s, s * 3)
        ctx.fillRect(c.x - s * 1.5, c.y - s / 2, s * 3, s)
      }
      const blinkOff = !g.alive && !g.retire && now - g.deadAt < 1300 && Math.floor((now - g.deadAt) / 160) % 2 === 0
      const fade = g.retire ? clamp(1 - (now - g.deadAt) / 550, 0, 1) : 1
      if (blinkOff || fade <= 0) return
      // LCD ghosting: the pixels the snake just left fade out instead of switching off at once.
      ctx.globalAlpha = 0.24 * (1 - k) * fade
      const tail = g.prev[g.prev.length - 1]
      if (tail && g.prev.length === g.body.length && !g.body.some((q) => q.x === tail.x && q.y === tail.y)) cell(tail)
      ctx.globalAlpha = fade
      g.body.forEach(cell)
      const h = g.body[0]
      const d = g.dir
      const perp = { x: -d.y, y: d.x }
      const e = t * 0.16
      ctx.fillStyle = p.bg
      const ex = (h.x + 0.5) * t + d.x * t * 0.12 + perp.x * t * 0.16
      const ey = (h.y + 0.5) * t + d.y * t * 0.12 + perp.y * t * 0.16
      ctx.fillRect(ex - e / 2, ey - e / 2, e, e)
      ctx.globalAlpha = 1
    }

    const spawnFx = (p: Pal, at: Pt) => {
      const colors = [p.fruit, p.leaf, p.fruitHi]
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2 + Math.random() * 0.4
        const v = 2.4 + Math.random() * 1.6
        fx.push({ text: false, x: at.x + 0.5, y: at.y + 0.5, vx: Math.cos(a) * v, vy: Math.sin(a) * v, age: 0, life: 0.45 + Math.random() * 0.15, color: colors[i % 3] })
      }
      fx.push({ text: true, x: at.x + 0.5, y: at.y + 0.2, vx: 0, vy: -1.5, age: 0, life: 0.8, color: p.text })
    }


    const frame = (now: number, dt: number) => {
      const c = cfg.current
      const m = live()
      const lcd = c.skin === 'lcd'
      const p = palette(c.dark, c.color)
      let g = G.current
      // error: the snake crashes where it is and the board holds still
      if (c.error && g.alive) {
        g.alive = false
        g.retire = false
        g.deadAt = now
        if (!c.reduced) flash = 1
        if (!c.reduced) shake = 0.35
        handlers.current.settle()
      }
      const running = !c.error && (m === 'auto' || m === 'play')
      const tick = m === 'auto' ? c.speed * 1.2 : g.tick
      if (running && g.alive) {
        g.acc += dt
        let guard = 0
        while (g.alive && g.acc >= tick && guard++ < 4) {
          g.acc -= tick
          if (m === 'auto') g.queue = [autopilot(g, cols, rows, c.wrap)]
          const ev = stepGame(g, cols, rows, c.wrap)
          if (g.alive) heat[g.body[0].y * cols + g.body[0].x] = 1
          if (ev === 'eat') {
            g.foodAt = now
            if (!c.reduced && !lcd) spawnFx(p, g.body[0])
            if (m === 'play') {
              g.tick = Math.max(c.speed * 0.62, c.speed - g.ate * 2.5)
              handlers.current.eat()
            } else if (g.body.length >= Math.max(10, Math.floor(cols * rows * 0.2))) {
              // autopilot sheds and starts over before the board gets crowded
              g.alive = false
              g.retire = true
              g.deadAt = now
            }
          } else if (ev === 'die') {
            g.deadAt = now
            if (m === 'auto') g.retire = true
            else {
              if (!c.reduced) shake = 0.35
              if (!c.reduced) flash = 1
              handlers.current.die()
            }
          }
        }
      }
      if (m === 'over' && now - g.deadAt > 1400) handlers.current.settle()
      const resting = m === 'auto' || m === 'idle'
      if (!c.error && !g.alive && resting && now - g.deadAt > (g.retire ? 650 : 900)) {
        G.current = g = newGame(cols, rows, RIGHT, now, c.speed)
      }
      const k = g.alive ? clamp(g.acc / tick, 0, 1) : 1
      const alpha = c.reduced || lcd ? 1 : k

      // decay effects
      const s = dt / 1000
      let heatMax = 0
      for (let i = 0; i < heat.length; i++) {
        if (heat[i] > 0.01) {
          heat[i] *= Math.exp(-s * 2.4)
          heatMax = Math.max(heatMax, heat[i])
        } else heat[i] = 0
      }
      for (let i = fx.length - 1; i >= 0; i--) {
        const f = fx[i]
        f.age += s
        f.x += f.vx * s
        f.y += f.vy * s
        f.vx *= 0.9
        f.vy = f.text ? f.vy * 0.96 : f.vy * 0.9
        if (f.age >= f.life) fx.splice(i, 1)
      }
      shake = Math.max(0, shake - s)
      flash = Math.max(0, flash - s * 2.6)

      // draw
      if (W > 0) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, W, H)
        ctx.drawImage(buildLayer(c.dark, lcd)!, 0, 0, W, H)
        if (shake > 0) ctx.translate(Math.sin(now / 18) * t * 0.16 * (shake / 0.35), 0)
        if (lcd) drawLcd(c.dark, g, k, now)
        else {
          if (!c.reduced && heatMax > 0) {
            const gap = Math.max(1, t * 0.07)
            for (let i = 0; i < heat.length; i++) {
              if (!heat[i]) continue
              const x = i % cols
              const y = (i - x) / cols
              ctx.fillStyle = `rgba(${p.heat},${heat[i] * (c.dark ? 0.14 : 0.12)})`
              ctx.beginPath()
              ctx.roundRect(x * t + gap / 2, y * t + gap / 2, t - gap, t - gap, t * 0.22)
              ctx.fill()
            }
          }
          drawFood(p, g, now, c.reduced)
          drawSnake(p, g, alpha, now, c.reduced)
          for (const f of fx) {
            const a = 1 - f.age / f.life
            ctx.globalAlpha = a
            ctx.fillStyle = f.color
            if (f.text) {
              ctx.font = `600 ${Math.round(t * 0.55)}px ui-sans-serif, system-ui, sans-serif`
              ctx.textAlign = 'center'
              ctx.fillText('+1', f.x * t, f.y * t)
            } else {
              ctx.beginPath()
              ctx.arc(f.x * t, f.y * t, t * 0.07 * (0.4 + a * 0.6), 0, Math.PI * 2)
              ctx.fill()
            }
          }
          ctx.globalAlpha = 1
        }
        if (flash > 0) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
          ctx.fillStyle = lcd ? `rgba(0,0,0,${flash * 0.12})` : `rgba(${p.flash},${flash * 0.16})`
          ctx.fillRect(0, 0, W, H)
        }
      }
      // flash and shake always finish fading, even if the loop would otherwise sleep
      const ambient = shake > 0 || flash > 0 || (!c.reduced && (fx.length > 0 || heatMax > 0.02 || now - g.foodAt < 900))
      const lcdBlink = lcd && !g.alive && now - g.deadAt < 1400
      const pending = m === 'over' || (!c.error && !g.alive && resting)
      return running || ambient || lcdBlink || pending
    }

    const loop = (now: number) => {
      const dt = Math.min(50, now - last)
      last = now
      raf = frame(now, dt) ? requestAnimationFrame(loop) : 0
    }
    const start = () => {
      if (raf || !visible || document.hidden) return
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }
    wake.current = start
    resize()
    const ro = new ResizeObserver(() => {
      resize()
      frame(performance.now(), 0)
    })
    ro.observe(board)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) start()
      else {
        stop()
        handlers.current.hidden()
      }
    })
    io.observe(board)
    const onVis = () => {
      if (document.hidden) {
        stop()
        handlers.current.hidden()
      } else start()
    }
    document.addEventListener('visibilitychange', onVis)
    frame(performance.now(), 0)
    start()
    return () => {
      stop()
      wake.current = () => {}
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [cols, rows])

  // Redraw when anything visual changes while the loop is asleep.
  React.useEffect(() => {
    wake.current()
  }, [resolved, skin, reduced, wrap, error, color])

  /* ---------- input: the board itself is the only control ---------- */

  const swipe = React.useRef<{ x: number; y: number; id: number } | null>(null)
  const onKeyDown = (e: React.KeyboardEvent) => {
    const m = live()
    const d = KEYS[e.key]
    if (d) {
      e.preventDefault()
      steer(d)
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      if (m === 'play') pause()
      else if (m === 'paused') setMode('play')
      else takeOver()
    } else if (e.key === 'Escape' && (m === 'play' || m === 'paused')) {
      e.preventDefault()
      handBack()
    }
  }
  const onPointerDown = (e: React.PointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY, id: e.pointerId }
  }
  const onPointerUp = (e: React.PointerEvent) => {
    const s = swipe.current
    swipe.current = null
    if (!s || s.id !== e.pointerId) return
    const dx = e.clientX - s.x
    const dy = e.clientY - s.y
    if (Math.max(Math.abs(dx), Math.abs(dy)) > 22) steer(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? RIGHT : LEFT) : dy > 0 ? DOWN : UP)
    else if (live() === 'paused') setMode('play')
    else if (live() !== 'play') takeOver()
  }

  const playing = mode === 'play' || mode === 'paused'
  const title = status === 'done' ? readyLabel : error ? errorLabel : label
  const tileColor = error ? (dark ? '#fb7185' : '#f43f5e') : accent
  const fill = (i: number) => (status === 'done' ? 1 : indeterminate ? (error ? 1 : 0) : clamp((pct / 100) * cols - i, 0, 1))
  const action =
    status === 'done' && onContinue ? (
      <button type="button" onClick={onContinue} className={cn(actionBtn, 'bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200')}>
        {continueLabel}
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </button>
    ) : error && onRetry ? (
      <button type="button" onClick={onRetry} className={cn(actionBtn, 'bg-zinc-100 text-zinc-900 ring-1 ring-black/[0.06] hover:bg-zinc-200/70 dark:bg-white/[0.08] dark:text-zinc-50 dark:ring-white/[0.08] dark:hover:bg-white/[0.12]')}>
        <RotateCcw className="h-3.5 w-3.5" aria-hidden />
        {retryLabel}
      </button>
    ) : null

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label={title}
      aria-busy={status === 'loading'}
      className={cn(
        'relative w-full',
        variant === 'card' &&
          'max-w-[400px] rounded-[20px] bg-white p-3 text-zinc-950 shadow-[0_1px_2px_rgb(0_0_0/0.05),0_22px_50px_-28px_rgb(24_24_27/0.4)] ring-1 ring-black/[0.06] dark:bg-zinc-950 dark:text-zinc-50 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_22px_50px_-28px_rgb(0_0_0/0.9)] dark:ring-white/[0.08]',
        variant === 'plain' && 'text-zinc-950 dark:text-zinc-50',
        className,
      )}
    >
      <div
        ref={boardRef}
        tabIndex={interactive ? 0 : undefined}
        role={interactive ? 'application' : undefined}
        aria-roledescription={interactive ? 'mini-game' : undefined}
        aria-label={interactive ? `Snake mini-game${playing ? `, score ${score}` : ''}` : undefined}
        aria-describedby={interactive ? `${uid}-how` : undefined}
        aria-hidden={interactive ? undefined : true}
        onKeyDown={interactive ? onKeyDown : undefined}
        onBlur={() => modeRef.current === 'play' && pause()}
        onPointerDown={interactive ? onPointerDown : undefined}
        onPointerUp={interactive ? onPointerUp : undefined}
        onPointerCancel={() => (swipe.current = null)}
        className={cn(
          'relative w-full select-none overflow-hidden rounded-[12px] outline-none ring-1 ring-black/[0.06] dark:ring-white/[0.06]',
          interactive && 'cursor-pointer focus-visible:ring-2 focus-visible:ring-signal-600 dark:focus-visible:ring-signal-300',
          boardClassName,
        )}
        style={{ aspectRatio: `${cols} / ${rows}`, touchAction: playing ? 'none' : 'pan-y' }}
      >
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
        <AnimatePresence>
          {(playing || mode === 'over') && (
            <motion.span
              key="score"
              aria-hidden
              className="absolute right-2 top-2 rounded-full bg-white/85 px-2 py-0.5 font-mono text-[11px] font-medium tabular-nums text-zinc-800 shadow-sm ring-1 ring-black/[0.06] backdrop-blur dark:bg-zinc-900/80 dark:text-zinc-100 dark:ring-white/[0.08]"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            >
              {mode === 'over' ? `Best ${String(best).padStart(2, '0')}` : String(score).padStart(2, '0')}
            </motion.span>
          )}
          {mode === 'paused' && (
            <motion.span
              key="paused"
              aria-hidden
              className="absolute inset-0 grid place-items-center bg-white/40 dark:bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-zinc-900 shadow-sm ring-1 ring-black/[0.06] dark:bg-zinc-900/90 dark:text-zinc-50 dark:ring-white/[0.08]">
                <Pause className="h-4 w-4 fill-current" />
              </span>
            </motion.span>
          )}
          {mode === 'idle' && interactive && !error && (
            <motion.span
              key="idle"
              aria-hidden
              className="pointer-events-none absolute inset-0 grid place-items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-zinc-900 shadow-sm ring-1 ring-black/[0.06] dark:bg-zinc-900/90 dark:text-zinc-50 dark:ring-white/[0.08]">
                <Play className="ml-0.5 h-4 w-4 fill-current" />
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {interactive && (
        <p id={`${uid}-how`} className="sr-only">
          Optional mini-game while you wait. Press an arrow key or Enter to steer the snake, Space to pause, Escape to hand it back to autopilot.
        </p>
      )}

      {showProgress && (
        <div
          role="progressbar"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={indeterminate ? (status === 'done' ? 100 : undefined) : status === 'done' ? 100 : pct}
          aria-valuetext={status === 'done' ? 'Complete' : error ? errorLabel : indeterminate ? 'Loading' : `${pct}%`}
          className="mt-2 grid gap-[3px] px-px"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: cols }, (_, i) => (
            <motion.span
              key={i}
              className="relative h-1.5 origin-bottom overflow-hidden rounded-[3px] bg-zinc-200 dark:bg-white/[0.08]"
              initial={false}
              animate={status === 'done' && !reduced ? { scaleY: [1, 2, 1] } : { scaleY: 1 }}
              transition={{ duration: 0.42, delay: i * 0.022, ease: 'easeOut' }}
            >
              {indeterminate && status === 'loading' ? (
                <motion.span
                  className="absolute inset-0"
                  style={{ backgroundColor: tileColor }}
                  initial={false}
                  animate={reduced ? { opacity: 0.35 } : { opacity: [0.08, 0.95, 0.08] }}
                  transition={reduced ? { duration: 0 } : { duration: 1.6, repeat: Infinity, delay: i * 0.055, ease: 'easeInOut' }}
                />
              ) : (
                <span
                  className="absolute inset-0 origin-left transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                  style={{ backgroundColor: tileColor, transform: `scaleX(${fill(i)})` }}
                />
              )}
            </motion.span>
          ))}
        </div>
      )}

      <div className={cn('flex items-center gap-2.5', showProgress ? 'mt-3' : 'mt-3.5', variant === 'card' && 'px-1 pb-0.5')}>
        <StatusGlyph status={status} accent={accent} reduced={reduced} />
        <div className="relative min-w-0 flex-1">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={`${status}:${title}`}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8, filter: 'blur(3px)' }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            >
              <p className={cn('truncate text-sm font-medium tracking-tight', error && 'text-rose-700 dark:text-rose-300')}>{title}</p>
            </motion.div>
          </AnimatePresence>
          {description && <p className="truncate text-[12.5px] text-zinc-600 dark:text-zinc-400">{description}</p>}
        </div>
        {action ?? (showPercent && !indeterminate && !error && <Percent value={status === 'done' ? 100 : pct} reduced={reduced} />)}
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {loadStatus}
      </p>
      <p role="alert" className="sr-only">
        {error ? `${errorLabel}.${description ? ` ${description}` : ''}` : ''}
      </p>
      <p aria-live="polite" className="sr-only">
        {msg}
      </p>
    </div>
  )
}
