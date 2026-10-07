import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, Menu, X, Boxes, Zap, Shield, BarChart3, BookOpen, Newspaper, LifeBuoy, Users } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type MegaLink = { label: string; description?: string; href?: string; icon?: React.ReactNode }
export type NavItem = { label: string; href?: string; links?: MegaLink[]; feature?: { title: string; description: string } }

export type GlassMegaNavbarProps = {
  brand?: React.ReactNode
  items?: NavItem[]
  /** px of scroll inside `scrollContainer` (or window) before the bar shrinks into a floating pill. */
  shrinkAt?: number
  /** Element whose scroll drives the shrink. Defaults to window. */
  scrollContainer?: React.RefObject<HTMLElement | null>
  ctaLabel?: string
  className?: string
}

export const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: 'Product', links: [
    { label: 'Platform', description: 'Ship from one workspace', icon: <Boxes /> },
    { label: 'Edge functions', description: 'Run code close to users', icon: <Zap /> },
    { label: 'Security', description: 'SSO, audit logs and SOC 2', icon: <Shield /> },
    { label: 'Analytics', description: 'Real-time, privacy-first', icon: <BarChart3 /> },
  ], feature: { title: 'What’s new in 4.0', description: 'Instant previews, branch databases and a faster build cache.' } },
  { label: 'Resources', links: [
    { label: 'Docs', description: 'Guides and API reference', icon: <BookOpen /> },
    { label: 'Blog', description: 'Engineering and product notes', icon: <Newspaper /> },
    { label: 'Support', description: 'We reply within a day', icon: <LifeBuoy /> },
    { label: 'Community', description: '40k builders on Discord', icon: <Users /> },
  ] },
  { label: 'Pricing', href: '#' },
  { label: 'Customers', href: '#' },
]

/**
 * Glass Mega Navbar — a full-width bar that, once you scroll, contracts into a
 * floating glass pill. Menus open into a single mega panel that morphs its
 * size between sections, with a hover pill that glides between triggers.
 * Disclosure-pattern a11y, Esc closes, mobile sheet below 768 px.
 */
