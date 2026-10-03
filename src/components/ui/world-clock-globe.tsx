import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useResolvedTheme, type ThemeMode } from '@/lib/use-resolved-theme'
import { handleTablistKeys } from '@/lib/roving'

export type GlobeCity = { id: string; name: string; /** IANA time zone */ tz: string; lat: number; lon: number; note?: string }

export type WorldClockGlobeProps = {
  cities?: GlobeCity[]
  /** Selected city id (controlled). */
  value?: string
  defaultValue?: string
  onValueChange?: (id: string) => void
  /** Hours considered "daytime" for the badge (local). */
  theme?: ThemeMode
  className?: string
}

const DEFAULT_CITIES: GlobeCity[] = [
  { id: 'lis', name: 'Lisbon', tz: 'Europe/Lisbon', lat: 38.7, lon: -9.1, note: 'Home base' },
  { id: 'nyc', name: 'New York', tz: 'America/New_York', lat: 40.7, lon: -74, note: 'Client overlap' },
  { id: 'sao', name: 'São Paulo', tz: 'America/Sao_Paulo', lat: -23.5, lon: -46.6, note: 'Design partner' },
  { id: 'nbo', name: 'Nairobi', tz: 'Africa/Nairobi', lat: -1.3, lon: 36.8, note: 'Field research' },
  { id: 'bom', name: 'Mumbai', tz: 'Asia/Kolkata', lat: 19.1, lon: 72.9, note: 'Dev collective' },
  { id: 'tyo', name: 'Tokyo', tz: 'Asia/Tokyo', lat: 35.7, lon: 139.7, note: 'Studio visits' },
]

const RAD = Math.PI / 180
function hash3(x: number, y: number, z: number) {
  let h = Math.imul(Math.round(x) * 374761393 + Math.round(y) * 668265263 + Math.round(z) * 1274126177, 1103515245)
  h = (h ^ (h >>> 13)) >>> 0
  return (Math.imul(h, 1274126177) >>> 0) / 4294967296
}
function vnoise(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z)
  const xf = x - xi, yf = y - yi, zf = z - zi
  const s = (t: number) => t * t * (3 - 2 * t)
  const u = s(xf), v = s(yf), w = s(zf)
  let r = 0
  for (let dx = 0; dx < 2; dx++) for (let dy = 0; dy < 2; dy++) for (let dz = 0; dz < 2; dz++) {
    r += hash3(xi + dx, yi + dy, zi + dz) * (dx ? u : 1 - u) * (dy ? v : 1 - v) * (dz ? w : 1 - w)
  }
  return r
}
const sph = (lat: number, lon: number): [number, number, number] => [Math.cos(lat * RAD) * Math.cos(lon * RAD), Math.sin(lat * RAD), Math.cos(lat * RAD) * Math.sin(lon * RAD)]

function buildDots(cities: GlobeCity[], n = 1700) {
  const pts: { p: [number, number, number]; land: boolean }[] = []
  const ga = Math.PI * (3 - Math.sqrt(5))
  const cs = cities.map((c) => sph(c.lat, c.lon))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const th = ga * i
    const p: [number, number, number] = [Math.cos(th) * r, y, Math.sin(th) * r]
    let f = vnoise(p[0] * 2.3 + 11, p[1] * 2.3, p[2] * 2.3) * 0.62 + vnoise(p[0] * 5.1, p[1] * 5.1 + 7, p[2] * 5.1) * 0.3 + vnoise(p[0] * 11, p[1] * 11, p[2] * 11 + 3) * 0.08
    for (const c of cs) { const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2; f += 0.38 * Math.exp(-d / 0.035) }
    pts.push({ p, land: f > 0.6 && Math.abs(p[1]) < 0.93 })
  }
  return pts
}

function subSolar(now: Date): [number, number] {
  const doy = (Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - Date.UTC(now.getUTCFullYear(), 0, 0)) / 86400000
  const decl = 23.44 * Math.sin(((2 * Math.PI) / 365) * (doy - 81))
  const h = now.getUTCHours() + now.getUTCMinutes() / 60
  return [decl, -(h - 12) * 15]
}

function fmt(tz: string, now: Date) {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).formatToParts(now)
    const h = Number(parts.find((p) => p.type === 'hour')!.value) % 24
    const m = parts.find((p) => p.type === 'minute')!.value
    const day = new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: tz }).format(now)
    return { text: `${String(h).padStart(2, '0')}:${m}`, hour: h, day }
  } catch {
    return { text: '--:--', hour: 12, day: '' }
  }
}

/**
 * World Clock Globe — a dotted planet rotated by drag or by choosing a city, lit by the real sun: the night
 * side dims along a live terminator while every city card ticks its own local time. Canvas 2D, no tiles, no images.
 */
