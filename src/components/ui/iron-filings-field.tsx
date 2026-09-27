import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useResolvedTheme, type ThemeMode } from '@/lib/use-resolved-theme'

export type IronFilingsFieldProps = {
  /** Grid spacing between filings in px (10–40). */
  spacing?: number
  /** Pointer carries a north pole; click drops alternating poles (max 4). */
  interactive?: boolean
  /** Idle poles orbit slowly when nobody is interacting. */
  drift?: boolean
  theme?: ThemeMode
  children?: React.ReactNode
  className?: string
}

type Pole = { x: number; y: number; q: number; born: number }

/**
 * Iron Filings Field — thousands of tiny steel needles scattered on paper,
 * each swinging (with a little inertia) to align with the magnetic field of
 * a few poles. The pointer carries a pole; clicking pins it and hands you the
 * opposite one, and
 * the field lines bloom around them like filings on a school desk.
 */
export function IronFilingsField({
  spacing = 16,
  interactive = true,
  drift = true,
  theme = 'auto',
  children,
  className,
}: IronFilingsFieldProps) {
  const reduced = usePrefersReducedMotion()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const resolved = useResolvedTheme(rootRef, theme)
  const P = React.useRef({ x: 0, y: 0, inside: false, dropped: [] as Pole[], lastMove: 0, carry: 1 })
  const [count, setCount] = React.useState(0)
  const [msg, setMsg] = React.useState('')

  React.useEffect(() => {
    const canvas = canvasRef.current
    const root = rootRef.current
    if (!canvas || !root) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dark = resolved === 'dark'
    const gap = Math.max(10, Math.min(40, spacing))
    let W = 0
    let H = 0
    let dpr = 1
    let filings: { x: number; y: number; a: number; va: number; j: number; l: number }[] = []
    const build = () => {
      const r = root.getBoundingClientRect()
      W = r.width
      H = r.height
      dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      filings = []
      for (let y = gap / 2; y < H; y += gap)
        for (let x = gap / 2; x < W; x += gap) {
          const jx = (Math.random() - 0.5) * gap * 0.7
          const jy = (Math.random() - 0.5) * gap * 0.7
          filings.push({ x: x + jx, y: y + jy, a: Math.random() * Math.PI, va: 0, j: Math.random(), l: 0.55 + Math.random() * 0.6 })
        }
    }
    build()
    let t = Math.random() * 10

    const poles = (): Pole[] => {
      const p = P.current
      const list: Pole[] = []
      const idle = !p.inside || performance.now() - p.lastMove > 6000
      const cx = W / 2
      const cy = H / 2
      const R = Math.min(W, H) * 0.24
      if (p.inside && interactive) {
        // the carried pole fades in as you move away from the pole you just pinned
        const lastDrop = p.dropped[p.dropped.length - 1]
        const k = lastDrop ? Math.min(1, Math.hypot(p.x - lastDrop.x, p.y - lastDrop.y) / 120) : 1
        list.push({ x: p.x, y: p.y, q: p.carry * k, born: 0 })
      }
      else list.push({ x: cx + Math.cos(t * 0.35) * R * 1.3, y: cy + Math.sin(t * 0.5) * R * 0.7, q: 1, born: 0 })
      if (p.dropped.length === 0 || idle) {
        list.push({ x: cx - Math.cos(t * 0.35) * R * 1.1, y: cy - Math.sin(t * 0.42) * R * 0.8, q: -1, born: 0 })
      }
      return list.concat(p.dropped)
    }

    const frame = (dt: number) => {
      if (drift || reduced) t += dt
      const ps = poles()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)
      // pole halos
      for (const p of ps) {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 120)
        const col = p.q > 0 ? (dark ? '255,120,90' : '230,90,60') : dark ? '90,160,255' : '60,110,220'
        g.addColorStop(0, `rgba(${col},${dark ? 0.22 : 0.16})`)
        g.addColorStop(1, `rgba(${col},0)`)
        ctx.fillStyle = g
        ctx.fillRect(p.x - 120, p.y - 120, 240, 240)
      }
      ctx.lineCap = 'round'
      const len = gap * 0.62
      for (const f of filings) {
        let bx = 0
        let by = 0
        let warm = 0
        for (const p of ps) {
          const dx = f.x - p.x
          const dy = f.y - p.y
          const d2 = dx * dx + dy * dy + 400
          const k = p.q / d2
          bx += dx * k
          by += dy * k
          warm += (p.q > 0 ? 1 : -1) * 2200 / d2
        }
        const mag = Math.sqrt(bx * bx + by * by)
        const target = Math.atan2(by, bx)
        // needles are symmetric: pick the nearest equivalent orientation
        let diff = target - f.a
        diff = ((diff + Math.PI / 2) % Math.PI + Math.PI) % Math.PI - Math.PI / 2
        if (reduced) {
          f.a += diff
        } else {
          f.va += diff * (40 + Math.min(80, mag * 9000)) * dt
          f.va *= Math.pow(0.0008, dt)
          f.a += f.va * dt
        }
        const strength = Math.min(1, Math.log10(1 + mag * 12000) / 1.6)
        const L = len * f.l * (0.55 + 0.6 * strength)
        const cx = Math.cos(f.a) * L * 0.5
        const cy = Math.sin(f.a) * L * 0.5
        const alpha = 0.18 + 0.72 * strength
        if (dark) {
          const w = Math.max(-1, Math.min(1, warm))
          const r = 170 + w * 70
          const b = 190 - w * 40
          ctx.strokeStyle = `rgba(${r | 0},${(180 + Math.abs(w) * 20) | 0},${b | 0},${alpha})`
        } else {
          ctx.strokeStyle = `rgba(40,42,${(50 + f.j * 20) | 0},${alpha * 0.85})`
        }
        ctx.lineWidth = 1 + f.j * 0.6
        ctx.beginPath()
        ctx.moveTo(f.x - cx, f.y - cy)
        ctx.lineTo(f.x + cx, f.y + cy)
        ctx.stroke()
      }
      // pole markers
      for (const p of ps) {
        const age = p.born ? Math.min(1, (performance.now() - p.born) / 500) : 1
        const r = 7 + (1 - age) * 18
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fillStyle = p.q > 0 ? (dark ? '#ff7a5c' : '#e5593b') : dark ? '#5aa0ff' : '#3b6fd8'
        ctx.globalAlpha = 0.25 + 0.75 * age
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.fillStyle = '#fff'
        ctx.font = '600 9px ui-monospace, monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(p.q > 0 ? 'N' : 'S', p.x, p.y + 0.5)
      }
    }

    const ro = new ResizeObserver(() => {
      build()
      if (reduced) frame(0)
    })
    ro.observe(root)
    if (reduced) {
      frame(0)
      const onChange = () => frame(0)
      root.addEventListener('pointerdown', onChange)
      return () => {
        ro.disconnect()
        root.removeEventListener('pointerdown', onChange)
      }
    }
    let raf = 0
    let last = performance.now()
    let visible = true
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      frame(dt)
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (!raf && visible && !document.hidden) {
        last = performance.now()
        raf = requestAnimationFrame(loop)
      }
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(root)
    const vis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', vis)
    start()
    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', vis)
    }
  }, [resolved, reduced, spacing, interactive, drift])

  const local = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }
  const drop = (x: number, y: number) => {
    const d = P.current.dropped
    const q = P.current.carry
    P.current.carry = -q
    d.push({ x, y, q, born: performance.now() })
    if (d.length > 4) d.shift()
    setCount(d.length)
    setMsg(`${q > 0 ? 'North' : 'South'} pole pinned; you now carry a ${q > 0 ? 'south' : 'north'} pole. ${d.length} of 4.`)
  }
  const clear = () => {
    P.current.dropped = []
    P.current.carry = 1
    setCount(0)
    setMsg('Poles cleared.')
  }

  return (
    <div
      ref={rootRef}
      onPointerMove={(e) => {
        if (!interactive) return
        const p = local(e)
        Object.assign(P.current, { x: p.x, y: p.y, inside: true, lastMove: performance.now() })
      }}
      onPointerLeave={() => (P.current.inside = false)}
      onPointerDown={(e) => {
        if (!interactive || (e.target as HTMLElement).closest('button,a,input')) return
        const p = local(e)
        drop(p.x, p.y)
      }}
      onDoubleClick={(e) => {
        if ((e.target as HTMLElement).closest('button,a,input')) return
        clear()
      }}
      className={cn(
        'relative isolate h-[420px] w-full overflow-hidden rounded-[24px] ring-1',
        resolved === 'dark'
          ? 'bg-[radial-gradient(120%_90%_at_50%_40%,#17181c,#0a0a0c)] ring-white/[0.06]'
          : 'bg-[radial-gradient(120%_90%_at_50%_40%,#fbfaf6,#efece4)] ring-black/[0.06]',
        interactive && 'cursor-crosshair',
        className,
      )}
    >
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05] [background-image:radial-gradient(rgb(0_0_0)_0.5px,transparent_0.6px)] [background-size:3px_3px]" />
      {children}
      {interactive && (
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className={cn('font-mono text-[10px] uppercase tracking-[0.16em]', resolved === 'dark' ? 'text-zinc-500' : 'text-zinc-500')}>
            {count}/4 poles
          </span>
          <button
            type="button"
            onClick={() => {
              const r = rootRef.current!.getBoundingClientRect()
              drop(r.width * (0.25 + Math.random() * 0.5), r.height * (0.25 + Math.random() * 0.5))
            }}
            className={cn(
              'rounded-full px-3 py-1.5 text-[11px] font-medium outline-none ring-1 backdrop-blur transition focus-visible:ring-2 focus-visible:ring-orange-500',
              resolved === 'dark' ? 'bg-white/5 text-zinc-200 ring-white/10 hover:bg-white/10' : 'bg-white/70 text-zinc-700 ring-black/10 hover:bg-white',
            )}
          >
            Drop pole
          </button>
          <button
            type="button"
            onClick={clear}
            disabled={count === 0}
            className={cn(
              'rounded-full px-3 py-1.5 text-[11px] font-medium outline-none ring-1 backdrop-blur transition focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-40',
              resolved === 'dark' ? 'bg-white/5 text-zinc-200 ring-white/10 hover:bg-white/10' : 'bg-white/70 text-zinc-700 ring-black/10 hover:bg-white',
            )}
          >
            Reset
          </button>
        </div>
      )}
      <p className="sr-only" aria-live="polite">{msg}</p>
    </div>
  )
}
