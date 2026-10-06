import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Eraser, PenLine, Type, Undo2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useResolvedTheme, type ThemeMode } from '@/lib/use-resolved-theme'

type Pt = { x: number; y: number; t: number }
export type SignatureResult = { method: 'draw' | 'type'; name: string; dataUrl: string | null; signedAt: Date }

export type SignaturePadFieldProps = {
  label?: string
  description?: string
  /** Signer's legal name (pre-fills the Type tab). */
  name?: string
  /** Primary button copy. */
  submitLabel?: string
  onAdopt?: (result: SignatureResult) => void
  onClear?: () => void
  /** Ink colour on light / dark surfaces. */
  ink?: { light: string; dark: string }
  theme?: ThemeMode
  className?: string
}

const SCRIPT = "'Snell Roundhand', 'Segoe Script', 'Apple Chancery', 'Brush Script MT', 'URW Chancery L', cursive"

function drawStroke(ctx: CanvasRenderingContext2D, pts: Pt[], color: string, base: number) {
  if (pts.length < 2) {
    if (pts[0]) {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(pts[0].x, pts[0].y, base * 0.55, 0, Math.PI * 2)
      ctx.fill()
    }
    return
  }
  ctx.strokeStyle = color
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  let w = base
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]
    const b = pts[i]
    const v = Math.hypot(b.x - a.x, b.y - a.y) / Math.max(1, b.t - a.t)
    const target = Math.max(base * 0.35, Math.min(base * 1.25, base * (1.3 - v * 0.55)))
    w += (target - w) * 0.35
    ctx.lineWidth = w
    const m0 = i > 1 ? { x: (pts[i - 2].x + a.x) / 2, y: (pts[i - 2].y + a.y) / 2 } : a
    const m1 = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
    ctx.beginPath()
    ctx.moveTo(m0.x, m0.y)
    ctx.quadraticCurveTo(a.x, a.y, m1.x, m1.y)
    ctx.stroke()
  }
}

/**
 * Signature Pad Field — a form field for e-signatures. Draw with mouse, pen or
 * finger and the ink thins on fast strokes and pools on slow ones; undo stroke
 * by stroke, or switch to the Type tab for a keyboard-friendly script
 * signature. Adopting it dries the ink and stamps a signed time.
 */
