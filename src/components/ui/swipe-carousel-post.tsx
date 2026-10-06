import * as React from 'react'
import { AnimatePresence, animate, motion, useInView, useMotionValue, type PanInfo } from 'motion/react'
import { Bookmark, ChevronLeft, ChevronRight, Heart, MessageCircle, MoreHorizontal, Pause, Play, Send } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type SwipePostSlide = {
  id: string
  title: string
  body?: string
  /** Small label above the title. */
  kicker?: string
  /** Optional image URL; replaces the generated slide. */
  src?: string
  alt?: string
}

export type SwipeCarouselPostProps = {
  slides?: SwipePostSlide[]
  /** Account name in the header. */
  author?: string
  /** Secondary header line (location, "Sponsored"…). */
  meta?: string
  caption?: string
  /** Relative time under the caption. */
  time?: string
  likes?: number
  comments?: number
  /** Accent for the generated slides and the progress bar. */
  accent?: string
  /** Advance slides automatically with a segmented progress bar. Paused on hover, focus, drag and offscreen. */
  autoPlay?: boolean
  /** Milliseconds per slide while auto-playing. */
  interval?: number
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  defaultLiked?: boolean
  onLikeChange?: (liked: boolean) => void
  defaultSaved?: boolean
  onSaveChange?: (saved: boolean) => void
  className?: string
}

export const DEFAULT_SWIPE_POST_SLIDES: SwipePostSlide[] = [
  { id: 's1', kicker: 'Field notes', title: 'How we plan a launch in 6 slides', body: 'Swipe for the exact doc we use.' },
  { id: 's2', kicker: '01 · Why', title: 'Start with the sentence you want people to repeat.', body: 'If you can’t say it in one line, the launch isn’t ready.' },
  { id: 's3', kicker: '02 · Who', title: '3 people. One owner.', body: 'Writer, designer, engineer. The owner breaks every tie.' },
  { id: 's4', kicker: '03 · When', title: 'Ship on Tuesday, 10:00', body: 'Never Friday. Leave two calm days to fix what you missed.' },
  { id: 's5', kicker: '04 · Proof', title: '+41% sign-ups vs. our last release', body: 'Same budget. Clearer story.' },
  { id: 's6', kicker: 'Save it', title: 'Bookmark for your next launch', body: 'Tag the teammate who writes the release notes.' },
]

const mix = (c: string, p: number, w: string) => `color-mix(in oklab, ${c} ${p}%, ${w})`

function SlideArt({ slide, i, n, accent }: { slide: SwipePostSlide; i: number; n: number; accent: string }) {
  if (slide.src) {
    return <img src={slide.src} alt={slide.alt ?? ''} draggable={false} className="h-full w-full select-none object-cover" />
  }
  const v = i === 0 ? 0 : i === n - 1 ? 3 : i % 2 === 1 ? 1 : 2
  const bg =
    v === 0 ? `radial-gradient(120% 90% at 85% 10%, ${mix(accent, 70, '#ffd1dc')}, ${accent} 45%, ${mix(accent, 55, '#120006')})`
    : v === 1 ? '#fbf6f1'
    : v === 2 ? `linear-gradient(165deg, ${mix(accent, 30, '#1b0710')}, #0e0408)`
    : `linear-gradient(200deg, ${mix(accent, 45, '#fff')}, ${mix(accent, 85, '#2a0010')})`
  const light = v === 1
  const ink = light ? '#1f0a12' : '#fff'
  const sub = light ? 'rgba(31,10,18,0.74)' : 'rgba(255,255,255,0.84)'
  const big = /^[+-]?\d/.test(slide.title)
  return (
    <div className="relative flex h-full w-full select-none flex-col justify-between overflow-hidden p-[8%]" style={{ background: bg, color: ink }}>
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 125" preserveAspectRatio="none">
        {v === 0 && (<g fill="none" stroke="#fff" opacity="0.14">{[10, 20, 30, 40, 50].map((r) => <circle key={r} cx="86" cy="16" r={r} />)}</g>)}
        {v === 1 && <circle cx="92" cy="112" r="30" fill={accent} opacity="0.07" />}
        {v === 2 && <path d="M0 90 C30 70 60 110 100 84 V125 H0Z" fill={accent} opacity="0.22" />}
        {v === 3 && <circle cx="50" cy="112" r="46" fill="#fff" opacity="0.08" />}
      </svg>
      <div className="relative flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: v === 1 ? accent : sub }}>
        <span>{slide.kicker}</span>
      </div>
      <div className="relative">
        <p
          className={cn('font-semibold leading-[1.02] tracking-[-0.035em]', v === 1 && 'font-[family-name:var(--font-display,Georgia),Georgia,serif] font-normal italic tracking-[-0.02em]')}
          style={{ fontSize: big ? 'clamp(30px, 11cqw, 52px)' : v === 0 ? 'clamp(26px, 9.5cqw, 42px)' : 'clamp(22px, 8cqw, 36px)' }}
        >
          {slide.title}
        </p>
        {slide.body && <p className="mt-3 max-w-[30ch] text-[14px] leading-snug" style={{ color: sub }}>{slide.body}</p>}
      </div>
    </div>
  )
}

