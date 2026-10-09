import * as React from 'react'
import { GlassMegaNavbar } from '@/components/ui/glass-mega-navbar'

function NavbarDemo() {
  const ref = React.useRef<HTMLDivElement>(null)
  return (
    <div ref={ref} className="relative h-[460px] w-full overflow-y-auto rounded-[20px] border border-black/[0.06] bg-gradient-to-b from-zinc-50 to-white dark:border-white/[0.08] dark:from-zinc-950 dark:to-zinc-900">
      <GlassMegaNavbar scrollContainer={ref} />
      <div className="mx-auto max-w-2xl px-6 pb-[600px] pt-20 text-center">
        <h3 className="text-balance text-3xl font-semibold tracking-[-0.03em] text-zinc-950 dark:text-white">Scroll this frame</h3>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">The bar contracts into a floating glass pill. Hover Product or Resources for the mega menu.</p>
      </div>
    </div>
  )
}

const demo: React.ReactNode = <NavbarDemo />

export default demo
