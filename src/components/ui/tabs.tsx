import * as React from 'react'
import { cn } from '@/lib/cn'

type TabsCtx = { value: string; setValue: (v: string) => void; baseId: string }
const Ctx = React.createContext<TabsCtx | null>(null)

export function Tabs({
  defaultValue,
  value: controlled,
  onValueChange,
  className,
  children,
}: {
  defaultValue: string
  value?: string
  onValueChange?: (v: string) => void
  className?: string
  children: React.ReactNode
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const baseId = React.useId()
  const value = controlled ?? uncontrolled
  const setValue = (v: string) => {
    setUncontrolled(v)
    onValueChange?.(v)
  }
  return (
    <Ctx.Provider value={{ value, setValue, baseId }}>
      <div className={cn('w-full min-w-0', className)}>{children}</div>
    </Ctx.Provider>
  )
}

/**
 * Tab strip. Never wider than its container: when the triggers don't fit (narrow phones) the list
 * scrolls inside itself instead of pushing the page sideways. Arrow keys / Home / End move between tabs.
 */
export function TabsList({ className, onKeyDown, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e)
    if (e.defaultPrevented) return
    const tabs = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'))
    const i = tabs.indexOf(document.activeElement as HTMLButtonElement)
    if (i < 0) return
    let n = i
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length
    else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length
    else if (e.key === 'Home') n = 0
    else if (e.key === 'End') n = tabs.length - 1
    else return
    e.preventDefault()
    tabs[n].focus()
    tabs[n].click()
  }
  return (
    <div
      role="tablist"
      onKeyDown={handleKeyDown}
      className={cn(
        'inline-flex h-10 max-w-full items-center gap-1 overflow-x-auto rounded-xl bg-zinc-100 p-1 [scrollbar-width:none] dark:bg-zinc-800/80 [&::-webkit-scrollbar]:hidden',
        className,
      )}
      {...props}
    />
  )
}

export function TabsTrigger({
  value,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const ctx = React.useContext(Ctx)!
  const active = ctx.value === value
  return (
    <button
      type="button"
      role="tab"
      id={`${ctx.baseId}-tab-${value}`}
      aria-selected={active}
      aria-controls={`${ctx.baseId}-panel-${value}`}
      tabIndex={active ? 0 : -1}
      onClick={() => ctx.setValue(value)}
      className={cn(
        'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-[background-color,color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 pointer-coarse:min-h-11',
        active
          ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50'
          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200',
        className,
      )}
      {...props}
    />
  )
}

export function TabsContent({
  value,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const ctx = React.useContext(Ctx)!
  if (ctx.value !== value) return null
  return (
    <div
      role="tabpanel"
      id={`${ctx.baseId}-panel-${value}`}
      aria-labelledby={`${ctx.baseId}-tab-${value}`}
      tabIndex={0}
      className={cn('mt-4 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-signal-500', className)}
      {...props}
    />
  )
}
