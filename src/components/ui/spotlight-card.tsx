import * as React from 'react'
import { cn } from '@/lib/cn'

/** Card with a soft radial spotlight (and lit hairline edge) that tracks the cursor. */
export function SpotlightCard({
  children,
  className,
  spotlightColor = 'rgba(249, 115, 22, 0.16)',
  borderGlow = true,
  size = 360,
  edgeColor = 'rgba(249, 115, 22, 0.7)',
}: {
  children: React.ReactNode
  className?: string
  spotlightColor?: string
  /** Also light the 1px edge nearest the pointer. */
  borderGlow?: boolean
  /** Spotlight radius in px. */
  size?: number
  /** Colour of the lit edge (used when `borderGlow`). */
  edgeColor?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  const setPos = (x: number, y: number) => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--sx', `${x}px`)
    el.style.setProperty('--sy', `${y}px`)
  }

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const r = ref.current!.getBoundingClientRect()
    setPos(e.clientX - r.left, e.clientY - r.top)
  }

  const onFocus = () => {
    const el = ref.current
    if (el) setPos(el.offsetWidth / 2, 0)
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onFocus={onFocus}
      style={{ ['--sc' as string]: spotlightColor, ['--ss' as string]: `${size}px` }}
      className={cn(
        'group/spot relative isolate overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-zinc-950/[0.07] shadow-[0_1px_2px_rgba(15,15,20,0.04),0_8px_24px_-12px_rgba(15,15,20,0.14)] dark:bg-zinc-950 dark:ring-white/[0.08] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100 group-has-[:focus-visible]/spot:opacity-100"
        style={{ background: 'radial-gradient(var(--ss) circle at var(--sx, 50%) var(--sy, 0px), var(--sc), transparent 60%)' }}
      />
      {borderGlow && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] p-px opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100 group-has-[:focus-visible]/spot:opacity-100"
          style={{
            background:
              `radial-gradient(calc(var(--ss) * 0.55) circle at var(--sx, 50%) var(--sy, 0px), ${edgeColor}, transparent 70%)`,
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            mask: 'linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)',
          }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  )
}
