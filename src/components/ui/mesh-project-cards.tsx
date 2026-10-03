import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type MeshProjectStatus = 'live' | 'building' | 'shipped' | 'archived'
export type MeshProject = {
  id: string
  title: string
  blurb: string
  status: MeshProjectStatus
  tags: string[]
  /** Base hue 0–360 for the mesh. */
  hue?: number
  href?: string
}

export type MeshProjectCardsProps = {
  items?: MeshProject[]
  onSelect?: (p: MeshProject) => void
  titleAs?: 'h2' | 'h3' | 'h4'
  className?: string
}

const DEFAULT_ITEMS: MeshProject[] = [
  { id: 'm1', title: 'Fieldnotes for Trails', blurb: 'Offline-first route journal with voice memos and tide-aware planning.', status: 'building', tags: ['React', 'SQLite', 'PWA'], hue: 160 },
  { id: 'm2', title: 'Quill Pricing Lab', blurb: 'A live calculator that lets a SaaS team test packaging with customers.', status: 'live', tags: ['Next.js', 'Stripe', 'Motion', 'Postgres'], hue: 265 },
  { id: 'm3', title: 'Orbit Standups', blurb: 'Async check-ins for distributed teams, summarised into one calm page.', status: 'shipped', tags: ['TypeScript', 'tRPC'], hue: 28 },
  { id: 'm4', title: 'Pixel Pantry', blurb: 'A tiny recipe box for people who cook from memory.', status: 'archived', tags: ['Vite', 'Tailwind'], hue: 330 },
]

const STATUS: Record<MeshProjectStatus, { label: string; cls: string; dot: string }> = {
  live: { label: 'Live', cls: 'bg-emerald-50 text-emerald-950 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-50 dark:border-emerald-500/50', dot: 'bg-emerald-500' },
  building: { label: 'In progress', cls: 'bg-amber-50 text-amber-950 border-amber-300 dark:bg-amber-950/70 dark:text-amber-50 dark:border-amber-500/50', dot: 'bg-amber-500' },
  shipped: { label: 'Completed', cls: 'bg-sky-50 text-sky-950 border-sky-300 dark:bg-sky-950/70 dark:text-sky-50 dark:border-sky-500/50', dot: 'bg-sky-500' },
  archived: { label: 'Archived', cls: 'bg-zinc-100 text-zinc-900 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-600', dot: 'bg-zinc-500' },
}

function Mesh({ hue, reduced }: { hue: number; reduced: boolean }) {
  const blobs = [
    { c: `hsl(${hue} 85% 62%)`, x: '-10%', y: '-20%', s: 70, d: 11 },
    { c: `hsl(${(hue + 55) % 360} 90% 66%)`, x: '45%', y: '-10%', s: 60, d: 14 },
    { c: `hsl(${(hue + 190) % 360} 85% 60%)`, x: '10%', y: '40%', s: 65, d: 17 },
    { c: `hsl(${(hue + 320) % 360} 90% 70%)`, x: '55%', y: '35%', s: 50, d: 13 },
  ]
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden" style={{ background: `hsl(${hue} 60% 30%)` }}>
      {blobs.map((b, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full blur-2xl"
          style={{ background: b.c, left: b.x, top: b.y, width: `${b.s}%`, aspectRatio: '1' }}
          animate={reduced ? undefined : { x: [0, 28, -18, 0], y: [0, -20, 24, 0], scale: [1, 1.18, 0.92, 1] }}
          transition={{ duration: b.d, repeat: Infinity, ease: 'easeInOut', delay: -i * 3 }}
        />
      ))}
      <span className="absolute inset-0 opacity-[0.22] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
    </div>
  )
}

function ProjectCard({ p, onSelect, Title, reduced }: { p: MeshProject; onSelect?: (p: MeshProject) => void; Title: 'h2' | 'h3' | 'h4'; reduced: boolean }) {
  const px = useMotionValue(0), py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 200, damping: 20 }), sy = useSpring(py, { stiffness: 200, damping: 20 })
  const rx = useTransform(sy, [-0.5, 0.5], [6, -6]), ry = useTransform(sx, [-0.5, 0.5], [-7, 7])
  const gx = useTransform(sx, [-0.5, 0.5], ['20%', '80%']), gy = useTransform(sy, [-0.5, 0.5], ['20%', '80%'])
  const glare = useTransform([gx, gy], ([a, b]) => `radial-gradient(260px circle at ${a} ${b}, rgb(255 255 255 / 0.22), transparent 60%)`)
  const st = STATUS[p.status]
  const Tag = p.href ? 'a' : 'button'
  return (
    <div className="[perspective:900px]">
      <motion.article
        className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_18px_40px_-28px_rgb(0_0_0/0.4)] transition-shadow hover:shadow-[0_28px_50px_-26px_rgb(0_0_0/0.5)] dark:border-zinc-800 dark:bg-zinc-900"
        style={reduced ? undefined : { rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        onPointerMove={(e) => { if (e.pointerType === 'touch') return; const r = e.currentTarget.getBoundingClientRect(); px.set((e.clientX - r.left) / r.width - 0.5); py.set((e.clientY - r.top) / r.height - 0.5) }}
        onPointerLeave={() => { px.set(0); py.set(0) }}
      >
        <div className="relative h-36 sm:h-40">
          <Mesh hue={p.hue ?? 250} reduced={reduced} />
          {!reduced && <motion.span aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glare }} />}
          <span className={cn('absolute left-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider', st.cls)}>
            <span className="relative grid size-1.5 place-items-center" aria-hidden>
              {!reduced && (p.status === 'live' || p.status === 'building') && <motion.span className={cn('absolute inset-0 rounded-full', st.dot)} animate={{ scale: [1, 3], opacity: [0.7, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />}
              <span className={cn('relative size-1.5 rounded-full', st.dot)} />
            </span>
            {st.label}
          </span>
        </div>
        <div className="p-5">
          <Title className="font-display text-[1.7rem] leading-tight tracking-tight text-zinc-950 dark:text-zinc-50">
            <Tag
              {...(p.href ? { href: p.href } : { type: 'button' as const })}
              onClick={() => onSelect?.(p)}
              className="rounded-md outline-none after:absolute after:inset-0 after:content-[''] focus-visible:ring-2 focus-visible:ring-signal-600 dark:focus-visible:ring-signal-300"
            >
              {p.title}
            </Tag>
          </Title>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{p.blurb}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {p.tags.map((t) => <li key={t} className="rounded-md bg-zinc-100 px-2 py-1 font-mono text-[11px] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">{t}</li>)}
          </ul>
        </div>
        <span aria-hidden className="absolute bottom-4 right-4 grid size-10 translate-y-2 scale-75 place-items-center rounded-full bg-zinc-950 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100 dark:bg-zinc-50 dark:text-zinc-950"><ArrowUpRight className="size-[18px]" /></span>
      </motion.article>
    </div>
  )
}

/**
 * Mesh Project Cards — project cards headed by a living mesh gradient (drifting blurred blobs + film grain) with a status pill
 * that pulses for live / in-progress work. Cards tilt toward the pointer with a travelling glare; the whole card is one link.
 */
export function MeshProjectCards({ items = DEFAULT_ITEMS, onSelect, titleAs = 'h3', className }: MeshProjectCardsProps) {
  const reduced = usePrefersReducedMotion()
  return (
    <div className={cn('grid w-full max-w-4xl gap-5 sm:grid-cols-2', className)}>
      {items.map((p) => <ProjectCard key={p.id} p={p} onSelect={onSelect} Title={titleAs} reduced={reduced} />)}
    </div>
  )
}