/**
 * Swipe Carousel Post — an Instagram-style multi-slide post card. Drag or
 * swipe the media (or use the arrows / arrow keys) and the track snaps on a
 * spring; a segmented bar shows slide progress and fills while auto-playing,
 * the dot pager shrinks toward the edges, and a double-tap drops a heart.
 */
export function SwipeCarouselPost({
  slides = DEFAULT_SWIPE_POST_SLIDES,
  author = 'Northfold Studio',
  meta = 'Lisbon · Sponsored',
  caption = 'Our whole launch playbook, one swipe at a time. Steal it, remix it, tell us what you’d change. Slide 4 is the one nobody follows.',
  time = '2 hours ago',
  likes = 1284,
  comments = 86,
  accent = '#d6336c',
  autoPlay = true,
  interval = 4200,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  defaultLiked = false,
  onLikeChange,
  defaultSaved = false,
  onSaveChange,
  className,
}: SwipeCarouselPostProps) {
  const reduced = usePrefersReducedMotion()
  const n = Math.max(1, slides.length)
  const rootRef = React.useRef<HTMLElement>(null)
  const mediaRef = React.useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { margin: '40px' })
  const [inner, setInner] = React.useState(defaultIndex)
  const idx = Math.min(n - 1, Math.max(0, indexProp ?? inner))
  const [width, setWidth] = React.useState(360)
  const x = useMotionValue(0)
  const fill = useMotionValue(0)
  const [hover, setHover] = React.useState(false)
  const [focusIn, setFocusIn] = React.useState(false)
  const [dragging, setDragging] = React.useState(false)
  const [userPaused, setUserPaused] = React.useState(false)
  const [liked, setLiked] = React.useState(defaultLiked)
  const [saved, setSaved] = React.useState(defaultSaved)
  const [hearts, setHearts] = React.useState<{ id: number; x: number; y: number }[]>([])
  const [expanded, setExpanded] = React.useState(false)
  const panned = React.useRef(false)

  React.useLayoutEffect(() => {
    const el = mediaRef.current
    if (!el) return
    const update = () => setWidth(el.clientWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const go = React.useCallback((i: number) => {
    const next = Math.min(n - 1, Math.max(0, i))
    if (indexProp === undefined) setInner(next)
    onIndexChange?.(next)
  }, [n, indexProp, onIndexChange])

  // snap the track
  React.useEffect(() => {
    if (dragging) return
    const c = animate(x, -idx * width, reduced ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 34, mass: 0.8 })
    return () => c.stop()
  }, [idx, width, dragging, reduced, x])

  const playing = autoPlay && !reduced && !userPaused && !hover && !focusIn && !dragging && inView
  React.useEffect(() => {
    if (!playing) return
    const from = fill.get()
    const c = animate(fill, 1, {
      duration: (interval / 1000) * (1 - from),
      ease: 'linear',
      onComplete: () => {
        if (document.hidden) return
        fill.set(0)
        go(idx + 1 >= n ? 0 : idx + 1)
      },
    })
    return () => c.stop()
  }, [playing, idx, interval, n, go, fill])
  React.useEffect(() => { fill.set(0) }, [idx, fill])

  const onPanEnd = (_: PointerEvent, info: PanInfo) => {
    setDragging(false)
    const d = info.offset.x
    if (d < -width * 0.18 || info.velocity.x < -500) go(idx + 1)
    else if (d > width * 0.18 || info.velocity.x > 500) go(idx - 1)
    else animate(x, -idx * width, { type: 'spring', stiffness: 320, damping: 34 })
    window.setTimeout(() => (panned.current = false), 0)
  }
  const onPan = (_: PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 4) panned.current = true
    const edge = (idx === 0 && info.offset.x > 0) || (idx === n - 1 && info.offset.x < 0)
    x.set(-idx * width + info.offset.x * (edge ? 0.3 : 1))
  }

  const toggleLike = (v = !liked) => {
    setLiked(v)
    onLikeChange?.(v)
  }
  const onDouble = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    toggleLike(true)
    if (reduced) return
    const id = Date.now()
    setHearts((h) => [...h, { id, x: e.clientX - r.left, y: e.clientY - r.top }])
    window.setTimeout(() => setHearts((h) => h.filter((q) => q.id !== id)), 900)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(idx + 1)
    else if (e.key === 'ArrowLeft') go(idx - 1)
    else if (e.key === 'Home') go(0)
    else if (e.key === 'End') go(n - 1)
    else return
    e.preventDefault()
  }

  const likeCount = likes + (liked ? 1 : 0)
  const onLight = !slides[idx]?.src && idx !== 0 && idx !== n - 1 && idx % 2 === 1
  const initials = author.split(/\s+/).map((w) => w[0]).slice(0, 2).join('')
  const iconBtn = 'grid size-11 place-items-center rounded-full outline-none transition-colors hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:hover:bg-zinc-800 dark:focus-visible:ring-zinc-100'

  return (
    <article
      ref={rootRef}
      aria-label={`Post by ${author}`}
      className={cn(
        'w-full max-w-[420px] overflow-hidden rounded-[28px] bg-white text-zinc-900 shadow-[0_1px_2px_rgb(0_0_0/0.05),0_24px_60px_-28px_rgb(24_24_27/0.35)] ring-1 ring-black/[0.06] dark:bg-zinc-950 dark:text-zinc-50 dark:shadow-none dark:ring-white/[0.08]',
        className,
      )}
    >
      {/* header */}
      <header className="flex items-center gap-3 px-3.5 py-2.5">
        <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full p-[2px]" style={{ background: `conic-gradient(from 200deg, ${accent}, #f59e0b, ${mix(accent, 60, '#7c3aed')}, ${accent})` }}>
          <span className="grid size-full place-items-center rounded-full bg-white p-[2px] dark:bg-zinc-950">
            <span className="grid size-full place-items-center rounded-full text-[12px] font-bold text-white" style={{ background: `linear-gradient(135deg, ${mix(accent, 80, '#000')}, ${accent})` }}>{initials}</span>
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold leading-tight">{author}</p>
          <p className="truncate text-[12px] text-zinc-600 dark:text-zinc-400">{meta}</p>
        </div>
        <button type="button" aria-label="More options" className={cn(iconBtn, '-mr-1.5 text-zinc-700 dark:text-zinc-300')}>
          <MoreHorizontal aria-hidden className="size-5" />
        </button>
      </header>

      {/* media */}
      <div
        ref={mediaRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${n} slides. Use left and right arrow keys to browse.`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
        onPointerLeave={() => setHover(false)}
        onFocus={() => setFocusIn(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setFocusIn(false)}
        className="group/media relative aspect-[4/5] w-full overflow-hidden bg-zinc-100 outline-none [container-type:inline-size] focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-zinc-900 dark:bg-zinc-900 dark:focus-visible:ring-zinc-100"
      >
        <motion.div
          className="flex h-full cursor-grab touch-pan-y active:cursor-grabbing"
          style={{ x, width: width * n }}
          onPanStart={() => setDragging(true)}
          onPan={onPan}
          onPanEnd={onPanEnd}
          onDoubleClick={onDouble}
        >
          {slides.map((s, i) => (
            <div
              key={s.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}`}
              aria-hidden={i !== idx || undefined}
              className="relative h-full shrink-0"
              style={{ width }}
            >
              <SlideArt slide={s} i={i} n={n} accent={accent} />
              {!s.src && <span className="sr-only">{`${s.kicker ? s.kicker + ': ' : ''}${s.title}. ${s.body ?? ''}`}</span>}
            </div>
          ))}
        </motion.div>

        {/* segmented progress */}
        <div aria-hidden className="pointer-events-none absolute inset-x-3 top-3 flex gap-1">
          {slides.map((s, i) => (
            <div key={s.id} className={cn('h-[3px] flex-1 overflow-hidden rounded-full transition-colors duration-300', onLight ? 'bg-zinc-900/15' : 'bg-white/35')}>
              <motion.div
                className={cn('h-full origin-left rounded-full transition-colors duration-300', onLight ? 'bg-zinc-900' : 'bg-white')}
                style={{ scaleX: i < idx ? 1 : i > idx ? 0 : autoPlay && !reduced ? fill : 1 }}
              />
            </div>
          ))}
        </div>

        {/* hearts */}
        <AnimatePresence>
          {hearts.map((h) => (
            <motion.span
              key={h.id}
              aria-hidden
              className="pointer-events-none absolute"
              style={{ left: h.x - 44, top: h.y - 44 }}
              initial={{ scale: 0.2, opacity: 0, rotate: -12 }}
              animate={{ scale: [0.2, 1.25, 1], opacity: [0, 1, 1], rotate: [-12, 6, 0] }}
              exit={{ scale: 1.4, opacity: 0, y: -40, transition: { duration: 0.35 } }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <Heart className="size-[88px] fill-white text-white drop-shadow-[0_8px_24px_rgb(0_0_0/0.35)]" />
            </motion.span>
          ))}
        </AnimatePresence>

        {/* arrows + pause */}
        {idx > 0 && (
          <button type="button" aria-label="Previous slide" onClick={() => go(idx - 1)} className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-zinc-900 shadow-md outline-none backdrop-blur transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-zinc-900 pointer-fine:opacity-0 pointer-fine:group-hover/media:opacity-100 pointer-fine:focus-visible:opacity-100 dark:bg-zinc-900/80 dark:text-white dark:focus-visible:ring-white">
            <ChevronLeft aria-hidden className="size-5" />
          </button>
        )}
        {idx < n - 1 && (
          <button type="button" aria-label="Next slide" onClick={() => go(idx + 1)} className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-zinc-900 shadow-md outline-none backdrop-blur transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-zinc-900 pointer-fine:opacity-0 pointer-fine:group-hover/media:opacity-100 pointer-fine:focus-visible:opacity-100 dark:bg-zinc-900/80 dark:text-white dark:focus-visible:ring-white">
            <ChevronRight aria-hidden className="size-5" />
          </button>
        )}
        <div className="absolute right-2 top-5 flex items-center">
          {autoPlay && !reduced ? (
            <button
              type="button"
              aria-label={userPaused ? 'Resume slideshow' : 'Pause slideshow'}
              aria-pressed={userPaused}
              onClick={() => setUserPaused((v) => !v)}
              className="grid min-h-11 place-items-center rounded-full px-1 text-white outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span className="flex h-7 items-center gap-1.5 rounded-full bg-black/45 pl-2.5 pr-2 text-[11px] font-semibold tabular-nums backdrop-blur">
                {idx + 1}/{n}
                {userPaused ? <Play aria-hidden className="size-3 fill-current" /> : <Pause aria-hidden className="size-3 fill-current" />}
              </span>
            </button>
          ) : (
            <span aria-hidden className="m-2 flex h-7 items-center rounded-full bg-black/45 px-2.5 text-[11px] font-semibold tabular-nums text-white backdrop-blur">{idx + 1}/{n}</span>
          )}
        </div>
      </div>

      {/* actions */}
      <div className="flex items-center px-1.5 pt-1">
        <motion.button
          type="button"
          aria-pressed={liked}
          aria-label={liked ? 'Unlike' : 'Like'}
          onClick={() => toggleLike()}
          whileTap={reduced ? undefined : { scale: 0.86 }}
          className={cn(iconBtn, liked ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-800 dark:text-zinc-200')}
        >
          <motion.span key={String(liked)} initial={reduced || !liked ? false : { scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 520, damping: 14 }}>
            <Heart aria-hidden className={cn('size-6', liked && 'fill-current')} />
          </motion.span>
        </motion.button>
        <button type="button" aria-label={`View ${comments} comments`} className={cn(iconBtn, 'text-zinc-800 dark:text-zinc-200')}>
          <MessageCircle aria-hidden className="size-6 -scale-x-100" />
        </button>
        <button type="button" aria-label="Share" className={cn(iconBtn, 'text-zinc-800 dark:text-zinc-200')}>
          <Send aria-hidden className="size-[22px]" />
        </button>

        {/* dot pager */}
        <div className="flex flex-1 items-center justify-center gap-[5px]" aria-hidden>
          {slides.map((s, i) => {
            const d = Math.abs(i - idx)
            return (
              <motion.span
                key={s.id}
                className="block size-1.5 rounded-full"
                animate={{ scale: d === 0 ? 1.15 : d === 1 ? 0.9 : d === 2 ? 0.7 : 0.5, backgroundColor: d === 0 ? accent : 'rgb(161 161 170 / 0.7)' }}
                transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 460, damping: 30 }}
              />
            )
          })}
        </div>

        <motion.button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? 'Remove from saved' : 'Save post'}
          onClick={() => { setSaved(!saved); onSaveChange?.(!saved) }}
          whileTap={reduced ? undefined : { scale: 0.86 }}
          className={cn(iconBtn, 'text-zinc-800 dark:text-zinc-200')}
        >
          <Bookmark aria-hidden className={cn('size-6 transition-[fill] duration-200', saved && 'fill-current')} />
        </motion.button>
      </div>

      <div className="px-4 pb-4">
        <p className="text-[14px] font-semibold tabular-nums">{likeCount.toLocaleString('en-US')} likes</p>
        <p className={cn('mt-1 text-[14px] leading-snug text-zinc-800 dark:text-zinc-200', !expanded && 'line-clamp-2')}>
          <span className="mr-1.5 font-semibold text-zinc-950 dark:text-white">{author}</span>
          {caption}
        </p>
        <div className="mt-0.5 flex items-center justify-between">
          <button type="button" aria-expanded={expanded} onClick={() => setExpanded((v) => !v)} className="-ml-1 min-h-11 rounded-md px-1 text-[13px] font-medium text-zinc-600 outline-none hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 dark:focus-visible:ring-zinc-100">
            {expanded ? 'Less' : `More · View all ${comments} comments`}
          </button>
          <p className="text-[12px] uppercase tracking-[0.08em] text-zinc-600 dark:text-zinc-400">{time}</p>
        </div>
      </div>
      <p role="status" aria-live="polite" className="sr-only">{`Slide ${idx + 1} of ${n}: ${slides[idx]?.title ?? ''}${liked ? '. Liked' : ''}${saved ? '. Saved' : ''}`}</p>
    </article>
  )
}
