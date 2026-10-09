import type * as React from 'react'
import { PerspectiveTunnelCarousel } from '@/components/ui/perspective-tunnel-carousel'

const demo: React.ReactNode = (
    <div className="relative w-full overflow-hidden rounded-[28px] bg-[#F4F4F4] py-10 dark:bg-[#0B0B0C]">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply dark:opacity-[0.1] dark:mix-blend-screen dark:invert" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      <p className="relative text-center font-display text-[clamp(1.75rem,1.2rem+2vw,2.75rem)] leading-none tracking-[-0.02em] text-zinc-950 dark:text-white">Step into the <span className="italic">gallery.</span></p>
      <PerspectiveTunnelCarousel className="mt-6 h-[360px] sm:h-[420px]" />
    </div>
  )

export default demo
