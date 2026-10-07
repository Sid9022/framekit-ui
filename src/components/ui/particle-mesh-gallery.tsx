import * as React from 'react'
import { motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useResolvedTheme, type ThemeMode } from '@/lib/use-resolved-theme'

export type ParticleMeshItem = {
  id: string
  title: string
  category?: string
  /** Same-origin or CORS-enabled image; cropped to a portrait. */
  src?: string
  alt?: string
  /** Changes the original generated landscape when src is omitted. */
  seed?: number
}

export type ParticleMeshGalleryProps = {
  /** Stable, unique IDs. An empty array renders an empty state. */
  items?: ParticleMeshItem[]
  /** Controlled selected item ID. */
  value?: string
  /** Initial selected item ID. */
  defaultValue?: string
  onValueChange?: (id: string) => void
  /** Controlled image/particle state. */
  revealed?: boolean
  defaultRevealed?: boolean
  onRevealedChange?: (revealed: boolean) => void
  /** Particle budget, clamped to 600–6000. */
  particleCount?: number
  /** Ambient rotation; a pause button is always available. */
  autoRotate?: boolean
  theme?: ThemeMode
  /** Accessible gallery name. */
  label?: string
  className?: string
}

const DEFAULT_ITEMS: ParticleMeshItem[] = [
  { id: 'tidal', title: 'Tidal memory', category: 'Landscape study / 01', seed: 1 },
  { id: 'dune', title: 'The quiet distance', category: 'Landscape study / 02', seed: 4 },
  { id: 'blue', title: 'After the rain', category: 'Landscape study / 03', seed: 8 },
]

/** Original, deterministic canvas art. No remote assets or additional registry files. */
function makeArtwork(seed: number) {
  const canvas = document.createElement('canvas')
  canvas.width = 480; canvas.height = 600
  const ctx = canvas.getContext('2d')!
  const hue = (seed * 29 + 160) % 360
  const sky = ctx.createLinearGradient(0, 0, 0, 600)
  sky.addColorStop(0, `hsl(${hue} 32% 20%)`)
  sky.addColorStop(0.6, `hsl(${hue + 25} 28% 70%)`)
  sky.addColorStop(1, `hsl(${hue} 20% 18%)`)
  ctx.fillStyle = sky; ctx.fillRect(0, 0, 480, 600)
  const glow = ctx.createRadialGradient(320, 190, 2, 320, 190, 160)
  glow.addColorStop(0, '#fff1ce'); glow.addColorStop(0.18, '#efdfb0'); glow.addColorStop(1, 'transparent')
  ctx.fillStyle = glow; ctx.fillRect(0, 0, 480, 600)
  for (let layer = 0; layer < 7; layer++) {
    ctx.beginPath(); ctx.moveTo(0, 600)
    for (let x = 0; x <= 480; x += 3) {
      const y = 290 + layer * 43 + Math.sin(x / 110 + seed + layer * 0.8) * (42 - layer * 3) + Math.cos(x / 53 + layer) * 12
      ctx.lineTo(x, y)
    }
    ctx.lineTo(480, 600); ctx.closePath()
    ctx.fillStyle = `hsl(${hue + layer * 3} ${24 + layer * 2}% ${42 - layer * 4}%)`; ctx.fill()
  }
  // Fine deterministic grain gives the sampled particles a photographic texture.
  let random = seed + 17
  for (let i = 0; i < 18000; i++) {
    random = (random * 1664525 + 1013904223) >>> 0
    const x = random % 480
    random = (random * 1664525 + 1013904223) >>> 0
    ctx.fillStyle = i % 2 ? '#ffffff0b' : '#0000000b'; ctx.fillRect(x, random % 600, 1, 1)
  }
  return canvas
}

