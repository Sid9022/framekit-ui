import * as React from 'react'
import { flushSync } from 'react-dom'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useToggleState, type ToggleBaseProps } from '@/lib/toggle'

export interface ThemeRevealToggleProps extends ToggleBaseProps {
  /** `checked` = dark. When given, this element (instead of nothing) gets the `dark` / `light` class on toggle. */
  scopeRef?: React.RefObject<HTMLElement | null>
  /** Apply the class to <html> as well (for a real site-wide switch). */
  applyToRoot?: boolean
  /** Visual size. Both keep a 44px minimum hit area. */
  size?: 'md' | 'lg'
  /** Radius multiplier of the circular reveal (1 = just covers the viewport). */
  revealScale?: number
  /** Called after the transition has finished. */
  onRevealEnd?: (dark: boolean) => void
}

type VT = { finished: Promise<void>; ready: Promise<void> }
type DocVT = Document & { startViewTransition?: (cb: () => void) => VT }

/**
 * Theme Reveal Toggle — a sky-to-night switch whose sun slides behind a moon, and whose page change blooms out of the
 * button as a circular reveal (View Transitions API). Falls back to an instant swap with reduced motion or no API.
 */
export function ThemeRevealToggle({ checked, defaultChecked = false, onCheckedChange, scopeRef, applyToRoot = false, size = 'md', revealScale = 1, onRevealEnd, disabled, className, id, 'aria-label': ariaLabel = 'Dark mode' }: ThemeRevealToggleProps) {
  const reduced = usePrefersReducedMotion()
  const { checked: dark, set } = useToggleState({ checked, defaultChecked, onCheckedChange })
  const btnRef = React.useRef<HTMLButtonElement>(null)
  const [announce, setAnnounce] = React.useState('')
  const busy = React.useRef(false)
  const uid = React.useId().replace(/:/g, '')

  const apply = (next: boolean) => {
    set(next)
    const targets: (HTMLElement | null)[] = [scopeRef?.current ?? null, applyToRoot ? document.documentElement : null]
    targets.forEach((t) => { if (t) { t.classList.toggle('dark', next); t.classList.toggle('light', !next) } })
  }

  const onClick = () => {
    if (disabled || busy.current) return
    const next = !dark
    setAnnounce(next ? 'Dark theme on' : 'Light theme on')
    const doc = document as DocVT
    const b = btnRef.current?.getBoundingClientRect()
    if (reduced || !doc.startViewTransition || !b) { apply(next); onRevealEnd?.(next); return }
    const cx = b.left + b.width / 2
    const cy = b.top + b.height / 2
    const r = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy)) * revealScale
    const style = document.createElement('style')
    style.textContent = '::view-transition-old(root),::view-transition-new(root){animation:none;mix-blend-mode:normal}::view-transition-old(root){z-index:1}::view-transition-new(root){z-index:2}'
    document.head.appendChild(style)
    busy.current = true
    const vt = doc.startViewTransition(() => { flushSync(() => apply(next)) })
    vt.ready.then(() => {
      document.documentElement.animate({ clipPath: [`circle(0px at ${cx}px ${cy}px)`, `circle(${r}px at ${cx}px ${cy}px)`] }, { duration: 650, easing: 'cubic-bezier(.22,.8,.2,1)', pseudoElement: '::view-transition-new(root)' })
    }).catch(() => {})
    vt.finished.catch(() => {}).finally(() => { style.remove(); busy.current = false; onRevealEnd?.(next) })
  }

  const w = size === 'lg' ? 96 : 76
  const h = size === 'lg' ? 52 : 44
  const k = h - 10
  const travel = w - h

  return (
    <>
      <button
        ref={btnRef}
        id={id}
        type="button"
        role="switch"
        aria-checked={dark}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={onClick}
        className={cn('relative inline-flex shrink-0 items-center overflow-hidden rounded-full border outline-none transition-colors focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-50 dark:focus-visible:ring-signal-300 dark:focus-visible:ring-offset-zinc-950', dark ? 'border-indigo-400/40 bg-indigo-950' : 'border-sky-500/40 bg-sky-300', className)}
        style={{ width: w, height: h }}
      >
        {/* sky: clouds by day, stars by night */}
        <svg aria-hidden viewBox="0 0 76 44" preserveAspectRatio="none" className="absolute inset-0 size-full">
          <motion.g animate={{ opacity: dark ? 0 : 1, y: dark ? 10 : 0 }} transition={{ duration: reduced ? 0 : 0.45 }}>
            <ellipse cx="22" cy="31" rx="13" ry="5" fill="#fff" opacity=".85" />
            <ellipse cx="30" cy="27" rx="9" ry="5" fill="#fff" opacity=".9" />
            <ellipse cx="14" cy="28" rx="7" ry="4" fill="#fff" opacity=".8" />
          </motion.g>
          <motion.g animate={{ opacity: dark ? 1 : 0, y: dark ? 0 : -8 }} transition={{ duration: reduced ? 0 : 0.45, delay: dark && !reduced ? 0.12 : 0 }} fill="#e0e7ff">
            <circle cx="46" cy="12" r="1.2" /><circle cx="58" cy="24" r="1" /><circle cx="40" cy="30" r=".9" /><circle cx="66" cy="11" r=".8" /><circle cx="52" cy="35" r="1.1" />
          </motion.g>
        </svg>
        <motion.span
          aria-hidden
          className="absolute left-[5px] top-[5px] grid place-items-center rounded-full shadow-md"
          style={{ width: k, height: k, background: dark ? '#e2e8f0' : '#fbbf24' }}
          animate={{ x: dark ? travel : 0, rotate: dark ? 360 : 0 }}
          transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 22 }}
        >
          <svg viewBox="0 0 24 24" className="size-[70%]">
            <defs>
              <mask id={`trt-m-${uid}`}>
                <rect width="24" height="24" fill="#fff" />
                <motion.circle r="7" cy="9" initial={false} animate={{ cx: dark ? 15 : 34 }} transition={{ duration: reduced ? 0 : 0.4 }} fill="#000" />
              </mask>
            </defs>
            <motion.g animate={{ opacity: dark ? 0 : 1, scale: dark ? 0.4 : 1 }} style={{ transformOrigin: '12px 12px' }} transition={{ duration: reduced ? 0 : 0.3 }} stroke="#b45309" strokeWidth="1.8" strokeLinecap="round">
              {Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return <line key={i} x1={12 + Math.cos(a) * 8.6} y1={12 + Math.sin(a) * 8.6} x2={12 + Math.cos(a) * 10.6} y2={12 + Math.sin(a) * 10.6} /> })}
            </motion.g>
            <circle cx="12" cy="12" r={dark ? 8 : 5.6} mask={dark ? `url(#trt-m-${uid})` : undefined} fill={dark ? '#312e81' : '#b45309'} />
          </svg>
        </motion.span>
      </button>
      <span className="sr-only" role="status" aria-live="polite">{announce}</span>
    </>
  )
}
