import * as React from 'react'
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from 'motion/react'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { focusRing } from '@/lib/widget-kit'

export type PastelObject = 'coins' | 'calendar' | 'key' | 'lock' | 'card'

export type PastelSlide = { id: string; title: string; caption: string; object: PastelObject; from: string; to: string }

export type PastelObjectCarouselProps = {
  slides?: PastelSlide[]
  defaultIndex?: number
  onAdd?: (slide: PastelSlide) => void
  onIndexChange?: (i: number) => void
  className?: string
}

export const DEFAULT_PASTEL_SLIDES: PastelSlide[] = [
  { id: 'save', title: 'Savings', caption: 'Stack up a rainy-day fund', object: 'coins', from: '#ffe7c2', to: '#ffc9a8' },
  { id: 'plan', title: 'Bills', caption: 'Never miss a due date', object: 'calendar', from: '#dfe8ff', to: '#c4d3ff' },
  { id: 'vault', title: 'Vault', caption: 'Keys only you hold', object: 'key', from: '#e7dcff', to: '#d2c2ff' },
  { id: 'lock', title: 'Security', caption: 'Freeze cards in a tap', object: 'lock', from: '#d8f5e6', to: '#b9ecd2' },
  { id: 'card', title: 'Cards', caption: 'Virtual cards for every app', object: 'card', from: '#ffdbe8', to: '#ffc0d6' },
]

const SPRING = { type: 'spring' as const, stiffness: 170, damping: 32, mass: 1 } // heavily damped, no bounce

/** A 3D object made of flat layers spread along Z; rotating the parent on Y gives true parallax depth. */
function Layered({ layers }: { layers: { z: number; node: React.ReactNode }[] }) {
  return (
    <div className="relative size-full [transform-style:preserve-3d]">
      {layers.map((l, i) => (
        <div key={i} className="absolute inset-0 grid place-items-center [transform-style:preserve-3d]" style={{ transform: `translateZ(${l.z}px)` }}>{l.node}</div>
      ))}
    </div>
  )
}

function ObjectArt({ kind }: { kind: PastelObject }) {
  if (kind === 'coins') {
    const coin = (y: number) => (
      <div className="relative h-[34px] w-[96px]" style={{ transform: `translateY(${y}px)` }}>
        <div className="absolute inset-x-0 bottom-0 h-[22px] rounded-[50%] bg-gradient-to-b from-[#f2b544] to-[#c9861b]" />
        <div className="absolute inset-x-0 top-0 h-[28px] rounded-[50%] bg-gradient-to-br from-[#ffe39a] via-[#ffcf5e] to-[#f2b544] shadow-[inset_0_1px_0_#fff6d6]">
          <div className="absolute inset-[6px] rounded-[50%] ring-2 ring-[#e9a93a]/70" />
        </div>
      </div>
    )
    return <Layered layers={[{ z: -20, node: coin(34) }, { z: -6, node: coin(16) }, { z: 8, node: coin(-2) }, { z: 24, node: coin(-20) }]} />
  }
  if (kind === 'calendar') {
    return (
      <Layered layers={[
        { z: -18, node: <div className="h-[118px] w-[112px] rounded-[22px] bg-[#9fb3ff] shadow-[0_18px_30px_-12px_rgb(60_80_200/0.45)]" /> },
        { z: 0, node: <div className="relative h-[118px] w-[112px] overflow-hidden rounded-[22px] bg-white shadow-[inset_0_-3px_6px_rgb(0_0_0/0.06)]"><div className="h-8 bg-gradient-to-b from-[#ff7a7a] to-[#f25a5a]" /><div className="grid h-[86px] place-items-center text-[44px] font-semibold tracking-[-0.04em] text-zinc-800">17</div></div> },
        { z: 14, node: <div className="flex w-[70px] -translate-y-[58px] justify-between"><span className="h-5 w-2.5 rounded-full bg-zinc-200 shadow-[inset_0_-2px_0_#a1a1aa]" /><span className="h-5 w-2.5 rounded-full bg-zinc-200 shadow-[inset_0_-2px_0_#a1a1aa]" /></div> },
      ]} />
    )
  }
  if (kind === 'key') {
    return (
      <Layered layers={[
        { z: -10, node: <svg width="140" height="80" viewBox="0 0 140 80"><circle cx="34" cy="40" r="26" fill="#b49cff" /><rect x="52" y="32" width="80" height="16" rx="6" fill="#9c80f5" /><rect x="104" y="44" width="10" height="18" rx="3" fill="#9c80f5" /><rect x="120" y="44" width="10" height="12" rx="3" fill="#9c80f5" /></svg> },
        { z: 6, node: <svg width="140" height="80" viewBox="0 0 140 80"><defs><linearGradient id="pk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#efe8ff" /><stop offset="1" stopColor="#c8b6ff" /></linearGradient></defs><circle cx="34" cy="38" r="24" fill="url(#pk)" /><circle cx="34" cy="38" r="9" fill="#d7c9ff" /><rect x="52" y="30" width="78" height="14" rx="6" fill="url(#pk)" /><rect x="102" y="40" width="9" height="18" rx="3" fill="url(#pk)" /><rect x="118" y="40" width="9" height="11" rx="3" fill="url(#pk)" /></svg> },
      ]} />
    )
  }
  if (kind === 'lock') {
    return (
      <Layered layers={[
        { z: -14, node: <div className="h-[56px] w-[64px] -translate-y-[40px] rounded-t-full border-[12px] border-b-0 border-[#7fd6ab]" /> },
        { z: -4, node: <div className="h-[84px] w-[104px] translate-y-[12px] rounded-[22px] bg-[#6cc99b]" /> },
        { z: 8, node: <div className="relative h-[84px] w-[104px] translate-y-[10px] rounded-[22px] bg-gradient-to-br from-[#e6fff2] to-[#a6e9c7] shadow-[inset_0_1px_0_white]"><span className="absolute left-1/2 top-[30px] h-6 w-3 -translate-x-1/2 rounded-full bg-[#3f9c70]" /></div> },
      ]} />
    )
  }
  return (
    <Layered layers={[
      { z: -16, node: <div className="h-[80px] w-[124px] -translate-y-3 translate-x-3 rotate-[-8deg] rounded-[14px] bg-[#ff9bbd]" /> },
      { z: 6, node: <div className="relative h-[80px] w-[124px] rotate-[-8deg] rounded-[14px] bg-gradient-to-br from-white to-[#ffd3e2] shadow-[inset_0_1px_0_white]"><span className="absolute left-3 top-4 h-4 w-6 rounded-[4px] bg-[#f5c56b]" /><span className="absolute bottom-4 left-3 h-1.5 w-16 rounded-full bg-[#ff9bbd]" /></div> },
    ]} />
  )
}

