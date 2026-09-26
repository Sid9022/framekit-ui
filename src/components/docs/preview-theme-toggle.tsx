import * as React from 'react'
import { motion } from 'motion/react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/cn'

export type PreviewTheme = 'light' | 'dark'

const KEY = 'framekit-preview-theme'

function readInitial(): PreviewTheme {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem(KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

const listeners = new Set<(t: PreviewTheme) => void>()

/** Shared, persisted preview-stage theme (independent from the site theme). */
export function usePreviewTheme() {
  const [theme, setThemeState] = React.useState<PreviewTheme>(readInitial)
  React.useEffect(() => {
    const fn = (t: PreviewTheme) => setThemeState(t)
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  }, [])
  const setTheme = React.useCallback((t: PreviewTheme) => {
    localStorage.setItem(KEY, t)
    listeners.forEach((l) => l(t))
  }, [])
  return [theme, setTheme] as const
}

const OPTIONS = [
  { value: 'light' as const, label: 'Light', Icon: Sun },
  { value: 'dark' as const, label: 'Dark', Icon: Moon },
]

export function PreviewThemeToggle({
  value,
  onChange,
  className,
}: {
  value: PreviewTheme
  onChange: (t: PreviewTheme) => void
  className?: string
}) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([])
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const next = value === 'light' ? 'dark' : 'light'
    onChange(next)
    refs.current[next === 'light' ? 0 : 1]?.focus()
  }
  return (
    <div
      role="radiogroup"
      aria-label="Preview background"
      onKeyDown={onKeyDown}
      className={cn(
        'relative inline-flex items-center gap-0.5 rounded-full border border-zinc-200 bg-white/80 p-0.5 shadow-[0_1px_2px_rgb(0_0_0/0.04)] backdrop-blur',
        'dark:border-zinc-800 dark:bg-zinc-950/70 dark:shadow-none',
        className,
      )}
    >
      {OPTIONS.map(({ value: v, label, Icon }, i) => {
        const active = value === v
        return (
          <button
            key={v}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${label} preview`}
            title={`${label} preview`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(v)}
            className={cn(
              'relative z-0 inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium outline-none transition-colors duration-200',
              'focus-visible:ring-2 focus-visible:ring-signal-400/70',
              active ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200',
            )}
          >
            {active && (
              <motion.span
                layoutId="preview-theme-pill"
                transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }}
                className={cn(
                  'absolute inset-0 -z-10 rounded-full',
                  v === 'light'
                    ? 'bg-gradient-to-b from-amber-50 to-white shadow-[0_1px_2px_rgb(0_0_0/0.08),inset_0_0_0_1px_rgb(251_191_36/0.35)]'
                    : 'bg-gradient-to-b from-zinc-800 to-zinc-900 shadow-[0_1px_2px_rgb(0_0_0/0.3),inset_0_1px_0_rgb(255_255_255/0.08)]',
                )}
              />
            )}
            <motion.span
              key={active ? `${v}-on` : `${v}-off`}
              initial={active ? { rotate: v === 'light' ? -90 : 40, scale: 0.6 } : false}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 18 }}
              className="inline-flex"
            >
              <Icon
                className={cn(
                  'h-3.5 w-3.5',
                  active && v === 'light' && 'text-amber-500',
                  active && v === 'dark' && 'text-signal-300',
                )}
                strokeWidth={2.2}
              />
            </motion.span>
            <span className={cn(active && v === 'dark' && 'text-zinc-50', active && v === 'light' && 'text-zinc-900')}>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
