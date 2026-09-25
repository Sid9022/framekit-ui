import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Phase = 'idle' | 'shrink' | 'drop' | 'roll' | 'return'

export type DropInCartButtonProps = {
  label?: string
  /** Controlled item count. */
  count?: number
  /** Uncontrolled initial count. */
  defaultCount?: number
  onCountChange?: (count: number) => void
  /** Singular / plural noun for the counter line. */
  noun?: [string, string]
  /** Upper bound; the button disables when reached. */
  max?: number
  /** Show the “N in your bag” line + clear action under the button. */
  showCounter?: boolean
  disabled?: boolean
  className?: string
}

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

/**
 * Drop-In Cart Button — the pill tucks into a round cart, a box lands in the
 * basket with a spring, the cart rolls away on spinning wheels and returns as
 * the label unfolds and the badge + counter pop.
 */
export function DropInCartButton({
  label = 'Add to bag',
  count,
  defaultCount = 0,
  onCountChange,
  noun = ['item', 'items'],
  max = 99,
  showCounter = true,
  disabled,
  className,
}: DropInCartButtonProps) {
  const reduced = usePrefersReducedMotion()
  const [inner, setInner] = React.useState(defaultCount)
  const value = count ?? inner
  const [phase, setPhase] = React.useState<Phase>('idle')
  const run = React.useRef(0)
  React.useEffect(() => () => void (run.current += 1), [])

  const setValue = (n: number) => {
    if (count === undefined) setInner(n)
    onCountChange?.(n)
  }

  const busy = phase !== 'idle'
  const compact = phase === 'shrink' || phase === 'drop' || phase === 'roll'
  const atMax = value >= max

  const add = async () => {
    if (busy || disabled || atMax) return
    const id = ++run.current
    const alive = () => id === run.current
    if (reduced) {
      setValue(value + 1)
      return
    }
    setPhase('shrink')
    await sleep(260)
    if (!alive()) return
    setPhase('drop')
    await sleep(620)
    if (!alive()) return
    setPhase('roll')
    await sleep(420)
    if (!alive()) return
    setValue(value + 1)
    setPhase('return')
    await sleep(520)
    if (alive()) setPhase('idle')
  }

  const spring = { type: 'spring' as const, stiffness: 380, damping: 30 }

  const cartX = phase === 'roll' ? 64 : 0
  const cartTransition =
    phase === 'roll'
      ? { duration: 0.4, ease: [0.5, 0, 0.9, 0.3] as const }
      : phase === 'return'
        ? { type: 'spring' as const, stiffness: 260, damping: 22 }
        : { duration: 0 }

  return (
    <div className={cn('inline-flex flex-col items-center gap-3', className)}>
      <motion.button
        type="button"
        onClick={add}
        disabled={disabled || atMax}
        aria-busy={busy}
        aria-label={`${label}${value ? `, ${value} in bag` : ''}`}
        initial={false}
        animate={{ width: compact ? 56 : 176 }}
        whileTap={busy || reduced ? undefined : { scale: 0.96 }}
        transition={reduced ? { duration: 0 } : spring}
        className={cn(
          'group relative flex h-14 items-center overflow-visible rounded-full text-[15px] font-semibold tracking-tight text-white',
          'bg-[linear-gradient(180deg,#26232f,#15131b)] shadow-[inset_0_1px_0_rgb(255_255_255/0.14),0_1px_2px_rgb(0_0_0/0.4),0_18px_40px_-18px_rgb(0_0_0/0.8)]',
          'outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0b10]',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        <span className="absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-0 flex items-center">
            {/* cart slot */}
            <span
              className={cn(
                'relative grid h-14 w-14 shrink-0 place-items-center transition-[margin] duration-300',
                compact ? 'ml-0' : 'ml-3',
              )}
            >
              <motion.span
                className="relative block h-7 w-8"
                initial={false}
                animate={{ x: phase === 'return' ? [-64, 0] : cartX }}
                transition={cartTransition}
              >
                <CartGlyph spinning={phase === 'roll' || phase === 'return'} />
                {/* dropping box */}
                <motion.span
                  aria-hidden
                  className="absolute left-[10px] top-[7px] block h-[11px] w-[12px] rounded-[2px] bg-[linear-gradient(180deg,#ffd28a,#f5a63c)] shadow-[inset_0_-1px_0_rgb(0_0_0/0.2)]"
                  initial={false}
                  animate={
                    phase === 'drop' || phase === 'roll'
                      ? { y: 0, opacity: 1, rotate: 0 }
                      : { y: -34, opacity: 0, rotate: 20 }
                  }
                  transition={
                    phase === 'drop'
                      ? { type: 'spring', stiffness: 560, damping: 14, mass: 1.1, opacity: { duration: 0.08 } }
                      : { duration: 0 }
                  }
                >
                  <span className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-white/50" />
                </motion.span>
              </motion.span>
            </span>
            <motion.span
              className="whitespace-nowrap pr-6"
              initial={false}
              animate={{ opacity: compact ? 0 : 1, x: compact ? -8 : 0, filter: compact ? 'blur(4px)' : 'blur(0px)' }}
              transition={{ duration: compact ? 0.15 : 0.3, delay: phase === 'return' ? 0.12 : 0 }}
            >
              {atMax ? 'Bag is full' : label}
            </motion.span>
          </span>
        </span>

        {/* badge */}
        <AnimatePresence>
          {value > 0 && (
            <motion.span
              key={value}
              aria-hidden
              className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-amber-400 px-1.5 text-[11px] font-bold tabular-nums text-zinc-950 shadow-[0_0_0_3px_#0f0e14,0_6px_14px_-4px_rgb(251_191_36/0.6)]"
              initial={reduced ? false : { scale: 0.3, y: 6 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.3, opacity: 0, transition: { duration: 0.12 } }}
              transition={{ type: 'spring', stiffness: 600, damping: 16 }}
            >
              {value}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {showCounter && (
        <div className="flex h-5 items-center gap-2 text-[13px] text-zinc-400">
          <span className="relative inline-flex overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={value}
                className="inline-block font-semibold tabular-nums text-zinc-100"
                initial={reduced ? false : { y: 14, scale: 0.6, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              >
                {value}
              </motion.span>
            </AnimatePresence>
          </span>
          <span>
            {value === 1 ? noun[0] : noun[1]} in your bag
          </span>
          {value > 0 && (
            <button
              type="button"
              onClick={() => setValue(0)}
              disabled={busy}
              className="rounded-md px-1.5 py-0.5 text-[12px] text-zinc-500 underline-offset-2 outline-none transition-colors hover:text-zinc-200 hover:underline focus-visible:ring-2 focus-visible:ring-amber-300 disabled:opacity-40"
            >
              Clear
            </button>
          )}
        </div>
      )}
      <span className="sr-only" role="status" aria-live="polite">
        {value > 0 ? `${value} ${value === 1 ? noun[0] : noun[1]} in your bag` : 'Your bag is empty'}
      </span>
    </div>
  )
}

function CartGlyph({ spinning }: { spinning: boolean }) {
  const wheel = (cx: number) => (
    <motion.g
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      initial={false}
      animate={{ rotate: spinning ? 360 : 0 }}
      transition={spinning ? { duration: 0.35, ease: 'linear', repeat: Infinity } : { duration: 0 }}
    >
      <circle cx={cx} cy={24.5} r={2.6} fill="#15131b" stroke="currentColor" strokeWidth={1.6} />
      <path d={`M${cx - 1.4} 24.5h2.8`} stroke="currentColor" strokeWidth={0.9} />
    </motion.g>
  )
  return (
    <svg viewBox="0 0 32 28" className="absolute inset-0 h-full w-full overflow-visible text-white" aria-hidden>
      <path
        d="M1.5 3.5h3.2l3.4 14.2a2 2 0 0 0 2 1.5h12.6a2 2 0 0 0 1.9-1.4l2.9-9.3H7.1"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8.6 12.5h16" stroke="currentColor" strokeOpacity={0.25} strokeWidth={1.2} />
      {wheel(11)}
      {wheel(22)}
    </svg>
  )
}
