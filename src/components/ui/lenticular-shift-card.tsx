import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type LenticularFrame = { id: string; label: string; caption?: string; src?: string; hue?: number }

export type LenticularShiftCardProps = {
  /** 2–4 frames interlaced on the ridged print. */
  items?: LenticularFrame[]
  title?: string
  /** Gently rocks the print when nobody is interacting. */
  autoRock?: boolean
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  className?: string
}

export const DEFAULT_LENTICULAR_FRAMES: LenticularFrame[] = [
  { id: 'dawn', label: 'Dawn', caption: '05:48 · first light over the bay', hue: 18 },
  { id: 'noon', label: 'Noon', caption: '12:10 · glass-flat water', hue: 200 },
  { id: 'night', label: 'Night', caption: '23:32 · the lamp keeps watch', hue: 250 },
]

const PALETTES: Record<string, { sky: [string, string]; sea: [string, string]; hills: [string, string]; body: string; bodyY: number; bodyX: number; stars: boolean; beam: boolean }> = {
  dawn: { sky: ['#ffcfa8', '#ff8f7a'], sea: ['#f08a7a', '#6d4e7a'], hills: ['#b25d6b', '#6b3f5e'], body: '#fff1d0', bodyY: 150, bodyX: 70, stars: false, beam: false },
  noon: { sky: ['#8fd3ff', '#dff4ff'], sea: ['#4aa8d8', '#1d5f8a'], hills: ['#4f8f7a', '#2f6558'], body: '#fffbe6', bodyY: 62, bodyX: 150, stars: false, beam: false },
  night: { sky: ['#0b1030', '#26214d'], sea: ['#1a2350', '#070a1d'], hills: ['#1b1d3a', '#0d0e22'], body: '#f3f1ff', bodyY: 80, bodyX: 232, stars: true, beam: true },
}

function Scene({ frame, idx }: { frame: LenticularFrame; idx: number }) {
  const p = PALETTES[frame.id] ?? PALETTES[['dawn', 'noon', 'night'][idx % 3]]
  const g = `lf-${frame.id}-${idx}`
  return (
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={g + 's'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky[0]} />
          <stop offset="1" stopColor={p.sky[1]} />
        </linearGradient>
        <linearGradient id={g + 'w'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sea[0]} />
          <stop offset="1" stopColor={p.sea[1]} />
        </linearGradient>
        <radialGradient id={g + 'b'}>
          <stop offset="0" stopColor={p.body} stopOpacity="0.9" />
          <stop offset="1" stopColor={p.body} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="300" height="260" fill={`url(#${g}s)`} />
      {p.stars &&
        Array.from({ length: 40 }, (_, i) => (
          <circle key={i} cx={(i * 73) % 300} cy={(i * 41) % 200} r={i % 5 === 0 ? 1.3 : 0.7} fill="white" opacity={0.5 + (i % 3) * 0.2} />
        ))}
      <circle cx={p.bodyX} cy={p.bodyY} r="70" fill={`url(#${g}b)`} />
      <circle cx={p.bodyX} cy={p.bodyY} r="24" fill={p.body} />
      {frame.id === 'night' && (
        <g fill="#c9c6e6" opacity="0.7">
          <circle cx={p.bodyX - 7} cy={p.bodyY - 5} r="5" />
          <circle cx={p.bodyX + 8} cy={p.bodyY + 6} r="3.5" />
          <circle cx={p.bodyX + 4} cy={p.bodyY - 10} r="2.2" />
        </g>
      )}
      <path d="M0 230 L40 196 L78 214 L120 176 L170 218 L214 190 L260 212 L300 196 V262 H0Z" fill={p.hills[0]} />
      <path d="M0 246 L60 222 L110 240 L160 216 L220 244 L300 226 V262 H0Z" fill={p.hills[1]} />
      <rect y="258" width="300" height="142" fill={`url(#${g}w)`} />
      {/* reflection streak */}
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={p.bodyX - 22 + ((i * 13) % 20) - 10} y={272 + i * 13} width={44 - i * 3} height="2.4" rx="1.2" fill={p.body} opacity={0.55 - i * 0.05} />
      ))}
      {/* lighthouse */}
      <path d="M212 262 L240 262 L236 242 L216 242 Z" fill={p.hills[1]} />
      <path d="M219 242 L233 242 L230 176 L222 176 Z" fill="#f3efe8" />
      <path d="M221 214 L231 214 L231 200 L221 200 Z M222.4 190 L229.6 190 L229.4 182 L222.6 182 Z" fill="#d45a4a" />
      <rect x="220" y="166" width="12" height="10" rx="2" fill={p.beam ? '#ffe9a6' : '#cfd6dc'} />
      <path d="M218 166 L234 166 L226 156 Z" fill="#3a3140" />
      {p.beam && <path d="M226 171 L20 120 L20 214 Z" fill="#ffe9a6" opacity="0.18" />}
      {/* sailboat */}
      <g transform={`translate(${frame.id === 'noon' ? 96 : frame.id === 'dawn' ? 40 : 150} 300)`}>
        <path d="M0 0 L34 0 L28 8 L6 8 Z" fill={frame.id === 'night' ? '#0d0e22' : '#3a3140'} />
        <path d="M17 -2 L17 -38 L32 -4 Z" fill={frame.id === 'night' ? '#b8b6d8' : '#fff8ee'} />
        <path d="M15 -4 L15 -30 L4 -4 Z" fill={frame.id === 'night' ? '#8886ad' : '#f1e2cf'} />
      </g>
    </svg>
  )
}

