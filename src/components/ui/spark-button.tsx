import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Particle = { id: number; x: number; y: number; color: string }

const COLORS = ['#f97316', '#fb923c', '#fbbf24', '#ffffff', '#fdba74']

/** Button that emits a burst of sparks on click. */
export function SparkButton({
  children,
  className,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [particles, setParticles] = React.useState<Particle[]>([])
  const reduced = usePrefersReducedMotion()
  const id = React.useRef(0)

  const handle = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    if (reduced) return
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    const burst: Particle[] = Array.from({ length: 14 }, () => ({
      id: id.current++,
      x: cx,
      y: cy,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))
    setParticles((p) => [...p, ...burst])
    window.setTimeout(() => {
      setParticles((p) => p.filter((x) => !burst.find((b) => b.id === x.id)))
    }, 700)
  }

  return (
    <button
      type="button"
      onClick={handle}
      className={cn(
        'relative inline-flex overflow-visible items-center justify-center rounded-2xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900',
        className,
      )}
      {...props}
    >
      {children}
      <AnimatePresence>
        {particles.map((p) => {
          const angle = Math.random() * Math.PI * 2
          const dist = 28 + Math.random() * 36
          return (
            <motion.span
              key={p.id}
              className="pointer-events-none absolute h-1.5 w-1.5 rounded-full"
              style={{ left: p.x, top: p.y, background: p.color }}
              initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              animate={{
                opacity: 0,
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist,
                scale: 0,
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          )
        })}
      </AnimatePresence>
    </button>
  )
}
