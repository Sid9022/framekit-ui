import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, CornerDownLeft, Folder, History, Search, X } from 'lucide-react'
import { DOCS, categorySlug, getNavGroups, type DocEntry } from '@/docs/registry'
import { cn } from '@/lib/cn'

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

type PaletteCtx = { open: boolean; setOpen: (v: boolean) => void; toggle: () => void }
const Ctx = React.createContext<PaletteCtx | null>(null)

export function useCommandPalette() {
  const ctx = React.useContext(Ctx)
  if (!ctx) throw new Error('useCommandPalette requires CommandPaletteProvider')
  return ctx
}

/** "⌘K" on Apple platforms, "Ctrl K" elsewhere (evaluated client-side only). */
export function useShortcutLabel() {
  const [mac, setMac] = React.useState(false)
  React.useEffect(() => {
    setMac(/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent))
  }, [])
  return mac ? '⌘K' : 'Ctrl K'
}

function isTypingTarget(t: EventTarget | null) {
  const el = t as HTMLElement | null
  if (!el) return false
  return el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)
}

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const toggle = React.useCallback(() => setOpen((o) => !o), [])

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey && !isTypingTarget(e.target)) {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const value = React.useMemo(() => ({ open, setOpen, toggle }), [open, toggle])
  return (
    <Ctx.Provider value={value}>
      {children}
      <CommandPalette open={open} onOpenChange={setOpen} />
    </Ctx.Provider>
  )
}

/* ------------------------------------------------------------------ */
/* Search model                                                        */
/* ------------------------------------------------------------------ */

type Item =
  | { kind: 'doc'; key: string; to: string; title: string; hint: string; doc: DocEntry }
  | { kind: 'category'; key: string; to: string; title: string; hint: string }

const RECENT_KEY = 'framekit-recent-searches'
const readRecent = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]').filter((s: unknown) => typeof s === 'string')
  } catch {
    return []
  }
}
const pushRecent = (slug: string) => {
  try {
    const next = [slug, ...readRecent().filter((s) => s !== slug)].slice(0, 5)
    localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  } catch {
    /* storage unavailable — recents are a nicety */
  }
}

const categoryItems = (): Item[] =>
  getNavGroups()
    .filter((g) => g.title !== 'Getting Started')
    .map((g) => ({
      kind: 'category',
      key: `cat:${g.title}`,
      to: `/docs/category/${categorySlug(g.title)}`,
      title: g.title,
      hint: `${g.items.length} component${g.items.length === 1 ? '' : 's'}`,
    }))

function scoreDoc(d: DocEntry, tokens: string[]) {
  const title = d.title.toLowerCase()
  const slug = d.slug
  const cat = d.category.toLowerCase()
  const desc = d.description.toLowerCase()
  let total = 0
  for (const t of tokens) {
    let s = 0
    if (title.startsWith(t)) s = 100
    else if (title.split(/[\s-]+/).some((w) => w.startsWith(t))) s = 70
    else if (title.includes(t)) s = 45
    else if (slug.includes(t)) s = 30
    else if (cat.includes(t)) s = 24
    else if (desc.includes(t)) s = 10
    if (!s) return 0
    total += s
  }
  return total + (d.isNew ? 1 : 0)
}

function search(q: string): Item[] {
  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean)
  const docs = DOCS.map((d) => ({ d, s: scoreDoc(d, tokens) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 40)
    .map<Item>(({ d }) => ({
      kind: 'doc',
      key: d.slug,
      to: `/docs/${d.slug}`,
      title: d.title,
      hint: d.category,
      doc: d,
    }))
  const cats = categoryItems().filter((c) => tokens.every((t) => c.title.toLowerCase().includes(t)))
  return [...cats.slice(0, 2), ...docs]
}

function Highlight({ text, q }: { text: string; q: string }) {
  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean)
  if (!tokens.length) return <>{text}</>
  const lower = text.toLowerCase()
  const marks = new Array(text.length).fill(false)
  for (const t of tokens) {
    let i = lower.indexOf(t)
    while (i !== -1) {
      for (let k = i; k < i + t.length; k++) marks[k] = true
      i = lower.indexOf(t, i + t.length)
    }
  }
  const out: React.ReactNode[] = []
  let start = 0
  for (let i = 1; i <= text.length; i++) {
    if (i === text.length || marks[i] !== marks[start]) {
      const chunk = text.slice(start, i)
      out.push(
        marks[start] ? (
          <mark key={start} className="rounded-sm bg-signal-200/80 px-0 text-inherit dark:bg-signal-700/60">
            {chunk}
          </mark>
        ) : (
          <React.Fragment key={start}>{chunk}</React.Fragment>
        ),
      )
      start = i
    }
  }
  return <>{out}</>
}

