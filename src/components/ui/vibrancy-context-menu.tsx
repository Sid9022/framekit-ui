import * as React from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Copy, Link2, MousePointerClick, Pencil, Pin, Share, Trash2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type ContextMenuItem =
  | { type?: 'item'; id: string; label: string; icon?: React.ReactNode; shortcut?: string; destructive?: boolean; disabled?: boolean; checked?: boolean; onSelect?: () => void }
  | { type: 'separator'; id: string }

export type VibrancyContextMenuProps = {
  /** Menu entries; use `{ type: 'separator' }` between groups. */
  items?: ContextMenuItem[]
  /** Fires with the chosen item id. */
  onSelect?: (id: string) => void
  /** The area that listens for right-click / long-press. Defaults to a file card. */
  children?: React.ReactNode
  /** Accessible name of the menu. */
  label?: string
  className?: string
}

export const DEFAULT_CONTEXT_ITEMS: ContextMenuItem[] = [
  { id: 'open', label: 'Open', icon: <MousePointerClick />, shortcut: '⌘O' },
  { id: 'rename', label: 'Rename…', icon: <Pencil />, shortcut: '↵' },
  { id: 'dup', label: 'Duplicate', icon: <Copy />, shortcut: '⌘D' },
  { type: 'separator', id: 's1' },
  { id: 'pin', label: 'Pin to sidebar', icon: <Pin />, checked: true },
  { id: 'link', label: 'Copy link', icon: <Link2 />, shortcut: '⇧⌘C' },
  { id: 'share', label: 'Share…', icon: <Share />, disabled: true },
  { type: 'separator', id: 's2' },
  { id: 'delete', label: 'Move to Trash', icon: <Trash2 />, shortcut: '⌘⌫', destructive: true },
]

const W = 232

/**
 * Vibrancy Context Menu — a macOS-grade context menu on regular glass: it
 * blooms from the exact pointer position (transform-origin follows the click
 * and flips near the edges), a highlight capsule glides between rows, and a
 * chosen item blinks once before the menu dissolves — the way native menus
 * confirm a pick. Right-click, long-press, Shift+F10 or the Menu key open it;
 * arrows, Home/End, typeahead and Esc work as expected.
 */
