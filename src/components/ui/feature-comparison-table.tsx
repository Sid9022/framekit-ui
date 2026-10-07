import * as React from 'react'
import { motion } from 'motion/react'
import { Check, Minus, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type CompareValue = boolean | string
export type CompareRow = { feature: string; hint?: string; values: CompareValue[] }
export type CompareGroup = { title: string; rows: CompareRow[] }

export type FeatureComparisonTableProps = {
  plans?: string[]
  /** Column index to highlight. */
  highlight?: number
  groups?: CompareGroup[]
  className?: string
}

export const DEFAULT_COMPARE_PLANS = ['Hobby', 'Pro', 'Enterprise']
export const DEFAULT_COMPARE_GROUPS: CompareGroup[] = [
  { title: 'Build and deploy', rows: [
    { feature: 'Concurrent builds', values: ['1', '12', 'Custom'] },
    { feature: 'Preview deployments', values: [true, true, true] },
    { feature: 'Build cache', hint: 'Shared across branches', values: [false, true, true] },
    { feature: 'Rollbacks', values: ['Last 1', 'Unlimited', 'Unlimited'] },
  ] },
  { title: 'Collaboration', rows: [
    { feature: 'Team members', values: ['1', 'Up to 20', 'Unlimited'] },
    { feature: 'Comments on previews', values: [true, true, true] },
    { feature: 'Roles and permissions', values: [false, true, true] },
  ] },
  { title: 'Security', rows: [
    { feature: 'SSO and SCIM', values: [false, false, true] },
    { feature: 'Audit logs', values: [false, '30 days', '1 year'] },
    { feature: 'Uptime SLA', values: [false, '99.9%', '99.99%'] },
  ] },
]

/**
 * Feature Comparison Table — a sticky-header plan comparison with collapsible
 * groups, a highlighted column that glows behind its cells, a row crosshair on
 * hover, and a plan switcher on phones that shows one column at a time.
 */
export function FeatureComparisonTable({ plans = DEFAULT_COMPARE_PLANS, highlight = 1, groups = DEFAULT_COMPARE_GROUPS, className }: FeatureComparisonTableProps) {
  const reduced = usePrefersReducedMotion()
  const id = React.useId()
  const [closed, setClosed] = React.useState<string[]>([])
  const [mobilePlan, setMobilePlan] = React.useState(highlight)
  const cell = (v: CompareValue) =>
    v === true ? <><Check aria-hidden className="mx-auto size-4 text-zinc-900 dark:text-white" /><span className="sr-only">Included</span></>
      : v === false ? <><Minus aria-hidden className="mx-auto size-4 text-zinc-500 dark:text-zinc-500" /><span className="sr-only">Not included</span></>
      : <span className="tabular-nums text-zinc-800 dark:text-zinc-200">{v}</span>
  return (
    <div className={cn('w-full', className)}>
      <div role="group" aria-label="Plan to show" className="mb-3 flex gap-1 rounded-full border border-black/[0.08] bg-black/[0.03] p-1 sm:hidden dark:border-white/10 dark:bg-white/[0.05]">
        {plans.map((p, i) => (
          <button key={p} aria-pressed={mobilePlan === i} type="button" onClick={() => setMobilePlan(i)} className="relative h-9 flex-1 rounded-full text-sm font-medium text-zinc-700 aria-pressed:text-zinc-950 dark:text-zinc-300 dark:aria-pressed:text-white">
            {mobilePlan === i && <motion.span layoutId={`${id}-m`} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 36 }} className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-zinc-800" />}
            <span className="relative">{p}</span>
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-[20px] border border-black/[0.08] bg-white dark:border-white/10 dark:bg-zinc-900/60">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">Plan feature comparison</caption>
          <thead className="sticky top-0 z-10 bg-white/90 backdrop-blur dark:bg-zinc-900/90">
            <tr className="border-b border-black/[0.06] dark:border-white/[0.08]">
              <th scope="col" className="w-[44%] px-4 py-4 text-left text-xs font-medium uppercase tracking-[0.08em] text-zinc-600 dark:text-zinc-400">Features</th>
              {plans.map((p, i) => (
                <th key={p} scope="col" className={cn('px-3 py-4 text-center text-[15px] font-semibold text-zinc-950 dark:text-white', i !== mobilePlan && 'hidden sm:table-cell', i === highlight && 'bg-signal-500/[0.08]')}>
                  {p}{i === highlight && <span className="ml-1.5 hidden rounded-full bg-zinc-900 px-1.5 py-0.5 align-middle text-[10px] font-medium text-white sm:inline dark:bg-white dark:text-zinc-900">Popular</span>}
                </th>
              ))}
            </tr>
          </thead>
          {groups.map((g) => {
            const shut = closed.includes(g.title)
            return (
              <tbody key={g.title}>
                <tr>
                  <th colSpan={plans.length + 1} scope="colgroup" className="p-0 text-left">
                    <button type="button" aria-expanded={!shut} onClick={() => setClosed((c) => (shut ? c.filter((x) => x !== g.title) : [...c, g.title]))}
                      className="flex h-11 w-full items-center gap-2 bg-black/[0.02] px-4 text-[13px] font-semibold text-zinc-900 hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-signal-500 dark:bg-white/[0.03] dark:text-zinc-100 dark:hover:bg-white/[0.05]">
                      <ChevronDown aria-hidden className={cn('size-4 transition-transform duration-200', shut && '-rotate-90')} />{g.title}
                    </button>
                  </th>
                </tr>
                {!shut && g.rows.map((r, ri) => (
                  <motion.tr key={r.feature} initial={reduced ? false : { opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ri * 0.03, duration: 0.2 }}
                    className="border-t border-black/[0.05] transition-colors hover:bg-black/[0.02] dark:border-white/[0.06] dark:hover:bg-white/[0.03]">
                    <th scope="row" className="px-4 py-3 text-left font-normal text-zinc-800 dark:text-zinc-200">
                      {r.feature}{r.hint && <span className="block text-xs text-zinc-600 dark:text-zinc-400">{r.hint}</span>}
                    </th>
                    {r.values.map((v, i) => <td key={i} className={cn('px-3 py-3 text-center', i !== mobilePlan && 'hidden sm:table-cell', i === highlight && 'bg-signal-500/[0.08]')}>{cell(v)}</td>)}
                  </motion.tr>
                ))}
              </tbody>
            )
          })}
        </table>
      </div>
    </div>
  )
}
