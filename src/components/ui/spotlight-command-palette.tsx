import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Search, FileText, Settings, User, Moon, LogOut, Plus, CreditCard, Users, ArrowLeft, CornerDownLeft } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type PaletteItem = { id: string; label: string; group: string; icon?: React.ReactNode; shortcut?: string[]; keywords?: string; children?: PaletteItem[] }

export type SpotlightCommandPaletteProps = {
  items?: PaletteItem[]
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Register the global ⌘K / Ctrl+K hotkey. */
  hotkey?: boolean
  placeholder?: string
  onSelect?: (item: PaletteItem) => void
  /** Show the trigger chip. */
  showTrigger?: boolean
  className?: string
}

export const DEFAULT_PALETTE_ITEMS: PaletteItem[] = [
  { id: 'new', label: 'New project', group: 'Actions', icon: <Plus />, shortcut: ['⌘', 'N'] },
  { id: 'invite', label: 'Invite teammates', group: 'Actions', icon: <Users />, children: [
    { id: 'invite-ana', label: 'Ana Lima', group: 'Teammates', icon: <User /> },
    { id: 'invite-kai', label: 'Kai Ortega', group: 'Teammates', icon: <User /> },
    { id: 'invite-mei', label: 'Mei Tanaka', group: 'Teammates', icon: <User /> },
  ] },
  { id: 'theme', label: 'Toggle theme', group: 'Actions', icon: <Moon />, shortcut: ['⌘', '⇧', 'L'] },
  { id: 'docs', label: 'Getting started', group: 'Documents', icon: <FileText />, keywords: 'docs guide' },
  { id: 'api', label: 'API reference', group: 'Documents', icon: <FileText />, keywords: 'docs endpoints' },
  { id: 'billing', label: 'Billing', group: 'Settings', icon: <CreditCard />, keywords: 'invoice plan' },
  { id: 'prefs', label: 'Preferences', group: 'Settings', icon: <Settings />, shortcut: ['⌘', ','] },
  { id: 'logout', label: 'Log out', group: 'Settings', icon: <LogOut /> },
]

function score(q: string, text: string) {
  if (!q) return 1
  const t = text.toLowerCase(); let i = 0; let s = 0; let last = -2
  for (const ch of q.toLowerCase()) {
    const j = t.indexOf(ch, i)
    if (j < 0) return 0
    s += j === last + 1 ? 3 : 1; last = j; i = j + 1
  }
  return s + (t.startsWith(q.toLowerCase()) ? 5 : 0)
}

/**
 * Spotlight Command Palette — a cmdk-style ⌘K launcher: fuzzy, grouped results,
 * a highlight that springs between rows, nested pages (Backspace to go back),
 * key-cap hints and full combobox/listbox semantics with focus restore.
 */
