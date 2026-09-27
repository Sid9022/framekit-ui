import * as React from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type CurvedWallItem = {
  id: string
  title: string
  caption?: string
  /** Optional image URL — replaces the generated landscape art. */
  src?: string
  /** Hue (0–360) for the generated art. */
  hue?: number
}

export type CurvedTileWallProps = {
  items?: CurvedWallItem[]
  eyebrow?: string
  title?: string
  subtitle?: string
  /** Auto drift amplitude in degrees (0 disables). */
  drift?: number
  onItemOpen?: (item: CurvedWallItem) => void
  className?: string
}

const NAMES = [
  ['Salt Flats', 'Mirror-still water at first light.'],
  ['Low Tide', 'The sea pulled back, the sky stayed.'],
  ['Copper Ridge', 'Late sun catching the high passes.'],
  ['Night Garden', 'Cool leaves under a violet moon.'],
  ['Glasshouse', 'Warm air, fogged panes, green light.'],
  ['Paper Moon', 'A thin moon over folded hills.'],
  ['Ember Dunes', 'Heat shimmer on the long slopes.'],
  ['Fjord Light', 'Blue walls, bluer water.'],
  ['Violet Hour', 'The ten minutes after sunset.'],
  ['Mint Field', 'Soft rows running to the horizon.'],
  ['Harbor Fog', 'Masts dissolving into grey.'],
  ['Solar Bloom', 'Noon, loud and golden.'],
  ['Quiet Peaks', 'Snow that nobody has walked on.'],
  ['Coral Drift', 'Pink water, slow currents.'],
  ['Blue Hour', 'City hum before the lamps.'],
  ['Sandglass', 'Wind-cut ridges, fine as silk.'],
  ['Aurora Lake', 'Green ribbons over black water.'],
  ['Rust Canyon', 'Iron walls and a sliver of sky.'],
]
const HUES = [196, 210, 22, 268, 150, 240, 30, 205, 285, 140, 220, 45, 190, 350, 230, 38, 165, 12]

export const DEFAULT_CURVED_WALL_ITEMS: CurvedWallItem[] = NAMES.map(([title, caption], i) => ({
  id: title.toLowerCase().replace(/\s+/g, '-'),
  title,
  caption,
  hue: HUES[i],
}))

const PATTERN = [[1, 2, 1], [2, 2], [1, 1, 2], [2, 1, 1], [1, 1, 1, 1], [2, 2], [1, 2, 1], [2, 1, 1], [1, 1, 2], [2, 2], [1, 2, 1]]

function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

/** Procedural landscape used when an item has no `src`. */
export function WallArt({ hue = 210, seed = 1, className }: { hue?: number; seed?: number; className?: string }) {
  const id = React.useId().replace(/:/g, '')
  const kind = seed % 3
  const ridge = (base: number, amp: number, s: number) => {
    let d = `M0 100 L0 ${base}`
    for (let x = 0; x <= 100; x += 10) {
      const y = base - amp * (0.5 + 0.5 * Math.sin(x * 0.07 + s * 3.1)) - amp * 0.6 * rand(s + x)
      d += kind === 1 ? ` Q${x - 5} ${y - amp * 0.4} ${x} ${y}` : ` L${x} ${y}`
    }
    return d + ' L100 100 Z'
  }
  const sx = 20 + rand(seed) * 60
  const sy = 18 + rand(seed + 3) * 22
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={`hsl(${hue + 20} 70% ${kind === 2 ? 22 : 72}%)`} />
          <stop offset="1" stopColor={`hsl(${hue - 15} 85% ${kind === 2 ? 44 : 88}%)`} />
        </linearGradient>
        <radialGradient id={`${id}g`}>
          <stop offset="0" stopColor={`hsl(${hue + 40} 100% 92%)`} />
          <stop offset="1" stopColor={`hsl(${hue + 40} 100% 80%)`} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#${id}s)`} />
      <circle cx={sx} cy={sy} r="26" fill={`url(#${id}g)`} />
      <circle cx={sx} cy={sy} r={kind === 2 ? 6 : 8} fill={`hsl(${hue + 40} 100% ${kind === 2 ? 90 : 96}%)`} />
      <path d={ridge(62, 18, seed)} fill={`hsl(${hue} 45% ${kind === 2 ? 30 : 62}%)`} opacity="0.85" />
      <path d={ridge(74, 14, seed + 7)} fill={`hsl(${hue - 10} 50% ${kind === 2 ? 20 : 45}%)`} />
      <path d={ridge(88, 10, seed + 13)} fill={`hsl(${hue - 20} 55% ${kind === 2 ? 12 : 28}%)`} />
    </svg>
  )
}

