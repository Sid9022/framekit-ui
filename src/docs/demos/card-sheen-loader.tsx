import type * as React from 'react'
import { CardSheenLoader } from '@/components/ui/card-sheen-loader'

const demo: React.ReactNode = (
    <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-2xl bg-gradient-to-b from-zinc-100 to-zinc-200 p-8 dark:from-[#121018] dark:to-zinc-950">
      <p className="self-start font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Loading · Card sheen</p>
      <CardSheenLoader />
    </div>
  )

export default demo
