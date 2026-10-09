import type * as React from 'react'
import { InkBleedText } from '@/components/ui/ink-bleed-text'

const demo: React.ReactNode = (
    <div className="w-full max-w-2xl rounded-3xl bg-[#faf6ef] px-6 py-10 ring-1 ring-black/[0.05] sm:px-10 dark:bg-zinc-950 dark:ring-white/[0.07]">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-800 dark:text-rose-300">Issue 12 · Essay</p>
      <InkBleedText showReplay={false} />
      <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">Notes on why the best products feel inevitable in hindsight, and painfully slow while you are building them.</p>
      <p className="mt-6 text-[12px] text-zinc-600 dark:text-zinc-400">Use ↻ Replay above to bleed it again.</p>
    </div>
  )

export default demo
