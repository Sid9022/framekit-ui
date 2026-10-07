import * as React from 'react'
import { motion } from 'motion/react'
import { Home, Search, Library, User, Plus } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type GlassTab = { id: string; label: string; icon: React.ComponentType<{ className?: string }> }

export type LiquidGlassTabBarProps = {
  tabs?: GlassTab[]
  value?: string
  defaultValue?: string
  onValueChange?: (id: string) => void
  /** Floating accessory action on the right. */
  showAction?: boolean
  className?: string
}

export const DEFAULT_GLASS_TABS: GlassTab[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'library', label: 'Library', icon: Library },
  { id: 'me', label: 'Profile', icon: User },
]

/**
 * Liquid Glass Tab Bar — an iOS 26-style floating tab bar. A refractive lens
 * slides between tabs on a spring, stretching along its path like liquid;
 * icons pop when selected. Arrow keys move, Home/End jump.
 */
export function LiquidGlassTabBar({ tabs = DEFAULT_GLASS_TABS, value, defaultValue, onValueChange, showAction = true, className }: LiquidGlassTabBarProps) {
  const [inner, setInner] = React.useState(defaultValue ?? tabs[0]?.id)
  const cur = value ?? inner
  const reduced = usePrefersReducedMotion()
  const idx = Math.max(0, tabs.findIndex((t) => t.id === cur))
  const prev = React.useRef(idx)
  const [stretch, setStretch] = React.useState(1)
  const refs = React.useRef<(HTMLButtonElement | null)[]>([])
  const set = (i: number) => {
    const t = tabs[(i + tabs.length) % tabs.length]
    if (!reduced) { setStretch(1 + Math.min(0.5, Math.abs(i - prev.current) * 0.22)); setTimeout(() => setStretch(1), 140) }
    prev.current = (i + tabs.length) % tabs.length
    setInner(t.id); onValueChange?.(t.id)
  }
  const onKey = (e: React.KeyboardEvent, i: number) => {
    let n = -1
    if (e.key === 'ArrowRight') n = i + 1
    else if (e.key === 'ArrowLeft') n = i - 1
    else if (e.key === 'Home') n = 0
    else if (e.key === 'End') n = tabs.length - 1
    if (n < 0 && e.key !== 'ArrowLeft') return
    e.preventDefault(); const j = (n + tabs.length) % tabs.length; set(j); refs.current[j]?.focus()
  }
  return (
    <div className={cn('relative flex w-full items-end justify-center gap-3 overflow-hidden rounded-[28px] p-6 pt-24', className)} style={{ background: 'linear-gradient(135deg,#f97316 0%,#db2777 40%,#4f46e5 100%)' }}>
      <div aria-hidden className="absolute inset-x-8 top-6 grid grid-cols-3 gap-2 opacity-80">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-10 rounded-xl bg-white/25" />)}</div>
      <div role="tablist" aria-label="Main" className="relative flex items-center rounded-full bg-white/55 p-1 shadow-[inset_0_1px_0_rgb(255_255_255/0.7),inset_0_-1px_0_rgb(0_0_0/0.05),0_12px_32px_-12px_rgb(0_0_0/0.45)] ring-1 ring-white/50 backdrop-blur-2xl backdrop-saturate-150 dark:bg-zinc-900/55 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_12px_32px_-12px_rgb(0_0_0/0.7)] dark:ring-white/10">
        {tabs.map((t, i) => {
          const on = i === idx
          const Icon = t.icon
          return (
            <button key={t.id} ref={(el) => { refs.current[i] = el }} role="tab" aria-selected={on} tabIndex={on ? 0 : -1} onClick={() => set(i)} onKeyDown={(e) => onKey(e, i)} className="relative flex h-[52px] w-[64px] flex-col items-center justify-center gap-0.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-sky-600 sm:w-[76px]">
              {on && <motion.span layoutId="lg-lens" animate={{ scaleX: stretch, scaleY: 2 - stretch * 0.9 > 0.85 ? 2 - stretch * 0.9 : 0.85 }} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 30, mass: 0.7 }} className="absolute inset-0 rounded-full bg-white/80 shadow-[inset_0_1px_1px_rgb(255_255_255/0.9),inset_0_-2px_6px_rgb(0_0_0/0.06),0_4px_12px_-4px_rgb(0_0_0/0.25)] ring-1 ring-black/[0.04] dark:bg-white/[0.16] dark:shadow-[inset_0_1px_1px_rgb(255_255_255/0.25)] dark:ring-white/10" />}
              <motion.span animate={on && !reduced ? { scale: [1, 1.18, 1], y: [0, -2, 0] } : { scale: 1 }} transition={{ duration: 0.35 }} className="relative"><Icon className={cn('size-[22px] transition-colors', on ? 'text-sky-700 dark:text-sky-300' : 'text-zinc-700 dark:text-zinc-300')} /></motion.span>
              <span className={cn('relative text-[11px] font-medium', on ? 'text-sky-800 dark:text-sky-200' : 'text-zinc-700 dark:text-zinc-300')}>{t.label}</span>
            </button>
          )
        })}
      </div>
      {showAction && (
        <motion.button whileTap={{ scale: 0.9 }} aria-label="New" className="relative grid size-[60px] place-items-center rounded-full bg-white/55 text-zinc-900 shadow-[inset_0_1px_0_rgb(255_255_255/0.7),0_12px_32px_-12px_rgb(0_0_0/0.45)] ring-1 ring-white/50 backdrop-blur-2xl outline-none focus-visible:ring-2 focus-visible:ring-sky-600 dark:bg-zinc-900/55 dark:text-white dark:ring-white/10"><Plus className="size-6" /></motion.button>
      )}
    </div>
  )
}
