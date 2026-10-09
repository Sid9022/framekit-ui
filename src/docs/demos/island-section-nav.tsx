import type * as React from 'react'
import { Home as P2Home, Briefcase as P2Briefcase, PenLine as P2Pen, Mail as P2Mail } from 'lucide-react'
import { PortfolioArt } from '@/lib/portfolio-art'
import { IslandSectionNav } from '@/components/ui/island-section-nav'
import { PfScrollFrame } from './_shared/pf-scroll-frame'

function IslandNavDemo() {
  const secs = [
    { id: 'isl-intro', label: 'Intro', icon: <P2Home />, seed: 3, t: 'Hello, I make interfaces feel inevitable.' },
    { id: 'isl-work', label: 'Work', icon: <P2Briefcase />, seed: 11, t: 'Selected work from the last three years.' },
    { id: 'isl-notes', label: 'Notes', icon: <P2Pen />, seed: 19, t: 'Short essays on motion, type and craft.' },
    { id: 'isl-contact', label: 'Contact', icon: <P2Mail />, seed: 26, t: 'Say hello — I reply within a day.' },
  ]
  return (
    <PfScrollFrame label="Island nav preview (scrollable)" height={500}>
      {(ref) => (
        <div className="mx-auto max-w-2xl">
          {secs.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-2 pb-8">
              <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <div className="h-40 sm:h-48"><PortfolioArt seed={s.seed} /></div>
                <div className="p-6"><p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">0{i + 1} / {s.label}</p><h2 className="mt-2 font-display text-3xl leading-tight text-zinc-950 dark:text-zinc-50">{s.t}</h2></div>
              </div>
            </section>
          ))}
          <IslandSectionNav sections={secs.map(({ id, label, icon }) => ({ id, label, icon }))} scrollContainer={ref} />
        </div>
      )}
    </PfScrollFrame>
  )
}

const demo: React.ReactNode = <IslandNavDemo />

export default demo
