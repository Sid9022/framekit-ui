import * as React from 'react'
import { motion, useInView } from 'motion/react'
import { BarChart3, Bell, CreditCard, Database, KeyRound, Pause, Play, Users, Webhook } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type BeamNode = {
  id: string
  label: string
  /** Short line announced and shown under the diagram when the node is selected. */
  detail?: string
  icon?: React.ReactNode
}

export type SignalBeamDiagramProps = {
  /** Nodes on the left that send signals into the hub. */
  sources?: BeamNode[]
  /** Nodes on the right that receive signals from the hub. */
  targets?: BeamNode[]
  /** The centre node. `icon` defaults to an abstract relay mark. */
  hub?: { label: string; detail?: string; icon?: React.ReactNode }
  /** Seconds for one pulse to travel a path. Clamped 1–8. */
  duration?: number
  /** Two colours the pulses blend between (any CSS colour). */
  colors?: [string, string]
  /** Bend of each connector, 0 (straight) – 1 (deep S-curve). */
  curvature?: number
  /** Start with pulses running. A Pause button is always shown. */
  autoPlay?: boolean
  /** Fires when a node is selected (null when cleared). */
  onSelect?: (id: string | null) => void
  className?: string
}

const DEFAULT_SOURCES: BeamNode[] = [
  { id: 'payments', label: 'Payments', detail: 'Payments → Relay: 1,284 charge events in the last hour', icon: <CreditCard /> },
  { id: 'auth', label: 'Auth', detail: 'Auth → Relay: 312 sign-ins, 4 blocked attempts', icon: <KeyRound /> },
  { id: 'analytics', label: 'Analytics', detail: 'Analytics → Relay: 18.2k page views batched every 30 s', icon: <BarChart3 /> },
  { id: 'webhooks', label: 'Webhooks', detail: 'Webhooks → Relay: 96 deliveries, p95 140 ms', icon: <Webhook /> },
]
const DEFAULT_TARGETS: BeamNode[] = [
  { id: 'warehouse', label: 'Warehouse', detail: 'Relay → Warehouse: synced 2 min ago', icon: <Database /> },
  { id: 'alerts', label: 'Alerts', detail: 'Relay → Alerts: 3 rules armed, 0 firing', icon: <Bell /> },
  { id: 'crm', label: 'CRM', detail: 'Relay → CRM: 41 contacts enriched today', icon: <Users /> },
]

function RelayMark() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className="h-8 w-8">
      <circle cx="16" cy="16" r="5" fill="currentColor" />
      <path d="M16 3a13 13 0 0 1 13 13M16 29A13 13 0 0 1 3 16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M16 8.5a7.5 7.5 0 0 1 7.5 7.5M16 23.5A7.5 7.5 0 0 1 8.5 16" stroke="currentColor" strokeOpacity=".55" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

type Path = { id: string; d: string; x1: number; x2: number; side: 'in' | 'out'; index: number }

/**
 * Signal Beam Diagram — an integration map where light travels. Sources on the left fire soft gradient pulses along
 * hairline S-curves into a glass hub, which relays them out to destinations on the right. Select any node to isolate
 * its route and read what is flowing through it; pause any time. Reduced motion shows the routes as still, tinted lines.
 */
