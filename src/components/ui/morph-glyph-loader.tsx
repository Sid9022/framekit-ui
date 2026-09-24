import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

const SHAPES = [
  'M32 8 L56 48 L8 48 Z',
  'M32 10 C48 10 54 28 32 54 C10 28 16 10 32 10 Z',
  'M12 20 H52 V44 H12 Z',
  'M32 8 L50 20 L50 44 L32 56 L14 44 L14 20 Z',
  'M18 18 H46 V46 H18 Z',
]

/** Glyph morphs through abstract SVG shapes. */
export function MorphGlyphLoader({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [i, setI] = React.useState(0)

  React.useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => setI((x) => (x + 1) % SHAPES.length), 900)
    return () => clearInterval(id)
  }, [reduced])

  return (
    <div className={cn('flex h-24 w-24 items-center justify-center', className)} role="status" aria-label="Loading">
      <svg viewBox="0 0 64 64" className="h-16 w-16">
        <defs>
          <linearGradient id="morph-glyph-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#9a86b8" />
          </linearGradient>
        </defs>
        <motion.path
          d={SHAPES[i]}
          fill="url(#morph-glyph-grad)"
          initial={false}
          animate={{ d: SHAPES[i] }}
          transition={{ duration: reduced ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: 'drop-shadow(0 6px 12px rgba(249,115,22,0.25))' }}
        />
      </svg>
    </div>
  )
}
