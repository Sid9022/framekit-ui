import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

const ITEMS = [
  { id: 'work', label: 'Work', body: 'Selected case studies and launches.' },
  { id: 'studio', label: 'Studio', body: 'People, process, and principles.' },
  { id: 'journal', label: 'Journal', body: 'Notes from the studio floor.' },
]

/** Top bar whose panels drop like a curtain on hover/focus. */
export function CurtainDropNav({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [open, setOpen] = React.useState<string | null>(null)

  return (
    <div className={cn('w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950', className)}>
      <nav className="flex items-center gap-1 border-b border-zinc-100 px-3 py-2 dark:border-zinc-900" aria-label="Curtain navigation">
        <span className="mr-3 text-xs font-semibold tracking-tight">Framekit</span>
        {ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={cn(
              'rounded-full px-3 py-1.5 text-sm transition',
              open === item.id ? 'bg-signal-100 text-zinc-900 dark:bg-signal-900/40 dark:text-signal-100' : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900',
            )}
            aria-expanded={open === item.id}
            onMouseEnter={() => setOpen(item.id)}
            onFocus={() => setOpen(item.id)}
            onClick={() => setOpen((o) => (o === item.id ? null : item.id))}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="relative h-28 overflow-hidden bg-zinc-50 dark:bg-zinc-900/40">
        {ITEMS.map((item) => (
          <div
            key={item.id}
            className="absolute inset-0 flex flex-col justify-center px-6"
            style={{
              transform: open === item.id ? 'translateY(0)' : 'translateY(-105%)',
              transition: reduced ? undefined : 'transform 420ms cubic-bezier(.2,.8,.2,1)',
              background:
                'linear-gradient(180deg, rgba(212,203,229,0.35), transparent 60%), white',
            }}
            aria-hidden={open !== item.id}
          >
            <p className="text-sm font-semibold">{item.label}</p>
            <p className="mt-1 text-sm text-zinc-500">{item.body}</p>
          </div>
        ))}
        {!open && (
          <p className="flex h-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
            Hover a tab — curtain drops
          </p>
        )}
      </div>
    </div>
  )
}
