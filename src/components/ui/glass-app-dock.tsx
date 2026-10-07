import * as React from 'react'
import { motion, useAnimationControls, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { Compass, Mail, MessageCircle, Music2, Camera, Calendar, Settings, Trash2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type DockApp = { id: string; label: string; icon: React.ReactNode; tint?: string; running?: boolean; separatorBefore?: boolean }

export type GlassAppDockProps = {
  apps?: DockApp[]
  /** Resting icon size in px. */
  baseSize?: number
  /** Peak magnified size in px. */
  maxSize?: number
  /** Pointer distance (px) over which neighbours magnify. */
  range?: number
  onLaunch?: (id: string) => void
  className?: string
}

export const DEFAULT_DOCK_APPS: DockApp[] = [
  { id: 'browser', label: 'Browser', icon: <Compass />, tint: 'from-sky-400 to-blue-600', running: true },
  { id: 'mail', label: 'Mail', icon: <Mail />, tint: 'from-blue-400 to-indigo-600' },
  { id: 'messages', label: 'Messages', icon: <MessageCircle />, tint: 'from-emerald-400 to-green-600', running: true },
  { id: 'music', label: 'Music', icon: <Music2 />, tint: 'from-rose-400 to-pink-600' },
  { id: 'photos', label: 'Photos', icon: <Camera />, tint: 'from-amber-300 to-orange-500' },
  { id: 'calendar', label: 'Calendar', icon: <Calendar />, tint: 'from-red-400 to-red-600' },
  { id: 'settings', label: 'Settings', icon: <Settings />, tint: 'from-zinc-400 to-zinc-600' },
  { id: 'trash', label: 'Trash', icon: <Trash2 />, tint: 'from-zinc-300 to-zinc-500', separatorBefore: true },
]

/**
 * Glass App Dock — a macOS-style dock: icons magnify on a spring with a cosine
 * falloff around the pointer, labels float above, launching bounces the icon
 * and lights a running dot. Keyboard focus magnifies too (← → to move).
 */
export function GlassAppDock({ apps = DEFAULT_DOCK_APPS, baseSize = 44, maxSize = 76, range = 150, onLaunch, className }: GlassAppDockProps) {
  const mouseX = useMotionValue(Infinity)
  const reduced = usePrefersReducedMotion()
  const [running, setRunning] = React.useState(() => new Set(apps.filter((a) => a.running).map((a) => a.id)))
  const refs = React.useRef<(HTMLButtonElement | null)[]>([])

  const launch = (id: string) => {
    setRunning((s) => new Set(s).add(id))
    onLaunch?.(id)
  }
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = apps.length
    let j = -1
    if (e.key === 'ArrowRight') j = (i + 1) % n
    else if (e.key === 'ArrowLeft') j = (i - 1 + n) % n
    else if (e.key === 'Home') j = 0
    else if (e.key === 'End') j = n - 1
    if (j >= 0) { e.preventDefault(); refs.current[j]?.focus() }
  }

  return (
    <nav aria-label="Dock" className={cn('flex justify-center px-2 pt-24', className)}>
      <motion.ul
        onPointerMove={(e) => !reduced && e.pointerType === 'mouse' && mouseX.set(e.clientX)}
        onPointerLeave={() => mouseX.set(Infinity)}
        className="flex max-w-full items-end gap-2 overflow-x-auto overflow-y-visible rounded-[22px] border border-black/[0.08] bg-white/60 px-2.5 pb-2 pt-2 shadow-[inset_0_1px_0_rgb(255_255_255/0.6),0_1px_2px_rgb(0_0_0/0.06),0_24px_48px_-24px_rgb(24_24_27/0.35)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/[0.10] dark:bg-zinc-900/60 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] [@media(prefers-reduced-transparency:reduce)]:bg-white [@media(prefers-reduced-transparency:reduce)]:dark:bg-zinc-900"
        style={{ overflowY: 'visible' }}
      >
        {apps.map((app, i) => (
          <React.Fragment key={app.id}>
            {app.separatorBefore && <li aria-hidden className="mx-1 h-10 w-px self-center bg-black/10 dark:bg-white/15" />}
            <DockIcon
              app={app} mouseX={mouseX} base={baseSize} max={maxSize} range={range} reduced={reduced}
              running={running.has(app.id)} onLaunch={() => launch(app.id)} onKey={(e) => onKey(e, i)}
              setRef={(el) => { refs.current[i] = el }} focusSet={(x) => mouseX.set(x)}
            />
          </React.Fragment>
        ))}
      </motion.ul>
    </nav>
  )
}

function DockIcon({ app, mouseX, base, max, range, reduced, running, onLaunch, onKey, setRef, focusSet }: {
  app: DockApp; mouseX: MotionValue<number>; base: number; max: number; range: number; reduced: boolean; running: boolean
  onLaunch: () => void; onKey: (e: React.KeyboardEvent) => void; setRef: (el: HTMLButtonElement | null) => void; focusSet: (x: number) => void
}) {
  const ref = React.useRef<HTMLButtonElement | null>(null)
  const [hover, setHover] = React.useState(false)
  const controls = useAnimationControls()
  const dist = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect()
    return r ? x - (r.left + r.width / 2) : Infinity
  })
  const target = useTransform(dist, (d) => {
    if (!Number.isFinite(d) || Math.abs(d) > range) return base
    return base + (max - base) * (Math.cos((d / range) * Math.PI) + 1) / 2
  })
  const size = useSpring(target, { stiffness: 400, damping: 30, mass: 0.4 })
  return (
    <li className="relative flex flex-col items-center">
      <motion.span
        aria-hidden
        initial={false}
        animate={{ opacity: hover ? 1 : 0, y: hover ? 0 : 4, scale: hover ? 1 : 0.96 }}
        transition={{ duration: 0.15 }}
        className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-[8px] border border-black/[0.08] bg-white/90 px-2 py-1 text-xs font-medium text-zinc-900 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-800/90 dark:text-zinc-100"
      >{app.label}</motion.span>
      <motion.button
        ref={(el) => { ref.current = el; setRef(el) }}
        type="button"
        aria-label={`${app.label}${running ? ' (open)' : ''}`}
        style={{ width: reduced ? base : size, height: reduced ? base : size }}
        animate={controls}
        whileTap={{ scale: 0.92 }}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        onFocus={() => { setHover(true); const r = ref.current?.getBoundingClientRect(); if (r && !reduced) focusSet(r.left + r.width / 2) }}
        onBlur={() => { setHover(false); focusSet(Infinity) }}
        onKeyDown={onKey}
        onClick={() => { if (!reduced) controls.start({ y: [0, -22, 0, -10, 0], transition: { duration: 0.9, ease: 'easeOut' } }); onLaunch() }}
        className={cn('grid place-items-center rounded-[24%] bg-gradient-to-b text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_4px_10px_-4px_rgb(0_0_0/0.35)] outline-none focus-visible:ring-2 focus-visible:ring-signal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900 [&_svg]:size-[46%]', app.tint ?? 'from-zinc-500 to-zinc-700')}
      >{app.icon}</motion.button>
      <span aria-hidden className={cn('mt-1 size-1 rounded-full bg-zinc-800 transition-opacity dark:bg-zinc-200', running ? 'opacity-100' : 'opacity-0')} />
    </li>
  )
}
