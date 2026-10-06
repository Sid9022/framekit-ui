import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type StackPerson = { id: string; name: string; src?: string; role?: string; online?: boolean }

export type AvatarStackProps = {
  people?: StackPerson[]
  /** Avatars shown before the “+N” chip. */
  max?: number
  size?: 'sm' | 'md' | 'lg'
  /** Caption after the stack, e.g. “Editing now”. Set '' to hide. */
  label?: string
  /** Fires when an avatar (or a name in the overflow list) is activated. */
  onSelect?: (person: StackPerson) => void
  className?: string
}

export const DEFAULT_PEOPLE: StackPerson[] = [
  { id: 'mara', name: 'Mara Lindqvist', role: 'Design lead', online: true },
  { id: 'kenji', name: 'Kenji Watanabe', role: 'Frontend', online: true },
  { id: 'amara', name: 'Amara Okafor', role: 'Product' },
  { id: 'priya', name: 'Priya Raman', role: 'Research', online: true },
  { id: 'mateo', name: 'Mateo Alvarez', role: 'Backend' },
  { id: 'lea', name: 'Léa Moreau', role: 'Brand' },
  { id: 'tomas', name: 'Tomás Ferreira', role: 'QA' },
  { id: 'hana', name: 'Hana Kim', role: 'Data' },
  { id: 'ines', name: 'Inès Haddad', role: 'Support' },
]

const HUES = [262, 24, 200, 152, 330, 45, 280, 12]
function hash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}
const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()

const SIZES = { sm: 'h-8 w-8 text-[11px]', md: 'h-11 w-11 text-[13px]', lg: 'h-14 w-14 text-base' }
const OVERLAP = { sm: '-ml-4', md: '-ml-3', lg: '-ml-2.5' }

function Face({ p, size }: { p: StackPerson; size: 'sm' | 'md' | 'lg' }) {
  const h = HUES[hash(p.name) % HUES.length]
  return (
    <span
      className={cn('relative grid shrink-0 place-items-center overflow-hidden rounded-full font-semibold tracking-tight text-white', SIZES[size])}
      style={{ background: `radial-gradient(120% 120% at 30% 20%, hsl(${h} 70% 68%), hsl(${(h + 30) % 360} 55% 42%))` }}
    >
      {p.src ? <img src={p.src} alt="" className="h-full w-full object-cover" /> : <span aria-hidden style={{ textShadow: '0 1px 1px rgb(0 0 0 / 0.25)' }}>{initials(p.name)}</span>}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgb(255_255_255/0.35),inset_0_0_0_1px_rgb(0_0_0/0.08)]" />
    </span>
  )
}

/**
 * Avatar Stack — overlapping avatars that make room for you. Hover or focus one and it lifts while its neighbours
 * part on a spring, revealing a frosted name tag with role and presence. The “+N” chip opens a tidy list of everyone
 * else. Generated gradient initials stand in when there's no photo.
 */
