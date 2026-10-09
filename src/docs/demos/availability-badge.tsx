import * as React from 'react'
import { AvailabilityBadge } from '@/components/ui/availability-badge'
import { handleTablistKeys } from '@/lib/roving'

function AvailabilityDemo() {
  const [s, setS] = React.useState<'open' | 'limited' | 'booked'>('open')
  return (
    <div className="flex flex-col items-center gap-5">
      <AvailabilityBadge status={s} timeZone="Europe/Lisbon" />
      <div role="radiogroup" aria-label="Availability status" onKeyDown={handleTablistKeys} className="flex gap-1.5 rounded-full border border-zinc-300 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-900">
        {(['open', 'limited', 'booked'] as const).map((k) => (
          <button key={k} type="button" role="radio" aria-checked={s === k} tabIndex={s === k ? 0 : -1} onClick={() => setS(k)} className={`min-h-11 rounded-full px-4 text-sm font-medium capitalize ${s === k ? 'bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950' : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'}`}>{k}</button>
        ))}
      </div>
    </div>
  )
}

const demo: React.ReactNode = <AvailabilityDemo />

export default demo
