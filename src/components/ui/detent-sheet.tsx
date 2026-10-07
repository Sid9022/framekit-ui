import * as React from 'react'
import { AnimatePresence, motion, useDragControls, type PanInfo } from 'motion/react'
import { MapPin, Navigation, Star, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type SheetDetent = 'peek' | 'half' | 'full'

export type DetentSheetProps = {
  /** Controlled open state. */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Controlled detent. */
  detent?: SheetDetent
  defaultDetent?: SheetDetent
  onDetentChange?: (detent: SheetDetent) => void
  /** Visible fraction of the frame per detent (0–1). */
  detents?: Record<SheetDetent, number>
  /** Sheet title (also its accessible name). */
  title?: string
  /** Sheet body; defaults to a place card. */
  children?: React.ReactNode
  /** Label of the trigger button. */
  triggerLabel?: string
  /** Height of the demo frame in px (the sheet is contained by it). */
  frameHeight?: number
  /** Optional backdrop content behind the sheet (defaults to a generated map). */
  backdrop?: React.ReactNode
  className?: string
}

const ORDER: SheetDetent[] = ['peek', 'half', 'full']
const DEFAULT_DETENTS: Record<SheetDetent, number> = { peek: 0.28, half: 0.55, full: 0.92 }

function MapArt() {
  return (
    <svg aria-hidden className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 600">
      <rect width="400" height="600" className="fill-[#eef0ea] dark:fill-[#17191c]" />
      {[...Array(9)].map((_, i) => (
        <path key={i} d={`M-20 ${60 + i * 70} C 120 ${30 + i * 70}, 260 ${110 + i * 70}, 420 ${50 + i * 70}`} className="fill-none stroke-black/[0.06] dark:stroke-white/[0.06]" strokeWidth="14" />
      ))}
      <path d="M60 0 L140 600 M300 0 L250 600" className="fill-none stroke-white dark:stroke-zinc-700" strokeWidth="10" />
      <path d="M0 220 L400 300" className="fill-none stroke-amber-200 dark:stroke-amber-900/70" strokeWidth="12" />
      <rect x="170" y="80" width="90" height="70" rx="10" className="fill-emerald-200/70 dark:fill-emerald-900/40" />
      <circle cx="210" cy="250" r="10" className="fill-signal-600 dark:fill-signal-300" />
      <circle cx="210" cy="250" r="26" className="fill-signal-600/15 dark:fill-signal-300/15" />
    </svg>
  )
}

function PlaceCard() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
        <Star aria-hidden className="size-4 fill-amber-400 text-amber-400" />
        <span className="tabular-nums">4.8</span> · <span className="tabular-nums">1,204</span> reviews · Open until 22:00
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" className="flex min-h-11 items-center justify-center gap-2 rounded-[14px] bg-signal-600 text-sm font-medium text-white outline-none transition-colors duration-150 hover:bg-signal-700 focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-2 active:scale-[0.98] dark:focus-visible:ring-signal-300 dark:focus-visible:ring-offset-zinc-900">
          <Navigation aria-hidden className="size-4" /> Directions
        </button>
        <button type="button" className="flex min-h-11 items-center justify-center gap-2 rounded-[14px] bg-zinc-900/[0.05] text-sm font-medium text-zinc-900 outline-none transition-colors duration-150 hover:bg-zinc-900/[0.09] focus-visible:ring-2 focus-visible:ring-signal-600 active:scale-[0.98] dark:bg-white/[0.08] dark:text-white dark:hover:bg-white/[0.12] dark:focus-visible:ring-signal-300">
          <MapPin aria-hidden className="size-4" /> Save place
        </button>
      </div>
      <dl className="divide-y divide-black/[0.06] rounded-[20px] bg-zinc-900/[0.03] px-4 text-sm dark:divide-white/[0.08] dark:bg-white/[0.04]">
        {[['Address', '14 Lantern Row, Harbour District'], ['Walk', '12 min · 900 m'], ['Phone', '+44 20 7946 0811']].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-3"><dt className="text-zinc-600 dark:text-zinc-400">{k}</dt><dd className="text-right font-medium text-zinc-900 tabular-nums dark:text-zinc-100">{v}</dd></div>
        ))}
      </dl>
      <p className="text-pretty text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">A small-batch roastery with a courtyard, quiet before ten and busy after lunch. Card only.</p>
    </div>
  )
}

