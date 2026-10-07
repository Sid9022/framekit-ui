import * as React from 'react'
import { AnimatePresence, LayoutGroup, motion, MotionConfig } from 'motion/react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type StoryCard = { id: string; eyebrow: string; title: string; subtitle: string; body: string; from: string; to: string }

export type AppStoreExpandCardProps = { cards?: StoryCard[]; className?: string }

export const DEFAULT_STORY_CARDS: StoryCard[] = [
  { id: 'a', eyebrow: 'App of the day', title: 'Draw with light', subtitle: 'Lumen Sketch', body: 'Lumen turns every stroke into a ribbon of light. Pressure, tilt and speed shape the glow, and layers stack like stained glass. Export loops, stills or a live wallpaper in one tap.', from: '#4f46e5', to: '#db2777' },
  { id: 'b', eyebrow: 'Meet the developer', title: 'The quiet studio', subtitle: 'Fieldnote', body: 'A two-person team in Kyoto builds tools that disappear while you work. Fieldnote syncs instantly, works offline and never shows a single ad.', from: '#0f766e', to: '#65a30d' },
  { id: 'c', eyebrow: 'Get started', title: 'Sleep, sorted', subtitle: 'Drift', body: 'Wind-down soundscapes that adapt to your breathing, a sunrise alarm that eases you awake, and a weekly report that actually explains itself.', from: '#c2410c', to: '#7c3aed' },
]

/**
 * App Store Expand Card — cards that grow into a full detail view with a
 * shared-layout spring: the art, title and close button morph from the card,
 * the body fades up behind. Esc and the close button collapse it back.
 */
export function AppStoreExpandCard({ cards = DEFAULT_STORY_CARDS, className }: AppStoreExpandCardProps) {
  const [open, setOpen] = React.useState<string | null>(null)
  const reduced = usePrefersReducedMotion()
  const active = cards.find((c) => c.id === open)
  const triggers = React.useRef<Record<string, HTMLButtonElement | null>>({})
  const closeRef = React.useRef<HTMLButtonElement>(null)
  const close = React.useCallback(() => { const id = open; setOpen(null); if (id) requestAnimationFrame(() => triggers.current[id]?.focus()) }, [open])
  React.useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const k = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open, close])
  return (
    <MotionConfig transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 32 }}>
      <LayoutGroup>
        <div className={cn('relative w-full', className)}>
          <ul className="grid gap-4 sm:grid-cols-3">
            {cards.map((c) => (
              <li key={c.id}>
                <motion.button ref={(el) => { triggers.current[c.id] = el }} layoutId={`card-${c.id}`} onClick={() => setOpen(c.id)} whileHover={reduced ? undefined : { scale: 1.02 }} whileTap={{ scale: 0.97 }} aria-label={`${c.title} — open story`} className="relative block h-[260px] w-full overflow-hidden rounded-[24px] text-left shadow-[0_1px_2px_rgb(0_0_0/0.08),0_20px_40px_-24px_rgb(0_0_0/0.5)] outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:ring-offset-zinc-950" style={{ visibility: open === c.id ? 'hidden' : 'visible' }}>
                  <Art c={c} />
                  <Head c={c} />
                </motion.button>
              </li>
            ))}
          </ul>
          <AnimatePresence>
            {active && (
              <>
                <motion.div key="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="absolute -inset-2 z-10 rounded-[28px] bg-white/60 backdrop-blur-md dark:bg-black/60" />
                <motion.div key="detail" role="dialog" aria-modal="true" aria-label={active.title} layoutId={`card-${active.id}`} className="absolute inset-x-0 top-0 z-20 mx-auto max-w-[560px] overflow-hidden rounded-[28px] bg-white shadow-[0_2px_4px_rgb(0_0_0/0.1),0_40px_80px_-30px_rgb(0_0_0/0.6)] ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
                  <div className="relative h-[240px]">
                    <Art c={active} />
                    <Head c={active} />
                    <button ref={closeRef} onClick={close} aria-label="Close story" className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-black/30 text-white backdrop-blur-md transition-colors hover:bg-black/45 outline-none focus-visible:ring-2 focus-visible:ring-white"><X className="size-4" /></button>
                  </div>
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay: reduced ? 0 : 0.12 } }} exit={{ opacity: 0, transition: { duration: 0.1 } }} className="p-6">
                    <p className="text-pretty text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">{active.body}</p>
                    <div className="mt-5 flex items-center justify-between rounded-2xl bg-zinc-100 p-3 dark:bg-zinc-800">
                      <div className="flex items-center gap-3"><span className="size-10 rounded-[11px]" style={{ background: `linear-gradient(135deg, ${active.from}, ${active.to})` }} /><span className="text-sm font-medium text-zinc-900 dark:text-white">{active.subtitle}</span></div>
                      <button className="rounded-full bg-sky-600 px-4 py-1.5 text-sm font-semibold text-white transition-transform active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-sky-400">Get</button>
                    </div>
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </MotionConfig>
  )
}

function Art({ c }: { c: StoryCard }) {
  return (
    <motion.div layoutId={`art-${c.id}`} className="absolute inset-0" style={{ background: `radial-gradient(90% 70% at 20% 10%, ${c.to}, transparent 60%), linear-gradient(160deg, ${c.from}, #09090b)` }}>
      <div className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.12)_1px,transparent_1px)] [background-size:14px_14px]" />
    </motion.div>
  )
}
function Head({ c }: { c: StoryCard }) {
  return (
    <motion.div layoutId={`head-${c.id}`} className="absolute inset-x-5 bottom-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">{c.eyebrow}</p>
      <p className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-white">{c.title}</p>
    </motion.div>
  )
}
