import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type Shortcut = { id: string; label: string; keys: string[]; group?: string }

export type KbdShortcutHintProps = {
  /** Shortcuts. Use 'mod' for ⌘ on Apple platforms and Ctrl elsewhere; also 'shift', 'alt', 'enter', 'esc', arrows. */
  shortcuts?: Shortcut[]
  /** Platform glyphs: auto-detect, or force. */
  platform?: 'auto' | 'mac' | 'other'
  /** Light up keycaps when the real keys are held. */
  listen?: boolean
  /** Fires when a listed combo is pressed. */
  onTrigger?: (s: Shortcut) => void
  /** Heading above the sheet; '' hides it. */
  title?: string
  className?: string
}

export const DEFAULT_SHORTCUTS: Shortcut[] = [
  { id: 'palette', label: 'Open command menu', keys: ['mod', 'k'], group: 'General' },
  { id: 'search', label: 'Search files', keys: ['mod', 'p'], group: 'General' },
  { id: 'help', label: 'Show shortcuts', keys: ['shift', '?'], group: 'General' },
  { id: 'new', label: 'New deployment', keys: ['mod', 'shift', 'd'], group: 'Projects' },
  { id: 'next', label: 'Next project', keys: ['alt', 'arrowdown'], group: 'Projects' },
  { id: 'close', label: 'Close panel', keys: ['esc'], group: 'Projects' },
]

const MAC: Record<string, string> = { mod: '⌘', shift: '⇧', alt: '⌥', ctrl: '⌃', enter: '↵', esc: 'esc', arrowup: '↑', arrowdown: '↓', arrowleft: '←', arrowright: '→', backspace: '⌫' }
const PC: Record<string, string> = { mod: 'Ctrl', shift: 'Shift', alt: 'Alt', ctrl: 'Ctrl', enter: 'Enter', esc: 'Esc', arrowup: '↑', arrowdown: '↓', arrowleft: '←', arrowright: '→', backspace: '⌫' }
const SPOKEN: Record<string, string> = { mod: 'Command', shift: 'Shift', alt: 'Option', esc: 'Escape', arrowdown: 'Down arrow', arrowup: 'Up arrow', enter: 'Return' }

export type KbdProps = { children: React.ReactNode; pressed?: boolean; className?: string }

/** A single keycap. Exported for inline use in copy (“Press <Kbd>⌘</Kbd> <Kbd>K</Kbd>”). */
export function Kbd({ children, pressed = false, className }: KbdProps) {
  const reduced = usePrefersReducedMotion()
  return (
    <motion.kbd
      animate={reduced ? undefined : { y: pressed ? 1.5 : 0 }}
      transition={{ type: 'spring', stiffness: 700, damping: 30 }}
      className={cn(
        'inline-flex h-6 min-w-6 items-center justify-center rounded-[6px] px-1.5 font-sans text-[12px] font-medium tabular-nums leading-none transition-[color,background-color,box-shadow] duration-100',
        pressed
          ? 'bg-signal-600 text-white shadow-[0_0_0_1px_rgb(100_82_122/0.6),inset_0_1px_0_rgb(255_255_255/0.2)] dark:bg-signal-300 dark:text-zinc-950 dark:shadow-[0_0_0_1px_rgb(212_203_229/0.6)]'
          : 'bg-white text-zinc-800 shadow-[0_0_0_1px_rgb(0_0_0/0.1),0_1.5px_0_rgb(0_0_0/0.12),inset_0_1px_0_rgb(255_255_255/0.9)] dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-[0_0_0_1px_rgb(255_255_255/0.1),0_1.5px_0_rgb(0_0_0/0.6),inset_0_1px_0_rgb(255_255_255/0.08)]',
        className,
      )}
    >
      {children}
    </motion.kbd>
  )
}

/**
 * Keyboard Shortcut Hint — a cheat sheet of tactile keycaps that knows your
 * platform (⌘ ⌥ ⇧ on Apple, Ctrl Alt Shift elsewhere). Hold real keys and the
 * matching caps sink and light up; complete a combo and its row flashes its
 * confirmation. Caps carry spoken labels so screen readers hear “Command K”,
 * not glyph names. `Kbd` is exported for inline hints.
 */