type Placed = { key: string; item: CurvedWallItem; index: number; theta: number; phi: number; h: number }

/**
 * Curved Tile Wall — a gallery bent onto a sphere section. Tiles of mixed
 * heights sit on the curve with real CSS 3D; drag or move to swing the wall,
 * hover to pull a frame toward you, click to open it in a focused lightbox.
 */
export function CurvedTileWall({
  items = DEFAULT_CURVED_WALL_ITEMS,
  eyebrow = 'Collections',
  title = 'A wall of quiet places',
  subtitle = 'Drag to wander. Tap a frame to step inside.',
  drift = 10,
  onItemOpen,
  className,
}: CurvedTileWallProps) {
  const rootRef = React.useRef<HTMLElement>(null)
  const worldRef = React.useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const inView = useInView(rootRef, { margin: '80px' })
  const headRef = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(720)
  const [headH, setHeadH] = React.useState(160)
  const [open, setOpen] = React.useState<{ item: CurvedWallItem; index: number } | null>(null)
  const lastFocus = React.useRef<HTMLElement | null>(null)
  const closeRef = React.useRef<HTMLButtonElement>(null)

  React.useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return
    const update = () => {
      setWidth(el.clientWidth)
      if (headRef.current) setHeadH(headRef.current.offsetHeight)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    if (headRef.current) ro.observe(headRef.current)
    return () => ro.disconnect()
  }, [])

  const compact = width < 560
  const colW = compact ? 88 : 128
  const unit = compact ? 44 : 62
  const gap = compact ? 8 : 10
  const R = compact ? 340 : 500
  const colH = 4 * unit + 3 * gap

  const placed = React.useMemo<Placed[]>(() => {
    const out: Placed[] = []
    const C = PATTERN.length
    let n = 0
    PATTERN.forEach((col, c) => {
      const theta = ((c - (C - 1) / 2) * (colW + gap)) / R
      let off = 0
      col.forEach((k, j) => {
        const h = k * unit + (k - 1) * gap
        const cy = off + h / 2 - colH / 2
        off += h + gap
        const index = n % items.length
        out.push({ key: `${c}-${j}`, item: items[index], index: n, theta, phi: -cy / R, h })
        n++
      })
    })
    return out
  }, [items, colW, unit, gap, R, colH])

  // camera state (degrees)
  const cam = React.useRef({ yaw: 0, pitch: 0, tYaw: 0, tPitch: 0, pYaw: 0, pPitch: 0, t: 0 })
  const drag = React.useRef<{ x: number; y: number; yaw: number; pitch: number; moved: boolean } | null>(null)
  const suppressClick = React.useRef(false)

  React.useEffect(() => {
    const world = worldRef.current
    if (!world) return
    const apply = () => {
      const c = cam.current
      world.style.transform = `translateZ(${-R}px) rotateX(${c.pitch}deg) rotateY(${c.yaw}deg)`
    }
    apply()
    if (!inView) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const c = cam.current
      if (!drag.current && !reduced) c.t += dt
      const d = reduced || drag.current ? 0 : Math.sin(c.t * 0.22) * drift
      const ty = c.tYaw + d + c.pYaw
      const tp = c.tPitch + c.pPitch
      c.yaw += (ty - c.yaw) * (reduced ? 1 : 0.08)
      c.pitch += (tp - c.pitch) * (reduced ? 1 : 0.08)
      apply()
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduced, drift, R])

  const clampYaw = (v: number) => Math.max(-48, Math.min(48, v))
  const clampPitch = (v: number) => Math.max(-12, Math.min(12, v))

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    drag.current = { x: e.clientX, y: e.clientY, yaw: cam.current.tYaw, pitch: cam.current.tPitch, moved: false }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (d) {
      const dx = e.clientX - d.x
      const dy = e.clientY - d.y
      if (!d.moved && Math.hypot(dx, dy) > 6) {
        d.moved = true
        ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      }
      if (d.moved) {
        cam.current.tYaw = clampYaw(d.yaw + dx * 0.22)
        cam.current.tPitch = clampPitch(d.pitch - dy * 0.08)
      }
      return
    }
    if (e.pointerType === 'touch' || reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    cam.current.pYaw = (((e.clientX - r.left) / r.width) * 2 - 1) * 7
    cam.current.pPitch = -(((e.clientY - r.top) / r.height) * 2 - 1) * 4
  }
  const endDrag = (e: React.PointerEvent) => {
    const el = e.currentTarget as HTMLElement
    if (el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId)
    if (drag.current?.moved) {
      suppressClick.current = true
      window.setTimeout(() => (suppressClick.current = false), 0)
    }
    drag.current = null
  }

  const openItem = (p: Placed, el: HTMLElement) => {
    if (suppressClick.current) return
    lastFocus.current = el
    setOpen({ item: p.item, index: p.index })
    onItemOpen?.(p.item)
  }
  const close = React.useCallback(() => {
    setOpen(null)
    window.setTimeout(() => lastFocus.current?.focus(), 0)
  }, [])

  React.useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') cam.current.tYaw = clampYaw(cam.current.tYaw + 8)
    else if (e.key === 'ArrowRight') cam.current.tYaw = clampYaw(cam.current.tYaw - 8)
    else if (e.key === 'ArrowUp') cam.current.tPitch = clampPitch(cam.current.tPitch - 4)
    else if (e.key === 'ArrowDown') cam.current.tPitch = clampPitch(cam.current.tPitch + 4)
    else return
    e.preventDefault()
  }


  return (
    <section
      ref={rootRef}
      className={cn(
        'relative isolate w-full overflow-hidden rounded-3xl bg-[#f4f3ef] text-zinc-900 ring-1 ring-black/[0.06] dark:bg-[#08080a] dark:text-white dark:ring-white/[0.07]',
        compact ? 'h-[500px]' : 'h-[540px]',
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_50%_65%,rgb(255_255_255/0.95),transparent)] dark:bg-[radial-gradient(60%_50%_at_50%_65%,rgb(56_189_248/0.12),transparent)]" />

      <div ref={headRef} className="relative z-10 px-6 pt-8 text-center sm:pt-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">{eyebrow}</p>
        <motion.h2
          initial={reduced ? false : { opacity: 0, y: 16, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'mx-auto mt-2 max-w-[16ch] text-balance bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900/35 bg-clip-text pb-1 font-semibold leading-[1.02] tracking-[-0.04em] text-transparent dark:from-white dark:via-white/90 dark:to-white/25',
            compact ? 'text-[30px]' : 'text-5xl md:text-6xl',
          )}
        >
          {title}
        </motion.h2>
        <p className="mt-2 text-[13px] text-zinc-500 dark:text-zinc-400">{subtitle}</p>
      </div>

      <div
        role="group"
        aria-roledescription="3D gallery"
        aria-label={`${title}. Use arrow keys to turn the wall.`}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={() => {
          cam.current.pYaw = 0
          cam.current.pPitch = 0
        }}
        className="absolute inset-x-0 bottom-0 cursor-grab touch-pan-y select-none [perspective:1000px] [mask-image:radial-gradient(72%_80%_at_50%_45%,black_62%,transparent)] active:cursor-grabbing"
        style={{ top: headH + (compact ? 4 : 10) }}
      >
        <div ref={worldRef} className="absolute left-1/2 top-[46%] h-0 w-0 [transform-style:preserve-3d]">
          {placed.map((p) => {
            const dist = Math.abs(p.theta * R) / (colW + gap)
            const shade = Math.min(0.55, Math.abs(p.theta) * 0.45)
            return (
              <div
                key={p.key}
                className="pointer-events-none absolute [transform-style:preserve-3d]"
                style={{
                  width: colW,
                  height: p.h,
                  left: -colW / 2,
                  top: -p.h / 2,
                  transform: `rotateY(${p.theta}rad) rotateX(${p.phi}rad) translateZ(${R}px)`,
                  backfaceVisibility: 'hidden',
                }}
              >
                <motion.div
                  className="pointer-events-none h-full w-full [transform-style:preserve-3d]"
                  initial={reduced ? false : { opacity: 0, z: -260, scale: 0.8 }}
                  animate={{ opacity: 1, z: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18, delay: reduced ? 0 : 0.2 + dist * 0.07 + (p.index % 3) * 0.04 }}
                >
                  <button
                    type="button"
                    aria-label={`Open ${p.item.title}`}
                    onClick={(e) => openItem(p, e.currentTarget)}
                    onFocus={() => {
                      cam.current.tYaw = clampYaw((-p.theta * 180) / Math.PI)
                    }}
                    className="group pointer-events-auto relative block h-full w-full rounded-xl outline-none [transform-style:preserve-3d] [backface-visibility:hidden]"
                  >
                    <span className="pointer-events-none absolute inset-0 block overflow-hidden rounded-xl bg-zinc-200 shadow-[0_10px_24px_-14px_rgb(0_0_0/0.45)] ring-1 ring-black/10 transition-[transform,box-shadow] duration-300 ease-out [backface-visibility:hidden] [transform:translateZ(0)] group-hover:shadow-[0_24px_40px_-16px_rgb(14_165_233/0.55)] group-hover:[transform:translateZ(46px)_scale(1.04)] group-focus-visible:ring-2 group-focus-visible:ring-sky-400 group-focus-visible:[transform:translateZ(46px)_scale(1.04)] dark:bg-zinc-800 dark:ring-white/10 dark:group-hover:shadow-[0_0_46px_-6px_rgb(56_189_248/0.7)]">
                      {p.item.src ? (
                        <img src={p.item.src} alt="" draggable={false} className="h-full w-full object-cover" />
                      ) : (
                        <WallArt hue={p.item.hue} seed={p.index + 1} className="h-full w-full" />
                      )}
                      <span className="absolute inset-0 bg-black transition-opacity duration-300 group-hover:opacity-0" style={{ opacity: shade * 0.5 }} />
                      <span className="absolute inset-0 rounded-xl shadow-[inset_0_1px_0_rgb(255_255_255/0.35)]" />
                      <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/70 to-transparent px-2 pb-1.5 pt-4 text-left text-[10px] font-medium text-white transition-transform duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0">
                        {p.item.title}
                      </span>
                    </span>
                  </button>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute inset-0 z-30 grid place-items-center bg-white/55 p-6 backdrop-blur-md dark:bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={open.item.title}
              onClick={(e) => e.stopPropagation()}
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.86, y: 24, rotateX: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 12 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-[0_40px_80px_-30px_rgb(0_0_0/0.45)] ring-1 ring-black/10 dark:bg-zinc-900 dark:shadow-[0_0_80px_-20px_rgb(56_189_248/0.45)] dark:ring-white/10"
            >
              <div className="aspect-[4/3] w-full">
                {open.item.src ? (
                  <img src={open.item.src} alt={open.item.title} className="h-full w-full object-cover" />
                ) : (
                  <WallArt hue={open.item.hue} seed={open.index + 1} className="h-full w-full" />
                )}
              </div>
              <div className="flex items-start justify-between gap-3 p-4">
                <div>
                  <p className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white">{open.item.title}</p>
                  {open.item.caption && <p className="mt-0.5 text-[13px] text-zinc-500 dark:text-zinc-400">{open.item.caption}</p>}
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-zinc-100 text-zinc-600 outline-none transition-colors hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-sky-400 dark:bg-white/10 dark:text-zinc-300 dark:hover:bg-white/15"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
