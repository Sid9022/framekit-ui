import * as React from 'react'
import { cn } from '@/lib/cn'

/** A portfolio entry shared by the Framekit portfolio components. `src` is optional — without it generated art is used. */
export type PortfolioProject = {
  id: string
  title: string
  category: string
  year: string
  blurb: string
  /** Real image URL. When omitted a deterministic generated artwork is drawn from `seed`. */
  src?: string
  alt?: string
  seed?: number
  tags?: string[]
  role?: string
  href?: string
}

export const SAMPLE_PROJECTS: PortfolioProject[] = [
  { id: 'lumen', title: 'Lumen Health', category: 'Product', year: '2026', blurb: 'A calm patient app that turns lab results into plain-language next steps.', seed: 3, tags: ['iOS', 'Design system'], role: 'Lead designer' },
  { id: 'atlas', title: 'Atlas Maps', category: 'Web', year: '2026', blurb: 'Interactive route storytelling for a hiking collective, with offline-first tiles.', seed: 11, tags: ['React', 'WebGL-free maps'], role: 'Front-end' },
  { id: 'cinder', title: 'Cinder & Salt', category: 'Brand', year: '2025', blurb: 'Identity, packaging and a launch site for a small-batch hot sauce studio.', seed: 7, tags: ['Identity', 'Packaging'], role: 'Art direction' },
  { id: 'tidewater', title: 'Tidewater', category: 'Web', year: '2025', blurb: 'Editorial site for a coastal research institute — 40k readers in the first month.', seed: 19, tags: ['CMS', 'Motion'], role: 'Design + build' },
  { id: 'paperplane', title: 'Paperplane OS', category: 'Product', year: '2025', blurb: 'A keyboard-first inbox with an animated command layer and instant search.', seed: 25, tags: ['Desktop', 'Prototyping'], role: 'Product design' },
  { id: 'fieldnotes', title: 'Field Notes', category: 'Brand', year: '2024', blurb: 'Type-led rebrand and print system for an independent travel quarterly.', seed: 31, tags: ['Typography', 'Print'], role: 'Brand design' },
]

/** [from, to, accent1, accent2, accent3] — chosen to read as artwork on both light and dark pages. */
const PALETTES: string[][] = [
  ['#1e1b4b', '#7c3aed', '#f0abfc', '#fb923c', '#fde68a'],
  ['#0f2b3d', '#0e7490', '#67e8f9', '#fda4af', '#fef3c7'],
  ['#3b0a24', '#be123c', '#fda4af', '#fbbf24', '#ffe4e6'],
  ['#14301f', '#15803d', '#bef264', '#f9a8d4', '#ecfccb'],
  ['#2a1a0a', '#c2410c', '#fdba74', '#a78bfa', '#ffedd5'],
  ['#111827', '#4338ca', '#a5b4fc', '#34d399', '#e0e7ff'],
  ['#2d0f3d', '#c026d3', '#f5d0fe', '#60a5fa', '#fae8ff'],
  ['#0b1f1c', '#0f766e', '#5eead4', '#fcd34d', '#ccfbf1'],
]