/* ------------------------------------------------------------------ */
/* UI                                                                  */
/* ------------------------------------------------------------------ */

const SUGGESTED = ['toggle', 'button', 'hero', 'loader', 'card', 'cursor']

function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [q, setQ] = React.useState('')
  const [active, setActive] = React.useState(0)
  const navigate = useNavigate()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)
  const returnFocus = React.useRef<HTMLElement | null>(null)
  const listId = React.useId()

  const sections = React.useMemo(() => {
    const query = q.trim()
    if (query) return [{ title: null as string | null, items: search(query) }]
    const bySlug = new Map(DOCS.map((d) => [d.slug, d]))
    const recent = readRecent()
      .map((s) => bySlug.get(s))
      .filter(Boolean)
      .map<Item>((d) => ({ kind: 'doc', key: `r:${d!.slug}`, to: `/docs/${d!.slug}`, title: d!.title, hint: d!.category, doc: d! }))
    const start = ['introduction', 'installation', 'theming']
      .map((s) => bySlug.get(s))
      .filter(Boolean)
      .map<Item>((d) => ({ kind: 'doc', key: `s:${d!.slug}`, to: `/docs/${d!.slug}`, title: d!.title, hint: d!.description, doc: d! }))
    const out: { title: string | null; items: Item[] }[] = []
    if (recent.length) out.push({ title: 'Recent', items: recent })
    out.push({ title: 'Getting started', items: start })
    out.push({ title: 'Browse by category', items: categoryItems().slice(0, 8) })
    return out
  }, [q, open])

  const flat = React.useMemo(() => sections.flatMap((s) => s.items), [sections])

  React.useEffect(() => {
    if (open) {
      returnFocus.current = document.activeElement as HTMLElement | null
      setQ('')
      setActive(0)
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      const t = window.setTimeout(() => inputRef.current?.focus(), 20)
      return () => {
        window.clearTimeout(t)
        document.body.style.overflow = prev
        returnFocus.current?.focus?.()
      }
    }
  }, [open])

  React.useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const go = (item: Item) => {
    if (item.kind === 'doc') pushRecent(item.doc.slug)
    onOpenChange(false)
    navigate(item.to)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (flat.length ? (i + 1) % flat.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0))
    } else if (e.key === 'Home' && e.currentTarget === inputRef.current && !q) {
      setActive(0)
    } else if (e.key === 'Enter' && flat[active]) {
      e.preventDefault()
      go(flat[active])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onOpenChange(false)
    } else if (e.key === 'Tab') {
      // Keep focus inside the dialog: the input is the only tab stop besides the close button.
      const focusables = e.currentTarget.querySelectorAll<HTMLElement>('input, button:not([tabindex="-1"])')
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  let idx = -1
  const count = q.trim() ? flat.length : null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="palette"
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/50 p-3 pt-[10vh] backdrop-blur-sm sm:p-4 sm:pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onOpenChange(false)
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search components"
            onKeyDown={onKeyDown}
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_24px_60px_-12px_rgb(0_0_0/0.35),0_2px_6px_rgb(0_0_0/0.08)] dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-center gap-2 border-b border-zinc-200 px-4 dark:border-zinc-800">
              <Search className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
              <input
                ref={inputRef}
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={flat[active] ? `${listId}-${active}` : undefined}
                aria-label="Search components"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value)
                  setActive(0)
                }}
                placeholder="Search components, categories…"
                autoComplete="off"
                spellCheck={false}
                className="h-14 w-full bg-transparent text-base outline-none placeholder:text-zinc-500 sm:text-sm dark:placeholder:text-zinc-400"
              />
              {q ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setQ('')
                    setActive(0)
                    inputRef.current?.focus()
                  }}
                  className="fk-touch -mr-2 grid h-9 w-9 place-items-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <kbd className="hidden rounded-md border border-zinc-300 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 sm:inline dark:border-zinc-700 dark:text-zinc-400">
                  ESC
                </kbd>
              )}
            </div>

            <div role="status" aria-live="polite" className="sr-only">
              {count === null ? '' : count === 0 ? 'No results' : `${count} result${count === 1 ? '' : 's'}`}
            </div>

            {flat.length === 0 && (
              <div className="px-6 py-8 text-center">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">No components match “{q.trim()}”</p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Try a broader word, or start from one of these:</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {SUGGESTED.map((s) => (
                    <button
                      key={s}
                      type="button"
                      tabIndex={-1}
                      onClick={() => {
                        setQ(s)
                        setActive(0)
                        inputRef.current?.focus()
                      }}
                      className="fk-touch rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <ul id={listId} role="listbox" aria-label="Results" ref={listRef} className={cn('framekit-scroll max-h-[min(26rem,60vh)] overflow-y-auto p-2', flat.length === 0 && 'hidden')}>
              {sections.map((sec, si) =>
                sec.items.length === 0 ? null : (
                  <React.Fragment key={sec.title ?? `s${si}`}>
                    {sec.title && (
                      <li role="presentation" className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-600 first:pt-1 dark:text-zinc-400">
                        {sec.title}
                      </li>
                    )}
                    {sec.items.map((item) => {
                      idx += 1
                      const i = idx
                      const on = i === active
                      return (
                        <li
                          key={item.key}
                          id={`${listId}-${i}`}
                          data-idx={i}
                          role="option"
                          aria-selected={on}
                          onMouseMove={() => active !== i && setActive(i)}
                          onClick={() => go(item)}
                          className={cn(
                            'group flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition-colors duration-100',
                            on ? 'bg-signal-100 text-zinc-950 dark:bg-signal-900/50 dark:text-zinc-50' : 'text-zinc-800 dark:text-zinc-200',
                          )}
                        >
                          <span
                            aria-hidden
                            className={cn(
                              'grid h-8 w-8 shrink-0 place-items-center rounded-lg border',
                              on
                                ? 'border-signal-300 bg-white text-signal-700 dark:border-signal-700 dark:bg-zinc-900 dark:text-signal-200'
                                : 'border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400',
                            )}
                          >
                            {item.kind === 'category' ? <Folder className="h-4 w-4" /> : !q.trim() && sec.title === 'Recent' ? <History className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-2 text-sm font-medium">
                              <span className="truncate">
                                <Highlight text={item.title} q={q} />
                              </span>
                              {item.kind === 'doc' && item.doc.isNew && (
                                <span className="rounded bg-signal-200 px-1.5 py-px text-[10px] font-semibold text-signal-900 dark:bg-signal-800 dark:text-signal-100">NEW</span>
                              )}
                            </span>
                            {item.kind === 'doc' && q.trim() && (
                              <span className="block truncate text-xs text-zinc-600 dark:text-zinc-400">{item.doc.description}</span>
                            )}
                          </span>
                          <span className="hidden shrink-0 text-xs text-zinc-600 sm:block dark:text-zinc-400">{item.hint.length > 36 ? '' : item.hint}</span>
                          {on && <CornerDownLeft className="hidden h-3.5 w-3.5 shrink-0 text-zinc-500 sm:block" aria-hidden />}
                        </li>
                      )
                    })}
                  </React.Fragment>
                ),
              )}
            </ul>

            <div className="flex items-center justify-between gap-3 border-t border-zinc-200 px-4 py-2.5 text-[11px] text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
              <span className="hidden items-center gap-3 sm:flex">
                <span className="flex items-center gap-1"><kbd className="rounded border border-zinc-300 px-1 font-mono dark:border-zinc-700">↑</kbd><kbd className="rounded border border-zinc-300 px-1 font-mono dark:border-zinc-700">↓</kbd> navigate</span>
                <span className="flex items-center gap-1"><kbd className="rounded border border-zinc-300 px-1 font-mono dark:border-zinc-700">↵</kbd> open</span>
              </span>
              <span>{count === null ? `${DOCS.length - 3} components` : `${count} result${count === 1 ? '' : 's'}`}</span>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="fk-touch rounded-md px-2 py-1 font-medium text-zinc-700 transition-colors hover:bg-zinc-100 sm:hidden dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
