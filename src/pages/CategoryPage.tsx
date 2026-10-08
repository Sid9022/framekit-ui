import { Link, useParams } from 'react-router-dom'
import { motion, type Variants } from 'motion/react'
import { ArrowUpRight, ChevronRight } from 'lucide-react'
import { categorySlug, getCategoryBySlug, getNavGroups } from '@/docs/registry'
import { NotFound } from '@/components/docs/states'
import { cn } from '@/lib/cn'

const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } } }
const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

export function CategoryPage() {
  const { category = '' } = useParams()
  const title = getCategoryBySlug(category)
  const groups = getNavGroups()
  const group = groups.find((g) => g.title === title)

  if (!title || !group) return <NotFound slug={category} />

  return (
    <div className="mx-auto max-w-4xl">
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          <li><Link to="/docs/introduction" className="rounded-md px-1 py-0.5 underline-offset-2 hover:text-zinc-950 hover:underline dark:hover:text-white">Docs</Link></li>
          <li aria-hidden><ChevronRight className="h-3.5 w-3.5" /></li>
          <li aria-current="page" className="font-medium text-zinc-950 dark:text-white">{title}</li>
        </ol>
      </nav>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-3 text-base text-zinc-700 dark:text-zinc-400">
        {group.items.length} component{group.items.length === 1 ? '' : 's'} · pick one to see it live, then copy it into your project.
      </p>

      <motion.ul variants={list} initial="hidden" animate="show" className="mt-8 grid gap-3 sm:grid-cols-2">
        {group.items.map((d) => (
          <motion.li key={d.slug} variants={item}>
            <Link
              to={`/docs/${d.slug}`}
              className="group relative flex h-full min-h-[116px] flex-col rounded-2xl border border-zinc-950/[0.08] bg-white p-4 transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-signal-400 hover:shadow-[0_12px_28px_-16px_rgb(100_82_122/0.45)] active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-white/[0.08] dark:bg-zinc-900/40 dark:hover:border-signal-500"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="text-base font-semibold tracking-tight">{d.title}</span>
                <ArrowUpRight aria-hidden className="h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal-700 dark:group-hover:text-signal-300" />
              </span>
              <span className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-400">{d.description}</span>
              {(d.isNew || d.ownBackground) && (
                <span className="mt-auto flex flex-wrap gap-1.5 pt-3">
                  {d.isNew && <span className="rounded bg-signal-200 px-1.5 py-px text-[10px] font-semibold text-signal-900 dark:bg-signal-800 dark:text-signal-100">NEW</span>}
                  {d.ownBackground && <span className="rounded border border-zinc-300 px-1.5 py-px text-[10px] font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">Own background</span>}
                </span>
              )}
            </Link>
          </motion.li>
        ))}
      </motion.ul>

      <nav aria-label="Other categories" className="mt-14 border-t border-zinc-950/[0.08] pt-8 dark:border-white/[0.08]">
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Other categories</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {groups
            .filter((g) => g.title !== title && g.title !== 'Getting Started')
            .map((g) => (
              <li key={g.title}>
                <Link
                  to={`/docs/category/${categorySlug(g.title)}`}
                  className={cn('fk-touch inline-flex items-center rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-[background-color,border-color,transform] duration-150 hover:border-signal-400 hover:bg-white active:scale-95 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900')}
                >
                  {g.title} <span className="ml-1.5 tabular-nums text-zinc-600 dark:text-zinc-400">{g.items.length}</span>
                </Link>
              </li>
            ))}
        </ul>
      </nav>
    </div>
  )
}
