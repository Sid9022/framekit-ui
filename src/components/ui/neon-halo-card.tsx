import * as React from 'react'
import { motion } from 'motion/react'
import { Check, Sparkles } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type NeonHaloCardProps = {
  /** 2–4 colours swept around the edge. */
  colors?: string[]
  /** Width of the lit edge in px. Clamped 1–4. */
  borderWidth?: number
  /** Corner radius in px. */
  radius?: number
  /** Strength of the outer bloom, 0–1. */
  glow?: number
  /** Seconds per full sweep. 0 stops the sweep. */
  speed?: number
  children?: React.ReactNode
  className?: string
}

function DefaultContent() {
  return (
    <div className="flex flex-col p-6 sm:p-7">
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-signal-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-signal-800 dark:bg-signal-900/60 dark:text-signal-200">
        <Sparkles className="h-3 w-3" aria-hidden /> Most popular
      </span>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-zinc-950 dark:text-white">Studio</h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">For small teams shipping every week.</p>
      <p className="mt-5 flex items-baseline gap-1">
        <span className="text-4xl font-semibold tabular-nums tracking-[-0.03em] text-zinc-950 dark:text-white">$24</span>
        <span className="text-sm text-zinc-600 dark:text-zinc-400">per seat / month</span>
      </p>
      <ul className="mt-5 space-y-2.5 text-sm text-zinc-700 dark:text-zinc-300">
        {['Unlimited projects', 'Preview links with comments', 'Priority support, 4 h reply'].map((f) => (
          <li key={f} className="flex items-center gap-2.5">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"><Check className="h-3 w-3" strokeWidth={3} aria-hidden /></span>
            {f}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-medium text-white transition-[background-color,transform] duration-150 hover:bg-zinc-800 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 dark:focus-visible:ring-signal-300 dark:focus-visible:ring-offset-zinc-950"
      >
        Start 14-day trial
      </button>
    </div>
  )
}

/**
 * Neon Halo Card — a card rimmed by a slow sweep of coloured light. A conic gradient travels around a hairline edge
 * while a soft bloom breathes behind it; pointer movement pulls a quiet spotlight across the surface. Bright in the
 * dark, restrained on light pages. Reduced motion keeps the halo as a still gradient.
 */
export function NeonHaloCard({
  colors = ['#a78bfa', '#f97316', '#f472b6', '#a78bfa'],
  borderWidth = 1.5,
  radius = 24,
  glow = 0.6,
  speed = 7,
  children,
  className,
}: NeonHaloCardProps) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const bw = Math.min(4, Math.max(1, borderWidth))
  const g = Math.min(1, Math.max(0, glow))
  const stops = colors.length >= 2 ? [...colors, colors[0]] : ['#a78bfa', '#f97316', '#a78bfa']
  const conic = `conic-gradient(from 0deg, ${stops.join(', ')})`
  const spin = !reduced && speed > 0
  const spinner = spin ? { animate: { rotate: 360 }, transition: { duration: speed, ease: 'linear' as const, repeat: Infinity } } : {}

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--sx', `${e.clientX - r.left}px`)
    el.style.setProperty('--sy', `${e.clientY - r.top}px`)
  }

  return (
    <div ref={ref} onPointerMove={onMove} className={cn('group relative isolate w-full max-w-sm', className)} style={{ borderRadius: radius }}>
      <div aria-hidden className="absolute -inset-3 -z-10 overflow-hidden opacity-[calc(var(--g)*0.55)] blur-2xl transition-opacity duration-500 group-hover:opacity-[var(--g)] dark:opacity-[var(--g)]" style={{ borderRadius: radius + 12, ['--g' as string]: g }}>
        <motion.div className="absolute left-1/2 top-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2" style={{ background: conic }} {...spinner} />
      </div>
      <div className="relative overflow-hidden" style={{ borderRadius: radius, padding: bw }}>
        <motion.div aria-hidden className="absolute left-1/2 top-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2" style={{ background: conic }} {...spinner} />
        <div
          className="relative bg-white/95 shadow-[inset_0_1px_0_rgb(255_255_255/0.9)] dark:bg-zinc-950/95 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]"
          style={{ borderRadius: radius - bw }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ borderRadius: radius - bw, background: 'radial-gradient(320px circle at var(--sx, 50%) var(--sy, 0%), rgb(167 139 250 / 0.12), transparent 65%)' }}
          />
          <div className="relative">{children ?? <DefaultContent />}</div>
        </div>
      </div>
    </div>
  )
}
