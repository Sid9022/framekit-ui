import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronRight, Folder, FileText } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type TreeNode = { id: string; label: string; children?: TreeNode[] }

const TREE: TreeNode[] = [
  {
    id: 'org',
    label: 'Acme CPaaS',
    children: [
      {
        id: 'prod',
        label: 'Production',
        children: [
          { id: 'wa', label: 'WhatsApp channel' },
          { id: 'sms', label: 'SMS gateway' },
          { id: 'voice', label: 'Voice trunk' },
        ],
      },
      {
        id: 'staging',
        label: 'Staging',
        children: [
          { id: 'sandbox', label: 'Sandbox numbers' },
          { id: 'mocks', label: 'Mock agents' },
        ],
      },
    ],
  },
  {
    id: 'docs',
    label: 'Playbooks',
    children: [
      { id: 'onboarding', label: 'Onboarding' },
      { id: 'escalation', label: 'Escalation' },
    ],
  },
]

type Flat = { id: string; label: string; path: string[]; depth: number; hasKids: boolean }

function flatten(nodes: TreeNode[], path: string[] = []): Flat[] {
  const out: Flat[] = []
  for (const n of nodes) {
    out.push({ id: n.id, label: n.label, path: [...path, n.label], depth: path.length, hasKids: !!n.children?.length })
    if (n.children) out.push(...flatten(n.children, [...path, n.label]))
  }
  return out
}

/** Hierarchical tree with ↑↓/Enter, typeahead highlight, morphing path breadcrumb. */
export function CommandTreeSidebar({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const flat = React.useMemo(() => flatten(TREE), [])
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({ org: true, prod: true, docs: true })
  const [focus, setFocus] = React.useState(0)
  const [query, setQuery] = React.useState('')

  const visible = React.useMemo(() => {
    const q = query.toLowerCase()
    return flat.filter((n) => {
      const ancestorsOpen = (() => {
        let ok = true
        for (let i = 0; i < n.path.length - 1; i++) {
          const anc = flat.find((f) => f.depth === i && f.label === n.path[i])
          if (anc && expanded[anc.id] === false) ok = false
        }
        return ok
      })()
      if (!ancestorsOpen) return false
      if (!q) return true
      return n.label.toLowerCase().includes(q)
    })
  }, [flat, expanded, query])

  React.useEffect(() => {
    if (focus >= visible.length) setFocus(Math.max(0, visible.length - 1))
  }, [visible.length, focus])

  const current = visible[focus]

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocus((f) => Math.min(visible.length - 1, f + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocus((f) => Math.max(0, f - 1))
    } else if (e.key === 'Enter' && current) {
      e.preventDefault()
      if (current.hasKids) setExpanded((x) => ({ ...x, [current.id]: !(x[current.id] ?? true) }))
    } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      setQuery((q) => q + e.key)
    } else if (e.key === 'Backspace') {
      setQuery((q) => q.slice(0, -1))
    } else if (e.key === 'Escape') {
      setQuery('')
    }
  }

  return (
    <div
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={cn(
        'flex h-[400px] w-[280px] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white outline-none ring-signal-400/40 focus-visible:ring-2 dark:border-zinc-800 dark:bg-zinc-950',
        className,
      )}
      aria-label="Command tree"
    >
      <div className="border-b border-zinc-100 px-3 py-2.5 dark:border-zinc-800">
        <AnimatePresence mode="wait">
          <motion.div
            key={current?.path.join('/') ?? 'root'}
            initial={reduced ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex flex-wrap items-center gap-1 text-[11px] text-zinc-500"
          >
            {(current?.path ?? ['—']).map((seg, i, arr) => (
              <React.Fragment key={`${seg}-${i}`}>
                <span className={cn(i === arr.length - 1 && 'font-semibold text-zinc-800 dark:text-zinc-100')}>{seg}</span>
                {i < arr.length - 1 && <ChevronRight className="h-3 w-3 opacity-40" />}
              </React.Fragment>
            ))}
          </motion.div>
        </AnimatePresence>
        {query && (
          <p className="mt-1 font-mono text-[10px] text-signal-600 dark:text-signal-300">
            typeahead: <span className="rounded bg-signal-400/20 px-1">{query}</span>
          </p>
        )}
      </div>

      <ul className="framekit-scroll flex-1 overflow-y-auto p-2">
        {visible.map((node, i) => {
          const q = query.toLowerCase()
          const idx = q ? node.label.toLowerCase().indexOf(q) : -1
          return (
            <li key={node.id + node.path.join()}>
              <button
                type="button"
                onClick={() => {
                  setFocus(i)
                  if (node.hasKids) setExpanded((x) => ({ ...x, [node.id]: !(x[node.id] ?? true) }))
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition',
                  i === focus
                    ? 'bg-signal-400/25 text-zinc-900 dark:text-zinc-50'
                    : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900',
                )}
                style={{ paddingLeft: 8 + node.depth * 14 }}
              >
                {node.hasKids ? (
                  <ChevronRight className={cn('h-3.5 w-3.5 shrink-0 transition', (expanded[node.id] ?? true) && 'rotate-90')} />
                ) : (
                  <span className="w-3.5" />
                )}
                {node.hasKids ? (
                  <Folder className="h-3.5 w-3.5 shrink-0 text-signal-500" />
                ) : (
                  <FileText className="h-3.5 w-3.5 shrink-0 text-zinc-500 dark:text-zinc-400" />
                )}
                <span>
                  {idx >= 0 ? (
                    <>
                      {node.label.slice(0, idx)}
                      <mark className="rounded bg-signal-300/50 text-inherit dark:bg-signal-500/40">
                        {node.label.slice(idx, idx + q.length)}
                      </mark>
                      {node.label.slice(idx + q.length)}
                    </>
                  ) : (
                    node.label
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <p className="border-t border-zinc-100 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400 dark:border-zinc-800">
        ↑↓ navigate · Enter expand · type to filter
      </p>
    </div>
  )
}
