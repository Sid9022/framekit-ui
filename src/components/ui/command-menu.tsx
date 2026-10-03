import * as React from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { CornerDownLeft, Search } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type CommandItem = {
  id: string
  label: string
  group?: string
  hint?: string
  keywords?: string[]
  /** Key caps shown on the right, e.g. ['G', 'H']. */
  shortcut?: string[]
  icon?: React.ReactNode
  onSelect?: () => void
}

export type CommandMenuProps = {
  items?: CommandItem[]
  /** Trigger chip label. */
  triggerLabel?: string
  placeholder?: string
  /** Letter used with ⌘ / Ctrl to toggle the palette. Set to '' to disable the hotkey. */
  hotkey?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onSelect?: (item: CommandItem) => void
  className?: string
}

const DEFAULT_ITEMS: CommandItem[] = [
  { id: 'home', label: 'Go to Home', group: 'Navigate', keywords: ['start', 'top'], shortcut: ['G', 'H'] },
  { id: 'work', label: 'Selected work', group: 'Navigate', keywords: ['projects', 'portfolio', 'case studies'], shortcut: ['G', 'W'] },
  { id: 'about', label: 'About me', group: 'Navigate', keywords: ['bio', 'story'], shortcut: ['G', 'A'] },
  { id: 'writing', label: 'Writing & notes', group: 'Navigate', keywords: ['blog', 'articles'] },
  { id: 'p1', label: 'Fieldnotes for Trails', group: 'Projects', hint: 'case study', keywords: ['pwa', 'offline'] },
  { id: 'p2', label: 'Quill Pricing Lab', group: 'Projects', hint: 'case study', keywords: ['saas', 'stripe'] },
  { id: 'copy', label: 'Copy email address', group: 'Actions', keywords: ['mail', 'contact'], shortcut: ['C'] },
  { id: 'theme', label: 'Toggle theme', group: 'Actions', keywords: ['dark', 'light', 'mode'], shortcut: ['T'] },
  { id: 'cv', label: 'Download résumé', group: 'Actions', hint: 'PDF', keywords: ['cv'] },
  { id: 'gh', label: 'Open GitHub', group: 'Elsewhere', hint: 'external', keywords: ['code', 'repo'] },
]

/** Subsequence fuzzy score (higher is better) plus matched indices for highlighting; null = no match. */
function fuzzy(query: string, text: string): { score: number; idx: number[] } | null {
  const q = query.toLowerCase(), t = text.toLowerCase()
  if (!q) return { score: 0, idx: [] }
  const at = t.indexOf(q)
  if (at >= 0) return { score: 100 - at + (at === 0 ? 20 : 0), idx: Array.from({ length: q.length }, (_, i) => at + i) }
  const idx: number[] = []
  let ti = 0, score = 0, prev = -2
  for (const ch of q) {
    const f = t.indexOf(ch, ti)
    if (f < 0) return null
    idx.push(f); score += f === prev + 1 ? 6 : 1; prev = f; ti = f + 1
  }
  return { score, idx }
}

function Highlight({ text, idx }: { text: string; idx: number[] }) {
  if (!idx.length) return <>{text}</>
  const set = new Set(idx)
  return <>{Array.from(text).map((c, i) => (set.has(i) ? <mark key={i} className="bg-transparent font-semibold text-signal-800 underline decoration-signal-500 decoration-2 underline-offset-2 dark:text-signal-200">{c}</mark> : <span key={i}>{c}</span>))}</>
}

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="inline-grid h-6 min-w-6 place-items-center rounded-md border border-zinc-300 bg-zinc-50 px-1.5 font-mono text-[11px] font-medium text-zinc-700 shadow-[0_1px_0_rgb(0_0_0/0.08)] dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200">{children}</kbd>
)

/**
 * Command Menu — a ⌘K / Ctrl+K palette for jumping around a portfolio: fuzzy search with highlighted letters, grouped
 * results, a highlight pill that springs between rows and full combobox semantics. Opens from its own trigger chip.
 */
