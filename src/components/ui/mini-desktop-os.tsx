import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Minus, Maximize2, X, Wifi, BatteryFull } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { PortfolioArt } from '@/lib/portfolio-art'

export type MiniDesktopTone = 'sky' | 'rose' | 'amber' | 'emerald' | 'violet'

export interface MiniDesktopApp {
  id: string
  title: string
  /** Icon node (lucide icon etc.), drawn inside a tinted tile. */
  icon: React.ReactNode
  tone?: MiniDesktopTone
  /** Window content. */
  content: React.ReactNode
  /** Preferred window size in px (clamped to the desktop). */
  size?: { w: number; h: number }
}

export interface MiniDesktopOSProps {
  apps: MiniDesktopApp[]
  /** App ids opened on mount. */
  defaultOpen?: string[]
  /** Brand word in the menu bar. */
  brand?: string
  /** Seed for the generated wallpaper. */
  wallpaperSeed?: number
  /** Optional wallpaper image URL. */
  wallpaperSrc?: string
  /** Desktop height in px. */
  height?: number
  onOpenChange?: (openIds: string[]) => void
  className?: string
}

const TONES: Record<MiniDesktopTone, string> = {
  sky: 'from-sky-400 to-blue-600',
  rose: 'from-rose-400 to-pink-600',
  amber: 'from-amber-300 to-orange-500',
  emerald: 'from-emerald-400 to-teal-600',
  violet: 'from-violet-400 to-indigo-600',
}
const TONE_KEYS: MiniDesktopTone[] = ['sky', 'rose', 'amber', 'emerald', 'violet']

type Win = { id: string; x: number; y: number; w: number; h: number; z: number; min: boolean; max: boolean }

