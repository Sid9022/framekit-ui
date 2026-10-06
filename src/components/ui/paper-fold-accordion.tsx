import * as React from 'react'
import { motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type PaperFoldItem = { id: string; title: string; content: React.ReactNode; meta?: string }

export type PaperFoldAccordionProps = {
  items?: PaperFoldItem[]
  /** 'single' keeps one panel open at a time. */
  type?: 'single' | 'multiple'
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  /** Heading level wrapping each trigger. */
  headingAs?: 'h2' | 'h3' | 'h4'
  className?: string
}

export const DEFAULT_PAPER_FOLD_ITEMS: PaperFoldItem[] = [
  { id: 'ship', title: 'How long does printing take?', meta: '2–4 days', content: 'Most orders leave the studio in two to four working days. Letterpress and foil jobs take a little longer because every sheet is pressed by hand and left to dry overnight.' },
  { id: 'paper', title: 'Which papers do you stock?', meta: '14 stocks', content: 'Fourteen stocks, from 120 gsm recycled bond to 700 gsm cotton board. Order the sample fold if you want to feel them first; we refund it against your first order.' },
  { id: 'proof', title: 'Do I get a proof before you print?', meta: 'Always', content: 'Always. You get a digital proof within one working day, and for runs over 500 we post a physical press proof. Nothing goes to press until you approve it.' },
  { id: 'returns', title: 'What if something arrives damaged?', meta: '30 days', content: 'Send us a photo within 30 days and we reprint it at no cost. Corners crushed in transit count too. You don’t need to send anything back.' },
]

function FoldPanel({ open, reduced, children, id, labelledBy }: { open: boolean; reduced: boolean; children: React.ReactNode; id: string; labelledBy: string }) {
  const measureRef = React.useRef<HTMLDivElement>(null)
  const [h, setH] = React.useState(0)
  React.useLayoutEffect(() => {
    const el = measureRef.current
    if (!el) return
    const update = () => setH(el.offsetHeight)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const half = h / 2
  const t = reduced ? { duration: 0.2 } : { type: 'spring' as const, stiffness: 170, damping: 22, mass: 0.9 }
  const leaf = 'absolute inset-x-0 overflow-hidden bg-[#fbf8f2] dark:bg-zinc-900'
  return (
    <motion.div
      id={id}
      role="region"
      aria-labelledby={labelledBy}
      inert={!open}
      className="relative overflow-hidden"
      initial={false}
      animate={{ height: open ? h : 0 }}
      transition={reduced ? { duration: 0.2 } : { type: 'spring', stiffness: 220, damping: 30 }}
    >
      {/* measurer and the real (accessible) content: visible only when settled open, or under reduced motion */}
      <motion.div
        ref={measureRef}
        className="relative"
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: reduced ? 0.2 : 0.01, delay: open && !reduced ? 0.42 : 0 }}
      >
        {children}
      </motion.div>
      {/* two creased paper leaves that unfold over it */}
      {!reduced && h > 0 && (
        <div aria-hidden className="pointer-events-none absolute inset-0 [perspective:900px]">
          <motion.div
            className={cn(leaf, 'top-0')}
            style={{ height: half, transformOrigin: '50% 0%' }}
            initial={false}
            animate={{ rotateX: open ? 0 : -90, opacity: open ? [1, 1, 0] : 1 }}
            transition={{ rotateX: t, opacity: open ? { duration: 0.5, times: [0, 0.85, 1], delay: 0 } : { duration: 0 } }}
          >
            <div>{children}</div>
            <motion.div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/25 dark:to-black/60" initial={false} animate={{ opacity: open ? 0 : 1 }} transition={t} />
          </motion.div>
          <motion.div
            className={cn(leaf, 'top-0')}
            style={{ height: half, y: half, transformOrigin: '50% 0%' }}
            initial={false}
            animate={{ rotateX: open ? 0 : 90, opacity: open ? [1, 1, 0] : 1 }}
            transition={{ rotateX: { ...t, delay: open ? 0.07 : 0 }, opacity: open ? { duration: 0.52, times: [0, 0.85, 1] } : { duration: 0 } }}
          >
            <div style={{ transform: `translateY(${-half}px)` }}>{children}</div>
            <motion.div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/30 dark:to-black/70" initial={false} animate={{ opacity: open ? 0 : 1 }} transition={t} />
          </motion.div>
          {/* crease */}
          <motion.div className="absolute inset-x-4 h-px bg-gradient-to-r from-transparent via-black/15 to-transparent dark:via-white/15" style={{ top: half }} initial={false} animate={{ opacity: open ? [0, 0.9, 0] : 0 }} transition={{ duration: 0.9, times: [0, 0.3, 1] }} />
        </div>
      )}
    </motion.div>
  )
}

/**
 * Paper Fold Accordion — FAQ rows that open like a folded letter. Each panel
 * is two creased paper leaves: the top swings down from its hinge, the bottom
 * follows a beat later from the crease, shadows lift off the paper as it
 * flattens and the real text settles in underneath.
 */
export function PaperFoldAccordion({
  items = DEFAULT_PAPER_FOLD_ITEMS,
  type = 'single',
  value: valueProp,
  defaultValue = [DEFAULT_PAPER_FOLD_ITEMS[0].id],
  onValueChange,
  headingAs: Heading = 'h3',
  className,
}: PaperFoldAccordionProps) {
  const reduced = usePrefersReducedMotion()
  const uid = React.useId()
  const [inner, setInner] = React.useState<string[]>(defaultValue)
  const value = valueProp ?? inner
  const listRef = React.useRef<HTMLDivElement>(null)

  const toggle = (id: string) => {
    const isOpen = value.includes(id)
    const next = type === 'single' ? (isOpen ? [] : [id]) : isOpen ? value.filter((v) => v !== id) : [...value, id]
    if (valueProp === undefined) setInner(next)
    onValueChange?.(next)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const triggers = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('[data-fold-trigger]') ?? [])
    const i = triggers.indexOf(document.activeElement as HTMLButtonElement)
    if (i < 0) return
    let n = i
    if (e.key === 'ArrowDown') n = (i + 1) % triggers.length
    else if (e.key === 'ArrowUp') n = (i - 1 + triggers.length) % triggers.length
    else if (e.key === 'Home') n = 0
    else if (e.key === 'End') n = triggers.length - 1
    else return
    e.preventDefault()
    triggers[n].focus()
  }

  return (
    <div
      ref={listRef}
      onKeyDown={onKeyDown}
      className={cn(
        'w-full max-w-xl rounded-[22px] bg-[#f3eee4] p-2 shadow-[0_1px_2px_rgb(60_40_20/0.06),0_24px_50px_-28px_rgb(60_40_20/0.4)] ring-1 ring-black/[0.05] dark:bg-zinc-950 dark:shadow-none dark:ring-white/[0.08]',
        className,
      )}
    >
      {items.map((item, idx) => {
        const open = value.includes(item.id)
        const tid = `${uid}-t-${item.id}`
        const pid = `${uid}-p-${item.id}`
        return (
          <div key={item.id} className={cn('rounded-2xl transition-colors duration-300', open ? 'bg-[#fbf8f2] shadow-[0_1px_2px_rgb(60_40_20/0.08),0_10px_24px_-14px_rgb(60_40_20/0.35)] dark:bg-zinc-900 dark:shadow-none dark:ring-1 dark:ring-white/[0.06]' : 'bg-transparent')}>
            <Heading className="m-0">
              <button
                id={tid}
                type="button"
                data-fold-trigger
                aria-expanded={open}
                aria-controls={pid}
                onClick={() => toggle(item.id)}
                className="group flex min-h-14 w-full items-center gap-4 rounded-2xl px-4 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#3b2a1a] dark:focus-visible:ring-zinc-200"
              >
                <span className="w-6 shrink-0 text-[12px] font-medium tabular-nums text-[#6b5845] dark:text-zinc-400">{String(idx + 1).padStart(2, '0')}</span>
                <span className="min-w-0 flex-1 text-[16px] font-medium leading-snug tracking-[-0.01em] text-[#24190f] dark:text-zinc-100">{item.title}</span>
                {item.meta && <span className="hidden shrink-0 rounded-full bg-[#24190f]/[0.06] px-2.5 py-1 text-[11px] font-medium text-[#5a4836] sm:inline dark:bg-white/[0.06] dark:text-zinc-300">{item.meta}</span>}
                <motion.span
                  aria-hidden
                  className="grid size-8 shrink-0 place-items-center rounded-full bg-[#24190f]/[0.06] text-[#24190f] dark:bg-white/[0.08] dark:text-zinc-100"
                  initial={false}
                  animate={{ rotate: open ? 135 : 0 }}
                  transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 24 }}
                >
                  <Plus className="size-4" />
                </motion.span>
              </button>
            </Heading>
            <FoldPanel open={open} reduced={reduced} id={pid} labelledBy={tid}>
              <div className="px-4 pb-5 pl-14 text-[14.5px] leading-relaxed text-[#4a3a2b] dark:text-zinc-300">{item.content}</div>
            </FoldPanel>
          </div>
        )
      })}
    </div>
  )
}
