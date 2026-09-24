import * as React from 'react'
import { cn } from '@/lib/cn'

export function DropdownMenu({
  trigger,
  items,
  align = 'start',
}: {
  trigger: React.ReactNode
  items: { label: string; onSelect?: () => void; destructive?: boolean; separator?: boolean }[]
  align?: 'start' | 'end'
}) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <div className="relative inline-flex" ref={ref}>
      <span onClick={() => setOpen((o) => !o)} className="inline-flex">
        {trigger}
      </span>
      {open && (
        <div
          role="menu"
          className={cn(
            'absolute top-full z-50 mt-2 min-w-[180px] overflow-hidden rounded-xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-800 dark:bg-zinc-950',
            align === 'end' ? 'right-0' : 'left-0',
          )}
        >
          {items.map((item, i) =>
            item.separator ? (
              <div key={i} className="my-1 h-px bg-zinc-100 dark:bg-zinc-800" />
            ) : (
              <button
                key={i}
                type="button"
                role="menuitem"
                className={cn(
                  'flex w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-zinc-100 dark:hover:bg-zinc-900',
                  item.destructive && 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40',
                )}
                onClick={() => {
                  item.onSelect?.()
                  setOpen(false)
                }}
              >
                {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  )
}
