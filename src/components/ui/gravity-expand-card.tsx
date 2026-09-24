import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Click expands with spring; collapse on second click/outside. */
export function GravityExpandCard({
  className,
  title = 'Gravity Expand',
  summary = 'Tap to expand — spring physics, click outside to collapse.',
  detail = 'Expanded layer carries denser content: specs, notes, and an optional CTA. The spring settles with a little overshoot for weight.',
}: {
  className?: string
  title?: string
  summary?: string
  detail?: string
}) {
  const reduced = usePrefersReducedMotion()
  const [open, setOpen] = React.useState(false)
  const root = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <motion.div
      ref={root}
      layout
      onClick={() => setOpen((o) => !o)}
      className={cn(
        'cursor-pointer overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950',
        open ? 'max-w-md' : 'max-w-xs',
        className,
      )}
      animate={
        reduced
          ? {}
          : open
            ? { scale: 1, y: 0 }
            : { scale: 1 }
      }
      transition={{ type: 'spring', stiffness: 280, damping: 18, mass: 0.85 }}
      style={{ transformOrigin: 'center top' }}
    >
      <motion.div layout className="p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-framekit-500">Gravity</p>
        <h3 className="mt-1 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-zinc-500">{summary}</p>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="detail"
              initial={reduced ? false : { opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -6 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="overflow-hidden"
            >
              <p className="mt-4 border-t border-zinc-100 pt-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                {detail}
              </p>
              <span className="mt-3 inline-flex rounded-full bg-signal-100 px-3 py-1 text-xs font-medium text-signal-800 dark:bg-signal-900 dark:text-signal-200">
                Expanded
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