export function GlassMegaNavbar({ brand, items = DEFAULT_NAV_ITEMS, shrinkAt = 24, scrollContainer, ctaLabel = 'Start building', className }: GlassMegaNavbarProps) {
  const reduced = usePrefersReducedMotion()
  const [scrolled, setScrolled] = React.useState(false)
  const [open, setOpen] = React.useState<number | null>(null)
  const [hover, setHover] = React.useState<number | null>(null)
  const [mobile, setMobile] = React.useState(false)
  const [dir, setDir] = React.useState(0)
  const closeT = React.useRef<number | undefined>(undefined)
  const id = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const el = scrollContainer?.current
    const read = () => setScrolled((el ? el.scrollTop : window.scrollY) > shrinkAt)
    read()
    const t: HTMLElement | Window = el ?? window
    t.addEventListener('scroll', read, { passive: true })
    return () => t.removeEventListener('scroll', read)
  }, [scrollContainer, shrinkAt])
  React.useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(null); setMobile(false) } }
    const c = (e: PointerEvent) => { if (!rootRef.current?.contains(e.target as Node)) setOpen(null) }
    window.addEventListener('keydown', k); window.addEventListener('pointerdown', c)
    return () => { window.removeEventListener('keydown', k); window.removeEventListener('pointerdown', c) }
  }, [])

  const show = (i: number | null) => {
    window.clearTimeout(closeT.current)
    if (i !== null && open !== null && i !== open) setDir(i > open ? 1 : -1)
    setOpen(i)
  }
  const scheduleClose = () => { closeT.current = window.setTimeout(() => setOpen(null), 140) }
  const current = open !== null ? items[open] : null
  const spring = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 380, damping: 34 }

  return (
    <header ref={rootRef} className={cn('sticky top-0 z-30 flex justify-center', className)}>
      <motion.div
        layout={!reduced}
        transition={spring}
        className={cn(
          'relative flex w-full items-center gap-2 border-black/[0.08] backdrop-blur-xl backdrop-saturate-150 dark:border-white/10 [@media(prefers-reduced-transparency:reduce)]:bg-white [@media(prefers-reduced-transparency:reduce)]:dark:bg-zinc-950',
          scrolled
            ? 'mt-3 max-w-[760px] rounded-full border bg-white/75 px-2 py-1.5 shadow-[0_1px_2px_rgb(0_0_0/0.06),0_16px_40px_-20px_rgb(24_24_27/0.35)] dark:bg-zinc-900/75 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]'
            : 'max-w-full rounded-none border-b bg-white/60 px-4 py-3 sm:px-6 dark:bg-zinc-950/60',
        )}
      >
        <a href="#" className="mr-2 flex items-center gap-2 rounded-full px-2 text-sm font-semibold tracking-tight text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 dark:text-white">
          {brand ?? (<><span aria-hidden className="grid size-6 place-items-center rounded-[7px] bg-zinc-900 text-[11px] text-white dark:bg-white dark:text-zinc-900">▲</span>Northwind</>)}
        </a>
        <nav aria-label="Main" className="hidden flex-1 md:block" onMouseLeave={() => { setHover(null); scheduleClose() }}>
          <ul className="flex items-center gap-0.5">
            {items.map((it, i) => (
              <li key={it.label} className="relative" onMouseEnter={() => { setHover(i); if (it.links) show(i); else scheduleClose() }}>
                {hover === i && <motion.span layoutId={`${id}-hover`} transition={spring} className="absolute inset-0 rounded-full bg-black/[0.05] dark:bg-white/[0.08]" />}
                {it.links ? (
                  <button type="button" aria-expanded={open === i} aria-controls={`${id}-panel`} onClick={() => (open === i ? setOpen(null) : show(i))}
                    onFocus={() => setHover(i)}
                    className="relative flex h-9 items-center gap-1 rounded-full px-3 text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 dark:text-zinc-300 dark:hover:text-white">
                    {it.label}<ChevronDown aria-hidden className={cn('size-3.5 transition-transform duration-200', open === i && 'rotate-180')} />
                  </button>
                ) : (
                  <a href={it.href} onFocus={() => setHover(i)} className="relative flex h-9 items-center rounded-full px-3 text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 dark:text-zinc-300 dark:hover:text-white">{it.label}</a>
                )}
              </li>
            ))}
          </ul>
          <AnimatePresence>
            {current?.links && (
              <motion.div id={`${id}-panel`} key="panel" onMouseEnter={() => show(open)} onMouseLeave={scheduleClose}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.12 } }}
                transition={spring} layout={!reduced} style={{ x: '-50%' }}
                className="absolute left-1/2 top-[calc(100%+8px)] w-[min(640px,calc(100vw-32px))] overflow-hidden rounded-[20px] border border-black/[0.08] bg-white/90 p-2 shadow-[0_2px_6px_rgb(0_0_0/0.08),0_32px_80px_-32px_rgb(0_0_0/0.45)] backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/90 [@media(prefers-reduced-transparency:reduce)]:bg-white [@media(prefers-reduced-transparency:reduce)]:dark:bg-zinc-900">
                <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                  <motion.div key={open} custom={dir}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, x: dir * 24, filter: 'blur(4px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={reduced ? { opacity: 0 } : { opacity: 0, x: dir * -24, filter: 'blur(4px)' }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className={cn('grid gap-1', current.feature ? 'grid-cols-[1fr_200px]' : 'grid-cols-1')}>
                    <ul className="grid grid-cols-2 gap-1">
                      {current.links.map((l) => (
                        <li key={l.label}><a href={l.href ?? '#'} className="group flex gap-3 rounded-[14px] p-3 transition-colors hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 dark:hover:bg-white/[0.06]">
                          <span className="grid size-9 shrink-0 place-items-center rounded-[10px] border border-black/[0.08] bg-white text-zinc-700 shadow-[0_1px_2px_rgb(0_0_0/0.05)] transition-transform group-hover:scale-105 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 [&_svg]:size-4">{l.icon}</span>
                          <span><span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">{l.label}</span><span className="block text-[13px] text-zinc-600 dark:text-zinc-400">{l.description}</span></span>
                        </a></li>
                      ))}
                    </ul>
                    {current.feature && (
                      <a href="#" className="flex flex-col justify-end rounded-[14px] bg-gradient-to-br from-signal-500/25 via-signal-500/10 to-framekit-500/20 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500">
                        <span className="text-sm font-semibold text-zinc-900 dark:text-white">{current.feature.title}</span>
                        <span className="mt-1 text-[13px] text-zinc-700 dark:text-zinc-300">{current.feature.description}</span>
                      </a>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <a href="#" className="hidden h-9 items-center rounded-full px-3 text-sm font-medium text-zinc-700 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 sm:flex dark:text-zinc-300 dark:hover:text-white">Log in</a>
          <a href="#" className="flex h-9 items-center whitespace-nowrap rounded-full bg-zinc-900 px-3.5 text-sm sm:px-4 font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.15)] transition-transform active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 focus-visible:ring-offset-2 dark:bg-white dark:text-zinc-900">{ctaLabel}</a>
          <button type="button" aria-label={mobile ? 'Close menu' : 'Open menu'} aria-expanded={mobile} aria-controls={`${id}-mobile`} onClick={() => setMobile((m) => !m)}
            className="grid size-10 place-items-center rounded-full text-zinc-800 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 md:hidden dark:text-zinc-200 dark:hover:bg-white/10">
            {mobile ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        <AnimatePresence>
          {mobile && (
            <motion.nav id={`${id}-mobile`} aria-label="Mobile" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: reduced ? 0 : 0.2 }}
              className="absolute inset-x-2 top-[calc(100%+8px)] rounded-[20px] border border-black/[0.08] bg-white p-2 shadow-[0_2px_6px_rgb(0_0_0/0.08),0_32px_80px_-32px_rgb(0_0_0/0.45)] md:hidden dark:border-white/10 dark:bg-zinc-900">
              {items.map((it) => (
                <details key={it.label} className="group rounded-[14px] [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex h-11 cursor-pointer list-none items-center justify-between rounded-[12px] px-3 text-[15px] font-medium text-zinc-900 hover:bg-black/[0.04] dark:text-zinc-100 dark:hover:bg-white/[0.06]">
                    {it.label}{it.links && <ChevronDown aria-hidden className="size-4 transition-transform group-open:rotate-180" />}
                  </summary>
                  {it.links && <ul className="pb-2 pl-3">{it.links.map((l) => <li key={l.label}><a href="#" className="flex h-10 items-center gap-2 rounded-[10px] px-3 text-sm text-zinc-700 dark:text-zinc-300 [&_svg]:size-4">{l.icon}{l.label}</a></li>)}</ul>}
                </details>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  )
}
