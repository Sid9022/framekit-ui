import * as React from 'react'
import { ArrowUpRight, Pause, Play } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type TunnelItem = {
  id: string
  /** Shown on a small pill and used for the link's accessible name. */
  label?: string
  /** Makes the card a link. */
  href?: string
  /** Backdrop behind the content (any CSS background). */
  tint?: string
  /** Forces a `.light` / `.dark` scope inside the card so tinted backdrops keep legible content. */
  tone?: 'light' | 'dark'
  /** Any React node: a live component, an illustration, a video… Fills the 3:4 card. */
  content?: React.ReactNode
  /** Image URL used when there is no `content`. */
  src?: string
  alt?: string
}

export type PerspectiveTunnelCarouselProps = {
  items?: TunnelItem[]
  /** Alternative to `items`: every child becomes one card. */
  children?: React.ReactNode
  /** Drift speed in cards per second. */
  speed?: number
  direction?: 'left' | 'right'
  /** Screen width (px) of a flat card on the back wall. Auto from the container width when omitted. */
  centerWidth?: number
  /** Card width (px) where the side walls meet the container edge (the card's real size). Auto when omitted. */
  edgeWidth?: number
  /** How many cards sit flat on the back wall before the corridor turns. Auto (1 on phones, 3 on desktop). */
  flatCount?: number
  /** Angle (deg) the side walls turn to. 90 is a straight corridor; lower splays the walls open. */
  wallAngle?: number
  /** CSS perspective (px). Auto: wide-angle on desktop, gentler on phones. */
  perspective?: number
  /** Gap between cards as a share of the card width. */
  gap?: number
  paused?: boolean
  defaultPaused?: boolean
  onPausedChange?: (paused: boolean) => void
  pauseOnHover?: boolean
  /** Drag (mouse or touch) to scrub; releasing throws with inertia. */
  draggable?: boolean
  /** Clip cards to the root box. Turn off to let the tunnel bleed into a larger, clipped section. */
  clip?: boolean
  /** Mount each card's content only once it first drifts into view. */
  lazy?: boolean
  /** Element used for linked cards (e.g. a router link that accepts `href`). */
  linkAs?: React.ElementType
  /** Render the built-in pause / play button (autoplay longer than 5 s needs one). Turn off if you render your own. */
  controls?: boolean
  /** Accessible name of the list. */
  label?: string
  className?: string
}

/* Generated, original placeholder art (gradient posters). */
const ART: { a: string; b: string; c: string; shape: 'orb' | 'arch' | 'grid' | 'wave' | 'ring' | 'stack'; label: string; tone: 'light' | 'dark' }[] = [
  { a: '#0B0B0F', b: '#3A2BFF', c: '#D9F95C', shape: 'orb', label: 'Orbit', tone: 'dark' },
  { a: '#F5E9DA', b: '#FF8A5B', c: '#2B5BFF', shape: 'arch', label: 'Arcade', tone: 'light' },
  { a: '#0E1A14', b: '#1FD18A', c: '#E9FFF4', shape: 'grid', label: 'Lattice', tone: 'dark' },
  { a: '#E8EEFF', b: '#7C9BFF', c: '#0A0A0B', shape: 'wave', label: 'Tide', tone: 'light' },
  { a: '#1A0B12', b: '#FF4D7E', c: '#FFD6E2', shape: 'ring', label: 'Halo', tone: 'dark' },
  { a: '#EEF8C8', b: '#9BD400', c: '#0A0A0B', shape: 'stack', label: 'Stack', tone: 'light' },
  { a: '#101014', b: '#8F6BFF', c: '#F4F4F4', shape: 'arch', label: 'Portal', tone: 'dark' },
  { a: '#FFF1E6', b: '#FFB23F', c: '#3A1D00', shape: 'orb', label: 'Ember', tone: 'light' },
  { a: '#081620', b: '#29B6FF', c: '#D9F4FF', shape: 'wave', label: 'Current', tone: 'dark' },
  { a: '#F2ECFF', b: '#B08CFF', c: '#21124A', shape: 'ring', label: 'Bloom', tone: 'light' },
  { a: '#14110B', b: '#E8C15A', c: '#FFF6DA', shape: 'grid', label: 'Gilt', tone: 'dark' },
]

