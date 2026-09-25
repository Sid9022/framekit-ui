import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Package, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Phase = 'idle' | 'stretch' | 'load' | 'wait' | 'drive' | 'done' | 'error'

export type DispatchTruckButtonProps = {
  /** Resting label. */
  label?: string
  /** Label shown once the courier has left. */
  successLabel?: string
  /** Label shown if `onOrder` rejects. */
  errorLabel?: string
  /** Optional async work. The courier idles (engine running) until it settles. */
  onOrder?: () => void | Promise<unknown>
  /** Auto-reset delay after success in ms. `0` keeps the success state (click to replay). */
  resetAfter?: number
  disabled?: boolean
  className?: string
}

const WIDTH: Record<Phase, number> = {
  idle: 184,
  stretch: 280,
  load: 280,
  wait: 280,
  drive: 280,
  done: 204,
  error: 204,
}

const VAN_X: Record<Phase, number> = {
  idle: -100,
  stretch: -100,
  load: 38,
  wait: 38,
  drive: 300,
  done: 300,
  error: -100,
}

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

/**
 * Dispatch Truck Button — the pill stretches into a little road, a parcel
 * thumps onto a courier flatbed, and the van drives off before the pill
 * settles into a confirmed state.
 */
export function DispatchTruckButton({
  label = 'Place order',
  successLabel = 'On its way',
  errorLabel = 'Try again',
  onOrder,
  resetAfter = 2600,
  disabled,
  className,
}: DispatchTruckButtonProps) {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = React.useState<Phase>('idle')
  const run = React.useRef(0)

  React.useEffect(() => () => void (run.current += 1), [])

  const busy = phase !== 'idle' && phase !== 'error' && phase !== 'done'
  const track = phase === 'stretch' || phase === 'load' || phase === 'wait' || phase === 'drive'
  const moving = phase === 'load' || phase === 'drive'

  const start = async () => {
    if (busy || disabled) return
    const id = ++run.current
    const alive = () => id === run.current
    let failed = false
    const order = Promise.resolve()
      .then(() => onOrder?.())
      .catch(() => {
        failed = true
      })

    if (reduced) {
      setPhase('wait')
      await Promise.all([order, sleep(500)])
      if (!alive()) return
      setPhase(failed ? 'error' : 'done')
    } else {
      setPhase('stretch')
      await sleep(360)
      if (!alive()) return
      setPhase('load')
      await sleep(900)
      if (!alive()) return
      setPhase('wait')
      await order
      if (!alive()) return
      if (failed) {
        setPhase('error')
        return
      }
      setPhase('drive')
      await sleep(1150)
      if (!alive()) return
      setPhase('done')
    }
    if (failed || !resetAfter) return
    await sleep(resetAfter)
    if (alive()) setPhase('idle')
  }

  const bg =
    phase === 'done'
      ? 'linear-gradient(180deg,#34d399 0%,#10b981 100%)'
      : phase === 'error'
        ? 'linear-gradient(180deg,#fb7185 0%,#e11d48 100%)'
        : 'linear-gradient(180deg,#24212d 0%,#15131b 100%)'

  const status =
    phase === 'done'
      ? `${successLabel}. Your order was placed.`
      : phase === 'error'
        ? 'Order failed. Try again.'
        : busy
          ? 'Placing your order…'
          : ''

  const spring = reduced
    ? { duration: 0.15 }
    : { type: 'spring' as const, stiffness: 320, damping: 28, mass: 0.8 }

  return (
    <div className={cn('inline-flex flex-col items-center', className)}>
      <motion.button
        type="button"
        onClick={start}
        disabled={disabled}
        aria-busy={busy}
        aria-label={phase === 'done' ? successLabel : phase === 'error' ? errorLabel : label}
        initial={false}
        animate={{ width: WIDTH[phase], background: bg }}
        whileTap={busy || reduced ? undefined : { scale: 0.97 }}
        transition={{ width: spring, background: { duration: 0.35 } }}
        className={cn(
          'group relative h-14 overflow-hidden rounded-full text-[15px] font-semibold tracking-tight text-white',
          'shadow-[inset_0_1px_0_rgb(255_255_255/0.14),0_1px_2px_rgb(0_0_0/0.4),0_18px_40px_-18px_rgb(0_0_0/0.8)]',
          'outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0b10]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          busy && 'cursor-progress',
        )}
      >
        {/* road */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 bottom-[9px] h-[2px] rounded-full"
          initial={false}
          animate={{
            opacity: track ? 1 : 0,
            backgroundPositionX: phase === 'drive' && !reduced ? ['0px', '-48px'] : '0px',
          }}
          transition={{
            opacity: { duration: 0.25 },
            backgroundPositionX:
              phase === 'drive' ? { duration: 0.35, ease: 'linear', repeat: Infinity } : { duration: 0 },
          }}
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, rgb(255 255 255/0.28) 0 14px, transparent 14px 24px)',
            maskImage: 'linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent)',
          }}
        />

        {/* idle label */}
        <AnimatePresence initial={false}>
          {(phase === 'idle' || phase === 'error') && (
            <motion.span
              key={phase}
              className="absolute inset-0 flex items-center justify-center gap-2.5"
              initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              transition={{ duration: 0.22 }}
            >
              {phase === 'error' ? (
                <RotateCcw className="h-4 w-4" strokeWidth={2.4} />
              ) : (
                <Package className="h-[18px] w-[18px] opacity-80 transition-transform duration-200 group-hover:-translate-y-0.5" strokeWidth={2} />
              )}
              {phase === 'error' ? errorLabel : label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* courier */}
        {!reduced && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute bottom-[10px] left-0 h-[42px] w-[80px]"
            initial={false}
            animate={{ x: VAN_X[phase] }}
            transition={
              phase === 'drive'
                ? { duration: 1.1, ease: [0.55, 0, 0.8, 0.2] }
                : phase === 'load'
                  ? { type: 'spring', stiffness: 170, damping: 19 }
                  : { duration: 0 }
            }
          >
            <motion.span
              className="absolute inset-0 block"
              initial={false}
              animate={
                phase === 'load'
                  ? { y: [0, 0, 3, -1, 0], scaleY: [1, 1, 0.93, 1.02, 1] }
                  : phase === 'wait'
                    ? { y: [0, 0.6, 0] }
                    : { y: 0, scaleY: 1 }
              }
              transition={
                phase === 'load'
                  ? { duration: 0.55, delay: 0.42, times: [0, 0.2, 0.45, 0.7, 1] }
                  : phase === 'wait'
                    ? { duration: 0.18, repeat: Infinity }
                    : { duration: 0.2 }
              }
              style={{ originY: 1 }}
            >
              <Courier spinning={moving} fast={phase === 'drive'} />
              {/* parcel */}
              <motion.span
                className="absolute left-[11px] top-[3px] block h-[18px] w-[23px]"
                initial={false}
                animate={
                  phase === 'load' || phase === 'wait' || phase === 'drive' || phase === 'done'
                    ? { y: 0, opacity: 1, rotate: 0 }
                    : { y: -64, opacity: 0, rotate: -12 }
                }
                transition={
                  phase === 'load'
                    ? {
                        y: { type: 'spring', stiffness: 520, damping: 15, mass: 1.4, delay: 0.32 },
                        rotate: { type: 'spring', stiffness: 300, damping: 12, delay: 0.32 },
                        opacity: { duration: 0.1, delay: 0.32 },
                      }
                    : { duration: 0 }
                }
              >
                <Parcel />
              </motion.span>
              {/* exhaust */}
              {(phase === 'wait' || phase === 'drive') &&
                [0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="absolute left-[-4px] top-[30px] block h-[7px] w-[7px] rounded-full bg-white/50"
                    initial={{ x: 0, y: 0, scale: 0.4, opacity: 0 }}
                    animate={{ x: -18, y: -8 - i * 2, scale: 1.6, opacity: [0, 0.55, 0] }}
                    transition={{
                      duration: phase === 'drive' ? 0.5 : 0.9,
                      repeat: Infinity,
                      delay: i * (phase === 'drive' ? 0.16 : 0.3),
                      ease: 'easeOut',
                    }}
                  />
                ))}
            </motion.span>
          </motion.span>
        )}

        {reduced && busy && (
          <span className="absolute inset-0 flex items-center justify-center text-sm text-white/80">
            Placing order…
          </span>
        )}

        {/* success */}
        <AnimatePresence>
          {phase === 'done' && (
            <motion.span
              className="absolute inset-0 flex items-center justify-center gap-2.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <motion.span
                className="grid h-7 w-7 place-items-center rounded-full bg-white text-emerald-600 shadow-[0_4px_12px_-4px_rgb(0_0_0/0.35)]"
                initial={{ scale: reduced ? 1 : 0, rotate: reduced ? 0 : -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 520, damping: 16, delay: 0.12 }}
              >
                <Check className="h-4 w-4" strokeWidth={3.2} />
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: reduced ? 1 : 0.6, x: -6 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 420, damping: 20, delay: 0.2 }}
              >
                {successLabel}
              </motion.span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
      <span className="sr-only" role="status" aria-live="polite">
        {status}
      </span>
    </div>
  )
}

