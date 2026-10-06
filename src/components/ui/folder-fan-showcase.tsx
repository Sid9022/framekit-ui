import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Bookmark, ChevronLeft, ChevronRight, Layers, Undo2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type FolderFanItem = {
  id: string
  /** Headline printed on the post card. */
  title: string
  /** Supporting copy on the card. */
  body?: string
  /** Small label above the headline (e.g. "Cover", "Data"). */
  kicker?: string
  /** Optional artwork URL; replaces the generated post layout. */
  src?: string
  alt?: string
  /** Per-card accent colour (any CSS colour). Falls back to the component `accent`. */
  accent?: string
}

export type FolderFanShowcaseProps = {
  items?: FolderFanItem[]
  eyebrow?: string
  title?: string
  /** Word(s) inside `title` painted with the accent. */
  highlight?: string
  description?: string
  /** Label printed on the glass pocket. */
  folderLabel?: string
  /** Small meta line on the pocket (format, count…). */
  folderMeta?: string
  /** Tab label on the folder's back panel. */
  tabLabel?: string
  /** Signature colour for the folder, highlights and the generated cards. Default crimson. */
  accent?: string
  titleAs?: 'h1' | 'h2' | 'h3'
  /** Controlled pulled-forward card (null = none). */
  index?: number | null
  defaultIndex?: number | null
  onIndexChange?: (index: number | null) => void
  /** Start with the cards fanned out (otherwise they fan on hover / focus). */
  defaultOpen?: boolean
  /** Soft mirrored reflection on the floor. */
  reflection?: boolean
  ctaLabel?: string
  onCta?: () => void
  className?: string
}

export const DEFAULT_FOLDER_FAN_ITEMS: FolderFanItem[] = [
  { id: 'cover', kicker: 'Cover', title: '5 habits of calm, fast teams', body: 'A swipe-through guide to shipping without the 2 a.m. scramble.' },
  { id: 'quote', kicker: 'Insight', title: 'Slow is smooth. Smooth is fast.', body: 'Protect two focus blocks a day. Meetings go after lunch.' },
  { id: 'stat', kicker: 'Data', title: '68% fewer hand-offs', body: 'Teams that write a one-page brief before kickoff cut rework by two-thirds.' },
  { id: 'list', kicker: 'Checklist', title: 'The Friday reset', body: 'Close open loops|Clear the board|Write Monday’s first task' },
  { id: 'save', kicker: 'Save', title: 'Keep this for Monday', body: 'Send it to the teammate who always asks “what’s the status?”' },
]

const FONT = "Montserrat, 'Avenir Next', 'Segoe UI', ui-sans-serif, system-ui, sans-serif"
const EASE = [0.16, 1, 0.3, 1] as const
const mix = (c: string, p: number, w: string) => `color-mix(in oklab, ${c} ${p}%, ${w})`