export function AvatarStack({ people = DEFAULT_PEOPLE, max = 5, size = 'md', label = 'Editing now', onSelect, className }: AvatarStackProps) {
  const reduced = usePrefersReducedMotion()
  const [hover, setHover] = React.useState<number | null>(null)
  const [open, setOpen] = React.useState(false)
  const shown = people.slice(0, Math.max(1, max))
  const rest = people.slice(shown.length)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const chipRef = React.useRef<HTMLButtonElement>(null)
  const listId = React.useId()
  const spring = { type: 'spring' as const, stiffness: 520, damping: 30 }

  React.useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        chipRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const online = people.filter((p) => p.online).length

  return (
    <div ref={rootRef} className={cn('relative inline-flex items-center gap-3', className)}>
      <ul aria-label={`${people.length} collaborators, ${online} online`} className="flex items-center pl-4" onPointerLeave={() => setHover(null)}>
        {shown.map((p, i) => {
          const d = hover === null ? 0 : i - hover
          const x = reduced || hover === null ? 0 : d === 0 ? 0 : Math.sign(d) * (6 - Math.min(3, Math.abs(d)))
          return (
            <motion.li key={p.id} className={cn('relative', OVERLAP[size])} animate={{ x, zIndex: hover === i ? 20 : shown.length - i }} transition={spring}>
              <motion.button
                type="button"
                onClick={() => onSelect?.(p)}
                onPointerEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                aria-label={`${p.name}${p.role ? `, ${p.role}` : ''}${p.online ? ', online' : ''}`}
                animate={{ y: !reduced && hover === i ? -4 : 0, scale: !reduced && hover === i ? 1.08 : 1 }}
                whileTap={reduced ? undefined : { scale: 0.96 }}
                transition={spring}
                className="relative grid min-h-11 min-w-11 place-items-center rounded-full outline-none focus-visible:[&>span:first-child]:ring-signal-600 dark:focus-visible:[&>span:first-child]:ring-signal-300"
              >
                <span className="rounded-full ring-[2.5px] ring-white transition-shadow dark:ring-zinc-950">
                  <Face p={p} size={size} />
                </span>
                {p.online && <span aria-hidden className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-950" />}
              </motion.button>
              <AnimatePresence>
                {hover === i && (
                  <motion.span
                    role="tooltip"
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.96, transition: { duration: 0.12 } }}
                    transition={{ type: 'spring', stiffness: 480, damping: 32 }}
                    className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-xl bg-white/85 px-2.5 py-1.5 text-center ring-1 ring-black/[0.06] backdrop-blur-xl shadow-[0_1px_2px_rgb(0_0_0/0.06),0_12px_24px_-12px_rgb(0_0_0/0.3)] dark:bg-zinc-800/85 dark:ring-white/[0.1]"
                    style={{ originY: 1 }}
                  >
                    <span className="block text-xs font-semibold text-zinc-950 dark:text-white">{p.name}</span>
                    {p.role && <span className="block text-[11px] text-zinc-600 dark:text-zinc-300">{p.role}{p.online ? ' · online' : ''}</span>}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.li>
          )
        })}
        {rest.length > 0 && (
          <li className="relative -ml-1.5" style={{ zIndex: 0 }} onPointerEnter={() => setHover(null)}>
            <button
              ref={chipRef}
              type="button"
              aria-expanded={open}
              aria-controls={listId}
              aria-label={`Show ${rest.length} more collaborators`}
              onClick={() => setOpen((o) => !o)}
              className="grid min-h-11 min-w-11 place-items-center rounded-full outline-none focus-visible:[&>span]:ring-signal-600 dark:focus-visible:[&>span]:ring-signal-300"
            >
              <span className={cn('grid place-items-center rounded-full bg-zinc-100 font-semibold tabular-nums text-zinc-800 ring-2 ring-white transition-colors duration-150 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-950 dark:hover:bg-zinc-700', SIZES[size])}>
                +{rest.length}
              </span>
            </button>
          </li>
        )}
      </ul>
      {label && (
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          <span className="font-medium text-zinc-950 dark:text-white">{label}</span>
          {online > 0 && <span className="tabular-nums"> · {online} online</span>}
        </p>
      )}
      <AnimatePresence>
        {open && (
          <motion.div
            id={listId}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.14 } }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            style={{ originX: 0, originY: 0 }}
            className="absolute left-0 top-full z-40 mt-2 w-60 rounded-[18px] bg-white/90 p-1.5 ring-1 ring-black/[0.06] backdrop-blur-xl shadow-[0_2px_6px_rgb(0_0_0/0.06),0_24px_48px_-24px_rgb(0_0_0/0.35)] dark:bg-zinc-900/90 dark:ring-white/[0.1]"
          >
            <p className="px-2.5 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-600 dark:text-zinc-400">Also here</p>
            <ul>
              {rest.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect?.(p)
                      setOpen(false)
                      chipRef.current?.focus()
                    }}
                    className="flex min-h-11 w-full items-center gap-2.5 rounded-xl px-2 text-left transition-colors duration-150 hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-600 dark:hover:bg-white/[0.06] dark:focus-visible:ring-signal-300"
                  >
                    <Face p={p} size="sm" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-zinc-950 dark:text-white">{p.name}</span>
                      {p.role && <span className="block truncate text-xs text-zinc-600 dark:text-zinc-400">{p.role}</span>}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
