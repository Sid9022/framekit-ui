import type * as React from 'react'
import { SectionSpyNav } from '@/components/ui/section-spy-nav'
import { PfScrollFrame } from './_shared/pf-scroll-frame'

function SectionSpyDemo() {
  const sections = [
    { id: 'demo-spy-work', label: 'Work' },
    { id: 'demo-spy-about', label: 'About' },
    { id: 'demo-spy-journal', label: 'Journal' },
    { id: 'demo-spy-contact', label: 'Contact' },
  ]
  const body: Record<string, string> = {
    'demo-spy-work': 'Six case studies across product, web and brand — each with the problem, the process and the numbers.',
    'demo-spy-about': 'Nine years across design and engineering, currently leading motion language for a product team of forty.',
    'demo-spy-journal': 'Notes on craft: motion budgets, accessible animation, and why springs beat easing curves.',
    'demo-spy-contact': 'Booking projects from November. Say hello and tell me about the thing you want to make.',
  }
  return (
    <PfScrollFrame label="Section spy preview (scrollable)" height={480}>
      {(ref) => (
        <>
          <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-4 bg-stone-50/90 px-4 pb-2 pt-4 backdrop-blur sm:-mx-8 sm:-mt-8 sm:px-8 sm:pt-8 dark:bg-zinc-950/90"><SectionSpyNav sections={sections} scrollContainer={ref} /></div>
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="flex min-h-[340px] scroll-mt-20 flex-col justify-center gap-3 border-b border-zinc-200 py-8 outline-none last:border-0 dark:border-zinc-800">
              <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">0{i + 1}</p>
              <h2 id={`${s.id}-h`} className="font-display text-5xl text-zinc-950 dark:text-zinc-50">{s.label}</h2>
              <p className="max-w-[46ch] text-zinc-700 dark:text-zinc-300">{body[s.id]}</p>
            </section>
          ))}
        </>
      )}
    </PfScrollFrame>
  )
}

const demo: React.ReactNode = <SectionSpyDemo />

export default demo
