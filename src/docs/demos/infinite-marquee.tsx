import type * as React from 'react'
import { InfiniteMarquee } from '@/components/ui/infinite-marquee'

const demo: React.ReactNode = (
    <div className="w-full max-w-lg space-y-3">
      <InfiniteMarquee className="py-1" speed={26} gap={12} label="Highlights">
        {['Motion', 'Tailwind v4', 'React 19', 'Accessible', 'Copy-paste', 'MIT licensed'].map((t, i) => (
          <span
            key={t}
            className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-medium text-zinc-800 ring-1 ring-zinc-950/[0.07] shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:bg-zinc-900 dark:text-zinc-200 dark:ring-white/10"
          >
            <span aria-hidden className={['bg-framekit-500', 'bg-sky-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'][i] + ' h-1.5 w-1.5 rounded-full'} />
            {t}
          </span>
        ))}
      </InfiniteMarquee>
      <InfiniteMarquee className="py-1" speed={32} gap={12} reverse showControls label="Integrations">
        {['Dark mode', 'Reduced motion', 'Keyboard first', 'Zero runtime', 'shadcn CLI', 'Type-safe'].map((t) => (
          <span
            key={t}
            className="inline-flex items-center rounded-full bg-zinc-950/[0.04] px-3.5 py-1.5 text-[13px] text-zinc-600 ring-1 ring-zinc-950/[0.05] dark:bg-white/[0.05] dark:text-zinc-300 dark:ring-white/[0.06]"
          >
            {t}
          </span>
        ))}
      </InfiniteMarquee>
    </div>
  )

export default demo
