import * as React from 'react'
import { motion, useMotionValue } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type SwingPriceTagProps = {
  brand?: string
  /** One or two letters in the monogram ring. */
  monogram?: string
  product?: string
  variant?: string
  price?: string
  /** Original price, shown struck through. */
  compareAt?: string
  badge?: string
  /** Rows printed on the back of the tag. */
  details?: [string, string][]
  sku?: string
  flipped?: boolean
  defaultFlipped?: boolean
  onFlippedChange?: (flipped: boolean) => void
  /** Pendulum swing from pointer movement and taps. */
  swing?: boolean
  className?: string
}

const SERIF = "var(--font-display, 'Instrument Serif'), 'Didot', 'Bodoni 72', Georgia, serif"
const SHAPE = 'polygon(20% 0, 80% 0, 100% 11%, 100% 100%, 0 100%, 0 11%)'

function Barcode({ seed }: { seed: string }) {
  const bars = React.useMemo(() => {
    let h = 7
    for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0
    const out: number[] = []
    for (let i = 0; i < 38; i++) {
      h = (h * 1103515245 + 12345) >>> 0
      out.push(1 + (h % 3))
    }
    return out
  }, [seed])
  let x = 0
  return (
    <svg aria-hidden viewBox="0 0 100 24" preserveAspectRatio="none" className="h-8 w-full">
      {bars.map((w, i) => {
        const r = <rect key={i} x={x} y="0" width={w * 0.9} height="24" fill="currentColor" opacity={i % 2 ? 0 : 1} />
        x += w * 1.3
        return r
      })}
    </svg>
  )
}

function CareIcons() {
  return (
    <span aria-hidden className="flex items-center gap-2.5">
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M3 7l2 12h14l2-12" /><path d="M3 7c3 2 6-2 9 0s6-2 9 0" /><text x="12" y="16.5" fontSize="6" textAnchor="middle" fill="currentColor" stroke="none">30</text></svg>
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M12 4l9 16H3z" /><path d="M7 10l10 10M17 10L7 20" /></svg>
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M4 17h16c0-5-3-8-8-8H8l-4 8z" /><circle cx="12" cy="14" r="0.9" fill="currentColor" /></svg>
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="4" y="4" width="16" height="16" rx="1" /><circle cx="12" cy="12" r="5" /></svg>
    </span>
  )
}

