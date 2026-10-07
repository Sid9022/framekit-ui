import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowDown, ArrowUp, ChevronsUpDown, Search, SearchX, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type TableStatus = 'ready' | 'building' | 'error' | 'canceled'
export type TableRow = { id: string; name: string; branch: string; status: TableStatus; duration: number; author: string; ago: number }
type SortKey = 'name' | 'status' | 'duration' | 'ago'

export type SortableDataTableProps = {
  rows?: TableRow[]
  /** Show skeleton rows that mirror the final layout. */
  loading?: boolean
  /** Fires when the row selection changes. */
  onSelectionChange?: (ids: string[]) => void
  /** Accessible caption. */
  caption?: string
  className?: string
}

export const DEFAULT_TABLE_ROWS: TableRow[] = [
  { id: 'd1', name: 'checkout-v2', branch: 'main', status: 'ready', duration: 48, author: 'Amara Osei', ago: 4 },
  { id: 'd2', name: 'search-reindex', branch: 'feat/typo-tolerance', status: 'building', duration: 31, author: 'Teo Marin', ago: 1 },
  { id: 'd3', name: 'marketing-site', branch: 'main', status: 'ready', duration: 72, author: 'Iris Park', ago: 26 },
  { id: 'd4', name: 'billing-worker', branch: 'fix/proration', status: 'error', duration: 19, author: 'Kenji Mori', ago: 12 },
  { id: 'd5', name: 'docs', branch: 'chore/links', status: 'ready', duration: 55, author: 'Lena Vogt', ago: 90 },
  { id: 'd6', name: 'image-proxy', branch: 'perf/avif', status: 'canceled', duration: 8, author: 'Sam Adeyemi', ago: 140 },
  { id: 'd7', name: 'dashboard', branch: 'main', status: 'ready', duration: 96, author: 'Noor Haddad', ago: 300 },
]

const STATUS: Record<TableStatus, { label: string; dot: string; text: string }> = {
  ready: { label: 'Ready', dot: 'bg-emerald-500', text: 'text-emerald-800 dark:text-emerald-300' },
  building: { label: 'Building', dot: 'bg-sky-500 animate-pulse motion-reduce:animate-none', text: 'text-sky-800 dark:text-sky-300' },
  error: { label: 'Error', dot: 'bg-rose-500', text: 'text-rose-700 dark:text-rose-300' },
  canceled: { label: 'Canceled', dot: 'bg-zinc-400', text: 'text-zinc-600 dark:text-zinc-400' },
}
const ago = (m: number) => (m < 60 ? `${m}m ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`)
const FOCUS = 'outline-none focus-visible:ring-2 focus-visible:ring-signal-600 dark:focus-visible:ring-signal-300'

/**
 * Sortable Data Table — a dense, quiet deployments table in the dashboard
 * idiom: sortable headers with `aria-sort`, a search field and status filter
 * chips, rows that glide to their new order on sort, hover and selected row
 * states in hairline tints, a bulk-action bar that springs up when rows are
 * selected, and designed loading and empty states. Scrolls inside itself on
 * narrow screens; numbers are tabular.
 */
