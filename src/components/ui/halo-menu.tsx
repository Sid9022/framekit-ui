import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Center action opens a 6-item halo; pointer angle lights wedges; arrow keys roam. */
export function HaloMenu({
  items,
  className,
}: {
  items: { id: string; label: string; onSelect?: () => void }[]
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const [open, setOpen] = React.useState(false)
  const [focus, setFocus] = React.useState(0)
  const [hot, setHot] = React.useState(-1)
  const count = Math.min(6, items.length)

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        setFocus((f) => (f + 1) % count)
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        setFocus((f) => (f - 1 + count) % count)
      }
      if (e.key === 'Enter') items[focus]?.onSelect?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, focus, count, items])

  return (
    <div className={cn('relative mx-auto flex h-56 w-56 items-center justify-center', className)}>
      {/* mobile linear fallback */}
      <div className="absolute inset-x-0 top-0 flex justify-center gap-1 sm:hidden">
        {open &&
          items.slice(0, count).map((item) => (
            <button
              key={item.id}
              type="button"
              className="rounded-full border border-zinc-200 bg-white px-2 py-1 text-[10px] dark:border-zinc-700 dark:bg-zinc-900"
              onClick={() => item.onSelect?.()}
            >
              {item.label}
            </button>
          ))}
      </div>

      {open &&
        items.slice(0, count).map((item, i) => {
          const a = (i / count) * Math.PI * 2 - Math.PI / 2
          const r = reduced ? 0 : 78
          const x = Math.cos(a) * r
          const y = Math.sin(a) * r
          const active = hot === i || focus === i
          return (
            <button
              key={item.id}
              type="button"
              tabIndex={open ? 0 : -1}
              onMouseEnter={() => setHot(i)}
              onFocus={() => setFocus(i)}
              onClick={() => item.onSelect?.()}
              className={cn(
                'absolute left-1/2 top-1/2 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[10px] font-medium shadow-sm transition sm:flex',
                active
                  ? 'border-signal-400 bg-signal-200 text-zinc-900'
                  : 'border-zinc-200 bg-white text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300',
              )}
              style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
            >
              {item.label}
            </button>
          )
        })}

      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 text-sm font-semibold text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900"
      >
        {open ? 'Close' : 'Menu'}
      </button>
    </div>
  )
}
