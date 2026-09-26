import { useLayoutEffect, useState, type RefObject } from 'react'

export type ThemeMode = 'auto' | 'light' | 'dark'

function resolve(el: Element | null): 'light' | 'dark' {
  const scope = el?.closest('.dark, .light')
  if (scope) return scope.classList.contains('dark') ? 'dark' : 'light'
  return 'light'
}

/**
 * Resolves the effective theme for canvas / JS-drawn components.
 * `auto` follows the nearest ancestor with a `dark` or `light` class
 * (the same rule as Tailwind's `dark:` variant) and reacts to changes.
 */
export function useResolvedTheme(ref: RefObject<Element | null>, mode: ThemeMode = 'auto') {
  const [theme, setTheme] = useState<'light' | 'dark'>(mode === 'auto' ? 'dark' : mode)
  useLayoutEffect(() => {
    if (mode !== 'auto') {
      setTheme(mode)
      return
    }
    const el = ref.current
    const update = () => setTheme(resolve(el))
    update()
    const mo = new MutationObserver(update)
    for (let n = el?.parentElement; n; n = n.parentElement) {
      mo.observe(n, { attributes: true, attributeFilter: ['class'] })
    }
    return () => mo.disconnect()
  }, [ref, mode])
  return theme
}
