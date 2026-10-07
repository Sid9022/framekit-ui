import * as React from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'motion/react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type RollingNumberStepperProps = {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  /** Field label (visible). */
  label?: string
  /** Helper text under the field; replaced by the limit message at a bound. */
  hint?: string
  /** Unit shown after the number, e.g. 'seats'. */
  unit?: string
  /** Format the displayed number. */
  format?: (n: number) => string
  disabled?: boolean
  className?: string
}

const FOCUS = 'outline-none focus-visible:ring-2 focus-visible:ring-signal-600 dark:focus-visible:ring-signal-300'

/**
 * Rolling Number Stepper — a quantity field where every change rolls the
 * digits in the direction of travel, only the digits that changed move, and
 * press-and-hold accelerates like a hardware stepper. Hitting a bound gives
 * a short horizontal nudge and says why. It's a real spinbutton: type a
 * value, use ↑ ↓, PageUp/PageDown for ×10, Home/End for the limits.
 */
export function RollingNumberStepper({
  value,
  defaultValue = 8,
  onValueChange,
  min = 1,
  max = 250,
  step = 1,
  label = 'Seats',
  hint = 'Billed per seat each month.',
  unit = 'seats',
  format = (n) => n.toLocaleString(),
  disabled = false,
  className,
}: RollingNumberStepperProps) {
  const reduced = usePrefersReducedMotion()
  const id = React.useId()
  const [inner, setInner] = React.useState(defaultValue)
  const v = value ?? inner
  const [dir, setDir] = React.useState(1)
  const [editing, setEditing] = React.useState<string | null>(null)
  const [limitMsg, setLimitMsg] = React.useState('')
  const shake = useAnimationControls()
  const hold = React.useRef<{ t: number; i: number }>({ t: 0, i: 0 })
  const vRef = React.useRef(v)
  vRef.current = v

  const commit = React.useCallback((n: number) => {
    const c = Math.min(max, Math.max(min, Math.round(n / step) * step))
    if (c !== n) {
      setLimitMsg(n > max ? `Maximum is ${format(max)} ${unit}` : `Minimum is ${format(min)} ${unit}`)
      if (!reduced) shake.start({ x: [0, -6, 5, -3, 0], transition: { duration: 0.32 } })
    } else setLimitMsg('')
    if (c === vRef.current) return
    setDir(c > vRef.current ? 1 : -1)
    vRef.current = c
    if (value === undefined) setInner(c)
    onValueChange?.(c)
  }, [max, min, step, value, onValueChange, reduced, shake, format, unit])

  const stopHold = () => { window.clearTimeout(hold.current.t); hold.current.i = 0 }
  const startHold = (d: number) => {
    commit(vRef.current + d * step)
    const loop = () => {
      hold.current.i++
      commit(vRef.current + d * step * (hold.current.i > 12 ? 5 : 1))
      hold.current.t = window.setTimeout(loop, Math.max(40, 180 - hold.current.i * 12))
    }
    hold.current.t = window.setTimeout(loop, 420)
  }
  React.useEffect(() => stopHold, [])

  const onKey = (e: React.KeyboardEvent) => {
    const m: Record<string, number> = { ArrowUp: step, ArrowDown: -step, PageUp: step * 10, PageDown: -step * 10 }
    if (e.key in m) { e.preventDefault(); commit(v + m[e.key]) }
    else if (e.key === 'Home') { e.preventDefault(); commit(min) }
    else if (e.key === 'End') { e.preventDefault(); commit(max) }
    else if (e.key === 'Enter' && editing !== null) { commit(Number(editing.replace(/[^\d.-]/g, '')) || min); setEditing(null) }
  }

  const text = format(v)
  const chars = text.split('')
  const btn = cn(
    'grid size-11 shrink-0 place-items-center rounded-full text-zinc-800 transition-[color,background-color,opacity] duration-150 [touch-action:manipulation] select-none',
    'bg-zinc-900/[0.05] hover:bg-zinc-900/[0.09] active:bg-zinc-900/[0.14] disabled:opacity-40 disabled:hover:bg-zinc-900/[0.05]',
    'dark:bg-white/[0.08] dark:text-zinc-100 dark:hover:bg-white/[0.12] dark:active:bg-white/[0.18]',
    FOCUS,
  )

  return (
    <div className={cn('w-full max-w-xs', className)}>
      <label htmlFor={id} className="mb-2 block text-[13px] font-medium text-zinc-800 dark:text-zinc-200">{label}</label>
      <motion.div
        animate={shake}
        className={cn(
          'flex items-center gap-2 rounded-full bg-white p-1.5 ring-1 ring-black/[0.08] shadow-[0_1px_2px_rgb(0_0_0/0.05),0_8px_24px_-12px_rgb(0_0_0/0.18)] focus-within:ring-2 focus-within:ring-signal-600',
          'dark:bg-zinc-900 dark:ring-white/[0.1] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] dark:focus-within:ring-signal-300',
          disabled && 'opacity-50',
        )}
      >
        <motion.button type="button" tabIndex={-1} aria-label={`Decrease ${label}`} disabled={disabled || v <= min} whileTap={reduced ? undefined : { scale: 0.92 }}
          onPointerDown={(e) => { if (e.button === 0) startHold(-1) }} onPointerUp={stopHold} onPointerLeave={stopHold} onPointerCancel={stopHold}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); commit(v - step) } }} className={btn}>
          <Minus aria-hidden className="size-4" />
        </motion.button>
        <div className="relative flex h-11 min-w-0 flex-1 items-center justify-center">
          <input
            id={id}
            role="spinbutton"
            inputMode="numeric"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={v}
            aria-valuetext={`${format(v)} ${unit}`}
            aria-describedby={`${id}-hint`}
            disabled={disabled}
            value={editing ?? text}
            onFocus={(e) => { setEditing(null); e.currentTarget.select() }}
            onChange={(e) => setEditing(e.target.value)}
            onBlur={() => { if (editing !== null) { commit(Number(editing.replace(/[^\d.-]/g, '')) || min); setEditing(null) } }}
            onKeyDown={onKey}
            className={cn('absolute inset-0 w-full rounded-full bg-transparent text-center font-mono text-2xl font-medium tabular-nums text-transparent caret-zinc-900 outline-none selection:bg-signal-200 dark:caret-white', editing !== null && 'text-zinc-950 dark:text-white')}
          />
          {editing === null && (
            <span aria-hidden className="pointer-events-none flex items-baseline gap-1.5">
              <span className="flex overflow-hidden font-mono text-2xl font-medium tabular-nums text-zinc-950 dark:text-white">
                <AnimatePresence initial={false} mode="popLayout" custom={dir}>
                  {chars.map((c, i) => (
                    <motion.span
                      key={`${chars.length - i}-${c}`}
                      custom={dir}
                      initial={reduced ? { opacity: 0 } : { y: `${dir * 70}%`, opacity: 0, filter: 'blur(2px)' }}
                      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                      exit={reduced ? { opacity: 0 } : { y: `${dir * -70}%`, opacity: 0, filter: 'blur(2px)' }}
                      transition={reduced ? { duration: 0.12 } : { type: 'spring', stiffness: 520, damping: 34 }}
                      className="inline-block"
                    >
                      {c}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">{unit}</span>
            </span>
          )}
        </div>
        <motion.button type="button" tabIndex={-1} aria-label={`Increase ${label}`} disabled={disabled || v >= max} whileTap={reduced ? undefined : { scale: 0.92 }}
          onPointerDown={(e) => { if (e.button === 0) startHold(1) }} onPointerUp={stopHold} onPointerLeave={stopHold} onPointerCancel={stopHold}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); commit(v + step) } }} className={btn}>
          <Plus aria-hidden className="size-4" />
        </motion.button>
      </motion.div>
      <p id={`${id}-hint`} className={cn('mt-2 min-h-5 px-1 text-[13px]', limitMsg ? 'text-amber-800 dark:text-amber-300' : 'text-zinc-600 dark:text-zinc-400')} aria-live="polite">
        {limitMsg || hint}
      </p>
    </div>
  )
}
