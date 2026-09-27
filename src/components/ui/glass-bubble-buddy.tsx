import * as React from 'react'
import { useInView } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type BubbleBuddyState = 'idle' | 'listening' | 'thinking' | 'speaking'
export type BubbleBuddyMood = 'auto' | 'happy' | 'sleepy'

export type GlassBubbleBuddyProps = {
  state?: BubbleBuddyState
  /** Diameter of the glass sphere in px. */
  size?: number
  /** Body hue (0–360). */
  hue?: number
  /** External voice level 0–1 (speaking, and user input while listening); simulated when omitted. */
  level?: number
  /** Baseline temperament. `auto` lets behaviour decide (gets drowsy when ignored). */
  mood?: BubbleBuddyMood
  /** Seconds of idle without interaction before the buddy gets drowsy. 0 disables. */
  sleepAfter?: number
  /** Watch / react to the pointer. */
  interactive?: boolean
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

/* ---------------------------------------------------------------- helpers */

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
function hash(n: number) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return s - Math.floor(s)
}
/** Smooth 1D value noise in −1…1. */
function noise(x: number) {
  const i = Math.floor(x)
  const f = x - i
  const u = f * f * (3 - 2 * f)
  return (hash(i) * (1 - u) + hash(i + 1) * u) * 2 - 1
}
/** 0→1→0 bump over [t0, t0+dur] with a flat hold in the middle. */
function bump(t: number, t0: number, dur: number, edge = 0.25) {
  const x = (t - t0) / dur
  if (x <= 0 || x >= 1) return 0
  if (x < edge) return Math.sin((x / edge) * Math.PI * 0.5)
  if (x > 1 - edge) return Math.sin(((1 - x) / edge) * Math.PI * 0.5)
  return 1
}

/** Speech-like envelope: syllables, word gaps, phrase pauses. */
type Voice = { mode: 'syl' | 'gap'; el: number; dur: number; amp: number; wide: boolean }
function stepVoice(
  g: Voice,
  dt: number,
  cfg: { phrase: number; word: number; gain: number },
  on: (e: 'syl' | 'phrase', amp: number) => void,
) {
  g.el += dt
  if (g.el >= g.dur) {
    g.el = 0
    const r = Math.random()
    if (g.mode === 'syl' && r < cfg.phrase) {
      g.mode = 'gap'
      g.dur = rand(0.45, 1.05)
      on('phrase', 0)
    } else if (g.mode === 'syl' && r < cfg.phrase + cfg.word) {
      g.mode = 'gap'
      g.dur = rand(0.06, 0.18)
    } else {
      g.mode = 'syl'
      g.dur = rand(0.09, 0.24)
      g.amp = rand(0.35, 1) * cfg.gain
      g.wide = Math.random() < 0.5
      on('syl', g.amp)
    }
  }
  return g.mode === 'syl' ? g.amp * Math.pow(Math.sin((Math.PI * g.el) / g.dur), 0.6) : 0
}

const SPR = {
  gaze: [620, 46],
  head: [55, 12],
  eyeS: [340, 15],
  lid: [260, 26],
  brow: [200, 20],
  soft: [60, 14],
  mouth: [900, 42],
  shape: [220, 22],
  fade: [160, 24],
  body: [120, 15],
  bodyS: [260, 11],
  jelly: [220, 6],
} as const

const KEYS = {
  gazeX: 'gaze', gazeY: 'gaze', headX: 'head', headY: 'head',
  eyeSX: 'eyeS', eyeSY: 'eyeS',
  lidTL: 'lid', lidTR: 'lid', lidRotL: 'lid', lidRotR: 'lid', lidB: 'lid',
  browO: 'brow', browYL: 'brow', browYR: 'brow', browRotL: 'brow', browRotR: 'brow',
  blush: 'soft', thoughtO: 'soft', rippleO: 'soft', causticO: 'soft', bloom: 'soft', hilite: 'soft', zO: 'soft', ringTX: 'soft', ringTY: 'soft',
  mouthOpen: 'mouth', mouthW: 'shape', mouthRot: 'shape', mouthX: 'shape', smileS: 'shape',
  smileO: 'fade', mouthO: 'fade',
  bodyX: 'body', bodyY: 'body', bodyRot: 'body', faceY: 'body', sphY: 'body',
  bodySX: 'bodyS', bodySY: 'bodyS',
  sphSX: 'jelly', sphSY: 'jelly',
} as const
type Key = keyof typeof KEYS
type Targets = Record<Key, number>

const REST: Targets = {
  gazeX: 0, gazeY: 0, headX: 0, headY: 0, eyeSX: 1, eyeSY: 1,
  lidTL: 0, lidTR: 0, lidRotL: 0, lidRotR: 0, lidB: 0,
  browO: 0, browYL: 0, browYR: 0, browRotL: 0, browRotR: 0,
  blush: 0.15, thoughtO: 0, rippleO: 0, causticO: 0, bloom: 1, hilite: 0, zO: 0, ringTX: 70, ringTY: 0,
  mouthOpen: 0.14, mouthW: 1, mouthRot: 0, mouthX: 0, smileS: 1, smileO: 1, mouthO: 0,
  bodyX: 0, bodyY: 0, bodyRot: 0, faceY: 0, sphY: 0, bodySX: 1, bodySY: 1, sphSX: 1, sphSY: 1,
}

/** Eyelids as masks driven by CSS vars: --lt upper lid (0–1), --lr its slant, --lb lower "happy" lid. */
const LID_GRADIENTS =
  'linear-gradient(calc(180deg + var(--lr, 0deg)), transparent calc(var(--lt, 0) * 104% - 2%), #000 calc(var(--lt, 0) * 104% + 3%)), ' +
  'radial-gradient(95% 58% at 50% calc(158% - var(--lb, 0) * 105%), transparent 96%, #000 100%), ' +
  // pill shape lives in the mask (a rounded border here leaves AA ghosts under masked lids in Chromium)
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 20' preserveAspectRatio='none'%3E%3Crect width='10' height='20' rx='5'/%3E%3C/svg%3E")`
const LID_MASK: React.CSSProperties = {
  WebkitMaskImage: LID_GRADIENTS,
  maskImage: LID_GRADIENTS,
  WebkitMaskSize: '100% 100%',
  maskSize: '100% 100%',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskComposite: 'source-in',
  maskComposite: 'intersect',
}

