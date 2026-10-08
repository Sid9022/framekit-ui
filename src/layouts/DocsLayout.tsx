import * as React from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronRight, Menu, Search, X } from 'lucide-react'
import { GithubIcon } from '@/components/icons'
import { SITE } from '@/config/site'
import { categorySlug, getNavGroups } from '@/docs/registry'
import { BrandLink, SearchTrigger, ThemeToggleButton, iconBtn } from '@/components/docs/chrome'
import { useCommandPalette } from '@/components/command-palette'
import { cn } from '@/lib/cn'

type Groups = ReturnType<typeof getNavGroups>

function SidebarNav({
  groups,
  openMap,
  setOpenMap,
  activeSlug,
  onNavigate,
  id,
}: {
  groups: Groups
  openMap: Record<string, boolean>
  setOpenMap: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  activeSlug: string
  onNavigate?: () => void
  id: string
}) {
  const navRef = React.useRef<HTMLElement>(null)
  const allOpen = groups.every((g) => openMap[g.title])

  // Keep the current page visible in the scrolling sidebar.
  React.useEffect(() => {
    const el = navRef.current?.querySelector<HTMLElement>('[aria-current="page"]')
    el?.scrollIntoView({ block: 'center' })
  }, [id])

  return (
    <nav ref={navRef} aria-label="Documentation" className="framekit-scroll h-full overflow-y-auto overscroll-contain px-3 pb-10 pt-3">
      <div className="mb-1 flex items-center justify-between px-2">
        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{groups.length} categories</p>
        <button
          type="button"
          onClick={() => setOpenMap(Object.fromEntries(groups.map((g) => [g.title, !allOpen])))}
          className="rounded-md px-1.5 py-1 text-xs font-medium text-zinc-700 underline-offset-2 transition-colors hover:bg-zinc-100 hover:text-zinc-950 hover:underline dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
        >
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>
      {groups.map((group) => {
        const open = !!openMap[group.title]
        const panelId = `${id}-${categorySlug(group.title)}`
        const containsActive = group.items.some((i) => i.slug === activeSlug)
        return (
          <div key={group.title} className="border-b border-zinc-200/70 py-1 last:border-0 dark:border-zinc-800/70">
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenMap((m) => ({ ...m, [group.title]: !open }))}
              className="fk-touch group flex min-h-9 w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              <ChevronRight
                aria-hidden
                className={cn('h-3.5 w-3.5 shrink-0 text-zinc-500 transition-transform duration-300 ease-[var(--ease-out-expo)] motion-reduce:transition-none', open && 'rotate-90')}
              />
              <span className={cn('flex-1 text-[13px] font-semibold tracking-tight', containsActive ? 'text-zinc-950 dark:text-white' : 'text-zinc-700 dark:text-zinc-300')}>
                {group.title}
              </span>
              <span className="rounded-full bg-zinc-100 px-1.5 py-px text-[11px] tabular-nums text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{group.items.length}</span>
            </button>
            <div
              id={panelId}
              inert={!open}
              className={cn(
                'grid transition-[grid-template-rows,opacity] duration-300 ease-[var(--ease-out-expo)] motion-reduce:transition-none',
                open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <ul className="min-h-0 overflow-hidden">
                {group.title !== 'Getting Started' && (
                  <li>
                    <NavLink
                      to={`/docs/category/${categorySlug(group.title)}`}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        cn(
                          'fk-touch ml-3 flex min-h-8 items-center rounded-lg px-2.5 py-1 text-[13px] italic transition-colors',
                          isActive ? 'bg-signal-100 text-zinc-950 dark:bg-signal-900/50 dark:text-signal-100' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white',
                        )
                      }
                    >
                      Overview
                    </NavLink>
                  </li>
                )}
                {group.items.map((item) => (
                  <li key={item.slug}>
                    <NavLink
                      to={`/docs/${item.slug}`}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        cn(
                          'fk-touch relative ml-3 flex min-h-8 items-center justify-between gap-2 rounded-lg px-2.5 py-1 text-[13px] transition-[background-color,color,transform] duration-150 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100',
                          isActive
                            ? 'bg-signal-100 font-semibold text-zinc-950 dark:bg-signal-900/50 dark:text-white'
                            : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <motion.span
                              layoutId={`${id}-active-bar`}
                              aria-hidden
                              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                              className="absolute -left-3 top-1.5 bottom-1.5 w-[3px] rounded-full bg-signal-600 dark:bg-signal-300"
                            />
                          )}
                          <span className="truncate">{item.title}</span>
                          {item.isNew && (
                            <span className="shrink-0 rounded bg-signal-200 px-1.5 py-px text-[10px] font-semibold text-signal-900 dark:bg-signal-800 dark:text-signal-100">NEW</span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      })}
    </nav>
  )
}

function MobileDrawer({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  const panelRef = React.useRef<HTMLDivElement>(null)
  const closeRef = React.useRef<HTMLButtonElement>(null)
  const returnFocus = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    if (!open) return
    returnFocus.current = document.activeElement as HTMLElement | null
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => closeRef.current?.focus(), 30)
    return () => {
      window.clearTimeout(t)
      document.body.style.overflow = prev
      returnFocus.current?.focus?.()
    }
  }, [open])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onClose()
      return
    }
    if (e.key !== 'Tab') return
    const f = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []).filter((el) => !el.closest('[inert]'))
    if (!f.length) return
    const first = f[0]
    const last = f[f.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" onKeyDown={onKeyDown}>
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="absolute inset-y-0 left-0 flex w-[min(88vw,20rem)] flex-col border-r border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 36, mass: 0.8 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.4, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80 || info.velocity.x < -500) onClose()
            }}
          >
            <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">
              <BrandLink />
              <button ref={closeRef} type="button" onClick={onClose} className={iconBtn} aria-label="Close navigation">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="min-h-0 flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function DocsLayout() {
  const [mobileNav, setMobileNav] = React.useState(false)
  const location = useLocation()
  const { setOpen: openPalette } = useCommandPalette()
  const groups = React.useMemo(() => getNavGroups(), [])
  const mainRef = React.useRef<HTMLElement>(null)

  const parts = location.pathname.split('/').filter(Boolean)
  const activeSlug = parts[0] === 'docs' && parts[1] !== 'category' ? (parts[1] ?? '') : ''
  const activeCategory = parts[1] === 'category' ? parts[2] : undefined

  // Open the group that contains the current page (and Getting Started by default).
  const [openMap, setOpenMap] = React.useState<Record<string, boolean>>(() => ({ 'Getting Started': true }))
  React.useEffect(() => {
    const g = groups.find((x) => x.items.some((i) => i.slug === activeSlug) || categorySlug(x.title) === activeCategory)
    if (g) setOpenMap((m) => (m[g.title] ? m : { ...m, [g.title]: true }))
  }, [activeSlug, activeCategory, groups])

  // Scroll position (top on navigation, restore on Back/Forward) is handled by <ScrollManager />.
  React.useEffect(() => {
    setMobileNav(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault()
          mainRef.current?.focus()
          mainRef.current?.scrollIntoView()
        }}
        className="sr-only z-[80] rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3 dark:bg-white dark:text-zinc-950"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-2 px-3 sm:px-4">
          <button type="button" className={cn(iconBtn, 'lg:hidden')} onClick={() => setMobileNav(true)} aria-label="Open navigation" aria-haspopup="dialog" aria-expanded={mobileNav}>
            <Menu className="h-5 w-5" aria-hidden />
          </button>
          <BrandLink />
          <nav aria-label="Primary" className="ml-4 hidden items-center gap-1 md:flex">
            <Link to="/docs/introduction" className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200/70 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white">
              Docs
            </Link>
            <Link to="/docs/installation" className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200/70 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white">
              Install
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <SearchTrigger />
            <ThemeToggleButton />
            <a href={SITE.github} target="_blank" rel="noreferrer" className={iconBtn} aria-label="Framekit UI on GitHub (opens in a new tab)">
              <GithubIcon className="h-[18px] w-[18px]" />
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1440px]">
        <aside aria-label="Sidebar" className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 border-r border-zinc-200 lg:block dark:border-zinc-800">
          <SidebarNav id="side" groups={groups} openMap={openMap} setOpenMap={setOpenMap} activeSlug={activeSlug} />
        </aside>
        <main id="main" ref={mainRef} tabIndex={-1} className="min-w-0 flex-1 px-4 pb-24 pt-8 outline-none sm:px-8 lg:px-12">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      <MobileDrawer open={mobileNav} onClose={() => setMobileNav(false)}>
        <div className="flex h-full flex-col">
          <div className="px-3 pt-3">
            <button
              type="button"
              onClick={() => {
                setMobileNav(false)
                window.setTimeout(() => openPalette(true), 180)
              }}
              className="flex h-11 w-full items-center gap-2 rounded-xl border border-zinc-300 bg-zinc-50 px-3 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
            >
              <Search className="h-4 w-4" aria-hidden /> Search components…
            </button>
          </div>
          <div className="min-h-0 flex-1">
            <SidebarNav id="drawer" groups={groups} openMap={openMap} setOpenMap={setOpenMap} activeSlug={activeSlug} onNavigate={() => setMobileNav(false)} />
          </div>
        </div>
      </MobileDrawer>
    </div>
  )
}
