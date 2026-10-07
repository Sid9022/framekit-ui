import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type FaqItem = { q: string; a: React.ReactNode }

export type FaqAccordionProps = {
  items?: FaqItem[]
  /** Allow several open at once. */
  multiple?: boolean
  defaultOpen?: number[]
  title?: string
  /** Optional side copy (e.g. support link). */
  aside?: React.ReactNode
  className?: string
}

export const DEFAULT_FAQ: FaqItem[] = [
  { q: 'Can I change plans later?', a: 'Yes. Upgrades apply instantly and are prorated; downgrades take effect at the end of your billing period.' },
  { q: 'Is there a free trial?', a: 'Every paid plan starts with a 14‑day trial. No credit card is needed until you decide to stay.' },
  { q: 'How does team billing work?', a: 'You pay per active seat. Invite as many viewers as you like — they’re always free.' },
  { q: 'Do you offer discounts for non‑profits?', a: 'We offer 50% off for registered non‑profits and free plans for open‑source maintainers.' },
  { q: 'Where is my data stored?', a: 'In the region you choose — US, EU or APAC — encrypted at rest with AES‑256 and in transit with TLS 1.3.' },
]

/**
 * FAQ Accordion — a two-column FAQ whose rows expand with a height spring, the
 * plus rotates into a cross, and the open row lifts onto a soft surface.
 * Native buttons with aria-expanded/controls; ↑ ↓ Home End move between rows.
 */
export function FaqAccordion({ items = DEFAULT_FAQ, multiple = false, defaultOpen = [0], title = 'Frequently asked questions', aside, className }: FaqAccordionProps) {
  const reduced = usePrefersReducedMotion()
  const id = React.useId()
  const [open, setOpen] = React.useState<number[]>(defaultOpen)
  const refs = React.useRef<(HTMLButtonElement | null)[]>([])
  const toggle = (i: number) => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : multiple ? [...o, i] : [i]))
  const key = (e: React.KeyboardEvent, i: number) => {
    const n = items.length; let j = -1
    if (e.key === 'ArrowDown') j = (i + 1) % n; else if (e.key === 'ArrowUp') j = (i - 1 + n) % n; else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = n - 1
    if (j >= 0) { e.preventDefault(); refs.current[j]?.focus() }
  }
  return (
    <section aria-labelledby={`${id}-t`} className={cn('grid w-full gap-8 lg:grid-cols-[1fr_1.6fr]', className)}>
      <div>
        <h2 id={`${id}-t`} className="text-balance text-3xl font-semibold tracking-[-0.03em] text-zinc-950 dark:text-white">{title}</h2>
        <div className="mt-3 max-w-[40ch] text-pretty text-[15px] text-zinc-600 dark:text-zinc-400">{aside ?? <>Can’t find what you need? <a href="#" className="font-medium text-zinc-900 underline decoration-black/20 underline-offset-4 hover:decoration-black dark:text-white dark:decoration-white/30 dark:hover:decoration-white">Talk to our team</a>.</>}</div>
      </div>
      <ul className="grid gap-1">
        {items.map((it, i) => {
          const on = open.includes(i)
          return (
            <li key={i} className={cn('rounded-[16px] transition-colors duration-200', on ? 'bg-black/[0.03] dark:bg-white/[0.04]' : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]')}>
              <h3>
                <button ref={(el) => { refs.current[i] = el }} type="button" id={`${id}-b${i}`} aria-expanded={on} aria-controls={`${id}-p${i}`} onClick={() => toggle(i)} onKeyDown={(e) => key(e, i)}
                  className="flex min-h-14 w-full items-center justify-between gap-4 rounded-[16px] px-4 text-left text-[15px] font-medium text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 dark:text-zinc-100">
                  {it.q}
                  <motion.span aria-hidden animate={{ rotate: on ? 45 : 0 }} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 24 }}
                    className={cn('grid size-7 shrink-0 place-items-center rounded-full border transition-colors', on ? 'border-transparent bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'border-black/10 text-zinc-700 dark:border-white/15 dark:text-zinc-300')}>
                    <Plus className="size-3.5" />
                  </motion.span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.div id={`${id}-p${i}`} role="region" aria-labelledby={`${id}-b${i}`} key="p"
                    initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={{ height: { type: 'spring', stiffness: 300, damping: 34 }, opacity: { duration: 0.2 } }} className="overflow-hidden">
                    <motion.p initial={reduced ? false : { y: -6, filter: 'blur(2px)' }} animate={{ y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.3 }} className="max-w-[60ch] px-4 pb-4 text-pretty text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{it.a}</motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
