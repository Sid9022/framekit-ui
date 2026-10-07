import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type ChangeType = 'feature' | 'improvement' | 'fix'
export type ChangelogEntry = { version: string; date: string; title: string; summary: string; changes: { type: ChangeType; text: string }[]; art?: number }

export type ChangelogTimelineProps = {
  entries?: ChangelogEntry[]
  className?: string
}

export const DEFAULT_CHANGELOG: ChangelogEntry[] = [
  { version: '4.2', date: 'Oct 2, 2026', title: 'Branch databases', summary: 'Every preview gets its own copy-on-write database, created in under a second.', art: 280, changes: [
    { type: 'feature', text: 'Copy-on-write database per branch' }, { type: 'improvement', text: 'Previews boot 38% faster' }, { type: 'fix', text: 'Env vars now sync on rename' } ] },
  { version: '4.1', date: 'Sep 18, 2026', title: 'Instant rollbacks', summary: 'Roll back any deployment in one click, including its config and edge cache.', art: 20, changes: [
    { type: 'feature', text: 'One-click rollback with cache restore' }, { type: 'improvement', text: 'Deploy logs stream 4× faster' } ] },
  { version: '4.0', date: 'Sep 2, 2026', title: 'A faster build cache', summary: 'Remote caching is now on by default and shared across your whole team.', art: 200, changes: [
    { type: 'feature', text: 'Team-wide remote cache' }, { type: 'fix', text: 'Monorepo filters respect .gitignore' } ] },
]

const TYPE: Record<ChangeType, { label: string; cls: string }> = {
  feature: { label: 'New', cls: 'bg-signal-500/15 text-zinc-900 dark:text-zinc-100' },
  improvement: { label: 'Improved', cls: 'bg-sky-500/15 text-sky-800 dark:text-sky-200' },
  fix: { label: 'Fixed', cls: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-200' },
}

/**
 * Changelog Timeline — release notes on a sticky-date timeline: the rail fills
 * as entries scroll in, each dot pops, cover art is a generated gradient, and a
 * filter (All / New / Improved / Fixed) re-flows the change lists on springs.
 */
export function ChangelogTimeline({ entries = DEFAULT_CHANGELOG, className }: ChangelogTimelineProps) {
  const reduced = usePrefersReducedMotion()
  const id = React.useId()
  const [filter, setFilter] = React.useState<ChangeType | 'all'>('all')
  const filters: (ChangeType | 'all')[] = ['all', 'feature', 'improvement', 'fix']
  return (
    <section aria-label="Changelog" className={cn('w-full', className)}>
      <div role="group" aria-label="Filter changes" className="mb-8 inline-flex flex-wrap gap-1 rounded-full border border-black/[0.08] bg-black/[0.03] p-1 dark:border-white/10 dark:bg-white/[0.05]">
        {filters.map((f) => (
          <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)} className="relative h-8 rounded-full px-3 text-[13px] font-medium text-zinc-700 aria-pressed:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 dark:text-zinc-300 dark:aria-pressed:text-white">
            {filter === f && <motion.span layoutId={`${id}-f`} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 36 }} className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-zinc-800" />}
            <span className="relative">{f === 'all' ? 'All' : TYPE[f].label}</span>
          </button>
        ))}
      </div>
      <ol className="relative">
        <span aria-hidden className="absolute bottom-0 left-[7px] top-2 w-px bg-black/[0.08] sm:left-[167px] dark:bg-white/10" />
        {entries.map((e, ei) => {
          const list = e.changes.filter((c) => filter === 'all' || c.type === filter)
          return (
            <motion.li key={e.version} initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative grid gap-4 pb-12 pl-8 sm:grid-cols-[140px_1fr] sm:gap-12 sm:pl-0">
              <div className="sm:sticky sm:top-6 sm:self-start sm:text-right">
                <time className="block text-[13px] font-medium text-zinc-900 dark:text-zinc-100">{e.date}</time>
                <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400">v{e.version}</span>
              </div>
              <motion.span aria-hidden initial={reduced ? false : { scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.15 }}
                className={cn('absolute left-0 top-1 size-[15px] rounded-full border-[3px] border-white sm:left-[160px] dark:border-zinc-950', ei === 0 ? 'bg-signal-500 shadow-[0_0_0_4px_rgb(154_134_184/0.25)]' : 'bg-zinc-400 dark:bg-zinc-600')} />
              <article>
                <div aria-hidden className="mb-4 h-36 overflow-hidden rounded-[20px] border border-black/[0.06] sm:h-44 dark:border-white/[0.08]"
                  style={{ background: `radial-gradient(80% 120% at 20% 10%, oklch(0.78 0.12 ${e.art ?? 260}), transparent 60%), radial-gradient(70% 90% at 90% 100%, oklch(0.62 0.16 ${(e.art ?? 260) + 60}), transparent 60%), oklch(0.25 0.03 ${e.art ?? 260})` }} />
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-zinc-950 dark:text-white">{e.title}</h3>
                <p className="mt-1.5 max-w-[60ch] text-pretty text-[15px] text-zinc-600 dark:text-zinc-400">{e.summary}</p>
                <ul className="mt-4 grid gap-2">
                  <AnimatePresence initial={false} mode="popLayout">
                    {list.map((c) => (
                      <motion.li layout={!reduced} key={c.text} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        className="flex items-center gap-2.5 text-sm text-zinc-800 dark:text-zinc-200">
                        <span className={cn('w-[72px] shrink-0 rounded-full px-2 py-0.5 text-center text-[11px] font-semibold', TYPE[c.type].cls)}>{TYPE[c.type].label}</span>{c.text}
                      </motion.li>
                    ))}
                  </AnimatePresence>
                  {list.length === 0 && <li className="text-sm text-zinc-600 dark:text-zinc-400">Nothing of this type in v{e.version}.</li>}
                </ul>
              </article>
            </motion.li>
          )
        })}
      </ol>
    </section>
  )
}
