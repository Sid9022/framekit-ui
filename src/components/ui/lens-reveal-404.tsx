import * as React from 'react'
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring, useTransform, useVelocity } from 'motion/react'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type LensReveal404Props = {
  title?: string
  subtitle?: string
  /** Copy that only exists under the lens. */
  secretTitle?: string
  secretSubtitle?: string
  homeLabel?: string
  homeHref?: string
  onHome?: () => void
  /** Lens radius in px. */
  radius?: number
  /** Zoom factor inside the lens. */
  zoom?: number
  className?: string
}

const DUST = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  x: -6 + ((i * 37) % 30),
  d: 1.6 + (i % 3) * 0.45,
  delay: i * 0.33,
  s: 3 + (i % 3) * 1.5,
}))

/**
 * Lens Reveal 404 — a little caretaker sweeps up beneath a giant amber 404
 * while a brass loupe follows the pointer, magnifying a hidden layer with
 * its own secret message.
 */
export function LensReveal404({
  title = 'Swept clean away.',
  subtitle = 'We tidied up and this page went out with the dust. Nothing left to see here.',
  secretTitle = 'Psst. It’s under the rug.',
  secretSubtitle = 'Head back home — we tucked all the good stuff there.',
  homeLabel = 'Back to home',
  homeHref = '/',
  onHome,
  radius = 76,
  zoom = 1.5,
  className,
}: LensReveal404Props) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const titleRef = React.useRef<HTMLHeadingElement>(null)
  const [pointerInside, setPointerInside] = React.useState(false)
  const [manual, setManual] = React.useState(false)
  const [found, setFound] = React.useState(false)
  const [finePointer, setFinePointer] = React.useState(false)

  const driven = React.useRef(false)
  driven.current = pointerInside || manual || reduced
  const tx = useMotionValue(200)
  const ty = useMotionValue(160)
  const sx = useSpring(tx, { stiffness: 190, damping: 22, mass: 0.7 })
  const sy = useSpring(ty, { stiffness: 190, damping: 22, mass: 0.7 })
  const lx = reduced ? tx : sx
  const ly = reduced ? ty : sy

  const clip = useMotionTemplate`circle(${radius}px at ${lx}px ${ly}px)`
  const origin = useMotionTemplate`${lx}px ${ly}px`
  const lensX = useTransform(lx, (v) => v - radius)
  const lensY = useTransform(ly, (v) => v - radius)
  // tiny lean in the direction of travel
  const vx = useVelocity(sx)
  const lean = useTransform(vx, [-1600, 1600], [-10, 10], { clamp: true })

  React.useEffect(() => {
    setFinePointer(window.matchMedia('(pointer: fine)').matches)
  }, [])

  // Park lens over the title on mount / reduced motion.
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    tx.jump(r.width * 0.3)
    ty.jump(r.height * 0.42)
    sx.jump(r.width * 0.3)
    sy.jump(r.height * 0.42)
    if (reduced && titleRef.current) {
      const t = titleRef.current.getBoundingClientRect()
      tx.set(t.left - r.left + t.width * 0.5)
      ty.set(t.top - r.top + t.height * 0.5)
    }
  }, [reduced, tx, ty, sx, sy])

  // Auto-wander when there is no pointer or keyboard driver.
  React.useEffect(() => {
    if (reduced || pointerInside || manual) return
    const el = ref.current
    if (!el) return
    let raf = 0
    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(el)
    const t0 = performance.now()
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (!visible || document.hidden) return
      const t = (now - t0) / 1000
      const w = el.clientWidth
      const h = el.clientHeight
      tx.set(w * 0.5 + Math.cos(t * 0.55) * w * 0.3)
      ty.set(h * 0.44 + Math.sin(t * 0.9) * h * 0.2)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [reduced, pointerInside, manual, tx, ty])

  // Discover the secret when the lens hovers the title.
  React.useEffect(() => {
    const check = () => {
      const el = ref.current
      const t = titleRef.current
      if (!el || !t || found || !driven.current) return
      const r = el.getBoundingClientRect()
      const b = t.getBoundingClientRect()
      const cx = b.left - r.left + b.width / 2
      const cy = b.top - r.top + b.height / 2
      if (Math.abs(lx.get() - cx) < b.width * 0.3 && Math.abs(ly.get() - cy) < radius * 0.7) setFound(true)
    }
    const a = lx.on('change', check)
    const b = ly.on('change', check)
    check()
    return () => {
      a()
      b()
    }
  }, [lx, ly, found, radius])

  const onPointerMove = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setPointerInside(true)
    setManual(false)
    tx.set(e.clientX - r.left)
    ty.set(e.clientY - r.top)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 48 : 20
    const el = ref.current
    if (!el) return
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    }
    const m = moves[e.key]
    if (!m) return
    e.preventDefault()
    setManual(true)
    tx.set(Math.max(0, Math.min(el.clientWidth, tx.get() + m[0])))
    ty.set(Math.max(0, Math.min(el.clientHeight, ty.get() + m[1])))
  }

  const content = (secret: boolean) => (
    <Scene
      secret={secret}
      reduced={reduced}
      title={secret ? secretTitle : title}
      subtitle={secret ? secretSubtitle : subtitle}
      homeLabel={homeLabel}
      homeHref={homeHref}
      onHome={onHome}
      titleRef={secret ? undefined : titleRef}
    />
  )

  return (
    <div
      ref={ref}
      tabIndex={0}
      role="region"
      aria-label="Page not found. Use arrow keys to move the magnifying lens."
      onPointerMove={onPointerMove}
      onPointerLeave={() => setPointerInside(false)}
      onKeyDown={onKeyDown}
      className={cn(
        'relative isolate min-h-[460px] w-full overflow-hidden rounded-[28px] outline-none',
        'shadow-[0_1px_0_rgb(255_255_255/0.7)_inset,0_30px_80px_-40px_rgb(120_80_20/0.55),0_0_0_1px_rgb(120_90_40/0.12)]',
        'focus-visible:ring-2 focus-visible:ring-amber-500/70 focus-visible:ring-offset-2',
        finePointer && pointerInside && 'cursor-none',
        className,
      )}
      style={{ touchAction: 'pan-y' }}
    >
      {content(false)}

      {/* magnified secret layer */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ clipPath: clip, WebkitClipPath: clip }}>
        <motion.div className="absolute inset-0" style={{ scale: zoom, transformOrigin: origin }}>
          {content(true)}
        </motion.div>
      </motion.div>

      {/* loupe */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0"
        style={{ x: lensX, y: lensY, width: radius * 2, height: radius * 2, rotate: reduced ? 0 : lean }}
      >
        {/* handle */}
        <div className="absolute left-1/2 top-1/2 h-0 w-0" style={{ transform: 'rotate(-45deg)' }}>
          <div
            className="absolute -left-[5px] w-[10px] rounded-b-[3px]"
            style={{ top: radius + 2, height: 16, background: 'linear-gradient(90deg,#8a6420,#f3d58a 45%,#a47a2c)' }}
          />
          <div
            className="absolute -left-[8px] rounded-full"
            style={{
              top: radius + 16,
              width: 16,
              height: 62,
              background: 'linear-gradient(90deg,#3b2414,#7a4a2a 40%,#4a2c18)',
              boxShadow: '0 10px 18px -8px rgb(60 30 10/0.6), inset 0 1px 0 rgb(255 255 255/0.15)',
            }}
          />
        </div>
        {/* rim */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 210deg,#8a6420,#f6dc96,#b58630,#fff1c4,#8a6420)',
            padding: 5,
            boxShadow: '0 18px 36px -12px rgb(80 50 10/0.55), 0 2px 6px rgb(80 50 10/0.25)',
            WebkitMask: 'radial-gradient(closest-side, transparent calc(100% - 6px), #000 calc(100% - 5px))',
            mask: 'radial-gradient(closest-side, transparent calc(100% - 6px), #000 calc(100% - 5px))',
          }}
        />
        {/* glass */}
        <div
          className="absolute inset-[5px] rounded-full"
          style={{
            background:
              'radial-gradient(120% 90% at 30% 20%, rgb(255 255 255/0.35), transparent 42%), radial-gradient(circle at 70% 85%, rgb(255 230 170/0.18), transparent 50%)',
            boxShadow: 'inset 0 0 0 1px rgb(255 255 255/0.5), inset 0 -10px 24px rgb(120 80 20/0.18)',
          }}
        />
        <div className="absolute left-[22%] top-[14%] h-[18%] w-[30%] -rotate-[28deg] rounded-full bg-white/45 blur-[2px]" />
      </motion.div>

      {/* discovery chip */}
      <AnimatePresence>
        {found && (
          <motion.div
            className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-[#2b1d0e]/90 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-amber-100 shadow-lg ring-1 ring-amber-200/20"
            initial={{ opacity: 0, y: -8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Secret found
            <button
              type="button"
              onClick={() => setFound(false)}
              className="ml-1 rounded-full px-1.5 text-amber-200/70 outline-none hover:text-amber-50 focus-visible:ring-1 focus-visible:ring-amber-200"
              aria-label="Hide the secret again"
            >
              ↺
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <span className="sr-only" role="status" aria-live="polite">
        {found ? `Secret found under the lens: ${secretTitle} ${secretSubtitle}` : ''}
      </span>
    </div>
  )
}

function Scene({
  secret,
  reduced,
  title,
  subtitle,
  homeLabel,
  homeHref,
  onHome,
  titleRef,
}: {
  secret: boolean
  reduced: boolean
  title: string
  subtitle: string
  homeLabel: string
  homeHref: string
  onHome?: () => void
  titleRef?: React.Ref<HTMLHeadingElement>
}) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 pb-10 pt-6 text-center"
      style={{
        background: secret
          ? 'radial-gradient(120% 80% at 50% 0%, #fbf3e2, #f1e2c2 70%)'
          : 'radial-gradient(120% 80% at 50% 0%, #fbf6ec, #f2e7d3 70%)',
      }}
    >
      {/* paper grain / secret grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: secret
            ? 'radial-gradient(rgb(160 90 30/0.22) 1px, transparent 1.2px)'
            : 'radial-gradient(rgb(120 90 40/0.07) 1px, transparent 1.2px)',
          backgroundSize: secret ? '14px 14px' : '6px 6px',
        }}
      />

      {secret && (
        <>
          <span className="absolute left-[9%] top-[14%] -rotate-12 font-mono text-[11px] font-semibold text-[#b4541f]">
            ↘ keep looking
          </span>
          <span className="absolute right-[10%] top-[22%] rotate-6 font-mono text-[11px] font-semibold text-[#b4541f]">
            not in here ✕
          </span>
          <span className="absolute bottom-[14%] right-[14%] -rotate-3 font-mono text-[11px] font-semibold text-[#b4541f]">
            the rug moved ⟶
          </span>
          <svg className="absolute left-[40%] top-[8%] h-6 w-14 text-[#b4541f]/70" viewBox="0 0 56 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
            <path d="M2 18c8-12 18-14 26-6s18 6 26-8" strokeDasharray="3 4" />
          </svg>
        </>
      )}

      {/* giant numerals */}
      <div
        aria-hidden
        className="relative select-none font-black leading-none tracking-[-0.06em]"
        style={{
          fontSize: 'clamp(120px, 26vw, 208px)',
          color: secret ? 'transparent' : 'rgb(214 158 46 / 0.30)',
          WebkitTextStroke: secret ? '2px #b4541f' : '0px transparent',
          textShadow: secret ? 'none' : '0 1px 0 rgb(255 255 255/0.6), 0 20px 40px rgb(180 120 30/0.15)',
        }}
      >
        4<span className={secret ? 'text-[#b4541f]/15' : ''}>0</span>4
      </div>

      {/* caretaker */}
      <div className="absolute bottom-[4%] left-[4%] h-[104px] w-[104px] sm:left-[6%]">
        <Caretaker reduced={reduced} />
      </div>

      <div className="relative -mt-4 max-w-sm">
        <h2
          ref={titleRef}
          className={cn(
            'text-[26px] font-semibold tracking-tight',
            secret ? 'text-[#9a3f12]' : 'text-[#3a2a17]',
          )}
        >
          {title}
        </h2>
        <p className={cn('mt-2 text-[14px] leading-relaxed', secret ? 'text-[#9a4a1f]' : 'text-[#7a6446]')}>
          {subtitle}
        </p>
        <a
          href={homeHref}
          onClick={(e) => {
            if (onHome) {
              e.preventDefault()
              onHome()
            }
          }}
          tabIndex={secret ? -1 : undefined}
          className={cn(
            'mt-5 inline-flex h-11 cursor-pointer items-center gap-2 rounded-full px-5 text-[14px] font-semibold outline-none transition-transform active:scale-[0.97]',
            'focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5ecdc]',
            secret
              ? 'bg-[#b4541f] text-amber-50'
              : 'bg-[#2b1f12] text-amber-50 shadow-[inset_0_1px_0_rgb(255_255_255/0.15),0_10px_24px_-10px_rgb(60_35_10/0.7)] hover:-translate-y-0.5',
          )}
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.4} />
          {homeLabel}
        </a>
      </div>
    </div>
  )
}

