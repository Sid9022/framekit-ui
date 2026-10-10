import { motion } from 'motion/react'
import { PRIVACY_SECTIONS, PRIVACY_SUMMARY, PRIVACY_TITLE, PRIVACY_UPDATED, privacyInline } from '@/docs/privacy'
import { SITE } from '@/config/site'
import { DocBreadcrumb, DocTable, InlineText } from '@/components/docs/prose'
import { docReveal as reveal, docStagger as stagger, docText as t } from '@/components/docs/prose-styles'
import { cn } from '@/lib/cn'

/* Small print in the docs page anatomy: breadcrumb, sans H1, lede, short sections, the props-table look for the keys. */

const updated = new Date(`${PRIVACY_UPDATED}T12:00:00Z`).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })

const Text = ({ children }: { children: string }) => <InlineText parts={privacyInline(children)} />

export function PrivacyPage() {
  return (
    <motion.article className="mx-auto max-w-4xl" variants={stagger} initial="hidden" animate="show">
      <motion.header variants={reveal}>
        <DocBreadcrumb trail={[{ name: SITE.name, to: '/' }, { name: 'Privacy' }]} />
        <h1 className={t.h1}>{PRIVACY_TITLE}</h1>
        <p className={t.lede}>{PRIVACY_SUMMARY}</p>
        <p className={cn(t.meta, 'mt-4')}>
          Last updated <time dateTime={PRIVACY_UPDATED}>{updated}</time>
        </p>
      </motion.header>

      {PRIVACY_SECTIONS.map((s) => (
        <motion.section key={s.id} variants={reveal} id={s.id} aria-labelledby={`${s.id}-h`} className="mt-10 scroll-mt-20">
          <h2 id={`${s.id}-h`} className="text-base font-semibold tracking-tight">{s.title}</h2>
          <div className="mt-2 space-y-3">
            {s.paras?.map((p, i) => <p key={i} className={t.body}><Text>{p}</Text></p>)}
            {s.items && (
              <ul className={cn(t.body, 'list-disc space-y-1 pl-5')}>
                {s.items.map((it, i) => <li key={i}><Text>{it}</Text></li>)}
              </ul>
            )}
            {s.table && <DocTable className="pt-1" caption={s.table.caption} head={s.table.head} rows={s.table.rows} mono />}
          </div>
        </motion.section>
      ))}
    </motion.article>
  )
}
