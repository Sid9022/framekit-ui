import * as React from 'react'
import { GrainGradientField } from '@/components/ui/grain-gradient-field'

function GrainGradientFieldDemo() {
  const [pal, setPal] = React.useState<'aurora' | 'ember' | 'lagoon' | 'orchid'>('aurora')
  const pals = ['aurora', 'ember', 'lagoon', 'orchid'] as const
  return (
    <div className="w-full max-w-4xl">
      <GrainGradientField palette={pal} className="min-h-[380px]">
        <div className="flex min-h-[380px] flex-col items-center justify-center px-5 py-10 text-center">
          <div className="max-w-lg rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-zinc-950/60 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-600 dark:text-zinc-400">Backgrounds / grain gradient</p>
            <h3 className="mt-3 font-display text-4xl leading-[1.05] text-zinc-950 dark:text-zinc-50 sm:text-5xl">Colour with a little tooth.</h3>
            <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">Four slow blobs, real film grain and a light that follows you.</p>
            <div role="radiogroup" aria-label="Palette" className="mt-5 flex flex-wrap justify-center gap-2">
              {pals.map((p) => (
                <button key={p} type="button" role="radio" aria-checked={pal === p} onClick={() => setPal(p)} className={'min-h-11 rounded-full border px-4 text-sm font-medium capitalize outline-none transition-colors focus-visible:ring-2 focus-visible:ring-signal-600 dark:focus-visible:ring-signal-300 ' + (pal === p ? 'border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950' : 'border-zinc-300 bg-white/70 text-zinc-900 hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100')}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      </GrainGradientField>
    </div>
  )
}

const demo: React.ReactNode = <GrainGradientFieldDemo />

export default demo