const THINK_SPOTS = [
  [-0.75, -0.85],
  [0.7, -0.8],
  [-0.15, -1],
  [0.9, -0.45],
  [-0.95, -0.4],
]

type Brain = ReturnType<typeof makeBrain>
function makeBrain() {
  const springs = {} as Record<Key, Spring>
  for (const k of Object.keys(REST) as Key[]) springs[k] = sp(REST[k])
  return {
    springs,
    t: 0,
    prevState: '' as BubbleBuddyState | '',
    stateT: 0,
    ptr: { cx: 0, cy: 0, fresh: false, x: 0, y: 0, d: 99, lastMove: -99, has: false },
    hover: false,
    attending: false,
    attendT: -99,
    boredAfter: 2.5,
    gaze: { x: 0, y: 0, next: 0.6 },
    blink: { t0: -9, next: 1.2, dbl: false, dur: 0.16 },
    micro: { kind: '' as '' | 'squint' | 'tilt' | 'hop' | 'glance', t0: -9, dur: 0, dir: 1, next: 4 },
    nod: sp(0),
    nextNod: 1,
    boingT: -9,
    lastActivity: 0,
    drowsy: 0,
    yawn: { t0: -99, next: 6 },
    voice: { mode: 'gap', el: 0, dur: 0.3, amp: 0, wide: false } as Voice,
    ear: { mode: 'gap', el: 0, dur: 0.2, amp: 0, wide: false } as Voice,
    lvl: 0,
    prevExt: 0,
    emphT: -9,
    rings: [-9, -9, -9],
    ringRot: 0,
    ringSpeed: 22,
    pt: 0,
    ptSpeed: 1,
    ripple: 0,
  }
}

/* ------------------------------------------------------------- component */

/**
 * Glass Bubble Buddy — a soft blob character floating inside a glossy glass
 * sphere. A tiny expression system (eyes with lids + catchlights, brows,
 * blush, mouth) and a springy body are driven by one rAF loop with
 * noise-driven timing, so every state has its own personality:
 * idle wanders and notices the pointer, listening leans in and nods,
 * thinking ponders with orbiting sparkles, speaking talks and wobbles.
 */