export function CommandMenu({ items = DEFAULT_ITEMS, triggerLabel = 'Search or jump to…', placeholder = 'Type a command or search…', hotkey = 'k', open, defaultOpen = false, onOpenChange, onSelect, className }: CommandMenuProps) {
  const reduced = usePrefersReducedMotion()
  const uid = React.useId()
  const [inner, setInner] = React.useState(defaultOpen)
  const isOpen = open ?? inner
  const setOpen = React.useCallback((v: boolean) => { if (open === undefined) setInner(v); onOpenChange?.(v) }, [open, onOpenChange])
  const [q, setQ] = React.useState('')
  const [active, setActive] = React.useState(0)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)
  const [host, setHost] = React.useState<Element | null>(null)
  const isMac = typeof navigator !== 'undefined' && /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent)

  React.useEffect(() => { setHost(triggerRef.current?.closest('.dark, .light') ?? document.body) }, [])
  React.useEffect(() => {
    if (!hotkey) return
    const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === hotkey.toLowerCase()) { e.preventDefault(); setOpen(!isOpen) } }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [hotkey, isOpen, setOpen])
  React.useEffect(() => { if (isOpen) { setQ(''); setActive(0); requestAnimationFrame(() => inputRef.current?.focus()) } }, [isOpen])

  const results = React.useMemo(() => {
    const rows = items.map((it) => {
      const m = fuzzy(q, it.label)
      const k = q ? Math.max(-1, ...(it.keywords ?? []).map((w) => (fuzzy(q, w)?.score ?? -1) - 30)) : 0
      if (!m && k < 0) return null
      return { it, idx: m?.idx ?? [], score: Math.max(m?.score ?? 0, k) }
    }).filter(Boolean) as { it: CommandItem; idx: number[]; score: number }[]
    if (q) rows.sort((a, b) => b.score - a.score)
    const groups: { name: string; rows: typeof rows }[] = []
    for (const r of rows) {
      const name = q ? 'Results' : r.it.group ?? 'Commands'
      let g = groups.find((x) => x.name === name)
      if (!g) groups.push((g = { name, rows: [] }))
      g.rows.push(r)
    }
    return groups
  }, [items, q])
  const flat = results.flatMap((g) => g.rows)
  React.useEffect(() => setActive((a) => Math.min(a, Math.max(0, flat.length - 1))), [flat.length])
  React.useEffect(() => { listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' }) }, [active])

  const choose = (it: CommandItem) => { it.onSelect?.(); onSelect?.(it); setOpen(false); requestAnimationFrame(() => triggerRef.current?.focus()) }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % Math.max(1, flat.length)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a - 1 + flat.length) % Math.max(1, flat.length)) }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0) }
    else if (e.key === 'End') { e.preventDefault(); setActive(flat.length - 1) }
    else if (e.key === 'Enter') { e.preventDefault(); if (flat[active]) choose(flat[active].it) }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false); requestAnimationFrame(() => triggerRef.current?.focus()) }
    else if (e.key === 'Tab') e.preventDefault()
  }

  let n = -1
  return (
    <>
      <button ref={triggerRef} type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={isOpen} className={cn('group inline-flex min-h-11 w-full max-w-sm items-center gap-3 rounded-full border border-zinc-300 bg-white py-2 pl-4 pr-2.5 text-left text-sm text-zinc-700 shadow-sm outline-none transition-[border-color,box-shadow] hover:border-zinc-400 hover:shadow-md focus-visible:ring-2 focus-visible:ring-signal-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-500 dark:focus-visible:ring-signal-300', className)}>
        <Search className="size-4 shrink-0 text-zinc-600 dark:text-zinc-400" aria-hidden />
        <span className="flex-1 truncate">{triggerLabel}</span>
        {hotkey && <span className="hidden items-center gap-1 sm:flex" aria-hidden><Kbd>{isMac ? '⌘' : 'Ctrl'}</Kbd><Kbd>{hotkey.toUpperCase()}</Kbd></span>}
        {hotkey && <span className="sr-only">Shortcut: {isMac ? 'Command' : 'Control'} {hotkey.toUpperCase()}</span>}
      </button>
      {host && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[70] flex items-start justify-center px-3 pt-[12vh] sm:pt-[16vh]">
              <motion.div className="absolute inset-0 bg-zinc-950/45 backdrop-blur-[3px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
              <motion.div
                role="dialog" aria-modal="true" aria-label="Command menu"
                className="relative flex max-h-[min(30rem,70vh)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white text-zinc-950 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.55)] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: -12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -8 }}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                onKeyDown={onKey}
              >
                <div className="flex items-center gap-3 border-b border-zinc-200 px-4 dark:border-zinc-800">
                  <Search className="size-[18px] shrink-0 text-zinc-600 dark:text-zinc-400" aria-hidden />
                  <input
                    ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); setActive(0) }} placeholder={placeholder} aria-label="Search commands"
                    role="combobox" aria-expanded="true" aria-controls={`${uid}-list`} aria-autocomplete="list" aria-activedescendant={flat[active] ? `${uid}-${flat[active].it.id}` : undefined}
                    className="h-14 flex-1 bg-transparent text-base text-zinc-950 outline-none placeholder:text-zinc-600 dark:text-zinc-50 dark:placeholder:text-zinc-400"
                  />
                  <Kbd>Esc</Kbd>
                </div>
                <div ref={listRef} id={`${uid}-list`} role="listbox" aria-label="Results" className="framekit-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
                  <LayoutGroup id={uid}>
                    {flat.length === 0 && <p className="px-3 py-10 text-center text-sm text-zinc-700 dark:text-zinc-300">No matches for &ldquo;{q}&rdquo;. Try &ldquo;work&rdquo; or &ldquo;mail&rdquo;.</p>}
                    {results.map((g) => (
                      <div key={g.name} role="group" aria-label={g.name} className="mb-1">
                        <p aria-hidden className="px-3 pb-1 pt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-400">{g.name}</p>
                        {g.rows.map(({ it, idx }) => {
                          n++
                          const i = n, on = i === active
                          return (
                            <div key={it.id} id={`${uid}-${it.id}`} data-index={i} role="option" aria-selected={on} onPointerMove={() => setActive(i)} onClick={() => choose(it)} className="relative flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 text-sm">
                              {on && <motion.span layoutId="cmd-pill" aria-hidden className="absolute inset-0 rounded-xl bg-zinc-100 dark:bg-zinc-800" transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 38 }} />}
                              <span className="relative flex flex-1 items-center gap-3">
                                <span aria-hidden className={cn('grid size-7 place-items-center rounded-lg border text-zinc-700 dark:text-zinc-300', on ? 'border-signal-400 bg-white dark:border-signal-500 dark:bg-zinc-900' : 'border-zinc-200 dark:border-zinc-700')}>{it.icon ?? <span className="size-1.5 rounded-full bg-current" />}</span>
                                <span className="truncate"><Highlight text={it.label} idx={idx} /></span>
                                {it.hint && <span className="truncate text-xs text-zinc-600 dark:text-zinc-400">{it.hint}</span>}
                              </span>
                              {it.shortcut && <span aria-hidden className="relative hidden items-center gap-1 sm:flex">{it.shortcut.map((k) => <Kbd key={k}>{k}</Kbd>)}</span>}
                              {on && <CornerDownLeft aria-hidden className="relative size-4 text-zinc-600 sm:hidden dark:text-zinc-400" />}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </LayoutGroup>
                </div>
                <div aria-hidden className="hidden items-center gap-4 border-t border-zinc-200 px-4 py-2.5 text-xs text-zinc-600 sm:flex dark:border-zinc-800 dark:text-zinc-400">
                  <span className="flex items-center gap-1.5"><Kbd>↑</Kbd><Kbd>↓</Kbd> navigate</span>
                  <span className="flex items-center gap-1.5"><Kbd>↵</Kbd> select</span>
                  <span className="ml-auto">{flat.length} {flat.length === 1 ? 'result' : 'results'}</span>
                </div>
                <p role="status" aria-live="polite" className="sr-only">{flat.length} {flat.length === 1 ? 'result' : 'results'}</p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        host,
      )}
    </>
  )
}
