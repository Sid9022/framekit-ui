import * as React from 'react'
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react'
import { ZoomIn } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type ImageLensAnnotation = {
  /** Position as a fraction of the frame (0–1). */
  x: number
  y: number
  label: string
}

export type ImageLensProps = {
  /**
   * Image to magnify: a full URL (`https://…`) or a file in your `public/` folder (`/images/peak.jpg`).
   * Shows a shimmer while loading and falls back to the built-in vector scene if it fails.
   * Without it the original vector dusk scene is drawn (crisp at any zoom).
   */
  src?: string
  /** Describes the image. Also used for the generated scene. */
  alt?: string
  /** Optional higher-resolution image used only inside the lens. Fetched the first time the lens opens. */
  zoomSrc?: string
  /** Custom content to magnify instead of an image (rendered twice; the lens copy is decorative). */
  children?: React.ReactNode
  /** Starting magnification. */
  zoom?: number
  minZoom?: number
  maxZoom?: number
  /** Lens diameter in px (capped to 60% of the frame width). */
  size?: number
  shape?: 'circle' | 'rounded'
  /**
   * `glass` — rim, colour fringe, edge refraction and a highlight, like a real loupe.
   * `minimal` — a clean crisp edge with only a faint shadow.
   * `seamless` — no edge at all; the magnified view feathers into the image.
   */
  appearance?: 'glass' | 'minimal' | 'seamless'
  /** Pins that only appear inside the lens. Defaults to the scene's hidden details when no `src` is given. */
  annotations?: ImageLensAnnotation[]
  /** Desaturate and dim everything outside the lens. */
  dim?: boolean
  /** Frame aspect ratio (CSS value). */
  aspectRatio?: string
  caption?: React.ReactNode
  onZoomChange?: (zoom: number) => void
  className?: string
}

const DEFAULT_ALT = 'Dusk at a high-altitude base camp: orange tents on a rocky plateau, two hikers on the ridge and a sea of clouds below a crescent moon.'
const SCENE_NOTES: ImageLensAnnotation[] = [
  { x: 0.668, y: 0.716, label: 'Two hikers catching the last light' },
  { x: 0.392, y: 0.592, label: 'Ridge observatory, dome open' },
  { x: 0.4665, y: 0.905, label: 'Hand-painted camp sign' },
  { x: 0.775, y: 0.19, label: 'Waxing crescent' },
]

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

const LENS_SHADOW: Record<NonNullable<ImageLensProps['appearance']>, string | undefined> = {
  glass: '0 0 0 1.5px rgb(255 255 255 / 0.8), 0 0 0 3px rgb(0 0 0 / 0.16), 0 22px 44px -14px rgb(0 0 0 / 0.6), 0 6px 14px -6px rgb(0 0 0 / 0.4)',
  minimal: '0 16px 36px -16px rgb(0 0 0 / 0.45), 0 3px 8px -4px rgb(0 0 0 / 0.25)',
  seamless: undefined,
}

/* ---------- original generated scene ---------- */

function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function Tent({ x, y, s, door }: { x: number; y: number; s: number; door: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={3} rx={54} ry={7} fill="#05030a" opacity={0.45} />
      <path d="M-62 4 L-46 -4 M62 4 L46 -4 M-30 6 L-36 -22 M30 6 L36 -22" stroke="#f1ece6" strokeWidth={0.6} opacity={0.35} />
      <path d="M-46 0 C-41 -36 -14 -52 0 -52 C14 -52 41 -36 46 0 Z" fill="#f59e0b" />
      <path d="M0 -52 C12 -42 24 -22 27 0 L46 0 C41 -36 14 -52 0 -52 Z" fill="#c2410c" opacity={0.6} />
      <path d="M-46 0 C-30 -30 -14 -46 0 -52 M46 0 C30 -30 14 -46 0 -52" stroke="#7c2d12" strokeWidth={1.2} fill="none" opacity={0.55} />
      <path d="M-40 -14 C-20 -18 20 -18 40 -14" stroke="#7c2d12" strokeWidth={0.8} fill="none" opacity={0.35} />
      <path d="M-17 0 C-15 -17 -8 -27 0 -29 C8 -27 15 -17 17 0 Z" fill={door} />
      <path d="M0 -29 V0" stroke="#7c2d12" strokeWidth={0.8} strokeDasharray="1.4 1.4" />
      <path d="M-6 -50 h12" stroke="#fde68a" strokeWidth={1.4} strokeLinecap="round" opacity={0.7} />
      <rect x={-63} y={2} width={2} height={5} fill="#cbd5e1" opacity={0.6} />
      <rect x={61} y={2} width={2} height={5} fill="#cbd5e1" opacity={0.6} />
    </g>
  )
}

