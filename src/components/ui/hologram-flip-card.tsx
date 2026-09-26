import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Flip to holographic rear with iridescent sheen. */
export function HologramFlipCard({
  className,
  frontTitle = 'Hologram',
  frontBody = 'Click to flip — iridescent rear reveals.',
  rearTitle = 'Signal locked',
  rearBody = 'Lilac → ember sheen across the foil.',
}: {
  className?: string
  frontTitle?: string
  frontBody?: string
  rearTitle?: string
  rearBody?: string
}) {
  const reduced = usePrefersReducedMotion()
  const [flipped, setFlipped] = React.useState(false)
  const [pos, setPos] = React.useState({ x: 50, y: 50 })

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        setPos({
          x: ((e.clientX - r.left) / r.width) * 100,
          y: ((e.clientY - r.top) / r.height) * 100,
        })
      }}
      className={cn('relative h-52 w-full max-w-xs perspective-[1000px] text-left', className)}
      aria-pressed={flipped}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 14 }}
      >
        <div
          className="absolute inset-0 rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Front</p>
          <h3 className="mt-2 text-lg font-semibold">{frontTitle}</h3>
          <p className="mt-2 text-sm text-zinc-500">{frontBody}</p>
        </div>
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl border border-white/20 p-5 shadow-xl"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background:
              'linear-gradient(135deg, #1a1224 0%, #2a1830 40%, #1c1208 100%)',
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{
              background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, rgba(249,115,22,0.55), rgba(154,134,184,0.35) 35%, transparent 60%),
                linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.35) 48%, transparent 62%)`,
              mixBlendMode: 'screen',
            }}
          />
          <p className="relative text-[10px] uppercase tracking-[0.2em] text-signal-300">Holo rear</p>
          <h3 className="relative mt-2 text-lg font-semibold text-white">{rearTitle}</h3>
          <p className="relative mt-2 text-sm text-signal-200/80">{rearBody}</p>
        </div>
      </motion.div>
    </button>
  )
}
