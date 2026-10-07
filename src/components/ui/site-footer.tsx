import * as React from 'react'
import { motion } from 'motion/react'
import { GitBranch, AtSign, Briefcase, PlayCircle, Globe } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type FooterColumn = { title: string; links: { label: string; href?: string; badge?: string }[] }

export type SiteFooterProps = {
  brand?: string
  tagline?: string
  columns?: FooterColumn[]
  /** Status line, e.g. “All systems normal”. Set null to hide. */
  status?: string | null
  className?: string
}

export const DEFAULT_FOOTER_COLUMNS: FooterColumn[] = [
  { title: 'Product', links: [{ label: 'Features' }, { label: 'Pricing' }, { label: 'Integrations' }, { label: 'Changelog', badge: 'New' }] },
  { title: 'Resources', links: [{ label: 'Docs' }, { label: 'Guides' }, { label: 'API status' }, { label: 'Templates' }] },
  { title: 'Company', links: [{ label: 'About' }, { label: 'Blog' }, { label: 'Careers', badge: '4' }, { label: 'Press' }] },
  { title: 'Legal', links: [{ label: 'Privacy' }, { label: 'Terms' }, { label: 'Security' }, { label: 'DPA' }] },
]

/**
 * Site Footer — a calm SaaS footer: brand and tagline, four link columns whose
 * links slide a hairline underline in from the left, a live status pill with a
 * breathing dot, socials, a language selector and a giant outlined wordmark
 * that fades up out of the bottom edge.
 */
export function SiteFooter({ brand = 'Northwind', tagline = 'The platform for teams who ship the web.', columns = DEFAULT_FOOTER_COLUMNS, status = 'All systems normal', className }: SiteFooterProps) {
  const reduced = usePrefersReducedMotion()
  const id = React.useId()
  const socials = [{ l: 'GitHub', i: <GitBranch /> }, { l: 'X (Twitter)', i: <AtSign /> }, { l: 'LinkedIn', i: <Briefcase /> }, { l: 'YouTube', i: <PlayCircle /> }]
  return (
    <footer className={cn('relative w-full overflow-hidden rounded-[28px] border border-black/[0.08] bg-zinc-50 px-6 pt-12 sm:px-10 dark:border-white/10 dark:bg-zinc-950', className)}>
      <div className="grid gap-10 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
        <div>
          <a href="#" className="inline-flex items-center gap-2 rounded-[8px] text-[15px] font-semibold tracking-tight text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 dark:text-white">
            <span aria-hidden className="grid size-7 place-items-center rounded-[8px] bg-zinc-900 text-xs text-white dark:bg-white dark:text-zinc-900">▲</span>{brand}
          </a>
          <p className="mt-3 max-w-[30ch] text-pretty text-sm text-zinc-600 dark:text-zinc-400">{tagline}</p>
          {status && (
            <a href="#" className="mt-5 inline-flex h-8 items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 text-[13px] font-medium text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200">
              <span aria-hidden className="relative flex size-2"><span className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:animate-none" /><span className="relative size-2 rounded-full bg-emerald-500" /></span>{status}
            </a>
          )}
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-4">
          {columns.map((c, ci) => (
            <nav key={c.title} aria-labelledby={`${id}-${ci}`}>
              <h3 id={`${id}-${ci}`} className="text-[13px] font-semibold text-zinc-950 dark:text-white">{c.title}</h3>
              <ul className="mt-3 grid gap-2">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href ?? '#'} className="group relative inline-flex items-center gap-2 rounded-[4px] py-0.5 text-sm text-zinc-600 transition-colors hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 dark:text-zinc-400 dark:hover:text-white">
                      <span className="relative">{l.label}<span aria-hidden className="absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none" /></span>
                      {l.badge && <span className="rounded-full bg-signal-500/15 px-1.5 text-[11px] font-medium text-zinc-800 dark:text-zinc-200">{l.badge}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="mt-12 flex flex-col-reverse items-start justify-between gap-4 border-t border-black/[0.06] py-6 sm:flex-row sm:items-center dark:border-white/[0.08]">
        <p className="text-[13px] text-zinc-600 dark:text-zinc-400">© {new Date().getFullYear()} {brand}, Inc.</p>
        <div className="flex items-center gap-1">
          {socials.map((s) => (
            <a key={s.l} href="#" aria-label={s.l} className="grid size-9 place-items-center rounded-full text-zinc-600 transition-[color,background-color,transform] hover:-translate-y-0.5 hover:bg-black/5 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 motion-reduce:hover:translate-y-0 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white [&_svg]:size-4">{s.i}</a>
          ))}
          <label className="ml-2 inline-flex h-9 items-center gap-1.5 rounded-full border border-black/[0.08] px-3 text-[13px] text-zinc-700 focus-within:ring-2 focus-within:ring-signal-500 dark:border-white/10 dark:text-zinc-300">
            <Globe aria-hidden className="size-3.5" /><span className="sr-only">Language</span>
            <select className="bg-transparent outline-none dark:[color-scheme:dark]" defaultValue="en"><option value="en">English</option><option value="de">Deutsch</option><option value="ja">日本語</option></select>
          </label>
        </div>
      </div>
      <motion.div aria-hidden initial={reduced ? false : { opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none -mb-[0.22em] select-none text-center text-[clamp(64px,17vw,220px)] font-semibold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgb(0_0_0/0.12)] dark:[-webkit-text-stroke:1px_rgb(255_255_255/0.12)]">
        {brand}
      </motion.div>
    </footer>
  )
}
