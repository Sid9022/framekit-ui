import * as React from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, type Variants } from 'motion/react'
import { ArrowRight, ArrowUpRight, ChevronDown, ChevronRight, Clock, Hash, Lightbulb, TriangleAlert } from 'lucide-react'
import { GUIDES, GUIDES_DESC, GUIDES_TITLE, getGuide, inlineParts, readingMinutes, type Guide, type GuideBlock, type Inline } from '@/docs/guides'
import { getDoc } from '@/docs/registry'
import { CodeBlock } from '@/components/code-block'
import { NotFound } from '@/components/docs/states'
import { cn } from '@/lib/cn'

/* ── shared styles ───────────────────────────────────────────────────── */
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

const formatDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' })

/* ── inline markup ───────────────────────────────────────────────────── */
function Text({ children }: { children: Inline }) {
  return (
    <>
      {inlineParts(children).map((p, i) => {
        if (p.kind === 'code') return <code key={i} className={inlineCode}>{p.text}</code>
        if (p.kind === 'strong') return <strong key={i} className="font-semibold text-zinc-950 dark:text-white">{p.text}</strong>
        if (p.kind === 'link')
          return p.href.startsWith('/') ? (
            <Link key={i} to={p.href} className={cn(link, focus, 'rounded-sm')}>{p.text}</Link>
          ) : (
            <a key={i} href={p.href} target="_blank" rel="noreferrer" className={cn(link, focus, 'rounded-sm')}>
              {p.text}<span className="sr-only"> (opens in a new tab)</span>
            </a>
          )
        return <React.Fragment key={i}>{p.text}</React.Fragment>
      })}
    </>
  )
}

/* ── blocks ──────────────────────────────────────────────────────────── */
function Code({ lang, code, label, id }: { lang: string; code: string; label?: string; id: string }) {
  const language = lang === 'bash' ? 'bash' : lang === 'json' ? 'json' : lang === 'css' ? 'css' : lang === 'ts' ? 'typescript' : 'tsx'
  if (!label) return <CodeBlock code={code} language={language} label={`${lang} code`} trackMeta={{ slug: id, kind: 'guide' }} />
  return (
    <figure className="min-w-0">
      <figcaption className="flex items-center gap-2 rounded-t-2xl border border-b-0 border-zinc-200 bg-zinc-50 px-4 py-2.5 font-mono text-[12px] text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-400">
        <span aria-hidden className="h-2 w-2 rotate-45 rounded-[2px]" style={{ background: LIME }} />
        <span className="truncate">{label}</span>
      </figcaption>
      <CodeBlock code={code} language={language} label={label} className="rounded-t-none" trackMeta={{ slug: id, kind: 'guide' }} />
    </figure>
  )
}

