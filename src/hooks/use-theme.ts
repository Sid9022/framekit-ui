import * as React from 'react'

export type Theme = 'light' | 'dark'

export function useTheme() {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark'
    const stored = localStorage.getItem('framekit-theme') as Theme | null
    if (stored === 'light' || stored === 'dark') return stored
    // First visit: honour the OS preference (dark remains the fallback).
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('framekit-theme', theme)
  }, [theme])

  const setTheme = (t: Theme) => setThemeState(t)
  const toggle = () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark'))
  return { theme, setTheme, toggle }
}