export function WorldClockGlobe({ cities = DEFAULT_CITIES, value, defaultValue, onValueChange, theme = 'auto', className }: WorldClockGlobeProps) {
  const reduced = usePrefersReducedMotion()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const resolved = useResolvedTheme(rootRef, theme)
  const [inner, setInner] = React.useState(defaultValue ?? cities[0].id)
  const sel = value ?? inner
  const city = cities.find((c) => c.id === sel) ?? cities[0]
  const [now, setNow] = React.useState(() => new Date())
  const dots = React.useMemo(() => buildDots(cities), [cities])
  const state = React.useRef({ yaw: -city.lon, pitch: city.lat * 0.6, dragging: false, lastX: 0, lastY: 0, target: { yaw: -city.lon, pitch: city.lat * 0.6 }, idle: 0 })

  React.useEffect(() => { const t = window.setInterval(() => setNow(new Date()), 15000); return () => window.clearInterval(t) }, [])
  React.useEffect(() => { state.current.target = { yaw: -city.lon, pitch: Math.max(-35, Math.min(45, city.lat * 0.7)) }; state.current.idle = 0 }, [city])
  const nowRef = React.useRef(now); nowRef.current = now
  const dark = resolved === 'dark'

  React.useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let raf = 0, visible = true, size = 0, dpr = 1
    const resize = () => { const r = canvas.getBoundingClientRect(); size = r.width; dpr = Math.min(2, window.devicePixelRatio || 1); canvas.width = Math.round(size * dpr); canvas.height = Math.round(size * dpr) }
    resize()
    const ro = new ResizeObserver(resize); ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0 }); io.observe(canvas)
    const pal = dark
      ? { land: [196, 181, 253], ocean: [90, 90, 108], rim: 'rgba(196,181,253,0.35)', glow: 'rgba(124,104,153,0.28)', ring: 'rgba(212,203,229,0.45)', pin: '#fdba74' }
      : { land: [76, 58, 110], ocean: [150, 150, 165], rim: 'rgba(77,63,94,0.35)', glow: 'rgba(185,170,208,0.4)', ring: 'rgba(77,63,94,0.5)', pin: '#c2410c' }

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame)
      if (!visible || document.hidden) return
      const st = state.current
      if (!st.dragging) {
        const k = reduced ? 1 : 0.07
        st.yaw += (st.target.yaw - st.yaw) * k
        st.pitch += (st.target.pitch - st.pitch) * k
        if (!reduced) st.target.yaw += 0.02 * (st.idle > 90 ? 1 : 0)
        st.idle++
      }
      const [decl, sunLon] = subSolar(nowRef.current)
      const sun = sph(decl, sunLon)
      const s = size, R = s * 0.36, cx = s / 2, cy = s / 2
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, s, s)
      // glow
      const g = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.5)
      g.addColorStop(0, pal.glow); g.addColorStop(1, 'transparent')
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 1.5, 0, 7); ctx.fill()
      // 24h ring
      ctx.strokeStyle = pal.ring; ctx.lineWidth = 1
      for (let h = 0; h < 24; h++) {
        const a = (h / 24) * Math.PI * 2 - Math.PI / 2
        const l = h % 6 === 0 ? 11 : 5
        ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * (R * 1.2), cy + Math.sin(a) * (R * 1.2)); ctx.lineTo(cx + Math.cos(a) * (R * 1.2 + l), cy + Math.sin(a) * (R * 1.2 + l)); ctx.stroke()
      }
      // sun marker on ring (hour of the city's local noon)
      const lh = fmt(city.tz, nowRef.current)
      const hourFrac = (lh.hour + Number(lh.text.slice(3)) / 60) / 24
      const ha = hourFrac * Math.PI * 2 - Math.PI / 2
      ctx.fillStyle = pal.pin
      ctx.beginPath(); ctx.arc(cx + Math.cos(ha) * (R * 1.2 + 18), cy + Math.sin(ha) * (R * 1.2 + 18), 4, 0, 7); ctx.fill()
      // rotate
      const yaw = st.yaw * RAD, pitch = st.pitch * RAD
      const cyaw = Math.cos(yaw), syaw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch)
      const proj = (p: [number, number, number]): [number, number, number] => {
        const x1 = p[0] * cyaw + p[2] * syaw, z1 = -p[0] * syaw + p[2] * cyaw
        const y2 = p[1] * cp - z1 * sp, z2 = p[1] * sp + z1 * cp
        return [x1, y2, z2]
      }
      // disc
      ctx.fillStyle = dark ? 'rgba(20,18,28,0.85)' : 'rgba(255,255,255,0.8)'
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill()
      for (const d of dots) {
        const [x, y, z] = proj(d.p)
        if (z < 0.02) continue
        const lit = d.p[0] * sun[0] + d.p[1] * sun[1] + d.p[2] * sun[2]
        const day = Math.max(0, Math.min(1, lit * 3 + 0.5))
        const c = d.land ? pal.land : pal.ocean
        const a = (d.land ? 0.35 + 0.65 * day : 0.1 + 0.18 * day) * (0.35 + 0.65 * z)
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`
        const r = (d.land ? 1.5 : 1) * (0.6 + 0.6 * z) * (s / 420 + 0.5)
        ctx.beginPath(); ctx.arc(cx + x * R, cy - y * R, r, 0, 7); ctx.fill()
      }
      ctx.strokeStyle = pal.rim; ctx.lineWidth = 1.2
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke()
      // city pins
      for (const c of cities) {
        const [x, y, z] = proj(sph(c.lat, c.lon))
        if (z < 0.05) continue
        const px = cx + x * R, py = cy - y * R, on = c.id === city.id
        if (on && !reduced) {
          const ph = (t / 1400) % 1
          ctx.strokeStyle = pal.pin; ctx.globalAlpha = 1 - ph; ctx.lineWidth = 1.5
          ctx.beginPath(); ctx.arc(px, py, 5 + ph * 16, 0, 7); ctx.stroke(); ctx.globalAlpha = 1
        }
        ctx.fillStyle = on ? pal.pin : dark ? '#e4dcf0' : '#4d3f5e'
        ctx.beginPath(); ctx.arc(px, py, on ? 4.5 : 3, 0, 7); ctx.fill()
        ctx.strokeStyle = dark ? '#0c0c0c' : '#fff'; ctx.lineWidth = 1.5; ctx.stroke()
      }
    }
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect() }
  }, [dots, cities, city, dark, reduced])

  const select = (id: string) => { if (value === undefined) setInner(id); onValueChange?.(id) }
  const onDown = (e: React.PointerEvent) => { const st = state.current; st.dragging = true; st.lastX = e.clientX; st.lastY = e.clientY; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId) }
  const onMove = (e: React.PointerEvent) => {
    const st = state.current
    if (!st.dragging) return
    st.yaw -= (e.clientX - st.lastX) * 0.4; st.pitch = Math.max(-60, Math.min(60, st.pitch + (e.clientY - st.lastY) * 0.3))
    st.target = { yaw: st.yaw, pitch: st.pitch }; st.lastX = e.clientX; st.lastY = e.clientY; st.idle = -300
  }
  const onUp = () => { state.current.dragging = false }
  const cur = fmt(city.tz, now)
  const daytime = cur.hour >= 6 && cur.hour < 19

  return (
    <div ref={rootRef} className={cn('grid w-full max-w-3xl items-center gap-4 rounded-3xl border border-zinc-200 bg-white p-4 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] sm:gap-6 sm:p-6 dark:border-zinc-800 dark:bg-zinc-950', className)}>
      <div className="relative mx-auto aspect-square w-full max-w-[400px] touch-none select-none">
        <canvas ref={canvasRef} aria-hidden className="h-full w-full cursor-grab active:cursor-grabbing" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} />
        <div className="pointer-events-none absolute inset-x-0 bottom-1 flex justify-center">
          <span className="rounded-full border border-zinc-200 bg-white/80 px-3 py-1 font-mono text-[11px] text-zinc-700 backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-300">drag to spin · dim side is night</span>
        </div>
      </div>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-600 dark:text-zinc-400">[ Where the sun is ]</p>
        <div role="status" aria-live="polite" className="mt-2">
          <p className="font-display text-6xl leading-none tracking-tight text-zinc-950 tabular-nums dark:text-zinc-50">{cur.text}</p>
          <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{city.name} · {cur.day} · <span className="font-medium">{daytime ? 'daytime' : 'night'}</span>{city.note ? ` · ${city.note}` : ''}</p>
        </div>
        <div role="radiogroup" aria-label="Choose a city" onKeyDown={handleTablistKeys} className="mt-4 grid grid-cols-2 gap-2">
          {cities.map((c) => {
            const f = fmt(c.tz, now), on = c.id === city.id, day = f.hour >= 6 && f.hour < 19
            return (
              <button key={c.id} type="button" role="radio" aria-checked={on} tabIndex={on ? 0 : -1} onClick={() => select(c.id)} className={cn('flex min-h-11 items-center justify-between gap-2 rounded-xl border px-3 text-left text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-signal-600 dark:focus-visible:ring-signal-300', on ? 'border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950' : 'border-zinc-200 bg-zinc-50 text-zinc-800 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600')}>
                <span className="flex items-center gap-2"><span aria-hidden className={cn('size-2 rounded-full', day ? 'bg-amber-400' : 'bg-indigo-400')} />{c.name}</span>
                <span className="font-mono text-xs tabular-nums opacity-80">{f.text}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
