import type * as React from 'react'
import { TypingWaveIndicator } from '@/components/ui/typing-wave-indicator'

const demo: React.ReactNode = (
    <div className="flex w-full max-w-md flex-col items-start gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Agent handoff</p>
      <TypingWaveIndicator />
    </div>
  )

export default demo
