import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useResolvedTheme, type ThemeMode } from '@/lib/use-resolved-theme'

export type MeshPillOrbState = 'idle' | 'listening' | 'thinking' | 'speaking'

export type MeshPillOrbProps = {
  state?: MeshPillOrbState
  /** External voice level 0–1. Simulated per state when omitted. */
  level?: number
  /** Orb diameter in px (the canvas adds room for rings and motes). */
  size?: number
  /** Four mesh colours: [cool, hot, deep base, warm]. */
  colors?: [string, string, string, string]
  /** Expanding sonar rings behind the orb. */
  rings?: boolean
  /** Tiny motes drifting out from the rim. */
  particles?: boolean
  /** Eyes glance toward the pointer. */
  interactive?: boolean
  /** `auto` follows the nearest `.dark` / `.light` ancestor (only tints rings & motes). */
  theme?: ThemeMode
  /** Renders the orb as a button (e.g. push-to-talk). */
  onClick?: () => void
  /** Accessible name prefix. */
  label?: string
  className?: string
}

export const MESH_PILL_ORB_PALETTES: Record<string, [string, string, string, string]> = {
  lava: ['#35d7f0', '#ff4fa3', '#4c1d95', '#ff7a45'],
  lagoon: ['#7cf5d2', '#5b8cff', '#132a6b', '#c3f36b'],
  dusk: ['#ffc56b', '#ff5e7e', '#3b0f4f', '#b58cff'],
}