function Hiker({ x, s = 1, pointing = false }: { x: number; s?: number; pointing?: boolean }) {
  return (
    <g transform={`translate(${x} 0) scale(${s})`} fill="#0b0810" stroke="#0b0810" strokeLinecap="round">
      <path d="M-2.4 0 L-1.8 -9.5 M1.6 0 L1 -9.5" strokeWidth={1.7} fill="none" />
      <rect x={-3.6} y={-19} width={6.4} height={10.5} rx={2.2} stroke="none" />
      <rect x={-6.6} y={-18} width={3.6} height={7.6} rx={1.2} stroke="none" />
      <path d="M-5 -18.6 L-5 -23" strokeWidth={0.6} />
      <circle cx={-0.3} cy={-21.8} r={2.5} stroke="none" />
      <path d={pointing ? 'M2.4 -16.5 L9.5 -20.5' : 'M2.4 -16 L4 -10.5'} strokeWidth={1.2} fill="none" />
    </g>
  )
}

/** Original vector scene drawn at 1200×800 so it stays sharp under any magnification. */
function DuskRidgeArt({ label }: { label?: string }) {
  const id = React.useId().replace(/:/g, '')
  const u = (n: string) => `url(#${id}${n})`
  const stars = React.useMemo(() => {
    const r = rng(7)
    return Array.from({ length: 90 }, () => {
      const y = r() ** 1.6 * 360
      return { x: r() * 1200, y, r: 0.5 + r() * 1.3, o: (0.35 + r() * 0.6) * (1 - y / 520) }
    })
  }, [])
  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      className="block h-full w-full"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#17163a" />
          <stop offset="0.3" stopColor="#3b3470" />
          <stop offset="0.5" stopColor="#8b6aa0" />
          <stop offset="0.62" stopColor="#df9a8d" />
          <stop offset="0.7" stopColor="#f7c38b" />
          <stop offset="0.76" stopColor="#fde2a8" />
        </linearGradient>
        <radialGradient id={`${id}sun`} cx="0.42" cy="0.7" r="0.45">
          <stop offset="0" stopColor="#fff1c9" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff1c9" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}cloud`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f6bfae" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f6bfae" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}cloud2`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#c9a6d6" stopOpacity="0.45" />
          <stop offset="1" stopColor="#c9a6d6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}far`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7c6592" />
          <stop offset="1" stopColor="#a283a3" />
        </linearGradient>
        <linearGradient id={`${id}mid`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3f3358" />
          <stop offset="1" stopColor="#2a2139" />
        </linearGradient>
        <linearGradient id={`${id}ground`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#231a2a" />
          <stop offset="1" stopColor="#0c0910" />
        </linearGradient>
        <linearGradient id={`${id}haze`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff4dc" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff4dc" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff4dc" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}door`} cx="0.5" cy="0.75" r="0.7">
          <stop offset="0" stopColor="#fff2c2" />
          <stop offset="0.5" stopColor="#fbbf5a" />
          <stop offset="1" stopColor="#d9771f" />
        </radialGradient>
        <radialGradient id={`${id}glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}streak`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.9" />
        </linearGradient>
        <mask id={`${id}moon`}>
          <rect width="1200" height="800" fill="#fff" />
          <circle cx="944" cy="141" r="28" fill="#000" />
        </mask>
        <linearGradient id={`${id}fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.7" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      {/* sky */}
      <rect width="1200" height="800" fill={u('sky')} />
      <rect width="1200" height="800" fill={u('sun')} />
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.o} />
      ))}
      {[
        [180, 70],
        [640, 46],
        [1080, 96],
      ].map(([x, y]) => (
        <path key={x} d={`M${x} ${y - 6} L${x + 1.2} ${y - 1.2} L${x + 6} ${y} L${x + 1.2} ${y + 1.2} L${x} ${y + 6} L${x - 1.2} ${y + 1.2} L${x - 6} ${y} L${x - 1.2} ${y - 1.2} Z`} fill="#fff" opacity={0.85} />
      ))}
      <path d="M318 112 L392 146" stroke={u('streak')} strokeWidth={1.4} strokeLinecap="round" />

      {/* moon with craters */}
      <g mask={u('moon')}>
        <circle cx="930" cy="150" r="30" fill="#fff4dc" />
        <circle cx="915" cy="146" r="4" fill="#d8c29a" opacity={0.35} />
        <circle cx="921" cy="164" r="2.6" fill="#d8c29a" opacity={0.35} />
        <circle cx="909" cy="160" r="1.8" fill="#d8c29a" opacity={0.3} />
      </g>
      <circle cx="930" cy="150" r="44" fill="#fff4dc" opacity={0.06} />

      {/* clouds */}
      <ellipse cx="260" cy="300" rx="260" ry="34" fill={u('cloud2')} />
      <ellipse cx="820" cy="270" rx="320" ry="30" fill={u('cloud2')} />
      <ellipse cx="420" cy="388" rx="300" ry="26" fill={u('cloud')} />
      <ellipse cx="980" cy="410" rx="260" ry="22" fill={u('cloud')} />
      <ellipse cx="120" cy="430" rx="200" ry="18" fill={u('cloud')} />

      {/* far ridge + snow caps */}
      <path d="M0 520 L80 498 L140 506 L210 470 L250 488 L320 455 L390 492 L470 478 L540 500 L620 468 L700 497 L780 476 L860 505 L940 462 L1010 488 L1090 470 L1200 495 L1200 560 L0 560 Z" fill={u('far')} />
      <path d="M210 470 L196 483 L205 481 L212 488 L223 479 Z M320 455 L304 471 L314 468 L322 476 L334 466 Z M620 468 L606 482 L615 480 L622 487 L633 478 Z M940 462 L925 476 L934 474 L942 482 L953 472 Z" fill="#f4ecff" opacity={0.85} />
      {/* observatory */}
      <g transform="translate(470 478)">
        <circle cx="0" cy="-8" r="14" fill={u('glow')} />
        <rect x="-6" y="-6" width="12" height="7" fill="#5d4a74" />
        <path d="M-6.5 -6 A6.5 6.5 0 0 1 6.5 -6 Z" fill="#e9e3f3" />
        <path d="M0.4 -12.3 L1.6 -6.2 L-0.6 -6.2 Z" fill="#ffd98a" />
        <path d="M8 -6 V-15 M8 -15 L11 -17" stroke="#e9e3f3" strokeWidth={0.6} />
        <rect x="-2" y="-3" width="2.2" height="3" fill="#ffd98a" opacity={0.9} />
      </g>

      {/* sea of clouds + haze */}
      <rect y="540" width="1200" height="70" fill={u('haze')} />
      <ellipse cx="560" cy="578" rx="380" ry="14" fill="#fff6e4" opacity={0.25} />

      {/* mid crags */}
      <path d="M0 578 L70 560 L120 566 L170 538 L215 552 L262 530 L300 556 L360 574 L440 604 L860 604 L900 548 L960 552 L1020 520 L1060 532 L1110 510 L1160 536 L1200 528 L1200 640 L0 640 Z" fill={u('mid')} />
      <path d="M1020 520 L1008 534 L1018 532 L1024 540 L1036 530 Z M262 530 L250 542 L258 541 L265 547 L274 539 Z" fill="#e7def3" opacity={0.6} />

      {/* plateau */}
      <path d="M0 640 L120 618 L260 626 L420 612 L560 600 L700 594 L790 591 L860 598 L1000 610 L1200 604 L1200 800 L0 800 Z" fill={u('ground')} />
      <g transform="translate(800 591)">
        <Hiker x={0} pointing />
        <Hiker x={11} s={0.92} />
      </g>

      {/* snow field */}
      <path d="M380 672 C430 650 520 648 600 656 C700 664 760 646 860 650 C930 654 1000 668 1060 664 C1010 690 920 700 830 694 C740 690 660 706 560 700 C480 696 410 694 380 672 Z" fill="#e8ecf6" opacity={0.92} />
      <path d="M380 672 C460 684 560 690 660 684 C760 680 900 686 1060 664" stroke="#b9c2da" strokeWidth={1.2} fill="none" opacity={0.6} />
      {[
        [90, 690, 16],
        [470, 720, 9],
        [640, 742, 12],
        [960, 724, 18],
        [1120, 690, 11],
        [240, 760, 14],
        [860, 770, 10],
      ].map(([x, y, r]) => (
        <ellipse key={x} cx={x} cy={y} rx={r} ry={r * 0.55} fill="#1b1421" />
      ))}

      {/* camp */}
      <circle cx="300" cy="700" r="60" fill={u('glow')} opacity={0.35} />
      <Tent x={170} y={704} s={1.05} door={u('door')} />
      <Tent x={318} y={716} s={0.9} door={u('door')} />
      <Tent x={760} y={730} s={1.3} door={u('door')} />
      <g transform="translate(560 736)">
        <rect x="-1.2" y="-30" width="2.4" height="30" fill="#4a3628" />
        <rect x="-33" y="-40" width="66" height="13" rx="2" fill="#dcc6a2" />
        <path d="M33 -40 L39 -33.5 L33 -27 Z" fill="#dcc6a2" />
        <text x="0" y="-31.2" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="6.4" fontWeight="700" fill="#3a2a1f">
          BASE CAMP · 4,600 m
        </text>
        <circle cx="16" cy="-4" r="9" fill={u('glow')} />
        <rect x="14.5" y="-6" width="3" height="4" rx="0.8" fill="#ffe7a6" />
      </g>
      <rect width="1200" height="800" fill={u('fade')} />
    </svg>
  )
}

/* ---------- lens ---------- */

/**
 * Image Lens — a glass loupe that follows the pointer and magnifies the image beneath it: the rim refracts and
 * fringes like real glass, the rest of the frame softly desaturates, and pinch / ctrl+wheel / click change the
 * zoom. On touch, press and hold to bring the lens up above your finger. Optional annotations appear only
 * inside the lens. Without `src` it magnifies an original vector scene full of tiny details.
 */
export function ImageLens({
  src,
  alt,
  zoomSrc,
  children,
  zoom = 2.5,
  minZoom = 1.5,
  maxZoom = 5,
  size = 190,
  shape = 'circle',
  appearance = 'glass',
  annotations,
  dim = true,
  aspectRatio = '3 / 2',
  caption,
  onZoomChange,
  className,
}: ImageLensProps) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const uid = React.useId()
  const [box, setBox] = React.useState({ w: 0, h: 0 })
  const [active, setActive] = React.useState(false)
  // the hi-res lens image is only requested once the lens has been opened
  const [primed, setPrimed] = React.useState(false)
  // load state is tied to the src it belongs to, so a new src starts as "loading" without an effect
  const [loadState, setLoadState] = React.useState<{ src?: string; status: 'loaded' | 'error' }>({ status: 'loaded' })
  const imgStatus = !src ? 'loaded' : loadState.src === src ? loadState.status : 'loading'
  const trackImage = (el: HTMLImageElement | null) => {
    if (el?.complete && src && loadState.src !== src) setLoadState({ src, status: el.naturalWidth > 0 ? 'loaded' : 'error' })
  }
  const [readout, setReadout] = React.useState<number | null>(null)
  const startZoom = clamp(zoom, minZoom, maxZoom)
  const zoomRef = React.useRef(startZoom)
  const readoutTimer = React.useRef(0)
  const pointerType = React.useRef('mouse')

  // sample point (what is magnified) and the lens offset from it (touch lifts the lens above the finger)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const lift = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 520, damping: 42, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 520, damping: 42, mass: 0.5 })
  const sLift = useSpring(lift, { stiffness: 420, damping: 34 })
  const z = useMotionValue(startZoom)
  const sz = useSpring(z, { stiffness: 260, damping: 30 })
  const show = useMotionValue(0)
  const sShow = useSpring(show, { stiffness: 420, damping: 30 })
  const rMv = useMotionValue(0)
  const wMv = useMotionValue(0)
  const hMv = useMotionValue(0)
  const featherMv = useMotionValue(appearance === 'seamless' ? 1 : 0)

  const R = box.w ? Math.min(size, box.w * 0.6) / 2 : 0
  React.useLayoutEffect(() => {
    rMv.set(R)
    wMv.set(box.w)
    hMv.set(box.h)
    featherMv.set(appearance === 'seamless' ? 1 : 0)
  }, [R, box, appearance, rMv, wMv, hMv, featherMv])

  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      setBox((b) => (b.w === r.width && b.h === r.height ? b : { w: r.width, h: r.height }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  React.useEffect(() => () => window.clearTimeout(readoutTimer.current), [])

  // Horizontally the glass stays inside the frame (no sideways page scroll on phones); vertically it may hang
  // past the edge like a real loupe. The magnified spot always sits at the lens centre either way.
  const lensX = useTransform([sx, rMv, wMv], ([a, r, w]: number[]) => clamp(a - r, 0, Math.max(0, w - r * 2)))
  const lensY = useTransform([sy, sLift, rMv], ([b, l, r]: number[]) => b + l - r)
  const innerX = useTransform([sx, sz, rMv], ([a, k, r]: number[]) => r - a * k)
  const innerY = useTransform([sy, sz, rMv], ([b, k, r]: number[]) => r - b * k)
  const innerW = useTransform([wMv, sz], ([w, k]: number[]) => w * k)
  const innerH = useTransform([hMv, sz], ([h, k]: number[]) => h * k)
  const holeX = useTransform([lensX, rMv], ([l, r]: number[]) => l + r)
  const holeY = useTransform([sy, sLift], ([b, l]: number[]) => b + l)
  // seamless lenses get a soft-edged hole so the dimming fades in with the feathered glass
  const holeR = useTransform([rMv, sShow, featherMv], ([r, s, f]: number[]) => Math.max(0, r * s * (1 - 0.3 * f)))
  const holeR2 = useTransform([rMv, sShow], ([r, s]: number[]) => Math.max(0, r * s) + 1.5)
  const dimMask = useMotionTemplate`radial-gradient(circle at ${holeX}px ${holeY}px, transparent ${holeR}px, #000 ${holeR2}px)`
  const lensOpacity = useTransform(sShow, [0, 0.35], [0, 1])

  /* ---------- behaviour ---------- */

  const place = (px: number, py: number, liftBy = 0, snap = false) => {
    const el = ref.current
    if (!el) return
    const b = el.getBoundingClientRect()
    const cx = clamp(px, 0, b.width)
    const cy = clamp(py, 0, b.height)
    x.set(cx)
    y.set(cy)
    lift.set(liftBy)
    if (snap || reduced) {
      sx.jump(cx)
      sy.jump(cy)
      sLift.jump(liftBy)
    }
  }
  const setShown = (on: boolean) => {
    show.set(on ? 1 : 0)
    if (reduced) sShow.jump(on ? 1 : 0)
    setActive(on)
    if (on) setPrimed(true)
  }
  const setZoom = (next: number) => {
    const v = Math.round(clamp(next, minZoom, maxZoom) * 10) / 10
    if (v === zoomRef.current) return
    zoomRef.current = v
    z.set(v)
    if (reduced) sz.jump(v)
    onZoomChange?.(v)
    setReadout(v)
    window.clearTimeout(readoutTimer.current)
    readoutTimer.current = window.setTimeout(() => setReadout(null), 1100)
  }
  const cycleZoom = () => {
    const levels = [...new Set([startZoom, startZoom * 1.6, startZoom * 2.2].map((v) => Math.round(clamp(v, minZoom, maxZoom) * 10) / 10))]
    const i = levels.findIndex((v) => v > zoomRef.current + 0.05)
    setZoom(i < 0 ? levels[0] : levels[i])
  }

  // Native listeners: pinch / ctrl+wheel zoom and press-and-hold touch need non-passive handlers.
  const api = React.useRef({ place, setShown, setZoom })
  React.useLayoutEffect(() => {
    api.current = { place, setShown, setZoom }
  })
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const local = (t: { clientX: number; clientY: number }) => {
      const b = el.getBoundingClientRect()
      return { x: t.clientX - b.left, y: t.clientY - b.top }
    }
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return // plain wheel keeps scrolling the page
      e.preventDefault()
      api.current.setZoom(zoomRef.current * Math.exp(-e.deltaY * 0.01))
    }
    let timer = 0
    let lensOn = false
    let start = { x: 0, y: 0 }
    const liftBy = () => -Math.min(size, el.getBoundingClientRect().width * 0.6) * 0.62
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      start = local(e.touches[0])
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        lensOn = true
        api.current.place(start.x, start.y, liftBy(), true)
        api.current.setShown(true)
        navigator.vibrate?.(8)
      }, 240)
    }
    const onTouchMove = (e: TouchEvent) => {
      const p = local(e.touches[0])
      if (lensOn) {
        e.preventDefault() // hold-to-magnify owns the gesture; otherwise the page scrolls as usual
        api.current.place(p.x, p.y, liftBy())
      } else if (Math.hypot(p.x - start.x, p.y - start.y) > 10) window.clearTimeout(timer)
    }
    const onTouchEnd = () => {
      window.clearTimeout(timer)
      if (lensOn) {
        lensOn = false
        api.current.setShown(false)
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd)
    el.addEventListener('touchcancel', onTouchEnd)
    return () => {
      window.clearTimeout(timer)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [size])

  const fromPointer = (e: React.PointerEvent, snap = false) => {
    const b = e.currentTarget.getBoundingClientRect()
    place(e.clientX - b.left, e.clientY - b.top, 0, snap)
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = (e.shiftKey ? 0.1 : 0.03) * box.w
    const moves: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }
    const m = moves[e.key]
    if (m) {
      e.preventDefault()
      if (!active) setShown(true)
      place(x.get() + m[0], y.get() + m[1])
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault()
      setZoom(zoomRef.current * 1.25)
    } else if (e.key === '-' || e.key === '_') {
      e.preventDefault()
      setZoom(zoomRef.current / 1.25)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!active) setShown(true)
      else cycleZoom()
    } else if (e.key === 'Escape' && active) {
      e.preventDefault()
      setShown(false)
    }
  }

  const failed = imgStatus === 'error'
  const usePhoto = !!src && !failed
  const notes = annotations ?? (usePhoto || children ? [] : SCENE_NOTES)
  // a failed photo's alt would describe something that isn't shown, so the fallback scene uses its own description
  const label = usePhoto || children ? alt : failed ? DEFAULT_ALT : (alt ?? DEFAULT_ALT)
  const base =
    children ??
    (usePhoto ? (
      <img
        ref={trackImage}
        src={src}
        alt={alt ?? ''}
        draggable={false}
        decoding="async"
        onLoad={() => setLoadState({ src, status: 'loaded' })}
        onError={() => setLoadState({ src, status: 'error' })}
        className={cn('block h-full w-full object-cover transition-opacity duration-500 motion-reduce:transition-none', imgStatus === 'loading' && 'opacity-0')}
      />
    ) : (
      <DuskRidgeArt label={label} />
    ))
  const magnified =
    children ??
    (usePhoto ? <img src={primed && zoomSrc ? zoomSrc : src} alt="" draggable={false} decoding="async" className="block h-full w-full object-cover" /> : <DuskRidgeArt />)
  const radius = shape === 'circle' ? 'rounded-full' : 'rounded-[30%]'

  return (
    <figure className={cn('w-full', className)}>
      <div
        ref={ref}
        tabIndex={0}
        role="group"
        aria-roledescription="magnifier"
        aria-label={label ? `Magnifier: ${label}` : 'Image magnifier'}
        aria-describedby={`${uid}-help`}
        onPointerDown={(e) => (pointerType.current = e.pointerType)}
        onPointerEnter={(e) => {
          if (e.pointerType === 'touch') return
          fromPointer(e, true)
          setShown(true)
        }}
        onPointerMove={(e) => e.pointerType !== 'touch' && fromPointer(e)}
        onPointerLeave={(e) => e.pointerType !== 'touch' && setShown(false)}
        onClick={(e) => {
          // touch has its own press-and-hold flow; keyboard uses Enter / Space
          if (e.detail === 0 || pointerType.current === 'touch') return
          if (!active) setShown(true)
          else cycleZoom()
        }}
        onFocus={(e) => {
          if (!e.currentTarget.matches(':focus-visible')) return
          place(box.w / 2, box.h / 2, 0, true)
          setShown(true)
        }}
        onBlur={() => setShown(false)}
        onKeyDown={onKeyDown}
        onContextMenu={(e) => active && e.preventDefault()}
        className={cn(
          'relative isolate w-full select-none rounded-[20px] outline-none [-webkit-touch-callout:none] focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-signal-300 dark:focus-visible:ring-offset-zinc-950',
          active ? 'cursor-none' : 'cursor-zoom-in',
        )}
        style={{ aspectRatio }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-[20px] bg-zinc-200 shadow-[0_1px_2px_rgb(0_0_0/0.06),0_24px_48px_-28px_rgb(24_24_27/0.45)] ring-1 ring-black/[0.06] dark:bg-zinc-800 dark:shadow-[0_24px_48px_-28px_rgb(0_0_0/0.9)] dark:ring-white/[0.08]">
          {base}
          {imgStatus === 'loading' && (
            <div aria-hidden className="absolute inset-0 overflow-hidden bg-zinc-200 dark:bg-zinc-800">
              <motion.div
                className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/[0.07]"
                animate={reduced ? undefined : { x: ['0%', '400%'] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
          )}
          {dim && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-black/10 [backdrop-filter:saturate(0.55)_brightness(0.82)]"
              style={{ opacity: sShow, maskImage: dimMask, WebkitMaskImage: dimMask }}
            />
          )}
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/45 px-2 py-1 font-mono text-[11px] font-medium text-white ring-1 ring-white/15 backdrop-blur-md transition-opacity duration-300',
              active && 'opacity-0',
            )}
          >
            <ZoomIn className="h-3 w-3" />
            {startZoom}×
          </span>
        </div>

        {/* the loupe floats above the frame and may hang past its edge, like real glass */}
        <motion.div aria-hidden inert className="pointer-events-none absolute left-0 top-0 z-10" style={{ x: lensX, y: lensY, width: R * 2, height: R * 2 }}>
          <motion.div className="relative h-full w-full" style={{ scale: sShow, opacity: lensOpacity }}>
            <div
              className={cn(
                'absolute inset-0 overflow-hidden',
                radius,
                appearance === 'seamless' ? '[mask-image:radial-gradient(closest-side,#000_70%,transparent_100%)]' : 'bg-zinc-900',
              )}
              style={{ boxShadow: LENS_SHADOW[appearance] }}
            >
              <motion.div className="absolute left-0 top-0" style={{ x: innerX, y: innerY, width: innerW, height: innerH }}>
                {magnified}
                {notes.map((n, i) => (
                  <span key={i} className="absolute flex w-36 flex-col items-center gap-1.5" style={{ left: `${n.x * 100}%`, top: `${n.y * 100}%`, transform: 'translate(-50%, -5px)' }}>
                    <span className="relative grid h-2.5 w-2.5 place-items-center rounded-full bg-white shadow-[0_0_0_3px_rgb(255_255_255/0.35),0_1px_3px_rgb(0_0_0/0.5)]">
                      <span className="h-1 w-1 rounded-full bg-zinc-900" />
                    </span>
                    <span className="max-w-full rounded-lg bg-zinc-950/80 px-2 py-0.5 text-center text-[11px] font-medium leading-snug text-white ring-1 ring-white/15 backdrop-blur-sm">{n.label}</span>
                  </span>
                ))}
              </motion.div>
              {appearance === 'glass' && (
                <>
                  {/* refraction: the rim of the glass blurs and lifts saturation */}
                  <div className={cn('absolute inset-0 [backdrop-filter:blur(2.5px)_saturate(1.25)] [mask-image:radial-gradient(closest-side,transparent_74%,#000_100%)]', radius)} />
                  {/* chromatic fringe, inner shade and top light */}
                  <div
                    className={cn('absolute inset-0', radius)}
                    style={{
                      boxShadow:
                        'inset 3px 0 6px -3px rgb(255 64 129 / 0.5), inset -3px 0 6px -3px rgb(56 189 248 / 0.5), inset 0 -14px 26px -14px rgb(0 0 0 / 0.5), inset 0 10px 20px -14px rgb(255 255 255 / 0.75)',
                    }}
                  />
                  <div className="absolute left-[16%] top-[6%] h-[16%] w-[38%] -rotate-[24deg] rounded-[50%] bg-gradient-to-b from-white/35 to-white/0" />
                  <div className="absolute left-[25%] top-[11%] h-1 w-1 rounded-full bg-white/80 blur-[0.5px]" />
                </>
              )}
            </div>
            <AnimatePresence>
              {readout !== null && (
                <motion.span
                  key="readout"
                  className="absolute left-1/2 top-full mt-2.5 -translate-x-1/2 rounded-full bg-zinc-950/85 px-2 py-0.5 font-mono text-[11px] font-medium tabular-nums text-white shadow-sm ring-1 ring-white/15 backdrop-blur"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 480, damping: 32 }}
                >
                  {readout.toFixed(1)}×
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      {caption && <figcaption className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{caption}</figcaption>}
      <p id={`${uid}-help`} className="sr-only">
        Magnifier. Move the pointer over the image, or focus it and use the arrow keys to move the lens. Plus and minus change the zoom; Escape hides the lens.
        {notes.length > 0 && ` Details: ${notes.map((n) => n.label).join('; ')}.`}
      </p>
      <p className="sr-only" aria-live="polite">
        {readout !== null ? `Zoom ${readout.toFixed(1)} times` : ''}
      </p>
    </figure>
  )
}
