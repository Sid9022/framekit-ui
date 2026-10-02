import * as React from 'react'
import { ArrowDownToLine, Undo2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type TumbleLettersProps = {
  text?: string
  /** Words that get the accent ink. */
  highlight?: string
  /** Drop the letters automatically this many ms after first coming into view (0 = never). */
  autoDrop?: number
  /** px/s² */
  gravity?: number
  /** 0–0.9 floor restitution. */
  bounce?: number
  onDrop?: () => void
  onAssemble?: () => void
  className?: string
}

type Body = {
  x: number; y: number; vx: number; vy: number; a: number; va: number
  hx: number; hy: number; w: number; h: number; r: number
  loose: boolean; returning: boolean; delay: number; lift: number; grabbed: boolean
}

/**
 * Tumble Letters — a headline made of physical letters. Drop them and they
 * fall, spin, bounce and pile up against each other on the floor; grab and
 * fling any letter; press Reassemble and they spring back home in a wave.
 */
export function TumbleLetters({
  text = 'Gravity always wins',
  highlight = 'always',
  autoDrop = 0,
  gravity = 2400,
  bounce = 0.38,
  onDrop,
  onAssemble,
  className,
}: TumbleLettersProps) {
  const reduced = usePrefersReducedMotion()
  const boxRef = React.useRef<HTMLDivElement>(null)
  const spans = React.useRef<(HTMLSpanElement | null)[]>([])
  const bodies = React.useRef<Body[]>([])
  const pointer = React.useRef({ x: -9999, y: -9999, inside: false })
  const grab = React.useRef<{ i: number; ox: number; oy: number; lx: number; ly: number; lt: number; vx: number; vy: number } | null>(null)
  const [dropped, setDropped] = React.useState(false)
  const [status, setStatus] = React.useState('')
  const wake = React.useRef<() => void>(() => {})

  const words = text.split(' ')
  const hi = new Set(highlight.split(' ').filter(Boolean))
  const letters: { ch: string; word: number; hl: boolean }[] = []
  words.forEach((w, wi) => w.split('').forEach((ch) => letters.push({ ch, word: wi, hl: hi.has(w) })))

  /* measure homes */
  const measure = React.useCallback(() => {
    const box = boxRef.current
    if (!box) return
    const br = box.getBoundingClientRect()
    bodies.current = spans.current.map((el, i) => {
      const prev = bodies.current[i]
      if (!el) return prev
      const t = el.style.transform
      el.style.transform = 'none'
      const r = el.getBoundingClientRect()
      el.style.transform = t
      const w = r.width
      const h = r.height * 0.72
      return {
        x: prev?.x ?? 0, y: prev?.y ?? 0, vx: 0, vy: 0, a: prev?.a ?? 0, va: 0,
        hx: r.left - br.left, hy: r.top - br.top + r.height * 0.14, w, h, r: Math.max(8, (w + h) * 0.23),
        loose: prev?.loose ?? false, returning: false, delay: 0, lift: 0, grabbed: false,
      }
    })
  }, [])

  React.useLayoutEffect(() => {
    measure()
    const box = boxRef.current
    if (!box) return
    let cancelled = false
    document.fonts?.ready.then(() => !cancelled && measure())
    const ro = new ResizeObserver(() => {
      measure()
      wake.current()
    })
    ro.observe(box)
    return () => {
      cancelled = true
      ro.disconnect()
    }
  }, [measure, text])

  const paint = () => {
    bodies.current.forEach((b, i) => {
      const el = spans.current[i]
      if (!b || !el) return
      el.style.transform = `translate3d(${b.x.toFixed(2)}px, ${(b.y - b.lift).toFixed(2)}px, 0) rotate(${b.a.toFixed(2)}deg)`
    })
  }

  /* one physics step */
  const stepSim = (dt: number) => {
    const box = boxRef.current
    if (!box) return 0
    const W = box.clientWidth
    const H = box.clientHeight
    const floor = H - 14
    let energy = 0
    const B = bodies.current
    const constrain = (b: Body, react: boolean) => {
      const rad = (b.a * Math.PI) / 180
      const c = Math.abs(Math.cos(rad))
      const sn = Math.abs(Math.sin(rad))
      const halfH = c * b.h * 0.5 + sn * b.w * 0.5
      const halfW = c * b.w * 0.5 + sn * b.h * 0.5
      const cx = b.hx + b.x + b.w / 2
      const cy = b.hy + b.y + b.h / 2
      if (cy + halfH > floor) {
        b.y -= cy + halfH - floor
        if (react) {
          if (b.vy > 0) b.vy = -b.vy * bounce
          if (Math.abs(b.vy) < 40) b.vy = 0
          b.vx *= 0.86
          b.va = b.va * 0.6 + b.vx * 0.05
          const rest = Math.round(b.a / 90) * 90
          b.va += (rest - b.a) * 0.9
          b.va *= 0.82
        } else if (b.vy > 0) b.vy = 0
      }
      if (cx - halfW < 0) {
        b.x += halfW - cx
        b.vx = Math.abs(b.vx) * 0.5
      }
      if (cx + halfW > W) {
        b.x -= cx + halfW - W
        b.vx = -Math.abs(b.vx) * 0.5
      }
    }
    for (const b of B) {
      if (!b) continue
      // hover lift in rest
      const targetLift = !b.loose && pointer.current.inside && !reduced
        ? 12 * Math.exp(-Math.pow((pointer.current.x - (b.hx + b.w / 2)) / 46, 2)) * Math.exp(-Math.pow((pointer.current.y - (b.hy + b.h / 2)) / 90, 2))
        : 0
      b.lift += (targetLift - b.lift) * Math.min(1, dt * 14)
      energy += Math.abs(targetLift - b.lift)
      if (b.grabbed) continue
      if (b.returning) {
        if (b.delay > 0) {
          b.delay -= dt
          energy += 1
          continue
        }
        const k = 170
        const c = 17
        b.vx += (-k * b.x - c * b.vx) * dt
        b.vy += (-k * b.y - c * b.vy) * dt
        b.va += (-k * b.a - c * b.va) * dt
        b.x += b.vx * dt
        b.y += b.vy * dt
        b.a += b.va * dt
        if (Math.abs(b.x) + Math.abs(b.y) + Math.abs(b.a) < 0.4 && Math.abs(b.vx) + Math.abs(b.vy) < 4) {
          b.x = b.y = b.a = b.vx = b.vy = b.va = 0
          b.returning = false
          b.loose = false
        }
        energy += 1
        continue
      }
      if (!b.loose) continue
      if (b.delay > 0) {
        b.delay -= dt
        energy += 1
        continue
      }
      b.vy += gravity * dt
      b.vx *= 1 - 0.15 * dt
      b.x += b.vx * dt
      b.y += b.vy * dt
      b.a += b.va * dt
      constrain(b, true)
      energy += Math.abs(b.vx) + Math.abs(b.vy) + Math.abs(b.va) * 0.1
    }
    // letter ↔ letter
    for (let pass = 0; pass < 6; pass++) {
      for (let i = 0; i < B.length; i++) {
        const p = B[i]
        if (!p || !p.loose || p.returning || p.delay > 0) continue
        for (let j = i + 1; j < B.length; j++) {
          const q = B[j]
          if (!q || !q.loose || q.returning || q.delay > 0) continue
          const dx = q.hx + q.x + q.w / 2 - (p.hx + p.x + p.w / 2)
          const dy = q.hy + q.y + q.h / 2 - (p.hy + p.y + p.h / 2)
          const min = p.r + q.r
          const d2 = dx * dx + dy * dy
          if (d2 >= min * min || d2 === 0) continue
          const d = Math.sqrt(d2)
          const nx = dx / d
          const ny = dy / d
          const push = (min - d) / 2
          if (!p.grabbed) { p.x -= nx * push; p.y -= ny * push }
          if (!q.grabbed) { q.x += nx * push; q.y += ny * push }
          const rv = (q.vx - p.vx) * nx + (q.vy - p.vy) * ny
          if (rv < 0) {
            const imp = -(1 + 0.2) * rv / 2
            if (!p.grabbed) { p.vx -= imp * nx; p.vy -= imp * ny }
            if (!q.grabbed) { q.vx += imp * nx; q.vy += imp * ny }
            p.va -= imp * 0.08
            q.va += imp * 0.08
          }
        }
      }
    }
    for (const b of B) if (b && b.loose && !b.returning && !b.grabbed && b.delay <= 0) constrain(b, false)
    return energy
  }

  /* loop with sleep */
  React.useEffect(() => {
    const box = boxRef.current
    if (!box) return
    let raf = 0
    let last = 0
    let calm = 0
    let visible = true
    const loop = (now: number) => {
      const dt = Math.min(1 / 30, (now - last) / 1000 || 1 / 60)
      last = now
      const sub = 3
      let e = 0
      for (let s = 0; s < sub; s++) e = stepSim(dt / sub)
      paint()
      calm = e < 2 && !grab.current && !pointer.current.inside ? calm + 1 : 0
      if (calm > 30 || !visible) {
        raf = 0
        return
      }
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (raf || !visible || document.hidden) return
      calm = 0
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
    wake.current = start
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting
      if (visible) start()
    })
    io.observe(box)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      wake.current = () => {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gravity, bounce, reduced])

  const settleInstantly = () => {
    for (let k = 0; k < 900; k++) stepSim(1 / 120)
    paint()
  }

  const drop = () => {
    bodies.current.forEach((b, i) => {
      if (!b) return
      b.loose = true
      b.returning = false
      b.delay = reduced ? 0 : i * 0.028
      b.vx = (Math.random() - 0.5) * 260
      b.vy = -120 - Math.random() * 220
      b.va = (Math.random() - 0.5) * 720
    })
    setDropped(true)
    setStatus('Letters dropped. Drag any letter to fling it.')
    onDrop?.()
    if (reduced) settleInstantly()
    else wake.current()
  }
  const assemble = () => {
    bodies.current.forEach((b, i) => {
      if (!b) return
      b.returning = true
      b.delay = reduced ? 0 : i * 0.03
      b.vx = b.vy = b.va = 0
    })
    setDropped(false)
    setStatus('Headline reassembled.')
    onAssemble?.()
    if (reduced) {
      bodies.current.forEach((b) => {
        if (!b) return
        b.x = b.y = b.a = 0
        b.returning = b.loose = false
      })
      paint()
    } else wake.current()
  }

  /* auto drop */
  React.useEffect(() => {
    if (!autoDrop) return
    const t = window.setTimeout(drop, autoDrop)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDrop])

  const local = (e: React.PointerEvent) => {
    const r = boxRef.current!.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }
  const onDown = (i: number) => (e: React.PointerEvent) => {
    if (reduced) return
    const b = bodies.current[i]
    if (!b) return
    e.preventDefault()
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    const p = local(e)
    b.grabbed = true
    b.loose = true
    b.returning = false
    b.delay = 0
    grab.current = { i, ox: p.x - (b.hx + b.x), oy: p.y - (b.hy + b.y), lx: p.x, ly: p.y, lt: performance.now(), vx: 0, vy: 0 }
    if (!dropped) setDropped(true)
    wake.current()
  }
  const onMove = (e: React.PointerEvent) => {
    const p = local(e)
    pointer.current = { x: p.x, y: p.y, inside: true }
    const g = grab.current
    if (g) {
      const b = bodies.current[g.i]
      const now = performance.now()
      const dt = Math.max(1, now - g.lt) / 1000
      g.vx = g.vx * 0.5 + ((p.x - g.lx) / dt) * 0.5
      g.vy = g.vy * 0.5 + ((p.y - g.ly) / dt) * 0.5
      g.lx = p.x
      g.ly = p.y
      g.lt = now
      b.x = p.x - g.ox - b.hx
      b.y = p.y - g.oy - b.hy
      b.a += (g.vx * 0.01 - b.a * 0.1)
    }
    wake.current()
  }
  const onUp = () => {
    const g = grab.current
    if (!g) return
    const b = bodies.current[g.i]
    b.grabbed = false
    b.vx = Math.max(-2400, Math.min(2400, g.vx))
    b.vy = Math.max(-2400, Math.min(2400, g.vy))
    b.va = g.vx * 0.3
    grab.current = null
    wake.current()
  }

  let li = 0
  return (
    <div className={cn('flex w-full max-w-2xl flex-col items-center gap-4', className)}>
      <div
        ref={boxRef}
        onPointerMove={onMove}
        onPointerLeave={() => {
          pointer.current.inside = false
          onUp()
        }}
        onPointerUp={onUp}
        className={cn(
          'relative h-[300px] w-full select-none overflow-hidden rounded-[24px] px-6 pt-16 text-center',
          'bg-[linear-gradient(180deg,#ffffff,#f1f1ee)] ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgb(0_0_0/0.04),0_20px_40px_-28px_rgb(0_0_0/0.3)]',
          'dark:bg-[linear-gradient(180deg,#141416,#0a0a0b)] dark:ring-white/[0.07] dark:shadow-none',
        )}
      >
        <h2 className="sr-only">{text}</h2>
        <p aria-hidden className="font-display text-[clamp(40px,6.6vw,66px)] leading-[1.05] tracking-tight text-zinc-900 dark:text-zinc-50">
          {words.map((w, wi) => (
            <React.Fragment key={wi}>
              <span className="inline-block whitespace-nowrap">
                {w.split('').map((ch) => {
                  const idx = li++
                  const l = letters[idx]
                  return (
                    <span
                      key={idx}
                      ref={(el) => {
                        spans.current[idx] = el
                      }}
                      onPointerDown={onDown(idx)}
                      className={cn(
                        'inline-block cursor-grab touch-none will-change-transform active:cursor-grabbing',
                        l.hl && 'italic text-[#e0573a] dark:text-[#ff8a5c]',
                      )}
                    >
                      {ch}
                    </span>
                  )
                })}
              </span>
              {wi < words.length - 1 && ' '}
            </React.Fragment>
          ))}
        </p>
        {/* floor */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[14px] bg-gradient-to-t from-black/[0.06] to-transparent dark:from-white/[0.05]" />
        <div aria-hidden className="pointer-events-none absolute inset-x-6 bottom-[14px] h-px bg-black/10 dark:bg-white/10" />
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={dropped ? assemble : drop}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-zinc-900 px-4 text-[13px] font-medium text-white outline-none transition active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:bg-white dark:text-zinc-900 dark:focus-visible:ring-offset-zinc-950"
        >
          {dropped ? <Undo2 className="h-4 w-4" /> : <ArrowDownToLine className="h-4 w-4" />}
          {dropped ? 'Reassemble' : 'Drop letters'}
        </button>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{reduced ? 'Reduced motion: letters jump to their resting pile.' : 'Hover to lift · drag to fling'}</span>
      </div>
      <p className="sr-only" aria-live="polite">{status}</p>
    </div>
  )
}
