import * as React from 'react'
import { motion, useAnimate } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Phase = 'idle' | 'confirm' | 'open' | 'swallow' | 'close' | 'ring' | 'rest' | 'return'
export type SwallowDeleteVariant = 'violet' | 'neutral' | 'danger'

export type SwallowDeleteButtonProps = {
  label?: string
  variant?: SwallowDeleteVariant
  /** Ask for a second press before deleting. */
  confirm?: boolean
  confirmHint?: string
  /** Called when the letters are swallowed. Rejecting spits them back out. */
  onDelete?: () => void | Promise<unknown>
  disabled?: boolean
  className?: string
}

const VARIANTS: Record<SwallowDeleteVariant, { base: string; ring: string; glow: string; focus: string }> = {
  violet: {
    base: 'bg-[linear-gradient(180deg,#8b6cff,#6d4aff)] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.3),0_1px_2px_rgb(0_0_0/0.3),0_16px_34px_-16px_rgb(109_74_255/0.9)]',
    ring: '#efeaff',
    glow: 'rgb(239 234 255/0.35)',
    focus: 'focus-visible:ring-violet-300',
  },
  neutral: {
    base: 'bg-[linear-gradient(180deg,#2a2832,#1a1920)] text-zinc-100 shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_0_0_1px_rgb(255_255_255/0.06),0_16px_34px_-16px_rgb(0_0_0/0.9)]',
    ring: '#5eead4',
    glow: 'rgb(94 234 212/0.3)',
    focus: 'focus-visible:ring-teal-300',
  },
  danger: {
    base: 'bg-[linear-gradient(180deg,#f43f5e,#d91a45)] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.28),0_1px_2px_rgb(0_0_0/0.3),0_16px_34px_-16px_rgb(225_29_72/0.9)]',
    ring: '#ffe4e8',
    glow: 'rgb(255 228 232/0.35)',
    focus: 'focus-visible:ring-rose-300',
  },
}

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

/**
 * Swallow Delete Button — the lid swings open on its hinge, each letter of the
 * label arcs into the bin, the lid snaps shut and a ring traces a receipt
 * around it before the label drops back in.
 */