const STATE_COPY: Record<MeshPillOrbState, string> = {
  idle: 'resting',
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
function noise(x: number) {
  const i = Math.floor(x)
  const f = x - i
  const u = f * f * (3 - 2 * f)
  return (hash(i) * (1 - u) + hash(i + 1) * u) * 2 - 1
}
function rgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const f = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(f, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const rgba = (c: [number, number, number], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`

function pill(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, rot: number) {
  const r = Math.min(w, h) / 2
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  const l = -w / 2
  const t = -h / 2
  ctx.beginPath()
  ctx.moveTo(l + r, t)
  ctx.lineTo(l + w - r, t)
  ctx.arc(l + w - r, t + r, r, -Math.PI / 2, 0)
  ctx.lineTo(l + w, t + h - r)
  ctx.arc(l + w - r, t + h - r, r, 0, Math.PI / 2)
  ctx.lineTo(l + r, t + h)
  ctx.arc(l + r, t + h - r, r, Math.PI / 2, Math.PI)
  ctx.lineTo(l, t + r)
  ctx.arc(l + r, t + r, r, Math.PI, Math.PI * 1.5)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

type Mote = { a: number; r: number; v: number; swirl: number; life: number; age: number; s: number; tint: number }
type Ring = { age: number; life: number; strength: number }

/* per-state motion language */
const LOOK: Record<
  MeshPillOrbState,
  { flow: number; wobble: number; scale: number; eyeW: number; eyeH: number; eyeY: number; motes: number; ringEvery: number }
> = {
  idle: { flow: 0.32, wobble: 0.034, scale: 1, eyeW: 1, eyeH: 1, eyeY: 0, motes: 5, ringEvery: 3.2 },
  listening: { flow: 0.55, wobble: 0.03, scale: 1.04, eyeW: 1.08, eyeH: 1.14, eyeY: -0.03, motes: 9, ringEvery: 1.25 },
  thinking: { flow: 1.15, wobble: 0.046, scale: 0.97, eyeW: 1, eyeH: 0.62, eyeY: -0.08, motes: 7, ringEvery: 0 },
  speaking: { flow: 0.7, wobble: 0.032, scale: 1.02, eyeW: 1.95, eyeH: 0.3, eyeY: 0.03, motes: 8, ringEvery: 0 },
}

/**
 * Mesh Pill Orb — a lava-lamp gradient mesh swirls inside a softly wobbling
 * blob while two pill eyes give it a face. Idle it drifts and blinks,
 * listening it widens and leans in, thinking it narrows and glances around
 * as orbit arcs spin, speaking its eyes squash into bars that bounce with
 * the voice level. Sonar rings and tiny motes breathe out from the rim.
 */
export function MeshPillOrb({
  state = 'idle',
  level,
  size = 240,
  colors = MESH_PILL_ORB_PALETTES.lava,
  rings = true,
  particles = true,
  interactive = true,
  theme = 'auto',
  onClick,
  label = 'Voice assistant',
  className,
}: MeshPillOrbProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()
  const resolved = useResolvedTheme(rootRef, theme)

  const live = React.useRef({ state, level, colors, rings, particles, interactive, resolved, reduced })
  live.current = { state, level, colors, rings, particles, interactive, resolved, reduced }

  const box = Math.round(size * 1.75)

  React.useEffect(() => {
    const canvas = canvasRef.current
    const root = rootRef.current
    if (!canvas || !root) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const mesh = document.createElement('canvas')
    const M = 72
    mesh.width = M
    mesh.height = M
    const mctx = mesh.getContext('2d')
    if (!mctx) return

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = Math.round(box * dpr)
    canvas.height = Math.round(box * dpr)

    const R = size / 2
    const sizeK = clamp(size / 200, 0.3, 1.2)
    const C = box / 2
    const S = {
      flowT: rand(0, 50),
      rot: 0,
      t: 0,
      lvl: 0,
      wob: sp(0.05),
      scale: sp(1),
      eyeW: sp(1),
      eyeHL: sp(1),
      eyeHR: sp(1),
      eyeY: sp(0),
      gazeX: sp(0),
      gazeY: sp(0),
      tilt: sp(0),
      blink: 0,
      nextBlink: rand(1.2, 3),
      blinkT: -1,
      double: false,
      moteAcc: 0,
      motes: [] as Mote[],
      rings: [] as Ring[],
      ringT: 0,
      peakCool: 0,
      arcs: sp(0),
      pointer: null as null | { x: number; y: number },
      lastState: live.current.state,
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      S.pointer = { x: e.clientX - (r.left + r.width / 2), y: e.clientY - (r.top + r.height / 2) }
    }
    const onLeave = () => (S.pointer = null)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    const simLevel = (st: MeshPillOrbState, t: number) => {
      const gate = clamp((noise(t * 0.55 + 3) + 0.4) * 2.2, 0, 1)
      if (st === 'speaking') {
        const syl = Math.pow(Math.abs(Math.sin(t * 7.1 + Math.sin(t * 1.3) * 1.6)), 1.4)
        return syl * (0.5 + 0.5 * Math.abs(noise(t * 2.3))) * (0.25 + 0.75 * gate)
      }
      if (st === 'listening') return (0.18 + 0.5 * Math.abs(noise(t * 3.1))) * gate
      if (st === 'thinking') return 0.12 + 0.08 * Math.sin(t * 2)
      return 0.05 + 0.04 * Math.sin(t * 0.9)
    }

    const blobR = (a: number, t: number, w: number) =>
      1 +
      w *
        (0.55 * Math.sin(2 * a + t * 0.63 + Math.sin(t * 0.21) * 2) +
          0.35 * Math.sin(3 * a - t * 0.87 + 1.3) +
          0.18 * Math.sin(5 * a + t * 1.21 + 0.4))

    const blobPath = (cx: number, cy: number, r: number, t: number, w: number) => {
      ctx.beginPath()
      const N = 90
      for (let i = 0; i <= N; i++) {
        const a = (i / N) * Math.PI * 2
        const rr = r * blobR(a, t, w)
        const x = cx + Math.cos(a) * rr
        const y = cy + Math.sin(a) * rr
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
    }

    const render = (dt: number, snap: boolean) => {
      const L = live.current
      const st = L.state
      const look = LOOK[st]
      const cols = L.colors.map(rgb) as [number, number, number][]
      const dark = L.resolved === 'dark'
      const still = L.reduced
      if (!still) S.t += dt
      const t = S.t

      /* level */
      const target = L.level !== undefined ? clamp(L.level, 0, 1) : still ? (st === 'speaking' ? 0.2 : st === 'listening' ? 0.35 : 0.08) : simLevel(st, t)
      S.lvl = snap ? target : S.lvl + (target - S.lvl) * (target > S.lvl ? 0.4 : 0.12)
      const lv = S.lvl

      /* springs */
      const stp = (sp_: Spring, target: number, kk: number, cc: number) => {
        if (snap) {
          sp_.v = target
          sp_.a = 0
        } else step(sp_, target, kk, cc, dt)
      }
      const k = 170
      const c = 17
      const lvScale = st === 'listening' ? lv * 0.05 : st === 'speaking' ? lv * 0.07 : 0
      stp(S.scale, look.scale + lvScale + (still ? 0 : Math.sin(t * 1.3) * 0.012), k, c)
      stp(S.wob, look.wobble + (st === 'speaking' ? lv * 0.05 : st === 'listening' ? lv * 0.03 : 0), 60, 14)
      stp(S.arcs, st === 'thinking' ? 1 : 0, k * 0.5, c)

      /* eyes */
      if (!still && st !== S.lastState) {
        // a quick squash between moods
        S.eyeHL.a -= 6
        S.eyeHR.a -= 6
      }
      S.lastState = st
      let eh = look.eyeH
      let ew = look.eyeW
      if (st === 'listening') eh += lv * 0.3
      if (st === 'speaking') {
        eh = 0.26 + lv * 0.62
        ew = 1.95 - lv * 0.35
      }
      // blinks (not while speaking — bars already squash)
      if (!still && st !== 'speaking') {
        S.nextBlink -= dt
        if (S.nextBlink <= 0 && S.blinkT < 0) {
          S.blinkT = 0
          S.double = Math.random() < 0.25
        }
        if (S.blinkT >= 0) {
          S.blinkT += dt
          const dur = 0.16
          const p = S.blinkT / dur
          S.blink = p < 1 ? Math.sin(p * Math.PI) : 0
          if (p >= 1) {
            if (S.double) {
              S.double = false
              S.blinkT = -0.1
              S.nextBlink = 0.08
            } else {
              S.blinkT = -1
              S.nextBlink = st === 'listening' ? rand(3.5, 6) : st === 'thinking' ? rand(1.4, 2.6) : rand(2.2, 4.8)
            }
          }
        }
        if (S.blinkT < 0 && S.nextBlink > 0 && !S.double) S.blink = 0
      } else S.blink = 0
      const blinkH = 1 - 0.9 * S.blink
      const asym = st === 'thinking' ? 0.82 + 0.1 * Math.sin(t * 1.7) : 1
      const phase2 = st === 'speaking' ? 0.08 * Math.sin(t * 13) : 0
      stp(S.eyeW, ew * (1 + 0.25 * S.blink), 320, 20)
      stp(S.eyeHL, eh * blinkH * asym + phase2, 380, 19)
      stp(S.eyeHR, eh * blinkH - phase2, 380, 19)
      stp(S.eyeY, look.eyeY, 200, 20)

      // gaze
      let gx = 0
      let gy = 0
      if (st === 'thinking') {
        gx = Math.sin(t * 0.9) * 0.1
        gy = -0.05 + Math.sin(t * 1.9) * 0.02
      } else if (L.interactive && S.pointer) {
        const dist = Math.hypot(S.pointer.x, S.pointer.y) || 1
        const pull = clamp(dist / (R * 4), 0, 1)
        gx = (S.pointer.x / dist) * 0.11 * pull
        gy = (S.pointer.y / dist) * 0.08 * pull
      } else if (st === 'idle' && !still) {
        gx = noise(t * 0.35 + 7) * 0.08
        gy = noise(t * 0.29 + 19) * 0.04
      }
      stp(S.gazeX, gx, 90, 14)
      stp(S.gazeY, gy, 90, 14)
      const tiltTarget = st === 'listening' ? Math.sin(t * 0.8) * 0.08 : st === 'thinking' ? -0.1 : 0
      stp(S.tilt, still ? 0 : tiltTarget, 60, 12)

      /* flow */
      const flowSpeed = look.flow + (st === 'speaking' ? lv * 1.4 : st === 'listening' ? lv * 0.8 : 0)
      if (!still) {
        S.flowT += dt * flowSpeed
        S.rot += dt * flowSpeed * 0.35
      }

      /* mesh texture (low-res → naturally soft when upscaled) */
      mctx.globalCompositeOperation = 'source-over'
      mctx.fillStyle = rgba(cols[2], 1)
      mctx.fillRect(0, 0, M, M)
      const blobs = [0, 1, 3, 0, 1, 2, 3]
      for (let i = 0; i < blobs.length; i++) {
        const ft = S.flowT
        const x = M / 2 + Math.cos(ft * (0.7 + i * 0.13) + i * 2.1) * M * 0.27 + Math.sin(ft * 0.43 + i) * M * 0.08
        const y = M / 2 + Math.sin(ft * (0.6 + i * 0.11) + i * 1.3) * M * 0.27 + Math.cos(ft * 0.37 + i * 3) * M * 0.08
        const r = M * (0.3 + 0.07 * Math.sin(ft * 0.9 + i * 1.7))
        const col = cols[blobs[i]]
        const g = mctx.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0, rgba(col, i === 5 ? 0.7 : 0.95))
        g.addColorStop(0.55, rgba(col, 0.5))
        g.addColorStop(1, rgba(col, 0))
        mctx.fillStyle = g
        mctx.fillRect(0, 0, M, M)
      }

      /* ------------------------------------------------ draw */
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, box, box)
      const bob = still ? 0 : Math.sin(t * 1.15) * R * 0.028
      const cx = C
      const cy = C + bob
      const r = R * 0.9 * S.scale.v
      const w = S.wob.v

      // halos
      const haloA = dark ? 0.42 : 0.28
      for (let i = 0; i < 2; i++) {
        const ang = S.rot * 0.6 + i * Math.PI
        const hx = cx + Math.cos(ang) * r * 0.25
        const hy = cy + Math.sin(ang) * r * 0.25
        const g = ctx.createRadialGradient(hx, hy, r * 0.6, hx, hy, r * (1.55 + lv * 0.25))
        g.addColorStop(0, rgba(cols[i === 0 ? 1 : 0], haloA * (0.8 + lv * 0.5)))
        g.addColorStop(1, rgba(cols[i === 0 ? 1 : 0], 0))
        ctx.fillStyle = g
        ctx.fillRect(0, 0, box, box)
      }

      // sonar rings
      if (L.rings && !still) {
        S.ringT += dt
        S.peakCool -= dt
        const every = look.ringEvery
        if (every && S.ringT >= every) {
          S.ringT = 0
          S.rings.push({ age: 0, life: 2.6, strength: st === 'listening' ? 0.6 + lv * 0.6 : 0.55 })
        }
        if (st === 'speaking' && lv > 0.58 && S.peakCool <= 0) {
          S.peakCool = 0.38
          S.rings.push({ age: 0, life: 1.9, strength: 0.35 + lv * 0.7 })
        }
        for (const ring of S.rings) ring.age += dt
        S.rings = S.rings.filter((g) => g.age < g.life)
        for (const ring of S.rings) {
          const p = ring.age / ring.life
          const e = 1 - Math.pow(1 - p, 2.2)
          const rr = r * (1.02 + e * 0.78)
          const a = (1 - p) * (1 - p) * ring.strength * (dark ? 0.5 : 0.55)
          ctx.lineWidth = 1.25 * (1 - p * 0.5)
          ctx.strokeStyle = dark ? `rgba(255,255,255,${a})` : rgba(cols[2], a)
          ctx.beginPath()
          ctx.arc(cx, cy, rr, 0, Math.PI * 2)
          ctx.stroke()
        }
      }

      // orbit arcs (thinking)
      if (S.arcs.v > 0.01) {
        const aA = clamp(S.arcs.v, 0, 1)
        for (let i = 0; i < 2; i++) {
          const rr = r * (1.12 + i * 0.1)
          const start = (i ? -1 : 1) * t * (1.9 - i * 0.6) + i * 2.4
          const len = 1.5 - i * 0.5
          const segs = 14
          ctx.lineCap = 'round'
          ctx.lineWidth = Math.max(1.2, R * (0.018 - i * 0.005))
          for (let j = 0; j < segs; j++) {
            const f = (j + 1) / segs
            const a0 = start + (len * j) / segs
            ctx.strokeStyle = rgba(cols[i ? 3 : 0], f * f * aA * (dark ? 0.95 : 0.85))
            ctx.beginPath()
            ctx.arc(cx, cy, rr, a0, a0 + len / segs + 0.01)
            ctx.stroke()
          }
        }
      }

      // orb body
      ctx.save()
      blobPath(cx, cy, r, S.flowT * 1.4 + t * 0.6, w)
      ctx.clip()
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(S.rot)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      const cover = r * 2.5
      ctx.drawImage(mesh, -cover / 2, -cover / 2, cover, cover)
      ctx.restore()
      // depth: darker rim, lit top-left, warm bounce bottom-right
      let g = ctx.createRadialGradient(cx, cy, r * 0.45, cx, cy, r * 1.12)
      g.addColorStop(0, 'rgba(10,2,26,0)')
      g.addColorStop(1, `rgba(10,2,26,${dark ? 0.5 : 0.32})`)
      ctx.fillStyle = g
      ctx.fillRect(cx - r * 1.3, cy - r * 1.3, r * 2.6, r * 2.6)
      g = ctx.createRadialGradient(cx - r * 0.38, cy - r * 0.48, 0, cx - r * 0.38, cy - r * 0.48, r * 0.75)
      g.addColorStop(0, 'rgba(255,255,255,0.3)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.fillRect(cx - r * 1.3, cy - r * 1.3, r * 2.6, r * 2.6)
      g = ctx.createRadialGradient(cx + r * 0.5, cy + r * 0.6, 0, cx + r * 0.5, cy + r * 0.6, r * 0.7)
      g.addColorStop(0, rgba(cols[3], 0.28))
      g.addColorStop(1, rgba(cols[3], 0))
      ctx.fillStyle = g
      ctx.fillRect(cx - r * 1.3, cy - r * 1.3, r * 2.6, r * 2.6)
      ctx.restore()
      blobPath(cx, cy, r, S.flowT * 1.4 + t * 0.6, w)
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(255,255,255,0.14)'
      ctx.stroke()

      // eyes
      const eyeBob = still ? 0 : Math.sin(t * 1.15 - 0.6) * R * 0.012
      const ex = cx + S.gazeX.v * r
      const ey = cy + (S.eyeY.v + S.gazeY.v) * r + eyeBob
      const baseW = r * 0.13
      const baseH = r * 0.36
      const sep = r * 0.2 + (S.eyeW.v - 1) * r * 0.05
      ctx.save()
      ctx.translate(ex, ey)
      ctx.rotate(S.tilt.v)
      ctx.shadowColor = 'rgba(255,255,255,0.55)'
      ctx.shadowBlur = 10 * dpr
      ctx.fillStyle = '#ffffff'
      const wv = Math.max(2, baseW * S.eyeW.v)
      pill(ctx, -sep, 0, wv, Math.max(2.2, baseH * S.eyeHL.v), st === 'thinking' ? 0.06 : 0)
      pill(ctx, sep, 0, wv, Math.max(2.2, baseH * S.eyeHR.v), st === 'thinking' ? -0.06 : 0)
      ctx.restore()

      // motes
      if (L.particles && !still) {
        const rate = (look.motes + (st === 'speaking' || st === 'listening' ? lv * 26 : 0)) * sizeK
        S.moteAcc += dt * rate
        while (S.moteAcc >= 1 && S.motes.length < 70 * sizeK) {
          S.moteAcc -= 1
          S.motes.push({
            a: rand(0, Math.PI * 2),
            r: rand(0.92, 1.0),
            v: rand(0.08, 0.22) * (st === 'speaking' ? 1 + lv : 1),
            swirl: st === 'thinking' ? rand(0.5, 0.9) : rand(-0.08, 0.08),
            life: rand(1.6, 3.2),
            age: 0,
            s: rand(0.6, 1.7) * Math.max(0.6, sizeK),
            tint: Math.floor(rand(0, 4)),
          })
        }
        if (S.moteAcc > 1) S.moteAcc = 1
        for (const m of S.motes) {
          m.age += dt
          m.r += m.v * dt
          m.a += m.swirl * dt
        }
        S.motes = S.motes.filter((m) => m.age < m.life)
        for (const m of S.motes) {
          const p = m.age / m.life
          const a = Math.min(1, p * 5) * (1 - p) * (dark ? 0.85 : 0.7)
          const rr = r * m.r * blobR(m.a, S.flowT * 1.4 + t * 0.6, w * (1 - p))
          ctx.fillStyle = dark ? `rgba(255,255,255,${a})` : rgba(cols[m.tint === 2 ? 2 : m.tint], a)
          ctx.beginPath()
          ctx.arc(cx + Math.cos(m.a) * rr, cy + Math.sin(m.a) * rr, m.s, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    let raf = 0
    let last = performance.now()
    let visible = true
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      render(dt, false)
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      cancelAnimationFrame(raf)
      if (live.current.reduced) {
        render(1, true)
        return
      }
      if (!visible || document.hidden) return
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      start()
    })
    io.observe(canvas)
    const onVis = () => start()
    document.addEventListener('visibilitychange', onVis)
    render(0.016, true)
    start()
    ;(canvas as unknown as { __redraw?: () => void }).__redraw = () => live.current.reduced && render(1, true)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [box, size, reduced])

  // reduced motion: repaint the static frame when inputs change
  React.useEffect(() => {
    const c = canvasRef.current as unknown as { __redraw?: () => void } | null
    c?.__redraw?.()
  }, [state, level, colors, resolved, reduced])

  const name = `${label}: ${STATE_COPY[state]}`
  const inner = (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none block"
      style={{ width: box, height: box, margin: -(box - size) / 2 }}
    />
  )

  return (
    <div ref={rootRef} className={cn('relative inline-grid place-items-center', className)} style={{ width: size, height: size }}>
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          aria-label={name}
          className="grid cursor-pointer place-items-center rounded-full outline-none transition-transform duration-150 focus-visible:ring-2 focus-visible:ring-fuchsia-400 focus-visible:ring-offset-4 focus-visible:ring-offset-white active:scale-[0.97] dark:focus-visible:ring-offset-black"
          style={{ width: size, height: size }}
        >
          {inner}
        </button>
      ) : (
        <div role="img" aria-label={name} className="grid place-items-center" style={{ width: size, height: size }}>
          {inner}
        </div>
      )}
      <span className="sr-only" aria-live="polite">
        {name}
      </span>
    </div>
  )
}