function TagOutline() {
  return (
    <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
      <polygon points="20,0 80,0 100,11 100,100 0,100 0,11" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <polygon points="21.5,2.2 78.5,2.2 97,12.2 97,98 3,98 3,12.2" fill="none" stroke="currentColor" strokeOpacity="0.22" strokeWidth="0.75" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/**
 * Swing Price Tag — a luxury swing tag hanging from a brass rail on a waxed
 * cord. Brush past it and it swings like a real pendulum (lightly damped,
 * settles and sleeps); tap it and it twirls over to the back for composition,
 * care symbols and the SKU barcode, while a foil sheen catches the light.
 */
export function SwingPriceTag({
  brand = 'Halden & Rowe',
  monogram = 'HR',
  product = 'Merino Overshirt',
  variant = 'Oxblood · Size M',
  price = '€248',
  compareAt = '€310',
  badge = 'Members −20%',
  details = [
    ['Composition', '100% extra-fine merino'],
    ['Made in', 'Porto, Portugal'],
    ['Weight', '320 g/m² brushed twill'],
  ],
  sku = 'HR-2291-OX-M',
  flipped: flippedProp,
  defaultFlipped = false,
  onFlippedChange,
  swing = true,
  className,
}: SwingPriceTagProps) {
  const reduced = usePrefersReducedMotion()
  const [inner, setInner] = React.useState(defaultFlipped)
  const flipped = flippedProp ?? inner
  const angle = useMotionValue(0)
  const sim = React.useRef({ t: 0, w: 0, raf: 0, last: 0, px: 0, pt: 0 })
  const live = swing && !reduced
  const stepRef = React.useRef<() => void>(() => {})

  const step = React.useCallback(() => {
    const s = sim.current
    const now = performance.now()
    const dt = Math.min(0.033, (now - s.last) / 1000)
    s.last = now
    s.w += (-26 * s.t - 1.9 * s.w) * dt
    s.t += s.w * dt
    s.t = Math.max(-28, Math.min(28, s.t))
    angle.set(s.t)
    if (Math.abs(s.t) < 0.04 && Math.abs(s.w) < 0.04) {
      s.t = 0
      s.w = 0
      angle.set(0)
      s.raf = 0
      return
    }
    s.raf = requestAnimationFrame(() => stepRef.current())
  }, [angle])
  React.useEffect(() => {
    stepRef.current = step
  }, [step])

  const kick = React.useCallback((impulse: number) => {
    if (!live) return
    const s = sim.current
    s.w = Math.max(-140, Math.min(140, s.w + impulse))
    if (!s.raf) {
      s.last = performance.now()
      s.raf = requestAnimationFrame(step)
    }
  }, [live, step])

  React.useEffect(() => () => cancelAnimationFrame(sim.current.raf), [])

  const onPointerMove = (e: React.PointerEvent) => {
    const s = sim.current
    const now = performance.now()
    if (s.pt && now - s.pt < 80) {
      const vx = (e.clientX - s.px) / Math.max(1, now - s.pt)
      kick(vx * 9)
    }
    s.px = e.clientX
    s.pt = now
  }

  const flip = () => {
    const v = !flipped
    if (flippedProp === undefined) setInner(v)
    onFlippedChange?.(v)
    kick(v ? 55 : -55)
  }

  const face = 'absolute inset-0 flex flex-col items-center px-6 pb-6 pt-[52px] text-center [backface-visibility:hidden]'
  const paper = 'bg-[#f6efe2] text-[#1f1812] dark:bg-[#121010] dark:text-[#e2c27e]'
  const sub = 'text-[#6a5843] dark:text-[#b39a68]'

  return (
    <div className={cn('relative flex w-full max-w-sm flex-col items-center', className)}>
      {/* brass rail */}
      <div aria-hidden className="relative z-10 h-3 w-48 rounded-full bg-[linear-gradient(180deg,#f3dca2,#b98b3e_55%,#7a5520)] shadow-[0_2px_4px_rgb(60_40_10/0.3),inset_0_1px_0_rgb(255_255_255/0.6)]" />
      <motion.div
        className="relative -mt-1.5 flex flex-col items-center"
        style={{ rotate: angle, transformOrigin: '50% 0%' }}
        onPointerMove={live ? onPointerMove : undefined}
      >
        {/* cord loop */}
        <svg aria-hidden width="40" height="70" viewBox="0 0 40 70" className="-mb-[22px] text-[#7d1d2c] dark:text-[#c79a4c]">
          <path d="M20 3 C 6 10, 8 40, 18 66 M20 3 C 34 10, 32 40, 22 66" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="20" cy="4" r="3.2" fill="#c9a259" stroke="#6b4a1c" strokeWidth="0.8" />
        </svg>

        <button
          type="button"
          onClick={flip}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') { kick(-60); e.preventDefault() }
            if (e.key === 'ArrowRight') { kick(60); e.preventDefault() }
          }}
          aria-pressed={flipped}
          aria-label={`${brand} ${product}, ${price}${compareAt ? `, was ${compareAt}` : ''}. ${flipped ? 'Showing details' : 'Press to see details'}`}
          className="group relative rounded-[14px] outline-none [perspective:1000px] focus-visible:ring-2 focus-visible:ring-[#7d1d2c] focus-visible:ring-offset-4 focus-visible:ring-offset-transparent dark:focus-visible:ring-[#e2c27e]"
          style={{ width: 216, height: 340, filter: 'drop-shadow(0 1px 1px rgb(40 20 10 / 0.18)) drop-shadow(0 22px 26px rgb(40 20 10 / 0.28))' }}
        >
          <motion.span
            className="absolute inset-0 block [transform-style:preserve-3d]"
            initial={false}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 140, damping: 16 }}
          >
            {/* front */}
            <span className={cn(face, paper)} style={{ clipPath: SHAPE, opacity: reduced && flipped ? 0 : 1 }}>
              <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ clipPath: SHAPE }}>
                <span className="absolute -inset-y-10 -left-full w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-[1100ms] ease-out group-hover:translate-x-[520px] motion-reduce:hidden dark:via-[#f3d999]/25" />
              </span>
              <TagOutline />
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em]">{brand}</span>
              <span className="mt-4 grid size-[58px] place-items-center rounded-full border border-current text-[22px] leading-none" style={{ fontFamily: SERIF }}>
                <span className="grid size-[50px] place-items-center rounded-full border" style={{ borderColor: 'color-mix(in oklab, currentColor 40%, transparent)' }}>{monogram}</span>
              </span>
              <span className="mt-4 text-[20px] leading-tight tracking-[-0.01em]" style={{ fontFamily: SERIF }}>{product}</span>
              <span className={cn('mt-1 text-[12px]', sub)}>{variant}</span>
              <span aria-hidden className="my-4 h-px w-16 bg-current opacity-30" />
              <span className="flex items-baseline gap-2">
                <span className="text-[44px] leading-none tracking-[-0.03em] tabular-nums" style={{ fontFamily: SERIF }}>{price}</span>
                {compareAt && <span className={cn('text-[14px] line-through tabular-nums', sub)}>{compareAt}</span>}
              </span>
              {badge && <span className="mt-auto rounded-full bg-[#7d1d2c] px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#fbf3e6] dark:bg-[#e2c27e] dark:text-[#121010]">{badge}</span>}
            </span>
            {/* back */}
            <span className={cn(face, paper, 'items-stretch text-left')} style={{ clipPath: SHAPE, transform: 'rotateY(180deg)', opacity: reduced && !flipped ? 0 : 1 }}>
              <TagOutline />
              <span className="text-center text-[10px] font-semibold uppercase tracking-[0.28em]">{brand}</span>
              <span className="mt-5 space-y-2.5">
                {details.map(([k, v]) => (
                  <span key={k} className="block">
                    <span className={cn('block text-[10px] font-semibold uppercase tracking-[0.16em]', sub)}>{k}</span>
                    <span className="block text-[13px] leading-snug">{v}</span>
                  </span>
                ))}
              </span>
              <span className="mt-4 flex justify-center"><CareIcons /></span>
              <span className="mt-auto block">
                <Barcode seed={sku} />
                <span className={cn('mt-1 block text-center text-[10px] tracking-[0.2em] tabular-nums', sub)}>{sku}</span>
              </span>
            </span>
          </motion.span>
          {/* grommet */}
          <span aria-hidden className="absolute left-1/2 top-[18px] size-[18px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,transparent_4px,#8a6224_4.5px,#f1d79b_6px,#a57a33_8px,transparent_8.5px)]" />
        </button>
      </motion.div>
      <p className="mt-6 text-[12px] text-zinc-600 dark:text-zinc-400">{flipped ? 'Tap the tag to see the price' : 'Tap the tag for details'}</p>
      <p role="status" aria-live="polite" className="sr-only">{flipped ? `Details: ${details.map(([k, v]) => `${k} ${v}`).join(', ')}. SKU ${sku}.` : ''}</p>
    </div>
  )
}
