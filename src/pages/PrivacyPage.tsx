import * as React from 'react'
import { Link } from 'react-router-dom'
import { motion, type Variants } from 'motion/react'
import { ChevronRight, ShieldCheck } from 'lucide-react'
import { PRIVACY_SECTIONS, PRIVACY_SUMMARY, PRIVACY_TITLE, PRIVACY_UPDATED, privacyInline } from '@/docs/privacy'
import { SITE } from '@/config/site'
import { cn } from '@/lib/cn'

/* Visual language matches pages/GuidePage.tsx (eyebrow, display H1, lime "short answer" card, numbered sections). */
const LIME = '#D9F95C'
const body = 'text-[15px] leading-7 text-zinc-700 dark:text-zinc-300'
const link =
  'font-medium text-zinc-950 underline decoration-zinc-300 decoration-1 underline-offset-[3px] transition-colors hover:decoration-zinc-950 dark:text-white dark:decoration-zinc-600 dark:hover:decoration-white'
const focus = 'outline-none focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-2 ring-offset-white dark:ring-signal-300 dark:ring-offset-zinc-950'
const inlineCode = '[box-decoration-break:clone] rounded-md bg-zinc-950/[0.05] px-1.5 py-px font-mono text-[0.86em] text-zinc-900 ring-1 ring-inset ring-zinc-950/[0.06] dark:bg-white/[0.07] dark:text-zinc-100 dark:ring-white/[0.08]'

const reveal: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }

const updated = new Date(`${PRIVACY_UPDATED}T12:00:00Z`).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })

function Text({ children }: { children: string }) {
  return (
    <>
      {privacyInline(children).map((p, i) => {
        if (p.kind === 'code') return <code key={i} className={inlineCode}>{p.text}</code>
        if (p.kind === 'strong') return <strong key={i} className="font-semibold text-zinc-950 dark:text-white">{p.text}</strong>
        if (p.kind === 'link')
          return p.href.startsWith('/') ? (
            <Link key={i} to={p.href} className={cn(link, focus, 'rounded-sm')}>{p.text}</Link>
          ) : (
            <a key={i} href={p.href} target="_blank" rel="noopener noreferrer" className={cn(link, focus, 'rounded-sm')}>
              {p.text}<span className="sr-only"> (opens in a new tab)</span>
            </a>
          )
        return <React.Fragment key={i}>{p.text}</React.Fragment>
      })}
    </>
  )
}

export function PrivacyPage() {
  return (
    <motion.article className="mx-auto min-w-0 max-w-3xl" variants={stagger} initial="hidden" animate="show">
      <motion.header variants={reveal}>
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
            <li><Link to="/" className={cn('rounded-md px-1 py-0.5 hover:text-zinc-950 hover:underline dark:hover:text-white', focus)}>{SITE.name}</Link></li>
            <li aria-hidden><ChevronRight className="h-3.5 w-3.5" /></li>
            <li aria-current="page" className="font-medium text-zinc-950 dark:text-white">Privacy</li>
          </ol>
        </nav>
        <span className="inline-flex items-center gap-2 rounded-full border border-zinc-950/[0.08] bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-[0_1px_2px_rgb(0_0_0/0.04)] dark:border-white/[0.1] dark:bg-zinc-900 dark:text-zinc-300">
          <ShieldCheck aria-hidden className="h-3.5 w-3.5" /> Legal
        </span>
        <h1 className="mt-5 text-balance font-display text-[2.6rem] leading-[1.04] tracking-[-0.015em] text-zinc-950 sm:text-[3.4rem] dark:text-white">{PRIVACY_TITLE}</h1>
        <p className="mt-4 text-[13px] text-zinc-600 dark:text-zinc-400">
          Last updated <time dateTime={PRIVACY_UPDATED}>{updated}</time>
        </p>
      </motion.header>

      <motion.section variants={reveal} aria-labelledby="privacy-short" className="relative mt-8 overflow-hidden rounded-3xl border border-zinc-950/[0.08] bg-white p-5 shadow-[0_1px_0_rgb(0_0_0/0.02),0_20px_48px_-32px_rgb(0_0_0/0.3)] sm:p-7 dark:border-white/[0.08] dark:bg-zinc-900/50 dark:shadow-none">
        <span aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-60 blur-3xl dark:opacity-25" style={{ background: LIME }} />
        <h2 id="privacy-short" className="relative flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-400">
          <span aria-hidden className="h-2 w-2 rotate-45 rounded-[2px] ring-1 ring-zinc-950/25 dark:ring-0" style={{ background: LIME }} />
          In short
        </h2>
        <p className="relative mt-3 text-[16px] leading-7 text-zinc-800 dark:text-zinc-200">{PRIVACY_SUMMARY}</p>
      </motion.section>

      {PRIVACY_SECTIONS.map((s, i) => (
        <motion.section key={s.id} variants={reveal} id={s.id} aria-labelledby={`${s.id}-h`} className="mt-14 scroll-mt-24">
          <p aria-hidden className="mb-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">{String(i + 1).padStart(2, '0')}</p>
          <h2 id={`${s.id}-h`} className="text-balance text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-zinc-950 sm:text-[1.7rem] dark:text-white">{s.title}</h2>
          <div className="mt-4 space-y-4">
            {s.paras?.map((p, pi) => <p key={pi} className={body}><Text>{p}</Text></p>)}
            {s.items && (
              <ul className="space-y-2.5">
                {s.items.map((it, ii) => (
                  <li key={ii} className={cn(body, 'relative pl-6')}>
                    <span aria-hidden className="absolute left-0.5 top-[0.7rem] h-1.5 w-1.5 rotate-45 rounded-[1px] bg-zinc-400 dark:bg-zinc-500" />
                    <Text>{it}</Text>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.section>
      ))}
    </motion.article>
  )
}
