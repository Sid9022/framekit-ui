import * as React from 'react'
import { cn } from '@/lib/cn'

/** Compact action whose focus/hover bloom is steered by pointer position. */
export function FocusBloomButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = React.useRef<HTMLButtonElement>(null)
  const [pos, setPos] = React.useState({ x: 50, y: 50 })
  const [active, setActive] = React.useState(false)

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'relative isolate overflow-hidden rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus-visible:ring-signal-300',
        className,
      )}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        setPos({
          x: ((e.clientX - r.left) / r.width) * 100,
          y: ((e.clientY - r.top) / r.height) * 100,
        })
      }}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      {...props}
    >
      <span
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-300"
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(120px circle at ${pos.x}% ${pos.y}%, rgba(212,203,229,0.85), transparent 55%)`,
        }}
      />
      <span className="relative z-10">{children}</span>
    </button>
  )
}
