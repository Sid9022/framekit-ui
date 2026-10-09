/* Demo helper shared by several docs demos. */
import * as React from 'react'

export function PfScrollFrame({ label, height = 520, children }: { label: string; height?: number; children: (ref: React.RefObject<HTMLDivElement | null>) => React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)
  return (
    <div ref={ref} role="region" aria-label={label} tabIndex={0} style={{ height }} className="relative w-full max-w-4xl overflow-y-auto overscroll-contain rounded-2xl border border-zinc-200 bg-stone-50 p-4 sm:p-8 dark:border-zinc-800 dark:bg-zinc-950">
      {children(ref)}
    </div>
  )
}
