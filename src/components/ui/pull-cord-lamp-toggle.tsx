import * as React from 'react'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type PullCordLampToggleProps = {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  disabled?: boolean
  /** Scene height in px. */
  height?: number
  className?: string
}

const PULL = 44

/**
 * Pull-Cord Lamp Toggle — a pendant lamp switched by its pull cord. Drag the
 * bead down (or press Space / Enter) until it clicks; the cord snaps back
 * with an elastic bounce and sways, the shade rocks on its wire, and the
 * bulb warms up into a cone of light with drifting dust motes.
 */
export function PullCordLampToggle({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  label = 'Reading lamp',
  disabled = false,
  height = 300,
  className,
}: PullCordLampToggleProps) {
  const reduced = usePrefersReducedMotion()
  const [inner, setInner] = React.useState(defaultChecked)
  const on = checkedProp ?? inner
  const y = useMotionValue(0)
  const sway = useMotionValue(0)
  const lampRock = useMotionValue(0)
  const cordLen = useTransform(y, (v) => 92 + v)
  const bulbWarm = useMotionValue(on ? 1 : 0)
  const armed = React.useRef(false)
  const [clicked, setClicked] = React.useState(false)

  React.useEffect(() => {
    const c = animate(bulbWarm, on ? 1 : 0, reduced ? { duration: 0 } : on ? { duration: 0.5, ease: [0.2, 0.9, 0.3, 1] } : { duration: 0.25 })
    return () => c.stop()
  }, [on, reduced, bulbWarm])

  const flip = () => {
    if (disabled) return
    const next = !on
    if (checkedProp === undefined) setInner(next)
    onCheckedChange?.(next)
    if (!reduced) {
      animate(lampRock, [0, next ? 5 : -4, next ? -3 : 2.5, 1.2, 0], { duration: 1.6, ease: 'easeOut' })
    }
  }

  const release = (vx = 0) => {
    const didPull = y.get() > PULL * 0.8
    if (reduced) y.set(0)
    else animate(y, 0, { type: 'spring', stiffness: 520, damping: 11, mass: 0.7 })
    if (!reduced) animate(sway, [0, 14 + Math.min(10, Math.abs(vx) / 60), -10, 6, -3, 0], { duration: 1.8, ease: 'easeOut' })
    if (didPull) flip()
    armed.current = false
    setClicked(false)
  }

  const keyPull = () => {
    if (disabled) return
    if (reduced) return flip()
    animate(y, PULL + 6, { duration: 0.14, ease: 'easeIn' }).then(() => release())
  }

  const glow = useTransform(bulbWarm, [0, 1], [0, 1])
  const dim = useTransform(glow, (g) => 1 - g)
  const bulbFill = useTransform(bulbWarm, [0, 1], ['#d9d6cf', '#fff3c4'])

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div
        className="relative w-[260px] select-none overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#f4f1ea,#e8e3d8)] ring-1 ring-black/[0.06] transition-colors duration-500 dark:bg-[linear-gradient(180deg,#121214,#0a0a0b)] dark:ring-white/[0.07]"
        style={{ height }}
      >
        {/* room light wash */}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_45%_62%,rgb(255_214_140/0.55),transparent_70%)] dark:bg-[radial-gradient(70%_60%_at_45%_62%,rgb(255_196_110/0.30),transparent_70%)]" style={{ opacity: glow }} />
        {/* lamp assembly rocks from the ceiling */}
        <motion.div className="absolute left-[46%] top-0 origin-top" style={{ rotate: lampRock }}>
          {/* wire */}
          <div className="absolute left-0 top-0 h-[70px] w-px -translate-x-1/2 bg-zinc-500/70 dark:bg-zinc-600" />
          {/* shade */}
          <div className="absolute left-0 top-[64px] -translate-x-1/2">
            <svg width="120" height="76" viewBox="0 0 120 76" aria-hidden className="overflow-visible">
              <defs>
                <linearGradient id="pcl-shade" x1="0" x2="1">
                  <stop offset="0" stopColor="#2b2b2f" />
                  <stop offset="0.45" stopColor="#4a4a50" />
                  <stop offset="1" stopColor="#1f1f22" />
                </linearGradient>
                <radialGradient id="pcl-bulb-glow">
                  <stop offset="0" stopColor="#ffe7a3" stopOpacity="0.95" />
                  <stop offset="1" stopColor="#ffb54d" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect x="54" y="0" width="12" height="12" rx="3" fill="#3a3a3f" />
              <motion.circle cx="60" cy="58" r="40" fill="url(#pcl-bulb-glow)" style={{ opacity: glow }} />
              <motion.circle cx="60" cy="54" r="11" style={{ fill: bulbFill }} />
              <path d="M22 58 Q 26 18 60 10 Q 94 18 98 58 Z" fill="url(#pcl-shade)" />
              <path d="M22 58 L98 58" stroke="#8a8a90" strokeWidth="1.2" />
              <path d="M40 22 Q 48 16 58 14" stroke="white" strokeOpacity="0.25" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          {/* light cone */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-0 top-[122px] h-[220px] w-[240px] -translate-x-1/2 [clip-path:polygon(34%_0,66%_0,100%_100%,0_100%)]"
            style={{ opacity: glow }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(255_226_150/0.55),rgb(255_226_150/0))] dark:bg-[linear-gradient(180deg,rgb(255_210_120/0.38),rgb(255_210_120/0))]" />
            {!reduced && on &&
              Array.from({ length: 10 }, (_, i) => (
                <motion.span
                  key={i}
                  className="absolute h-[3px] w-[3px] rounded-full bg-amber-100/90"
                  style={{ left: `${30 + ((i * 37) % 40)}%`, top: `${10 + ((i * 53) % 70)}%` }}
                  animate={{ y: [0, -14, 6, 0], x: [0, 6, -4, 0], opacity: [0, 0.9, 0.6, 0] }}
                  transition={{ duration: 5 + (i % 4), repeat: Infinity, delay: i * 0.45, ease: 'easeInOut' }}
                />
              ))}
          </motion.div>
          {/* pull cord hangs from the shade rim */}
          <motion.div className="absolute left-[30px] top-[118px] origin-top" style={{ rotate: sway }}>
            <motion.div className="absolute left-0 top-0 w-px -translate-x-1/2 bg-zinc-600/80 dark:bg-zinc-400/70" style={{ height: cordLen }} />
            <motion.button
              type="button"
              role="switch"
              aria-checked={on}
              aria-label={`${label}: pull cord`}
              disabled={disabled}
              drag={disabled ? false : 'y'}
              dragConstraints={{ top: 0, bottom: PULL + 14 }}
              dragElastic={0.12}
              dragMomentum={false}
              onDrag={() => {
                const past = y.get() > PULL * 0.8
                if (past !== armed.current) {
                  armed.current = past
                  setClicked(past)
                }
              }}
              onDragEnd={(_, info) => release(info.velocity.x)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault()
                  keyPull()
                }
              }}
              onClick={(e) => {
                // plain click without drag (e.g. assistive tech) still toggles
                if (e.detail === 0) keyPull()
              }}
              className="absolute left-0 top-[88px] grid h-10 w-10 -translate-x-1/2 cursor-grab touch-none place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-amber-500 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
              style={{ y }}
            >
              <span className={cn('block h-[18px] w-[11px] rounded-full bg-[linear-gradient(90deg,#b08968,#e6c9a8_45%,#8c6a4d)] shadow-[0_2px_4px_rgb(0_0_0/0.3)] transition-transform', clicked && 'scale-110')} />
            </motion.button>
          </motion.div>
        </motion.div>
        {/* desk + book so the light has something to land on */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[54px] bg-[linear-gradient(180deg,#d8cfbf,#cbbfab)] dark:bg-[linear-gradient(180deg,#1c1b1a,#141312)]" />
        <div aria-hidden className="absolute bottom-[40px] left-[24%] h-3 w-[110px] rounded-[3px] bg-[#8a5a44] shadow-[0_3px_0_#6d4636] dark:bg-[#5a3a2e] dark:shadow-[0_3px_0_#3f281f]" />
        <div aria-hidden className="absolute bottom-[52px] left-[28%] h-2 w-[90px] rounded-[2px] bg-[#e9e2d0] dark:bg-[#6f6a5e]" />
        <motion.div aria-hidden className="absolute bottom-[34px] left-[16%] h-6 w-[62%] rounded-[50%] bg-amber-200/60 blur-md dark:bg-amber-300/25" style={{ opacity: glow }} />
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-black/0 dark:bg-black/40" style={{ opacity: dim }} />
        <span className="absolute right-4 top-4 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">{clicked ? 'click' : on ? 'on' : 'off'}</span>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {label} is <span className={cn('font-medium', on ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-900 dark:text-zinc-100')}>{on ? 'on' : 'off'}</span>
      </p>
      <p className="sr-only" aria-live="polite">{`${label} ${on ? 'on' : 'off'}`}</p>
    </div>
  )
}
