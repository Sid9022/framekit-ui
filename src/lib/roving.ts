import type * as React from 'react'

/**
 * Arrow-key navigation for a WAI-ARIA tablist / radiogroup. Attach to the container's onKeyDown;
 * it moves focus to the neighbouring `[role=tab]` / `[role=radio]` and activates it (automatic activation).
 */
export function handleTablistKeys(e: React.KeyboardEvent<HTMLElement>) {
  const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled]), [role="radio"]:not([disabled])'))
  const i = items.indexOf(document.activeElement as HTMLElement)
  if (i < 0 || !items.length) return
  let n = i
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % items.length
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + items.length) % items.length
  else if (e.key === 'Home') n = 0
  else if (e.key === 'End') n = items.length - 1
  else return
  e.preventDefault()
  items[n].focus()
  items[n].click()
}