function rng(seed: number) {
  let a = (seed * 2654435761) >>> 0 || 1
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type ArtProps = {
  seed?: number
  src?: string
  alt?: string
  className?: string
  /** Force a motif; otherwise derived from the seed. */
  motif?: 'orbs' | 'arcs' | 'grid' | 'waves' | 'blocks' | 'sun'
}

const MOTIFS = ['orbs', 'arcs', 'grid', 'waves', 'blocks', 'sun'] as const

/**
 * Deterministic generated artwork (SVG) or a real image. Fills its container (object-cover behaviour).
 * Generated art is decorative (`aria-hidden`); a real image gets `alt`.
 */
export function PortfolioArt({ seed = 1, src, alt = '', className, motif }: ArtProps) {
  const id = React.useId().replace(/:/g, '')
  const art = React.useMemo(() => {
    const r = rng(seed + 17)
    const p = PALETTES[Math.abs(seed) % PALETTES.length]
    const kind = motif ?? MOTIFS[Math.abs(Math.floor(seed / 2) + seed) % MOTIFS.length]
    const shapes: React.ReactNode[] = []
    if (kind === 'orbs') {
      for (let i = 0; i < 4; i++) {
        const x = 60 + r() * 280, y = 40 + r() * 220, rad = 50 + r() * 90
        shapes.push(<circle key={i} cx={x} cy={y} r={rad} fill={`url(#${id}o${i % 3})`} opacity={0.85} />)
      }
      shapes.push(<circle key="ring" cx={200 + (r() - 0.5) * 80} cy={150 + (r() - 0.5) * 60} r={96} fill="none" stroke={p[4]} strokeOpacity={0.5} strokeWidth={1.5} />)
    } else if (kind === 'arcs') {
      const cx = r() > 0.5 ? 0 : 400, cy = r() > 0.5 ? 0 : 300
      for (let i = 1; i <= 9; i++) shapes.push(<circle key={i} cx={cx} cy={cy} r={i * 40} fill="none" stroke={i % 3 === 0 ? p[3] : p[2]} strokeOpacity={0.25 + i * 0.07} strokeWidth={i % 3 === 0 ? 10 : 2.5} />)
      shapes.push(<circle key="c" cx={cx === 0 ? 120 : 280} cy={cy === 0 ? 90 : 210} r={26} fill={p[4]} opacity={0.9} />)
    } else if (kind === 'grid') {
      for (let x = 20; x < 400; x += 28) for (let y = 20; y < 300; y += 28) shapes.push(<circle key={`${x}-${y}`} cx={x} cy={y} r={1.6} fill={p[4]} opacity={0.4} />)
      shapes.push(<rect key="r" x={90 + r() * 40} y={60 + r() * 30} width={170} height={150} rx={26} fill={`url(#${id}o0)`} opacity={0.95} transform={`rotate(${-8 + r() * 16} 200 150)`} />)
      shapes.push(<circle key="c" cx={250 + r() * 60} cy={170 + r() * 50} r={54} fill={p[3]} opacity={0.88} />)
    } else if (kind === 'waves') {
      for (let i = 0; i < 6; i++) {
        const y = 110 + i * 32, a = 14 + r() * 18, f = 0.012 + r() * 0.012, ph = r() * 6
        let d = `M0 300 L0 ${y}`
        for (let x = 0; x <= 400; x += 10) d += ` L${x} ${(y + Math.sin(x * f * 6.28 + ph) * a).toFixed(1)}`
        d += ' L400 300 Z'
        shapes.push(<path key={i} d={d} fill={p[2 + (i % 3)]} opacity={0.2 + i * 0.1} />)
      }
      shapes.push(<circle key="s" cx={290} cy={80} r={34} fill={p[4]} opacity={0.9} />)
    } else if (kind === 'blocks') {
      for (let i = 0; i < 5; i++) {
        const w = 70 + r() * 110, h = 70 + r() * 110
        shapes.push(<rect key={i} x={10 + r() * 280} y={10 + r() * 170} width={w} height={h} rx={14 + r() * 24} fill={p[2 + (i % 3)]} opacity={0.55 + r() * 0.3} transform={`rotate(${(r() - 0.5) * 30} 200 150)`} />)
      }
    } else {
      shapes.push(<circle key="sun" cx={200} cy={170} r={86} fill={`url(#${id}o1)`} />)
      for (let i = 0; i < 6; i++) shapes.push(<rect key={i} x={90} y={178 + i * 15} width={220} height={3 + i * 1.6} fill={`url(#${id}g)`} />)
    }
    return { p, shapes }
  }, [seed, motif, id])
  if (src) {
    return <img src={src} alt={alt} loading="lazy" draggable={false} className={cn('h-full w-full object-cover', className)} />
  }
  const { p, shapes } = art
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden className={cn('h-full w-full', className)}>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={p[0]} />
          <stop offset="1" stopColor={p[1]} />
        </linearGradient>
        <radialGradient id={`${id}o0`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor={p[2]} />
          <stop offset="1" stopColor={p[1]} />
        </radialGradient>
        <radialGradient id={`${id}o1`} cx="40%" cy="30%" r="80%">
          <stop offset="0" stopColor={p[4]} />
          <stop offset="0.55" stopColor={p[3]} />
          <stop offset="1" stopColor={p[1]} />
        </radialGradient>
        <radialGradient id={`${id}o2`} cx="30%" cy="30%" r="80%">
          <stop offset="0" stopColor={p[3]} />
          <stop offset="1" stopColor={p[0]} stopOpacity="0.2" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${id}g)`} />
      {shapes}
    </svg>
  )
}

/** Tiny in-view helper used by the scroll-aware portfolio components. */
export function useInViewOnce<T extends Element>(opts?: IntersectionObserverInit & { disabled?: boolean }) {
  const ref = React.useRef<T>(null)
  const [seen, setSeen] = React.useState(false)
  React.useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    if (typeof IntersectionObserver === 'undefined') { setSeen(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { threshold: 0.25, ...opts })
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen])
  return [ref, seen] as const
}