function Card({ slide, i, pos, active, onAdd, reduced, onSelect }: { slide: PastelSlide; i: number; pos: MotionValue<number>; active: boolean; onAdd?: (s: PastelSlide) => void; reduced: boolean; onSelect: () => void }) {
  const off = useTransform(pos, (p) => i - p)
  const x = useTransform(off, (o) => `${o * 58}%`)
  const scale = useTransform(off, (o) => 1 - 0.15 * Math.min(1, Math.abs(o)))
  const z = useTransform(off, (o) => 100 - Math.round(Math.abs(o) * 10))
  const opacity = useTransform(off, (o) => (Math.abs(o) > 2.2 ? 0 : 1))
  const rotY = useTransform(off, (o) => (reduced ? 0 : Math.max(-1.4, Math.min(1.4, o)) * -38))
  const dim = useTransform(off, (o) => Math.min(1, Math.abs(o)) * 0.18)
  return (
    <motion.li
      className="absolute left-1/2 top-0 h-full w-[min(68vw,260px)] -ml-[min(34vw,130px)]"
      style={{ x, scale, zIndex: z, opacity }}
      aria-roledescription="slide"
      aria-label={`${slide.title}: ${slide.caption}`}
      aria-current={active || undefined}
      onClick={() => !active && onSelect()}
    >
      <div className="relative h-full overflow-hidden rounded-[36px] shadow-[0_2px_6px_rgb(0_0_0/0.06),0_30px_60px_-30px_rgb(60_40_90/0.45)] ring-1 ring-black/[0.04]" style={{ background: `linear-gradient(160deg, ${slide.from}, ${slide.to})` }}>
        <div className="absolute inset-x-0 top-6 h-[58%] [perspective:700px]" aria-hidden="true">
          <motion.div className="size-full [transform-style:preserve-3d]" style={{ rotateY: rotY }}>
            <ObjectArt kind={slide.object} />
          </motion.div>
        </div>
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-[24px] bg-white/90 p-3 pl-4 shadow-[0_1px_2px_rgb(0_0_0/0.05),0_12px_24px_-12px_rgb(0_0_0/0.25)] backdrop-blur-md">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold tracking-[-0.01em] text-zinc-950">{slide.title}</p>
            <p className="truncate text-[13px] text-zinc-600">{slide.caption}</p>
          </div>
          <motion.button
            type="button"
            tabIndex={active ? 0 : -1}
            aria-hidden={!active || undefined}
            aria-label={`Add ${slide.title}`}
            onClick={(e) => { e.stopPropagation(); onAdd?.(slide) }}
            whileTap={{ scale: 0.92 }}
            className={cn('grid size-11 shrink-0 place-items-center rounded-full bg-zinc-950 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]', focusRing)}
          >
            <Plus className="size-5" aria-hidden="true" />
          </motion.button>
        </div>
        <motion.div className="pointer-events-none absolute inset-0 bg-white" style={{ opacity: dim }} aria-hidden="true" />
      </div>
    </motion.li>
  )
}