export function SpotlightCommandPalette({ items = DEFAULT_PALETTE_ITEMS, open, defaultOpen = false, onOpenChange, hotkey = true, placeholder = 'Type a command or search…', onSelect, showTrigger = true, className }: SpotlightCommandPaletteProps) {
  const reduced = usePrefersReducedMotion()
  const [inner, setInner] = React.useState(defaultOpen)
  const isOpen = open ?? inner
  const setOpen = React.useCallback((v: boolean) => { if (open === undefined) setInner(v); onOpenChange?.(v) }, [open, onOpenChange])
  const [q, setQ] = React.useState('')
  const [stack, setStack] = React.useState<PaletteItem[]>([])
  const [active, setActive] = React.useState(0)
  const [last, setLast] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)
  const id = React.useId()

  React.useEffect(() => {
    if (!hotkey) return
    const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen(!isOpen) } }
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h)
  }, [hotkey, isOpen, setOpen])
  const wasOpen = React.useRef(isOpen)
  React.useEffect(() => {
    if (wasOpen.current === isOpen) return
    wasOpen.current = isOpen
    if (isOpen) { setQ(''); setStack([]); setActive(0); requestAnimationFrame(() => inputRef.current?.focus()) }
    else triggerRef.current?.focus({ preventScroll: true } as FocusOptions)
  }, [isOpen])

  const source = stack.length ? stack[stack.length - 1].children ?? [] : items
  const results = React.useMemo(() => source.map((it) => ({ it, s: Math.max(score(q, it.label), score(q, it.keywords ?? '') * 0.5) })).filter((r) => r.s > 0).sort((a, b) => (q ? b.s - a.s : 0)).map((r) => r.it), [source, q])
  const groups = React.useMemo(() => {
    const m = new Map<string, PaletteItem[]>()
    results.forEach((r) => m.set(r.group, [...(m.get(r.group) ?? []), r]))
    return [...m.entries()]
  }, [results])
  const flat = groups.flatMap(([, g]) => g)
  React.useEffect(() => setActive(0), [q, stack.length])
  React.useEffect(() => { listRef.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: 'nearest' }) }, [active])

  const choose = (it: PaletteItem | undefined) => {
    if (!it) return
    if (it.children) { setStack((s) => [...s, it]); setQ(''); return }
    setLast(it.label); onSelect?.(it); setOpen(false)
  }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % Math.max(flat.length, 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a - 1 + flat.length) % Math.max(flat.length, 1)) }
    else if (e.key === 'Enter') { e.preventDefault(); choose(flat[active]) }
    else if (e.key === 'Escape') { e.preventDefault(); if (stack.length) setStack((s) => s.slice(0, -1)); else setOpen(false) }
    else if (e.key === 'Backspace' && !q && stack.length) { e.preventDefault(); setStack((s) => s.slice(0, -1)) }
    else if (e.key === 'Tab') e.preventDefault()
  }

  let idx = -1
  return (
    <div className={cn('relative flex min-h-[420px] w-full flex-col items-center justify-start gap-3 pt-6', className)}>
      {showTrigger && (
        <button ref={triggerRef} type="button" onClick={() => setOpen(true)} aria-haspopup="dialog"
          className="flex h-10 w-full max-w-xs items-center gap-2 rounded-[12px] border border-black/[0.08] bg-white px-3 text-sm text-zinc-600 shadow-[0_1px_2px_rgb(0_0_0/0.05)] transition-colors hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
          <Search className="size-4" aria-hidden /> <span className="flex-1 text-left">Search…</span>
          <kbd className="rounded-[6px] border border-black/10 px-1.5 font-mono text-[11px] dark:border-white/15">⌘&nbsp;K</kbd>
        </button>
      )}
      {last && <p role="status" className="text-[13px] text-zinc-600 dark:text-zinc-400">Ran “{last}”</p>}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div key="scrim" aria-hidden onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
              className="absolute inset-0 z-10 rounded-[20px] bg-zinc-950/20 backdrop-blur-[2px] dark:bg-black/50" />
            <motion.div key="panel" role="dialog" aria-modal="true" aria-label="Command palette"
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98, filter: 'blur(2px)', transition: { duration: 0.12 } }}
              transition={{ type: 'spring', stiffness: 500, damping: 34 }}
              className="absolute top-8 z-20 w-[min(560px,calc(100%-24px))] overflow-hidden rounded-[18px] border border-black/[0.08] bg-white/85 shadow-[0_2px_6px_rgb(0_0_0/0.08),0_32px_80px_-32px_rgb(0_0_0/0.45)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-zinc-900/85 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_32px_80px_-32px_rgb(0_0_0/0.8)] [@media(prefers-reduced-transparency:reduce)]:bg-white [@media(prefers-reduced-transparency:reduce)]:dark:bg-zinc-900">
              <div className="flex items-center gap-2 border-b border-black/[0.06] px-4 dark:border-white/[0.08]">
                {stack.length ? (
                  <button type="button" onClick={() => setStack((s) => s.slice(0, -1))} aria-label="Back" className="-ml-1 grid size-7 place-items-center rounded-[8px] text-zinc-600 hover:bg-black/5 dark:text-zinc-400 dark:hover:bg-white/10"><ArrowLeft className="size-4" /></button>
                ) : <Search className="size-4 text-zinc-500" aria-hidden />}
                {stack.length > 0 && <span className="rounded-[6px] bg-black/[0.05] px-1.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-white/10 dark:text-zinc-300">{stack[stack.length - 1].label}</span>}
                <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder={placeholder}
                  role="combobox" aria-expanded="true" aria-controls={`${id}-list`} aria-activedescendant={flat[active] ? `${id}-${flat[active].id}` : undefined} aria-autocomplete="list" aria-label="Command"
                  className="h-12 flex-1 bg-transparent text-base text-zinc-900 outline-none placeholder:text-zinc-500 sm:text-sm dark:text-zinc-100" />
                <kbd className="hidden rounded-[6px] border border-black/10 px-1.5 font-mono text-[11px] text-zinc-600 sm:block dark:border-white/15 dark:text-zinc-400">esc</kbd>
              </div>
              <div ref={listRef} id={`${id}-list`} role="listbox" aria-label="Results" className="max-h-[300px] overflow-y-auto overscroll-contain p-2">
                {flat.length === 0 && <p className="px-3 py-8 text-center text-sm text-zinc-600 dark:text-zinc-400">No results for “{q}”</p>}
                {groups.map(([g, list]) => (
                  <div key={g} role="group" aria-labelledby={`${id}-g-${g}`}>
                    <div id={`${id}-g-${g}`} className="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-600 dark:text-zinc-400">{g}</div>
                    {list.map((it) => {
                      idx++; const i = idx; const on = i === active
                      return (
                        <div key={it.id} id={`${id}-${it.id}`} data-idx={i} role="option" aria-selected={on}
                          onPointerMove={() => setActive(i)} onClick={() => choose(it)}
                          className="relative flex h-10 cursor-pointer select-none items-center gap-3 rounded-[10px] px-3 text-sm text-zinc-800 dark:text-zinc-200">
                          {on && <motion.span layoutId={`${id}-hl`} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 600, damping: 40 }} className="absolute inset-0 rounded-[10px] bg-black/[0.05] dark:bg-white/[0.08]" />}
                          <span className="relative text-zinc-600 dark:text-zinc-400 [&_svg]:size-4">{it.icon}</span>
                          <span className="relative flex-1 truncate">{it.label}</span>
                          {it.children && <span className="relative text-xs text-zinc-600 dark:text-zinc-400">{it.children.length} more ›</span>}
                          {it.shortcut && <span className="relative flex gap-1">{it.shortcut.map((k) => <kbd key={k} className="grid h-5 min-w-5 place-items-center rounded-[5px] border border-black/10 px-1 font-mono text-[11px] text-zinc-600 dark:border-white/15 dark:text-zinc-400">{k}</kbd>)}</span>}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-black/[0.06] px-4 py-2 text-xs text-zinc-600 dark:border-white/[0.08] dark:text-zinc-400">
                <span>↑ ↓ to navigate</span>
                <span className="flex items-center gap-1">Open <CornerDownLeft className="size-3" aria-hidden /></span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
