import type * as React from 'react'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { PortfolioArt } from '@/lib/portfolio-art'
import { PfScrollFrame } from './_shared/pf-scroll-frame'

function ScrollRevealDemo() {
  const effects = ['rise', 'fade', 'blur', 'scale', 'clip', 'slide-left', 'slide-right'] as const
  return (
    <PfScrollFrame label="Scroll reveal preview (scrollable)" height={480}>
      {(ref) => (
        <div className="mx-auto max-w-xl space-y-24 py-10">
          <p className="text-center text-sm text-zinc-700 dark:text-zinc-300">Scroll down — each block enters with its own effect.</p>
          {effects.map((e) => (
            <ScrollReveal key={e} effect={e} scrollContainer={ref}>
              <div className="rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="font-mono text-xs text-signal-700 dark:text-signal-300">effect=&quot;{e}&quot;</p>
                <p className="mt-2 font-display text-4xl text-zinc-950 dark:text-zinc-50">{e === 'rise' ? 'Rise gently' : e === 'fade' ? 'Fade in' : e === 'blur' ? 'Focus pull' : e === 'scale' ? 'Scale up' : e === 'clip' ? 'Unwipe' : e === 'slide-left' ? 'From the left' : 'From the right'}</p>
              </div>
            </ScrollReveal>
          ))}
          <ScrollReveal stagger={0.1} effect="rise" scrollContainer={ref} className="grid grid-cols-3 gap-3">
            {[3, 11, 19].map((s) => <div key={s} className="aspect-square overflow-hidden rounded-2xl"><PortfolioArt seed={s} /></div>)}
          </ScrollReveal>
          <p className="pb-6 text-center text-sm text-zinc-700 dark:text-zinc-300">stagger={'{0.1}'} reveals direct children one by one ↑</p>
        </div>
      )}
    </PfScrollFrame>
  )
}

const demo: React.ReactNode = <ScrollRevealDemo />

export default demo
