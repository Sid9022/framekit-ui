import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Mail, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Phase = 'idle' | 'pouring' | 'stamping' | 'sealed' | 'error'

export type WaxSealButtonProps = {
  label?: string
  busyLabel?: string
  sealedLabel?: string
  errorLabel?: string
  /** One or two letters pressed into the wax. */
  monogram?: string
  /** Wax colour (any CSS colour). */
  accent?: string
  /** Runs while the wax pours; return a promise to hold the pour until it settles (rejecting shows the error state). */
  onSeal?: () => void | Promise<unknown>
  /** ms the sealed state is held before resetting; 0 keeps it sealed. */
  resetAfter?: number
  disabled?: boolean
  className?: string
}

function blobPath(r: number, lobes: number, wobble: number, seed: number) {
  const pts: [number, number][] = []
  const N = lobes * 2
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2
    const k = r + Math.sin(a * 3 + seed) * wobble * 0.6 + Math.sin(a * 5 + seed * 2.3) * wobble * 0.4 + (i % 2 ? wobble * 0.5 : -wobble * 0.2)
    pts.push([22 + Math.cos(a) * k, 22 + Math.sin(a) * k])
  }
  let d = `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`
  for (let i = 0; i < N; i++) {
    const p1 = pts[(i + 1) % N]
    const p0 = pts[i]
    const mx = (p0[0] + p1[0]) / 2
    const my = (p0[1] + p1[1]) / 2
    d += ` Q${p0[0].toFixed(2)} ${p0[1].toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)}`
  }
  return d + 'Z'
}

/**
 * Wax Seal Button — a paper-and-ink send button that seals what you send.
 * Press it and a drop of wax falls into the slot and spreads into an uneven
 * puddle, a brass stamp thumps down and lifts away, leaving an embossed
 * monogram, and the label settles on "Sealed & sent".
 */
