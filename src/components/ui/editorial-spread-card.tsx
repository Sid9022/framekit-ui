import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { BookOpen, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type EditorialSpreadCardProps = {
  /** Magazine name on the masthead. */
  masthead?: string
  issue?: string
  /** Main cover line. */
  coverLine?: string
  /** Smaller cover lines. */
  coverNotes?: string[]
  /** Spread headline on the right page. */
  headline?: string
  deck?: string
  byline?: string
  /** Paragraphs on the right page; the first gets a drop cap. */
  body?: string[]
  /** Pull quote on the inside cover (left page). */
  pullQuote?: string
  quoteAttribution?: string
  /** Optional cover image URL (replaces the generated cover art). */
  coverSrc?: string
  coverAlt?: string
  /** Ink colour for kickers, rules and the cover art. */
  accent?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

const SERIF = "var(--font-display, 'Instrument Serif'), 'Iowan Old Style', 'Palatino Linotype', Georgia, serif"
const PAPER = '#f7f2e9'

function CoverArt({ accent }: { accent: string }) {
  const id = React.useId().replace(/:/g, '')
  return (
    <svg aria-hidden viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3d9c9" />
          <stop offset="0.6" stopColor="#e7a98f" />
          <stop offset="1" stopColor={accent} />
        </linearGradient>
        <radialGradient id={`${id}sun`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff6e6" />
          <stop offset="1" stopColor="#f6c48f" />
        </radialGradient>
      </defs>
      <rect width="300" height="400" fill={`url(#${id}sky)`} />
      <circle cx="196" cy="214" r="62" fill={`url(#${id}sun)`} />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${-20 + i * 70} 400 V${300 - (i % 2) * 40} a46 46 0 0 1 92 0 V400Z`} fill={i % 2 ? '#3b0d18' : '#5a1424'} opacity={0.75 + i * 0.05} />
      ))}
      <path d="M0 330 C80 310 140 350 300 320 V400 H0Z" fill="#20060d" opacity="0.85" />
    </svg>
  )
}

/**
 * Editorial Spread Card — a magazine cover on real CSS 3D. Hover and the cover
 * lifts off its spine; click (or Enter) and it swings open on a hinge, the
 * whole issue slides to centre and a two-page spread is revealed: pull quote
 * on the inside cover, headline, deck and drop-cap columns on the right.
 */
export function EditorialSpreadCard({
  masthead = 'Meridian',
  issue = 'No. 27 — Autumn',
  coverLine = 'The quiet return of slow design',
  coverNotes = ['Inside six studios that ship less', 'Paper, light & the 4-day week', 'Essay: against the infinite scroll'],
  headline = 'Make fewer things, better',
  deck = 'A new generation of studios is choosing depth over volume, and their clients are following.',
  byline = 'Words by Ines Valdés · Photographs by the studios',
  body = [
    'In a narrow workshop above a bakery, four designers spend a whole week on a single page. Nobody is in a hurry. The coffee is strong and the deadlines are generous on purpose.',
    'Their rule is simple: if a feature cannot be explained in one sentence, it waits. The backlog is short, the release notes are shorter, and the product feels calmer for it.',
  ],
  pullQuote = '“We stopped asking what else we could add and started asking what we could finally finish.”',
  quoteAttribution = 'Theo Mensah, studio founder',
  coverSrc,
  coverAlt = '',
  accent = '#9f1239',
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
}: EditorialSpreadCardProps) {
  const reduced = usePrefersReducedMotion()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const btnRef = React.useRef<HTMLButtonElement>(null)
  const spreadId = React.useId()
  const [inner, setInner] = React.useState(defaultOpen)
  const open = openProp ?? inner
  const [hover, setHover] = React.useState(false)
  const [W, setW] = React.useState(620)

  React.useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return
    const update = () => setW(Math.min(680, el.clientWidth))
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const setOpen = (v: boolean) => {
    if (openProp === undefined) setInner(v)
    onOpenChange?.(v)
  }

  const P = W / 2
  const H = P * 1.36
  const compact = P < 240
  const spring = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 120, damping: 20, mass: 1 }
  const coverAngle = open ? -178 : hover && !reduced ? -16 : 0

  return (
    <div
      ref={rootRef}
      className={cn('w-full max-w-[680px] select-none', className)}
      style={{ ['--esc-accent' as string]: accent }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          setOpen(false)
          btnRef.current?.focus()
        }
      }}
    >
      <div className="relative mx-auto" style={{ width: W, height: H + 28, perspective: 2200 }}>
        {/* floor shadow */}
        <motion.div
          aria-hidden
          className="absolute bottom-0 h-6 rounded-[50%] bg-black/25 blur-xl dark:bg-black/70"
          initial={false}
          animate={{ left: open ? W * 0.04 : P * 0.62, width: open ? W * 0.92 : P * 0.82 }}
          transition={spring}
        />
        <motion.div
          className="absolute left-0 top-0"
          style={{ width: W, height: H, transformStyle: 'preserve-3d' }}
          initial={false}
          animate={{ x: open ? 0 : -P / 2, rotateX: open ? 8 : 4 }}
          transition={spring}
        >
          {/* right page — the spread */}
          <div
            id={spreadId}
            aria-hidden={!open}
            inert={!open}
            className="absolute top-0 overflow-hidden rounded-r-[6px] text-[#1c1410] shadow-[0_1px_2px_rgb(0_0_0/0.08),0_30px_60px_-30px_rgb(40_10_10/0.45)]"
            style={{ left: P, width: P, height: H, background: PAPER, padding: compact ? '7% 8%' : '7% 8% 6%' }}
          >
            <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black/[0.14] to-transparent" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: accent }}>Feature · Design</p>
            <h3 className="mt-2 leading-[0.95] tracking-[-0.02em]" style={{ fontFamily: SERIF, fontSize: compact ? 22 : Math.min(38, P * 0.12) }}>{headline}</h3>
            <p className="mt-2 leading-snug text-[#3d2f27]" style={{ fontSize: compact ? 11 : 13 }}>{deck}</p>
            <div className="my-2.5 h-px w-10" style={{ background: accent }} />
            <div className={cn('text-[#2b211b]', !compact && 'columns-2 gap-4')} style={{ fontSize: compact ? 10.5 : 11.5, lineHeight: 1.5 }}>
              {body.slice(0, compact ? 1 : body.length).map((para, i) => (
                <p key={i} className={cn('mb-2', i === 0 && 'first-letter:float-left first-letter:mr-1.5 first-letter:mt-[0.12em] first-letter:text-[3.2em] first-letter:leading-[0.78] first-letter:text-[var(--esc-accent)] first-letter:[font-family:var(--font-display,Georgia),Georgia,serif]')}>
                  {para}
                </p>
              ))}
            </div>
            <div className="absolute inset-x-[8%] bottom-[4%] flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-[#5b4a3f]">
              <span className="truncate pr-2">{compact ? masthead : byline}</span>
              <span className="tabular-nums">48</span>
            </div>
          </div>

          {/* cover leaf: front = cover, back = inside cover with pull quote */}
          <motion.div
            className="absolute top-0"
            style={{ left: P, width: P, height: H, transformStyle: 'preserve-3d', transformOrigin: '0% 50%' }}
            initial={false}
            animate={{ rotateY: reduced ? 0 : coverAngle, opacity: reduced && open ? 0 : 1 }}
            transition={reduced ? { duration: 0.25 } : spring}
          >
            {/* front */}
            <button
              ref={btnRef}
              type="button"
              aria-expanded={open}
              aria-controls={spreadId}
              aria-label={open ? `Close ${masthead}` : `Open ${masthead}: ${coverLine}`}
              onClick={() => setOpen(!open)}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
              onPointerLeave={() => setHover(false)}
              tabIndex={open ? -1 : 0}
              className="absolute inset-0 cursor-pointer overflow-hidden rounded-r-[6px] rounded-l-[2px] text-left text-white outline-none [backface-visibility:hidden] focus-visible:ring-[3px] focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              style={{ boxShadow: '0 1px 2px rgb(0 0 0 / 0.2), 0 30px 60px -28px rgb(40 6 14 / 0.6)' }}
            >
              {coverSrc ? <img src={coverSrc} alt={coverAlt} className="absolute inset-0 h-full w-full object-cover" draggable={false} /> : <CoverArt accent={accent} />}
              <span aria-hidden className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/30 via-white/10 to-transparent" />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/45" />
              <span className="absolute inset-x-0 top-0 block px-[7%] pt-[6%]">
                <span className="flex items-baseline justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2a0a12]">
                  <span>{issue}</span>
                  <span>€14</span>
                </span>
                <span className="mt-1 block text-center leading-[0.8] tracking-[-0.04em] text-[#2a0a12]" style={{ fontFamily: SERIF, fontSize: Math.min(96, P * 0.3) }}>{masthead}</span>
              </span>
              <span className="absolute inset-x-0 bottom-0 block px-[7%] pb-[7%]">
                <span className="block leading-[0.95] tracking-[-0.02em] [text-shadow:0_1px_12px_rgb(0_0_0/0.35)]" style={{ fontFamily: SERIF, fontSize: Math.min(36, P * 0.115) }}>{coverLine}</span>
                {!compact && (
                  <span className="mt-2 block space-y-0.5 text-[11px] font-medium leading-snug text-white/90">
                    {coverNotes.map((c) => <span key={c} className="block">— {c}</span>)}
                  </span>
                )}
              </span>
            </button>
            {/* back (inside cover) */}
            <div
              aria-hidden={!open}
              className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-l-[6px] text-[#1c1410] [backface-visibility:hidden]"
              style={{ transform: 'rotateY(180deg)', background: PAPER, padding: '9% 9% 7%' }}
            >
              <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/[0.16] to-transparent" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: accent }}>{masthead} · {issue}</span>
              <span className="block">
                <span aria-hidden className="block leading-none" style={{ fontFamily: SERIF, fontSize: compact ? 54 : 84, color: accent, height: compact ? 26 : 40 }}>“</span>
                <span className="block leading-[1.08] tracking-[-0.015em]" style={{ fontFamily: SERIF, fontSize: compact ? 17 : Math.min(30, P * 0.095) }}>{pullQuote.replace(/^“|”$/g, '')}</span>
                <span className="mt-3 block text-[10.5px] uppercase tracking-[0.16em] text-[#5b4a3f]">{quoteAttribution}</span>
              </span>
              <span className="flex items-end justify-between text-[10px] uppercase tracking-[0.16em] text-[#5b4a3f]">
                <span className="tabular-nums">47</span>
                <span className="h-8 w-14 rounded-sm" style={{ background: `repeating-linear-gradient(90deg, ${accent} 0 2px, transparent 2px 5px)`, opacity: 0.5 }} />
              </span>
            </div>
          </motion.div>
          {/* reduced-motion: show inside cover as a flat left page */}
          {reduced && (
            <AnimatePresence>
              {open && (
                <motion.div
                  aria-hidden
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute left-0 top-0 flex flex-col justify-center rounded-l-[6px] p-[9%] text-[#1c1410]"
                  style={{ width: P, height: H, background: PAPER }}
                >
                  <span className="leading-[1.08]" style={{ fontFamily: SERIF, fontSize: compact ? 17 : 28 }}>{pullQuote}</span>
                  <span className="mt-3 text-[10.5px] uppercase tracking-[0.16em] text-[#5b4a3f]">{quoteAttribution}</span>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => {
            setOpen(!open)
            if (open) btnRef.current?.focus()
          }}
          aria-expanded={open}
          aria-controls={spreadId}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-zinc-950 px-5 text-[13px] font-medium text-white outline-none transition-transform duration-150 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 dark:bg-white dark:text-zinc-950 dark:focus-visible:ring-white dark:focus-visible:ring-offset-zinc-950"
        >
          {open ? <X aria-hidden className="size-4" /> : <BookOpen aria-hidden className="size-4" />}
          {open ? 'Close issue' : 'Read the feature'}
        </button>
      </div>
      <p role="status" aria-live="polite" className="sr-only">{open ? `${masthead} open: ${headline}. ${deck}` : ''}</p>
    </div>
  )
}
