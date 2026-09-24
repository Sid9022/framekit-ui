import * as React from 'react'
import { motion, useMotionValue, useTransform } from 'motion/react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Hold (or Space/Enter) to confirm — icon orbits the rim until committed. */
export function OrbitCommit({
  label = 'Hold to confirm',
  doneLabel = 'Confirmed',
  holdMs = 900,
  onConfirm,
  className,
}: {
  label?: string
  doneLabel?: string
  holdMs?: number
  onConfirm?: () => void
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const [done, setDone] = React.useState(false)
  const progress = useMotionValue(0)
  const angle = useTransform(progress, [0, 1], [0, 360])
  const ox = useTransform(angle, (a) => Math.cos((a * Math.PI) / 180) * 34)
  const oy = useTransform(angle, (a) => Math.sin((a * Math.PI) / 180) * 22)
  const fill = useTransform(progress, [0, 1], ['0%', '100%'])
  const timer = React.useRef<number | null>(null)
  const start = React.useRef(0)

  const clear = () => {
    if (timer.current) cancelAnimationFrame(timer.current)
    timer.current = null
    if (!done) progress.set(0)
  }

  const tick = (now: number) => {
    const p = Math.min(1, (now - start.current) / holdMs)
    progress.set(p)
    if (p >= 1) {
      setDone(true)
      onConfirm?.()
      return
    }
    timer.current = requestAnimationFrame(tick)
  }

  const begin = () => {
    if (done) return
    if (reduced) {
      setDone(true)
      onConfirm?.()
      return
    }
    start.current = performance.now()
    timer.current = requestAnimationFrame(tick)
  }

  return (
    <button
      type="button"
      aria-label={done ? doneLabel : label}
      aria-pressed={done}
      onPointerDown={begin}
      onPointerUp={clear}
      onPointerLeave={clear}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          begin()
        }
      }}
      onKeyUp={clear}
      className={cn(
        'relative inline-flex h-12 min-w-[180px] items-center justify-center overflow-hidden rounded-full border border-zinc-900 bg-zinc-950 px-6 text-sm font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-signal-300 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900',
        className,
      )}
    >
      <motion.span className="pointer-events-none absolute inset-y-0 left-0 bg-signal-300/25" style={{ width: fill }} />
      <span className="relative z-10 flex items-center gap-2">
        {done ? <Check className="h-4 w-4" /> : null}
        {done ? doneLabel : label}
      </span>
      {!done && !reduced && (
        <motion.span
          className="pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full bg-signal-300"
          style={{ x: ox, y: oy, marginLeft: -5, marginTop: -5 }}
        />
      )}
    </button>
  )
}
