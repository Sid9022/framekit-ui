import * as React from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Compact search pill that expands into a typing capsule on focus. */
export function MorphSearchCapsule({
  className,
  placeholder = 'Search components…',
  onSearch,
}: {
  className?: string
  placeholder?: string
  onSearch?: (q: string) => void
}) {
  const reduced = usePrefersReducedMotion()
  const [open, setOpen] = React.useState(false)
  const [q, setQ] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  return (
    <div
      className={cn(
        'relative flex h-11 items-center overflow-hidden rounded-full border border-zinc-200 bg-white shadow-md dark:border-zinc-700 dark:bg-zinc-950',
        className,
      )}
      style={{
        width: open ? 280 : 44,
        transition: reduced ? undefined : 'width 380ms cubic-bezier(.2,.8,.2,1)',
      }}
    >
      <button
        type="button"
        aria-label="Open search"
        className="flex h-11 w-11 shrink-0 items-center justify-center text-zinc-600 dark:text-zinc-300"
        onClick={() => {
          setOpen(true)
          window.setTimeout(() => inputRef.current?.focus(), 50)
        }}
      >
        <Search className="h-4 w-4" />
      </button>
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          onSearch?.(e.target.value)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          if (!q) setOpen(false)
        }}
        placeholder={placeholder}
        className="h-full w-full bg-transparent pr-4 text-sm text-zinc-800 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
        style={{ opacity: open ? 1 : 0, transition: reduced ? undefined : 'opacity 200ms' }}
      />
    </div>
  )
}
