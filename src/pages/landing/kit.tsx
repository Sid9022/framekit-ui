import * as React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'

/* ── Motion tokens ────────────────────────────────────────────────────────
 * Scene entrances: 700 ms expo-out, 40 ms stagger, 16 px rise (premium-web-guidelines §6).
 * MotionConfig reducedMotion="user" (App.tsx) strips the transforms and keeps the fade. */
export const EASE = [0.16, 1, 0.3, 1] as const
export const SPRING = { type: 'spring', stiffness: 420, damping: 30, mass: 0.7 } as const

/** Restrained palette: ink + paper, one signature pop (lime) and one secondary (blue). */
export const POP = {
  ink: '#0A0A0B',
  lime: '#D9F95C',
  blue: '#2B5BFF',
  blueSoft: '#8FA8FF',
} as const

/* ── Type ─────────────────────────────────────────────────────────────── */
export const overline =
  'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600 dark:text-zinc-400'
export const h2 =
  'text-balance text-[clamp(2rem,1.35rem+3.1vw,4rem)] font-semibold leading-[1.04] tracking-[-0.045em] text-zinc-950 dark:text-white'
export const lede = 'text-pretty text-[clamp(1rem,0.96rem+0.2vw,1.125rem)] leading-relaxed text-zinc-600 dark:text-zinc-400'
export const muted = 'text-pretty text-zinc-600 dark:text-zinc-400'

/* ── Layout (8pt) ─────────────────────────────────────────────────────── */
export const gutter =
  'pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] sm:pl-[max(2rem,env(safe-area-inset-left))] sm:pr-[max(2rem,env(safe-area-inset-right))]'
export const section = cn('mx-auto w-full max-w-[1280px]', gutter)
export const sectionY = 'py-20 sm:py-28 lg:py-32'