/**
 * Detent Sheet — an Apple-style bottom sheet that rests at peek, half and
 * full detents. Drag the grabber (velocity-aware snapping with rubber-band at
 * the ends), tap it to step up, or use ↑ ↓ on the keyboard; Esc closes and
 * focus returns to the trigger. Background content dims and recedes as the
 * sheet rises. Contained by its frame so it composes inside any layout.
 */
export function DetentSheet({
  open,
  defaultOpen = true,
  onOpenChange,
  detent,
  defaultDetent = 'half',
  onDetentChange,
  detents = DEFAULT_DETENTS,
  title = 'Kiln & Copper Coffee',
  children,
  triggerLabel = 'Show place',
  frameHeight = 560,
  backdrop,
  className,
}: DetentSheetProps) {
  const reduced = usePrefersReducedMotion()
  const titleId = React.useId()
  const [innerOpen, setInnerOpen] = React.useState(defaultOpen)
  const isOpen = open ?? innerOpen
  const [innerDetent, setInnerDetent] = React.useState<SheetDetent>(defaultDetent)
  const cur = detent ?? innerDetent
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const sheetRef = React.useRef<HTMLDivElement>(null)
  const grabRef = React.useRef<HTMLButtonElement>(null)
  const dragControls = useDragControls()
  const mounted = React.useRef(false)

  const setOpen = (v: boolean) => { if (open === undefined) setInnerOpen(v); onOpenChange?.(v) }
  const setDetent = (d: SheetDetent) => { if (detent === undefined) setInnerDetent(d); onDetentChange?.(d) }

  React.useEffect(() => {
    if (!mounted.current) { mounted.current = true; return }
    if (isOpen) grabRef.current?.focus({ preventScroll: true })
    else triggerRef.current?.focus({ preventScroll: true })
  }, [isOpen])

  const sheetH = frameHeight * detents.full
  const yFor = (d: SheetDetent) => sheetH - frameHeight * detents[d]
  const y = yFor(cur)

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const projected = y + info.offset.y + info.velocity.y * 0.18
    if (projected > yFor('peek') + 60) { setOpen(false); return }
    let best: SheetDetent = 'peek'
    for (const d of ORDER) if (Math.abs(yFor(d) - projected) < Math.abs(yFor(best) - projected)) best = d
    setDetent(best)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = ORDER.indexOf(cur)
    if (e.key === 'Escape') { e.stopPropagation(); setOpen(false) }
    else if (e.key === 'ArrowUp' && e.currentTarget === grabRef.current) { e.preventDefault(); setDetent(ORDER[Math.min(2, i + 1)]) }
    else if (e.key === 'ArrowDown' && e.currentTarget === grabRef.current) { e.preventDefault(); if (i === 0) setOpen(false); else setDetent(ORDER[i - 1]) }
  }

  const lift = isOpen ? detents[cur] : 0
  const spring = reduced ? { duration: 0.15 } : { type: 'spring' as const, stiffness: 380, damping: 36, mass: 0.9 }
  const detentName = { peek: 'Collapsed', half: 'Half height', full: 'Full height' }[cur]

  return (
    <div
      className={cn('relative isolate w-full max-w-md overflow-hidden rounded-[28px] bg-zinc-100 ring-1 ring-black/[0.08] dark:bg-zinc-950 dark:ring-white/[0.1]', className)}
      style={{ height: frameHeight }}
    >
      <motion.div
        className="absolute inset-0 origin-top"
        animate={reduced ? undefined : { scale: 1 - Math.max(0, lift - 0.5) * 0.08, borderRadius: lift > 0.6 ? 20 : 0 }}
        transition={spring}
        style={{ overflow: 'hidden' }}
      >
        {backdrop ?? <MapArt />}
        <div className="absolute left-4 top-4">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={isOpen}
            className="min-h-11 rounded-full bg-white/80 px-4 text-sm font-medium text-zinc-900 shadow-[0_1px_2px_rgb(0_0_0/0.06),0_8px_24px_-12px_rgb(0_0_0/0.25)] ring-1 ring-black/[0.06] backdrop-blur-xl outline-none transition-colors duration-150 hover:bg-white focus-visible:ring-2 focus-visible:ring-signal-600 active:scale-[0.97] dark:bg-zinc-900/70 dark:text-white dark:ring-white/[0.1] dark:hover:bg-zinc-900 dark:focus-visible:ring-signal-300 [@media(prefers-reduced-transparency:reduce)]:bg-white dark:[@media(prefers-reduced-transparency:reduce)]:bg-zinc-900"
          >
            {triggerLabel}
          </button>
        </div>
      </motion.div>
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-black" animate={{ opacity: isOpen ? Math.max(0, lift - 0.4) * 0.5 : 0 }} transition={spring} />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={sheetRef}
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId}
            onKeyDown={onKeyDown}
            className="absolute inset-x-0 bottom-0 flex flex-col rounded-t-[28px] bg-white shadow-[0_-1px_0_rgb(0_0_0/0.04),0_-24px_60px_-30px_rgb(0_0_0/0.4)] ring-1 ring-black/[0.06] dark:bg-zinc-900 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] dark:ring-white/[0.08]"
            style={{ height: sheetH, touchAction: 'none' }}
            initial={{ y: sheetH }}
            animate={{ y }}
            exit={{ y: sheetH }}
            transition={spring}
            drag={reduced ? false : 'y'}
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: sheetH }}
            dragElastic={{ top: 0.08, bottom: 0.4 }}
            dragMomentum={false}
            onDragEnd={onDragEnd}
          >
            <div className="flex shrink-0 cursor-grab flex-col items-center px-5 pb-2 pt-2 active:cursor-grabbing" onPointerDown={(e) => dragControls.start(e)}>
              <button
                ref={grabRef}
                type="button"
                onKeyDown={onKeyDown}
                onClick={() => setDetent(ORDER[(ORDER.indexOf(cur) + 1) % 3])}
                aria-label={`Resize sheet, ${detentName}. Use up and down arrows.`}
                className="group grid h-6 w-16 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-signal-600 dark:focus-visible:ring-signal-300"
              >
                <span className="h-[5px] w-9 rounded-full bg-zinc-300 transition-colors duration-150 group-hover:bg-zinc-400 dark:bg-zinc-600 dark:group-hover:bg-zinc-500" />
              </button>
              <div className="mt-1 flex w-full items-center justify-between gap-3">
                <h3 id={titleId} className="min-w-0 truncate text-xl font-semibold tracking-tight text-zinc-950 dark:text-white">{title}</h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close sheet"
                  className="grid size-8 shrink-0 place-items-center rounded-full bg-zinc-900/[0.06] text-zinc-600 outline-none transition-colors duration-150 hover:bg-zinc-900/[0.1] hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-signal-600 pointer-coarse:size-11 dark:bg-white/[0.08] dark:text-zinc-300 dark:hover:text-white dark:focus-visible:ring-signal-300"
                >
                  <X aria-hidden className="size-4" />
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-2" style={{ touchAction: 'pan-y' }}>
              {children ?? <PlaceCard />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <span role="status" aria-live="polite" className="sr-only">{isOpen ? `Sheet ${detentName.toLowerCase()}` : 'Sheet closed'}</span>
    </div>
  )
}