function Mesh({ item, revealed, reduced, paused, count, dark }: {
  item: ParticleMeshItem; revealed: boolean; reduced: boolean; paused: boolean; count: number; dark: boolean
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const progress = React.useRef({ value: revealed ? 1 : 0, velocity: 0, angle: 0 })
  const [asset, setAsset] = React.useState<{ canvas: HTMLCanvasElement; failed: boolean; loading: boolean } | null>(null)

  React.useEffect(() => {
    let disposed = false
    const fallback = makeArtwork(Number.isFinite(item.seed) ? item.seed! : 1)
    queueMicrotask(() => { if (!disposed) setAsset({ canvas: fallback, failed: false, loading: !!item.src }) })
    if (!item.src) return () => { disposed = true }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      if (disposed) return
      const canvas = document.createElement('canvas'); canvas.width = 480; canvas.height = 600
      const ctx = canvas.getContext('2d')!
      const scale = Math.max(480 / img.width, 600 / img.height)
      try {
        ctx.drawImage(img, (480 - img.width * scale) / 2, (600 - img.height * scale) / 2, img.width * scale, img.height * scale)
        ctx.getImageData(0, 0, 1, 1) // Validate CORS before sampling.
        setAsset({ canvas, failed: false, loading: false })
      } catch { setAsset({ canvas: fallback, failed: true, loading: false }) }
    }
    img.onerror = () => { if (!disposed) setAsset({ canvas: fallback, failed: true, loading: false }) }
    img.src = item.src
    return () => { disposed = true; img.onload = null; img.onerror = null }
  }, [item.src, item.seed])

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !asset) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const cols = Math.round(Math.sqrt(count * 0.8)), rows = Math.round(cols / 0.8)
    const pixels = asset.canvas.getContext('2d')!.getImageData(0, 0, 480, 600).data
    const points = Array.from({ length: cols * rows }, (_, i) => {
      const u = (i % cols + 0.5) / cols, v = (Math.floor(i / cols) + 0.5) / rows
      const offset = (Math.floor(v * 600) * 480 + Math.floor(u * 480)) * 4
      const y = 1 - 2 * (i + 0.5) / (cols * rows), r = Math.sqrt(1 - y * y), a = i * 2.399963
      return { u, v, x: Math.cos(a) * r, y, z: Math.sin(a) * r, rx: 0, rz: 0, color: `rgb(${pixels[offset]} ${pixels[offset + 1]} ${pixels[offset + 2]})` }
    })
    let raf = 0, visible = true, last = 0, width = 0, height = 0
    const draw = (dt: number) => {
      const state = progress.current, target = revealed ? 1 : 0
      if (reduced) { state.value = target; state.velocity = 0 }
      else {
        // Substeps keep this critically damped scene spring stable on slow frames.
        for (let i = 0; i < 4; i++) {
          state.velocity += ((target - state.value) * 110 - state.velocity * 21) * dt / 4
          state.value += state.velocity * dt / 4
        }
      }
      const settled = Math.abs(target - state.value) < 0.001 && Math.abs(state.velocity) < 0.001
      if (settled) { state.value = target; state.velocity = 0 }
      if (!paused && !reduced) state.angle += dt * 0.16 * (1 - state.value)
      const p = Math.max(0, Math.min(1, state.value)), radius = Math.min(width * 0.36, height * 0.37)
      const imageH = Math.min(height * 0.88, width * 0.95), imageW = imageH * 0.8
      ctx.clearRect(0, 0, width, height)
      if (reduced || p > 0.88) {
        ctx.save()
        ctx.globalAlpha = reduced ? 1 : (p - 0.88) / 0.12
        if (reduced && !revealed) { ctx.beginPath(); ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2); ctx.clip() }
        ctx.drawImage(asset.canvas, (width - imageW) / 2, (height - imageH) / 2, imageW, imageH)
        ctx.restore()
      }
      if (!reduced && p < 1) {
        const cos = Math.cos(state.angle), sin = Math.sin(state.angle)
        for (const point of points) { point.rx = point.x * cos + point.z * sin; point.rz = point.z * cos - point.x * sin }
        points.sort((a, b) => a.rz - b.rz)
        for (const point of points) {
          const perspective = 2.8 / (2.8 - point.rz * 0.35)
          const sx = point.rx * radius * perspective, sy = point.y * radius * perspective
          const x = width / 2 + sx * (1 - p) + (point.u - 0.5) * imageW * p
          const y = height / 2 + sy * (1 - p) + (point.v - 0.5) * imageH * p
          const size = (0.65 + (point.rz + 1) * 0.48) * (1 - p) + imageW / cols * 0.56 * p
          ctx.globalAlpha = (0.42 + (point.rz + 1) * 0.27) * (1 - Math.max(0, (p - 0.88) / 0.12))
          ctx.fillStyle = point.color
          ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill()
          if (dark && p < 0.7) { ctx.globalAlpha *= 0.2; ctx.fillStyle = '#ffffff'; ctx.fill() }
        }
        ctx.globalAlpha = 1
      }
      return !reduced && (!settled || (!paused && !revealed))
    }
    const stop = () => { cancelAnimationFrame(raf); raf = 0 }
    const loop = (now: number) => { raf = 0; const again = draw(Math.min(0.04, (now - last) / 1000)); last = now; if (again && visible && !document.hidden) raf = requestAnimationFrame(loop) }
    const start = () => { if (!raf && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop) } }
    const resize = () => {
      const rect = canvas.getBoundingClientRect(); width = rect.width; height = rect.height
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(0); start()
    }
    const observer = new ResizeObserver(resize); observer.observe(canvas)
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); else stop() }); intersection.observe(canvas)
    const visibility = () => { if (document.hidden) stop(); else start() }
    document.addEventListener('visibilitychange', visibility); resize()
    return () => { stop(); observer.disconnect(); intersection.disconnect(); document.removeEventListener('visibilitychange', visibility) }
  }, [asset, count, dark, paused, reduced, revealed])

  return <>
    <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />
    {revealed && <span className="sr-only">{asset?.failed ? 'Generated landscape preview' : item.alt ?? item.title}</span>}
    <span role="status" aria-live="polite" className="absolute inset-x-4 bottom-2 text-center text-xs text-zinc-600 dark:text-zinc-300">{asset?.loading ? 'Loading artwork…' : asset?.failed ? 'Image unavailable. Showing generated artwork.' : ''}</span>
  </>
}

