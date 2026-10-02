import * as React from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

function DockIcon({
  mouseX,
  children,
  label,
  reduced,
}: {
  mouseX: ReturnType<typeof useMotionValue<number>>
  children: React.ReactNode
  label: string
  reduced: boolean
}) {
  const ref = React.useRef<HTMLButtonElement>(null)
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })
  const widthSync = useTransform(distance, [-140, 0, 140], reduced ? [48, 48, 48] : [48, 80, 48])
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 180, damping: 14 })

  return (
    <motion.button
      ref={ref}
      type="button"
      style={{ width }}
      title={label}
      aria-label={label}
      className="aspect-square min-w-0 shrink rounded-2xl bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 shadow-md ring-1 ring-black/5 backdrop-blur dark:bg-zinc-800 dark:ring-white/10"
    >
      <div className="flex h-full w-full items-center justify-center text-zinc-700 dark:text-zinc-200">
        {children}
      </div>
    </motion.button>
  )
}

/** macOS-style dock that magnifies icons near the cursor. */
export function MagnifyDock({
  items,
  className,
}: {
  items: { label: string; icon: React.ReactNode }[]
  className?: string
}) {
  const mouseX = useMotionValue(Infinity)
  const reduced = usePrefersReducedMotion()

  return (
    <div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        'mx-auto flex h-20 max-w-full items-end gap-2 rounded-3xl border border-white/40 bg-white/50 px-3 pb-3 pt-2 sm:gap-3 sm:px-4 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60',
        className,
      )}
    >
      {items.map((item) => (
        <DockIcon key={item.label} mouseX={mouseX} label={item.label} reduced={reduced}>
          {item.icon}
        </DockIcon>
      ))}
    </div>
  )
}