export function SignaturePadField({
  label = 'Sign to approve',
  description = 'Vendor agreement · Northwind Paper Co.',
  name = 'Jordan Ellis',
  submitLabel = 'Adopt & sign',
  onAdopt,
  onClear,
  ink = { light: '#1e2a6e', dark: '#c7d2fe' },
  theme = 'auto',
  className,
}: SignaturePadFieldProps) {
  const reduced = usePrefersReducedMotion()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const resolved = useResolvedTheme(rootRef, theme)
  const strokes = React.useRef<Pt[][]>([])
  const drawing = React.useRef<Pt[] | null>(null)
  const [count, setCount] = React.useState(0)
  const [mode, setMode] = React.useState<'draw' | 'type'>('draw')
  const [typed, setTyped] = React.useState(name)
  const [signed, setSigned] = React.useState<SignatureResult | null>(null)
  const uid = React.useId()
  const color = resolved === 'dark' ? ink.dark : ink.light

  const redraw = React.useCallback(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, c.width, c.height)
    for (const s of strokes.current) drawStroke(ctx, s, color, 2.6)
    if (drawing.current) drawStroke(ctx, drawing.current, color, 2.6)
  }, [color])

  React.useLayoutEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const resize = () => {
      const r = c.getBoundingClientRect()
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      c.width = Math.round(r.width * dpr)
      c.height = Math.round(r.height * dpr)
      redraw()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(c)
    return () => ro.disconnect()
  }, [redraw, mode])

  const pos = (e: React.PointerEvent): Pt => {
    const r = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() }
  }
  const onDown = (e: React.PointerEvent) => {
    if (signed) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drawing.current = [pos(e)]
    redraw()
  }
  const onMove = (e: React.PointerEvent) => {
    if (!drawing.current) return
    const events = (e.nativeEvent as PointerEvent).getCoalescedEvents?.() ?? [e.nativeEvent]
    const r = canvasRef.current!.getBoundingClientRect()
    for (const ev of events) drawing.current.push({ x: ev.clientX - r.left, y: ev.clientY - r.top, t: performance.now() })
    redraw()
  }
  const onUp = () => {
    if (!drawing.current) return
    strokes.current.push(drawing.current)
    drawing.current = null
    setCount(strokes.current.length)
    redraw()
  }

  const undo = () => {
    strokes.current.pop()
    setCount(strokes.current.length)
    redraw()
  }
  const clear = () => {
    strokes.current = []
    setCount(0)
    setSigned(null)
    redraw()
    onClear?.()
  }

  const canAdopt = !signed && (mode === 'draw' ? count > 0 : typed.trim().length > 1)
  const adopt = () => {
    if (!canAdopt) return
    const result: SignatureResult = {
      method: mode,
      name: mode === 'type' ? typed.trim() : name,
      dataUrl: mode === 'draw' ? canvasRef.current?.toDataURL('image/png') ?? null : null,
      signedAt: new Date(),
    }
    setSigned(result)
    onAdopt?.(result)
  }

  const time = signed?.signedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const tabCls = (on: boolean) =>
    cn(
      'relative inline-flex min-h-11 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100',
      on ? 'text-zinc-950 dark:text-white' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100',
    )

  return (
    <div
      ref={rootRef}
      className={cn(
        'w-full max-w-lg rounded-[24px] bg-white p-5 text-zinc-900 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] ring-1 ring-black/[0.06] sm:p-6 dark:bg-zinc-950 dark:text-zinc-50 dark:shadow-none dark:ring-white/[0.08]',
        className,
      )}
    >
      <div className="flex flex-col-reverse items-start justify-between gap-3 min-[480px]:flex-row">
        <div className="min-w-0">
          <p id={`${uid}-l`} className="text-[15px] font-semibold tracking-[-0.01em]">{label}</p>
          <p className="mt-0.5 text-[13px] text-zinc-600 dark:text-zinc-400">{description}</p>
        </div>
        <div role="tablist" aria-label="Signature method" className="flex shrink-0 rounded-full bg-zinc-100 p-1 dark:bg-zinc-900" onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            const next = mode === 'draw' ? 'type' : 'draw'
            setMode(next)
            ;(e.currentTarget.querySelector(`[data-tab="${next}"]`) as HTMLElement | null)?.focus()
            e.preventDefault()
          }
        }}>
          {(['draw', 'type'] as const).map((m) => (
            <button key={m} data-tab={m} role="tab" type="button" aria-selected={mode === m} aria-controls={`${uid}-panel`} tabIndex={mode === m ? 0 : -1} onClick={() => setMode(m)} disabled={!!signed} className={tabCls(mode === m)}>
              {mode === m && <motion.span layoutId={`${uid}-pill`} className="absolute inset-0 rounded-full bg-white shadow-sm ring-1 ring-black/[0.06] dark:bg-zinc-800 dark:ring-white/10" transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 460, damping: 36 }} />}
              <span className="relative inline-flex items-center gap-1.5">{m === 'draw' ? <PenLine aria-hidden className="size-3.5" /> : <Type aria-hidden className="size-3.5" />}{m === 'draw' ? 'Draw' : 'Type'}</span>
            </button>
          ))}
        </div>
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-l`} className="relative mt-4">
        <div className={cn('relative h-44 overflow-hidden rounded-2xl ring-1 transition-colors', signed ? 'bg-emerald-50/60 ring-emerald-600/30 dark:bg-emerald-950/30 dark:ring-emerald-400/30' : 'bg-[#fbfaf7] ring-zinc-900/10 dark:bg-zinc-900/60 dark:ring-white/10')}>
          {/* baseline */}
          <div aria-hidden className="pointer-events-none absolute inset-x-6 bottom-12 flex items-end gap-2">
            <span className="text-[18px] leading-none text-zinc-500 dark:text-zinc-500">×</span>
            <span className="mb-[3px] h-px flex-1 bg-zinc-900/20 dark:bg-white/20" />
          </div>
          <p aria-hidden className="pointer-events-none absolute bottom-5 left-6 text-[11px] uppercase tracking-[0.16em] text-zinc-600 dark:text-zinc-400">{signed ? `Signed ${time}` : mode === 'draw' ? 'Sign above the line' : 'Preview'}</p>

          {mode === 'draw' ? (
            <>
              <canvas
                ref={canvasRef}
                role="img"
                aria-label={count ? `Signature drawing, ${count} stroke${count === 1 ? '' : 's'}` : 'Empty signature pad. Draw with a mouse, pen or finger, or use the Type tab.'}
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={onUp}
                className={cn('absolute inset-0 h-full w-full touch-none', signed ? 'cursor-default' : 'cursor-crosshair')}
              />
              <AnimatePresence>
                {count === 0 && !signed && (
                  <motion.p aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none absolute inset-x-0 top-12 text-center text-[22px] text-zinc-500 dark:text-zinc-400" style={{ fontFamily: SCRIPT }}>
                    Sign here
                  </motion.p>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="absolute inset-x-6 bottom-[54px] overflow-hidden">
              <p aria-hidden className="truncate pb-1 text-[40px] leading-[1.1]" style={{ fontFamily: SCRIPT, color }}>{typed || ' '}</p>
            </div>
          )}

          <AnimatePresence>
            {signed && (
              <motion.span
                aria-hidden
                className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white dark:bg-emerald-400 dark:text-emerald-950"
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.6, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: -4 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 480, damping: 20 }}
              >
                <Check className="size-3.5" /> Signed
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {mode === 'type' && !signed && (
          <label className="mt-3 block">
            <span className="text-[12px] font-medium text-zinc-700 dark:text-zinc-300">Full legal name</span>
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoComplete="name"
              className="mt-1 h-11 w-full rounded-xl bg-white px-3 text-[15px] text-zinc-900 outline-none ring-1 ring-zinc-900/15 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:bg-zinc-900 dark:text-zinc-50 dark:ring-white/15 dark:focus-visible:ring-zinc-100"
            />
          </label>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {mode === 'draw' && !signed && (
          <button type="button" onClick={undo} disabled={count === 0} className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-medium text-zinc-800 outline-none ring-1 ring-zinc-900/10 transition-colors hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-zinc-900 disabled:opacity-40 dark:text-zinc-200 dark:ring-white/15 dark:hover:bg-zinc-900 dark:focus-visible:ring-zinc-100">
            <Undo2 aria-hidden className="size-4" /> Undo
          </button>
        )}
        <button type="button" onClick={clear} disabled={!signed && count === 0 && mode === 'draw'} className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-medium text-zinc-800 outline-none ring-1 ring-zinc-900/10 transition-colors hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-zinc-900 disabled:opacity-40 dark:text-zinc-200 dark:ring-white/15 dark:hover:bg-zinc-900 dark:focus-visible:ring-zinc-100">
          <Eraser aria-hidden className="size-4" /> {signed ? 'Sign again' : 'Clear'}
        </button>
        <motion.button
          type="button"
          onClick={adopt}
          disabled={!canAdopt}
          whileTap={reduced || !canAdopt ? undefined : { scale: 0.97 }}
          className="ml-auto inline-flex min-h-11 items-center gap-2 rounded-full bg-zinc-950 px-5 text-[13px] font-medium text-white outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:opacity-40 dark:bg-white dark:text-zinc-950 dark:focus-visible:ring-white dark:focus-visible:ring-offset-zinc-950"
        >
          {signed ? <Check aria-hidden className="size-4" /> : <PenLine aria-hidden className="size-4" />}
          {signed ? 'Signed' : submitLabel}
        </motion.button>
      </div>
      <p role="status" aria-live="polite" className="sr-only">{signed ? `Signed by ${signed.name} at ${time}.` : ''}</p>
    </div>
  )
}
