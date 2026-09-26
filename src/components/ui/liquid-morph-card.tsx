import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Border/blob morphs toward pointer. */
export function LiquidMorphCard({
  className,
  title = 'Liquid Morph',
  body = 'The blob border leans toward your pointer.',
  children,
}: {
  className?: string
  title?: string
  body?: string
  children?: React.ReactNode
}) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const [p, setP] = React.useState({ x: 0.5, y: 0.5 })

  const onMove = (e: React.MouseEvent) => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setP({
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top) / r.height,
    })
  }

  const r1 = 40 + p.x * 30
  const r2 = 55 - p.y * 25
  const r3 = 35 + p.y * 35
  const r4 = 50 - p.x * 20
  const radius = `${r1}% ${100 - r1}% ${r2}% ${100 - r2}% / ${r3}% ${r4}% ${100 - r4}% ${100 - r3}%`

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setP({ x: 0.5, y: 0.5 })}
      className={cn('relative max-w-sm p-[2px] transition-[border-radius] duration-200', className)}
      style={{
        borderRadius: radius,
        background: 'linear-gradient(135deg, #f97316, #9a86b8, #fdba74)',
      }}
    >
      <div
        className="relative overflow-hidden bg-white p-6 dark:bg-zinc-950"
        style={{ borderRadius: radius }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -z-0 h-32 w-32 rounded-full bg-signal-300/30 blur-2xl dark:bg-signal-500/20"
          style={{
            left: `${p.x * 100}%`,
            top: `${p.y * 100}%`,
            transform: 'translate(-50%, -50%)',
            transition: reduced ? undefined : 'left 120ms linear, top 120ms linear',
          }}
        />
        <div className="relative z-10">
          {children ?? (
            <>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Card</p>
              <h3 className="mt-1 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-zinc-500">{body}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
