import * as React from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

const VARIANT = {
  solid:
    'bg-zinc-950 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.2),0_8px_20px_-8px_rgba(0,0,0,0.45)] ring-1 ring-zinc-950 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:ring-white dark:shadow-[inset_0_-1px_0_rgba(0,0,0,0.08),0_8px_24px_-10px_rgba(255,255,255,0.25)] dark:hover:bg-zinc-100',
  accent:
    'bg-framekit-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_2px_rgba(154,52,18,0.3),0_10px_24px_-10px_rgba(234,88,12,0.6)] ring-1 ring-framekit-700/60 hover:bg-framekit-700 dark:bg-framekit-500 dark:text-zinc-950 dark:hover:bg-framekit-400',
  glass:
    'bg-white/70 text-zinc-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_-12px_rgba(0,0,0,0.25)] ring-1 ring-zinc-950/[0.08] backdrop-blur-xl hover:bg-white/90 dark:bg-white/[0.08] dark:text-white dark:ring-white/15 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] dark:hover:bg-white/[0.12]',
} as const

/** Button that gently follows the cursor within its magnetic field; the label leans a little further. */
export function MagneticButton({
  children,
  className,
  strength = 0.35,
  variant = 'solid',
  ...props
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd'> & {
  strength?: number
  /** Surface style. */
  variant?: keyof typeof VARIANT
}) {
  const ref = React.useRef<HTMLButtonElement>(null)
  const reduced = usePrefersReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.6 })
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.6 })
  const labelX = useTransform(springX, (v) => v * 0.35)
  const labelY = useTransform(springY, (v) => v * 0.35)

  const onMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== 'mouse' || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }

  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      style={{ x: springX, y: springY }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 600, damping: 30 }}
      className={cn(
        'relative inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-[-0.005em] transition-[background-color,box-shadow] duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-signal-300 dark:focus-visible:ring-offset-zinc-950',
        VARIANT[variant],
        className,
      )}
      {...props}
    >
      <motion.span className="inline-flex items-center gap-2" style={{ x: labelX, y: labelY }}>
        {children}
      </motion.span>
    </motion.button>
  )
}
