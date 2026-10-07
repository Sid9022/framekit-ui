import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type CurtainPage = { id: string; label: string; title: string; body: string; tint: string }

export type PageCurtainTransitionProps = { pages?: CurtainPage[]; panels?: number; className?: string }

export const DEFAULT_CURTAIN_PAGES: CurtainPage[] = [
  { id: 'work', label: 'Work', title: 'Selected work', body: 'Brand systems, product launches and the occasional typeface.', tint: '#4f46e5' },
  { id: 'studio', label: 'Studio', title: 'A small studio', body: 'Six people, one long table and a strong opinion about kerning.', tint: '#db2777' },
  { id: 'contact', label: 'Contact', title: 'Say hello', body: 'New projects open in spring. We reply within two days.', tint: '#0d9488' },
]

/**
 * Page Curtain Transition — route changes play a staggered column curtain:
 * panels sweep up to cover, the next page's name flashes on the curtain,
 * then panels lift away to reveal it. Reduced motion uses a cross-fade.
 */
export function PageCurtainTransition({ pages = DEFAULT_CURTAIN_PAGES, panels = 5, className }: PageCurtainTransitionProps) {
  const reduced = usePrefersReducedMotion()
  const [cur, setCur] = React.useState(pages[0].id)
  const [next, setNext] = React.useState<string | null>(null)
  const page = pages.find((p) => p.id === cur)!
  const target = pages.find((p) => p.id === next)
  const go = (id: string) => {
    if (id === cur || next) return
    if (reduced) { setCur(id); return }
    setNext(id)
    setTimeout(() => setCur(id), 620)
    setTimeout(() => setNext(null), 700)
  }
  return (
    <div className={cn('relative h-[440px] w-full overflow-hidden rounded-[24px] bg-white ring-1 ring-black/[0.06] dark:bg-zinc-950 dark:ring-white/[0.08]', className)}>
      <nav aria-label="Pages" className="relative z-30 flex items-center justify-between px-6 py-5">
        <span className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-white">Atelier®</span>
        <ul className="flex gap-1">{pages.map((p) => (
          <li key={p.id}><button onClick={() => go(p.id)} aria-current={p.id === cur ? 'page' : undefined} className={cn('rounded-full px-3 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-sky-500', p.id === cur ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950' : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white')}>{p.label}</button></li>
        ))}</ul>
      </nav>
      <AnimatePresence mode="wait">
        <motion.main key={cur} initial={{ opacity: 0, y: reduced ? 0 : 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 26 }} className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10" aria-live="polite">
          <span aria-hidden className="absolute right-6 top-20 size-40 rounded-full opacity-25 blur-2xl sm:size-64" style={{ background: page.tint }} />
          <h3 className="relative text-balance text-4xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-6xl dark:text-white">{page.title}</h3>
          <p className="relative mt-3 max-w-[44ch] text-pretty text-zinc-600 dark:text-zinc-400">{page.body}</p>
        </motion.main>
      </AnimatePresence>
      <AnimatePresence>
        {target && (
          <div key="curtain" aria-hidden className="pointer-events-none absolute inset-0 z-20 flex">
            {Array.from({ length: panels }).map((_, i) => (
              <motion.div key={i} className="-mx-px h-full flex-1" style={{ background: target.tint }}
                initial={{ y: '100%' }} animate={{ y: '0%', transition: { duration: 0.42, ease: [0.76, 0, 0.24, 1], delay: i * 0.04 } }}
                exit={{ y: '-100%', transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1], delay: i * 0.04 } }} />
            ))}
            <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.28 } }} exit={{ opacity: 0, transition: { duration: 0.1 } }} className="absolute inset-0 grid place-items-center text-3xl font-semibold tracking-[-0.03em] text-white">{target.label}</motion.span>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