/**
 * Pastel Object Carousel — a cover-flow of pastel portrait cards. The centre card sits at full size with the
 * neighbours tucked behind at 85%; a heavily damped spring (no bounce) carries drags, and each layered CSS-3D
 * object turns on Y with its card’s position — facing left as it enters, forward in the centre, right as it leaves.
 */
export function PastelObjectCarousel({ slides = DEFAULT_PASTEL_SLIDES, defaultIndex = 1, onAdd, onIndexChange, className }: PastelObjectCarouselProps) {
  const reduced = usePrefersReducedMotion()
  const pos = useMotionValue(defaultIndex)
  const [index, setIndex] = React.useState(defaultIndex)
  const wrap = React.useRef<HTMLDivElement>(null)
  const start = React.useRef(0)
  const n = slides.length
  useMotionValueEvent(pos, 'change', (v) => { const r = Math.max(0, Math.min(n - 1, Math.round(v))); if (r !== index) setIndex(r) })
  React.useEffect(() => { onIndexChange?.(index) }, [index]) // eslint-disable-line react-hooks/exhaustive-deps
  const go = (i: number) => {
    const t = Math.max(0, Math.min(n - 1, i))
    if (reduced) pos.set(t)
    else animate(pos, t, SPRING)
  }
  const step = () => (wrap.current?.querySelector('li')?.getBoundingClientRect().width ?? 240) * 0.58

  return (
    <div className={cn('w-full select-none', className)}>
      <div
        ref={wrap}
        role="region"
        aria-roledescription="carousel"
        aria-label="Feature cards"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1) } if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1) } }}
        className={cn('relative mx-auto h-[360px] max-w-[760px] touch-pan-y overflow-hidden rounded-[28px] sm:h-[400px]', focusRing)}
      >
        <motion.ul
          className="relative h-[320px] cursor-grab active:cursor-grabbing sm:h-[360px]"
          style={{ marginTop: 20 }}
          onPanStart={() => { pos.stop(); start.current = pos.get() }}
          onPan={(_, info) => { const raw = start.current - info.offset.x / step(); pos.set(raw < 0 ? raw * 0.3 : raw > n - 1 ? n - 1 + (raw - n + 1) * 0.3 : raw) }}
          onPanEnd={(_, info) => go(Math.round(pos.get() - info.velocity.x / step() / 6))}
        >
          {slides.map((s, i) => <Card key={s.id} slide={s} i={i} pos={pos} active={i === index} onAdd={onAdd} reduced={reduced} onSelect={() => go(i)} />)}
        </motion.ul>
        <p className="sr-only" aria-live="polite">Slide {index + 1} of {n}: {slides[index].title}</p>
      </div>
      <div className="mt-4 flex items-center justify-center gap-3">
        <button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous" className={cn('grid size-11 place-items-center rounded-full text-zinc-700 transition-colors duration-150 hover:bg-zinc-100 disabled:opacity-40 dark:text-zinc-300 dark:hover:bg-white/10', focusRing)}><ChevronLeft className="size-5" aria-hidden="true" /></button>
        <div className="flex items-center gap-1">
          {slides.map((s, i) => (
            <button key={s.id} type="button" onClick={() => go(i)} aria-label={`Go to ${s.title}`} aria-current={i === index || undefined} className={cn('grid h-6 place-items-center rounded-full px-1', focusRing)}>
              <motion.span className="block h-2 rounded-full bg-zinc-900 dark:bg-white" animate={{ width: i === index ? 22 : 8, opacity: i === index ? 1 : 0.3 }} transition={{ type: 'spring', stiffness: 460, damping: 36 }} />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => go(index + 1)} disabled={index === n - 1} aria-label="Next" className={cn('grid size-11 place-items-center rounded-full text-zinc-700 transition-colors duration-150 hover:bg-zinc-100 disabled:opacity-40 dark:text-zinc-300 dark:hover:bg-white/10', focusRing)}><ChevronRight className="size-5" aria-hidden="true" /></button>
      </div>
    </div>
  )
}
