import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { DOCS } from '@/docs/registry'
import { cn } from '@/lib/cn'

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const [q, setQ] = React.useState('')
  const [active, setActive] = React.useState(0)
  const navigate = useNavigate()
  const inputRef = React.useRef<HTMLInputElement>(null)

  const results = React.useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return DOCS.slice(0, 14)
    return DOCS.filter(
      (d) =>
        d.title.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query) ||
        d.slug.includes(query),
    )
  }, [q])

  React.useEffect(() => {
    if (open) {
      setQ('')
      setActive(0)
      window.setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onOpenChange(!open)
      }
      if (e.key === 'Escape') onOpenChange(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  if (!open) return null

  const go = (slug: string) => {
    navigate(`/docs/${slug}`)
    onOpenChange(false)
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-black/50 p-4 pt-[15vh] backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Command palette"
      >
        <div className="flex items-center gap-2 border-b border-zinc-200 px-3 dark:border-zinc-800">
          <Search className="h-4 w-4 text-zinc-400" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setActive(0)
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setActive((i) => Math.min(i + 1, Math.max(results.length - 1, 0)))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setActive((i) => Math.max(i - 1, 0))
              } else if (e.key === 'Enter' && results[active]) {
                go(results[active].slug)
              }
            }}
            placeholder="Search components…"
            className="h-12 w-full bg-transparent text-sm outline-none"
          />
          <kbd className="hidden rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-400 sm:inline dark:border-zinc-700">
            ESC
          </kbd>
        </div>
        <ul className="max-h-80 overflow-auto p-2">
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-zinc-500">No results</li>
          )}
          {results.map((item, i) => (
            <li key={item.slug}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(item.slug)}
                className={cn(
                  'flex w-full flex-col rounded-xl px-3 py-2.5 text-left',
                  i === active
                    ? 'bg-forge-50 text-forge-900 dark:bg-forge-950/50 dark:text-forge-100'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-900',
                )}
              >
                <span className="text-sm font-medium">{item.title}</span>
                <span className="text-xs text-zinc-500">
                  {item.category} · {item.description}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
