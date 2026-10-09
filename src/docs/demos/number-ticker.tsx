import type * as React from 'react'
import { NumberTicker } from '@/components/ui/number-ticker'

const demo: React.ReactNode = (
    <dl className="grid w-full max-w-xl grid-cols-1 divide-y divide-zinc-950/[0.07] rounded-2xl bg-white ring-1 ring-zinc-950/[0.07] shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-white/[0.08] dark:bg-zinc-900/60 dark:ring-white/[0.08]">
      {[
        { v: 12840, label: 'components shipped', d: 0, p: '', s: '' },
        { v: 99.98, label: 'uptime, last 90 days', d: 2, p: '', s: '%' },
        { v: 4.2, label: 'installs per month', d: 1, p: '', s: 'M' },
      ].map((x, i) => (
        <div key={x.label} className="px-6 py-5 text-center sm:text-left">
          <dt className="text-[13px] text-zinc-500 dark:text-zinc-400">{x.label}</dt>
          <dd className="mt-1 text-4xl font-semibold tracking-[-0.03em] text-zinc-950 dark:text-white">
            <NumberTicker value={x.v} decimals={x.d} prefix={x.p} suffix={x.s} delay={i * 120} />
          </dd>
        </div>
      ))}
    </dl>
  )

export default demo
