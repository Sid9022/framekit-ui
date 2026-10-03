import * as React from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { PortfolioArt, SAMPLE_PROJECTS, type PortfolioProject } from '@/lib/portfolio-art'

export type ProjectLightboxProps = {
  items?: PortfolioProject[]
  /** Controlled open id (null = closed). */
  openId?: string | null
  onOpenChange?: (id: string | null) => void
  titleAs?: 'h2' | 'h3' | 'h4' | 'p'
  className?: string
}

const FOCUSABLE = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])'

/**
 * Project Lightbox — thumbnails open into a detail modal through a shared-element (layoutId) morph: the artwork flies
 * from its tile to the hero slot while copy staggers in. Focus is trapped and restored, Esc closes, ← → browse projects.
 * The portal inherits the nearest .dark / .light scope so it matches the page.
 */
export function ProjectLightbox({ items = SAMPLE_PROJECTS, openId, onOpenChange, titleAs = 'h3', className }: ProjectLightboxProps) {
  const reduced = usePrefersReducedMotion()
  const uid = React.useId()
  const root = React.useRef<HTMLDivElement>(null)
  const dialog = React.useRef<HTMLDivElement>(null)
  const lastTrigger = React.useRef<HTMLElement | null>(null)
  const [inner, setInner] = React.useState<string | null>(null)
  const current = openId !== undefined ? openId : inner
  const [scope, setScope] = React.useState('')
  const Title = titleAs
  const idx = items.findIndex((p) => p.id === current)
  const proj = idx >= 0 ? items[idx] : null
  const set = React.useCallback((id: string | null) => { setInner(id); onOpenChange?.(id) }, [onOpenChange])
  const nav = React.useCallback((d: number) => set(items[(idx + d + items.length) % items.length].id), [idx, items, set])

  React.useEffect(() => {
    if (!proj) return
    const el = root.current?.closest('.dark, .light')
    setScope(el ? (el.classList.contains('dark') ? 'dark' : 'light') : '')
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev; lastTrigger.current?.focus?.() }
  }, [!!proj]) // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (!proj) return
    const t = window.setTimeout(() => dialog.current?.querySelector<HTMLElement>('[data-close]')?.focus(), 30)
    return () => window.clearTimeout(t)
  }, [!!proj]) // eslint-disable-line react-hooks/exhaustive-deps

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.stopPropagation(); set(null) }
    else if (e.key === 'ArrowRight') nav(1)
    else if (e.key === 'ArrowLeft') nav(-1)
    else if (e.key === 'Tab') {
      const f = Array.from(dialog.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])
      if (!f.length) return
      const first = f[0], last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
  }
  const spring = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 260, damping: 30 }

  return (
    <div ref={root} className={cn('w-full max-w-3xl', className)}>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={(e) => { lastTrigger.current = e.currentTarget; set(p.id) }}
              className="group block w-full rounded-2xl text-left"
            >
              <motion.span layoutId={`${uid}-art-${p.id}`} transition={spring} className="relative block aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-black/10 dark:ring-white/10" style={{ borderRadius: 16 }}>
                <span className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none"><PortfolioArt seed={p.seed} src={p.src} alt="" /></span>
              </motion.span>
              <span className="mt-2 block text-sm font-semibold text-zinc-900 dark:text-zinc-100">{p.title}</span>
              <span className="block text-xs text-zinc-600 dark:text-zinc-400">{p.category} · {p.year}</span>
              <span className="sr-only">Open project details</span>
            </button>
          </li>
        ))}
      </ul>

      {typeof document !== 'undefined' && createPortal(
        <div className={scope}>
          <AnimatePresence>
            {proj && (
              <div className="fixed inset-0 z-[100] grid place-items-center p-3 sm:p-6" onKeyDown={onKey}>
                <motion.div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => set(null)} aria-hidden />
                <motion.div
                  ref={dialog}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={`${uid}-t`}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.18 } }}
                  transition={spring}
                  className="relative grid max-h-[calc(100dvh-1.5rem)] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white text-zinc-950 shadow-2xl md:grid-cols-[1.25fr_1fr] dark:bg-zinc-900 dark:text-zinc-50"
                >
                  <motion.div layoutId={`${uid}-art-${proj.id}`} transition={spring} className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[420px]" style={{ borderRadius: 16 }}>
                    <PortfolioArt key={proj.id} seed={proj.seed} src={proj.src} alt={proj.alt ?? `${proj.title} preview`} />
                  </motion.div>
                  <div className="flex flex-col p-6 sm:p-8">
                    <motion.div key={proj.id} className="flex-1" initial="h" animate="s" variants={{ h: {}, s: { transition: { staggerChildren: reduced ? 0 : 0.07, delayChildren: 0.12 } } }}>
                      {[
                        <p key="m" className="font-mono text-xs tabular-nums text-signal-700 dark:text-signal-300">{String(idx + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')} · {proj.category} · {proj.year}</p>,
                        <Title key="t" id={`${uid}-t`} className="mt-2 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">{proj.title}</Title>,
                        <p key="b" className="mt-4 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">{proj.blurb}</p>,
                        proj.role ? <p key="r" className="mt-5 text-sm"><span className="text-zinc-600 dark:text-zinc-400">Role</span><br /><span className="font-medium">{proj.role}</span></p> : null,
                        proj.tags ? <ul key="g" className="mt-5 flex flex-wrap gap-1.5">{proj.tags.map((t) => <li key={t} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">{t}</li>)}</ul> : null,
                      ].map((n, k) => n && <motion.div key={k} variants={{ h: { opacity: 0, y: reduced ? 0 : 16 }, s: { opacity: 1, y: 0 } }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}>{n}</motion.div>)}
                    </motion.div>
                    <div className="mt-8 flex items-center justify-between gap-2">
                      <div className="flex gap-1.5">
                        <button type="button" onClick={() => nav(-1)} aria-label="Previous project" className="grid h-11 w-11 place-items-center rounded-full border border-zinc-300 hover:bg-zinc-100 active:scale-90 motion-reduce:active:scale-100 dark:border-zinc-700 dark:hover:bg-zinc-800"><ArrowLeft className="h-4 w-4" aria-hidden /></button>
                        <button type="button" onClick={() => nav(1)} aria-label="Next project" className="grid h-11 w-11 place-items-center rounded-full border border-zinc-300 hover:bg-zinc-100 active:scale-90 motion-reduce:active:scale-100 dark:border-zinc-700 dark:hover:bg-zinc-800"><ArrowRight className="h-4 w-4" aria-hidden /></button>
                      </div>
                      {proj.href && <a href={proj.href} className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200">View project <ArrowUpRight className="h-4 w-4" aria-hidden /></a>}
                    </div>
                  </div>
                  <button data-close type="button" onClick={() => set(null)} aria-label="Close project details" className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-zinc-950 shadow-md backdrop-blur hover:bg-white active:scale-90 motion-reduce:active:scale-100"><X className="h-5 w-5" aria-hidden /></button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </div>
  )
}
