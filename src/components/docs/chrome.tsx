import * as React from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Flame, Moon, Search, Sun } from 'lucide-react'
import { SITE } from '@/config/site'
import { useThemeToggle } from '@/components/theme-provider'
import { useCommandPalette, useShortcutLabel } from '@/components/command-palette'
import { cn } from '@/lib/cn'

/** 44px icon button used across the docs chrome (Fitts: generous, consistent targets). */
export const iconBtn =
  'inline-grid h-11 w-11 place-items-center rounded-xl text-zinc-700 transition-[background-color,color,transform] duration-150 ease-out hover:bg-zinc-200/70 hover:text-zinc-950 active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white'

export function BrandLink({ className }: { className?: string }) {
  return (
    <Link to="/" aria-label={`${SITE.name} home`} className={cn('group -ml-1 flex items-center gap-2.5 rounded-xl px-1 py-1 font-semibold tracking-tight', className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-950 text-signal-300 shadow-[0_1px_2px_rgb(0_0_0/0.2),inset_0_1px_0_rgb(255_255_255/0.12)] transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:-rotate-6 group-hover:scale-105 motion-reduce:transition-none dark:bg-zinc-100 dark:text-signal-800">
        <Flame className="h-4 w-4" aria-hidden />
      </span>
      <span>{SITE.name}</span>
    </Link>
  )
}

export function ThemeToggleButton({ className }: { className?: string }) {
  const { theme, toggle } = useThemeToggle()
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <button type="button" onClick={toggle} className={cn(iconBtn, 'relative overflow-hidden', className)} aria-label={`Switch to ${next} theme`} title={`Switch to ${next} theme`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -70, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 70, scale: 0.6 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="grid place-items-center"
        >
          {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" aria-hidden /> : <Moon className="h-[18px] w-[18px]" aria-hidden />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

/** Wide "search field" on desktop, icon button on small screens — both open the palette. */
export function SearchTrigger({ className }: { className?: string }) {
  const { setOpen } = useCommandPalette()
  const label = useShortcutLabel()
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-keyshortcuts="Control+K Meta+K"
        className={cn(
          'hidden h-10 w-56 items-center gap-2 rounded-xl border border-zinc-300 bg-white/70 px-3 text-sm text-zinc-600 shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-[border-color,background-color,box-shadow] duration-150 hover:border-zinc-400 hover:bg-white md:inline-flex lg:w-64 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400 dark:shadow-none dark:hover:border-zinc-500 dark:hover:bg-zinc-900',
          className,
        )}
      >
        <Search className="h-4 w-4" aria-hidden />
        <span className="flex-1 text-left">Search components…</span>
        <kbd className="rounded-md border border-zinc-300 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 dark:border-zinc-600 dark:text-zinc-400">{label}</kbd>
      </button>
      <button type="button" onClick={() => setOpen(true)} className={cn(iconBtn, 'md:hidden')} aria-label="Search components" aria-haspopup="dialog">
        <Search className="h-[18px] w-[18px]" aria-hidden />
      </button>
    </>
  )
}
