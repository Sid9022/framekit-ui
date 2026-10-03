import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type ClientLogo = { name: string; /** 0–7: which generated mark to draw. */ mark?: number; href?: string }

export type ClientLogoStripProps = {
  clients?: ClientLogo[]
  heading?: string
  className?: string
}

const DEFAULT_CLIENTS: ClientLogo[] = ['Kiln', 'Orbita', 'Halcyon', 'Marrow', 'Tessel', 'Oakline', 'Vantage', 'Sable'].map((name, mark) => ({ name, mark }))

/** Eight original geometric marks (not real brands). */
function Mark({ n }: { n: number }) {
  const p = { fill: 'currentColor' }
  switch (n % 8) {
    case 0: return <g {...p}><path d="M4 22V10l10-6 10 6v12z" opacity=".35" /><path d="M9 22v-8l5-3 5 3v8z" /></g>
    case 1: return <g fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="14" cy="14" r="9" /><ellipse cx="14" cy="14" rx="9" ry="3.6" transform="rotate(-30 14 14)" /></g>
    case 2: return <g {...p}><circle cx="14" cy="14" r="10" opacity=".3" /><path d="M14 4a10 10 0 0 1 0 20z" /></g>
    case 3: return <g {...p}><path d="M3 22 9 6l5 10 5-10 6 16h-4l-2-6-5 10-5-10-2 6z" /></g>
    case 4: return <g {...p}>{[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={4 + c * 8} y={4 + r * 8} width="6" height="6" rx={(r + c) % 2 ? 3 : 1} opacity={(r + c) % 2 ? 0.45 : 1} />))}</g>
    case 5: return <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M14 24V12M14 12c0-5-4-7-8-7 0 5 3 7 8 7zm0 4c0-4 3-6 8-6 0 4-3 6-8 6z" /></g>
    case 6: return <g {...p}><path d="M14 3 25 24H3z" opacity=".3" /><path d="M14 11l5 10H9z" /></g>
    default: return <g {...p}><path d="M5 14c0-6 4-9 9-9 0 5-2 9-9 9zm18 0c0 6-4 9-9 9 0-5 2-9 9-9z" /></g>
  }
}

/**
 * Client Logo Strip — a calm trust row of generated marks. A cursor-following spotlight lights hairline borders and
 * tints the mark under it; marks lift and spin a few degrees on hover/focus. Replace the generated marks with real SVGs.
 */
export function ClientLogoStrip({ clients = DEFAULT_CLIENTS, heading = 'Trusted by teams who care about craft', className }: ClientLogoStripProps) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLUListElement>(null)
  const move = (e: React.PointerEvent) => {
    const b = ref.current?.getBoundingClientRect()
    if (!b || !ref.current) return
    ref.current.style.setProperty('--mx', `${e.clientX - b.left}px`)
    ref.current.style.setProperty('--my', `${e.clientY - b.top}px`)
  }
  return (
    <section aria-label={heading} className={cn('w-full max-w-4xl', className)}>
      <p className="mb-4 text-center text-sm font-medium text-zinc-600 dark:text-zinc-400">{heading}</p>
      <ul
        ref={ref}
        onPointerMove={move}
        className="group/strip relative grid grid-cols-2 overflow-hidden rounded-2xl border border-zinc-200 bg-white/70 sm:grid-cols-4 dark:border-zinc-800 dark:bg-zinc-900/50"
        style={{ ['--mx' as string]: '50%', ['--my' as string]: '50%' }}
      >
        <span aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/strip:opacity-100" style={{ background: 'radial-gradient(220px circle at var(--mx) var(--my), rgb(154 134 184 / 0.22), transparent 70%)' }} />
        {clients.map((c, i) => {
          const inner = (
            <>
              <motion.svg viewBox="0 0 28 28" className="h-7 w-7 shrink-0 text-zinc-700 transition-colors duration-300 group-hover/cell:text-signal-700 group-focus-visible/cell:text-signal-700 dark:text-zinc-300 dark:group-hover/cell:text-signal-300 dark:group-focus-visible/cell:text-signal-300" aria-hidden whileHover={reduced ? undefined : { rotate: 8, scale: 1.12 }} transition={{ type: 'spring', stiffness: 400, damping: 14 }}><Mark n={c.mark ?? i} /></motion.svg>
              <span className="font-display text-2xl tracking-tight text-zinc-800 dark:text-zinc-200">{c.name}</span>
            </>
          )
          return (
            <motion.li
              key={c.name}
              className="group/cell relative border-b border-r border-zinc-200 dark:border-zinc-800 [&:nth-child(2n)]:max-sm:border-r-0 sm:[&:nth-child(4n)]:border-r-0 [&:nth-last-child(-n+2)]:max-sm:border-b-0 sm:[&:nth-last-child(-n+4)]:border-b-0"
              initial={reduced ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {c.href ? (
                <a href={c.href} className="flex min-h-20 items-center justify-center gap-2.5 px-4 py-5 transition-transform duration-300 hover:-translate-y-0.5 motion-reduce:transition-none">{inner}</a>
              ) : (
                <div className="flex min-h-20 items-center justify-center gap-2.5 px-4 py-5 transition-transform duration-300 hover:-translate-y-0.5 motion-reduce:transition-none">{inner}</div>
              )}
            </motion.li>
          )
        })}
      </ul>
    </section>
  )
}
