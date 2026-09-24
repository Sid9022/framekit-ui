import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Props = {
  label?: string
  doneLabel?: string
  onConfirm?: () => void
  className?: string
  disabled?: boolean
}

/** Drag or keyboard-advance the knob to confirm a deliberate action. */
export function SlideConfirmButton({
  label = 'Slide to confirm',
  doneLabel = 'Confirmed',
  onConfirm,
  className,
  disabled,
}: Props) {
  const reduced = usePrefersReducedMotion()
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [progress, setProgress] = React.useState(0)
  const [done, setDone] = React.useState(false)
  const dragging = React.useRef(false)

  const commit = (p: number) => {
    if (p >= 0.92) {
      setProgress(1)
      setDone(true)
      onConfirm?.()
    } else {
      setProgress(0)
    }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled || done) return
    dragging.current = true
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !trackRef.current) return
    const r = trackRef.current.getBoundingClientRect()
    const p = Math.max(0, Math.min(1, (e.clientX - r.left - 22) / (r.width - 44)))
    setProgress(p)
  }
  const onPointerUp = () => {
    if (!dragging.current) return
    dragging.current = false
    commit(progress)
  }

  return (
    <div
      ref={trackRef}
      className={cn(
        'relative flex h-12 w-64 select-none items-center rounded-full bg-zinc-900 px-1 shadow-lg dark:bg-zinc-800',
        disabled && 'opacity-50',
        className,
      )}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={done ? doneLabel : label}
      aria-disabled={disabled || done}
      onKeyDown={(e) => {
        if (disabled || done) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setProgress(1)
          setDone(true)
          onConfirm?.()
        }
        if (e.key === 'ArrowRight') setProgress((p) => Math.min(1, p + 0.1))
      }}
      onKeyUp={(e) => {
        if (e.key === 'ArrowRight') commit(progress)
      }}
    >
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs font-medium tracking-wide text-zinc-400">
        {done ? doneLabel : label}
      </span>
      <span
        className="absolute inset-y-1 left-1 rounded-full bg-signal-300/30"
        style={{
          width: `calc(${progress * 100}% - 0px)`,
          transition: dragging.current || reduced ? undefined : 'width 200ms ease',
        }}
        aria-hidden
      />
      <span
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative z-10 flex h-10 w-10 cursor-grab items-center justify-center rounded-full bg-white text-zinc-900 shadow active:cursor-grabbing"
        style={{
          transform: `translateX(${progress * 212}px)`,
          transition: dragging.current || reduced ? undefined : 'transform 220ms ease',
        }}
        aria-hidden
      >
        →
      </span>
    </div>
  )
}
