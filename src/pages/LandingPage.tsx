import * as React from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Menu, Search, X } from 'lucide-react'
import { GithubIcon } from '@/components/icons'
import { GithubStarsChip, GithubStarsPill } from '@/components/github-stars'
import { starsLabel, useGithubStars } from '@/hooks/use-github-stars'
import { SITE } from '@/config/site'
import { componentDocs, categorySlug } from '@/docs/registry'
import { BrandLink, SearchTrigger, ThemeToggleButton, iconBtn } from '@/components/docs/chrome'
import { useCommandPalette } from '@/components/command-palette'
import { cn } from '@/lib/cn'
import { SpecimenHero } from './landing/SpecimenHero'
import { EASE, card, focusRing, pillDark, pillLight, section } from './landing/kit'

const Lab = React.lazy(() => import('./landing/Lab'))

const NAV = [
  { label: 'Components', to: '/docs/introduction' },
  { label: 'Motion', to: `/docs/category/${categorySlug('Motion Showcase')}` },
  { label: 'Widgets', to: `/docs/category/${categorySlug('Data Widgets')}` },
  { label: 'Install', to: '/docs/installation' },
  { label: 'Guides', to: '/guides' },
]

/* ── Mobile sheet: modal dialog with focus trap, Esc, scroll lock and focus return ── */
function MobileSheet({ open, onClose, returnTo }: { open: boolean; onClose: () => void; returnTo: React.RefObject<HTMLButtonElement | null> }) {
  const panel = React.useRef<HTMLDivElement>(null)
  const { setOpen: openSearch } = useCommandPalette()
  const stars = useGithubStars()
  React.useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const main = document.getElementById('main')
    main?.setAttribute('inert', '')
    const t = requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus())
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
      if (e.key !== 'Tab' || !panel.current) return
      const f = [...panel.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled])')]
      if (!f.length) return
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    const btn = returnTo.current
    return () => {
      cancelAnimationFrame(t)
      document.body.style.overflow = prev
      main?.removeAttribute('inert')
      document.removeEventListener('keydown', onKey)
      btn?.focus()
    }
  }, [open, onClose, returnTo])

  // Portal: the sticky header uses backdrop-filter, which would otherwise become the containing block.
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div className="absolute inset-0 bg-zinc-950/30 backdrop-blur-sm dark:bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onClose} aria-hidden />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            id="landing-menu"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            className={cn(card, 'absolute inset-x-3 top-[max(0.75rem,env(safe-area-inset-top))] origin-top overflow-y-auto overscroll-contain rounded-[28px] p-2 shadow-[0_2px_6px_rgb(0_0_0/0.08),0_32px_80px_-32px_rgb(0_0_0/0.45)] max-h-[calc(100dvh-1.5rem)]')}
          >
            <div className="flex h-14 items-center justify-between pl-4 pr-1">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600 dark:text-zinc-400">Menu</span>
              <button type="button" onClick={onClose} className={cn(iconBtn, focusRing)} aria-label="Close menu" data-autofocus>
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <nav aria-label="Mobile">
              <ul>
                {NAV.map((n, i) => (
                  <motion.li key={n.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE, delay: 0.04 + i * 0.04 }}>
                    <Link to={n.to} onClick={onClose} className={cn('group flex min-h-14 items-center justify-between rounded-[20px] px-4 text-[1.375rem] font-semibold tracking-[-0.03em] text-zinc-950 transition-colors hover:bg-black/[0.04] dark:text-white dark:hover:bg-white/[0.06]', focusRing)}>
                      {n.label}
                      <ArrowUpRight className="h-5 w-5 text-zinc-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-black/[0.06] p-2 pt-4 dark:border-white/[0.08]">
              <button type="button" onClick={() => { onClose(); openSearch(true) }} className={cn(pillLight, 'w-full')}>
                <Search className="h-4 w-4" aria-hidden /> Search
              </button>
              <a href={SITE.github} target="_blank" rel="noopener noreferrer" className={cn(pillDark, 'w-full')}>
                <GithubIcon className="h-4 w-4" /> Star
                <GithubStarsChip className="rounded-full bg-white/15 px-2 py-0.5 text-[12px] dark:bg-zinc-950/10" />
                <span className="sr-only"> {starsLabel(stars).replace(/^Star /, '')}</span>
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

function Nav() {
  const [open, setOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const trigger = React.useRef<HTMLButtonElement>(null)
  const close = React.useCallback(() => setOpen(false), [])
  React.useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b pt-[env(safe-area-inset-top)] transition-[background-color,border-color,backdrop-filter] duration-300',
        scrolled ? 'border-black/[0.06] bg-[var(--pp)]/80 backdrop-blur-xl backdrop-saturate-150 dark:border-white/[0.08]' : 'border-transparent',
      )}
    >
      <div className={cn(section, 'flex h-16 items-center gap-3')}>
        <BrandLink compact className="shrink-0" />
        <nav aria-label="Primary" className="mx-auto hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link key={n.label} to={n.to} className={cn('rounded-full px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-black/[0.04] hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white', focusRing)}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          {/* Mobile bar (mark only): star · search · theme · menu, like magicui.design. From sm up the pill sits after the theme toggle. */}
          <GithubStarsPill tone="landing" className="sm:hidden" />
          <SearchTrigger className="shrink-0 whitespace-nowrap" />
          <ThemeToggleButton className="shrink-0" />
          <GithubStarsPill tone="landing" className="ml-1 hidden sm:inline-flex" />
          <button ref={trigger} type="button" className={cn(iconBtn, 'shrink-0 lg:hidden')} aria-expanded={open} aria-controls="landing-menu" aria-haspopup="dialog" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>
      <MobileSheet open={open} onClose={close} returnTo={trigger} />
    </header>
  )
}

export function LandingPage() {
  const count = componentDocs.length
  return (
    <div className="paper min-h-screen overflow-x-clip bg-[var(--pp)] text-[var(--pi)] antialiased [-webkit-tap-highlight-color:transparent]">
      <a href="#main" className={cn('sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-zinc-950 focus:px-4 focus:py-2 focus:text-white')}>Skip to content</a>
      <Nav />
      <main id="main">
        <SpecimenHero count={count} />
        <React.Suspense fallback={<div className="h-[100vh]" aria-hidden />}>
          <Lab />
        </React.Suspense>
      </main>
    </div>
  )
}