function Courier({ spinning, fast }: { spinning: boolean; fast: boolean }) {
  const wheel = (cx: number) => (
    <g>
      <circle cx={cx} cy={28} r={5.2} fill="#0d0b12" />
      <circle cx={cx} cy={28} r={5.2} fill="none" stroke="rgb(255 255 255/0.12)" strokeWidth={0.8} />
      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        initial={false}
        animate={{ rotate: spinning ? 360 : 0 }}
        transition={spinning ? { duration: fast ? 0.28 : 0.6, ease: 'linear', repeat: Infinity } : { duration: 0 }}
      >
        <circle cx={cx} cy={28} r={2.6} fill="#d8d3e6" />
        <path d={`M${cx - 2.6} 28h5.2M${cx} 25.4v5.2`} stroke="#6b6480" strokeWidth={0.9} />
      </motion.g>
    </g>
  )
  return (
    <svg viewBox="0 0 64 34" className="absolute inset-0 h-full w-full overflow-visible">
      <ellipse cx={32} cy={33.2} rx={28} ry={1.4} fill="rgb(0 0 0/0.45)" />
      {/* flatbed */}
      <rect x={2} y={17} width={34} height={7} rx={1.6} fill="#b8a4ff" />
      <rect x={2} y={17} width={34} height={1.4} rx={0.7} fill="#ddd2ff" />
      <path d="M4 20.5h30" stroke="#8c77e6" strokeWidth={0.8} strokeDasharray="2 2" />
      {/* cab */}
      <path
        d="M34 8.5h13.6a4 4 0 0 1 3.3 1.8l5.9 8.6a4 4 0 0 1 .7 2.2V26a2 2 0 0 1-2 2H34z"
        fill="#f6f2ea"
      />
      <path d="M39.5 11.5h7.6a1.2 1.2 0 0 1 1 .5l4.3 6.5h-12.9z" fill="#7cc4ff" />
      <path d="M40.5 12.5h3l-2 5h-1z" fill="rgb(255 255 255/0.6)" />
      <rect x={34} y={21.5} width={23.5} height={2.2} fill="#ff8b6a" />
      <rect x={55.4} y={18.6} width={2.4} height={2.2} rx={0.8} fill="#ffd66b" />
      <rect x={42} y={19.4} width={3.4} height={0.9} rx={0.45} fill="#b9b2c4" />
      {/* chassis */}
      <rect x={1} y={24} width={58} height={3.6} rx={1.8} fill="#2b2735" />
      {wheel(13)}
      {wheel(48)}
    </svg>
  )
}

function Parcel() {
  return (
    <svg viewBox="0 0 23 18" className="h-full w-full overflow-visible">
      <rect x={0.5} y={1} width={22} height={17} rx={2} fill="#d9a766" />
      <rect x={0.5} y={1} width={22} height={4.2} rx={2} fill="#e8bd83" />
      <rect x={9.5} y={1} width={4} height={17} fill="#f5dfb5" />
      <path d="M3 13h4M3 15h2.5" stroke="#9a6b33" strokeWidth={0.9} strokeLinecap="round" />
    </svg>
  )
}
