import * as React from 'react'
import { motion, useSpring } from 'motion/react'
import { cn } from '@/lib/cn'

/** Slider whose thumb stretches elastically while dragging. */
export function ElasticSlider({
  value: controlled,
  defaultValue = 40,
  onChange,
  className,
}: {
  value?: number
  defaultValue?: number
  onChange?: (v: number) => void
  className?: string
}) {
  const track = React.useRef<HTMLDivElement>(null)
  const [value, setValue] = React.useState(controlled ?? defaultValue)
  const [dragging, setDragging] = React.useState(false)
  const scaleX = useSpring(1, { stiffness: 320, damping: 16 })
  const scaleY = useSpring(1, { stiffness: 320, damping: 16 })

  React.useEffect(() => {
    if (controlled != null) setValue(controlled)
  }, [controlled])

  React.useEffect(() => {
    if (dragging) {
      scaleX.set(1.55)
      scaleY.set(0.8)
    } else {
      scaleX.set(1)
      scaleY.set(1)
    }
  }, [dragging, scaleX, scaleY])

  const updateFromEvent = (clientX: number) => {
    const el = track.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const next = Math.round(((clientX - r.left) / r.width) * 100)
    const clamped = Math.max(0, Math.min(100, next))
    setValue(clamped)
    onChange?.(clamped)
  }

  return (
    <div className={cn('w-full max-w-sm select-none', className)}>
      <div
        ref={track}
        className="relative h-3 cursor-pointer rounded-full bg-zinc-200 dark:bg-zinc-800"
        onPointerDown={(e) => {
          setDragging(true)
          updateFromEvent(e.clientX)
          e.currentTarget.setPointerCapture(e.pointerId)
        }}
        onPointerMove={(e) => dragging && updateFromEvent(e.clientX)}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-framekit-500 to-amber-400"
          style={{ width: `${value}%` }}
        />
        <motion.div
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md ring-2 ring-framekit-500"
          style={{ left: `${value}%`, scaleX, scaleY }}
        />
      </div>
      <div className="mt-2 text-right text-xs tabular-nums text-zinc-500">{value}%</div>
    </div>
  )
}
