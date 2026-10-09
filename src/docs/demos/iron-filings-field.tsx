import type * as React from 'react'
import { IronFilingsField } from '@/components/ui/iron-filings-field'

function IronFilingsDemo() {
  return (
    <IronFilingsField className="max-w-3xl">
      <div className="pointer-events-none absolute inset-x-0 top-10 flex flex-col items-center text-center">
        <span className="rounded-full bg-white/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600 ring-1 ring-black/[0.06] backdrop-blur dark:bg-black/40 dark:text-zinc-300 dark:ring-white/10">Field study</span>
        <h3 className="mt-3 font-display text-4xl tracking-tight text-zinc-900 dark:text-white">Opposites attract.</h3>
      </div>
    </IronFilingsField>
  )
}

const demo: React.ReactNode = <IronFilingsDemo />

export default demo
