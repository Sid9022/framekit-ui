import * as React from 'react'
import { type ParticleShape, type ParticleMorphState, ParticleMorphLoader } from '@/components/ui/particle-morph-loader'
import { wait } from './_shared/wait'

const PM_SHAPES: ParticleShape[] = ['sphere', 'ribbon', 'shell', 'tetra', 'ring', 'helix']

const PM_TINTS = [
  { name: 'Iris', hex: '#a78bfa' },
  { name: 'Glacier', hex: '#7dd3fc' },
  { name: 'Ember', hex: '#fdba74' },
  { name: 'Bloom', hex: '#f9a8d4' },
]

function ParticleMorphLoaderDemo() {
  const [shape, setShape] = React.useState<ParticleShape | 'all'>('all')
  const [tint, setTint] = React.useState(PM_TINTS[0].hex)
  const [state, setState] = React.useState<ParticleMorphState>('loading')
  const run = React.useRef(0)
  const finish = async (to: ParticleMorphState) => {
    const id = ++run.current
    setState(to)
    if (to === 'done') {
      await wait(2400)
      if (id === run.current) setState('loading')
    }
  }
  const chip = (active: boolean) =>
    'rounded-full px-2.5 py-1 text-[11px] font-medium capitalize outline-none transition-colors focus-visible:ring-2 focus-visible:ring-violet-300 ' +
    (active ? 'bg-zinc-900/[0.06] text-zinc-900 ring-1 ring-black/10 dark:bg-white/12 dark:text-white dark:ring-white/15' : 'text-zinc-500 hover:bg-black/5 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-200')
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-6 rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#f0eff4)] shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] dark:shadow-none dark:bg-[radial-gradient(90%_70%_at_50%_30%,#15131d,#050507)] px-6 pb-8 pt-10 ring-1 ring-black/[0.06] dark:ring-white/5">
      <ParticleMorphLoader
        size={220}
        color={tint}
        shapes={shape === 'all' ? PM_SHAPES : [shape]}
        state={state}
        onRetry={() => finish('loading')}
      />
      <div className="flex flex-wrap items-center justify-center gap-1" role="group" aria-label="Shape">
        {(['all', ...PM_SHAPES] as const).map((s) => (
          <button key={s} type="button" aria-pressed={shape === s} className={chip(shape === s)} onClick={() => setShape(s)}>
            {s === 'all' ? 'Cycle all' : s}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-1.5" role="group" aria-label="Tint">
          {PM_TINTS.map((t) => (
            <button
              key={t.hex}
              type="button"
              aria-label={t.name}
              aria-pressed={tint === t.hex}
              onClick={() => setTint(t.hex)}
              className={'h-5 w-5 rounded-full outline-none ring-offset-2 ring-offset-white transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:ring-offset-[#0b0a10] dark:focus-visible:ring-white ' + (tint === t.hex ? 'ring-2 ring-zinc-900/60 dark:ring-white/70' : '')}
              style={{ background: t.hex }}
            />
          ))}
        </div>
        <span className="h-4 w-px bg-black/10 dark:bg-white/10" />
        <button type="button" className={chip(state === 'done')} onClick={() => finish('done')}>Resolve</button>
        <button type="button" className={chip(state === 'error')} onClick={() => finish('error')}>Fail</button>
      </div>
      <div className="flex items-end justify-center gap-8 border-t border-black/5 pt-6 dark:border-white/5">
        <ParticleMorphLoader size={72} points={160} color="#7dd3fc" showLabel={false} speed={1.3} shapes={['shell', 'ring', 'helix']} />
        <ParticleMorphLoader size={96} points={220} color="#fdba74" showLabel={false} shapes={['tetra', 'sphere', 'ribbon']} />
        <ParticleMorphLoader size={120} points={260} color="#f9a8d4" labels={['Indexing…', 'Linking…', 'Ranking…']} speed={0.8} shapes={['ribbon', 'shell']} />
      </div>
    </div>
  )
}

const demo: React.ReactNode = <ParticleMorphLoaderDemo />

export default demo
