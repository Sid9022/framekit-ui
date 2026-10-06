import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronRight, ChevronsDownUp, File, FileCode2, FileJson, FileText, Folder, FolderOpen, Image as ImageIcon, Palette } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type TreeNode = { id: string; name: string; children?: TreeNode[] }

export type FileTreeExplorerProps = {
  data?: TreeNode[]
  /** Folder ids open on mount. */
  defaultExpanded?: string[]
  /** Selected file id (controlled). */
  value?: string | null
  /** Initially selected file id (uncontrolled). */
  defaultValue?: string | null
  onValueChange?: (id: string, path: string[]) => void
  /** Header label. */
  title?: string
  /** Show the selected path under the tree. */
  showPath?: boolean
  className?: string
}

export const DEFAULT_TREE: TreeNode[] = [
  {
    id: 'app', name: 'app', children: [
      { id: 'app/(dashboard)', name: '(dashboard)', children: [
        { id: 'app/(dashboard)/settings.tsx', name: 'settings.tsx' },
        { id: 'app/(dashboard)/usage.tsx', name: 'usage.tsx' },
      ] },
      { id: 'app/layout.tsx', name: 'layout.tsx' },
      { id: 'app/page.tsx', name: 'page.tsx' },
      { id: 'app/globals.css', name: 'globals.css' },
    ],
  },
  {
    id: 'components', name: 'components', children: [
      { id: 'components/ui', name: 'ui', children: [
        { id: 'components/ui/button.tsx', name: 'button.tsx' },
        { id: 'components/ui/dialog.tsx', name: 'dialog.tsx' },
      ] },
      { id: 'components/site-header.tsx', name: 'site-header.tsx' },
    ],
  },
  { id: 'lib', name: 'lib', children: [{ id: 'lib/cn.ts', name: 'cn.ts' }] },
  { id: 'public', name: 'public', children: [{ id: 'public/og-card.png', name: 'og-card.png' }] },
  { id: 'package.json', name: 'package.json' },
  { id: 'README.md', name: 'README.md' },
]

function FileGlyph({ name }: { name: string }) {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  const cls = 'h-4 w-4 shrink-0'
  if (['tsx', 'ts', 'jsx', 'js', 'mjs'].includes(ext)) return <FileCode2 className={cn(cls, 'text-sky-700 dark:text-sky-300')} aria-hidden />
  if (ext === 'json') return <FileJson className={cn(cls, 'text-amber-700 dark:text-amber-300')} aria-hidden />
  if (['css', 'scss'].includes(ext)) return <Palette className={cn(cls, 'text-fuchsia-700 dark:text-fuchsia-300')} aria-hidden />
  if (['png', 'jpg', 'svg', 'webp'].includes(ext)) return <ImageIcon className={cn(cls, 'text-emerald-700 dark:text-emerald-300')} aria-hidden />
  if (['md', 'mdx', 'txt'].includes(ext)) return <FileText className={cn(cls, 'text-zinc-600 dark:text-zinc-300')} aria-hidden />
  return <File className={cn(cls, 'text-zinc-600 dark:text-zinc-300')} aria-hidden />
}

type Flat = { node: TreeNode; level: number; parent: string | null; path: string[] }

/**
 * File Tree Explorer — a calm, editor-grade file tree. Folders open on a soft height spring with a rotating chevron,
 * hairline guides show depth, and the selection is a single highlight that glides between rows. Full WAI-ARIA tree
 * keyboard support: arrows, Home/End, Enter/Space and type-ahead. The selected path is announced.
 */