/** A rotating point-cloud globe unfolds into a portrait, then gathers back into a sphere. */
export function ParticleMeshGallery({ items = DEFAULT_ITEMS, value, defaultValue, onValueChange, revealed: revealedProp, defaultRevealed = false, onRevealedChange, particleCount = 4200, autoRotate = true, theme = 'auto', label = 'Selected work', className }: ParticleMeshGalleryProps) {
  const root = React.useRef<HTMLElement>(null)
  const resolved = useResolvedTheme(root, theme), reduced = usePrefersReducedMotion()
  const [inner, setInner] = React.useState(defaultValue ?? items[0]?.id)
  const [innerRevealed, setInnerRevealed] = React.useState(defaultRevealed)
  const [paused, setPaused] = React.useState(false)
  const [status, setStatus] = React.useState('')
  const lastTap = React.useRef(0)
  const index = Math.max(0, items.findIndex(item => item.id === (value ?? inner)))
  const item = items[index], revealed = revealedProp ?? innerRevealed
  const count = Number.isFinite(particleCount) ? Math.round(Math.max(600, Math.min(6000, particleCount))) : 4200
  const reveal = (next: boolean) => {
    if (revealedProp === undefined) setInnerRevealed(next)
    onRevealedChange?.(next)
    setStatus(`${item?.title ?? 'Artwork'}: ${next ? 'image revealed' : 'particle sphere'}.`)
  }
  const select = (next: number) => {
    if (!items.length) return
    const selected = items[(next + items.length) % items.length]
    if (value === undefined) setInner(selected.id)
    onValueChange?.(selected.id); lastTap.current = 0
    setStatus(`${selected.title}, ${(next + items.length) % items.length + 1} of ${items.length}.`)
  }
  const button = 'inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-zinc-300 px-3 text-sm text-zinc-800 transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-600 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:focus-visible:ring-signal-300'
  return <section ref={root} aria-label={label} className={cn(theme !== 'auto' && theme, 'w-full min-w-0 max-w-3xl', className)}>
    <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50 text-zinc-950 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="flex items-center justify-between gap-4 px-6 pt-5">
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-600 dark:text-zinc-400">{label}</span>
        <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400">{items.length ? String(index + 1).padStart(2, '0') : '00'} / {String(items.length).padStart(2, '0')}</span>
      </div>
      {item ? <>
        <button type="button" aria-label={`${item.title}: ${revealed ? 'image shown; double tap to reform particles' : 'tap to reveal image'}`} aria-pressed={revealed}
          onClick={event => {
            if (event.detail === 0) { reveal(!revealed); return }
            const now = performance.now()
            if (lastTap.current && now - lastTap.current < 350) { reveal(false); lastTap.current = 0 }
            else { reveal(true); lastTap.current = now }
          }}
          onKeyDown={event => {
            if (event.key === 'Escape') { event.preventDefault(); reveal(false) }
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); select(index + (event.key === 'ArrowRight' ? 1 : -1)) }
          }}
          className="relative block h-[340px] w-full touch-manipulation cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-signal-600 sm:h-[420px] dark:focus-visible:ring-signal-300">
          <Mesh key={item.id} item={item} revealed={revealed} reduced={reduced} paused={paused || !autoRotate} count={count} dark={resolved === 'dark'} />
        </button>
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0"><p className="text-xs text-zinc-600 dark:text-zinc-400">{item.category ?? 'Selected project'}</p>
              <motion.p key={item.id} initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 28 }} className="mt-1 break-words font-display text-3xl sm:text-4xl">{item.title}</motion.p>
            </div>
            <div className="flex shrink-0 gap-1"><button type="button" className={button} disabled={items.length < 2} aria-label="Previous artwork" onClick={() => select(index - 1)}><ArrowLeft size={16} aria-hidden /></button><button type="button" className={button} disabled={items.length < 2} aria-label="Next artwork" onClick={() => select(index + 1)}><ArrowRight size={16} aria-hidden /></button></div>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <p className="text-xs text-zinc-600 dark:text-zinc-400">{revealed ? 'Double tap to gather the particles.' : 'A little curiosity. Tap to reveal.'}</p>
            <div className="flex gap-2"><button type="button" className={button} onClick={() => reveal(!revealed)}><RotateCcw size={14} aria-hidden />{revealed ? 'Reform' : 'Reveal'}</button>
              {!reduced && autoRotate && <button type="button" className={button} aria-label={paused ? 'Resume rotation' : 'Pause rotation'} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <Play size={14} aria-hidden /> : <Pause size={14} aria-hidden />}</button>}
            </div>
          </div>
        </div>
      </> : <p className="p-12 text-center text-sm text-zinc-600 dark:text-zinc-400">No artwork yet. Add items to start your gallery.</p>}
    </div>
    <span role="status" aria-live="polite" className="sr-only">{status}</span>
  </section>
}
