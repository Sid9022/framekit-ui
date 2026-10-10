import * as React from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { GUIDES, GUIDES_DESC, GUIDES_TITLE, getGuide, inlineParts, readingMinutes, type Guide, type GuideBlock, type Inline } from '@/docs/guides'
import { getDoc } from '@/docs/registry'
import { CodeBlock } from '@/components/code-block'
import { CommandTabs, dlx, pmInstall } from '@/components/docs/install-block'
import { NotFound } from '@/components/docs/states'
import { DocBreadcrumb, DocTable, InlineText } from '@/components/docs/prose'
import { docReveal as reveal, docStagger as stagger, docText as t } from '@/components/docs/prose-styles'
import { cn } from '@/lib/cn'

/*
 * Guides use the docs page anatomy (DocPage): breadcrumb, sans H1, lede, then sections with text-xl headings,
 * the docs CodeBlock / CommandTabs, the props-table look for tables and the dashed docs note.
 */

const formatDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })

function Text({ children }: { children: Inline }) {
  return <InlineText parts={inlineParts(children)} />
}

const codeLang = (lang: string) => (lang === 'ts' ? 'typescript' : lang)

function Block({ b, slug, id }: { b: GuideBlock; slug: string; id: string }) {
  switch (b.type) {
    case 'p':
      return <p className={t.body}><Text>{b.text}</Text></p>
    case 'list': {
      const Tag = b.ordered ? 'ol' : 'ul'
      return (
        <Tag className={cn(t.body, 'space-y-1 pl-5', b.ordered ? 'list-decimal' : 'list-disc')}>
          {b.items.map((it, i) => <li key={i}><Text>{it}</Text></li>)}
        </Tag>
      )
    }
    case 'steps':
      return (
        <ol className={cn(t.body, 'list-decimal space-y-6 pl-5')}>
          {b.items.map((st, i) => (
            <li key={i} className="space-y-2">
              <p className="font-medium text-zinc-900 dark:text-zinc-100">{st.title}</p>
              <p><Text>{st.text}</Text></p>
              {st.code && <CodeBlock code={st.code.code} language={codeLang(st.code.lang)} label={st.code.label} trackMeta={{ slug, kind: 'guide' }} />}
            </li>
          ))}
        </ol>
      )
    case 'code':
      return <CodeBlock code={b.code} language={codeLang(b.lang)} label={b.label ?? `${b.lang} code`} trackMeta={{ slug, kind: 'guide' }} />
    case 'command':
      return <CommandTabs id={id} build={(pm) => dlx(pm, b.shadcn)} meta={{ slug, kind: 'guide-command' }} />
    case 'install':
      return <CommandTabs id={id} build={(pm) => pmInstall(pm, b.packages)} meta={{ slug, kind: 'guide-install' }} />
    case 'table':
      return (
        <DocTable
          caption={b.caption}
          head={b.head}
          mono={b.mono}
          rows={b.rows.map((r) => r.map((c, i) => <Text key={i}>{c}</Text>))}
        />
      )
    case 'note':
      return (
        <p className={t.note}>
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-signal-600" aria-hidden />
          <span>
            <strong className="font-medium text-zinc-950 dark:text-zinc-100">{b.tone === 'warn' ? 'Heads-up:' : 'Note:'}</strong> <Text>{b.text}</Text>
          </span>
        </p>
      )
    case 'examples':
      return <ComponentCards slugs={b.slugs} />
  }
}