export function FileTreeExplorer({
  data = DEFAULT_TREE,
  defaultExpanded = ['app', 'components', 'components/ui'],
  value,
  defaultValue = 'components/ui/button.tsx',
  onValueChange,
  title = 'Explorer',
  showPath = true,
  className,
}: FileTreeExplorerProps) {
  const reduced = usePrefersReducedMotion()
  const [open, setOpen] = React.useState(() => new Set(defaultExpanded))
  const [inner, setInner] = React.useState<string | null>(defaultValue)
  const selected = value !== undefined ? value : inner
  const [focusId, setFocusId] = React.useState<string>(() => selected ?? data[0]?.id ?? '')
  const refs = React.useRef(new Map<string, HTMLLIElement>())
  const typed = React.useRef({ s: '', t: 0 })
  const lid = React.useId()

  const index = React.useMemo(() => {
    const all = new Map<string, Flat>()
    const walk = (nodes: TreeNode[], level: number, parent: string | null, path: string[]) => {
      for (const n of nodes) {
        const p = [...path, n.name]
        all.set(n.id, { node: n, level, parent, path: p })
        if (n.children) walk(n.children, level + 1, n.id, p)
      }
    }
    walk(data, 1, null, [])
    return all
  }, [data])

  const visible = React.useMemo(() => {
    const out: string[] = []
    const walk = (nodes: TreeNode[]) => {
      for (const n of nodes) {
        out.push(n.id)
        if (n.children && open.has(n.id)) walk(n.children)
      }
    }
    walk(data)
    return out
  }, [data, open])

  const focus = (id: string) => {
    setFocusId(id)
    refs.current.get(id)?.focus()
  }
  const toggle = (id: string, force?: boolean) =>
    setOpen((o) => {
      const n = new Set(o)
      const want = force ?? !n.has(id)
      if (want) n.add(id)
      else n.delete(id)
      return n
    })
  const choose = (id: string) => {
    const f = index.get(id)
    if (!f) return
    if (f.node.children) return toggle(id)
    if (value === undefined) setInner(id)
    onValueChange?.(id, f.path)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = visible.indexOf(focusId)
    const f = index.get(focusId)
    if (!f) return
    const isFolder = !!f.node.children
    let handled = true
    switch (e.key) {
      case 'ArrowDown': if (i < visible.length - 1) focus(visible[i + 1]); break
      case 'ArrowUp': if (i > 0) focus(visible[i - 1]); break
      case 'Home': focus(visible[0]); break
      case 'End': focus(visible[visible.length - 1]); break
      case 'ArrowRight':
        if (isFolder && !open.has(focusId)) toggle(focusId, true)
        else if (isFolder && f.node.children?.length) focus(f.node.children[0].id)
        break
      case 'ArrowLeft':
        if (isFolder && open.has(focusId)) toggle(focusId, false)
        else if (f.parent) focus(f.parent)
        break
      case 'Enter': case ' ': choose(focusId); break
      default:
        if (e.key.length === 1 && /\S/.test(e.key) && !e.metaKey && !e.ctrlKey) {
          const now = performance.now()
          typed.current.s = (now - typed.current.t < 600 ? typed.current.s : '') + e.key.toLowerCase()
          typed.current.t = now
          const start = typed.current.s.length === 1 ? i + 1 : i
          const order = [...visible.slice(start), ...visible.slice(0, start)]
          const hit = order.find((id) => index.get(id)?.node.name.toLowerCase().startsWith(typed.current.s))
          if (hit) focus(hit)
        } else handled = false
    }
    if (handled) e.preventDefault()
  }

  const renderNodes = (nodes: TreeNode[], level: number): React.ReactNode =>
    nodes.map((n, k) => {
      const isFolder = !!n.children
      const isOpen = open.has(n.id)
      const isSel = selected === n.id
      return (
        <li
          key={n.id}
          ref={(el) => {
            if (el) refs.current.set(n.id, el)
            else refs.current.delete(n.id)
          }}
          role="treeitem"
          aria-level={level}
          aria-setsize={nodes.length}
          aria-posinset={k + 1}
          aria-expanded={isFolder ? isOpen : undefined}
          aria-selected={isFolder ? undefined : isSel}
          tabIndex={focusId === n.id ? 0 : -1}
          onFocus={(e) => {
            if (e.target === e.currentTarget) setFocusId(n.id)
          }}
          className="outline-none [&:focus-visible>div]:ring-2 [&:focus-visible>div]:ring-signal-600 dark:[&:focus-visible>div]:ring-signal-300"
        >
          <div
            onClick={(e) => {
              e.stopPropagation()
              focus(n.id)
              choose(n.id)
            }}
            style={{ paddingLeft: 8 + (level - 1) * 16 }}
            className={cn(
              'relative flex min-h-9 cursor-default select-none items-center gap-1.5 rounded-[10px] pr-2 text-[13px] pointer-coarse:min-h-11',
              isSel ? 'font-medium text-zinc-950 dark:text-white' : 'text-zinc-700 hover:bg-black/[0.04] dark:text-zinc-300 dark:hover:bg-white/[0.05]',
            )}
          >
            {isSel && (
              <motion.span
                layoutId={reduced ? undefined : `${lid}-sel`}
                aria-hidden
                transition={{ type: 'spring', stiffness: 460, damping: 36 }}
                className="absolute inset-0 rounded-[10px] bg-white shadow-[0_1px_2px_rgb(0_0_0/0.08),0_4px_12px_-6px_rgb(0_0_0/0.12)] ring-1 ring-black/[0.06] dark:bg-white/[0.08] dark:shadow-none dark:ring-white/[0.08]"
              />
            )}
            {Array.from({ length: level - 1 }, (_, g) => (
              <span key={g} aria-hidden className="absolute inset-y-0 w-px bg-black/[0.07] dark:bg-white/[0.08]" style={{ left: 15 + g * 16 }} />
            ))}
            <span className="relative grid h-4 w-4 shrink-0 place-items-center text-zinc-500 dark:text-zinc-400">
              {isFolder && (
                <ChevronRight aria-hidden className={cn('h-3.5 w-3.5 transition-transform duration-200 ease-out motion-reduce:transition-none', isOpen && 'rotate-90')} />
              )}
            </span>
            <span className="relative">
              {isFolder ? (
                isOpen ? <FolderOpen className="h-4 w-4 text-signal-700 dark:text-signal-300" aria-hidden /> : <Folder className="h-4 w-4 text-signal-700 dark:text-signal-300" aria-hidden />
              ) : (
                <FileGlyph name={n.name} />
              )}
            </span>
            <span className="relative truncate" translate="no">{n.name}</span>
          </div>
          {isFolder && (
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.ul
                  role="group"
                  initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={reduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                  exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={reduced ? { duration: 0.12 } : { type: 'spring', stiffness: 380, damping: 36, opacity: { duration: 0.18 } }}
                  className="overflow-hidden"
                >
                  {renderNodes(n.children!, level + 1)}
                </motion.ul>
              )}
            </AnimatePresence>
          )}
        </li>
      )
    })

  const selPath = selected ? index.get(selected)?.path : undefined

  return (
    <div
      className={cn(
        'w-full max-w-xs rounded-[20px] bg-zinc-100/80 p-1.5 ring-1 ring-black/[0.06]',
        'shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.35)]',
        'dark:bg-zinc-900 dark:ring-white/[0.08] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]',
        className,
      )}
    >
      <div className="flex items-center justify-between px-2.5 pb-1 pt-1">
        <p id={`${lid}-label`} className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-600 dark:text-zinc-400">{title}</p>
        <button
          type="button"
          onClick={() => setOpen(new Set())}
          aria-label="Collapse all folders"
          title="Collapse all"
          className="grid h-8 w-8 place-items-center rounded-lg text-zinc-600 transition-[background-color,color,transform] duration-150 hover:bg-black/[0.05] hover:text-zinc-950 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-600 pointer-coarse:h-11 pointer-coarse:w-11 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white dark:focus-visible:ring-signal-300"
        >
          <ChevronsDownUp className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <ul role="tree" aria-labelledby={`${lid}-label`} onKeyDown={onKeyDown} className="flex flex-col gap-px rounded-[14px] p-0.5">
        {renderNodes(data, 1)}
      </ul>
      {showPath && (
        <p role="status" aria-live="polite" className="mt-1 truncate px-2.5 py-2 font-mono text-[11px] text-zinc-600 dark:text-zinc-400" translate="no">
          {selPath ? selPath.join(' / ') : 'No file selected'}
        </p>
      )}
    </div>
  )
}