function Caretaker({ reduced }: { reduced: boolean }) {
  const loop = reduced ? undefined : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' as const }
  return (
    <div className="relative h-full w-full">
      {/* dust */}
      {!reduced &&
        DUST.map((d) => (
          <motion.span
            key={d.id}
            className="absolute bottom-[4px] left-[18px] block rounded-full bg-[#c9a877]"
            style={{ width: d.s, height: d.s }}
            initial={{ x: d.x, y: 0, opacity: 0, scale: 0.6 }}
            animate={{ x: [d.x, d.x - 10, d.x - 16], y: [0, -22, -44], opacity: [0, 0.7, 0], scale: [0.6, 1.2, 1.6] }}
            transition={{ duration: d.d, repeat: Infinity, delay: d.delay, ease: 'easeOut' }}
          />
        ))}
      <motion.svg
        viewBox="0 0 120 120"
        className="h-full w-full overflow-visible"
        animate={reduced ? undefined : { rotate: [-2, 2, -2], y: [0, -1.5, 0] }}
        transition={loop}
        style={{ originX: 0.6, originY: 1 }}
      >
        <ellipse cx={70} cy={114} rx={30} ry={4} fill="rgb(120 80 30/0.18)" />
        {/* broom */}
        <motion.g
          animate={reduced ? undefined : { rotate: [16, -14, 16] }}
          transition={loop}
          style={{ transformBox: 'view-box', originX: '60px', originY: '66px' }}
        >
          <line x1={60} y1={66} x2={22} y2={108} stroke="#8b5a2b" strokeWidth={3.2} strokeLinecap="round" />
          <path d="M14 104l12-6 8 12-14 6z" fill="#e0b862" stroke="#b78a3a" strokeWidth={1} />
          <path d="M16 110l-3 5M20 112l-2 5M24 114l-1 4" stroke="#b78a3a" strokeWidth={1.1} strokeLinecap="round" />
          <circle cx={48} cy={79} r={4.2} fill="#f2d7b5" stroke="#3a2a17" strokeWidth={1.4} />
        </motion.g>
        {/* legs */}
        <path d="M62 104v8M78 104v8" stroke="#3a2a17" strokeWidth={3.4} strokeLinecap="round" />
        {/* body: plump custodian in apron */}
        <path d="M46 78c0-18 12-30 24-30s24 12 24 30c0 16-10 28-24 28S46 94 46 78z" fill="#fffaf0" stroke="#3a2a17" strokeWidth={2} />
        <path d="M56 80h28v14c0 6-6 10-14 10s-14-4-14-10z" fill="#6aa4a0" stroke="#3a2a17" strokeWidth={1.6} />
        <path d="M64 86h12" stroke="#fffaf0" strokeWidth={1.4} strokeLinecap="round" />
        {/* face */}
        <motion.g animate={reduced ? undefined : { scaleY: [1, 1, 0.1, 1, 1] }} transition={{ duration: 4.2, repeat: Infinity, times: [0, 0.9, 0.93, 0.96, 1] }} style={{ transformBox: 'fill-box', originY: 0.5 }}>
          <circle cx={63} cy={66} r={2.1} fill="#3a2a17" />
          <circle cx={77} cy={66} r={2.1} fill="#3a2a17" />
        </motion.g>
        <ellipse cx={58} cy={71.5} rx={3} ry={1.8} fill="#f4a38a" opacity={0.7} />
        <ellipse cx={82} cy={71.5} rx={3} ry={1.8} fill="#f4a38a" opacity={0.7} />
        <path d="M67 72c2 2 4 2 6 0" stroke="#3a2a17" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        {/* beanie */}
        <path d="M49 58c2-12 11-18 21-18s19 6 21 18z" fill="#e2a33b" stroke="#3a2a17" strokeWidth={2} strokeLinejoin="round" />
        <path d="M48 58h44" stroke="#3a2a17" strokeWidth={2} strokeLinecap="round" />
        <path d="M58 46v10M66 42v14M74 42v14M82 46v10" stroke="#c4861f" strokeWidth={1.2} />
        <circle cx={70} cy={38} r={4.4} fill="#fff1d6" stroke="#3a2a17" strokeWidth={1.6} />
        {/* near arm */}
        <path d="M86 78c-6 6-18 6-28 0" stroke="#3a2a17" strokeWidth={2} fill="none" strokeLinecap="round" />
      </motion.svg>
    </div>
  )
}