export function SignalBeamDiagram({
  sources = DEFAULT_SOURCES,
  targets = DEFAULT_TARGETS,
  hub = { label: 'Relay', detail: 'Relay is healthy: 7 routes, 0 retries queued' },
  duration = 2.6,
  colors = ['#8b74b5', '#f97316'],
  curvature = 0.55,
  autoPlay = true,
  onSelect,
  className,
}: SignalBeamDiagramProps) {
  const reduced = usePrefersReducedMotion()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const hubRef = React.useRef<HTMLButtonElement>(null)
  const nodeRefs = React.useRef(new Map<string, HTMLElement>())
  const [paths, setPaths] = React.useState<Path[]>([])
  const [size, setSize] = React.useState({ w: 0, h: 0 })
  const [selected, setSelected] = React.useState<string | null>(null)
  const [playing, setPlaying] = React.useState(autoPlay)
  const inView = useInView(rootRef, { amount: 0.2 })
  const gid = React.useId().replace(/:/g, '')
  const dur = Math.min(8, Math.max(1, duration))
  const bend = Math.min(1, Math.max(0, curvature))

  const measure = React.useCallback(() => {
    const root = rootRef.current
    const hubEl = hubRef.current
    if (!root || !hubEl) return
    const r = root.getBoundingClientRect()
    const h = hubEl.getBoundingClientRect()
    const hx = h.left - r.left, hy = h.top - r.top + h.height / 2
    const next: Path[] = []
    const make = (n: BeamNode, i: number, side: 'in' | 'out') => {
      const el = nodeRefs.current.get(n.id)
      if (!el) return
      const b = el.getBoundingClientRect()
      const y = b.top - r.top + b.height / 2
      const x1 = side === 'in' ? b.right - r.left : hx + h.width
      const x2 = side === 'in' ? hx : b.left - r.left
      const ya = side === 'in' ? y : hy, yb = side === 'in' ? hy : y
      const dx = (x2 - x1) * bend
      next.push({ id: n.id, side, index: i, x1, x2, d: `M${x1},${ya} C${x1 + dx},${ya} ${x2 - dx},${yb} ${x2},${yb}` })
    }
    sources.forEach((n, i) => make(n, i, 'in'))
    targets.forEach((n, i) => make(n, i, 'out'))
    setSize({ w: r.width, h: r.height })
    setPaths(next)
  }, [sources, targets, bend])

  React.useLayoutEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    if (rootRef.current) ro.observe(rootRef.current)
    return () => ro.disconnect()
  }, [measure])

  const select = (id: string) => {
    const next = selected === id ? null : id
    setSelected(next)
    onSelect?.(next)
  }
  const all = [...sources, ...targets]
  const current = selected === 'hub' ? { label: hub.label, detail: hub.detail } : all.find((n) => n.id === selected)
  const running = playing && inView && !reduced
  const outDelay = dur * 0.55

  const nodeCls = () =>
    cn(
      'group flex min-h-11 w-full flex-col items-center gap-2 rounded-2xl p-1.5 text-center outline-none',
      'focus-visible:ring-2 focus-visible:ring-signal-600 dark:focus-visible:ring-signal-300',
    )
  const tileCls = (active: boolean, dim: boolean) =>
    cn(
      'grid h-12 w-12 place-items-center rounded-[14px] bg-white text-zinc-800 ring-1 ring-black/[0.07] [&_svg]:h-5 [&_svg]:w-5',
      'shadow-[inset_0_1px_0_rgb(255_255_255/0.9),0_1px_2px_rgb(0_0_0/0.06),0_10px_24px_-14px_rgb(24_24_27/0.35)]',
      'transition-[transform,box-shadow,color] duration-200 group-hover:-translate-y-0.5 group-active:scale-95 motion-reduce:transform-none',
      'dark:bg-zinc-900 dark:text-zinc-100 dark:ring-white/[0.09] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.07),0_10px_24px_-14px_rgb(0_0_0/0.8)]',
      active && 'text-signal-700 ring-2 ring-signal-500/70 dark:text-signal-200 dark:ring-signal-300/60',
      dim && 'opacity-45',
    )

  const renderNode = (n: BeamNode) => {
    const active = selected === n.id
    const dim = !!selected && selected !== 'hub' && !active
    return (
      <button
        key={n.id}
        type="button"
        ref={(el) => {
          if (el) nodeRefs.current.set(n.id, el.firstElementChild as HTMLElement)
          else nodeRefs.current.delete(n.id)
        }}
        aria-pressed={active}
        onClick={() => select(n.id)}
        className={nodeCls()}
      >
        <span className={tileCls(active, dim)}>{n.icon ?? <Webhook />}</span>
        <span className="max-w-full truncate text-xs font-medium text-zinc-700 dark:text-zinc-300">{n.label}</span>
      </button>
    )
  }

  return (
    <div
      className={cn(
        'relative w-full max-w-2xl rounded-[28px] bg-zinc-50/80 p-4 ring-1 ring-black/[0.06] sm:p-8',
        'shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_1px_2px_rgb(0_0_0/0.04),0_24px_48px_-28px_rgb(24_24_27/0.3)]',
        'dark:bg-zinc-950/60 dark:ring-white/[0.08] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]',
        className,
      )}
    >
      <div ref={rootRef} className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-6 sm:gap-16">
        <svg aria-hidden className="pointer-events-none absolute inset-0 overflow-visible" width={size.w} height={size.h} viewBox={`0 0 ${size.w || 1} ${size.h || 1}`}>
          <defs>
            {paths.map((p) => (
              <linearGradient key={p.id} id={`${gid}-${p.id}`} gradientUnits="userSpaceOnUse" x1={p.x1} x2={p.x2} y1="0" y2="0">
                <stop offset="0" stopColor={p.side === 'in' ? colors[0] : colors[1]} stopOpacity={p.side === 'in' ? 0.2 : 1} />
                <stop offset="1" stopColor={p.side === 'in' ? colors[0] : colors[1]} stopOpacity={p.side === 'in' ? 1 : 0.2} />
              </linearGradient>
            ))}
          </defs>
          {paths.map((p) => {
            const selSide = sources.some((n) => n.id === selected) ? 'in' : targets.some((n) => n.id === selected) ? 'out' : null
            const lit = !selected || selected === 'hub' || selected === p.id || (selSide !== null && selSide !== p.side)
            const focusRoute = !!selected && lit
            const delay = (p.side === 'in' ? 0 : outDelay) + p.index * (dur / 7)
            return (
              <g key={p.id} style={{ opacity: lit ? 1 : 0.18, transition: 'opacity 220ms ease-out' }}>
                <path d={p.d} fill="none" className={focusRoute ? 'stroke-signal-400 dark:stroke-signal-400/60' : 'stroke-zinc-300 dark:stroke-white/[0.12]'} strokeWidth={focusRoute ? 1.5 : 1} style={{ transition: 'stroke 200ms ease-out' }} />
                {reduced ? (
                  <path d={p.d} fill="none" stroke={`url(#${gid}-${p.id})`} strokeWidth={1.5} strokeOpacity={0.55} />
                ) : (
                  <motion.path
                    d={p.d}
                    fill="none"
                    stroke={`url(#${gid}-${p.id})`}
                    strokeWidth={2}
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="0.22 1"
                    initial={{ strokeDashoffset: 0.22 }}
                    animate={running ? { strokeDashoffset: [0.22, -1] } : { strokeDashoffset: 0.22 }}
                    transition={running ? { duration: dur, delay, ease: [0.45, 0, 0.2, 1], repeat: Infinity, repeatDelay: dur * 0.6 } : { duration: 0.2 }}
                  />
                )}
              </g>
            )
          })}
        </svg>

        <div className="relative flex flex-col gap-2 sm:gap-3">{sources.map(renderNode)}</div>

        <button
          ref={hubRef}
          type="button"
          aria-pressed={selected === 'hub'}
          onClick={() => select('hub')}
          className="group relative grid h-20 w-20 place-items-center rounded-[26px] outline-none focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-4 focus-visible:ring-offset-zinc-50 sm:h-24 sm:w-24 dark:focus-visible:ring-signal-300 dark:focus-visible:ring-offset-zinc-950"
        >
          {!reduced && (
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-[26px]"
              style={{ background: `radial-gradient(closest-side, ${colors[0]}55, transparent)` }}
              animate={running ? { scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] } : { scale: 1, opacity: 0.35 }}
              transition={{ duration: dur + dur * 0.6, repeat: running ? Infinity : 0, ease: 'easeInOut', delay: dur * 0.5 }}
            />
          )}
          <span className="relative grid h-full w-full place-items-center rounded-[26px] bg-white/75 text-zinc-900 ring-1 ring-black/[0.07] backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgb(255_255_255/0.95),0_2px_6px_rgb(0_0_0/0.06),0_24px_48px_-20px_rgb(100_82_122/0.45)] transition-transform duration-200 group-active:scale-95 motion-reduce:transform-none dark:bg-zinc-800/70 dark:text-white dark:ring-white/[0.12] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_24px_48px_-20px_rgb(0_0_0/0.9)]">
            {hub.icon ?? <RelayMark />}
            <span className="sr-only">{hub.label}</span>
          </span>
        </button>

        <div className="relative flex flex-col gap-2 sm:gap-3">{targets.map(renderNode)}</div>
      </div>

      <div className="mt-6 flex min-h-11 items-center gap-3 border-t border-black/[0.06] pt-4 dark:border-white/[0.08]">
        <p role="status" aria-live="polite" className="min-w-0 flex-1 text-pretty text-sm tabular-nums text-zinc-700 dark:text-zinc-300">
          {current?.detail ?? (
            <>
              <span className="font-medium text-zinc-950 dark:text-zinc-50">{hub.label}</span> · {sources.length} sources → {targets.length} destinations. Select a node to trace it.
            </>
          )}
        </p>
        {!reduced && (
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pause signal animation' : 'Play signal animation'}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-zinc-700 ring-1 ring-black/[0.08] transition-[background-color,transform] duration-150 hover:bg-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-600 dark:text-zinc-200 dark:ring-white/[0.1] dark:hover:bg-zinc-900 dark:focus-visible:ring-signal-300"
          >
            {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
          </button>
        )}
      </div>
    </div>
  )
}
