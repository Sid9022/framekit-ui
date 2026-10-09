import type * as React from 'react'
import { PaperfoldGradientPlane } from '@/components/ui/paperfold-gradient-plane'

const demo: React.ReactNode = (
    <PaperfoldGradientPlane className="flex h-56 w-full max-w-xl items-center justify-center">
      <p className="rounded-xl bg-white/50 px-4 py-2 text-sm font-medium text-zinc-800 backdrop-blur dark:bg-black/40 dark:text-zinc-100">Paperfold</p>
    </PaperfoldGradientPlane>
  )

export default demo