/** Generated post layout: five templates (cover, quote, stat, checklist, CTA). */
function PostFace({ item, i, n, accent, w }: { item: FolderFanItem; i: number; n: number; accent: string; w: number }) {
  const a = item.accent ?? accent
  const v = i % 5
  const fs = (k: number) => Math.max(7, Math.round(w * k * 10) / 10)
  const pad = w * 0.085
  const dark = v === 0 || v === 2 || v === 4
  const bg =
    v === 0 ? `linear-gradient(160deg, ${mix(a, 88, '#ff8aa5')}, ${a} 55%, ${mix(a, 70, '#000')})`
    : v === 1 ? '#fff6f7'
    : v === 2 ? `linear-gradient(170deg, ${mix(a, 42, '#1a0309')}, ${mix(a, 18, '#0a0104')})`
    : v === 3 ? mix(a, 10, '#fff')
    : `linear-gradient(200deg, ${mix(a, 60, '#ffb3c4')}, ${mix(a, 92, '#3a0010')})`
  const ink = dark ? '#fff' : '#2a0a12'
  const sub = dark ? 'rgba(255,255,255,0.86)' : 'rgba(42,10,18,0.78)'
  const lines = (item.body ?? '').split('|')

  if (item.src) {
    return (
      <div className="relative h-full w-full">
        <img src={item.src} alt={item.alt ?? ''} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 text-white" style={{ padding: pad }}>
          <p className="font-extrabold leading-[1.05] tracking-[-0.02em]" style={{ fontSize: fs(0.1) }}>{item.title}</p>
          {item.body && <p className="mt-1 leading-snug text-white/85" style={{ fontSize: fs(0.052) }}>{lines.join(' · ')}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden" style={{ background: bg, color: ink, padding: pad, fontFamily: FONT }}>
      {/* decorative geometry */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 125" preserveAspectRatio="none">
        {v === 0 && (<><circle cx="88" cy="18" r="30" fill="#fff" opacity="0.1" /><circle cx="88" cy="18" r="16" fill="#fff" opacity="0.12" /></>)}
        {v === 1 && <text x="6" y="58" fontSize="72" fontFamily="Georgia, serif" fill={a} opacity="0.16">“</text>}
        {v === 2 && (<g fill="none" stroke="#fff" opacity="0.07">{[14, 24, 34, 44].map((r) => <circle key={r} cx="80" cy="100" r={r} />)}</g>)}
        {v === 3 && <rect x="0" y="0" width="100" height="6" fill={a} opacity="0.9" />}
        {v === 4 && (<><path d="M-10 96 Q30 70 60 92 T120 84 V130 H-10Z" fill="#fff" opacity="0.1" /><path d="M-10 108 Q40 88 70 104 T120 100 V130 H-10Z" fill="#000" opacity="0.12" /></>)}
      </svg>
      <div className="relative flex items-center justify-between" style={{ fontSize: fs(0.045) }}>
        <span className="flex items-center gap-[0.4em] font-bold uppercase tracking-[0.14em]">
          <span className="inline-block rounded-full" style={{ width: '1.1em', height: '1.1em', background: dark ? '#fff' : a, boxShadow: `inset -0.25em -0.2em 0 ${dark ? mix(a, 50, '#fff') : mix(a, 60, '#000')}` }} />
          {w >= 140 && 'Northfold'}
        </span>
        <span className="font-semibold tabular-nums" style={{ color: sub }}>{String(i + 1).padStart(2, '0')}/{String(n).padStart(2, '0')}</span>
      </div>
      <div className="relative mt-auto">
        {item.kicker && (
          <p className="font-bold uppercase tracking-[0.18em]" style={{ fontSize: fs(0.042), color: v === 1 || v === 3 ? a : sub }}>{item.kicker}</p>
        )}
        {v === 2 ? (
          <>
            <p className="mt-[0.2em] font-black leading-[0.9] tracking-[-0.04em]" style={{ fontSize: fs(0.25) }}>{item.title.split(' ')[0]}</p>
            <p className="mt-[0.3em] font-bold leading-tight" style={{ fontSize: fs(0.075) }}>{item.title.split(' ').slice(1).join(' ')}</p>
          </>
        ) : (
          <p className={cn('mt-[0.3em] font-extrabold leading-[1.02] tracking-[-0.025em]', v === 0 && 'uppercase')} style={{ fontSize: fs(v === 0 ? 0.108 : 0.098) }}>{item.title}</p>
        )}
        {v === 3 ? (
          <ul className="mt-[0.6em] space-y-[0.35em]" style={{ fontSize: fs(0.05) }}>
            {lines.map((l) => (
              <li key={l} className="flex items-center gap-[0.5em] font-semibold" style={{ color: sub }}>
                <span className="grid shrink-0 place-items-center rounded-[0.25em] text-white" style={{ width: '1.2em', height: '1.2em', background: a, fontSize: '0.8em' }}>✓</span>
                {l}
              </li>
            ))}
          </ul>
        ) : (
          item.body && <p className="mt-[0.55em] font-medium leading-snug" style={{ fontSize: fs(0.05), color: sub }}>{lines.join(' · ')}</p>
        )}
        <div className="mt-[0.9em] flex items-center justify-between font-bold uppercase tracking-[0.14em]" style={{ fontSize: fs(0.04), color: sub }}>
          <span>{v === 4 ? 'Save' : 'Swipe'}</span>
          {v === 4 ? <Bookmark aria-hidden style={{ width: '1.3em', height: '1.3em' }} /> : <ArrowRight aria-hidden style={{ width: '1.3em', height: '1.3em' }} />}
        </div>
      </div>
    </div>
  )
}

type Pose = { x: number; y: number; rotate: number; scale: number; zIndex: number; opacity: number }

/**
 * Folder Fan Showcase — a frosted-glass folder with a tabbed back panel and a
 * blurred front pocket. Post cards wait inside, peeking over the rim; hover or
 * focus and they rise and fan out on staggered springs. Click a card (or press
 * Enter) and it lifts clear of the pocket and is pulled forward; arrow keys
 * cycle, Esc tucks it back. A soft mirrored reflection sits on the floor.
 */
export function FolderFanShowcase({
  items = DEFAULT_FOLDER_FAN_ITEMS,
  eyebrow = 'Social carousel designs',
  title = 'Five slides, one story worth swiping',
  highlight = 'worth swiping',
  description = 'A ready-to-post carousel kit: cover, insight, data, checklist and a save-this closer. Hover the folder to fan it out, pick a card to pull it forward.',
  folderLabel = 'Carousel kit',
  folderMeta = '05 posts · 1080 × 1350',
  tabLabel = 'Social',
  accent = '#c8143c',
  titleAs: Title = 'h2',
  index: indexProp,
  defaultIndex = null,
  onIndexChange,
  defaultOpen = false,
  reflection = true,
  ctaLabel = 'Use this kit',
  onCta,
  className,
}: FolderFanShowcaseProps) {
  const reduced = usePrefersReducedMotion()
  const n = Math.max(1, items.length)
  const stageRef = React.useRef<HTMLDivElement>(null)
  const cardRefs = React.useRef<(HTMLButtonElement | null)[]>([])
  const [W, setW] = React.useState(440)
  const [hover, setHover] = React.useState(false)
  const [focusIn, setFocusIn] = React.useState(false)
  const [pinned, setPinned] = React.useState(defaultOpen)
  const [inner, setInner] = React.useState<number | null>(defaultIndex)
  const sel = indexProp !== undefined ? indexProp : inner
  const [front, setFront] = React.useState<number | null>(sel)
  const [transit, setTransit] = React.useState<number[]>([])
  const [active, setActive] = React.useState(sel ?? Math.floor((n - 1) / 2))
  const timer = React.useRef<number | undefined>(undefined)
  const prevSel = React.useRef(sel)

  React.useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return
    const update = () => setW(Math.min(520, Math.max(240, el.clientWidth)))
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Two-phase pull: lift clear of the pocket, then swap z-order and settle.
  React.useEffect(() => {
    const prev = prevSel.current
    if (prev === sel) return
    prevSel.current = sel
    window.clearTimeout(timer.current)
    if (reduced) {
      setFront(sel)
      setTransit([])
      return
    }
    setTransit([prev, sel].filter((v): v is number => v !== null && v !== undefined))
    timer.current = window.setTimeout(() => {
      setFront(sel)
      setTransit([])
    }, 210)
  }, [sel, reduced])
  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  const setSel = (i: number | null) => {
    if (indexProp === undefined) setInner(i)
    onIndexChange?.(i)
  }
  const toggle = (i: number) => {
    setActive(i)
    setSel(sel === i ? null : i)
  }
  const focusCard = (i: number) => {
    const next = ((i % n) + n) % n
    setActive(next)
    cardRefs.current[next]?.focus()
    if (sel !== null && sel !== undefined) setSel(next)
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') focusCard(active + 1)
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') focusCard(active - 1)
    else if (e.key === 'Home') focusCard(0)
    else if (e.key === 'End') focusCard(n - 1)
    else if (e.key === 'Escape' && sel !== null && sel !== undefined) setSel(null)
    else return
    e.preventDefault()
  }

  const open = hover || focusIn || pinned
  const hasSel = sel !== null && sel !== undefined
  const cw = W * 0.34
  const ch = cw * 1.25
  const fh = W * 0.62
  const top = W * 0.36
  const anchor = fh * 0.08

  const pose = (i: number): Pose => {
    const half = Math.max(1, (n - 1) / 2)
    const s = (i - (n - 1) / 2) / half
    const a = Math.abs(s)
    const z = 10 + Math.round((1 - a) * 4)
    if (transit.includes(i)) {
      const goingFront = i === sel
      return { x: goingFront ? s * W * 0.1 : s * W * 0.2, y: -ch * 1.02, rotate: s * 4, scale: goingFront ? 1.08 : 1, zIndex: front === i ? 40 : z, opacity: 1 }
    }
    if (hasSel && i === sel) return { x: 0, y: -fh * 0.4, rotate: 0, scale: 1.42, zIndex: front === i ? 40 : z, opacity: 1 }
    if (hasSel) return { x: s * W * 0.27, y: -ch * 0.42 + a * a * ch * 0.08, rotate: s * 12, scale: 0.94, zIndex: z, opacity: 0.92 }
    if (open) return { x: s * W * 0.31, y: -ch * 0.86 + a * a * ch * 0.18, rotate: s * 13, scale: 1, zIndex: z, opacity: 1 }
    return { x: s * W * 0.22, y: -ch * 0.5 + a * a * ch * 0.08, rotate: s * 8, scale: 1, zIndex: z, opacity: 1 }
  }

  const spring = (i: number) => {
    if (reduced) return { duration: 0 }
    const half = (n - 1) / 2
    const dist = Math.abs(i - half)
    return {
      type: 'spring' as const,
      stiffness: transit.length ? 420 : 300,
      damping: transit.length ? 34 : 26,
      mass: 0.8,
      delay: transit.length || hasSel ? 0 : (open ? dist : half - dist) * 0.045,
      zIndex: { duration: 0 },
    }
  }

  const status = hasSel ? `Card ${sel! + 1} of ${n} pulled forward: ${items[sel!]?.title}` : open ? `${n} cards fanned out` : ''

  const titleNode = (() => {
    if (!highlight || !title.includes(highlight)) return title
    const [pre, post] = title.split(highlight)
    return (<>{pre}<span style={{ color: 'var(--ffs-ink)' }}>{highlight}</span>{post}</>)
  })()

  const renderLayers = (mirror: boolean) => (
    <div className="absolute inset-0" aria-hidden={mirror || undefined}>
      {/* back panel + tab */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-[22px]"
        style={{
          width: W,
          height: fh,
          bottom: 0,
          background: 'var(--ffs-back)',
          boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.35), 0 1px 0 rgb(0 0 0 / 0.03)',
        }}
      >
        <div
          className="absolute -top-[26px] left-0 flex h-[30px] items-start rounded-t-[16px] px-4 pt-[6px] text-[11px] font-bold uppercase tracking-[0.16em]"
          style={{ background: 'var(--ffs-back)', color: 'var(--ffs-tab-ink)', width: Math.max(96, W * 0.34), fontFamily: FONT }}
        >
          {!mirror && tabLabel}
        </div>
        <div className="absolute inset-x-[6%] top-[9%] h-px opacity-50" style={{ background: 'var(--ffs-crease)' }} />
      </div>

      {/* cards */}
      {items.map((item, i) => {
        const p = pose(i)
        const isActive = i === active
        const common = {
          className: cn(
            'absolute left-1/2 overflow-hidden rounded-[14px] outline-none',
            !mirror && 'cursor-pointer focus-visible:ring-[3px] focus-visible:ring-[var(--ffs-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
          ),
          style: {
            width: cw,
            height: ch,
            marginLeft: -cw / 2,
            bottom: anchor,
            transformOrigin: '50% 100%',
            boxShadow: '0 1px 2px rgb(30 0 8 / 0.18), 0 18px 34px -16px rgb(60 0 16 / 0.5)',
          } as React.CSSProperties,
          initial: false as const,
          animate: p,
          transition: spring(i),
        }
        const face = <PostFace item={item} i={i} n={n} accent={accent} w={cw} />
        if (mirror) return <motion.div key={item.id} {...common}>{face}</motion.div>
        return (
          <motion.button
            key={item.id}
            ref={(el: HTMLButtonElement | null) => { cardRefs.current[i] = el }}
            type="button"
            tabIndex={isActive ? 0 : -1}
            aria-pressed={sel === i}
            aria-label={`${i + 1} of ${n}: ${item.title}${item.body ? `. ${item.body.split('|').join(', ')}` : ''}`}
            onClick={() => toggle(i)}
            onFocus={() => setActive(i)}
            whileHover={reduced || hasSel ? undefined : { y: p.y - 10, transition: { type: 'spring', stiffness: 500, damping: 26 } }}
            {...common}
          >
            {face}
          </motion.button>
        )
      })}

      {/* front glass pocket */}
      <div
        className={cn('pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 overflow-hidden rounded-[22px]', !mirror && 'backdrop-blur-[18px] backdrop-saturate-150')}
        style={{
          width: W + 2,
          height: fh * 0.64,
          bottom: 0,
          background: mirror ? 'var(--ffs-pocket-solid)' : 'var(--ffs-pocket)',
          boxShadow: 'var(--ffs-pocket-shadow)',
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.5)_0%,rgb(255_255_255/0)_38%,rgb(255_255_255/0)_70%,rgb(255_255_255/0.18)_100%)] opacity-70 dark:opacity-25" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/90 dark:bg-white/30" />
        {!mirror && (
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3" style={{ padding: `0 ${W * 0.06}px ${W * 0.05}px`, fontFamily: FONT }}>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ffs-ink-strong)] opacity-80">{tabLabel} · Vol. 03</p>
              <p className="mt-1 truncate font-extrabold uppercase leading-none tracking-[-0.01em] text-[var(--ffs-ink-strong)]" style={{ fontSize: Math.max(17, W * 0.058) }}>{folderLabel}</p>
            </div>
            {W >= 400 && <p className="shrink-0 pb-0.5 text-[10px] font-semibold tabular-nums tracking-[0.06em] text-[var(--ffs-ink-strong)] opacity-80">{folderMeta}</p>}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <section
      aria-label={eyebrow}
      className={cn(
        'relative isolate w-full overflow-hidden rounded-3xl text-zinc-900 ring-1 ring-black/[0.06] [container-type:inline-size] dark:text-zinc-50 dark:ring-white/[0.07]',
        // palette tokens (light)
        '[--ffs-back:color-mix(in_oklab,var(--ffs-accent)_22%,#fff4f6)] [--ffs-tab-ink:color-mix(in_oklab,var(--ffs-accent)_75%,#000)] [--ffs-crease:color-mix(in_oklab,var(--ffs-accent)_30%,#fff)]',
        '[--ffs-pocket:linear-gradient(180deg,rgb(255_255_255/0.62),rgb(255_236_241/0.42))] [--ffs-pocket-solid:linear-gradient(180deg,#fff,#ffe9ee)] [--ffs-ink:color-mix(in_oklab,var(--ffs-accent)_92%,#000)] [--ffs-ink-strong:color-mix(in_oklab,var(--ffs-accent)_55%,#1a0006)] [--ffs-ring:color-mix(in_oklab,var(--ffs-accent)_85%,#000)]',
        '[--ffs-pocket-shadow:inset_0_0_0_1px_rgb(255_255_255/0.65),inset_0_-18px_40px_-20px_rgb(255_255_255/0.8),0_30px_60px_-30px_rgb(110_0_24/0.45),0_2px_6px_-2px_rgb(110_0_24/0.15)]',
        // dark
        'dark:[--ffs-back:color-mix(in_oklab,var(--ffs-accent)_34%,#12030a)] dark:[--ffs-tab-ink:color-mix(in_oklab,var(--ffs-accent)_25%,#fff)] dark:[--ffs-crease:rgb(255_255_255/0.2)]',
        'dark:[--ffs-pocket:linear-gradient(180deg,rgb(255_255_255/0.13),rgb(40_6_16/0.55))] dark:[--ffs-pocket-solid:linear-gradient(180deg,#3a1220,#1b060d)] dark:[--ffs-ink:color-mix(in_oklab,var(--ffs-accent)_45%,#fff)] dark:[--ffs-ink-strong:#fff] dark:[--ffs-ring:color-mix(in_oklab,var(--ffs-accent)_40%,#fff)]',
        'dark:[--ffs-pocket-shadow:inset_0_0_0_1px_rgb(255_255_255/0.14),inset_0_1px_0_rgb(255_255_255/0.25),0_30px_70px_-30px_rgb(0_0_0/0.9)]',
        className,
      )}
      style={{ ['--ffs-accent' as string]: accent, fontFamily: FONT }}
    >
      {/* backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[#fff8f9] dark:bg-[#0b0306]">
        <div className="absolute inset-0 opacity-90 [background:radial-gradient(70%_60%_at_70%_35%,color-mix(in_oklab,var(--ffs-accent)_18%,transparent),transparent_70%),radial-gradient(50%_50%_at_10%_100%,color-mix(in_oklab,var(--ffs-accent)_10%,transparent),transparent_70%)] dark:[background:radial-gradient(70%_60%_at_70%_35%,color-mix(in_oklab,var(--ffs-accent)_34%,transparent),transparent_70%),radial-gradient(50%_50%_at_10%_100%,color-mix(in_oklab,var(--ffs-accent)_14%,transparent),transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.035] mix-blend-multiply dark:opacity-[0.06] dark:mix-blend-screen" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
      </div>

      <div className="grid items-center gap-6 px-5 py-8 sm:px-8 sm:py-10 @3xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] @3xl:gap-8 @3xl:gap-4 @3xl:py-12">
        <div className="relative z-10 text-center @3xl:pl-2 @3xl:text-left">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--ffs-ink-strong)] ring-1 ring-black/[0.06] backdrop-blur dark:bg-white/[0.06] dark:ring-white/10">
            <span aria-hidden className="size-1.5 rounded-full" style={{ background: accent }} />
            {eyebrow}
          </p>
          <Title className="mx-auto mt-4 max-w-[16ch] text-[28px] font-extrabold leading-[1.02] tracking-[-0.035em] text-zinc-950 sm:text-[34px] @3xl:mx-0 @3xl:text-[40px] dark:text-white">
            {titleNode}
          </Title>
          <p className="mx-auto mt-3 max-w-[38ch] text-[14px] leading-relaxed text-zinc-700 @3xl:mx-0 dark:text-zinc-300">{description}</p>
          {ctaLabel && (
            <button
              type="button"
              onClick={onCta}
              className="group mt-5 inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-[13px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_1px_0_rgb(255_255_255/0.25)_inset,0_10px_24px_-10px_var(--ffs-accent)] outline-none transition-transform duration-150 active:scale-[0.97] focus-visible:ring-[3px] focus-visible:ring-[var(--ffs-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0306]"
              style={{ background: `linear-gradient(180deg, ${mix(accent, 88, '#fff')}, ${mix(accent, 88, '#000')})` }}
            >
              {ctaLabel}
              <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </button>
          )}
        </div>

        <div className="min-w-0">
          <div
            ref={stageRef}
            role="group"
            aria-roledescription="card folder"
            aria-label={`${folderLabel}: ${n} cards. Use arrow keys to move between cards, Enter to pull one forward, Escape to tuck it back.`}
            onKeyDown={onKeyDown}
            onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
            onPointerLeave={() => setHover(false)}
            onFocus={() => setFocusIn(true)}
            onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setFocusIn(false)}
            className="relative mx-auto w-full max-w-[520px]"
            style={{ height: top + fh + (reflection ? W * 0.17 : 12) }}
          >
            {/* floor */}
            <div aria-hidden className="pointer-events-none absolute left-1/2 -translate-x-1/2" style={{ top: top + fh - 1, width: W * 1.5 }}>
              <div className="h-px w-full bg-[linear-gradient(90deg,transparent,rgb(120_0_30/0.18),transparent)] dark:bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.16),transparent)]" />
              <div className="mx-auto -mt-3 h-6 w-[62%] rounded-[50%] bg-[rgb(110_0_24/0.22)] blur-xl dark:bg-black/70" />
            </div>
            <div className="absolute inset-x-0 top-0" style={{ height: top + fh }}>
              {reflection && (
                <div
                  aria-hidden
                  inert
                  className="pointer-events-none absolute inset-0 opacity-80 dark:opacity-60"
                  style={{
                    transform: 'scaleY(-1)',
                    transformOrigin: '50% 100%',
                    WebkitMaskImage: 'linear-gradient(to top, rgb(0 0 0 / 0.7), transparent 30%)',
                    maskImage: 'linear-gradient(to top, rgb(0 0 0 / 0.7), transparent 30%)',
                  }}
                >
                  {renderLayers(true)}
                </div>
              )}
              {renderLayers(false)}
            </div>
          </div>

          {/* controls */}
          <div className="relative z-10 mx-auto mt-1 flex max-w-[520px] items-center justify-center gap-2">
            <button type="button" aria-label="Previous card" onClick={() => focusCard(active - 1)} className="grid size-11 place-items-center rounded-full bg-white/80 text-zinc-800 shadow-[0_1px_2px_rgb(0_0_0/0.06)] ring-1 ring-black/[0.07] outline-none backdrop-blur transition-transform duration-150 hover:bg-white active:scale-95 focus-visible:ring-[3px] focus-visible:ring-[var(--ffs-ring)] dark:bg-white/[0.07] dark:text-zinc-100 dark:ring-white/10 dark:hover:bg-white/[0.12]">
              <ChevronLeft aria-hidden className="size-[18px]" />
            </button>
            <p className="min-w-[4.5rem] text-center text-[12px] font-bold tabular-nums tracking-[0.14em] text-zinc-700 dark:text-zinc-300">
              <span className="text-zinc-950 dark:text-white">{String(active + 1).padStart(2, '0')}</span> / {String(n).padStart(2, '0')}
            </p>
            <button type="button" aria-label="Next card" onClick={() => focusCard(active + 1)} className="grid size-11 place-items-center rounded-full bg-white/80 text-zinc-800 shadow-[0_1px_2px_rgb(0_0_0/0.06)] ring-1 ring-black/[0.07] outline-none backdrop-blur transition-transform duration-150 hover:bg-white active:scale-95 focus-visible:ring-[3px] focus-visible:ring-[var(--ffs-ring)] dark:bg-white/[0.07] dark:text-zinc-100 dark:ring-white/10 dark:hover:bg-white/[0.12]">
              <ChevronRight aria-hidden className="size-[18px]" />
            </button>
            <AnimatePresence mode="popLayout" initial={false}>
              {hasSel ? (
                <motion.button
                  key="tuck"
                  type="button"
                  onClick={() => setSel(null)}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
                  transition={{ type: 'spring', stiffness: 460, damping: 30 }}
                  className="ml-1 inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full bg-zinc-950 px-4 text-[12px] font-bold uppercase tracking-[0.12em] text-white outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ffs-ring)] focus-visible:ring-offset-2 dark:bg-white dark:text-zinc-950"
                >
                  <Undo2 aria-hidden className="size-4" /> Tuck back
                </motion.button>
              ) : (
                <motion.button
                  key="fan"
                  type="button"
                  aria-pressed={pinned}
                  onClick={() => setPinned((v) => !v)}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
                  transition={{ type: 'spring', stiffness: 460, damping: 30 }}
                  className={cn(
                    'ml-1 inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-[12px] font-bold uppercase tracking-[0.12em] outline-none ring-1 transition-colors focus-visible:ring-[3px] focus-visible:ring-[var(--ffs-ring)]',
                    pinned ? 'bg-zinc-950 text-white ring-transparent dark:bg-white dark:text-zinc-950' : 'bg-white/80 text-zinc-800 ring-black/[0.07] dark:bg-white/[0.07] dark:text-zinc-100 dark:ring-white/10',
                  )}
                >
                  <Layers aria-hidden className="size-4" /> {pinned ? 'Fanned' : 'Fan out'}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <p role="status" aria-live="polite" className="sr-only">{status}</p>
    </section>
  )
}
