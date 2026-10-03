import * as React from 'react'
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { Calendar, Camera, Code2, Mail, Palette, PenLine } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type SocialDockItem = { label: string; href: string; icon: React.ReactNode; /** Tint used for the hover halo. */ color?: string }

export type SocialDockProps = {
  items?: SocialDockItem[]
  /** Resting and peak icon sizes in px. */
  size?: number
  maxSize?: number
  'aria-label'?: string
  className?: string
}

const ic = 'h-1/2 w-1/2'
const DEFAULT_ITEMS: SocialDockItem[] = [
  { label: 'Email', href: 'mailto:hello@example.com', icon: <Mail className={ic} />, color: '#7d6899' },
  { label: 'Journal', href: '#journal', icon: <PenLine className={ic} />, color: '#f97316' },
  { label: 'Photo diary', href: '#photos', icon: <Camera className={ic} />, color: '#0e7490' },
  { label: 'Source code', href: '#code', icon: <Code2 className={ic} />, color: '#15803d' },
  { label: 'Design shots', href: '#shots', icon: <Palette className={ic} />, color: '#be123c' },
  { label: 'Book a call', href: '#book', icon: <Calendar className={ic} />, color: '#4338ca' },
]

function Item({ it, x, size, max, reduced, onFocusCenter }: { it: SocialDockItem; x: MotionValue<number>; size: number; max: number; reduced: boolean; onFocusCenter: (cx: number) => void }) {
  const ref = React.useRef<HTMLAnchorElement>(null)
  const dist = useTransform(x, (v) => { const b = ref.current?.getBoundingClientRect(); return b ? v - (b.left + b.width / 2) : Infinity })
  const w = useSpring(useTransform(dist, [-130, -60, 0, 60, 130], [size, size + (max - size) * 0.35, max, size + (max - size) * 0.35, size]), { stiffness: 420, damping: 30, mass: 0.4 })
  const [tip, setTip] = React.useState(false)
  return (
    <motion.a
      ref={ref}
      href={it.href}
      aria-label={it.label}
      onPointerEnter={() => setTip(true)}
      onPointerLeave={() => setTip(false)}
      onFocus={(e) => { setTip(true); if (e.currentTarget.matches(':focus-visible')) { const b = e.currentTarget.getBoundingClientRect(); onFocusCenter(b.left + b.width / 2) } }}
      onBlur={() => setTip(false)}
      style={{ width: reduced ? size : w, height: reduced ? size : w, ['--halo' as string]: it.color ?? '#7d6899' }}
      className="group relative grid shrink-0 place-items-center rounded-2xl bg-white text-zinc-900 shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_1px_2px_rgb(0_0_0/0.1),0_6px_14px_-6px_rgb(0_0_0/0.2)] ring-1 ring-black/5 transition-colors hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-50 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] dark:ring-white/10 dark:hover:bg-zinc-700"
    >
      <span aria-hidden className="pointer-events-none absolute -inset-1 rounded-[20px] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-50 group-focus-visible:opacity-50" style={{ background: 'var(--halo)' }} />
      <span className="relative grid h-full w-full place-items-center">{it.icon}</span>
      <motion.span aria-hidden initial={false} animate={{ opacity: tip ? 1 : 0, y: tip ? 0 : 6, scale: tip ? 1 : 0.9 }} transition={{ type: 'spring', stiffness: 500, damping: 28 }} className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-950 px-2.5 py-1 text-xs font-medium text-white dark:bg-zinc-50 dark:text-zinc-950">{it.label}</motion.span>
    </motion.a>
  )
}

/**
 * Social Dock — a floating link dock whose icons swell with a spring as the pointer (or keyboard focus) nears them,
 * with a coloured halo and a springy label chip. Icons are generic glyphs — swap in your own.
 */
export function SocialDock({ items = DEFAULT_ITEMS, size = 48, maxSize = 76, 'aria-label': label = 'Find me elsewhere', className }: SocialDockProps) {
  const reduced = usePrefersReducedMotion()
  const x = useMotionValue(-9999)
  return (
    <nav aria-label={label} className={cn('max-w-full', className)}>
      <ul
        onPointerMove={(e) => { if (e.pointerType === 'mouse') x.set(e.clientX) }}
        onPointerLeave={() => x.set(-9999)}
        className="mx-auto flex w-fit max-w-full items-end gap-2 rounded-[28px] border border-zinc-200 bg-white/70 p-2.5 backdrop-blur-md sm:gap-2.5 dark:border-zinc-800 dark:bg-zinc-900/60"
        style={{ height: maxSize + 20 }}
      >
        {items.map((it) => (
          <li key={it.label} className="flex">
            <Item it={it} x={x} size={size} max={maxSize} reduced={reduced} onFocusCenter={(cx) => x.set(cx)} />
          </li>
        ))}
      </ul>
    </nav>
  )
}