export function SwallowDeleteButton({
  label = 'Delete',
  variant = 'violet',
  confirm = false,
  confirmHint = 'Press again to delete',
  onDelete,
  disabled,
  className,
}: SwallowDeleteButtonProps) {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = React.useState<Phase>('idle')
  const [offsets, setOffsets] = React.useState<{ x: number; y: number }[]>([])
  const [gulp, setGulp] = React.useState(0)
  const [scope, animate] = useAnimate<HTMLButtonElement>()
  const binRef = React.useRef<HTMLSpanElement>(null)
  const letterRefs = React.useRef<(HTMLSpanElement | null)[]>([])
  const run = React.useRef(0)
  const v = VARIANTS[variant]
  const chars = React.useMemo(() => Array.from(label), [label])

  React.useEffect(() => () => void (run.current += 1), [])

  React.useEffect(() => {
    if (phase !== 'confirm') return
    const t = window.setTimeout(() => setPhase('idle'), 3200)
    return () => window.clearTimeout(t)
  }, [phase])

  const shakeIt = () => {
    if (scope.current) void animate(scope.current, { x: [0, -6, 6, -4, 4, 0] }, { duration: 0.4 })
  }

  const busy = phase !== 'idle' && phase !== 'confirm'
  const lidOpen = phase === 'open' || phase === 'swallow'
  const collapsed = phase === 'ring' || phase === 'rest'
  const hidden = phase === 'swallow' || phase === 'close' || collapsed

  const perLetter = 48
  const flight = 520

  const go = async () => {
    const id = ++run.current
    const alive = () => id === run.current
    let failed = false
    const work = Promise.resolve()
      .then(() => onDelete?.())
      .catch(() => {
        failed = true
      })

    if (reduced) {
      setPhase('rest')
      await work
      await sleep(900)
      if (!alive()) return
      if (failed) shakeIt()
      setPhase('idle')
      return
    }

    const bin = binRef.current?.getBoundingClientRect()
    if (bin) {
      const bx = bin.left + bin.width / 2
      const by = bin.top + bin.height * 0.42
      setOffsets(
        letterRefs.current.map((el) => {
          if (!el) return { x: 0, y: 0 }
          const r = el.getBoundingClientRect()
          return { x: bx - (r.left + r.width / 2), y: by - (r.top + r.height / 2) }
        }),
      )
    }
    setPhase('open')
    await sleep(220)
    if (!alive()) return
    setPhase('swallow')
    chars.forEach((_, i) => {
      window.setTimeout(() => alive() && setGulp((g) => g + 1), i * perLetter + flight - 40)
    })
    await sleep(chars.length * perLetter + flight + 40)
    if (!alive()) return
    setPhase('close')
    await sleep(180)
    await work
    if (!alive()) return
    if (failed) {
      shakeIt()
      setPhase('return')
      await sleep(600)
      if (alive()) setPhase('idle')
      return
    }
    setPhase('ring')
    await sleep(1050)
    if (!alive()) return
    setPhase('rest')
    await sleep(650)
    if (!alive()) return
    setPhase('return')
    await sleep(chars.length * 40 + 500)
    if (alive()) setPhase('idle')
  }

  const onClick = () => {
    if (disabled || busy) return
    if (confirm && phase === 'idle') {
      setPhase('confirm')
      return
    }
    void go()
  }

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)}>
      <motion.button
        type="button"
        onClick={onClick}
        onBlur={() => phase === 'confirm' && setPhase('idle')}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && phase === 'confirm') setPhase('idle')
        }}
        disabled={disabled}
        aria-busy={busy}
        aria-label={phase === 'confirm' ? `${confirmHint}` : label}
        ref={scope}
        whileTap={busy || reduced ? undefined : { scale: 0.96 }}
        className={cn(
          'group relative inline-flex h-12 items-center rounded-full pl-3 text-[15px] font-semibold tracking-tight outline-none transition-[padding,background-color] duration-300',
          'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0b10] disabled:cursor-not-allowed disabled:opacity-50',
          v.base,
          v.focus,
          collapsed ? 'pr-3' : 'pr-5',
          phase === 'confirm' && 'ring-2 ring-white/40',
        )}
      >
        {/* bin + ring */}
        <span ref={binRef} className="relative z-10 grid h-6 w-6 place-items-center">
          <svg viewBox="0 0 40 40" className="pointer-events-none absolute -inset-2 h-10 w-10 -rotate-90 overflow-visible" aria-hidden>
            <motion.circle
              cx={20}
              cy={20}
              r={18}
              fill="none"
              stroke={v.ring}
              strokeWidth={2}
              strokeLinecap="round"
              initial={false}
              animate={{
                pathLength: phase === 'ring' || phase === 'rest' ? 1 : 0,
                opacity: phase === 'ring' || phase === 'rest' ? 1 : 0,
              }}
              transition={
                phase === 'ring'
                  ? { pathLength: { duration: 1, ease: [0.65, 0, 0.35, 1] }, opacity: { duration: 0.1 } }
                  : { duration: reduced ? 0 : 0.25 }
              }
              style={{ filter: `drop-shadow(0 0 4px ${v.glow})` }}
            />
          </svg>
          <motion.svg
            key={gulp}
            viewBox="0 0 24 24"
            className="h-6 w-6 overflow-visible"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            initial={gulp && !reduced ? { scaleY: 0.86, scaleX: 1.08 } : false}
            animate={{ scaleY: 1, scaleX: 1 }}
            transition={{ type: 'spring', stiffness: 700, damping: 14 }}
            style={{ originY: 1 }}
          >
            <motion.g
              initial={false}
              animate={{
                rotate: lidOpen ? -42 : phase === 'confirm' ? [-8, 0, -8] : 0,
                y: lidOpen ? -1.5 : 0,
              }}
              transition={
                lidOpen
                  ? { type: 'spring', stiffness: 420, damping: 16 }
                  : phase === 'confirm'
                    ? { duration: 0.6, repeat: Infinity }
                    : { type: 'spring', stiffness: 900, damping: 22 }
              }
              style={{ transformBox: 'fill-box', originX: 0, originY: 1 }}
            >
              <path d="M3.5 6.5h17" />
              <path d="M9 6.5V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v1.5" />
            </motion.g>
            <path d="M5.5 6.5l1.1 12.6a2 2 0 0 0 2 1.9h6.8a2 2 0 0 0 2-1.9l1.1-12.6" />
            <path d="M10 10.8v6M14 10.8v6" strokeOpacity={0.7} />
          </motion.svg>
        </span>

        {/* letters */}
        <motion.span
          className="relative flex overflow-visible"
          initial={false}
          animate={{ width: collapsed ? 0 : 'auto', marginLeft: collapsed ? 0 : 10 }}
          transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 30 }}
        >
          <span className="flex whitespace-pre" aria-hidden>
            {chars.map((ch, i) => {
              const o = offsets[i] ?? { x: 0, y: 0 }
              const flying = phase === 'swallow'
              return (
                <motion.span
                  key={`${ch}-${i}`}
                  ref={(el) => {
                    letterRefs.current[i] = el
                  }}
                  className="inline-block"
                  initial={false}
                  animate={
                    flying && !reduced
                      ? {
                          x: [0, o.x * 0.55, o.x],
                          y: [0, o.y - 22 - i * 1.5, o.y + 3],
                          scale: [1, 0.92, 0.2],
                          rotate: [0, -24, -70],
                          opacity: [1, 1, 0],
                        }
                      : hidden
                        ? { x: 0, y: 0, scale: 1, rotate: 0, opacity: 0 }
                        : { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }
                  }
                  transition={
                    flying
                      ? {
                          duration: flight / 1000,
                          delay: (i * perLetter) / 1000,
                          times: [0, 0.45, 1],
                          x: { duration: flight / 1000, delay: (i * perLetter) / 1000, ease: 'linear' },
                          y: {
                            duration: flight / 1000,
                            delay: (i * perLetter) / 1000,
                            times: [0, 0.45, 1],
                            ease: ['easeOut', 'easeIn'],
                          },
                        }
                      : phase === 'return'
                        ? { type: 'spring', stiffness: 520, damping: 22, delay: 0.1 + i * 0.04 }
                        : { duration: 0 }
                  }
                >
                  {ch === ' ' ? '\u00a0' : ch}
                </motion.span>
              )
            })}
          </span>
          <span className="sr-only">{label}</span>
        </motion.span>
      </motion.button>

      {confirm && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute top-full mt-2 whitespace-nowrap rounded-md bg-zinc-900/90 px-2 py-1 text-[11px] font-medium text-zinc-200 ring-1 ring-white/10"
          initial={false}
          animate={{ opacity: phase === 'confirm' ? 1 : 0, y: phase === 'confirm' ? 0 : -4 }}
          transition={{ duration: 0.18 }}
        >
          {confirmHint}
        </motion.span>
      )}
      <span className="sr-only" role="status" aria-live="polite">
        {phase === 'confirm' ? confirmHint : phase === 'ring' || phase === 'rest' ? `${label} complete. Item removed.` : ''}
      </span>
    </div>
  )
}