/**
 * Lenticular Shift Card — a postcard printed on a ridged lenticular sheet.
 * Tilting (pointer, arrow keys or the frame chips) interlaces the scenes in
 * fine vertical blinds that sweep across the print while a specular band
 * rides the ridges, exactly like a real 3D novelty card.
 */
export function LenticularShiftCard({
  items = DEFAULT_LENTICULAR_FRAMES,
  title = 'Harbour Light',
  autoRock = true,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  className,
}: LenticularShiftCardProps) {
  const reduced = usePrefersReducedMotion()
  const frames = items.slice(0, 4)
  const n = frames.length
  const [innerIndex, setInnerIndex] = React.useState(defaultIndex)
  const index = indexProp ?? innerIndex
  const [shown, setShown] = React.useState(index)
  const [announce, setAnnounce] = React.useState('')
  const uid = React.useId()
  const cardRef = React.useRef<HTMLDivElement>(null)
  const layerRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const glossRef = React.useRef<HTMLDivElement>(null)
  const S = React.useRef({ t: index, target: index, rx: 0, ry: 0, trx: 0, try_: 0, hover: false, lastInput: 0, visible: true, rockT: 0 })

  const choose = (i: number) => {
    const c = Math.max(0, Math.min(n - 1, i))
    if (indexProp === undefined) setInnerIndex(c)
    onIndexChange?.(c)
    S.current.target = c
    S.current.lastInput = performance.now()
    setAnnounce(frames[c]?.label ?? '')
  }
  React.useEffect(() => {
    S.current.target = index
  }, [index])

  React.useEffect(() => {
    const card = cardRef.current
    if (!card) return
    const apply = () => {
      const s = S.current
      for (let k = 1; k < n; k++) {
        const el = layerRefs.current[k]
        if (!el) continue
        const v = Math.max(0, Math.min(1, s.t - (k - 1)))
        const duty = (v * 6).toFixed(2)
        const sweep = v * 150 - 25
        const m = `repeating-linear-gradient(90deg, #000 0 ${duty}px, transparent ${duty}px 6px), linear-gradient(90deg, #000 ${sweep.toFixed(1)}%, transparent ${(sweep + 25).toFixed(1)}%)`
        const full = v >= 0.999
        el.style.maskImage = full ? 'none' : v <= 0.001 ? 'linear-gradient(transparent, transparent)' : m
        el.style.webkitMaskImage = el.style.maskImage
        el.style.setProperty('mask-composite', 'intersect')
        el.style.setProperty('-webkit-mask-composite', 'source-in')
      }
      card.style.transform = `rotateX(${s.rx.toFixed(2)}deg) rotateY(${s.ry.toFixed(2)}deg)`
      if (glossRef.current) {
        const gx = 50 + (s.t / Math.max(1, n - 1) - 0.5) * 120
        glossRef.current.style.backgroundPosition = `${gx}% 0, 0 0`
      }
      const near = Math.round(s.t)
      setShown((p) => (p === near ? p : near))
    }
    if (reduced) {
      S.current.t = S.current.target
      apply()
      return
    }
    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const s = S.current
      if (autoRock && !s.hover && now - s.lastInput > 4000) {
        s.rockT += dt
        const ph = (Math.sin(s.rockT * 0.55 - Math.PI / 2) + 1) / 2 // 0..1..0
        s.target = ph * (n - 1)
        s.try_ = (ph - 0.5) * -16
        s.trx = Math.sin(s.rockT * 0.8) * 3
      }
      s.t += (s.target - s.t) * Math.min(1, dt * 6)
      s.rx += (s.trx - s.rx) * Math.min(1, dt * 8)
      s.ry += (s.try_ - s.ry) * Math.min(1, dt * 8)
      apply()
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (!raf && S.current.visible && !document.hidden) {
        last = performance.now()
        raf = requestAnimationFrame(loop)
      }
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }
    const io = new IntersectionObserver(([e]) => {
      S.current.visible = e.isIntersecting
      if (e.isIntersecting) start()
      else stop()
    })
    io.observe(card)
    const vis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', vis)
    start()
    return () => {
      stop()
      io.disconnect()
      document.removeEventListener('visibilitychange', vis)
    }
  }, [n, reduced, autoRock])

  const onMove = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))
    const y = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height))
    const s = S.current
    s.hover = true
    s.target = x * (n - 1)
    s.try_ = (x - 0.5) * -22
    s.trx = (y - 0.5) * 10
    s.lastInput = performance.now()
    if (reduced) {
      const c = Math.round(x * (n - 1))
      if (c !== index) {
        if (indexProp === undefined) setInnerIndex(c)
        onIndexChange?.(c)
      }
    }
  }
  const onLeave = () => {
    if (reduced) return
    const s = S.current
    s.hover = false
    s.target = Math.round(s.t)
    s.try_ = 0
    s.trx = 0
    s.lastInput = performance.now()
    const c = Math.round(s.t)
    if (indexProp === undefined) setInnerIndex(c)
    onIndexChange?.(c)
  }

  const vis = reduced ? index : shown
  const cur = frames[vis] ?? frames[0]

  return (
    <div className={cn('flex flex-col items-center gap-5', className)}>
      <div className="[perspective:900px]" onPointerMove={onMove} onPointerLeave={onLeave}>
        <div
          ref={cardRef}
          tabIndex={0}
          role="group"
          aria-roledescription="lenticular card"
          aria-label={`${title}. Showing ${cur.label}. Use left and right arrow keys to tilt.`}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') {
              e.preventDefault()
              choose(Math.round(S.current.target) + 1)
            } else if (e.key === 'ArrowLeft') {
              e.preventDefault()
              choose(Math.round(S.current.target) - 1)
            } else if (e.key === 'Home') choose(0)
            else if (e.key === 'End') choose(n - 1)
          }}
          className="relative h-[380px] w-[285px] overflow-hidden rounded-[18px] bg-zinc-200 shadow-[0_1px_0_rgb(255_255_255/0.5)_inset,0_2px_4px_rgb(0_0_0/0.12),0_30px_60px_-25px_rgb(0_0_0/0.45)] outline-none ring-1 ring-black/10 [transform-style:preserve-3d] focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-4 dark:bg-zinc-800 dark:ring-white/10 dark:focus-visible:ring-offset-zinc-950"
        >
          {frames.map((f, k) => (
            <div
              key={f.id}
              ref={(el) => {
                layerRefs.current[k] = el
              }}
              className="absolute inset-0"
              style={k === 0 ? undefined : reduced ? { opacity: k <= index ? 1 : 0, transition: 'opacity 300ms' } : { maskImage: 'linear-gradient(transparent, transparent)' }}
            >
              {f.src ? <img src={f.src} alt="" className="h-full w-full object-cover" /> : <Scene frame={f} idx={k} />}
            </div>
          ))}
          {/* lenticular ridges + gloss */}
          <div className="pointer-events-none absolute inset-0 opacity-70 mix-blend-overlay [background-image:repeating-linear-gradient(90deg,rgb(255_255_255/0.22)_0_1px,transparent_1px_3px,rgb(0_0_0/0.18)_3px_4px,transparent_4px_6px)]" />
          <div
            ref={glossRef}
            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
            style={{
              backgroundImage:
                'linear-gradient(100deg, transparent 38%, rgba(255,255,255,0.75) 48%, rgba(255,255,255,0.1) 56%, transparent 64%), linear-gradient(180deg, rgba(255,255,255,0.18), transparent 30%)',
              backgroundSize: '250% 100%, 100% 100%',
              backgroundPosition: '50% 0, 0 0',
            }}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-4 pb-4 pt-12 text-white">
            <div className="font-display text-[26px] leading-none">{title}</div>
            <div className="relative mt-1.5 h-4 overflow-hidden text-[11px] text-white/80">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div key={cur.id} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.25 }}>
                  {cur.caption ?? cur.label}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/25 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/90 backdrop-blur">3D print</span>
        </div>
      </div>
      <div role="radiogroup" aria-label="Frame" className="flex gap-1 rounded-full bg-black/[0.04] p-1 ring-1 ring-black/[0.06] dark:bg-white/[0.04] dark:ring-white/10">
        {frames.map((f, i) => (
          <button
            key={f.id}
            type="button"
            role="radio"
            aria-checked={vis === i}
            onClick={() => choose(i)}
            className={cn(
              'relative rounded-full px-3 py-1.5 text-[11px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-sky-500',
              vis === i ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200',
            )}
          >
            {vis === i && <motion.span layoutId={uid + "chip"} className="absolute inset-0 rounded-full bg-white shadow-sm ring-1 ring-black/[0.06] dark:bg-white/10 dark:ring-white/10" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
            <span className="relative">{f.label}</span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">{announce}</p>
    </div>
  )
}
