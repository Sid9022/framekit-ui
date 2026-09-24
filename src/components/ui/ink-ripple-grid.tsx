import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Ripple = { id: number; x: number; y: number }

/** Clickable grid that blooms ink-like ripples from the pointer. */
export function InkRippleGrid({
  className,
  cols = 10,
  rows = 6,
}: {
  className?: string
  cols?: number
  rows?: number
}) {
  const [ripples, setRipples] = React.useState<Ripple[]>([])
  const id = React.useRef(0)
  const reduced = usePrefersReducedMotion()

  const spawn = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const next = { id: id.current++, x: e.clientX - r.left, y: e.clientY - r.top }
    setRipples((prev) => [...prev, next])
    window.setTimeout(() => setRipples((prev) => prev.filter((x) => x.id !== next.id)), 900)
  }

  return (
    <div
      role="presentation"
      onClick={spawn}
      className={cn(
        'relative h-48 cursor-crosshair overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950',
        className,
      )}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(161 161 170 / 0.35) 1px, transparent 1px), linear-gradient(to bottom, rgb(161 161 170 / 0.35) 1px, transparent 1px)',
          backgroundSize: `calc(100% / ${cols}) calc(100% / ${rows})`,
        }}
      />
      {ripples.map((r) => (
        <span
          key={r.id}
          className={cn(
            'pointer-events-none absolute rounded-full bg-framekit-500/30 ring-2 ring-framekit-400/40',
            !reduced && 'animate-[ink_0.85s_ease-out_forwards]',
          )}
          style={{
            left: r.x,
            top: r.y,
            width: 12,
            height: 12,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      <p className="relative z-10 flex h-full items-center justify-center text-xs text-zinc-500">
        Click to spill ink
      </p>
      <style>{`
        @keyframes ink {
          0% { width: 12px; height: 12px; opacity: 0.8; }
          100% { width: 220px; height: 220px; opacity: 0; }
        }
      `}</style>
    </div>
  )
}
