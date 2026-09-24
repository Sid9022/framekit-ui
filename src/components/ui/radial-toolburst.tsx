import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { Pen, Eraser, Move, Type, Image as ImageIcon, Sparkles } from 'lucide-react'

const TOOLS = [
  { id: 'pen', icon: Pen, label: 'Pen' },
  { id: 'erase', icon: Eraser, label: 'Erase' },
  { id: 'move', icon: Move, label: 'Move' },
  { id: 'type', icon: Type, label: 'Type' },
  { id: 'image', icon: ImageIcon, label: 'Image' },
  { id: 'fx', icon: Sparkles, label: 'FX' },
]

/** Center trigger bursts tools onto a ring — distinct from Halo Menu wedges. */
export function RadialToolburst({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [open, setOpen] = React.useState(false)
  const [focus, setFocus] = React.useState(0)

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        setFocus((f) => (f + 1) % TOOLS.length)
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        setFocus((f) => (f - 1 + TOOLS.length) % TOOLS.length)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className={cn('relative mx-auto flex h-56 w-56 items-center justify-center', className)}>
      {TOOLS.map((tool, i) => {
        const angle = (i / TOOLS.length) * Math.PI * 2 - Math.PI / 2
        const r = open ? 78 : 0
        const x = Math.cos(angle) * r
        const y = Math.sin(angle) * r
        const Icon = tool.icon
        return (
          <button
            key={tool.id}
            type="button"
            aria-label={tool.label}
            tabIndex={open ? 0 : -1}
            className={cn(
              'absolute flex h-10 w-10 items-center justify-center rounded-2xl border bg-white shadow-md dark:bg-zinc-900',
              focus === i && open ? 'border-signal-400 ring-2 ring-signal-200' : 'border-zinc-200 dark:border-zinc-700',
            )}
            style={{
              transform: `translate(${x}px, ${y}px) scale(${open ? 1 : 0.4})`,
              opacity: open ? 1 : 0,
              transition: reduced ? undefined : `transform 420ms cubic-bezier(.2,.8,.2,1) ${i * 30}ms, opacity 200ms`,
            }}
            onClick={() => setFocus(i)}
          >
            <Icon className="h-4 w-4" />
          </button>
        )
      })}
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? 'Close tools' : 'Open tools'}
        onClick={() => setOpen((o) => !o)}
        className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 text-lg font-semibold text-white shadow-xl dark:bg-zinc-100 dark:text-zinc-900"
      >
        {open ? '×' : '+'}
      </button>
    </div>
  )
}
