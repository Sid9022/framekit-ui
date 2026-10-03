import * as React from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type XrayLensCursorProps = {
  /** The normal layer — what everyone reads. */
  children: React.ReactNode
  /** The layer shown inside the lens (decorative duplicate: blueprint, wireframe, annotated…). Must match `children` layout. */
  reveal: React.ReactNode
  /** Lens diameter in px. */
  size?: number
  /** Diameter while the pointer is pressed. */
  pressedSize?: number
  /** Small caption on the lens rim. */
  label?: string
  className?: string
}

/**
 * X-ray Lens Cursor — a round lens follows the pointer on a spring and shows a second, aligned layer of the same content
 * (blueprint, wireframe, annotations) through a clip-path. Pressing swells the lens. The reveal layer is decorative and
 * hidden from assistive tech, so nothing important lives only inside it. Touch drags the lens; vertical scrolling still works.
 */
export function XrayLensCursor({ children, reveal, size = 170, pressedSize = 250, label = 'x-ray', className }: XrayLensCursorProps) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const x = useMotionValue(-999), y = useMotionValue(-999)
  const sx = useSpring(x, { stiffness: 420, damping: 38, mass: 0.5 }), sy = useSpring(y, { stiffness: 420, damping: 38, mass: 0.5 })
  const r = useSpring(0, { stiffness: 260, damping: 22 })
  const clip = useMotionTemplate`circle(${r}px at ${sx}px ${sy}px)`
  const ringX = useMotionTemplate`translate(${sx}px, ${sy}px)`
  const [inside, setInside] = React.useState(false)
  const [pressed, setPressed] = React.useState(false)
  const [coords, setCoords] = React.useState('')

  const move = (e: React.PointerEvent) => {
    const b = ref.current!.getBoundingClientRect()
    const px = e.clientX - b.left, py = e.clientY - b.top
    x.set(px); y.set(py)
    if (reduced) { sx.jump(px); sy.jump(py) }
    setCoords(`${Math.round(px)}, ${Math.round(py)}`)
  }
  const enter = (e: React.PointerEvent) => { move(e); const b = ref.current!.getBoundingClientRect(); sx.jump(e.clientX - b.left); sy.jump(e.clientY - b.top); setInside(true); r.set((pressed ? pressedSize : size) / 2) }
  const leave = () => { setInside(false); setPressed(false); r.set(0) }
  const down = (e: React.PointerEvent) => { move(e); setPressed(true); r.set(pressedSize / 2) }
  const up = () => { setPressed(false); r.set(size / 2) }

  return (
    <div
      ref={ref}
      className={cn('relative w-full max-w-3xl touch-pan-y overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800', inside && 'cursor-none', className)}
      onPointerEnter={enter} onPointerMove={move} onPointerLeave={leave} onPointerDown={down} onPointerUp={up} onPointerCancel={leave}
    >
      <div>{children}</div>
      <motion.div aria-hidden inert className="pointer-events-none absolute inset-0 select-none" style={{ clipPath: clip, WebkitClipPath: clip }}>{reveal}</motion.div>
      <motion.div aria-hidden className="pointer-events-none absolute left-0 top-0" style={{ transform: ringX, opacity: inside ? 1 : 0, transition: 'opacity 150ms' }}>
        <motion.div className="relative -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.45),0_10px_30px_rgb(0_0_0/0.35),inset_0_0_30px_rgb(255_255_255/0.2)]" animate={{ width: pressed ? pressedSize : size, height: pressed ? pressedSize : size }} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 22 }}>
          <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-white" /><span className="absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 bg-white" />
          <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-white" /><span className="absolute right-0 top-1/2 h-px w-3 -translate-y-1/2 bg-white" />
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-zinc-950 px-2.5 py-1 font-mono text-[10px] text-white">{label} · {coords}</span>
        </motion.div>
      </motion.div>
    </div>
  )
}
