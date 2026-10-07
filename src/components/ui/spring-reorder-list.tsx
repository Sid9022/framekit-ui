import * as React from 'react'
import { Reorder, motion, useDragControls } from 'motion/react'
import { GripVertical } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type ReorderItem = { id: string; title: string; meta: string; color: string }

export type SpringReorderListProps = { items?: ReorderItem[]; onReorder?: (items: ReorderItem[]) => void; className?: string }

export const DEFAULT_REORDER_ITEMS: ReorderItem[] = [
  { id: '1', title: 'Ship onboarding v2', meta: 'Design · Due Fri', color: '#6366f1' },
  { id: '2', title: 'Migrate billing to usage', meta: 'Platform · Due Mon', color: '#f59e0b' },
  { id: '3', title: 'Audit color contrast', meta: 'A11y · Due Tue', color: '#10b981' },
  { id: '4', title: 'Write launch post', meta: 'Marketing · Due Wed', color: '#ec4899' },
]

/**
 * Spring Reorder List — a priority list you reorder by dragging the grip:
 * the lifted row scales and casts a deeper shadow, siblings part on springs.
 * Keyboard: focus a grip, Alt+↑/↓ (or ↑/↓) moves the row; a live region
 * announces the new position.
 */
export function SpringReorderList({ items: init = DEFAULT_REORDER_ITEMS, onReorder, className }: SpringReorderListProps) {
  const [items, setItems] = React.useState(init)
  const [msg, setMsg] = React.useState('')
  const update = (n: ReorderItem[]) => { setItems(n); onReorder?.(n) }
  const move = (i: number, d: number) => {
    const j = i + d; if (j < 0 || j >= items.length) return
    const n = [...items];[n[i], n[j]] = [n[j], n[i]]; update(n)
    setMsg(`${n[j].title} moved to position ${j + 1} of ${n.length}`)
    requestAnimationFrame(() => document.getElementById(`sr-grip-${n[j].id}`)?.focus())
  }
  return (
    <div className={cn('w-full max-w-[460px]', className)}>
      <Reorder.Group axis="y" values={items} onReorder={update} className="grid gap-2">
        {items.map((it, i) => <Row key={it.id} it={it} i={i} n={items.length} move={move} />)}
      </Reorder.Group>
      <p className="sr-only" aria-live="assertive">{msg}</p>
    </div>
  )
}

function Row({ it, i, n, move }: { it: ReorderItem; i: number; n: number; move: (i: number, d: number) => void }) {
  const controls = useDragControls()
  const reduced = usePrefersReducedMotion()
  const [lifted, setLifted] = React.useState(false)
  return (
    <Reorder.Item value={it} dragListener={false} dragControls={controls} onDragStart={() => setLifted(true)} onDragEnd={() => setLifted(false)}
      transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 38 }}
      animate={{ scale: lifted ? 1.03 : 1, boxShadow: lifted ? '0 2px 4px rgb(0 0 0 / 0.08), 0 24px 40px -16px rgb(0 0 0 / 0.35)' : '0 1px 2px rgb(0 0 0 / 0.05), 0 0 0 rgb(0 0 0 / 0)' }}
      className="relative flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-black/[0.06] dark:bg-zinc-900 dark:ring-white/[0.08]" style={{ zIndex: lifted ? 10 : 0 }}>
      <button id={`sr-grip-${it.id}`} aria-label={`Reorder ${it.title}, position ${i + 1} of ${n}. Use arrow keys to move.`} onPointerDown={(e) => controls.start(e)}
        onKeyDown={(e) => { if (e.key === 'ArrowUp') { e.preventDefault(); move(i, -1) } if (e.key === 'ArrowDown') { e.preventDefault(); move(i, 1) } }}
        className="grid h-9 w-7 cursor-grab touch-none place-items-center rounded-lg text-zinc-500 outline-none hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-sky-500 active:cursor-grabbing dark:text-zinc-400 dark:hover:bg-zinc-800"><GripVertical className="size-4" /></button>
      <span className="size-2.5 shrink-0 rounded-full" style={{ background: it.color }} aria-hidden />
      <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-zinc-950 dark:text-white">{it.title}</p><p className="text-xs text-zinc-600 dark:text-zinc-400">{it.meta}</p></div>
      <motion.span key={i} initial={reduced ? false : { scale: 1.3, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} className="grid size-6 place-items-center rounded-full bg-zinc-100 font-mono text-[11px] tabular-nums text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">{i + 1}</motion.span>
    </Reorder.Item>
  )
}
