import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { PortfolioArt } from '@/lib/portfolio-art'

export type DeskItemKind = 'photo' | 'note' | 'clip' | 'quote' | 'sticker'
export type DeskItem = {
  id: string
  kind: DeskItemKind
  title: string
  caption?: string
  /** Left / top as a percentage of the desk. */
  x: number
  y: number
  /** Width as a percentage of the desk. */
  w: number
  rotate?: number
  seed?: number
  src?: string
}

export type ScatterDeskCollageProps = {
  items?: DeskItem[]
  /** Height of the desk as aspect ratio (w / h). */
  aspect?: number
  className?: string
}

const DEFAULT_ITEMS: DeskItem[] = [
  { id: 'p1', kind: 'photo', title: 'Harbour at 6am', caption: 'field trip, week 3', x: 4, y: 8, w: 26, rotate: -6, seed: 7 },
  { id: 'n1', kind: 'note', title: 'Ship the weird version first.', caption: 'note to self', x: 34, y: 4, w: 19, rotate: 4 },
  { id: 'c1', kind: 'clip', title: 'checkout-v3.fig', caption: 'prototype clip', x: 55, y: 10, w: 28, rotate: -2, seed: 12 },
  { id: 'q1', kind: 'quote', title: '“Felt like it was made for me, not for a persona.”', caption: 'a client, after launch', x: 8, y: 52, w: 27, rotate: 3 },
  { id: 'p2', kind: 'photo', title: 'Studio window', caption: 'north light', x: 38, y: 44, w: 23, rotate: 5, seed: 19 },
  { id: 's1', kind: 'sticker', title: 'Made with care', x: 66, y: 50, w: 15, rotate: -12 },
  { id: 'n2', kind: 'note', title: 'Kerning is a love language.', caption: 'sticky #14', x: 80, y: 28, w: 17, rotate: -5 },
  { id: 'p3', kind: 'photo', title: 'Type specimen', caption: 'print proof', x: 62, y: 66, w: 22, rotate: -3, seed: 26 },
]

function Face({ item }: { item: DeskItem }) {
  if (item.kind === 'photo') {
    return (
      <div className="rounded-[3px] bg-white p-[6%] pb-[3%] shadow-[0_1px_0_rgb(0_0_0/0.04)] dark:bg-zinc-100">
        <div className="aspect-[4/3] overflow-hidden"><PortfolioArt seed={item.seed ?? 3} src={item.src} alt={item.src ? item.title : ''} /></div>
        <p className="mt-[7%] truncate text-center font-display text-[clamp(0.8rem,1.5vw,1.15rem)] italic leading-tight text-zinc-800">{item.caption ?? item.title}</p>
        <span className="sr-only">{item.title}</span>
      </div>
    )
  }
  if (item.kind === 'note') {
    return (
      <div className="relative aspect-square bg-amber-200 p-[10%] text-zinc-900 shadow-[inset_0_-14px_18px_-14px_rgb(120_80_0/0.28)]">
        <span aria-hidden className="absolute -top-2 left-1/2 h-4 w-1/3 -translate-x-1/2 rotate-2 bg-white/60 shadow-sm" />
        <p className="font-display text-[clamp(0.95rem,1.9vw,1.45rem)] italic leading-[1.1]">{item.title}</p>
        {item.caption && <p className="mt-[8%] font-mono text-[clamp(0.55rem,0.9vw,0.7rem)] uppercase tracking-wider text-amber-950/80">{item.caption}</p>}
      </div>
    )
  }
  if (item.kind === 'clip') {
    return (
      <div className="overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-sm dark:border-zinc-600 dark:bg-zinc-800">
        <div className="flex items-center gap-1 border-b border-zinc-200 bg-zinc-100 px-2 py-1.5 dark:border-zinc-700 dark:bg-zinc-900" aria-hidden>
          <span className="size-1.5 rounded-full bg-rose-400" /><span className="size-1.5 rounded-full bg-amber-400" /><span className="size-1.5 rounded-full bg-emerald-400" />
          <span className="ml-1.5 truncate font-mono text-[clamp(0.5rem,0.8vw,0.65rem)] text-zinc-700 dark:text-zinc-300">{item.title}</span>
        </div>
        <div className="aspect-[16/10]"><PortfolioArt seed={item.seed ?? 5} motif="blocks" /></div>
        <span className="sr-only">{item.title} — {item.caption}</span>
      </div>
    )
  }
  if (item.kind === 'quote') {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-[9%] shadow-sm dark:border-zinc-600 dark:bg-zinc-800">
        <div className="flex items-center gap-2" aria-hidden><span className="size-6 rounded-full bg-gradient-to-br from-signal-400 to-framekit-400" /><span className="h-2 w-16 rounded-full bg-zinc-200 dark:bg-zinc-600" /></div>
        <p className="mt-[7%] text-[clamp(0.7rem,1.2vw,0.9rem)] leading-snug text-zinc-800 dark:text-zinc-100">{item.title}</p>
        {item.caption && <p className="mt-[6%] text-[clamp(0.6rem,0.95vw,0.75rem)] text-zinc-600 dark:text-zinc-300">{item.caption}</p>}
      </div>
    )
  }
  return (
    <div className="relative aspect-square">
      <svg viewBox="-50 -50 100 100" className="size-full drop-shadow-[0_3px_5px_rgb(0_0_0/0.25)]" aria-hidden>
        <path d={Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2, r = i % 2 ? 40 : 48; return `${i ? 'L' : 'M'}${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}` }).join('') + 'Z'} className="fill-framekit-500" />
        <circle r="34" className="fill-none stroke-white/80" strokeWidth="1.5" strokeDasharray="3 3" />
        <path id="deskArc" d="M-24 4 A24 24 0 0 1 24 4" fill="none" />
        <text className="fill-white font-mono" fontSize="8.5" fontWeight="700" textAnchor="middle"><textPath href="#deskArc" startOffset="50%">MADE WITH</textPath></text>
        <path d="M0 26 C-18 12 -14 -4 0 4 C14 -4 18 12 0 26Z" className="fill-white" />
      </svg>
      <span className="sr-only">{item.title}</span>
    </div>
  )
}

