import * as React from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useTransform, type PanInfo } from 'motion/react'
import { Plane, RotateCcw, Scissors } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type BoardingPassData = {
  carrier: string
  cabin: string
  flight: string
  from: { code: string; city: string; time: string }
  to: { code: string; city: string; time: string; dayOffset?: string }
  duration: string
  passenger: string
  date: string
  gate: string
  seat: string
  boarding: string
  group: string
}

export type TearStubBoardingPassProps = {
  pass?: Partial<BoardingPassData>
  /** Accent for the route line, plane and the "Boarded" stamp. */
  accent?: string
  /** Controlled torn state. */
  torn?: boolean
  defaultTorn?: boolean
  onTornChange?: (torn: boolean) => void
  className?: string
}

export const DEFAULT_BOARDING_PASS: BoardingPassData = {
  carrier: 'Aster Air',
  cabin: 'Economy Plus',
  flight: 'AS 218',
  from: { code: 'LIS', city: 'Lisbon', time: '07:40' },
  to: { code: 'HND', city: 'Tokyo', time: '06:15', dayOffset: '+1' },
  duration: '13h 35m · nonstop',
  passenger: 'Mara Okafor',
  date: '14 Nov',
  gate: 'B12',
  seat: '14A',
  boarding: '07:05',
  group: '2',
}

function QrMark({ seed, className }: { seed: string; className?: string }) {
  const cells = React.useMemo(() => {
    let h = 2166136261
    for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
    const out: [number, number][] = []
    const N = 21
    const finder = (x: number, y: number) => (x < 7 && y < 7) || (x > N - 8 && y < 7) || (x < 7 && y > N - 8)
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      if (finder(x, y)) continue
      h = Math.imul(h ^ (x * 31 + y * 17), 2246822507) >>> 0
      if (h % 100 < 46) out.push([x, y])
    }
    return out
  }, [seed])
  return (
    <svg aria-hidden viewBox="0 0 21 21" className={className} shapeRendering="crispEdges">
      {cells.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" />)}
      {[[0, 0], [14, 0], [0, 14]].map(([x, y]) => (
        <g key={`${x}${y}`} fill="currentColor">
          <path d={`M${x} ${y}h7v7h-7z M${x + 1} ${y + 1}v5h5v-5z`} fillRule="evenodd" />
          <rect x={x + 2} y={y + 2} width="3" height="3" />
        </g>
      ))}
    </svg>
  )
}

const zigzag = (vertical: boolean, n = 28, d = 5) => {
  const pts: string[] = []
  if (!vertical) {
    pts.push('0 0', `calc(100% - ${d}px) 0`)
    for (let i = 0; i <= n; i++) pts.push(`${i % 2 ? '100%' : `calc(100% - ${d}px)`} ${(i / n) * 100}%`)
    pts.push('0 100%')
  } else {
    pts.push('0 0', '100% 0', `100% calc(100% - ${d}px)`)
    for (let i = n; i >= 0; i--) pts.push(`${(i / n) * 100}% ${i % 2 ? '100%' : `calc(100% - ${d}px)`}`)
  }
  return `polygon(${pts.join(',')})`
}

/**
 * Tear-Stub Boarding Pass — a frosted-glass boarding pass with a perforated
 * stub. Drag the stub away from the perforation (or press "Tear stub") and it
 * resists, tears free with a ragged edge and tumbles out of frame while a
 * "Boarded" stamp thumps onto the pass.
 */
