import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Folded translucent ribbon plane; scroll/pointer shifts the fold origin. */
export function PaperfoldGradientPlane({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const [fold, setFold] = React.useState({ x: 50, y: 40 })

  return (
    <div
      ref={ref}
      className={cn('relative overflow-hidden rounded-2xl bg-[#f3f1ec]', className)}
      onPointerMove={(e) => {
        if (reduced) return
        const r = e.currentTarget.getBoundingClientRect()
        setFold({
          x: ((e.clientX - r.left) / r.width) * 100,
          y: ((e.clientY - r.top) / r.height) * 100,
        })
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="pointer-events-none absolute inset-[-20%] opacity-80"
          style={{
            background: [
              'linear-gradient(115deg, #d4cbe5 0%, transparent 55%)',
              'linear-gradient(200deg, #f0d5e8 0%, transparent 50%)',
              'linear-gradient(25deg, #c9dff2 0%, transparent 45%)',
              'linear-gradient(160deg, #ffe3c9 0%, transparent 40%)',
            ][i],
            transform: reduced
              ? `rotate(${i * 4}deg)`
              : `rotate(${i * 4 + (fold.x - 50) * 0.04}deg) translate(${(fold.x - 50) * (0.1 + i * 0.05)}px, ${(fold.y - 50) * (0.08 + i * 0.03)}px)`,
            clipPath: `polygon(${8 + i * 2}% ${12 + i}%, ${92 - i}% ${6 + i * 3}%, ${96 - i}% ${88 - i * 2}%, ${4 + i}% ${94 - i * 3}%)`,
            filter: 'blur(0.2px)',
            transition: reduced ? undefined : 'transform 180ms ease-out',
          }}
        />
      ))}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent, transparent 11px, rgba(0,0,0,0.03) 12px)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
