import * as React from 'react'
import { type MeshPillOrbState, MESH_PILL_ORB_PALETTES, MeshPillOrb } from '@/components/ui/mesh-pill-orb'
import { demoChip } from './_shared/demo-chip'

const MESH_STATES: MeshPillOrbState[] = ['idle', 'listening', 'thinking', 'speaking']

const MESH_SCRIPT: { state: MeshPillOrbState; ms: number; who?: 'You' | 'Agent'; line: string }[] = [
  { state: 'idle', ms: 4200, line: 'Standing by — say the word.' },
  { state: 'listening', ms: 3800, who: 'You', line: 'What’s left on the launch checklist for Friday?' },
  { state: 'thinking', ms: 2600, line: 'Scanning the project board…' },
  { state: 'speaking', ms: 5000, who: 'Agent', line: 'Two items: final QA pass and the pricing page copy. Both owned by Mira.' },
]

function MeshPillOrbDemo() {
  const [auto, setAuto] = React.useState(true)
  const [step, setStep] = React.useState(0)
  const [state, setState] = React.useState<MeshPillOrbState>('idle')
  const [palette, setPalette] = React.useState<keyof typeof MESH_PILL_ORB_PALETTES>('lava')
  React.useEffect(() => {
    if (!auto) return
    const cur = MESH_SCRIPT[step]
    setState(cur.state)
    const id = window.setTimeout(() => setStep((i) => (i + 1) % MESH_SCRIPT.length), cur.ms)
    return () => window.clearTimeout(id)
  }, [auto, step])
  const pick = (s: MeshPillOrbState) => {
    setAuto(false)
    setState(s)
  }
  const caption = auto ? MESH_SCRIPT[step] : null
  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-7 overflow-hidden rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#f1eef8)] px-6 pb-8 pt-20 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] ring-1 ring-black/[0.06] dark:bg-[radial-gradient(90%_70%_at_50%_35%,#120a1f,#030204)] dark:shadow-none dark:ring-white/5">
      <MeshPillOrb
        state={state}
        size={200}
        colors={MESH_PILL_ORB_PALETTES[palette]}
        onClick={() => pick(MESH_STATES[(MESH_STATES.indexOf(state) + 1) % MESH_STATES.length])}
        label="Launch assistant"
      />
      <p className="flex min-h-5 items-center gap-2 text-center text-[12px] text-zinc-500 dark:text-zinc-400">
        {caption ? (
          <>
            {caption.who && (
              <span className="rounded-full bg-zinc-900/[0.06] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
                {caption.who}
              </span>
            )}
            <span key={step}>{caption.line}</span>
          </>
        ) : (
          <span>Click the orb to cycle states — it glances toward your cursor.</span>
        )}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-1" role="radiogroup" aria-label="Orb state">
        <button type="button" role="radio" aria-checked={auto} className={demoChip(auto)} onClick={() => { setAuto(true); setStep(0) }}>
          Auto
        </button>
        {MESH_STATES.map((s) => (
          <button key={s} type="button" role="radio" aria-checked={!auto && state === s} className={demoChip(!auto && state === s)} onClick={() => pick(s)}>
            {s}
          </button>
        ))}
        <span className="mx-2 h-4 w-px bg-black/10 dark:bg-white/10" />
        {(Object.keys(MESH_PILL_ORB_PALETTES) as (keyof typeof MESH_PILL_ORB_PALETTES)[]).map((k) => {
          const c = MESH_PILL_ORB_PALETTES[k]
          return (
            <button
              key={k}
              type="button"
              aria-label={`${k} palette`}
              aria-pressed={palette === k}
              onClick={() => setPalette(k)}
              className={'mx-0.5 h-5 w-5 rounded-full outline-none ring-offset-2 ring-offset-white transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:ring-offset-[#07050b] dark:focus-visible:ring-white ' + (palette === k ? 'ring-2 ring-zinc-900/60 dark:ring-white/70' : '')}
              style={{ background: `conic-gradient(${c[0]}, ${c[1]}, ${c[3]}, ${c[2]}, ${c[0]})` }}
            />
          )
        })}
      </div>
      <div className="flex items-end justify-center gap-8 border-t border-black/5 pt-6 dark:border-white/5">
        <MeshPillOrb size={56} state="listening" colors={MESH_PILL_ORB_PALETTES.lagoon} rings={false} label="Mini orb" />
        <MeshPillOrb size={72} state="speaking" colors={MESH_PILL_ORB_PALETTES.lava} rings={false} label="Mini orb" />
        <MeshPillOrb size={56} state="thinking" colors={MESH_PILL_ORB_PALETTES.dusk} rings={false} label="Mini orb" />
      </div>
    </div>
  )
}

const demo: React.ReactNode = <MeshPillOrbDemo />

export default demo