function ComponentCards({ slugs }: { slugs: string[] }) {
  const docs = slugs.map((s) => getDoc(s)).filter((d): d is NonNullable<typeof d> => !!d)
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {docs.map((d) => (
        <li key={d.slug}>
          <Link to={`/docs/${d.slug}`} className={t.card}>
            <span className="flex items-start justify-between gap-3">
              <span className="text-base font-semibold tracking-tight">{d.title}</span>
              <ArrowUpRight aria-hidden className="h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal-700 dark:group-hover:text-signal-300" />
            </span>
            <span className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-400">{d.description}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

/* ── on this page ─────────────────────────────────────────────────────── */
function useActiveSection(ids: string[]) {
  const [active, setActive] = React.useState(ids[0])
  React.useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 120) current = id
      }
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

const tocItems = (g: Guide) => [...g.sections.map((s) => ({ id: s.id, title: s.title })), { id: 'faq', title: 'FAQ' }]

/** Inline, under the header: the CategoryPage chip row. Hidden where the margin list fits. */
function TocChips({ guide }: { guide: Guide }) {
  return (
    <nav aria-label="On this page" className="mt-6 min-[1700px]:hidden">
      <ul className="flex flex-wrap gap-2">
        {tocItems(guide).map((it) => (
          <li key={it.id}><Link to={{ hash: it.id }} className={t.chip}>{it.title}</Link></li>
        ))}
      </ul>
    </nav>
  )
}

/** In the right margin on very wide screens: the sidebar's item style and active bar. */
function TocRail({ guide, active }: { guide: Guide; active: string }) {
  return (
    <aside className="absolute inset-y-0 left-full ml-12 hidden w-52 min-[1700px]:block">
      <nav aria-label="On this page" className="sticky top-24">
        <p className="px-2.5 text-[13px] font-semibold tracking-tight text-zinc-700 dark:text-zinc-300">On this page</p>
        <ul className="mt-1">
          {tocItems(guide).map((it) => {
            const on = it.id === active
            return (
              <li key={it.id}>
                <Link
                  to={{ hash: it.id }}
                  aria-current={on ? 'location' : undefined}
                  className={cn(
                    'relative flex min-h-8 items-center rounded-lg px-2.5 py-1 text-[13px] transition-colors duration-150',
                    on ? 'bg-signal-100 font-semibold text-zinc-950 dark:bg-signal-900/50 dark:text-white' : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white',
                  )}
                >
                  {it.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

/** Previous / next guide: the DocPage PrevNext cards. */
function GuidePrevNext({ slug }: { slug: string }) {
  const i = GUIDES.findIndex((g) => g.slug === slug)
  const prev = GUIDES[i - 1]
  const next = GUIDES[i + 1]
  const card =
    'group flex min-h-[72px] flex-1 flex-col justify-center rounded-2xl border border-zinc-950/[0.08] p-4 transition-[border-color,background-color,transform] duration-200 hover:border-signal-400 hover:bg-white active:scale-[0.99] motion-reduce:transition-none dark:border-white/[0.08] dark:hover:border-signal-500 dark:hover:bg-zinc-900/60'
  return (
    <nav aria-label="Previous and next guide" className="mt-16 flex flex-col gap-3 border-t border-zinc-950/[0.08] pt-8 sm:flex-row dark:border-white/[0.08]">
      {prev ? (
        <Link to={`/guides/${prev.slug}`} rel="prev" className={card}>
          <span className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden /> Previous
          </span>
          <span className="mt-1 text-sm font-medium">{prev.navTitle}</span>
        </Link>
      ) : <span className="hidden flex-1 sm:block" />}
      {next ? (
        <Link to={`/guides/${next.slug}`} rel="next" className={cn(card, 'sm:items-end sm:text-right')}>
          <span className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
            Next <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
          </span>
          <span className="mt-1 text-sm font-medium">{next.navTitle}</span>
        </Link>
      ) : <span className="hidden flex-1 sm:block" />}
    </nav>
  )
}

/* ── page ────────────────────────────────────────────────────────────── */
export function GuidePage() {
  const { slug = '' } = useParams()
  const guide = getGuide(slug)
  const ids = React.useMemo(() => (guide ? tocItems(guide).map((x) => x.id) : []), [guide])
  const active = useActiveSection(ids)
  if (!guide) return <NotFound slug={slug} />

  return (
    <div className="relative mx-auto max-w-4xl">
      <motion.article key={guide.slug} variants={stagger} initial="hidden" animate="show">
        <motion.header variants={reveal}>
          <DocBreadcrumb trail={[{ name: 'Docs', to: '/docs/introduction' }, { name: GUIDES_TITLE, to: '/guides' }, { name: guide.navTitle }]} />
          <h1 className={t.h1}>{guide.title}</h1>
          <p className={t.lede}><Text>{guide.summary}</Text></p>
          <p className={cn(t.meta, 'mt-4')}>
            Updated <time dateTime={guide.dateModified}>{formatDate(guide.dateModified)}</time> · {readingMinutes(guide)} min read
          </p>
          <TocChips guide={guide} />
        </motion.header>

        {guide.sections.map((s) => (
          <motion.section key={s.id} variants={reveal} id={s.id} aria-labelledby={`${s.id}-h`} className="mt-12 scroll-mt-20">
            <h2 id={`${s.id}-h`} className={t.h2}>{s.title}</h2>
            <div className="mt-3 space-y-4">
              <p className={t.body}><Text>{s.answer}</Text></p>
              {s.blocks.map((b, bi) => <Block key={bi} b={b} slug={guide.slug} id={`${s.id}-${bi}`} />)}
            </div>
          </motion.section>
        ))}

        <motion.section variants={reveal} id="faq" aria-labelledby="faq-h" className="mt-12 scroll-mt-20">
          <h2 id="faq-h" className={t.h2}>FAQ</h2>
          <div className="mt-4 space-y-5">
            {guide.faq.map((f) => (
              <div key={f.q}>
                <h3 className={t.h3}>{f.q}</h3>
                <p className={cn(t.body, 'mt-1')}><Text>{f.a}</Text></p>
              </div>
            ))}
          </div>
        </motion.section>

        {guide.related.length > 0 && (
          <motion.section variants={reveal} aria-labelledby="related-h" className="mt-12">
            <h2 id="related-h" className={t.h2}>Components in this guide</h2>
            <div className="mt-4"><ComponentCards slugs={guide.related} /></div>
          </motion.section>
        )}

        <GuidePrevNext slug={guide.slug} />
      </motion.article>
      <TocRail guide={guide} active={active} />
    </div>
  )
}

/** /guides: the CategoryPage layout (breadcrumb, H1, count line, card grid, chip row). */
export function GuidesIndexPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <DocBreadcrumb trail={[{ name: 'Docs', to: '/docs/introduction' }, { name: GUIDES_TITLE }]} />
      <h1 className={t.h1}>{GUIDES_TITLE}</h1>
      <p className="mt-3 max-w-[65ch] text-base text-zinc-700 dark:text-zinc-400">{GUIDES_DESC}</p>

      <motion.ul variants={stagger} initial="hidden" animate="show" className="mt-8 grid gap-3 sm:grid-cols-2">
        {GUIDES.map((g) => (
          <motion.li key={g.slug} variants={reveal}>
            <Link to={`/guides/${g.slug}`} className={t.card}>
              <span className="flex items-start justify-between gap-3">
                <span className="text-base font-semibold tracking-tight">{g.title}</span>
                <ArrowUpRight aria-hidden className="h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal-700 dark:group-hover:text-signal-300" />
              </span>
              <span className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-400">{g.description}</span>
              <span className="mt-auto pt-3 text-xs text-zinc-600 dark:text-zinc-400">{readingMinutes(g)} min read</span>
            </Link>
          </motion.li>
        ))}
      </motion.ul>

      <nav aria-label="Getting started" className="mt-14 border-t border-zinc-950/[0.08] pt-8 dark:border-white/[0.08]">
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Getting started</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {[['Introduction', '/docs/introduction'], ['Installation', '/docs/installation'], ['Theming', '/docs/theming']].map(([label, to]) => (
            <li key={to}><Link to={to} className={t.chip}>{label}</Link></li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
