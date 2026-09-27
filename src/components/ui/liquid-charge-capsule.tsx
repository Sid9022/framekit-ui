import * as React from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type LiquidChargeCapsuleProps = {
  /** Charge level 0–100 (animated). */
  level?: number
  /** Plugged in: bubbles rise, the bolt floats, the surface stirs. */
  charging?: boolean
  /** Capsule height in px (width follows). */
  height?: number
  /** At or below this level the liquid turns red and the status reads low. */
  lowThreshold?: number
  /** Show the percentage + status under the capsule. */
  showReadout?: boolean
  /** Makes the capsule an adjustable slider (drag / arrow keys). */
  onLevelChange?: (level: number) => void
  /** Fires once each time the level reaches 100 while charging. */
  onFull?: () => void
  /** Accessible name. */
  label?: string
  className?: string
}

/* level → hue: ember red → amber → citrus → sage-emerald (kept a notch below neon) */
const STOPS: [number, number][] = [
  [0, 2],
  [15, 16],
  [32, 38],
  [58, 78],
  [82, 128],
  [100, 150],
]
function hueFor(level: number) {
  for (let i = 1; i < STOPS.length; i++) {
    const [l1, h1] = STOPS[i]
    const [l0, h0] = STOPS[i - 1]
    if (level <= l1) return h0 + ((level - l0) / (l1 - l0)) * (h1 - h0)
  }
  return STOPS[STOPS.length - 1][1]
}

type Spring = { v: number; a: number }
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

type Bubble = { x: number; y: number; r: number; v: number; ph: number }
type Pop = { x: number; y: number; age: number }

/**
 * Liquid Charge Capsule — a vertical glass capsule with a two-layer sloshing
 * liquid that rises to the charge level. Colour warms from ember red to a
 * calm emerald as it fills, bubbles rise and pop while charging, a brushed
 * metal bolt floats in the glass and a soft pulse celebrates a full charge.
 */