export function SortableDataTable({ rows = DEFAULT_TABLE_ROWS, loading = false, onSelectionChange, caption = 'Recent deployments', className }: SortableDataTableProps) {
  const reduced = usePrefersReducedMotion()
  const [sort, setSort] = React.useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'ago', dir: 1 })
  const [q, setQ] = React.useState('')
  const [filter, setFilter] = React.useState<TableStatus | 'all'>('all')
  const [sel, setSel] = React.useState<Set<string>>(new Set())
  const [msg, setMsg] = React.useState('')

  const view = React.useMemo(() => {
    const ql = q.trim().toLowerCase()
    const out = rows.filter((r) => (filter === 'all' || r.status === filter) && (!ql || `${r.name} ${r.branch} ${r.author}`.toLowerCase().includes(ql)))
    return out.sort((a, b) => {
      const av = a[sort.key], bv = b[sort.key]
      return (typeof av === 'number' ? av - (bv as number) : String(av).localeCompare(String(bv))) * sort.dir
    })
  }, [rows, q, filter, sort])

  const updateSel = (next: Set<string>) => { setSel(next); onSelectionChange?.([...next]) }
  const toggle = (id: string) => { const n = new Set(sel); if (n.has(id)) n.delete(id); else n.add(id); updateSel(n) }
  const allSel = view.length > 0 && view.every((r) => sel.has(r.id))
  const someSel = view.some((r) => sel.has(r.id))
  const headerBox = React.useRef<HTMLInputElement>(null)
  React.useEffect(() => { if (headerBox.current) headerBox.current.indeterminate = someSel && !allSel }, [someSel, allSel])

  const sortBy = (key: SortKey) => {
    const dir = sort.key === key ? (sort.dir === 1 ? -1 : 1) : 1
    setSort({ key, dir })
    setMsg(`Sorted by ${key === 'ago' ? 'age' : key}, ${dir === 1 ? 'ascending' : 'descending'}`)
  }

  const th = (k: SortKey, label: string, c?: string) => {
    const active = sort.key === k
    return (
      <th key={k} scope="col" aria-sort={active ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'} className={cn('px-3 py-0 text-left font-medium', c)}>
        <button type="button" onClick={() => sortBy(k)} className={cn('-mx-1.5 inline-flex h-8 items-center gap-1 rounded-[6px] px-1.5 text-xs transition-colors duration-150', active ? 'text-zinc-950 dark:text-white' : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white', FOCUS)}>
          {label}
          {active ? (sort.dir === 1 ? <ArrowUp aria-hidden className="size-3.5" /> : <ArrowDown aria-hidden className="size-3.5" />) : <ChevronsUpDown aria-hidden className="size-3.5 opacity-60" />}
        </button>
      </th>
    )
  }

  const chips: (TableStatus | 'all')[] = ['all', 'ready', 'building', 'error', 'canceled']
  const count = (s: TableStatus | 'all') => rows.filter((r) => s === 'all' || r.status === s).length

  return (
    <div className={cn('relative w-full max-w-3xl overflow-hidden rounded-[20px] bg-white ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgb(0_0_0/0.05),0_8px_24px_-12px_rgb(0_0_0/0.18)] dark:bg-zinc-900 dark:ring-white/[0.08] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]', className)}>
      <div className="flex flex-col gap-3 border-b border-black/[0.06] p-3 sm:flex-row sm:items-center dark:border-white/[0.08]">
        <label className="relative flex min-w-0 flex-1 items-center">
          <span className="sr-only">Search deployments</span>
          <Search aria-hidden className="pointer-events-none absolute left-3 size-4 text-zinc-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects, branches, people…"
            className="h-10 w-full rounded-[10px] bg-zinc-900/[0.04] pl-9 pr-9 text-base text-zinc-950 placeholder:text-zinc-500 outline-none ring-1 ring-transparent transition-shadow duration-150 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-signal-600 sm:text-sm dark:bg-white/[0.06] dark:text-white dark:focus-visible:bg-zinc-950 dark:focus-visible:ring-signal-300"
          />
          {q && <button type="button" onClick={() => setQ('')} aria-label="Clear search" className={cn('absolute right-1.5 grid size-7 place-items-center rounded-full text-zinc-600 hover:bg-zinc-900/[0.06] dark:text-zinc-400 dark:hover:bg-white/[0.08]', FOCUS)}><X aria-hidden className="size-3.5" /></button>}
        </label>
        <div role="group" aria-label="Filter by status" className="-mx-1 flex gap-1 overflow-x-auto px-1 [scrollbar-width:none]">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
              className={cn('inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium transition-colors duration-150 pointer-coarse:h-11', filter === c ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950' : 'text-zinc-700 ring-1 ring-black/[0.08] hover:text-zinc-950 hover:ring-black/[0.16] dark:text-zinc-300 dark:ring-white/[0.1] dark:hover:text-white', FOCUS)}
            >
              {c === 'all' ? 'All' : STATUS[c].label}
              <span className={cn('tabular-nums text-xs', filter === c ? 'opacity-70' : 'text-zinc-600 dark:text-zinc-400')}>{count(c)}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="h-10 border-b border-black/[0.06] dark:border-white/[0.08]">
              <th scope="col" className="w-10 pl-4 pr-1">
                <input ref={headerBox} type="checkbox" aria-label="Select all visible rows" checked={allSel} onChange={() => { const n = new Set(sel); view.forEach((r) => (allSel ? n.delete(r.id) : n.add(r.id))); updateSel(n) }} className={cn('size-4 accent-signal-600 dark:accent-signal-300', FOCUS)} disabled={loading || !view.length} />
              </th>
              {th('name', 'Project')}
              {th('status', 'Status')}
              {th('duration', 'Build', 'text-right')}
              <th scope="col" className="px-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400">Author</th>
              {th('ago', 'Age', 'pr-4')}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }, (_, i) => (
                  <tr key={i} className="h-14 border-b border-black/[0.04] last:border-0 dark:border-white/[0.06]">
                    <td className="pl-4"><span className="block size-4 rounded bg-zinc-200 dark:bg-zinc-800" /></td>
                    {[40, 20, 10, 24, 12].map((w, j) => <td key={j} className="px-3"><span className="block h-3.5 animate-pulse rounded bg-zinc-200 motion-reduce:animate-none dark:bg-zinc-800" style={{ width: `${w * 3}px`, animationDelay: `${(i + j) * 60}ms` }} /></td>)}
                  </tr>
                ))
              : (
                <AnimatePresence initial={false}>
                  {view.map((r) => {
                    const s = STATUS[r.status]
                    const isSel = sel.has(r.id)
                    return (
                      <motion.tr
                        key={r.id}
                        layout={reduced ? false : 'position'}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={reduced ? { duration: 0.12 } : { type: 'spring', stiffness: 460, damping: 40 }}
                        aria-selected={isSel}
                        className={cn('h-14 border-b border-black/[0.04] transition-colors duration-150 last:border-0 dark:border-white/[0.06]', isSel ? 'bg-signal-50 dark:bg-signal-300/[0.08]' : 'hover:bg-zinc-900/[0.025] dark:hover:bg-white/[0.03]')}
                      >
                        <td className="pl-4 pr-1"><input type="checkbox" aria-label={`Select ${r.name}`} checked={isSel} onChange={() => toggle(r.id)} className={cn('size-4 accent-signal-600 dark:accent-signal-300', FOCUS)} /></td>
                        <td className="max-w-0 px-3">
                          <div className="truncate font-medium text-zinc-950 dark:text-zinc-50" translate="no">{r.name}</div>
                          <div className="truncate font-mono text-xs text-zinc-600 dark:text-zinc-400" translate="no">{r.branch}</div>
                        </td>
                        <td className="px-3"><span className={cn('inline-flex items-center gap-1.5 text-[13px] font-medium', s.text)}><span aria-hidden className={cn('size-2 rounded-full', s.dot)} />{s.label}</span></td>
                        <td className="px-3 text-right font-mono text-[13px] tabular-nums text-zinc-700 dark:text-zinc-300">{r.duration}s</td>
                        <td className="px-3 text-[13px] text-zinc-700 dark:text-zinc-300"><span className="inline-flex items-center gap-2"><span aria-hidden className="grid size-6 place-items-center rounded-full bg-zinc-900/[0.06] text-[11px] font-semibold text-zinc-700 dark:bg-white/[0.1] dark:text-zinc-200">{r.author.split(' ').map((p) => p[0]).join('')}</span>{r.author}</span></td>
                        <td className="pr-4 pl-3 text-[13px] tabular-nums text-zinc-600 dark:text-zinc-400">{ago(r.ago)}</td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              )}
          </tbody>
        </table>
        {!loading && view.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
            <span className="grid size-10 place-items-center rounded-full bg-zinc-900/[0.05] dark:bg-white/[0.08]"><SearchX aria-hidden className="size-5 text-zinc-600 dark:text-zinc-400" /></span>
            <p className="text-sm font-medium text-zinc-950 dark:text-white">No deployments match</p>
            <p className="text-[13px] text-zinc-600 dark:text-zinc-400">Try a different search or clear the status filter.</p>
            <button type="button" onClick={() => { setQ(''); setFilter('all') }} className={cn('mt-2 min-h-9 rounded-[10px] px-3 text-[13px] font-medium text-zinc-900 ring-1 ring-black/[0.1] hover:bg-zinc-900/[0.04] dark:text-white dark:ring-white/[0.14] dark:hover:bg-white/[0.06]', FOCUS)}>Clear filters</button>
          </div>
        )}
      </div>
      <AnimatePresence>
        {sel.size > 0 && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={reduced ? { duration: 0.15 } : { type: 'spring', stiffness: 420, damping: 32 }}
            className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-[14px] bg-zinc-950 py-2 pl-4 pr-2 text-sm text-white shadow-[0_2px_6px_rgb(0_0_0/0.15),0_24px_48px_-16px_rgb(0_0_0/0.5)] ring-1 ring-white/10 dark:bg-zinc-800"
          >
            <span className="tabular-nums">{sel.size} selected</span>
            <span className="flex gap-1">
              <button type="button" onClick={() => { setMsg(`Redeploying ${sel.size} projects`); updateSel(new Set()) }} className="min-h-9 rounded-[10px] bg-white px-3 text-[13px] font-medium text-zinc-950 outline-none hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-signal-300 active:scale-[0.97]">Redeploy</button>
              <button type="button" onClick={() => updateSel(new Set())} className="min-h-9 rounded-[10px] px-3 text-[13px] font-medium text-zinc-200 outline-none hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-signal-300">Clear</button>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <span role="status" aria-live="polite" className="sr-only">{msg || (q || filter !== 'all' ? `${view.length} results` : '')}</span>
    </div>
  )
}