export function VibrancyContextMenu({ items = DEFAULT_CONTEXT_ITEMS, onSelect, children, label = 'File actions', className }: VibrancyContextMenuProps) {
  const reduced = usePrefersReducedMotion()
  const id = React.useId()
  const areaRef = React.useRef<HTMLDivElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const [pos, setPos] = React.useState<{ x: number; y: number; ox: string; oy: string } | null>(null)
  const [active, setActive] = React.useState(-1)
  const [blink, setBlink] = React.useState<string | null>(null)
  const [host, setHost] = React.useState<Element | null>(null)
  const [announce, setAnnounce] = React.useState('')
  const [pinned, setPinned] = React.useState<Record<string, boolean>>(() => Object.fromEntries(items.filter((i) => i.type !== 'separator' && 'checked' in i).map((i) => [i.id, !!(i as { checked?: boolean }).checked])))
  const longPress = React.useRef<number>(0)
  const typeahead = React.useRef({ s: '', t: 0 })

  React.useEffect(() => { setHost(areaRef.current?.closest('.dark, .light') ?? document.body) }, [])
  const actionable = items.map((it, i) => ({ it, i })).filter(({ it }) => it.type !== 'separator' && !it.disabled)

  const openAt = (x: number, y: number) => {
    const h = items.length * 34
    const vw = window.innerWidth, vh = window.innerHeight
    const flipX = x + W > vw - 8, flipY = y + h > vh - 8
    setPos({ x: flipX ? Math.max(8, x - W) : x, y: flipY ? Math.max(8, y - h) : y, ox: flipX ? 'right' : 'left', oy: flipY ? 'bottom' : 'top' })
    setActive(-1)
  }
  const close = (focusBack = true) => { setPos(null); if (focusBack) areaRef.current?.focus({ preventScroll: true }) }

  React.useEffect(() => {
    if (!pos) return
    menuRef.current?.focus({ preventScroll: true })
    const down = (e: PointerEvent) => { if (!menuRef.current?.contains(e.target as Node)) close(false) }
    const away = () => close(false)
    window.addEventListener('pointerdown', down, true)
    window.addEventListener('resize', away)
    window.addEventListener('scroll', away, true)
    return () => { window.removeEventListener('pointerdown', down, true); window.removeEventListener('resize', away); window.removeEventListener('scroll', away, true) }
  }, [pos])

  const choose = (idx: number) => {
    const it = items[idx]
    if (!it || it.type === 'separator' || it.disabled) return
    if ('checked' in it && it.checked !== undefined) setPinned((p) => ({ ...p, [it.id]: !p[it.id] }))
    setBlink(it.id)
    window.setTimeout(() => {
      setBlink(null)
      close()
      it.onSelect?.()
      onSelect?.(it.id)
      setAnnounce(`${it.label.replace('…', '')} selected`)
    }, reduced ? 0 : 160)
  }

  const onMenuKey = (e: React.KeyboardEvent) => {
    const pos2 = actionable.findIndex(({ i }) => i === active)
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(actionable[(pos2 + 1) % actionable.length].i) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(actionable[(pos2 - 1 + actionable.length) % actionable.length].i) }
    else if (e.key === 'Home') { e.preventDefault(); setActive(actionable[0].i) }
    else if (e.key === 'End') { e.preventDefault(); setActive(actionable[actionable.length - 1].i) }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(active) }
    else if (e.key === 'Escape' || e.key === 'Tab') { e.preventDefault(); close() }
    else if (e.key.length === 1 && /\S/.test(e.key)) {
      const now = Date.now()
      typeahead.current = { s: (now - typeahead.current.t < 600 ? typeahead.current.s : '') + e.key.toLowerCase(), t: now }
      const hit = actionable.find(({ it }) => it.type !== 'separator' && it.label.toLowerCase().startsWith(typeahead.current.s))
      if (hit) setActive(hit.i)
    }
  }

  const openFromKeyboard = () => {
    const r = areaRef.current?.getBoundingClientRect()
    if (r) openAt(r.left + 24, r.top + 24)
  }

  return (
    <>
      <div
        ref={areaRef}
        tabIndex={0}
        role="button"
        aria-haspopup="menu"
        aria-expanded={!!pos}
        aria-label={`${label}: press Shift+F10 or right-click for actions`}
        onContextMenu={(e) => { e.preventDefault(); openAt(e.clientX, e.clientY) }}
        onKeyDown={(e) => { if ((e.shiftKey && e.key === 'F10') || e.key === 'ContextMenu') { e.preventDefault(); openFromKeyboard() } }}
        onPointerDown={(e) => {
          if (e.pointerType !== 'touch') return
          const { clientX, clientY } = e
          longPress.current = window.setTimeout(() => openAt(clientX, clientY), 480)
        }}
        onPointerUp={() => window.clearTimeout(longPress.current)}
        onPointerCancel={() => window.clearTimeout(longPress.current)}
        className={cn(
          'block w-full max-w-sm select-none rounded-[20px] outline-none [-webkit-touch-callout:none]',
          'focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-signal-300 dark:focus-visible:ring-offset-zinc-950',
          className,
        )}
      >
        {children ?? (
          <div className="flex flex-col items-center gap-4 rounded-[20px] border border-dashed border-black/[0.12] bg-white/60 px-6 py-10 text-center dark:border-white/[0.14] dark:bg-white/[0.03]">
            <div aria-hidden className="relative h-20 w-16 rounded-lg bg-gradient-to-b from-sky-100 to-sky-200 shadow-[0_1px_2px_rgb(0_0_0/0.08),0_12px_24px_-12px_rgb(14_116_144/0.5)] ring-1 ring-sky-900/10 dark:from-sky-900 dark:to-sky-950 dark:ring-white/10">
              <span className="absolute right-0 top-0 size-4 rounded-bl-md bg-white/70 dark:bg-white/20" />
              <span className="absolute inset-x-3 bottom-4 h-1 rounded bg-sky-900/20 dark:bg-white/20" />
              <span className="absolute inset-x-3 bottom-7 h-1 rounded bg-sky-900/20 dark:bg-white/20" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100" translate="no">Q3-roadmap.key</p>
              <p className="mt-1 text-[13px] text-zinc-600 dark:text-zinc-400">Right-click, long-press, or focus and press Shift+F10</p>
            </div>
          </div>
        )}
      </div>
      <span role="status" aria-live="polite" className="sr-only">{announce}</span>
      {host && createPortal(
        <AnimatePresence>
          {pos && (
            <motion.div
              ref={menuRef}
              role="menu"
              aria-label={label}
              aria-activedescendant={active >= 0 ? `${id}-${active}` : undefined}
              tabIndex={-1}
              onKeyDown={onMenuKey}
              onContextMenu={(e) => e.preventDefault()}
              className={cn(
                'fixed z-[100] rounded-[14px] p-1.5 outline-none',
                'bg-white/75 backdrop-blur-2xl backdrop-saturate-[1.8] ring-1 ring-black/[0.08]',
                'shadow-[0_2px_6px_rgb(0_0_0/0.08),0_24px_60px_-20px_rgb(0_0_0/0.35),inset_0_1px_0_rgb(255_255_255/0.7)]',
                'dark:bg-zinc-800/70 dark:ring-white/[0.1] dark:shadow-[0_2px_6px_rgb(0_0_0/0.3),0_24px_60px_-20px_rgb(0_0_0/0.7),inset_0_1px_0_rgb(255_255_255/0.08)]',
                '[@media(prefers-reduced-transparency:reduce)]:bg-white [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none dark:[@media(prefers-reduced-transparency:reduce)]:bg-zinc-800',
              )}
              style={{ left: pos.x, top: pos.y, width: W, transformOrigin: `${pos.oy} ${pos.ox}` }}
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98, transition: { duration: 0.12 } }}
              transition={reduced ? { duration: 0.12 } : { type: 'spring', stiffness: 420, damping: 32 }}
              onPointerLeave={() => setActive(-1)}
            >
              {items.map((it, i) => {
                if (it.type === 'separator') return <div key={it.id} role="separator" className="mx-2 my-1 h-px bg-black/[0.08] dark:bg-white/[0.1]" />
                const isActive = i === active
                const checked = 'checked' in it && it.checked !== undefined ? pinned[it.id] : undefined
                return (
                  <motion.div
                    key={it.id}
                    id={`${id}-${i}`}
                    role={checked !== undefined ? 'menuitemcheckbox' : 'menuitem'}
                    aria-checked={checked}
                    aria-disabled={it.disabled || undefined}
                    onPointerMove={() => !it.disabled && setActive(i)}
                    onClick={() => choose(i)}
                    animate={blink === it.id && !reduced ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
                    transition={{ duration: 0.16 }}
                    className={cn(
                      'relative flex h-8 cursor-default items-center gap-2.5 rounded-[8px] px-2 text-[13px] pointer-coarse:h-11',
                      it.disabled ? 'text-zinc-500 dark:text-zinc-500' : it.destructive ? (isActive ? 'text-white' : 'text-rose-700 dark:text-rose-300') : isActive ? 'text-white' : 'text-zinc-900 dark:text-zinc-100',
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId={`${id}-hl`}
                        aria-hidden
                        className={cn('absolute inset-0 -z-0 rounded-[8px]', it.destructive ? 'bg-rose-600' : 'bg-signal-600')}
                        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 40 }}
                      />
                    )}
                    <span aria-hidden className="relative grid size-4 place-items-center [&>svg]:size-4">{it.icon}</span>
                    <span className="relative min-w-0 flex-1 truncate">{it.label}</span>
                    {checked && <Check aria-hidden className="relative size-3.5" />}
                    {it.shortcut && <kbd className={cn('relative font-sans text-xs tabular-nums', isActive ? 'text-white/85' : 'text-zinc-600 dark:text-zinc-400')}>{it.shortcut}</kbd>}
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>,
        host,
      )}
    </>
  )
}
