import * as React from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type TumblerLockStatus = 'idle' | 'checking' | 'success' | 'error'

export type TumblerLockOtpProps = {
  length?: number
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Called when every drum is set. Return / resolve false (or throw) to reject. */
  onVerify?: (code: string) => boolean | Promise<boolean>
  onSuccess?: (code: string) => void
  label?: string
  hint?: string
  /** Seconds until “Resend code” unlocks. 0 hides the link. */
  resendAfter?: number
  onResend?: () => void
  disabled?: boolean
  autoFocus?: boolean
  className?: string
}

const FACES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '•', '•']
const STEP = 360 / FACES.length
const FACE_H = 50
const RADIUS = Math.round(FACE_H / 2 / Math.tan(Math.PI / FACES.length))
const EMPTY = 10

/** A true CSS-3D drum of 12 faces that always rolls forward to its digit. */
function Drum({ digit, active, status, index, reduced, onPick }: { digit: number; active: boolean; status: TumblerLockStatus; index: number; reduced: boolean; onPick: () => void }) {
  const [angle, setAngle] = React.useState(-EMPTY * STEP)
  const prev = React.useRef(EMPTY)
  React.useEffect(() => {
    if (prev.current === digit) return
    const from = prev.current
    prev.current = digit
    setAngle((a) => {
      let delta = ((digit - from + FACES.length) % FACES.length) * STEP
      if (digit !== EMPTY && !reduced) delta += 360 // a full whirr before it lands
      return a - delta
    })
  }, [digit, reduced])
  const tone =
    status === 'success'
      ? 'text-emerald-600 dark:text-emerald-300'
      : status === 'error'
        ? 'text-rose-600 dark:text-rose-300'
        : 'text-zinc-800 dark:text-zinc-100'
  return (
    <div
      onPointerDown={(e) => {
        e.preventDefault()
        onPick()
      }}
      className={cn(
        'relative h-[76px] w-[44px] shrink-0 cursor-text overflow-hidden rounded-[12px] sm:w-[50px]',
        'bg-[linear-gradient(90deg,#c9ccd3,#f4f5f7_30%,#ffffff_50%,#eceef1_70%,#b9bcc4)] shadow-[inset_0_1px_0_rgb(255_255_255/0.9),inset_0_-1px_0_rgb(0_0_0/0.08),0_1px_2px_rgb(0_0_0/0.15),0_10px_20px_-10px_rgb(0_0_0/0.35)]',
        'dark:bg-[linear-gradient(90deg,#1c1d21,#34363c_30%,#44464d_50%,#2e3035_70%,#17181b)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_1px_2px_rgb(0_0_0/0.6),0_14px_24px_-12px_rgb(0_0_0/0.8)]',
      )}
    >
      <div className="absolute inset-0 [perspective:320px]">
        <motion.div
          className="absolute left-0 top-[13px] h-[50px] w-full [transform-style:preserve-3d]"
          style={{ z: -RADIUS }}
          animate={{ rotateX: angle }}
          transition={
            reduced
              ? { duration: 0 }
              : { type: 'spring', stiffness: 120, damping: 17, mass: 0.9 + index * 0.04 }
          }
        >
          {FACES.map((f, i) => (
            <div
              key={i}
              className={cn(
                'absolute inset-0 flex items-center justify-center font-mono text-[28px] font-semibold tabular-nums [backface-visibility:hidden]',
                tone,
                'transition-colors duration-300',
                f === '•' && 'text-[18px] text-zinc-400 dark:text-zinc-500',
              )}
              style={{ transform: `rotateX(${i * STEP}deg) translateZ(${RADIUS}px)` }}
            >
              {f}
            </div>
          ))}
        </motion.div>
      </div>
      {/* cylinder shading */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.28),transparent_32%,transparent_68%,rgb(0_0_0/0.28))] dark:bg-[linear-gradient(180deg,rgb(0_0_0/0.7),transparent_34%,transparent_66%,rgb(0_0_0/0.7))]" />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[46px] -translate-y-1/2 border-y border-black/[0.06] dark:border-white/[0.06]" />
      {/* active caret */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0.3 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0.3 }}
            className="pointer-events-none absolute inset-0 rounded-[12px] ring-2 ring-indigo-500/80 dark:ring-indigo-400/80"
          >
            <motion.span
              className="absolute bottom-2 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-indigo-500 dark:bg-indigo-400"
              animate={reduced ? undefined : { opacity: [1, 0.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Padlock({ status, reduced }: { status: TumblerLockStatus; reduced: boolean }) {
  const open = status === 'success'
  const col =
    status === 'success' ? '#10b981' : status === 'error' ? '#f43f5e' : 'currentColor'
  return (
    <motion.svg
      viewBox="0 0 48 56"
      className="h-12 w-11 overflow-visible text-zinc-700 dark:text-zinc-300"
      aria-hidden
      animate={status === 'error' && !reduced ? { rotate: [0, -10, 8, -5, 3, 0] } : { rotate: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.path
        fill="none"
        stroke={col}
        strokeWidth={4.5}
        strokeLinecap="round"
        initial={false}
        animate={{
          d: open ? 'M14 26 V9 a10 10 0 0 1 20 0 V13' : 'M14 26 V17 a10 10 0 0 1 20 0 V26',
          y: status === 'checking' && !reduced ? [0, -2, 0] : 0,
        }}
        transition={open && !reduced ? { type: 'spring', stiffness: 300, damping: 12 } : { duration: reduced ? 0 : 0.45, repeat: status === 'checking' && !reduced ? Infinity : 0 }}
      />
      <rect x="6" y="24" width="36" height="28" rx="7" fill={col} opacity={status === 'idle' ? 0.9 : 1} />
      <rect x="6" y="24" width="36" height="10" rx="7" fill="white" opacity="0.12" />
      <circle cx="24" cy="36" r="3.5" fill="white" opacity="0.9" />
      <rect x="22.6" y="37" width="2.8" height="7" rx="1.4" fill="white" opacity="0.9" />
    </motion.svg>
  )
}

/**
 * Tumbler Lock OTP — a one-time-code field built from combination-lock
 * drums. Each digit whirrs a full turn on a real CSS-3D cylinder before it
 * lands; a padlock checks the code, springs its shackle on success, or
 * shakes and spins every drum back to blank on failure.
 */
export function TumblerLockOtp({
  length = 6,
  value: valueProp,
  defaultValue = '',
  onValueChange,
  onVerify,
  onSuccess,
  label = 'Enter the 6-digit code we sent to •••• 4821',
  hint,
  resendAfter = 30,
  onResend,
  disabled = false,
  autoFocus = false,
  className,
}: TumblerLockOtpProps) {
  const reduced = usePrefersReducedMotion()
  const [inner, setInner] = React.useState(defaultValue.replace(/\D/g, '').slice(0, length))
  const value = (valueProp ?? inner).replace(/\D/g, '').slice(0, length)
  const [status, setStatus] = React.useState<TumblerLockStatus>('idle')
  const [message, setMessage] = React.useState('')
  const [focused, setFocused] = React.useState(false)
  const [left, setLeft] = React.useState(resendAfter)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const row = useAnimationControls()
  const id = React.useId()

  const setValue = (v: string) => {
    const clean = v.replace(/\D/g, '').slice(0, length)
    if (valueProp === undefined) setInner(clean)
    onValueChange?.(clean)
    if (status === 'error') {
      setStatus('idle')
      setMessage('')
    }
    if (clean.length === length) void verify(clean)
  }

  const verify = async (code: string) => {
    setStatus('checking')
    setMessage('Checking code…')
    let ok = true
    try {
      await new Promise((r) => setTimeout(r, reduced ? 150 : 1100))
      ok = onVerify ? await onVerify(code) : true
    } catch {
      ok = false
    }
    if (ok) {
      setStatus('success')
      setMessage('Unlocked. Code accepted.')
      onSuccess?.(code)
    } else {
      setStatus('error')
      setMessage('That code didn’t match. The drums have been reset — try again.')
      if (!reduced) void row.start({ x: [0, -12, 11, -8, 6, -3, 0], transition: { duration: 0.5 } })
      window.setTimeout(() => {
        if (valueProp === undefined) setInner('')
        onValueChange?.('')
        inputRef.current?.focus()
      }, reduced ? 200 : 650)
    }
  }

  React.useEffect(() => {
    if (!resendAfter || left <= 0) return
    const t = window.setTimeout(() => setLeft((l) => l - 1), 1000)
    return () => clearTimeout(t)
  }, [left, resendAfter])

  const reset = () => {
    setStatus('idle')
    setMessage('')
    if (valueProp === undefined) setInner('')
    onValueChange?.('')
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  const locked = disabled || status === 'checking' || status === 'success'
  const activeIndex = Math.min(value.length, length - 1)

  return (
    <div className={cn('flex w-full max-w-md flex-col items-center gap-5', className)}>
      <Padlock status={status} reduced={reduced} />
      <label htmlFor={id} className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        {label}
      </label>
      <motion.div animate={row} className="relative">
        <div
          className={cn(
            'relative flex gap-2 rounded-[18px] p-2.5 sm:gap-2.5',
            'bg-[linear-gradient(#e4e6ea,#d4d7dd)] shadow-[inset_0_2px_6px_rgb(0_0_0/0.18),0_1px_0_rgb(255_255_255/0.9)]',
            'dark:bg-[linear-gradient(#0d0e10,#141518)] dark:shadow-[inset_0_2px_8px_rgb(0_0_0/0.8),0_1px_0_rgb(255_255_255/0.05)]',
            status === 'success' && 'shadow-[inset_0_2px_6px_rgb(0_0_0/0.18),0_0_0_2px_rgb(16_185_129/0.5),0_0_40px_-6px_rgb(16_185_129/0.55)] dark:shadow-[inset_0_2px_8px_rgb(0_0_0/0.8),0_0_0_2px_rgb(52_211_153/0.4),0_0_40px_-6px_rgb(52_211_153/0.45)]',
          )}
        >
          {Array.from({ length }, (_, i) => (
            <React.Fragment key={i}>
              {length === 6 && i === 3 && <span aria-hidden className="my-auto h-1 w-2 rounded-full bg-zinc-400/70 dark:bg-zinc-600" />}
              <Drum
                index={i}
                digit={value[i] !== undefined ? Number(value[i]) : EMPTY}
                active={focused && !locked && i === activeIndex}
                status={status}
                reduced={reduced}
                onPick={() => inputRef.current?.focus()}
              />
            </React.Fragment>
          ))}
          {status === 'checking' && !reduced && (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-y-2 w-16 rounded-xl bg-gradient-to-r from-transparent via-white/60 to-transparent mix-blend-overlay dark:via-white/20"
              initial={{ left: '0%' }}
              animate={{ left: ['0%', '82%', '0%'] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </div>
        <input
          ref={inputRef}
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') reset()
          }}
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={length}
          disabled={locked}
          autoFocus={autoFocus}
          aria-describedby={id + '-msg'}
          aria-invalid={status === 'error'}
          className="absolute inset-0 h-full w-full cursor-text opacity-0 disabled:cursor-default"
        />
      </motion.div>

      <div className="flex min-h-[40px] flex-col items-center gap-1 text-center">
        <p id={id + '-msg'} aria-live="polite" className={cn('text-sm', status === 'error' ? 'text-rose-600 dark:text-rose-400' : status === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500')}>
          {message || hint || 'Type or paste your code. Esc clears the drums.'}
        </p>
        <div className="flex items-center gap-3 text-xs">
          {status === 'success' || status === 'error' ? (
            <button type="button" onClick={reset} className="rounded-full px-2 py-1 font-medium text-indigo-600 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-indigo-400">
              {status === 'success' ? 'Lock again' : 'Retry now'}
            </button>
          ) : null}
          {resendAfter > 0 && (
            <button
              type="button"
              disabled={left > 0}
              onClick={() => {
                setLeft(resendAfter)
                onResend?.()
                setMessage('A fresh code is on its way.')
              }}
              className="rounded-full px-2 py-1 font-medium text-zinc-600 outline-none enabled:hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:text-zinc-400 dark:text-zinc-300 dark:enabled:hover:text-white dark:disabled:text-zinc-600"
            >
              {left > 0 ? `Resend in 0:${String(left).padStart(2, '0')}` : 'Resend code'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
