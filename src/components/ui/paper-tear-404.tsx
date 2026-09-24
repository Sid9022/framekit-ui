import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

const SCRAPS = [
  { x: -40, y: -20, r: -18, w: 28, h: 18 },
  { x: 50, y: -30, r: 12, w: 22, h: 14 },
  { x: -55, y: 40, r: 25, w: 18, h: 20 },
  { x: 60, y: 35, r: -8, w: 24, h: 12 },
  { x: 10, y: -45, r: 30, w: 16, h: 16 },
]

/** Torn paper reveal + floating scraps + 404 type. */
export function PaperTear404({
  className,
  onHome,
}: {
  className?: string
  onHome?: () => void
}) {
  const reduced = usePrefersReducedMotion()

  return (
    <div
      className={cn(
        'relative flex min-h-[260px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-zinc-200 dark:bg-zinc-900',
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.12),transparent_60%)]" />
      {SCRAPS.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-sm bg-[#f4efe6] shadow-md dark:bg-zinc-700"
          style={{ width: s.w, height: s.h, left: `calc(50% + ${s.x}px)`, top: `calc(50% + ${s.y}px)` }}
          animate={
            reduced
              ? { rotate: s.r }
              : {
                  y: [0, -8 - i * 2, 0],
                  x: [0, (i % 2 === 0 ? 6 : -6), 0],
                  rotate: [s.r, s.r + 8, s.r],
                }
          }
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <motion.div
        className="relative z-10 max-w-sm overflow-hidden bg-[#f7f3ea] px-10 py-8 shadow-xl dark:bg-zinc-800"
        style={{
          clipPath:
            'polygon(0% 4%, 8% 0%, 18% 5%, 28% 1%, 40% 6%, 52% 0%, 64% 5%, 76% 1%, 88% 6%, 100% 2%, 100% 96%, 90% 100%, 78% 95%, 66% 100%, 54% 94%, 42% 100%, 30% 95%, 18% 100%, 8% 96%, 0% 100%)',
        }}
        initial={reduced ? false : { y: 24, opacity: 0, rotate: -2 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14 }}
      >
        <p className="font-display text-6xl text-zinc-900 dark:text-zinc-50">404</p>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Page torn from the archive.</p>
        <button
          type="button"
          onClick={onHome}
          className="mt-4 rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-medium text-white dark:bg-signal-400 dark:text-zinc-950"
        >
          Go home
        </button>
      </motion.div>
    </div>
  )
}