function Table({ b }: { b: Extract<GuideBlock, { type: 'table' }> }) {
  return (
    <div className="min-w-0">
      {/* ≥ md: real table in a scrollable region */}
      <div role="region" aria-label={b.caption} tabIndex={0} className={cn('framekit-scroll hidden overflow-x-auto rounded-2xl border border-zinc-950/[0.08] bg-white md:block dark:border-white/[0.08] dark:bg-zinc-900/30', focus)}>
        <table className="w-full text-left text-[13.5px]">
          <caption className="border-b border-zinc-950/[0.06] px-4 py-2.5 text-left text-xs font-medium text-zinc-600 dark:border-white/[0.06] dark:text-zinc-400">{b.caption}</caption>
          <thead className="bg-zinc-50/80 text-[12px] text-zinc-600 dark:bg-zinc-900/60 dark:text-zinc-400">
            <tr>{b.head.map((h) => <th key={h} scope="col" className="whitespace-nowrap px-4 py-2.5 font-semibold"><Text>{h}</Text></th>)}</tr>
          </thead>
          <tbody>
            {b.rows.map((r, ri) => (
              <tr key={ri} className="border-t border-zinc-950/[0.06] align-top dark:border-white/[0.06]">
                {r.map((c, ci) =>
                  ci === 0 ? (
                    <th key={ci} scope="row" className="px-4 py-3 font-medium text-zinc-950 dark:text-white"><Text>{c}</Text></th>
                  ) : (
                    <td key={ci} className="px-4 py-3 leading-relaxed text-zinc-700 dark:text-zinc-300"><Text>{c}</Text></td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* < md: one card per row, no sideways scrolling */}
      <div className="md:hidden">
        <p className="mb-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">{b.caption}</p>
        <ul className="space-y-2.5">
          {b.rows.map((r, ri) => (
            <li key={ri} className="rounded-2xl border border-zinc-950/[0.08] bg-white p-4 dark:border-white/[0.08] dark:bg-zinc-900/30">
              <p className="text-[15px] font-medium text-zinc-950 dark:text-white"><Text>{r[0]}</Text></p>
              <dl className="mt-2 space-y-1.5 text-[13.5px]">
                {r.slice(1).map((c, ci) => (
                  <div key={ci} className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)] gap-3">
                    <dt className="text-zinc-500 dark:text-zinc-400"><Text>{b.head[ci + 1]}</Text></dt>
                    <dd className="min-w-0 break-words text-zinc-800 dark:text-zinc-200"><Text>{c}</Text></dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Examples({ title, slugs }: { title?: string; slugs: string[] }) {
  const docs = slugs.map((s) => getDoc(s)).filter((d): d is NonNullable<typeof d> => !!d)
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">{title ?? 'Framekit examples'}</p>
      <ul className="grid gap-2.5 sm:grid-cols-2">
        {docs.map((d) => (
          <li key={d.slug}>
            <Link
              to={`/docs/${d.slug}`}
              className={cn(
                'group flex h-full min-h-11 items-start gap-3 rounded-2xl border border-zinc-950/[0.08] bg-white p-3.5 transition-[border-color,box-shadow,transform] duration-200 hover:border-zinc-950/20 hover:shadow-[0_8px_24px_-16px_rgb(0_0_0/0.35)] active:scale-[0.99] motion-reduce:transition-none dark:border-white/[0.08] dark:bg-zinc-900/40 dark:hover:border-white/20',
                focus,
              )}
            >
              <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rotate-45 rounded-[2px] ring-1 ring-zinc-950/20 dark:ring-0" style={{ background: LIME }} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1 text-sm font-medium text-zinc-950 dark:text-white">
                  {d.title}
                  <ArrowUpRight aria-hidden className="h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
                </span>
                <span className="mt-0.5 line-clamp-2 block text-[13px] leading-snug text-zinc-600 dark:text-zinc-400">{d.description}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Block({ b, id }: { b: GuideBlock; id: string }) {
  switch (b.type) {
    case 'p':
      return <p className={body}><Text>{b.text}</Text></p>
    case 'list': {
      const Tag = b.ordered ? 'ol' : 'ul'
      return (
        <Tag className={cn(body, 'space-y-2 pl-5', b.ordered ? 'list-decimal' : 'list-disc marker:text-zinc-400')}>
          {b.items.map((it, i) => <li key={i} className="pl-1"><Text>{it}</Text></li>)}
        </Tag>
      )
    }
    case 'steps':
      return (
        <ol className="space-y-6">
          {b.items.map((st, i) => (
            <li key={i} className="relative grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4">
              <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full bg-zinc-950 font-mono text-[13px] font-medium text-white dark:bg-white dark:text-zinc-950">{i + 1}</span>
              {i < b.items.length - 1 && <span aria-hidden className="absolute bottom-[-1.25rem] left-4 top-10 w-px bg-zinc-950/10 dark:bg-white/10" />}
              <div className="min-w-0 space-y-2.5 pt-1">
                <p className="text-[15px] font-semibold text-zinc-950 dark:text-white">{st.title}</p>
                <p className={body}><Text>{st.text}</Text></p>
                {st.code && <Code {...st.code} id={id} />}
              </div>
            </li>
          ))}
        </ol>
      )
    case 'code':
      return <Code lang={b.lang} code={b.code} label={b.label} id={id} />
    case 'table':
      return <Table b={b} />
    case 'note': {
      const Icon = b.tone === 'warn' ? TriangleAlert : Lightbulb
      return (
        <div
          className={cn(
            'flex gap-3 rounded-2xl border p-4 text-[14px] leading-6',
            b.tone === 'warn'
              ? 'border-amber-300/70 bg-amber-50 text-amber-950 dark:border-amber-400/25 dark:bg-amber-400/[0.07] dark:text-amber-100'
              : 'border-[#C5E84A]/70 bg-[#F6FDE0] text-zinc-800 dark:border-[#D9F95C]/20 dark:bg-[#D9F95C]/[0.06] dark:text-zinc-200',
          )}
        >
          <Icon aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="min-w-0"><span className="sr-only">{b.tone === 'warn' ? 'Note: ' : 'Tip: '}</span><Text>{b.text}</Text></p>
        </div>
      )
    }
    case 'examples':
      return <Examples title={b.title} slugs={b.slugs} />
  }
}

/* ── table of contents with scroll-spy ───────────────────────────────── */
function useActiveSection(ids: string[]) {
  const [active, setActive] = React.useState(ids[0])
  React.useEffect(() => {
    // Active = the last section whose top has passed a line just under the sticky header.
    let raf = 0
    const update = () => {
      raf = 0
      const line = 140
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      // At the very bottom the last short sections can never reach the line.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = ids[ids.length - 1]
      setActive(current)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids])
  return active
}

function Toc({ guide, active, className }: { guide: Guide; active: string; className?: string }) {
  const items = [...guide.sections.map((s) => ({ id: s.id, title: s.title })), { id: 'faq', title: 'FAQ' }]
  return (
    <nav aria-label="On this page" className={className}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">On this page</p>
      <ol className="space-y-0.5 border-l border-zinc-950/[0.08] dark:border-white/[0.08]">
        {items.map((it) => {
          const on = it.id === active
          return (
            <li key={it.id} className="relative">
              {on && (
                <motion.span
                  layoutId="guide-toc-bar"
                  aria-hidden
                  transition={{ type: 'spring', stiffness: 460, damping: 36 }}
                  className="absolute -left-px top-1 bottom-1 w-[2px] rounded-full bg-zinc-950 dark:bg-white"
                />
              )}
              <Link
                to={{ hash: it.id }}
                aria-current={on ? 'location' : undefined}
                className={cn(
                  'block rounded-r-md py-1.5 pl-4 pr-2 text-[13px] leading-snug transition-colors',
                  on ? 'font-medium text-zinc-950 dark:text-white' : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white',
                  focus,
                )}
              >
                {it.title}
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/* ── page ────────────────────────────────────────────────────────────── */
function Breadcrumbs({ current }: { current?: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
        <li><Link to="/docs/introduction" className={cn('rounded-md px-1 py-0.5 hover:text-zinc-950 hover:underline dark:hover:text-white', focus)}>Docs</Link></li>
        <li aria-hidden><ChevronRight className="h-3.5 w-3.5" /></li>
        {current ? (
          <>
            <li><Link to="/guides" className={cn('rounded-md px-1 py-0.5 hover:text-zinc-950 hover:underline dark:hover:text-white', focus)}>{GUIDES_TITLE}</Link></li>
            <li aria-hidden><ChevronRight className="h-3.5 w-3.5" /></li>
            <li aria-current="page" className="truncate font-medium text-zinc-950 dark:text-white">{current}</li>
          </>
        ) : (
          <li aria-current="page" className="font-medium text-zinc-950 dark:text-white">{GUIDES_TITLE}</li>
        )}
      </ol>
    </nav>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-zinc-950/[0.08] bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-[0_1px_2px_rgb(0_0_0/0.04)] dark:border-white/[0.1] dark:bg-zinc-900 dark:text-zinc-300">
      <span aria-hidden className="h-2 w-2 rotate-45 rounded-[2px] ring-1 ring-zinc-950/25 dark:ring-0" style={{ background: LIME }} />
      {children}
    </span>
  )
}

export function GuidePage() {
  const { slug = '' } = useParams()
  const guide = getGuide(slug)
  const ids = React.useMemo(() => (guide ? [...guide.sections.map((s) => s.id), 'faq'] : []), [guide])
  const active = useActiveSection(ids)
  if (!guide) return <NotFound slug={slug} />
  const others = GUIDES.filter((g) => g.slug !== guide.slug)
  const related = guide.related.map((s) => getDoc(s)).filter((d): d is NonNullable<typeof d> => !!d)

  return (
    <div className="mx-auto flex max-w-6xl gap-14">
      <motion.article key={guide.slug} className="min-w-0 max-w-3xl flex-1" variants={stagger} initial="hidden" animate="show">
        <motion.header variants={reveal}>
          <Breadcrumbs current={guide.navTitle} />
          <Eyebrow>{guide.eyebrow}</Eyebrow>
          <h1 className="mt-5 text-balance font-display text-[2.6rem] leading-[1.04] tracking-[-0.015em] text-zinc-950 sm:text-[3.4rem] dark:text-white">{guide.title}</h1>
          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-zinc-600 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1.5"><Clock aria-hidden className="h-3.5 w-3.5" />{readingMinutes(guide)} min read</span>
            <span aria-hidden>·</span>
            <span>Updated <time dateTime={guide.dateModified}>{formatDate(guide.dateModified)}</time></span>
            <span aria-hidden>·</span>
            <span>{guide.sections.length} sections</span>
          </p>
        </motion.header>

        <motion.section variants={reveal} aria-labelledby="short-answer" className="relative mt-8 overflow-hidden rounded-3xl border border-zinc-950/[0.08] bg-white p-5 shadow-[0_1px_0_rgb(0_0_0/0.02),0_20px_48px_-32px_rgb(0_0_0/0.3)] sm:p-7 dark:border-white/[0.08] dark:bg-zinc-900/50 dark:shadow-none">
          <span aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-60 blur-3xl dark:opacity-25" style={{ background: LIME }} />
          <h2 id="short-answer" className="relative flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-400">
            <span aria-hidden className="h-2 w-2 rotate-45 rounded-[2px] ring-1 ring-zinc-950/25 dark:ring-0" style={{ background: LIME }} />
            Short answer
          </h2>
          <p className="relative mt-3 text-[16px] leading-7 text-zinc-800 dark:text-zinc-200"><Text>{guide.summary}</Text></p>
        </motion.section>

        {/* TOC for phones / tablets */}
        <motion.details variants={reveal} className="group mt-6 rounded-2xl border border-zinc-950/[0.08] bg-white xl:hidden dark:border-white/[0.08] dark:bg-zinc-900/40">
          <summary className={cn('flex min-h-11 cursor-pointer list-none items-center justify-between rounded-2xl px-4 text-sm font-medium [&::-webkit-details-marker]:hidden', focus)}>
            On this page
            <ChevronDown aria-hidden className="h-4 w-4 text-zinc-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" />
          </summary>
          <div className="px-4 pb-4">
            <ol className="space-y-1 text-sm">
              {[...guide.sections, { id: 'faq', title: 'FAQ' }].map((s, i) => (
                <li key={s.id}>
                  <Link to={{ hash: s.id }} className={cn('flex min-h-9 items-baseline gap-2.5 rounded-md py-1 text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white', focus)}>
                    <span className="w-5 shrink-0 font-mono text-xs text-zinc-400">{String(i + 1).padStart(2, '0')}</span>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </motion.details>

        {guide.sections.map((s, i) => (
          <motion.section key={s.id} variants={reveal} id={s.id} aria-labelledby={`${s.id}-h`} className="mt-16 scroll-mt-24">
            <p aria-hidden className="mb-2 font-mono text-xs text-zinc-400 dark:text-zinc-500">{String(i + 1).padStart(2, '0')}</p>
            <h2 id={`${s.id}-h`} className="group text-balance text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] text-zinc-950 sm:text-[1.85rem] dark:text-white">
              {s.title}
              <Link to={{ hash: s.id }} aria-label={`Link to “${s.title}”`} className={cn('ml-2 inline-flex translate-y-[-2px] rounded-md p-1 align-middle text-zinc-300 opacity-0 transition-opacity hover:text-zinc-700 focus-visible:opacity-100 group-hover:opacity-100 pointer-coarse:hidden dark:text-zinc-600 dark:hover:text-zinc-300', focus)}>
                <Hash aria-hidden className="h-4 w-4" />
              </Link>
            </h2>
            <p className="mt-4 border-l-2 pl-4 text-[16.5px] leading-7 text-zinc-900 dark:text-zinc-100" style={{ borderColor: LIME }}>
              <Text>{s.answer}</Text>
            </p>
            <div className="mt-6 space-y-6">
              {s.blocks.map((b, bi) => <Block key={bi} b={b} id={guide.slug} />)}
            </div>
          </motion.section>
        ))}

        <motion.section variants={reveal} id="faq" aria-labelledby="faq-h" className="mt-16 scroll-mt-24">
          <h2 id="faq-h" className="text-[1.6rem] font-semibold tracking-[-0.02em] text-zinc-950 sm:text-[1.85rem] dark:text-white">FAQ</h2>
          <div className="mt-5 divide-y divide-zinc-950/[0.08] overflow-hidden rounded-2xl border border-zinc-950/[0.08] bg-white dark:divide-white/[0.08] dark:border-white/[0.08] dark:bg-zinc-900/40">
            {guide.faq.map((f) => (
              <details key={f.q} className="group">
                <summary className={cn('flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3.5 text-[15px] font-medium text-zinc-950 transition-colors hover:bg-zinc-50 dark:text-white dark:hover:bg-zinc-900 [&::-webkit-details-marker]:hidden', focus)}>
                  <h3>{f.q}</h3>
                  <ChevronDown aria-hidden className="h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" />
                </summary>
                <p className={cn(body, 'px-5 pb-5')}><Text>{f.a}</Text></p>
              </details>
            ))}
          </div>
        </motion.section>

        {related.length > 0 && (
          <motion.section variants={reveal} aria-labelledby="related-h" className="mt-16">
            <h2 id="related-h" className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-white">Components used in this guide</h2>
            <div className="mt-4"><Examples title="Open the live demos" slugs={guide.related} /></div>
          </motion.section>
        )}

        <motion.nav variants={reveal} aria-label="More guides" className="mt-16 border-t border-zinc-950/[0.08] pt-8 dark:border-white/[0.08]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">More guides</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {others.map((g) => (
              <li key={g.slug}>
                <Link
                  to={`/guides/${g.slug}`}
                  className={cn(
                    'group flex h-full flex-col rounded-2xl border border-zinc-950/[0.08] bg-white p-5 transition-[border-color,box-shadow,transform] duration-200 hover:border-zinc-950/20 hover:shadow-[0_12px_32px_-20px_rgb(0_0_0/0.4)] active:scale-[0.99] motion-reduce:transition-none dark:border-white/[0.08] dark:bg-zinc-900/40 dark:hover:border-white/20',
                    focus,
                  )}
                >
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">{g.eyebrow}</span>
                  <span className="mt-1.5 font-display text-[1.45rem] leading-tight text-zinc-950 dark:text-white">{g.title}</span>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Read guide <ArrowRight aria-hidden className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.nav>
      </motion.article>

      <aside aria-label="Table of contents" className="hidden w-60 shrink-0 xl:block">
        <div className="sticky top-24">
          <Toc guide={guide} active={active} />
          <div className="mt-8 rounded-2xl border border-zinc-950/[0.08] bg-white p-4 dark:border-white/[0.08] dark:bg-zinc-900/40">
            <p className="text-[13px] font-medium text-zinc-950 dark:text-white">Install any component</p>
            <p className="mt-1 text-[12.5px] leading-snug text-zinc-600 dark:text-zinc-400">One command with the shadcn CLI. Every component page has its own.</p>
            <Link to="/docs/introduction" className={cn('mt-3 inline-flex min-h-9 items-center gap-1 rounded-full bg-zinc-950 px-3.5 text-[12.5px] font-medium text-white transition-transform active:scale-[0.97] dark:bg-white dark:text-zinc-950', focus)}>
              Browse components <ArrowRight aria-hidden className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </aside>
    </div>
  )
}

export function GuidesIndexPage() {
  return (
    <motion.div className="mx-auto max-w-4xl" variants={stagger} initial="hidden" animate="show">
      <motion.header variants={reveal}>
        <Breadcrumbs />
        <Eyebrow>{GUIDES.length} in-depth guides</Eyebrow>
        <h1 className="mt-5 text-balance font-display text-[2.8rem] leading-[1.03] tracking-[-0.015em] text-zinc-950 sm:text-[3.6rem] dark:text-white">Guides for premium, accessible motion</h1>
        <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-zinc-700 dark:text-zinc-300">{GUIDES_DESC}</p>
      </motion.header>
      <ul className="mt-10 space-y-4">
        {GUIDES.map((g, i) => (
          <motion.li key={g.slug} variants={reveal}>
            <Link
              to={`/guides/${g.slug}`}
              className={cn(
                'group relative grid gap-4 overflow-hidden rounded-3xl border border-zinc-950/[0.08] bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:border-zinc-950/20 hover:shadow-[0_20px_48px_-28px_rgb(0_0_0/0.45)] active:scale-[0.995] motion-reduce:transition-none sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:p-7 dark:border-white/[0.08] dark:bg-zinc-900/40 dark:hover:border-white/20',
                focus,
              )}
            >
              <span aria-hidden className="font-mono text-sm text-zinc-400 dark:text-zinc-500">{String(i + 1).padStart(2, '0')}</span>
              <span className="min-w-0">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{g.eyebrow} · {readingMinutes(g)} min read</span>
                <span className="mt-1.5 block text-balance font-display text-[1.75rem] leading-[1.1] text-zinc-950 sm:text-[2rem] dark:text-white">{g.title}</span>
                <span className="mt-2.5 block text-[14.5px] leading-6 text-zinc-600 dark:text-zinc-400">{g.description}</span>
              </span>
              <span aria-hidden className="hidden h-11 w-11 place-items-center self-center rounded-full border border-zinc-950/10 transition-colors duration-200 group-hover:border-transparent group-hover:bg-[#D9F95C] group-hover:text-zinc-950 sm:grid dark:border-white/15">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}
