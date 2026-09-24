import { GithubIcon } from '@/components/icons'
import * as React from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Flame, Menu, Moon, Search, Sun, X } from 'lucide-react'
import { SITE } from '@/config/site'
import { getNavGroups } from '@/docs/registry'
import { useThemeToggle } from '@/components/theme-provider'
import { CommandPalette } from '@/components/command-palette'
import { cn } from '@/lib/cn'

export function DocsLayout() {
  const { theme, toggle } = useThemeToggle()
  const [palette, setPalette] = React.useState(false)
  const [mobileNav, setMobileNav] = React.useState(false)
  const location = useLocation()
  const groups = getNavGroups()

  React.useEffect(() => setMobileNav(false), [location.pathname])

  const sidebar = (
    <nav className="forge-scroll h-full space-y-6 overflow-y-auto px-3 py-4">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{group.title}</p>
          <ul className="space-y-0.5">
            {group.items.map((item) => (
              <li key={item.slug}>
                <NavLink
                  to={`/docs/${item.slug}`}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition',
                      isActive
                        ? 'bg-forge-50 font-medium text-forge-800 dark:bg-forge-950/40 dark:text-forge-200'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100',
                    )
                  }
                >
                  <span>{item.title}</span>
                  {item.unique && (
                    <span className="rounded bg-fuchsia-100 px-1.5 py-0.5 text-[10px] font-semibold text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300">
                      NEW
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4">
          <button type="button" className="rounded-lg p-2 lg:hidden" onClick={() => setMobileNav(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-forge-500 to-orange-600 text-white shadow-md shadow-forge-500/30">
              <Flame className="h-4 w-4" />
            </span>
            {SITE.name}
          </Link>
          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPalette(true)}
              className="hidden items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-500 md:inline-flex dark:border-zinc-800 dark:bg-zinc-900"
            >
              <Search className="h-3.5 w-3.5" />
              Search
              <kbd className="rounded border border-zinc-200 px-1 dark:border-zinc-700">⌘K</kbd>
            </button>
            <button type="button" className="rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 md:hidden" onClick={() => setPalette(true)} aria-label="Search">
              <Search className="h-4 w-4" />
            </button>
            <button type="button" onClick={toggle} className="rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <a href={SITE.github} target="_blank" rel="noreferrer" className="rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900" aria-label="GitHub">
              <GithubIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px]">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 border-r border-zinc-200 dark:border-zinc-800 lg:block">
          {sidebar}
        </aside>
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-8">
          <Outlet />
        </main>
      </div>

      {mobileNav && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileNav(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white shadow-xl dark:bg-zinc-950">
            <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-3 dark:border-zinc-800">
              <span className="font-semibold">{SITE.name}</span>
              <button type="button" onClick={() => setMobileNav(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            {sidebar}
          </div>
        </div>
      )}

      <CommandPalette open={palette} onOpenChange={setPalette} />
    </div>
  )
}