export function LiquidChargeCapsule({
  level = 64,
  charging = false,
  height = 232,
  lowThreshold = 20,
  showReadout = true,
  onLevelChange,
  onFull,
  label = 'Battery',
  className,
}: LiquidChargeCapsuleProps) {
  const reduced = usePrefersReducedMotion()
  const lv = clamp(Math.round(level), 0, 100)
  const width = Math.round(height * 0.46)
  const pad = Math.max(5, Math.round(height * 0.03))
  const innerW = width - pad * 2
  const innerH = height - pad * 2
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const shellRef = React.useRef<HTMLDivElement>(null)
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '')

  const full = lv >= 100
  const low = lv <= lowThreshold
  const hue = hueFor(lv)
  const live = React.useRef({ lv, charging, reduced })
  live.current = { lv, charging, reduced }

  /* celebration */
  const [celebrate, setCelebrate] = React.useState(0)
  const prevFull = React.useRef(full)
  React.useEffect(() => {
    if (full && !prevFull.current && charging) {
      setCelebrate((n) => n + 1)
      onFull?.()
    }
    prevFull.current = full
  }, [full, charging, onFull])

  /* counting readout */
  const count = useMotionValue(lv)
  const shown = useTransform(count, (v) => Math.round(v))
  React.useEffect(() => {
    if (reduced) {
      count.set(lv)
      return
    }
    const c = animate(count, lv, { duration: 0.6, ease: [0.22, 1, 0.36, 1] })
    return () => c.stop()
  }, [lv, reduced, count])
  const [shownNum, setShownNum] = React.useState(lv)
  React.useEffect(() => shown.on('change', (v) => setShownNum(v)), [shown])

  /* liquid canvas */
  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = Math.round(innerW * dpr)
    canvas.height = Math.round(innerH * dpr)
    const W = innerW
    const H = innerH
    const S = {
      t: rand(0, 20),
      fill: { v: live.current.lv / 100, a: 0 } as Spring,
      tilt: { v: 0, a: 0 } as Spring,
      amp: 1.5,
      hue: hueFor(live.current.lv),
      flash: 0,
      bubbles: [] as Bubble[],
      pops: [] as Pop[],
      acc: 0,
      wasFull: live.current.lv >= 100,
    }

    const render = (dt: number, snap: boolean) => {
      const L = live.current
      const still = L.reduced
      if (!still) S.t += dt
      const t = S.t
      const target = L.lv / 100
      if (snap || still) {
        S.fill.v = target
        S.fill.a = 0
        S.hue = hueFor(L.lv)
      } else {
        const before = S.fill.v
        step(S.fill, target, 38, 11, dt)
        step(S.tilt, 0, 60, 5, dt)
        S.tilt.a += (S.fill.v - before) * -900 * (Math.sin(t * 1.3) > 0 ? 1 : -1)
        S.hue += (hueFor(S.fill.v * 100) - S.hue) * Math.min(1, dt * 6)
      }
      const isFull = L.lv >= 100
      if (isFull && !S.wasFull && L.charging) S.flash = 1
      S.wasFull = isFull
      S.flash = Math.max(0, S.flash - dt * 0.9)

      const baseAmp = L.charging ? 2.6 : 1.4
      const vel = Math.abs(S.fill.a) * 22
      S.amp += (clamp(baseAmp + vel, 0, 9) - S.amp) * Math.min(1, dt * 4)
      const A = still ? 1.2 : S.amp
      const f = clamp(S.fill.v, 0, 1.02)
      const sy = H - f * H * 0.9 - 3
      const h = S.hue
      const light = S.flash * 14

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)
      if (f <= 0.001) return

      const wave = (x: number, layer: number) => {
        const k1 = (Math.PI * 2) / (W * 0.95)
        const k2 = (Math.PI * 2) / (W * 0.55)
        const tilt = S.tilt.v * (x - W / 2) * 0.02
        return layer === 0
          ? sy + Math.sin(x * k1 + t * 1.5) * A * 0.9 + Math.sin(x * k2 - t * 0.8 + 2) * A * 0.35 + tilt * 0.8
          : sy + 2 + Math.sin(x * k1 * 1.15 - t * 2.1 + 1) * A + Math.sin(x * k2 * 0.8 + t * 1.2) * A * 0.45 + tilt
      }

      // back layer
      ctx.beginPath()
      ctx.moveTo(0, H)
      for (let x = 0; x <= W; x += 2) ctx.lineTo(x, wave(x, 0))
      ctx.lineTo(W, H)
      ctx.closePath()
      ctx.fillStyle = `hsla(${h + 6}, 55%, ${33 + light}%, 0.9)`
      ctx.fill()

      // front layer
      ctx.beginPath()
      ctx.moveTo(0, H)
      for (let x = 0; x <= W; x += 2) ctx.lineTo(x, wave(x, 1))
      ctx.lineTo(W, H)
      ctx.closePath()
      const g = ctx.createLinearGradient(0, sy, 0, H)
      g.addColorStop(0, `hsl(${h}, 70%, ${62 + light}%)`)
      g.addColorStop(0.35, `hsl(${h}, 62%, ${47 + light}%)`)
      g.addColorStop(1, `hsl(${h + 10}, 64%, ${27 + light}%)`)
      ctx.fillStyle = g
      ctx.fill()

      // inner depth: side shading + centre light column
      ctx.save()
      ctx.clip()
      const side = ctx.createLinearGradient(0, 0, W, 0)
      side.addColorStop(0, 'rgba(0,0,0,0.28)')
      side.addColorStop(0.28, 'rgba(0,0,0,0)')
      side.addColorStop(0.62, 'rgba(255,255,255,0.07)')
      side.addColorStop(1, 'rgba(0,0,0,0.32)')
      ctx.fillStyle = side
      ctx.fillRect(0, 0, W, H)

      // bubbles
      if (!still && L.charging) {
        S.acc += dt * (3 + (1 - f) * 3)
        while (S.acc >= 1) {
          S.acc -= 1
          if (S.bubbles.length < 26) S.bubbles.push({ x: rand(W * 0.18, W * 0.82), y: H + 4, r: rand(1.2, 3.6), v: rand(22, 48), ph: rand(0, 6) })
        }
      }
      for (const b of S.bubbles) {
        b.y -= b.v * dt * (1 + (3.6 - b.r) * 0.12)
        b.x += Math.sin(t * 3 + b.ph) * 0.25
      }
      const kept: Bubble[] = []
      for (const b of S.bubbles) {
        const top = wave(b.x, 1)
        if (b.y - b.r <= top + 1) S.pops.push({ x: b.x, y: top, age: 0 })
        else kept.push(b)
      }
      S.bubbles = still ? [] : kept
      for (const b of S.bubbles) {
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.12)'
        ctx.fill()
        ctx.lineWidth = 0.8
        ctx.strokeStyle = 'rgba(255,255,255,0.55)'
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.3, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.8)'
        ctx.fill()
      }
      ctx.restore()

      // meniscus highlight
      ctx.beginPath()
      for (let x = 0; x <= W; x += 2) {
        const y = wave(x, 1)
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.lineWidth = 1.4
      ctx.strokeStyle = `hsla(${h}, 90%, 88%, 0.75)`
      ctx.stroke()

      // pops
      for (const p of S.pops) p.age += dt
      S.pops = S.pops.filter((p) => p.age < 0.35)
      for (const p of S.pops) {
        const q = p.age / 0.35
        ctx.beginPath()
        ctx.ellipse(p.x, p.y - 1, 2 + q * 5, 1 + q * 1.6, 0, 0, Math.PI * 2)
        ctx.lineWidth = 0.9
        ctx.strokeStyle = `rgba(255,255,255,${0.7 * (1 - q)})`
        ctx.stroke()
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
      if (live.current.reduced) return render(0, true)
      if (!visible || document.hidden) return
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      start()
    })
    io.observe(canvas)
    document.addEventListener('visibilitychange', start)
    render(0, true)
    start()
    ;(canvas as unknown as { __redraw?: () => void }).__redraw = () => live.current.reduced && render(0, true)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', start)
    }
  }, [innerW, innerH, reduced])

  React.useEffect(() => {
    ;(canvasRef.current as unknown as { __redraw?: () => void } | null)?.__redraw?.()
  }, [lv, charging, reduced])

  /* slider behaviour */
  const interactive = !!onLevelChange
  const setFromY = (clientY: number) => {
    const r = shellRef.current?.getBoundingClientRect()
    if (!r || !onLevelChange) return
    onLevelChange(clamp(Math.round(((r.bottom - pad - clientY) / (r.height - pad * 2)) * 100), 0, 100))
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!onLevelChange) return
    const big = e.shiftKey ? 10 : 1
    const map: Record<string, number> = {
      ArrowUp: lv + big,
      ArrowRight: lv + big,
      ArrowDown: lv - big,
      ArrowLeft: lv - big,
      PageUp: lv + 10,
      PageDown: lv - 10,
      Home: 0,
      End: 100,
    }
    if (e.key in map) {
      e.preventDefault()
      onLevelChange(clamp(map[e.key], 0, 100))
    }
  }

  const status = full && charging ? 'Fully charged' : charging ? 'Charging' : low ? 'Low battery' : full ? 'Full' : 'On battery'
  const announce = full && charging ? `${label} fully charged` : low && !charging ? `${label} low, ${lv}%` : charging ? `${label} charging` : ''
  const glow = `hsl(${hue} 75% 55%)`
  const boltH = Math.round(innerW * 0.62)

  return (
    <div className={cn('inline-flex flex-col items-center gap-4', className)}>
      <div className="relative" style={{ width, height: height + Math.round(height * 0.05) }}>
        {/* terminal nub */}
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 rounded-t-[6px] bg-[linear-gradient(180deg,#f4f4f5,#a1a1aa)] shadow-[inset_0_1px_0_#fff,0_1px_2px_rgb(0_0_0/0.25)] dark:bg-[linear-gradient(180deg,#71717a,#3f3f46)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]"
          style={{ width: width * 0.34, height: Math.round(height * 0.05) }}
          aria-hidden
        />
        {/* reflected glow on the surface below */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-3 left-1/2 h-8 -translate-x-1/2 rounded-full blur-xl"
          style={{ width: width * 1.2 }}
          animate={{ backgroundColor: glow, opacity: 0.18 + (lv / 100) * 0.35 }}
          transition={{ duration: 0.6 }}
        />
        {/* celebration pulse */}
        <AnimatePresence>
          {celebrate > 0 && full && charging && !reduced && (
            <motion.div key={celebrate} className="pointer-events-none absolute inset-x-0 bottom-0" style={{ height }} aria-hidden>
              {[0, 1].map((i) => (
                <motion.span
                  key={i}
                  className="absolute inset-0 rounded-full border-2"
                  style={{ borderColor: glow, boxShadow: `0 0 24px ${glow}` }}
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 1.28 + i * 0.12, opacity: 0 }}
                  transition={{ duration: 1.3, delay: i * 0.28, ease: [0.2, 0.7, 0.3, 1] }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* glass shell */}
        <div
          ref={shellRef}
          role={interactive ? 'slider' : 'meter'}
          tabIndex={interactive ? 0 : undefined}
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={lv}
          aria-valuetext={`${lv}%, ${status.toLowerCase()}`}
          aria-orientation={interactive ? 'vertical' : undefined}
          onKeyDown={onKeyDown}
          onPointerDown={(e) => {
            if (!interactive) return
            e.currentTarget.setPointerCapture(e.pointerId)
            setFromY(e.clientY)
          }}
          onPointerMove={(e) => {
            if (interactive && e.currentTarget.hasPointerCapture(e.pointerId)) setFromY(e.clientY)
          }}
          className={cn(
            'absolute inset-x-0 bottom-0 overflow-hidden rounded-full outline-none',
            'bg-[linear-gradient(90deg,rgb(24_24_27/0.06),rgb(255_255_255/0.7)_40%,rgb(24_24_27/0.05))] shadow-[inset_0_0_0_1px_rgb(24_24_27/0.1),inset_0_2px_0_rgb(255_255_255/0.9),inset_0_-12px_24px_rgb(24_24_27/0.08),0_1px_2px_rgb(24_24_27/0.08),0_24px_40px_-24px_rgb(24_24_27/0.45)]',
            'dark:bg-[linear-gradient(90deg,rgb(255_255_255/0.03),rgb(255_255_255/0.07)_40%,rgb(255_255_255/0.02))] dark:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.12),inset_0_2px_0_rgb(255_255_255/0.12),inset_0_-14px_28px_rgb(0_0_0/0.5),0_30px_50px_-28px_rgb(0_0_0/0.9)]',
            interactive && 'cursor-ns-resize touch-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-emerald-400 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950',
          )}
          style={{ height }}
        >
          <div className="absolute overflow-hidden rounded-full bg-zinc-900/[0.04] dark:bg-black/30" style={{ inset: pad }}>
            <canvas ref={canvasRef} className="block" style={{ width: innerW, height: innerH }} aria-hidden />
          </div>

          {/* floating bolt */}
          <AnimatePresence>
            {charging && (
              <motion.div
                key="bolt"
                className="pointer-events-none absolute inset-0 grid place-items-center"
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.4, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                aria-hidden
              >
                <motion.svg
                  viewBox="0 0 40 64"
                  style={{ height: boltH * 1.6, width: boltH }}
                  className="overflow-visible drop-shadow-[0_6px_10px_rgb(0_0_0/0.35)]"
                  animate={reduced ? undefined : { y: [-4, 4, -4], rotate: [-3, 2.5, -3] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <defs>
                    <linearGradient id={`${uid}-metal`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#ffffff" />
                      <stop offset="0.38" stopColor="#d9dbe0" />
                      <stop offset="0.52" stopColor="#8b8f99" />
                      <stop offset="0.7" stopColor="#eef0f3" />
                      <stop offset="1" stopColor="#9da1ab" />
                    </linearGradient>
                    <linearGradient id={`${uid}-edge`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
                      <stop offset="1" stopColor="#52525b" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>
                  <path d="M24.5 2 5 36.5h13.2L14.8 62 35 25.6H21.6L24.5 2Z" fill={`url(#${uid}-metal)`} stroke={`url(#${uid}-edge)`} strokeWidth="1.2" strokeLinejoin="round" />
                  <path d="M24.5 2 5 36.5h13.2" fill="none" stroke="#fff" strokeOpacity="0.85" strokeWidth="0.9" strokeLinejoin="round" />
                  {!reduced && (
                    <motion.rect
                      x="-10"
                      y="-10"
                      width="8"
                      height="90"
                      fill="#fff"
                      opacity="0.55"
                      transform="rotate(20)"
                      clipPath={`url(#${uid}-clip)`}
                      animate={{ x: [-20, 60] }}
                      transition={{ duration: 1.1, repeat: Infinity, repeatDelay: full ? 0.8 : 3.4, ease: 'easeInOut' }}
                    />
                  )}
                  <clipPath id={`${uid}-clip`}>
                    <path d="M24.5 2 5 36.5h13.2L14.8 62 35 25.6H21.6L24.5 2Z" />
                  </clipPath>
                </motion.svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* glass highlights */}
          <span aria-hidden className="pointer-events-none absolute bottom-[16%] left-[15%] top-[9%] w-[10%] rounded-full bg-[linear-gradient(180deg,rgb(255_255_255/0.85),rgb(255_255_255/0.18)_45%,rgb(255_255_255/0)_85%)] opacity-80 dark:opacity-60" />
          <span aria-hidden className="pointer-events-none absolute right-[20%] top-[7%] h-[5%] w-[12%] rounded-full bg-white/70 blur-[1px] dark:bg-white/45" />
          <span aria-hidden className="pointer-events-none absolute inset-x-[18%] bottom-[3%] h-[6%] rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.35),transparent)]" />
        </div>
      </div>

      {showReadout && (
        <div className="flex flex-col items-center gap-1" aria-hidden>
          <span className="font-semibold tabular-nums tracking-tight text-zinc-900 dark:text-white" style={{ fontSize: Math.max(18, height * 0.13) }}>
            {shownNum}
            <span className="text-[0.6em] font-medium text-zinc-400 dark:text-zinc-500">%</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-zinc-500 dark:text-zinc-400">
            <motion.span className="h-1.5 w-1.5 rounded-full" animate={{ backgroundColor: glow, scale: charging && !full && !reduced ? [1, 1.5, 1] : 1 }} transition={{ scale: { duration: 1.4, repeat: Infinity }, backgroundColor: { duration: 0.5 } }} />
            {status}
          </span>
        </div>
      )}
      <span className="sr-only" aria-live="polite">
        {announce}
      </span>
    </div>
  )
}