function Poster({ a, b, c, shape }: (typeof ART)[number]) {
  return (
    <div className="absolute inset-0" style={{ background: `radial-gradient(120% 80% at 50% 0%, ${b}55, transparent 60%), ${a}` }}>
      <svg viewBox="0 0 300 400" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id={`g-${a.slice(1)}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={b} />
            <stop offset="1" stopColor={c} />
          </linearGradient>
        </defs>
        {shape === 'orb' && <><circle cx="150" cy="180" r="92" fill={`url(#g-${a.slice(1)})`} /><circle cx="122" cy="150" r="26" fill="#fff" opacity=".35" /></>}
        {shape === 'arch' && <path d="M70 330V190a80 80 0 0 1 160 0v140z" fill={`url(#g-${a.slice(1)})`} />}
        {shape === 'grid' && Array.from({ length: 25 }, (_, i) => <rect key={i} x={55 + (i % 5) * 40} y={95 + Math.floor(i / 5) * 40} width="30" height="30" rx="8" fill={b} opacity={0.25 + ((i * 7) % 10) / 13} />)}
        {shape === 'wave' && [0, 1, 2, 3, 4].map((i) => <path key={i} d={`M0 ${200 + i * 26} C 75 ${160 + i * 26}, 150 ${240 + i * 26}, 300 ${190 + i * 26}`} stroke={i % 2 ? c : b} strokeWidth="14" fill="none" strokeLinecap="round" opacity={1 - i * 0.14} />)}
        {shape === 'ring' && [0, 1, 2].map((i) => <circle key={i} cx="150" cy="190" r={46 + i * 30} stroke={i === 1 ? c : b} strokeWidth="16" fill="none" opacity={1 - i * 0.25} />)}
        {shape === 'stack' && [0, 1, 2].map((i) => <rect key={i} x={70 + i * 14} y={110 + i * 46} width={160 - i * 28} height="120" rx="18" fill={i === 2 ? c : b} opacity={0.5 + i * 0.25} />)}
      </svg>
    </div>
  )
}

export const DEFAULT_TUNNEL_ITEMS: TunnelItem[] = ART.map((p) => ({ id: p.label.toLowerCase(), label: p.label, tone: p.tone, content: <Poster {...p} /> }))

type Metrics = {
  half: number; cw: number; ch: number; d: number; P: number; Z: number; B: number; R: number; beta: number
  sb: number; L: number; total: number
}

const wrap = (v: number, n: number) => ((v % n) + n) % n

/** Auto sizing: a legible centre and short tunnel on phones, a deep wide-angle corridor on desktop. */
function autoSize(w: number, h: number) {
  let wc: number, we: number, flat: number, fov: number
  if (w < 640) { wc = Math.min(w * 0.3, 150); we = Math.min(w * 0.5, 260); flat = 1; fov = 0.8 }
  else if (w < 1024) { wc = w * 0.13; we = w * 0.3; flat = 2; fov = 0.5 }
  else { wc = Math.min(136, Math.max(84, w * 0.062)); we = Math.min(w * 0.21, 420); flat = 3; fov = 0.36 }
  if (h > 0) { we = Math.min(we, h * 0.6); wc = Math.min(wc, we * 0.6) }
  return { wc, we, flat, fov }
}

/** Point on the corridor path at arc length `s` (0 = centre of the back wall). */
function pathAt(s: number, m: Metrics) {
  const sign = s < 0 ? -1 : 1
  const a = Math.abs(s)
  let x: number, z: number, phi: number
  if (a <= m.B) { x = a; z = -m.Z; phi = 0 }
  else if (a <= m.B + m.R * m.beta) { phi = (a - m.B) / m.R; x = m.B + m.R * Math.sin(phi); z = -m.Z + m.R * (1 - Math.cos(phi)) }
  else {
    const q = a - m.B - m.R * m.beta
    phi = m.beta
    x = m.B + m.R * Math.sin(m.beta) + q * Math.cos(m.beta)
    z = -m.Z + m.R * (1 - Math.cos(m.beta)) + q * Math.sin(m.beta)
  }
  return { x: x * sign, z, rot: (-sign * phi * 180) / Math.PI }
}

/**
 * Perspective Tunnel Carousel — cards ride a corridor in real CSS 3D: a short flat back wall at the vanishing
 * point, rounded corners, then side walls that run toward the viewer, so cards are tiny and flat in the centre and
 * grow huge and angled as they leave past the edges. A single rAF clock writes transforms only (no layout reads per
 * frame); it pauses on hover, focus, drag and off-screen, centres a card on keyboard focus, scrubs with drag and
 * throws with inertia, and becomes a static scroll-snap row under reduced motion.
 */
export function PerspectiveTunnelCarousel({
  items,
  children,
  speed = 0.32,
  direction = 'left',
  centerWidth,
  edgeWidth,
  flatCount,
  wallAngle = 90,
  perspective,
  gap = 0.08,
  paused: pausedProp,
  defaultPaused = false,
  onPausedChange,
  pauseOnHover = true,
  draggable = true,
  clip = true,
  lazy = true,
  linkAs,
  controls = true,
  label = 'Featured cards',
  className,
}: PerspectiveTunnelCarouselProps) {
  const reduced = usePrefersReducedMotion()
  const list: TunnelItem[] = React.useMemo(() => {
    if (items?.length) return items
    const kids = React.Children.toArray(children)
    if (kids.length) return kids.map((c, i) => ({ id: `child-${i}`, content: c }))
    return DEFAULT_TUNNEL_ITEMS
  }, [items, children])

  const rootRef = React.useRef<HTMLDivElement>(null)
  const cardRefs = React.useRef<(HTMLElement | null)[]>([])
  const [size, setSize] = React.useState({ w: 0, h: 0 })
  const [pausedState, setPausedState] = React.useState(defaultPaused)
  const paused = pausedProp ?? pausedState
  const [mounted, setMounted] = React.useState<Set<number>>(() => new Set())

  // Live input flags, read by the rAF loop (refs, so the loop never re-subscribes).
  const st = React.useRef({ t: 0, v: 0, hover: -1, focus: -1, target: null as number | null, drag: null as null | { x: number; t: number; lx: number; lt: number; vx: number; moved: boolean; id: number }, visible: true, paused: defaultPaused, boost: [] as number[], seen: new Set<number>() })
  React.useLayoutEffect(() => { st.current.paused = paused }, [paused])

  React.useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setSize({ w: Math.round(e.contentRect.width), h: Math.round(e.contentRect.height) }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const m: Metrics | null = React.useMemo(() => {
    if (!size.w) return null
    const auto = autoSize(size.w, clip ? size.h : 0)
    const half = size.w / 2
    const cw = Math.round(edgeWidth ?? auto.we)
    const ch = Math.round((cw * 4) / 3)
    const d = cw * (1 + gap)
    const P = perspective ?? size.w * auto.fov
    const sb = Math.min(0.92, (centerWidth ?? auto.wc) / cw)
    const Z = P * (1 / sb - 1)
    const flat = flatCount ?? auto.flat
    const B = (flat / 2) * d
    // Side walls meet the screen edge roughly where the card is at its real size (z ≈ 0).
    const R = Math.max(cw * 0.35, half * 1.04 - B)
    const beta = (Math.min(90, Math.max(30, wallAngle)) * Math.PI) / 180
    // Run the walls until cards are well past the edge, then close the loop on a whole number of slots.
    const wallStart = -Z + R * (1 - Math.cos(beta))
    const wallLen = Math.max(0, (P * 0.6 - wallStart) / Math.sin(beta))
    const halfLen = B + R * beta + wallLen
    const need = Math.max(list.length, Math.ceil((2 * halfLen) / d))
    const copies = Math.ceil(need / list.length)
    const total = list.length * copies
    return { half, cw, ch, d, P, Z, B, R, beta, sb, L: total * d, total }
  }, [size.w, size.h, clip, centerWidth, edgeWidth, flatCount, wallAngle, perspective, gap, list.length])

  const total = m?.total ?? list.length
  const cards = React.useMemo(() => Array.from({ length: total }, (_, j) => ({ j, item: list[j % list.length], copy: j >= list.length })), [total, list])

  const setPaused = (p: boolean) => { if (pausedProp === undefined) setPausedState(p); onPausedChange?.(p) }

  // Off-screen pause.
  React.useEffect(() => {
    const el = rootRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => {
      st.current.visible = e.isIntersecting
      // Off-screen: skip rendering card contents (their own loops stop painting), links stay focusable.
      if (e.isIntersecting) delete el.dataset.offscreen
      else el.dataset.offscreen = ''
    }, { rootMargin: '160px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // The clock: one rAF, transform writes only.
  React.useEffect(() => {
    if (!m || reduced) return
    const s = st.current
    s.boost = Array.from({ length: m.total }, (_, i) => s.boost[i] ?? 0)
    const dir = direction === 'left' ? 1 : -1
    const cruise = speed * m.d * dir
    let raf = 0
    let last = performance.now()
    let dirty = true
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!s.visible) return
      const prevT = s.t
      if (s.drag) {
        // position is set by the pointer handlers
      } else if (s.target !== null) {
        s.t += (s.target - s.t) * (1 - Math.exp(-dt * 9))
        s.v = 0
        if (Math.abs(s.target - s.t) < 0.05) s.t = s.target
      } else {
        const want = s.paused || s.hover >= 0 || s.focus >= 0 ? 0 : cruise
        const fast = Math.abs(s.v) > Math.abs(cruise) * 1.5
        s.v += (want - s.v) * (1 - Math.exp(-dt * (fast ? 2.2 : 4)))
        s.t += s.v * dt
      }
      let boosting = false
      for (let j = 0; j < m.total; j++) {
        const want = j === s.hover || j === s.focus ? 1 : 0
        const b = s.boost[j]
        if (Math.abs(want - b) > 0.001) { s.boost[j] = b + (want - b) * (1 - Math.exp(-dt * 12)); boosting = true }
        else s.boost[j] = want
      }
      if (!dirty && !boosting && Math.abs(s.t - prevT) < 1e-4) return
      dirty = false
      if (s.target === null && !s.drag) s.t = wrap(s.t, m.L)
      let fresh = false
      for (let j = 0; j < m.total; j++) {
        const el = cardRefs.current[j]
        if (!el) continue
        const sj = wrap(j * m.d - s.t + m.L / 2, m.L) - m.L / 2
        const p = pathAt(sj, m)
        const k = m.P / Math.max(1, m.P - p.z)
        const off = p.z > m.P * 0.55 || Math.abs(p.x) * k - (m.cw / 2) * k > m.half + 40
        if (off) {
          el.style.transform = `translate3d(${(p.x < 0 ? -1 : 1) * m.half * 4}px,${-m.ch / 2}px,${-m.Z}px)`
          continue
        }
        if (!s.seen.has(j)) { s.seen.add(j); fresh = true }
        const b = s.boost[j]
        // Hover / focus lifts small (distant) cards toward legibility; big edge cards barely change.
        const lift = 1 + b * Math.max(0, Math.min(0.7, 1.7 / Math.max(k, 0.01) - 1) * 0.6)
        el.style.transform = `translate3d(${(p.x - m.cw / 2).toFixed(2)}px,${-m.ch / 2}px,${p.z.toFixed(2)}px) rotateY(${(p.rot * (1 - b * 0.5)).toFixed(2)}deg) scale(${lift.toFixed(4)})`
      }
      if (fresh && lazy) setMounted(new Set(s.seen))
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [m, reduced, speed, direction, lazy])

  const indexOf = (target: EventTarget | null) => {
    const el = (target as HTMLElement | null)?.closest?.('[data-tunnel-card]') as HTMLElement | null
    return el ? Number(el.dataset.tunnelCard) : -1
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (!draggable || reduced || !m || e.button !== 0) return
    const s = st.current
    s.target = null
    s.drag = { x: e.clientX, t: s.t, lx: e.clientX, lt: performance.now(), vx: 0, moved: false, id: e.pointerId }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const s = st.current
    if (e.pointerType === 'mouse' && pauseOnHover) s.hover = indexOf(e.target)
    const d = s.drag
    if (!d || !m || d.id !== e.pointerId) return
    const dx = e.clientX - d.x
    if (!d.moved && Math.abs(dx) > 6) { d.moved = true; rootRef.current?.setPointerCapture(e.pointerId) }
    if (!d.moved) return
    // Back-wall scale: a drag moves the centre cards 1:1 with the pointer.
    s.t = d.t - dx / m.sb
    const now = performance.now()
    const dtm = Math.max(1, now - d.lt)
    d.vx = 0.7 * d.vx + 0.3 * (((e.clientX - d.lx) / dtm) * 1000)
    d.lx = e.clientX
    d.lt = now
  }
  const endDrag = (e: React.PointerEvent) => {
    const s = st.current
    const d = s.drag
    if (!d || d.id !== e.pointerId) return
    if (d.moved && m) {
      s.v = Math.max(-m.d * 6, Math.min(m.d * 6, -d.vx / m.sb))
      // Swallow the click that follows a drag.
      const stop = (ev: Event) => { ev.preventDefault(); ev.stopPropagation() }
      rootRef.current?.addEventListener('click', stop, { capture: true, once: true })
      setTimeout(() => rootRef.current?.removeEventListener('click', stop, { capture: true }), 0)
    }
    s.drag = null
    if (e.pointerType !== 'mouse') s.hover = -1
  }

  const onFocus = (e: React.FocusEvent) => {
    const i = indexOf(e.target)
    if (i < 0 || !m) return
    const s = st.current
    s.focus = i
    let keyboard = true
    try { keyboard = (e.target as HTMLElement).matches(':focus-visible') } catch { /* older engines */ }
    if (keyboard) {
      const sj = wrap(i * m.d - s.t + m.L / 2, m.L) - m.L / 2
      s.target = s.t + sj
    }
  }
  const onBlur = (e: React.FocusEvent) => {
    if (rootRef.current?.contains(e.relatedTarget as Node)) return
    const s = st.current
    s.focus = -1
    if (s.target !== null) s.t = wrap(s.target, m?.L ?? 1)
    s.target = null
  }

  const Link = linkAs ?? 'a'

  /* Reduced motion: a static, scroll-snapping row. */
  if (reduced) {
    return (
      <div ref={rootRef} className={cn('relative w-full', className)}>
        <ul aria-label={label} className="flex h-full snap-x snap-mandatory items-center gap-3 overflow-x-auto overscroll-x-contain px-6 py-4 [scrollbar-width:none] sm:gap-4">
          {list.map((item, i) => (
            <li key={item.id} className="w-[min(46vw,220px)] shrink-0 snap-center">
              <Card item={item} index={i} Link={Link} live radius={12} labelSize={13} />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const radius = m ? m.cw * 0.045 : 12
  const labelSize = m ? Math.max(11, m.cw * 0.04) : 13
  return (
    <div
      ref={rootRef}
      className={cn('relative w-full touch-pan-y select-none', clip && 'overflow-hidden', className)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={() => { st.current.hover = -1 }}
      onFocus={onFocus}
      onBlur={onBlur}
      style={m ? ({ perspective: `${m.P}px`, '--tunnel-ring': `${Math.max(2, 2.5 / m.sb)}px` } as React.CSSProperties) : undefined}
    >
      <ul aria-label={label} className="absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]" style={{ visibility: m ? 'visible' : 'hidden' }}>
        {cards.map(({ j, item, copy }) => (
          <li
            key={j}
            ref={(el) => { cardRefs.current[j] = el }}
            data-tunnel-card={j}
            aria-hidden={copy || undefined}
            inert={copy || undefined}
            className="absolute left-0 top-0 origin-center [backface-visibility:hidden] will-change-transform"
            style={{ width: m?.cw ?? 0, height: m?.ch ?? 0, transform: 'translate3d(-400vw,0,0)' }}
          >
            <Card item={item} index={j} Link={Link} live={!lazy || mounted.has(j)} radius={radius} labelSize={labelSize} tabbable={!copy} />
          </li>
        ))}
      </ul>
      {controls && (
        <button
          type="button"
          onClick={() => setPaused(!paused)}
          onPointerDown={(e) => e.stopPropagation()}
          aria-pressed={paused}
          aria-label={paused ? 'Play carousel' : 'Pause carousel'}
          className="absolute bottom-3 right-3 z-10 grid h-11 w-11 touch-manipulation place-items-center rounded-full bg-white text-zinc-950 shadow-[0_1px_2px_rgb(0_0_0/0.08)] ring-1 ring-black/[0.08] transition-[background-color,transform] duration-150 [transform:translateZ(1px)] hover:bg-white active:scale-[0.94] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B5BFF] dark:bg-zinc-900 dark:text-white dark:ring-white/[0.12] dark:hover:bg-zinc-800 dark:focus-visible:outline-[#8FA8FF]"
        >
          {paused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
        </button>
      )}
    </div>
  )
}

function Card({ item, index, Link, live, radius, labelSize, tabbable = true }: { item: TunnelItem; index: number; Link: React.ElementType; live: boolean; radius: number; labelSize: number; tabbable?: boolean }) {
  const body = (
    <>
      <span aria-hidden={item.href && item.label ? true : undefined} className={cn('absolute inset-0 overflow-hidden [[data-offscreen]_&]:[content-visibility:hidden]', item.tone)} style={{ background: item.tint, borderRadius: 'inherit' }}>
        {live && (item.content ?? (item.src ? <img src={item.src} alt={item.alt ?? ''} draggable={false} className="absolute inset-0 h-full w-full object-cover" /> : null))}
      </span>
      {/* Specular top edge + hairline: reads as a physical card in both themes. */}
      <span aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_1px_0_rgb(255_255_255/0.35),inset_0_0_0_1px_rgb(0_0_0/0.06)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.14),inset_0_0_0_1px_rgb(255_255_255/0.08)]" style={{ borderRadius: 'inherit' }} />
      {item.label && (
        <span className="pointer-events-none absolute bottom-[5%] left-[6%] inline-flex items-center gap-[0.3em] rounded-full bg-white/95 px-[0.8em] py-[0.4em] font-medium leading-none tracking-[-0.01em] text-zinc-950 shadow-[0_1px_2px_rgb(0_0_0/0.12)] transition-colors duration-150 group-hover:bg-white dark:bg-zinc-950/90 dark:text-white dark:group-hover:bg-zinc-950" style={{ fontSize: labelSize }}>
          {item.href && <span className="sr-only">Open </span>}
          {item.label}
          {item.href && <ArrowUpRight aria-hidden style={{ width: '1em', height: '1em' }} />}
        </span>
      )}
    </>
  )
  const cls = cn(
    'group relative block h-full w-full overflow-hidden bg-zinc-200 shadow-[0_1px_2px_rgb(0_0_0/0.06),0_14px_28px_-18px_rgb(24_24_27/0.45)] dark:bg-zinc-900 dark:shadow-[0_14px_28px_-18px_rgb(0_0_0/0.9)]',
    'outline-none focus-visible:outline-[length:var(--tunnel-ring,2px)] focus-visible:outline-offset-[length:var(--tunnel-ring,2px)] focus-visible:outline-solid focus-visible:outline-[#2B5BFF] dark:focus-visible:outline-[#8FA8FF]',
  )
  const style = { borderRadius: radius, aspectRatio: '3 / 4' }
  if (item.href) {
    return (
      <Link href={item.href} className={cls} style={style} draggable={false} onDragStart={(e: React.DragEvent) => e.preventDefault()} tabIndex={tabbable ? undefined : -1} aria-label={item.label ? undefined : `Open card ${index + 1}`} data-index={index}>
        {body}
      </Link>
    )
  }
  return (
    <div className={cls} style={style} tabIndex={tabbable ? 0 : -1} role="group" aria-label={item.label ?? `Card ${index + 1}`}>
      {body}
    </div>
  )
}