export function GlassBubbleBuddy({
  state = 'idle',
  size = 220,
  hue = 212,
  level,
  mood = 'auto',
  sleepAfter = 20,
  interactive = true,
  label = 'Assistant',
  onClick,
  className,
}: GlassBubbleBuddyProps) {
  const rootRef = React.useRef<HTMLElement | null>(null)
  const els = React.useRef<Record<string, HTMLElement | null>>({})
  const reduced = usePrefersReducedMotion()
  const inView = useInView(rootRef, { margin: '80px' })
  const S = size
  const brain = React.useRef<Brain>(null as unknown as Brain)
  if (!brain.current) brain.current = makeBrain()
  const props = React.useRef({ state, level, mood, sleepAfter, interactive, reduced, S })
  props.current = { state, level, mood, sleepAfter, interactive, reduced, S }

  const r = (k: string) => (el: HTMLElement | null) => {
    els.current[k] = el
  }

  // ---- one frame of behaviour --------------------------------------------
  const frame = React.useCallback((dt: number, snap: boolean) => {
    const B = brain.current
    const P = props.current
    const { S } = P
    const st = P.state
    const red = P.reduced
    const A = red ? 0.12 : 1 // amplitude of continuous motion
    B.t += dt
    const t = B.t
    const T: Targets = { ...REST }
    const s = B.springs

    // -- pointer (read layout first, before any writes)
    const p = B.ptr
    if (p.fresh && rootRef.current) {
      p.fresh = false
      const rect = rootRef.current.getBoundingClientRect()
      const x = (p.cx - (rect.left + rect.width / 2)) / S
      const y = (p.cy - (rect.top + S / 2)) / S
      p.x = x
      p.y = y
      p.d = Math.hypot(x, y)
      if (p.d < 2.8) {
        if (!B.attending && !red) {
          B.attending = true
          B.attendT = t
          B.boredAfter = rand(1.8, 3.6)
          const startle = B.drowsy > 0.4
          s.eyeSY.a += startle ? 9 : 5
          s.eyeSX.a += startle ? 5 : 3
        }
        if (B.drowsy > 0.3) {
          s.eyeSY.a += 6
          B.drowsy = 0
        }
        p.lastMove = t
        B.lastActivity = t
      }
    }
    if (B.attending && (t - p.lastMove > B.boredAfter || !P.interactive)) {
      B.attending = false
      // lose interest: glance away first
      B.gaze.x = clamp(-p.x, -1, 1) * 0.7 + rand(-0.3, 0.3)
      B.gaze.y = rand(-0.5, 0.4)
      B.gaze.next = t + rand(0.6, 1.4)
    }
    const near = P.interactive && (B.hover || (t - p.lastMove < 1.2 && p.d < 0.62))
    const ptrGX = clamp(p.x / 1.1, -1, 1)
    const ptrGY = clamp(p.y / 1.1, -1, 1)

    // -- state transitions
    if (B.prevState !== st) {
      const first = B.prevState === ''
      B.prevState = st
      B.stateT = t
      B.lastActivity = t
      B.drowsy = Math.min(B.drowsy, 0.2)
      if (!first) {
        B.blink.next = t + 0.05
        if (st === 'listening') {
          s.eyeSY.a += 6
          s.bodySY.a += 2.5
        }
        if (st === 'speaking') s.bodySY.a -= 2
        if (st === 'thinking') B.gaze.next = t
      }
    }
    const since = t - B.stateT

    // -- level (speech envelope / external)
    const ext = P.level
    let lvlT = 0
    let syl = 0
    if (st === 'speaking' || st === 'listening') {
      if (ext != null) {
        lvlT = clamp(ext, 0, 1)
        if (lvlT > 0.72 && B.prevExt <= 0.5) syl = lvlT
        B.prevExt = lvlT
      } else if (st === 'speaking') {
        lvlT = stepVoice(B.voice, dt, { phrase: 0.08, word: 0.22, gain: 1 }, (e, amp) => {
          if (e === 'syl') syl = amp
        })
      } else {
        lvlT = stepVoice(B.ear, dt, { phrase: 0.12, word: 0.3, gain: 0.75 }, (e) => {
          if (e === 'phrase' && Math.random() < 0.75) B.nextNod = t + rand(0.08, 0.3)
        })
      }
      if (red) lvlT = st === 'speaking' ? 0.35 : 0.2
    }
    B.lvl += (lvlT - B.lvl) * clamp((lvlT > B.lvl ? 28 : 12) * dt, 0, 1)
    const lvl = B.lvl
    if (st === 'speaking' && syl > 0) {
      s.sphSY.a += syl * 0.55 * A
      s.sphSX.a -= syl * 0.35 * A
      if (syl > 0.86 && t - B.emphT > 0.9) {
        B.emphT = t
        const i = B.rings.indexOf(Math.min(...B.rings))
        B.rings[i] = t
      }
    }

    // -- blinking (double blinks sometimes)
    const bl = B.blink
    if (t >= bl.next && !snap) {
      bl.t0 = t
      bl.dur = B.drowsy > 0.4 ? 0.38 : 0.15
      const gap = st === 'listening' ? [2.6, 6] : st === 'thinking' ? [2.2, 5] : [1.6, 4.8]
      if (!bl.dbl && Math.random() < 0.24) {
        bl.dbl = true
        bl.next = t + 0.24
      } else {
        bl.dbl = false
        bl.next = t + (red ? rand(5, 9) : rand(gap[0], gap[1]))
      }
    }
    const bx = (t - bl.t0) / bl.dur
    const blink = bx > 0 && bx < 1 ? (bx < 0.4 ? bx / 0.4 : 1 - (bx - 0.4) / 0.6) : 0

    // -- drowsiness
    const idle = st === 'idle'
    let drowsyT = 0
    if (P.mood === 'sleepy') drowsyT = idle ? 0.85 : 0.3
    else if (idle && P.sleepAfter > 0 && t - B.lastActivity > P.sleepAfter && !near) drowsyT = 1
    B.drowsy += (drowsyT - B.drowsy) * clamp((drowsyT > B.drowsy ? 0.3 : 4) * dt, 0, 1)
    const d = B.drowsy

    // -- breathing & drift
    B.pt += dt * B.ptSpeed
    const breathF = 1 / (3.8 + d * 2.2)
    const breath = Math.sin(t * Math.PI * 2 * breathF + noise(t * 0.15) * 1.2) * A
    const driftX = noise(t * 0.23 + 3) * A
    const driftY = noise(t * 0.19 + 11) * A

    // -- gaze scheduler
    const g = B.gaze
    const retarget = (x: number, y: number, hold: number) => {
      g.x = x
      g.y = y
      g.next = t + hold
    }
    const mood = P.mood
    let happy = mood === 'happy' ? 0.35 : 0

    if (idle) {
      // micro-behaviours
      const m = B.micro
      if (!red && t > m.next && !near) {
        const kinds = ['squint', 'tilt', 'hop', 'glance'] as const
        m.kind = kinds[Math.floor(Math.random() * kinds.length)]
        m.t0 = t
        m.dir = Math.random() < 0.5 ? -1 : 1
        m.dur = m.kind === 'squint' ? 1.1 : m.kind === 'tilt' ? 1.6 : m.kind === 'hop' ? 0.5 : 1.8
        m.next = t + rand(3.5, 8) * (1 + d * 2)
        if (m.kind === 'hop') {
          s.bodyY.a -= S * 0.9
          s.bodySY.a += 3
        }
        if (m.kind === 'glance') retarget(1.35 * m.dir, rand(-0.35, 0.15), 1.6)
      }
      const mb = m.kind ? bump(t, m.t0, m.dur, 0.3) : 0
      if (m.kind === 'squint') happy = Math.max(happy, mb * 0.7)
      if (m.kind === 'tilt') T.bodyRot += 7 * m.dir * mb
      if (m.kind === 'glance') T.bodyRot += 3 * m.dir * mb

      if (red) {
        T.gazeX = B.attending ? ptrGX * 0.5 : 0
        T.gazeY = B.attending ? ptrGY * 0.5 : 0.05
      } else if (B.attending) {
        // follow the pointer with interest (+ tiny micro-saccades)
        T.gazeX = ptrGX + noise(t * 3) * 0.04
        T.gazeY = ptrGY + noise(t * 3 + 9) * 0.04
        const notice = bump(t, B.attendT, 0.7, 0.2)
        T.eyeSY += 0.14 * notice
        T.eyeSX += 0.06 * notice
        T.browO = 0.7 * notice
        T.browYL = T.browYR = -0.018 * notice
      } else {
        if (t >= g.next) {
          const r = Math.random()
          const slow = 1 + d * 2.5
          if (r < 0.14) retarget(rand(-0.15, 0.15), rand(-0.1, 0.15), rand(0.8, 2) * slow) // look at viewer
          else if (r < 0.26) retarget(1.3 * (Math.random() < 0.5 ? -1 : 1), rand(-0.4, 0.2), rand(1, 1.8) * slow) // offscreen
          else if (r < 0.4) retarget(clamp(g.x + rand(-0.2, 0.2), -1, 1), clamp(g.y + rand(-0.15, 0.15), -1, 1), rand(0.15, 0.4)) // corrective
          else retarget(rand(-0.85, 0.85), rand(-0.65, 0.55), 0.3 + Math.pow(Math.random(), 1.7) * 1.9 * slow)
        }
        T.gazeX = g.x
        T.gazeY = g.y + d * 0.35
      }
      T.headX = T.gazeX * 0.7
      T.headY = T.gazeY * 0.6

      T.bodyX = driftX * S * 0.035
      T.bodyY = driftY * S * 0.024 + d * S * 0.025
      T.bodyRot += noise(t * 0.17 + 7) * 3 * A + d * 4
      T.bodySY = 1 + 0.028 * breath * (1 + d)
      T.bodySX = 1 - 0.018 * breath * (1 + d)
      T.sphY = noise(t * 0.21) * S * 0.018 * A

      // shy / happy when the pointer is very close or hovering
      if (near) {
        happy = Math.max(happy, 0.95)
        T.blush = 0.9
        T.bodyRot += 6 * (ptrGX >= 0 ? 1 : -1)
        T.gazeY += 0.2
        T.eyeSY -= 0.04
      }

      // sleepy: heavy lids, yawns, zZz
      if (d > 0.01) {
        const lid = d > 0.93 ? 1 : 0.28 + 0.6 * d
        T.lidTL = Math.max(T.lidTL, lid)
        T.lidTR = Math.max(T.lidTR, lid)
        T.smileO = 1 - d * 0.5
        T.zO = clamp((d - 0.7) / 0.3, 0, 1)
        if (!red && d > 0.45 && t > B.yawn.next) {
          B.yawn.t0 = t
          B.yawn.next = t + rand(7, 13)
        }
      }
      const y = d > 0.2 ? bump(t, B.yawn.t0, 2.4, 0.4) : 0
      if (y > 0) {
        T.mouthO = y
        T.smileO *= 1 - y
        T.mouthOpen = 0.14 + 0.9 * y
        T.mouthW = 0.78
        T.lidTL = T.lidTR = Math.max(T.lidTL, y)
        T.bodySY += 0.07 * y
        T.bodySX -= 0.035 * y
        T.browO = Math.max(T.browO, 0.5 * y)
        T.browYL = T.browYR = -0.012 * y
        T.browRotL = -10 * y
        T.browRotR = 10 * y
      }
      T.ringTX = 70 + T.headY * 8
      T.ringTY = T.headX * 12
    } else if (st === 'listening') {
      if (red) {
        T.gazeX = 0
        T.gazeY = 0.08
      } else {
        if (t >= g.next) retarget(rand(-0.12, 0.12), rand(0, 0.2), rand(0.7, 1.6))
        const w = B.attending ? 0.7 : 0
        T.gazeX = g.x * (1 - w) + ptrGX * w
        T.gazeY = g.y * (1 - w) + ptrGY * w
      }
      T.headX = T.gazeX * 0.8
      T.headY = T.gazeY * 0.6
      T.eyeSX = 1.1 + lvl * 0.05
      T.eyeSY = 1.22 + lvl * 0.08
      T.hilite = lvl
      T.browO = 0.75
      T.browYL = T.browYR = -0.016
      T.browRotL = -6
      T.browRotR = 6
      T.smileO = 0.85
      T.smileS = 0.75
      T.blush = 0.28
      // nods — after the user's phrases and now and then
      if (!red && t > B.nextNod) {
        B.nod.a += 2.4
        B.nextNod = t + rand(1.1, 2.6)
      }
      step(B.nod, 0, 90, 9, dt)
      T.faceY = S * (0.016 + B.nod.v * 0.02)
      T.bodyY = S * (0.012 + B.nod.v * 0.012) + driftY * S * 0.01
      T.bodyX = T.headX * S * 0.03
      T.bodyRot = T.headX * 5 + noise(t * 0.4) * 1.5 * A
      T.bodySX = 1.045 - 0.01 * breath
      T.bodySY = 1.045 + 0.014 * breath
      T.sphY = noise(t * 0.3) * S * 0.01 * A
      T.rippleO = 0.35 + lvl * 0.65
      T.bloom = 1.04 + lvl * 0.16
      T.ringTX = 76 + B.nod.v * 4
      T.ringTY = T.headX * 10
    } else if (st === 'thinking') {
      if (t >= g.next || since < 0.02) {
        let spot = THINK_SPOTS[Math.floor(Math.random() * THINK_SPOTS.length)]
        if (Math.abs(spot[0] - g.x) < 0.1) spot = THINK_SPOTS[(THINK_SPOTS.indexOf(spot) + 1) % THINK_SPOTS.length]
        retarget(spot[0], spot[1], red ? 99 : rand(0.7, 1.9))
      }
      T.gazeX = g.x + noise(t * 2) * 0.05 * A
      T.gazeY = g.y
      T.headX = T.gazeX * 0.55
      T.headY = T.gazeY * 0.5
      T.eyeSX = 0.96
      T.lidTL = 0.06
      T.lidTR = 0.44
      T.lidRotR = -14
      T.lidB = 0.1
      T.browO = 0.85
      T.browYL = -0.02
      T.browRotL = -12
      T.browYR = 0.002
      T.browRotR = 14
      T.smileO = 0
      T.mouthO = 1
      T.mouthOpen = 0.13
      T.mouthW = 0.5
      T.mouthRot = -12
      T.mouthX = 0.02 + noise(t * 0.9) * 0.008 * A
      T.blush = 0.1
      T.bodyRot = -5 + T.gazeX * 4 + noise(t * 0.3 + 2) * 5 * A
      T.bodyX = noise(t * 0.25 + 5) * S * 0.03 * A
      T.bodyY = driftY * S * 0.012
      T.bodySY = 1 + 0.015 * breath
      T.bodySX = 1 - 0.01 * breath
      T.sphY = noise(t * 0.2) * S * 0.012 * A
      T.thoughtO = 1
      T.bloom = 0.95
      T.ringTX = 64
      T.ringTY = T.headX * 14
    } else {
      // speaking
      if (red) {
        T.gazeX = 0
        T.gazeY = 0
      } else {
        if (t >= g.next) retarget(rand(-0.35, 0.35), rand(-0.2, 0.15), rand(0.6, 1.8))
        const w = B.attending ? 0.55 : 0
        T.gazeX = g.x * (1 - w) + ptrGX * w
        T.gazeY = g.y * (1 - w) + ptrGY * w
      }
      T.headX = T.gazeX * 0.5
      T.headY = T.gazeY * 0.4
      const e = bump(t, B.emphT, 0.45, 0.3)
      happy = Math.max(happy, e * 0.62)
      T.eyeSY = 1 - lvl * 0.06
      T.browO = 0.35 + 0.5 * e
      T.browYL = T.browYR = -0.006 - 0.014 * e
      T.blush = 0.2 + 0.45 * e
      T.smileO = 0
      T.mouthO = 1
      T.mouthOpen = 0.14 + lvl * 0.86
      T.mouthW = B.voice.wide ? 1.18 - lvl * 0.22 : 0.84 + lvl * 0.06
      T.bodyY = -lvl * S * 0.04
      T.bodySY = 1 + lvl * 0.085
      T.bodySX = 1 - lvl * 0.04
      T.bodyRot = noise(t * 0.6) * 4 * A + T.gazeX * 3
      T.bodyX = noise(t * 0.3 + 1) * S * 0.015 * A
      T.sphY = noise(t * 0.4) * S * 0.01 * A
      T.causticO = lvl * 0.75
      T.bloom = 1 + lvl * 0.3
      T.ringTX = 70 + lvl * 6
      T.ringTY = T.headX * 10
    }

    // happy squint / ^ ^ eyes + blush
    const boing = t - B.boingT
    const giggle = boing < 1 ? bump(t, B.boingT, 1, 0.15) : 0
    happy = Math.max(happy, giggle)
    if (happy > 0) {
      T.lidB = Math.max(T.lidB, 0.58 * happy)
      T.blush = Math.max(T.blush, 0.85 * happy)
      T.smileS = Math.max(T.smileS, 1 + 0.35 * happy)
      T.lidTL = Math.max(0, T.lidTL - happy * 0.5)
      T.lidTR = Math.max(0, T.lidTR - happy * 0.5)
    }
    if (giggle > 0 && st !== 'speaking') {
      T.mouthO = giggle
      T.smileO *= 1 - giggle
      T.mouthOpen = 0.25 + 0.3 * Math.abs(Math.sin(boing * 24))
      T.mouthW = 1.1
    }
    const wiggle = boing < 1 && !red ? Math.sin(boing * 30) * 8 * Math.exp(-boing * 4) : 0

    // -- springs
    for (const k of Object.keys(T) as Key[]) {
      const sv = s[k]
      if (snap) {
        sv.v = T[k]
        sv.a = 0
      } else {
        const [kk, cc] = SPR[KEYS[k]]
        step(sv, T[k], kk, cc, dt)
      }
    }

    // ring spin + particles + ripples
    const spinT = red ? 0 : st === 'thinking' ? 190 : st === 'speaking' ? 60 + lvl * 160 : st === 'listening' ? 40 : 22 * (1 - d * 0.7)
    B.ringSpeed += (spinT - B.ringSpeed) * clamp(dt * 2.5, 0, 1)
    B.ringRot = (B.ringRot + B.ringSpeed * dt) % 360
    const ptT = red ? 0 : st === 'thinking' ? 2.4 : st === 'speaking' ? 1.6 : st === 'listening' ? 1.3 : 1 - d * 0.6
    B.ptSpeed += (ptT - B.ptSpeed) * clamp(dt * 2, 0, 1)
    B.ripple += dt * (red ? 0 : 0.5 + lvl * 0.7)

    // -- write styles (transforms / opacity only)
    const E = els.current
    const v = (k: Key) => s[k].v
    const set = (k: string, tr: string, o?: number) => {
      const el = E[k]
      if (!el) return
      el.style.transform = tr
      if (o != null) el.style.opacity = String(o)
    }
    const gx = v('gazeX')
    const gy = v('gazeY')
    const hx = v('headX')
    const hy = v('headY')
    const rot = v('bodyRot') + hx * 4 + wiggle
    set('sphere', `translate3d(0,${v('sphY')}px,0) scale(${v('sphSX')},${v('sphSY')})`)
    set('shadow', `scaleX(${1 - (v('bodyY') + v('sphY')) / S * -1.2 - 0.02 * breath})`, 0.8 + (v('bodyY') + v('sphY')) / S * 2)
    set('bloom', `scale(${v('bloom')})`)
    set('blob', `translate3d(${v('bodyX')}px,${v('bodyY')}px,0) rotate(${rot}deg)`)
    set('squash', `scale(${v('bodySX')},${v('bodySY')})`)
    set('face', `translate3d(${hx * S * 0.035 + gx * S * 0.008}px,${hy * S * 0.03 + v('faceY')}px,0)`)
    const ex = gx * S * 0.022
    const ey = gy * S * 0.018
    const esy = v('eyeSY') * (1 - 0.92 * blink)
    for (const side of ['L', 'R'] as const) {
      const lidT = clamp(side === 'L' ? v('lidTL') : v('lidTR'), 0, 1.05)
      const lidR = side === 'L' ? v('lidRotL') : v('lidRotR')
      set(`eye${side}`, `translate3d(${ex}px,${ey}px,0) scale(${v('eyeSX')},${esy})`)
      const lidEl = E[`lid${side}`]
      if (lidEl) {
        lidEl.style.setProperty('--lt', lidT.toFixed(3))
        lidEl.style.setProperty('--lr', `${lidR.toFixed(2)}deg`)
        lidEl.style.setProperty('--lb', clamp(v('lidB'), 0, 0.9).toFixed(3))
      }
      set(`hi${side}`, `translate(${-gx * S * 0.006}px,${-gy * S * 0.005}px) scale(${1 + v('hilite') * 0.35})`, clamp(0.8 + v('hilite') * 0.2, 0, 1))
      set(
        `brow${side}`,
        `translate3d(${ex * 0.6}px,${(side === 'L' ? v('browYL') : v('browYR')) * S + ey * 0.5}px,0) rotate(${side === 'L' ? v('browRotL') : v('browRotR')}deg)`,
        clamp(v('browO'), 0, 1),
      )
      set(`cheek${side}`, `scale(${0.8 + v('blush') * 0.3})`, clamp(v('blush'), 0, 1))
    }
    set('smile', `translateX(${v('mouthX') * S}px) scale(${v('smileS')})`, clamp(v('smileO'), 0, 1))
    set(
      'mouth',
      `translateX(${v('mouthX') * S}px) rotate(${v('mouthRot')}deg) scale(${v('mouthW')},${clamp(v('mouthOpen'), 0.08, 1.1)})`,
      clamp(v('mouthO'), 0, 1),
    )
    set('tongue', 'none', clamp((v('mouthOpen') - 0.3) * 3, 0, 1))
    set('ringBack', `rotateX(${v('ringTX')}deg) rotateY(${v('ringTY')}deg) rotateZ(-16deg)`)
    set('ringFront', `rotateX(${v('ringTX')}deg) rotateY(${v('ringTY')}deg) rotateZ(-16deg)`)
    set('ringSpinBack', `rotate(${B.ringRot}deg)`)
    set('ringSpinFront', `rotate(${B.ringRot}deg)`)
    set('hilite', `translate3d(${-hx * S * 0.012}px,${-hy * S * 0.01}px,0)`)
    set('caustic', `rotate(${B.ringRot * 0.3}deg) scale(${1 + lvl * 0.08})`, clamp(v('causticO'), 0, 1))
    // ripples inside the glass
    for (let i = 0; i < 3; i++) {
      const ph = (B.ripple + i / 3) % 1
      set(`rip${i}`, `scale(${0.45 + ph * 0.75})`, clamp(v('rippleO'), 0, 1) * Math.pow(1 - ph, 1.4) * (ph < 0.08 ? ph / 0.08 : 1))
    }
    // emitted rings (speaking emphasis)
    for (let i = 0; i < 3; i++) {
      const ph = (t - B.rings[i]) / 1.4
      set(`emit${i}`, `scale(${1 + clamp(ph, 0, 1) * 0.4})`, ph >= 0 && ph < 1 && !red ? Math.pow(1 - ph, 1.5) * 0.6 : 0)
    }
    // thought sparkles orbit
    const to = clamp(v('thoughtO'), 0, 1)
    for (let i = 0; i < 3; i++) {
      const a = t * (red ? 0 : 1.7) + i * 2.09
      const depth = Math.sin(a)
      set(
        `dot${i}`,
        `translate3d(${Math.cos(a) * S * 0.31}px,${depth * S * 0.075 - S * 0.02 * Math.cos(a)}px,0) scale(${(0.75 + depth * 0.25) * (0.6 + to * 0.4)})`,
        to * (0.45 + 0.55 * (depth * 0.5 + 0.5)),
      )
    }
    // ambient motes
    for (let i = 0; i < 6; i++) {
      const px = noise(B.pt * 0.35 + i * 17.3) * S * 0.3
      const py = noise(B.pt * 0.3 + i * 31.7 + 5) * S * 0.3
      set(`mote${i}`, `translate3d(${px}px,${py}px,0)`, 0.25 + 0.55 * (noise(t * 0.8 + i * 9) * 0.5 + 0.5) * (1 - d * 0.6))
    }
    // zZz
    const zo = clamp(v('zO'), 0, 1)
    for (let i = 0; i < 2; i++) {
      const ph = (t / 2.6 + i * 0.5) % 1
      set(`z${i}`, `translate3d(${ph * S * 0.12}px,${-ph * S * 0.2}px,0) scale(${0.6 + ph * 0.6}) rotate(${-10 + ph * 20}deg)`, zo * Math.sin(ph * Math.PI))
    }
  }, [])

  // ---- rAF loop: only while visible --------------------------------------
  React.useEffect(() => {
    if (!inView) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      frame(dt, false)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, frame])

  // settle immediately on mount / when paused offscreen
  React.useLayoutEffect(() => {
    if (!inView) frame(0, true)
  }, [inView, frame, state, size, mood])

  // pointer
  React.useEffect(() => {
    if (!interactive || !inView) return
    const onMove = (e: PointerEvent) => {
      const p = brain.current.ptr
      p.cx = e.clientX
      p.cy = e.clientY
      p.fresh = true
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [interactive, inView])

  const handleClick = () => {
    const B = brain.current
    B.boingT = B.t
    B.lastActivity = B.t
    B.drowsy = 0
    const s = B.springs
    s.bodySY.a -= 7
    s.bodySX.a += 5
    s.sphSY.a -= 1.2
    s.sphSX.a += 0.9
    onClick?.()
  }

  /* ----------------------------------------------------------- geometry */
  const eyeW = S * 0.064
  const eyeH = S * 0.13
  const eyeDX = S * 0.07
  const bw = S * 0.55
  const bh = S * 0.49
  const eyeCY = bh * 0.36
  const ink = `hsl(${hue + 12} 70% 15%)`
  const line = Math.max(1.5, S * 0.011)

  const Root = onClick ? 'button' : 'div'
  return (
    <Root
      ref={rootRef as React.Ref<HTMLButtonElement & HTMLDivElement>}
      {...(onClick ? { type: 'button' as const } : { role: 'img' })}
      onClick={handleClick}
      onPointerEnter={() => (brain.current.hover = true)}
      onPointerLeave={() => (brain.current.hover = false)}
      aria-label={`${label}: ${STATE_COPY[state]}`}
      data-state={state}
      className={cn(
        'relative inline-block shrink-0 select-none rounded-full outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent',
        onClick && 'cursor-pointer',
        className,
      )}
      style={{ width: S, height: S * 1.14 }}
    >
      {/* bloom */}
      <span
        ref={r('bloom')}
        aria-hidden
        className="pointer-events-none absolute left-1/2 rounded-full opacity-40 blur-2xl dark:opacity-80"
        style={{
          width: S * 1.05,
          height: S * 1.05,
          marginLeft: -S * 0.525,
          top: -S * 0.025,
          background: `radial-gradient(circle, hsla(${hue}, 95%, 62%, 0.55), hsla(${hue + 30}, 95%, 60%, 0.15) 55%, transparent 70%)`,
        }}
      />

      {/* floor shadow */}
      <span
        ref={r('shadow')}
        aria-hidden
        className="pointer-events-none absolute left-1/2 rounded-[50%] bg-slate-900/25 blur-md dark:bg-black/60"
        style={{ width: S * 0.56, height: S * 0.07, marginLeft: -S * 0.28, top: S * 1.04 }}
      />

      {/* sphere */}
      <span ref={r('sphere')} className="absolute left-0 top-0 block rounded-full" style={{ width: S, height: S, perspective: S * 3, transformOrigin: '50% 70%' }}>
        {/* emitted rings */}
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            ref={r(`emit${i}`)}
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full opacity-0"
            style={{ border: `${line}px solid hsla(${hue}, 90%, 62%, 0.7)` }}
          />
        ))}

        {/* glass body */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full ring-1 ring-slate-900/10 backdrop-blur-[3px] dark:ring-white/25"
          style={{
            background: `radial-gradient(circle at 50% 58%, hsla(${hue}, 90%, 80%, 0.08), hsla(${hue}, 90%, 62%, 0.16) 60%, hsla(${hue + 8}, 95%, 55%, 0.5) 100%)`,
            boxShadow: `inset 0 -${S * 0.08}px ${S * 0.16}px hsla(${hue}, 95%, 55%, 0.35), inset 0 ${S * 0.04}px ${S * 0.1}px rgba(255,255,255,0.55), 0 ${S * 0.1}px ${S * 0.2}px -${S * 0.08}px hsla(${hue}, 80%, 40%, 0.45)`,
          }}
        />

        {/* inner glass content (clipped) */}
        <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              ref={r(`rip${i}`)}
              className="absolute rounded-full opacity-0"
              style={{
                width: S * 0.95,
                height: S * 0.95,
                left: S * 0.025,
                top: S * 0.08,
                border: `${line}px solid hsla(${hue - 10}, 100%, 88%, 0.75)`,
                boxShadow: `0 0 ${S * 0.04}px hsla(${hue}, 100%, 70%, 0.5), inset 0 0 ${S * 0.03}px hsla(${hue}, 100%, 75%, 0.4)`,
              }}
            />
          ))}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              ref={r(`mote${i}`)}
              className="absolute rounded-full"
              style={{
                width: S * (0.014 + (i % 3) * 0.005),
                height: S * (0.014 + (i % 3) * 0.005),
                left: S * 0.5,
                top: S * 0.52,
                background: `radial-gradient(circle, rgba(255,255,255,0.95), hsla(${hue}, 100%, 85%, 0.4) 60%, transparent 72%)`,
              }}
            />
          ))}
        </span>

        <Ring S={S} hue={hue} half="back" tiltRef={r('ringBack')} spinRef={r('ringSpinBack')} />

        {/* blob */}
        <span ref={r('blob')} aria-hidden className="absolute block" style={{ width: bw, height: bh, left: (S - bw) / 2, top: S * 0.3, transformOrigin: '50% 90%' }}>
          <span
            ref={r('squash')}
            className="absolute inset-0 block"
            style={{
              borderRadius: '50% 50% 46% 54% / 55% 50% 50% 45%',
              transformOrigin: '50% 92%',
              background: `radial-gradient(circle at 34% 28%, hsl(${hue - 6} 100% 95%), hsl(${hue} 95% 78%) 38%, hsl(${hue + 6} 90% 62%) 78%, hsl(${hue + 12} 85% 52%))`,
              boxShadow: `inset -${S * 0.03}px -${S * 0.05}px ${S * 0.09}px hsla(${hue + 10}, 90%, 42%, 0.45), inset ${S * 0.025}px ${S * 0.035}px ${S * 0.06}px rgba(255,255,255,0.7), 0 ${S * 0.03}px ${S * 0.1}px hsla(${hue}, 95%, 55%, 0.55)`,
            }}
          >
            {/* body gloss */}
            <span
              className="absolute rounded-full"
              style={{ left: '16%', top: '9%', width: '26%', height: '15%', transform: 'rotate(-24deg)', background: 'radial-gradient(ellipse, rgba(255,255,255,0.85), transparent 70%)' }}
            />
            <span ref={r('face')} className="absolute inset-0 block">
              {/* cheeks */}
              {(['L', 'R'] as const).map((side) => (
                <span
                  key={side}
                  ref={r(`cheek${side}`)}
                  className="absolute rounded-full blur-[2px]"
                  style={{
                    width: S * 0.085,
                    height: S * 0.05,
                    top: eyeCY + S * 0.075,
                    left: bw / 2 + (side === 'L' ? -1 : 1) * S * 0.135 - S * 0.0425,
                    background: 'radial-gradient(ellipse, rgba(255,120,160,0.75), rgba(255,140,175,0.35) 60%, transparent 75%)',
                  }}
                />
              ))}
              {/* brows */}
              {(['L', 'R'] as const).map((side) => (
                <span
                  key={side}
                  ref={r(`brow${side}`)}
                  className="absolute rounded-full opacity-0"
                  style={{
                    width: S * 0.058,
                    height: Math.max(1.5, S * 0.012),
                    top: eyeCY - eyeH / 2 - S * 0.035,
                    left: bw / 2 + (side === 'L' ? -1 : 1) * eyeDX - S * 0.029,
                    background: ink,
                  }}
                />
              ))}
              {/* eyes */}
              {(['L', 'R'] as const).map((side) => (
                <span
                  key={side}
                  ref={r(`eye${side}`)}
                  className="absolute block"
                  style={{ width: eyeW, height: eyeH, top: eyeCY - eyeH / 2, left: bw / 2 + (side === 'L' ? -1 : 1) * eyeDX - eyeW / 2 }}
                >
                  <span ref={r(`lid${side}`)} className="absolute inset-0 block" style={{ background: ink, ...LID_MASK }}>
                    <span ref={r(`hi${side}`)} className="absolute inset-0 block">
                      <span className="absolute rounded-full bg-white/90" style={{ left: '20%', top: '13%', width: '46%', height: '25%' }} />
                      <span className="absolute rounded-full bg-white/60" style={{ left: '56%', top: '60%', width: '22%', height: '11%' }} />
                    </span>
                  </span>
                </span>
              ))}
              {/* mouth: smile + talking mouth */}
              <span
                ref={r('smile')}
                className="absolute block"
                style={{
                  width: S * 0.056,
                  height: S * 0.028,
                  top: bh * 0.6,
                  left: bw / 2 - S * 0.028,
                  borderBottom: `${line}px solid ${ink}`,
                  borderRadius: '0 0 999px 999px',
                }}
              />
              <span
                ref={r('mouth')}
                className="absolute block overflow-hidden opacity-0"
                style={{
                  width: S * 0.082,
                  height: S * 0.078,
                  top: bh * 0.6 - S * 0.016,
                  left: bw / 2 - S * 0.041,
                  background: ink,
                  borderRadius: '42% 42% 50% 50% / 38% 38% 62% 62%',
                }}
              >
                <span ref={r('tongue')} className="absolute rounded-full" style={{ left: '20%', width: '60%', height: '46%', bottom: '-14%', background: 'hsl(350 85% 68%)' }} />
              </span>
            </span>
          </span>
        </span>

        <Ring S={S} hue={hue} half="front" tiltRef={r('ringFront')} spinRef={r('ringSpinFront')} />

        {/* thought sparkles */}
        <span aria-hidden className="pointer-events-none absolute block" style={{ left: S * 0.5, top: S * 0.27, width: 0, height: 0 }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              ref={r(`dot${i}`)}
              className="absolute block rounded-full opacity-0"
              style={{
                width: S * (0.045 - i * 0.008),
                height: S * (0.045 - i * 0.008),
                left: -S * (0.0225 - i * 0.004),
                top: -S * (0.0225 - i * 0.004),
                background: `radial-gradient(circle at 35% 35%, #fff, hsl(${hue - 10} 100% 88%) 55%, hsl(${hue} 90% 70%))`,
                boxShadow: `0 0 ${S * 0.04}px hsla(${hue}, 100%, 70%, 0.9)`,
              }}
            />
          ))}
        </span>

        {/* caustics */}
        <span
          ref={r('caustic')}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full opacity-0"
          style={{
            background: `radial-gradient(circle at 28% 74%, rgba(255,255,255,0.55), transparent 22%), radial-gradient(circle at 74% 64%, hsla(${hue - 25}, 100%, 88%, 0.5), transparent 20%), radial-gradient(circle at 50% 90%, hsla(${hue + 30}, 100%, 85%, 0.45), transparent 30%)`,
          }}
        />

        {/* specular highlights */}
        <span ref={r('hilite')} aria-hidden className="pointer-events-none absolute inset-0 rounded-full">
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
          <span className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle at 50% 110%, hsla(${hue - 10}, 100%, 85%, 0.55), transparent 42%)` }} />
          <span
            className="absolute inset-0 rounded-full"
            style={{ boxShadow: `inset ${S * 0.02}px -${S * 0.01}px ${S * 0.02}px rgba(255,255,255,0.35), inset -${S * 0.015}px 0 ${S * 0.03}px hsla(${hue}, 90%, 70%, 0.35)` }}
          />
        </span>

        {/* zZz */}
        {[0, 1].map((i) => (
          <span
            key={i}
            ref={r(`z${i}`)}
            aria-hidden
            className="pointer-events-none absolute font-semibold text-slate-500 opacity-0 dark:text-white/80"
            style={{ left: S * 0.7, top: S * 0.2, fontSize: Math.max(9, S * 0.075), lineHeight: 1 }}
          >
            z
          </span>
        ))}
      </span>
    </Root>
  )
}

function Ring({
  S,
  hue,
  half,
  tiltRef,
  spinRef,
}: {
  S: number
  hue: number
  half: 'back' | 'front'
  tiltRef: (el: HTMLElement | null) => void
  spinRef: (el: HTMLElement | null) => void
}) {
  const d = S * 0.84
  return (
    <span
      ref={tiltRef}
      aria-hidden
      className="pointer-events-none absolute block"
      style={{
        width: d,
        height: d,
        left: (S - d) / 2,
        top: (S - d) / 2 + S * 0.07,
        transform: 'rotateX(70deg) rotateZ(-16deg)',
        clipPath: half === 'back' ? 'inset(0 0 50% 0)' : 'inset(50% 0 0 0)',
        opacity: half === 'back' ? 0.55 : 1,
      }}
    >
      <span
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: `0 0 0 ${Math.max(1.5, S * 0.009)}px rgba(255,255,255,0.55), 0 0 ${S * 0.05}px hsla(${hue}, 95%, 70%, 0.6)` }}
      />
      <span
        ref={spinRef}
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.95) 40deg, hsla(${hue}, 100%, 75%, 0.9) 70deg, transparent 120deg, transparent 200deg, hsla(${hue + 40}, 100%, 80%, 0.8) 240deg, transparent 290deg)`,
          WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${S * 0.022}px), #000 calc(100% - ${S * 0.018}px))`,
          mask: `radial-gradient(farthest-side, transparent calc(100% - ${S * 0.022}px), #000 calc(100% - ${S * 0.018}px))`,
        }}
      />
    </span>
  )
}
