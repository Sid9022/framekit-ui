import * as React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'

export const EASE = [0.22, 1, 0.36, 1] as const
export const SPRING = { type: 'spring', stiffness: 420, damping: 22, mass: 0.7 } as const

/** Pop accents (paired with text colours that pass AA on each). */
export const POP = {
  red: '#D93838',
  coral: '#FF7051',
  blue: '#2B5BFF',
  lime: '#D9F95C',
  orange: '#F97316',
  purple: '#9333EA',
} as const

export const overline =
  'text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B7280] dark:text-zinc-400'
export const h2 =
  'text-balance text-[clamp(2.25rem,5vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-black dark:text-white'
export const muted = 'text-pretty text-[#6B7280] dark:text-zinc-400'
export const section = 'mx-auto w-full max-w-[1280px] px-5 sm:px-8'
export const sectionY = 'py-20 sm:py-[128px]'

const pillBase =
  'inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-medium transition-[transform,background-color,color] duration-150 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B5BFF] motion-reduce:active:scale-100'
export const pillDark = cn(pillBase, 'bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200')
export const pillLight = cn(pillBase, 'bg-white text-black ring-1 ring-black/10 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:ring-white/15 dark:hover:bg-zinc-800')

/** Fade + rise on first entry. Reduced motion keeps the fade only (MotionConfig). */
export function Reveal({ children, delay = 0, y = 40, className, scale }: { children: React.ReactNode; delay?: number; y?: number; className?: string; scale?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, scale: scale ?? 1 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Floating @handle badge that springs in. */
export function HandleBadge({ handle, color = '#000', text = '#fff', className, delay = 0.4 }: { handle: string; color?: string; text?: string; className?: string; delay?: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.4, y: 8 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...SPRING, delay }}
      className={cn('pointer-events-none absolute z-20 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold tracking-tight', className)}
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
      className={cn('inline-flex min-h-9 items-center gap-1 rounded-full bg-white/90 px-3 text-xs font-semibold text-black ring-1 ring-black/10 backdrop-blur transition-transform duration-150 hover:scale-[1.03] active:scale-95 focus-visible:outline-2 focus-visible:outline-[#2B5BFF] dark:bg-black/80 dark:text-white dark:ring-white/15', className)}
    >
      {label} <ArrowUpRight className="h-3 w-3" aria-hidden />
    </Link>
  )
}

/** Light pastel surfaces get a dark-mode twin; ink and pop colours stay put. */
const TWIN: Record<string, string> = {
  '#FFFFFF': 'bg-white dark:bg-zinc-900',
  '#FFE1D9': 'bg-[#FFE1D9] dark:bg-[#2a1712]',
  '#E5ECFF': 'bg-[#E5ECFF] dark:bg-[#141b33]',
}
export function surface(bg: string): { className: string; style?: React.CSSProperties } {
  if (TWIN[bg]) return { className: TWIN[bg] }
  const ink = bg === '#0A0A0A' || bg === '#111827'
  return { className: ink ? 'dark' : '', style: { background: bg } }
}