export function TearStubBoardingPass({ pass: passProp, accent = '#be123c', torn: tornProp, defaultTorn = false, onTornChange, className }: TearStubBoardingPassProps) {
  const reduced = usePrefersReducedMotion()
  const pass = { ...DEFAULT_BOARDING_PASS, ...passProp, from: { ...DEFAULT_BOARDING_PASS.from, ...passProp?.from }, to: { ...DEFAULT_BOARDING_PASS.to, ...passProp?.to } }
  const rootRef = React.useRef<HTMLDivElement>(null)
  const actionRef = React.useRef<HTMLButtonElement>(null)
  const [W, setW] = React.useState(640)
  const [inner, setInner] = React.useState(defaultTorn)
  const torn = tornProp ?? inner
  const pull = useMotionValue(0)
  const vertical = W < 560
  const tilt = useTransform(pull, [0, 90], [0, vertical ? -3 : 4])
  const stubRotate = useTransform(pull, [0, 90], [0, vertical ? -2 : 3])

  React.useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return
    const update = () => setW(el.clientWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const setTorn = (v: boolean) => {
    if (tornProp === undefined) setInner(v)
    onTornChange?.(v)
    if (!v) pull.set(0)
  }

  const onPan = (_: PointerEvent, info: PanInfo) => {
    if (torn) return
    const d = Math.max(0, vertical ? info.offset.y : info.offset.x)
    pull.set(d < 70 ? d * 0.55 : 38 + (d - 70) * 0.9)
  }
  const onPanEnd = () => {
    if (torn) return
    if (pull.get() > 60) setTorn(true)
    else animate(pull, 0, { type: 'spring', stiffness: 500, damping: 22 })
  }

  const notchR = 13
  const mainMask = vertical
    ? `radial-gradient(circle at 0 100%, transparent ${notchR}px, #000 ${notchR + 0.5}px) left/51% 100% no-repeat, radial-gradient(circle at 100% 100%, transparent ${notchR}px, #000 ${notchR + 0.5}px) right/51% 100% no-repeat`
    : `radial-gradient(circle at 100% 0, transparent ${notchR}px, #000 ${notchR + 0.5}px) top/100% 51% no-repeat, radial-gradient(circle at 100% 100%, transparent ${notchR}px, #000 ${notchR + 0.5}px) bottom/100% 51% no-repeat`
  const stubMask = vertical
    ? `radial-gradient(circle at 0 0, transparent ${notchR}px, #000 ${notchR + 0.5}px) left/51% 100% no-repeat, radial-gradient(circle at 100% 0, transparent ${notchR}px, #000 ${notchR + 0.5}px) right/51% 100% no-repeat`
    : `radial-gradient(circle at 0 0, transparent ${notchR}px, #000 ${notchR + 0.5}px) top/100% 51% no-repeat, radial-gradient(circle at 0 100%, transparent ${notchR}px, #000 ${notchR + 0.5}px) bottom/100% 51% no-repeat`

  const glass = 'bg-white/55 ring-1 ring-inset ring-white/70 backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgb(255_255_255/0.9)] dark:bg-white/[0.07] dark:ring-white/[0.14] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.12)]'
  const label = 'text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600 dark:text-zinc-400'
  const value = 'mt-0.5 text-[15px] font-semibold tabular-nums text-zinc-950 dark:text-white'

  const fields: [string, string][] = [
    ['Passenger', pass.passenger],
    ['Flight', pass.flight],
    ['Date', pass.date],
    ['Boarding', pass.boarding],
    ['Gate', pass.gate],
    ['Group', pass.group],
  ]

  return (
    <div
      ref={rootRef}
      className={cn('relative isolate w-full max-w-[760px] overflow-hidden rounded-3xl px-4 py-8 ring-1 ring-black/[0.06] sm:px-8 sm:py-10 dark:ring-white/[0.07]', className)}
    >
      {/* backdrop the glass refracts */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[#f6f1f2] dark:bg-[#0c0709]">
        <div className="absolute -left-[10%] top-[8%] size-[46%] rounded-full opacity-70 blur-3xl dark:opacity-60" style={{ background: accent }} />
        <div className="absolute right-[2%] top-[30%] size-[36%] rounded-full bg-amber-300 opacity-70 blur-3xl dark:bg-amber-500 dark:opacity-30" />
        <div className="absolute bottom-[-12%] left-[34%] size-[40%] rounded-full bg-violet-300 opacity-60 blur-3xl dark:bg-violet-700 dark:opacity-40" />
      </div>

      <motion.div
        className={cn('relative mx-auto flex w-full max-w-[680px] drop-shadow-[0_24px_40px_rgb(60_10_20/0.18)] dark:drop-shadow-[0_24px_40px_rgb(0_0_0/0.5)]', vertical ? 'flex-col' : 'flex-row')}
        style={{ rotate: reduced ? 0 : tilt }}
      >
        {/* main */}
        <div
          className={cn('relative min-w-0 flex-1 rounded-[22px] p-5 text-zinc-950 sm:p-6 dark:text-white', glass)}
          style={{ WebkitMask: mainMask, mask: mainMask, clipPath: torn ? zigzag(vertical) : undefined }}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-[13px] font-semibold tracking-[-0.01em]">
              <svg aria-hidden viewBox="0 0 24 24" className="size-5" style={{ color: accent }}>
                {[0, 45, 90, 135].map((r) => <rect key={r} x="10.5" y="1" width="3" height="22" rx="1.5" fill="currentColor" transform={`rotate(${r} 12 12)`} opacity={r % 90 ? 0.55 : 1} />)}
              </svg>
              {pass.carrier}
            </span>
            <span className="rounded-full bg-zinc-950/[0.06] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-700 dark:bg-white/10 dark:text-zinc-200">{pass.cabin}</span>
          </div>

          <div className="mt-5 flex items-end justify-between gap-2">
            <div>
              <p className="text-[clamp(30px,8cqw,44px)] font-semibold leading-none tracking-[-0.04em]">{pass.from.code}</p>
              <p className="mt-1 text-[12px] text-zinc-700 dark:text-zinc-300">{pass.from.city} · <span className="tabular-nums">{pass.from.time}</span></p>
            </div>
            <div className="relative mb-6 flex min-w-0 flex-1 flex-col items-center px-1">
              <svg aria-hidden viewBox="0 0 120 30" preserveAspectRatio="none" className="h-7 w-full">
                <path d="M2 28 Q60 -8 118 28" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 4" className="text-zinc-500 dark:text-zinc-500" vectorEffect="non-scaling-stroke" />
              </svg>
              <Plane aria-hidden className="absolute left-1/2 top-[-2px] size-5 -translate-x-1/2 rotate-45" style={{ color: accent }} />
              <p className="mt-0.5 whitespace-nowrap text-[10px] font-medium text-zinc-600 dark:text-zinc-400">{pass.duration}</p>
            </div>
            <div className="text-right">
              <p className="text-[clamp(30px,8cqw,44px)] font-semibold leading-none tracking-[-0.04em]">{pass.to.code}</p>
              <p className="mt-1 text-[12px] text-zinc-700 dark:text-zinc-300">{pass.to.city} · <span className="tabular-nums">{pass.to.time}</span>{pass.to.dayOffset && <sup className="ml-0.5 text-[9px]">{pass.to.dayOffset}</sup>}</p>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-3 gap-x-4 gap-y-3 border-t border-dashed border-zinc-900/15 pt-4 dark:border-white/15">
            {fields.map(([k, v]) => (
              <div key={k} className={cn('min-w-0', vertical && k === 'Passenger' && 'col-span-3')}>
                <dt className={label}>{k}</dt>
                <dd className={cn(value, 'truncate')}>{v}</dd>
              </div>
            ))}
          </dl>

          <AnimatePresence>
            {torn && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute right-[8%] top-[34%] rounded-xl border-[3px] px-3 py-1.5 text-center font-bold uppercase leading-none tracking-[0.18em]"
                style={{ color: accent, borderColor: accent, rotate: -9 }}
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.8 }}
                animate={{ opacity: 0.9, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={reduced ? { duration: 0.2 } : { type: 'spring', stiffness: 520, damping: 18, delay: 0.25 }}
              >
                <span className="block text-[18px]">Boarded</span>
                <span className="mt-1 block text-[9px] tracking-[0.24em]">Gate {pass.gate} · {pass.boarding}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* stub */}
        <div className={cn('relative shrink-0', vertical ? 'h-[132px] w-full' : 'w-[30%] min-w-[150px]')}>
          <AnimatePresence initial={false}>
            {!torn && (
              <motion.div
                key="stub"
                onPan={onPan}
                onPanEnd={onPanEnd}
                className={cn(
                  'absolute inset-0 flex cursor-grab touch-none items-center rounded-[22px] text-zinc-950 active:cursor-grabbing dark:text-white',
                  vertical ? 'flex-row gap-4 border-t-2 border-dashed border-zinc-900/20 px-5 dark:border-white/20' : 'flex-col justify-center gap-3 border-l-2 border-dashed border-zinc-900/20 p-5 dark:border-white/20',
                  glass,
                )}
                style={vertical ? { WebkitMask: stubMask, mask: stubMask, y: pull, rotate: stubRotate } : { WebkitMask: stubMask, mask: stubMask, x: pull, rotate: stubRotate }}
                exit={reduced ? { opacity: 0, transition: { duration: 0.2 } } : vertical ? { y: 260, x: 60, rotate: 14, opacity: 0, transition: { duration: 0.85, ease: [0.55, 0, 0.9, 0.4] } } : { x: 180, y: 320, rotate: 28, opacity: 0, transition: { duration: 0.85, ease: [0.55, 0, 0.9, 0.4] } }}
              >
                <div className={cn(vertical ? 'min-w-0 flex-1' : 'text-center')}>
                  <p className={label}>Seat</p>
                  <p className="text-[30px] font-semibold leading-none tracking-[-0.04em] tabular-nums">{pass.seat}</p>
                  <p className="mt-1.5 text-[11px] font-medium text-zinc-700 dark:text-zinc-300">{pass.flight} · {pass.from.code}→{pass.to.code}</p>
                </div>
                <div className="grid size-[84px] shrink-0 place-items-center rounded-xl bg-white p-2 text-zinc-950 shadow-[0_1px_2px_rgb(0_0_0/0.08)] dark:bg-zinc-50">
                  <QrMark seed={`${pass.flight}${pass.seat}${pass.passenger}`} className="size-full" />
                </div>
                <p aria-hidden className={cn('text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-400', vertical && 'hidden')}>
                  {'Pull to tear →'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="relative mt-6 flex items-center justify-center">
        <button
          ref={actionRef}
          type="button"
          onClick={() => setTorn(!torn)}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-zinc-950 px-5 text-[13px] font-medium text-white shadow-[0_8px_20px_-10px_rgb(0_0_0/0.5)] outline-none transition-transform duration-150 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 dark:bg-white dark:text-zinc-950 dark:focus-visible:ring-white dark:focus-visible:ring-offset-zinc-950"
        >
          {torn ? <RotateCcw aria-hidden className="size-4" /> : <Scissors aria-hidden className="size-4" />}
          {torn ? 'Reset pass' : 'Tear stub'}
        </button>
      </div>
      <p role="status" aria-live="polite" className="sr-only">{torn ? `Stub torn. ${pass.passenger} boarded flight ${pass.flight} at gate ${pass.gate}.` : ''}</p>
    </div>
  )
}

