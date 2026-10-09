import type * as React from 'react'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { Gauge as UpGauge, ArrowRight as UpArrow } from 'lucide-react'
import { Link } from 'react-router-dom'

const demo: React.ReactNode = (
    <SpotlightCard className="w-full max-w-sm">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-framekit-500/10 ring-1 ring-framekit-500/20">
        <UpGauge aria-hidden className="h-5 w-5 text-framekit-600 dark:text-framekit-400" />
      </div>
      <h3 className="text-[17px] font-semibold tracking-[-0.012em]">Edge-fast by default</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        Pages render close to your visitors, with a median time-to-first-byte under 50&nbsp;ms.
      </p>
      <Link to="/docs/spotlight-card" className="mt-4 inline-flex min-h-11 items-center gap-1 rounded-md text-sm font-medium text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-600 dark:text-white dark:focus-visible:ring-signal-300">
        Learn more <UpArrow aria-hidden className="h-4 w-4" />
      </Link>
    </SpotlightCard>
  )

export default demo
