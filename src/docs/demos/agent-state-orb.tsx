import type * as React from 'react'
import { AgentStateOrb } from '@/components/ui/agent-state-orb'

const demo: React.ReactNode = (
    <div className="flex w-full max-w-sm justify-center rounded-2xl bg-zinc-100/80 ring-1 ring-black/[0.04] dark:bg-[#0c0a12] dark:ring-0 p-10">
      <AgentStateOrb />
    </div>
  )

export default demo