/**
 * Scatter Desk Collage — a desk of rotated photos, notes, UI clips and stickers you can actually move. Drag to
 * rearrange (the picked card straightens and lifts), arrow-keys nudge, Enter raises, and “Tidy” snaps everything to a neat grid
 * on springs. Art is generated; pass `src` to use real images.
 */
export function ScatterDeskCollage({ items = DEFAULT_ITEMS, aspect = 1.55, className }: ScatterDeskCollageProps) {
  const reduced = usePrefersReducedMotion()
  const deskRef = React.useRef<HTMLDivElement>(null)
  const [narrow, setNarrow] = React.useState(false)
  React.useEffect(() => { const mq = window.matchMedia('(max-width: 560px)'); const f = () => setNarrow(mq.matches); f(); mq.addEventListener('change', f); return () => mq.removeEventListener('change', f) }, [])
  const K = narrow ? 1.6 : 1
  /** Logical (desktop) % → on-screen % so a wider card still fits the desk. */
  const toView = (x: number, w: number) => (x * (100 - w * K)) / (100 - w)
  const fromView = (x: number, w: number) => (x * (100 - w)) / (100 - w * K)
  const [pos, setPos] = React.useState(() => Object.fromEntries(items.map((i) => [i.id, { x: i.x, y: i.y }])))
  const [order, setOrder] = React.useState(() => items.map((i) => i.id))
  const [active, setActive] = React.useState<string | null>(null)
  const [tidy, setTidy] = React.useState(false)
  const [msg, setMsg] = React.useState('')
  const drag = React.useRef<{ id: string; dx: number; dy: number } | null>(null)

  const raise = (id: string) => setOrder((o) => [...o.filter((x) => x !== id), id])
  const gridPos = (i: number) => (narrow ? { x: 4 + (i % 2) * 52, y: 3 + Math.floor(i / 2) * 24.5 } : { x: 3 + (i % 4) * 24.5, y: 6 + Math.floor(i / 4) * 46 })
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
  const scatter = () => { setTidy(false); setPos(Object.fromEntries(items.map((i) => [i.id, { x: i.x, y: i.y }]))); setMsg('Scattered back to the original layout.') }
  const doTidy = () => { setTidy(true); setPos(Object.fromEntries(items.map((it, i) => [it.id, gridPos(i)]))); setMsg('Tidied into a grid.') }

  const onDown = (e: React.PointerEvent, it: DeskItem) => {
    const r = deskRef.current!.getBoundingClientRect()
    const p = pos[it.id]
    drag.current = { id: it.id, dx: ((e.clientX - r.left) / r.width) * 100 - toView(p.x, it.w), dy: ((e.clientY - r.top) / r.height) * 100 - p.y }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    setActive(it.id); raise(it.id)
  }
  const onMove = (e: React.PointerEvent, it: DeskItem) => {
    const d = drag.current
    if (!d || d.id !== it.id) return
    const r = deskRef.current!.getBoundingClientRect()
    const x = fromView(clamp(((e.clientX - r.left) / r.width) * 100 - d.dx, -2, 100 - it.w * K + 2), it.w)
    const y = clamp(((e.clientY - r.top) / r.height) * 100 - d.dy, -2, 92)
    setPos((p) => ({ ...p, [it.id]: { x, y } }))
  }
  const onUp = (it: DeskItem) => { if (drag.current?.id === it.id) { drag.current = null; setActive(null); setMsg(`Placed ${it.title.replace(/[“”]/g, '')}.`) } }
  const onKey = (e: React.KeyboardEvent, it: DeskItem) => {
    const step = e.shiftKey ? 8 : 2
    const p = pos[it.id]
    let { x, y } = p
    if (e.key === 'ArrowLeft') x -= step
    else if (e.key === 'ArrowRight') x += step
    else if (e.key === 'ArrowUp') y -= step
    else if (e.key === 'ArrowDown') y += step
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); raise(it.id); setMsg(`${it.title.replace(/[“”]/g, '')} brought to the front.`); return }
    else return
    e.preventDefault()
    setPos((q) => ({ ...q, [it.id]: { x: clamp(x, -2, 100 - it.w + 2), y: clamp(y, -2, 92) } }))
    raise(it.id)
  }

  const btn = 'inline-flex min-h-11 items-center rounded-full border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-900 outline-none transition-colors hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-signal-600 active:scale-95 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:focus-visible:ring-signal-300'

  return (
    <div className={cn('w-full max-w-4xl', className)}>
      <div
        ref={deskRef}
        className="relative w-full touch-pan-y overflow-hidden rounded-3xl border border-zinc-300 bg-stone-100 shadow-[inset_0_2px_30px_rgb(0_0_0/0.06)] dark:border-zinc-700 dark:bg-zinc-900"
        style={{ aspectRatio: String(narrow ? 0.62 : aspect), backgroundImage: 'linear-gradient(to right, rgb(120 113 108/0.14) 1px, transparent 1px), linear-gradient(to bottom, rgb(120 113 108/0.14) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      >
        <p aria-hidden className="pointer-events-none absolute bottom-3 right-4 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-400">cutting mat · 32px</p>
        {items.map((it) => {
          const p = pos[it.id]
          const z = order.indexOf(it.id)
          const isActive = active === it.id
          return (
            <motion.div
              key={it.id}
              role="group"
              tabIndex={0}
              aria-roledescription="movable card"
              aria-label={`${it.kind}: ${it.title.replace(/[“”]/g, '')}. Arrow keys move, Enter raises.`}
              onPointerDown={(e) => onDown(e, it)}
              onPointerMove={(e) => onMove(e, it)}
              onPointerUp={() => onUp(it)}
              onPointerCancel={() => onUp(it)}
              onKeyDown={(e) => onKey(e, it)}
              onFocus={() => raise(it.id)}
              className={cn('absolute cursor-grab touch-none select-none rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-signal-300', isActive && 'cursor-grabbing')}
              style={{ zIndex: z + 1, width: `${it.w * K}%` }}
              initial={false}
              animate={{ left: `${toView(p.x, it.w)}%`, top: `${p.y}%`, rotate: isActive || tidy ? 0 : it.rotate ?? 0, scale: isActive ? 1.06 : 1 }}
              whileHover={reduced ? undefined : { scale: 1.035, rotate: tidy ? 0 : (it.rotate ?? 0) * 0.4 }}
              transition={isActive || reduced ? { duration: 0 } : { type: 'spring', stiffness: 240, damping: 24 }}
            >
              <div className={cn('transition-shadow duration-200', isActive ? 'drop-shadow-[0_22px_22px_rgb(0_0_0/0.3)]' : 'drop-shadow-[0_6px_8px_rgb(0_0_0/0.18)]')}><Face item={it} /></div>
            </motion.div>
          )
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" className="min-h-5 text-sm text-zinc-700 dark:text-zinc-300">{msg || 'Drag anything, or Tab to a card and use the arrow keys.'}</p>
        <div className="flex gap-2">
          <button type="button" className={btn} onClick={scatter}>Scatter</button>
          <button type="button" className={btn} onClick={doTidy}>Tidy up</button>
        </div>
      </div>
    </div>
  )
}
