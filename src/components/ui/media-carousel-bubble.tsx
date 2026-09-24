import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SLIDES = [
  { id: '1', label: 'Summit dawn', tint: 'from-violet-600/80 to-signal-700/80' },
  { id: '2', label: 'Harbor dusk', tint: 'from-sky-600/80 to-indigo-800/80' },
  { id: '3', label: 'Studio glow', tint: 'from-amber-500/80 to-rose-700/80' },
]

/** Inbound/outbound bubble with image carousel, dots, and caption. */
export function MediaCarouselBubble({
  direction = 'in',
  className,
}: {
  direction?: 'in' | 'out'
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const [idx, setIdx] = React.useState(0)
  const slide = SLIDES[idx]

  const next = () => setIdx((i) => (i + 1) % SLIDES.length)
  const prev = () => setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length)

  return (
    <div className={cn('flex w-full max-w-sm', direction === 'out' ? 'justify-end' : 'justify-start', className)}>
      <div
        className={cn(
          'w-[240px] overflow-hidden rounded-2xl shadow-lg',
          direction === 'out'
            ? 'rounded-br-md bg-signal-500 text-white'
            : 'rounded-bl-md border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900',
        )}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={reduced ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className={cn('absolute inset-0 bg-gradient-to-br', slide.tint)}
            >
              <div className="flex h-full items-center justify-center">
                <span className="rounded-full bg-black/25 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
                  {slide.label}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
          <button type="button" onClick={prev} className="absolute left-1.5 top-1/2 -translate-y-1/2 rounded-full bg-black/35 p-1 text-white backdrop-blur hover:bg-black/50" aria-label="Previous">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={next} className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-black/35 p-1 text-white backdrop-blur hover:bg-black/50" aria-label="Next">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setIdx(i)}
                className={cn('h-1.5 rounded-full transition-all', i === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/45')}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
        <p className={cn('px-3 py-2.5 text-sm', direction === 'out' ? 'text-white/95' : 'text-zinc-700 dark:text-zinc-200')}>
          Here&apos;s a peek at this week&apos;s collection — swipe through.
        </p>
      </div>
    </div>
  )
}