function useClock() {
  const [t, setT] = React.useState('')
  React.useEffect(() => {
    const f = () => setT(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    f(); const id = window.setInterval(f, 15000)
    return () => window.clearInterval(id)
  }, [])
  return t
}

/**
 * Mini Desktop OS — a tiny windowed desktop: wallpaper, menu bar with a live clock, icon grid, draggable windows with
 * close / minimise / maximise, and a dock. Keyboard: Tab to a window's title handle, arrows nudge, Esc closes.
 * On narrow screens windows become full-pane sheets.
 */
export function MiniDesktopOS({ apps, defaultOpen = [], brand = 'Folio', wallpaperSeed = 14, wallpaperSrc, height = 540, onOpenChange, className }: MiniDesktopOSProps) {
  const reduced = usePrefersReducedMotion()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const zTop = React.useRef(10)
  const [size, setSize] = React.useState({ w: 900, h: height })
  const [wins, setWins] = React.useState<Win[]>([])
  const [focusId, setFocusId] = React.useState<string | null>(null)
  const [say, setSay] = React.useState('')
  const clock = useClock()
  const compact = size.w < 600

  React.useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }))
    ro.observe(el); setSize({ w: el.clientWidth, h: el.clientHeight })
    return () => ro.disconnect()
  }, [])

  const appOf = (id: string) => apps.find((a) => a.id === id)!
  const place = (id: string, n: number, W: number, H: number): Win => {
    const a = appOf(id)
    const w = Math.min(a.size?.w ?? 380, W - 24)
    const h = Math.min(a.size?.h ?? 290, H - 120)
    return { id, w, h, x: Math.max(8, Math.min(W - w - 8, 120 + n * 34)), y: Math.max(40, Math.min(H - h - 80, 54 + n * 30)), z: ++zTop.current, min: false, max: false }
  }
  const mounted = React.useRef(false)
  React.useEffect(() => {
    if (mounted.current || size.w === 0) return
    mounted.current = true
    const open = defaultOpen.filter((id) => apps.some((a) => a.id === id))
    setWins(open.map((id, i) => place(id, i, size.w, size.h)))
    if (open.length) setFocusId(open[open.length - 1])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.w])

  React.useEffect(() => { onOpenChange?.(wins.map((w) => w.id)) }, [wins.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const raise = (id: string) => { setWins((ws) => ws.map((w) => (w.id === id ? { ...w, z: ++zTop.current } : w))); setFocusId(id) }
  const open = (id: string) => {
    const ex = wins.find((w) => w.id === id)
    if (ex) { setWins((ws) => ws.map((w) => (w.id === id ? { ...w, min: false, z: ++zTop.current } : w))); setFocusId(id); setSay(`${appOf(id).title} in front`); return }
    setWins((ws) => [...ws, place(id, ws.length, size.w, size.h)]); setFocusId(id); setSay(`${appOf(id).title} opened`)
  }
  const close = (id: string) => { setWins((ws) => ws.filter((w) => w.id !== id)); setSay(`${appOf(id).title} closed`); setFocusId((f) => (f === id ? null : f)); window.setTimeout(() => (rootRef.current?.querySelector(`[data-icon="${id}"]`) as HTMLElement | null)?.focus(), 0) }
  const minimise = (id: string) => { setWins((ws) => ws.map((w) => (w.id === id ? { ...w, min: true } : w))); setSay(`${appOf(id).title} minimised to the dock`); setFocusId(null) }
  const toggleMax = (id: string) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, max: !w.max } : w)))
  const move = (id: string, x: number, y: number) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, x: Math.max(0, Math.min(size.w - 80, x)), y: Math.max(32, Math.min(size.h - 90, y)) } : w)))

  const startDrag = (e: React.PointerEvent, w: Win) => {
    if (compact || w.max || (e.target as HTMLElement).closest('button')) return
    raise(w.id)
    const sx = e.clientX, sy = e.clientY, ox = w.x, oy = w.y
    const el = e.currentTarget as HTMLElement
    el.setPointerCapture(e.pointerId)
    const mv = (ev: PointerEvent) => move(w.id, ox + ev.clientX - sx, oy + ev.clientY - sy)
    const up = () => { el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up) }
    el.addEventListener('pointermove', mv); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up)
  }
  const onHandleKey = (e: React.KeyboardEvent, w: Win) => {
    const step = e.shiftKey ? 48 : 16
    const d: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }
    if (d[e.key] && !compact && !w.max) { e.preventDefault(); move(w.id, w.x + d[e.key][0], w.y + d[e.key][1]) }
    else if (e.key === 'Escape') { e.preventDefault(); close(w.id) }
  }

  const front = wins.filter((w) => !w.min).sort((a, b) => b.z - a.z)[0]?.id

  return (
    <div ref={rootRef} className={cn('relative isolate w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-zinc-300 bg-zinc-200 text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100', className)} style={{ height }}>
      <div aria-hidden className="absolute inset-0 -z-10">
        {wallpaperSrc ? <img src={wallpaperSrc} alt="" className="size-full object-cover" /> : <PortfolioArt seed={wallpaperSeed} />}
        <div className="absolute inset-0 bg-white/10 dark:bg-black/35" />
      </div>

      {/* menu bar */}
      <div className="absolute inset-x-0 top-0 z-[900] flex h-8 items-center justify-between gap-3 border-b border-black/10 bg-white/85 px-3 text-xs font-medium backdrop-blur dark:border-white/10 dark:bg-zinc-900/80">
        <div className="flex min-w-0 items-center gap-3">
          <span className="font-display text-sm italic">{brand}</span>
          <span className="truncate text-zinc-700 dark:text-zinc-300">{front ? appOf(front).title : 'Desktop'}</span>
        </div>
        <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
          <Wifi className="size-3.5" aria-hidden /><BatteryFull className="size-4" aria-hidden />
          <span className="tabular-nums" aria-label="Local time">{clock}</span>
        </div>
      </div>

      {/* desktop icons */}
      <ul className="absolute left-2 top-11 z-0 flex flex-col gap-1.5 sm:left-4">
        {apps.map((a, i) => (
          <li key={a.id}>
            <button type="button" data-icon={a.id} onClick={() => open(a.id)} aria-label={`Open ${a.title}`} className="group flex min-h-11 w-[72px] flex-col items-center gap-1 rounded-xl p-1.5 outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900">
              <span className={cn('grid size-10 place-items-center rounded-xl bg-gradient-to-b text-white shadow-md transition-transform group-hover:scale-105 group-active:scale-95', TONES[a.tone ?? TONE_KEYS[i % 5]])} aria-hidden>{a.icon}</span>
              <span className="rounded bg-black/55 px-1.5 text-[11px] font-medium leading-4 text-white">{a.title}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* windows */}
      <AnimatePresence>
        {wins.map((w) => {
          const a = appOf(w.id)
          const full = compact || w.max
          const hidden = w.min || (compact && front !== w.id)
          const pos = full ? { left: compact ? 8 : 0, top: 32, width: compact ? size.w - 16 : size.w, height: compact ? size.h - 32 - 76 : size.h - 32 - 76 } : { left: w.x, top: w.y, width: w.w, height: w.h }
          return (
            <motion.section
              key={w.id}
              role="group"
              aria-label={`${a.title} window`}
              aria-hidden={hidden || undefined}
              inert={hidden}
              initial={reduced ? false : { opacity: 0, scale: 0.92, y: 14 }}
              animate={{ opacity: hidden ? 0 : 1, scale: hidden ? 0.88 : 1, y: hidden ? 30 : 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 8 }}
              transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 30 }}
              onPointerDown={() => raise(w.id)}
              className={cn('absolute flex flex-col overflow-hidden border bg-white shadow-2xl dark:bg-zinc-900', full && !compact ? 'rounded-none' : 'rounded-2xl', focusId === w.id ? 'border-zinc-400 dark:border-zinc-500' : 'border-zinc-300 dark:border-zinc-700', hidden && 'pointer-events-none')}
              style={{ ...pos, zIndex: w.z, transition: reduced ? undefined : 'left .25s, top .25s, width .25s, height .25s' }}
            >
              <div
                className={cn('flex h-10 shrink-0 select-none items-center gap-2 border-b border-zinc-200 bg-zinc-100 px-3 dark:border-zinc-800 dark:bg-zinc-800', !full && 'cursor-grab active:cursor-grabbing')}
                style={{ touchAction: 'none' }}
                onPointerDown={(e) => startDrag(e, w)}
                onDoubleClick={() => !compact && toggleMax(w.id)}
              >
                <div className="flex gap-1.5">
                  <button type="button" aria-label={`Close ${a.title}`} onClick={() => close(w.id)} className="group relative grid size-5 place-items-center rounded-full bg-rose-500 text-rose-950 outline-none before:absolute before:-inset-3 focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-1 dark:focus-visible:ring-signal-300"><X className="size-3 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden /></button>
                  <button type="button" aria-label={`Minimise ${a.title}`} onClick={() => minimise(w.id)} className="group relative grid size-5 place-items-center rounded-full bg-amber-400 text-amber-950 outline-none before:absolute before:-inset-3 focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-1 dark:focus-visible:ring-signal-300"><Minus className="size-3 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden /></button>
                  {!compact && <button type="button" aria-label={w.max ? `Restore ${a.title}` : `Maximise ${a.title}`} aria-pressed={w.max} onClick={() => toggleMax(w.id)} className="group relative grid size-5 place-items-center rounded-full bg-emerald-500 text-emerald-950 outline-none before:absolute before:-inset-3 focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-1 dark:focus-visible:ring-signal-300"><Maximize2 className="size-2.5 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden /></button>}
                </div>
                <div
                  tabIndex={full ? -1 : 0}
                  role={full ? undefined : 'button'}
                  aria-label={full ? undefined : `${a.title} — move window with the arrow keys, Escape closes`}
                  onKeyDown={(e) => onHandleKey(e, w)}
                  className="min-w-0 flex-1 truncate rounded px-1 text-center text-xs font-semibold text-zinc-800 outline-none focus-visible:ring-2 focus-visible:ring-signal-600 dark:text-zinc-200 dark:focus-visible:ring-signal-300"
                >{a.title}</div>
                <span className="w-[60px]" aria-hidden />
              </div>
              <div className="min-h-0 flex-1 overflow-auto overscroll-contain p-4 text-sm text-zinc-800 dark:text-zinc-200">{a.content}</div>
            </motion.section>
          )
        })}
      </AnimatePresence>

      {/* dock */}
      <nav aria-label="Dock" className="absolute inset-x-0 bottom-3 z-[900] flex justify-center px-2">
        <ul className="flex items-end gap-1.5 rounded-[1.4rem] border border-white/50 bg-white/75 p-1.5 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/70">
          {apps.map((a, i) => {
            const w = wins.find((x) => x.id === a.id)
            return (
              <li key={a.id} className="relative">
                <button type="button" onClick={() => (w && !w.min && front === a.id ? minimise(a.id) : open(a.id))} aria-label={`${a.title}${w ? (w.min ? ', minimised' : ', open') : ''}`} className="group grid size-11 place-items-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-signal-600 dark:focus-visible:ring-signal-300">
                  <span className={cn('grid size-10 place-items-center rounded-xl bg-gradient-to-b text-white shadow transition-transform duration-200 group-hover:-translate-y-1.5 group-hover:scale-110 group-active:scale-95', TONES[a.tone ?? TONE_KEYS[i % 5]])} aria-hidden>{a.icon}</span>
                </button>
                <span aria-hidden className={cn('absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-zinc-800 transition-opacity dark:bg-zinc-100', w ? 'opacity-100' : 'opacity-0')} />
              </li>
            )
          })}
        </ul>
      </nav>
      <p className="sr-only" role="status" aria-live="polite">{say}</p>
    </div>
  )
}
