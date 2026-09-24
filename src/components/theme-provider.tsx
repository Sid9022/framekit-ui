import * as React from 'react'
import { useTheme, type Theme } from '@/hooks/use-theme'

const ThemeCtx = React.createContext<{ theme: Theme; toggle: () => void } | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, toggle } = useTheme()
  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>
}

export function useThemeToggle() {
  const ctx = React.useContext(ThemeCtx)
  if (!ctx) throw new Error('useThemeToggle requires ThemeProvider')
  return ctx
}