/* ── Surfaces ─────────────────────────────────────────────────────────── */
export const hairline = 'ring-1 ring-black/[0.06] dark:ring-white/[0.08]'
export const card = cn(
  'rounded-[24px] bg-white shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_32px_-16px_rgb(0_0_0/0.14)] dark:bg-[#141416] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]',
  hairline,
)
export const focusRing =
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B5BFF] dark:focus-visible:outline-[#8FA8FF]'

/* ── Buttons: rest · hover · focus-visible · press ───────────────────── */
const pillBase = cn(
  'inline-flex min-h-11 touch-manipulation select-none items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-sm font-medium transition-[transform,background-color,color,box-shadow] duration-150 ease-out active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100',
  focusRing,
)
export const pillDark = cn(
  pillBase,
  'bg-zinc-950 text-white shadow-[0_1px_2px_rgb(0_0_0/0.2),inset_0_1px_0_rgb(255_255_255/0.14)] hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:shadow-[inset_0_-1px_0_rgb(0_0_0/0.12)] dark:hover:bg-zinc-200',
)
export const pillLight = cn(
  pillBase,
  'bg-white text-zinc-950 shadow-[0_1px_2px_rgb(0_0_0/0.05)] ring-1 ring-black/[0.08] hover:bg-zinc-50 hover:ring-black/[0.14] dark:bg-white/[0.06] dark:text-white dark:shadow-none dark:ring-white/[0.12] dark:hover:bg-white/[0.1]',
)
export const pillLime = cn(pillBase, 'bg-[#D9F95C] text-zinc-950 shadow-[inset_0_1px_0_rgb(255_255_255/0.5),0_1px_2px_rgb(0_0_0/0.12)] hover:bg-[#E4FB86]')

/** Fade + 16px rise on first entry. Reduced motion keeps only the fade (MotionConfig). */
export function Reveal({ children, delay = 0, y = 16, className, scale, as = 'div' }: { children: React.ReactNode; delay?: number; y?: number; className?: string; scale?: number; as?: 'div' | 'li' }) {
  const M = as === 'li' ? motion.li : motion.div
  return (
    <M
      className={className}
      initial={{ opacity: 0, y, scale: scale ?? 1 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </M>
  )
}

/** Overline with a small accent dot (consistent across sections). */
export function Overline({ children, className, dot = POP.blue }: { children: React.ReactNode; className?: string; dot?: string }) {
  return (
    <p className={cn(overline, className)}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />
      {children}
    </p>
  )
}

/** One header pattern for every section: overline · title · lede · optional action. */
export function SectionHeader({
  id, eyebrow, title, body, action, align = 'left', className, titleClassName,
}: {
  id: string
  eyebrow: string
  title: React.ReactNode
  body?: React.ReactNode
  action?: React.ReactNode
  align?: 'left' | 'center'
  className?: string
  titleClassName?: string
}) {
  const center = align === 'center'
  return (
    <div className={cn('flex flex-col gap-6', center ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between', className)}>
      <div className={cn('max-w-[40rem]', center && 'mx-auto')}>
        <Reveal><Overline>{eyebrow}</Overline></Reveal>
        <Reveal delay={0.04}><h2 id={id} className={cn(h2, 'mt-4', titleClassName)}>{title}</h2></Reveal>
        {body && <Reveal delay={0.08}><p className={cn(lede, 'mt-5 max-w-[52ch]', center && 'mx-auto')}>{body}</p></Reveal>}
      </div>
      {action && <Reveal delay={0.12} className="shrink-0">{action}</Reveal>}
    </div>
  )
}

/** Floating @handle badge that springs in. */
export function HandleBadge({ handle, color = POP.ink, text = '#fff', className, delay = 0.4 }: { handle: string; color?: string; text?: string; className?: string; delay?: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.6, y: 6 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...SPRING, delay }}
      className={cn('pointer-events-none absolute z-20 whitespace-nowrap rounded-full px-3 py-1.5 font-mono text-[11px] font-medium tracking-tight shadow-[0_1px_2px_rgb(0_0_0/0.12),0_8px_20px_-8px_rgb(0_0_0/0.3)]', className)}
      style={{ background: color, color: text }}
      translate="no"
    >
      @{handle}
    </motion.span>
  )
}

/**
 * Renders a real Framekit component scaled down as an "artwork". The live copy is `inert`
 * (animated, but not focusable) — a separate link carries the action.
 */
export function Art({ children, scale = 0.6, className, live = false }: { children: React.ReactNode; scale?: number; className?: string; live?: boolean }) {
  return (
    <div className={cn('relative flex items-center justify-center overflow-hidden', className)}>
      <div
        inert={!live}
        className="flex shrink-0 items-center justify-center"
        style={{ width: `${100 / scale}%`, transform: `scale(${scale})`, transformOrigin: 'center' }}
      >
        {children}
      </div>
    </div>
  )
}

export function DocLink({ slug, label, className }: { slug: string; label: string; className?: string }) {
  return (
    <Link
      to={`/docs/${slug}`}
      className={cn('inline-flex min-h-9 touch-manipulation items-center gap-1 rounded-full bg-white/90 px-3 text-xs font-semibold text-zinc-950 shadow-[0_1px_2px_rgb(0_0_0/0.08)] ring-1 ring-black/[0.08] backdrop-blur transition-[transform,background-color] duration-150 hover:bg-white active:scale-95 pointer-coarse:min-h-11 dark:bg-zinc-950/80 dark:text-white dark:ring-white/[0.14] dark:hover:bg-zinc-900', focusRing, className)}
    >
      {label} <ArrowUpRight className="h-3 w-3" aria-hidden />
    </Link>
  )
}

/** Light surfaces get a dark-mode twin; ink and pop colours stay put. */
const TWIN: Record<string, string> = {
  '#FFFFFF': 'bg-white dark:bg-[#141416]',
  '#F1F1EF': 'bg-[#F1F1EF] dark:bg-[#18181B]',
  '#E5ECFF': 'bg-[#E5ECFF] dark:bg-[#141b33]',
}
export function surface(bg: string): { className: string; style?: React.CSSProperties } {
  if (TWIN[bg]) return { className: TWIN[bg] }
  const ink = bg === POP.ink || bg === '#0A0A0A' || bg === '#111827'
  // Pop surfaces (lime, blue) keep components in their light variant so text stays legible in dark mode.
  return { className: ink ? 'dark' : 'light', style: { background: bg } }
}

/** Pauses ambient loops when reduced motion is requested (JS-driven sequences). */
export function useReduced() {
  const [r, setR] = React.useState(false)
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setR(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return r
}

/**
 * Fits a real component inside its frame at any width: renders it at a fixed design width,
 * measures it, then scales it to `fill` of the frame (so artworks stay legible from 360 px to 1920 px).
 */
export function FitArt({ children, design = 380, fill = 0.86, className }: { children: React.ReactNode; design?: number | 'auto'; fill?: number; className?: string }) {
  const box = React.useRef<HTMLDivElement>(null)
  const inner = React.useRef<HTMLDivElement>(null)
  const [s, setS] = React.useState(0)
  React.useLayoutEffect(() => {
    const b = box.current
    const i = inner.current
    if (!b || !i) return
    const fit = () => {
      // Measure the component itself (not scroll overflow from glows/tooltips).
      const c = (i.firstElementChild as HTMLElement | null) ?? i
      const nw = c.offsetWidth || i.offsetWidth
      const nh = c.offsetHeight || i.offsetHeight
      if (!nw || !nh) return
      setS(Math.min((b.clientWidth * fill) / nw, (b.clientHeight * fill) / nh, 1.2))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(b)
    ro.observe(i)
    return () => ro.disconnect()
  }, [fill])
  return (
    <div ref={box} className={cn('relative overflow-hidden', className)}>
      <div
        ref={inner}
        inert
        aria-hidden
        className="absolute left-1/2 top-1/2 flex items-center justify-center"
        style={{ width: design === 'auto' ? 'max-content' : design, transform: `translate(-50%, -50%) scale(${s})`, opacity: s ? 1 : 0 }}
      >
        {children}
      </div>
    </div>
  )
}