export function WaxSealButton({
  label = 'Seal & send',
  busyLabel = 'Sealing…',
  sealedLabel = 'Sealed & sent',
  errorLabel = 'Didn’t send · retry',
  monogram = 'M',
  accent = '#a3122a',
  onSeal,
  resetAfter = 2800,
  disabled = false,
  className,
}: WaxSealButtonProps) {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = React.useState<Phase>('idle')
  const timers = React.useRef<number[]>([])
  const uid = React.useId().replace(/:/g, '')
  const blob = React.useMemo(() => blobPath(15.5, 11, 1.8, 1.3), [])
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))
  React.useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const busy = phase === 'pouring' || phase === 'stamping'
  const run = async () => {
    if (busy || disabled) return
    if (phase === 'sealed') {
      setPhase('idle')
      return
    }
    timers.current.forEach(clearTimeout)
    setPhase('pouring')
    const start = performance.now()
    try {
      await onSeal?.()
    } catch {
      setPhase('error')
      return
    }
    const wait = Math.max(0, (reduced ? 150 : 720) - (performance.now() - start))
    later(() => {
      setPhase('stamping')
      later(() => {
        setPhase('sealed')
        if (resetAfter > 0) later(() => setPhase('idle'), resetAfter)
      }, reduced ? 100 : 520)
    }, wait)
  }

  const text = phase === 'idle' ? label : phase === 'sealed' ? sealedLabel : phase === 'error' ? errorLabel : busyLabel
  const waxOn = phase === 'pouring' || phase === 'stamping' || phase === 'sealed'
  const pressed = phase === 'stamping' || phase === 'sealed'
  const spring = { type: 'spring' as const, stiffness: 420, damping: 26 }

  return (
    <div className={cn('inline-flex flex-col items-center gap-2', className)}>
      <motion.button
        type="button"
        layout={!reduced}
        onClick={run}
        disabled={disabled}
        aria-disabled={busy || undefined}
        aria-busy={busy || undefined}
        whileTap={reduced || busy ? undefined : { scale: 0.97 }}
        animate={phase === 'error' && !reduced ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
        transition={{ layout: spring, x: { duration: 0.4 } }}
        className={cn(
          'group relative inline-flex h-14 items-center gap-3 rounded-full pl-1.5 pr-6 text-[15px] font-medium tracking-[-0.01em] outline-none',
          'bg-[#f8f2e7] text-[#2a1d14] shadow-[inset_0_1px_0_rgb(255_255_255/0.9),0_1px_2px_rgb(60_30_10/0.12),0_14px_30px_-16px_rgb(60_30_10/0.45)] ring-1 ring-[#2a1d14]/10',
          'dark:bg-[#1e1814] dark:text-[#f3e9dc] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_14px_30px_-16px_rgb(0_0_0/0.8)] dark:ring-white/10',
          'focus-visible:ring-2 focus-visible:ring-[#2a1d14] focus-visible:ring-offset-2 dark:focus-visible:ring-[#f3e9dc] dark:focus-visible:ring-offset-zinc-950',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
        style={{ fontFamily: "var(--font-sans, ui-sans-serif), system-ui, sans-serif" }}
      >
        {/* paper grain */}
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full opacity-[0.05] mix-blend-multiply dark:opacity-[0.08] dark:mix-blend-screen" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

        {/* seal slot */}
        <span aria-hidden className="relative grid size-11 shrink-0 place-items-center">
          <span className={cn('absolute inset-0 rounded-full border border-dashed transition-opacity duration-200', waxOn ? 'opacity-0' : 'opacity-100', 'border-[#2a1d14]/25 dark:border-[#f3e9dc]/25')} />
          <AnimatePresence>
            {!waxOn && phase !== 'error' && (
              <motion.span key="mail" className="absolute" initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={spring}>
                <Mail className="size-[18px]" />
              </motion.span>
            )}
            {phase === 'error' && (
              <motion.span key="err" className="absolute text-rose-700 dark:text-rose-300" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <RotateCcw className="size-[18px]" />
              </motion.span>
            )}
          </AnimatePresence>

          <svg viewBox="0 0 44 44" className="absolute -inset-1 size-[52px] overflow-visible">
            <defs>
              <radialGradient id={`${uid}w`} cx="0.38" cy="0.32" r="0.75">
                <stop offset="0" stopColor={`color-mix(in oklab, ${accent} 70%, #ffd0d6)`} />
                <stop offset="0.45" stopColor={accent} />
                <stop offset="1" stopColor={`color-mix(in oklab, ${accent} 55%, #000)`} />
              </radialGradient>
            </defs>
            {/* falling drop */}
            <AnimatePresence>
              {phase === 'pouring' && !reduced && (
                <motion.ellipse key="drop" cx="22" rx="3.2" ry="4.2" fill={`url(#${uid}w)`} initial={{ cy: -14, opacity: 1 }} animate={{ cy: 20, opacity: [1, 1, 0] }} transition={{ duration: 0.32, ease: [0.5, 0, 1, 0.6] }} />
              )}
            </AnimatePresence>
            {/* puddle */}
            <motion.g
              initial={false}
              animate={waxOn ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={reduced ? { duration: 0.15 } : waxOn ? { scale: { type: 'spring', stiffness: 160, damping: 11, delay: 0.26 }, opacity: { duration: 0.1, delay: 0.26 } } : { duration: 0.25 }}
              style={{ transformOrigin: '22px 22px' }}
            >
              <path d={blob} fill={`url(#${uid}w)`} />
              <path d={blob} fill="none" stroke="#000" strokeOpacity="0.18" strokeWidth="0.6" />
              <circle cx="22" cy="22" r="11" fill="none" stroke="#000" strokeOpacity={pressed ? 0.28 : 0} strokeWidth="1.4" style={{ transition: 'stroke-opacity 200ms' }} />
              <circle cx="22" cy="22" r="11" fill="none" stroke="#fff" strokeOpacity={pressed ? 0.25 : 0} strokeWidth="0.6" transform="translate(-0.5 -0.6)" style={{ transition: 'stroke-opacity 200ms' }} />
              <motion.g initial={false} animate={{ opacity: pressed ? 1 : 0 }} transition={{ duration: 0.15 }} fontSize={monogram.length > 1 ? 9 : 12.5} fontFamily="var(--font-display, Georgia), Georgia, serif" textAnchor="middle" dominantBaseline="central">
                <text x="22.5" y="22.6" fill="#fff" fillOpacity="0.35">{monogram.slice(0, 2)}</text>
                <text x="22" y="22" fill={`color-mix(in oklab, ${accent} 50%, #000)`}>{monogram.slice(0, 2)}</text>
              </motion.g>
              <ellipse cx="17" cy="14.5" rx="4.5" ry="2" fill="#fff" opacity="0.32" transform="rotate(-28 17 14.5)" />
            </motion.g>
            {/* brass stamp */}
            <AnimatePresence>
              {phase === 'stamping' && !reduced && (
                <motion.g key="stamp" initial={{ y: -26, opacity: 0, scale: 1.2 }} animate={{ y: [-26, 0, 0, -30], opacity: [0, 1, 1, 0], scale: [1.2, 0.96, 1, 1.1] }} transition={{ duration: 0.52, times: [0, 0.35, 0.6, 1], ease: 'easeInOut' }} style={{ transformOrigin: '22px 22px' }}>
                  <circle cx="22" cy="22" r="13" fill="#b08a4a" />
                  <circle cx="22" cy="22" r="13" fill="none" stroke="#6b4f22" strokeWidth="1.5" />
                  <circle cx="22" cy="22" r="9" fill="#d6b06a" opacity="0.6" />
                </motion.g>
              )}
            </AnimatePresence>
          </svg>
          {/* ripple on seal */}
          <AnimatePresence>
            {phase === 'sealed' && !reduced && (
              <motion.span key="ring" className="absolute inset-0 rounded-full border-2" style={{ borderColor: accent }} initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1.9, opacity: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} />
            )}
          </AnimatePresence>
        </span>

        <span className="relative inline-flex items-center gap-1.5 whitespace-nowrap">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={text}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={spring}
              className="inline-flex items-center gap-1.5"
            >
              {phase === 'sealed' && <Check aria-hidden className="size-4" style={{ color: `color-mix(in oklab, ${accent} 80%, currentColor)` }} />}
              {text}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.button>
      <p role="status" aria-live="polite" className="sr-only">
        {phase === 'pouring' ? busyLabel : phase === 'sealed' ? sealedLabel : phase === 'error' ? errorLabel : ''}
      </p>
    </div>
  )
}