export function KbdShortcutHint({ shortcuts = DEFAULT_SHORTCUTS, platform = 'auto', listen = true, onTrigger, title = 'Keyboard shortcuts', className }: KbdShortcutHintProps) {
  const reduced = usePrefersReducedMotion()
  const [mac, setMac] = React.useState(platform === 'mac')
  const [held, setHeld] = React.useState<Set<string>>(new Set())
  const [fired, setFired] = React.useState<string | null>(null)
  const [msg, setMsg] = React.useState('')
  const trigRef = React.useRef(onTrigger)
  trigRef.current = onTrigger

  React.useEffect(() => {
    if (platform !== 'auto') { setMac(platform === 'mac'); return }
    setMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent))
  }, [platform])

  React.useEffect(() => {
    if (!listen) return
    const norm = (e: KeyboardEvent) => {
      const s = new Set<string>()
      if (e.metaKey || e.ctrlKey) s.add('mod')
      if (e.shiftKey) s.add('shift')
      if (e.altKey) s.add('alt')
      const k = e.key.toLowerCase()
      if (!['meta', 'control', 'shift', 'alt'].includes(k)) s.add(k === 'escape' ? 'esc' : k)
      return s
    }
    const down = (e: KeyboardEvent) => {
      const s = norm(e)
      setHeld(s)
      const hit = shortcuts.find((sc) => sc.keys.length === s.size && sc.keys.every((k) => s.has(k) || (k === '?' && s.has('/'))))
      if (hit) {
        setFired(hit.id)
        setMsg(`${hit.label}`)
        trigRef.current?.(hit)
        window.setTimeout(() => setFired((f) => (f === hit.id ? null : f)), 600)
      }
    }
    const up = (e: KeyboardEvent) => setHeld(norm(e).size && e.type === 'keyup' ? new Set([...norm(e)].filter((k) => ['mod', 'shift', 'alt'].includes(k))) : new Set())
    const blur = () => setHeld(new Set())
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', blur)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); window.removeEventListener('blur', blur) }
  }, [listen, shortcuts])

  const glyph = (k: string) => (mac ? MAC : PC)[k] ?? k.toUpperCase()
  const spoken = (k: string) => (mac ? SPOKEN[k] : k === 'mod' ? 'Control' : k === 'alt' ? 'Alt' : SPOKEN[k]) ?? k.toUpperCase()
  const groups = [...new Set(shortcuts.map((s) => s.group ?? ''))]

  return (
    <div className={cn('w-full max-w-md rounded-[20px] bg-white p-2 ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgb(0_0_0/0.05),0_8px_24px_-12px_rgb(0_0_0/0.18)] dark:bg-zinc-900 dark:ring-white/[0.08] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]', className)}>
      {title && (
        <div className="flex items-center justify-between gap-3 px-3 pb-1 pt-2">
          <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">{title}</h3>
          <span className="text-xs text-zinc-600 dark:text-zinc-400">{listen ? 'Try them — keys light up' : mac ? 'macOS' : 'Windows · Linux'}</span>
        </div>
      )}
      {groups.map((g) => (
        <div key={g} className="mt-1">
          {g && <p className="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-600 dark:text-zinc-400">{g}</p>}
          <ul>
            {shortcuts.filter((s) => (s.group ?? '') === g).map((s) => {
              const isFired = fired === s.id
              return (
                <motion.li
                  key={s.id}
                  animate={isFired && !reduced ? { scale: [1, 1.015, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={cn('flex min-h-11 items-center justify-between gap-4 rounded-[12px] px-3 text-sm transition-colors duration-200', isFired ? 'bg-signal-50 dark:bg-signal-300/[0.1]' : '')}
                >
                  <span className="min-w-0 truncate text-zinc-800 dark:text-zinc-200">{s.label}</span>
                  <span className="flex shrink-0 items-center gap-1" aria-label={s.keys.map(spoken).join(' ')} role="img">
                    {s.keys.map((k) => <Kbd key={k} pressed={held.has(k) || isFired}><span aria-hidden>{glyph(k)}</span></Kbd>)}
                  </span>
                </motion.li>
              )
            })}
          </ul>
        </div>
      ))}
      <span role="status" aria-live="polite" className="sr-only">{msg}</span>
    </div>
  )
}
