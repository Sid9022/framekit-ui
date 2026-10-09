import * as React from 'react'
import { type BubbleBuddyState, GlassBubbleBuddy } from '@/components/ui/glass-bubble-buddy'

const BUDDY_STATES: BubbleBuddyState[] = ['idle', 'listening', 'thinking', 'speaking']

const BUDDY_HUES = [
  { name: 'Sky', hue: 212 },
  { name: 'Lilac', hue: 262 },
  { name: 'Mint', hue: 160 },
  { name: 'Peach', hue: 18 },
]

const BUDDY_SCRIPT: { state: BubbleBuddyState; ms: number; who?: 'You' | 'Buddy'; line: string }[] = [
  { state: 'idle', ms: 5200, line: 'Just hanging out — wave your cursor nearby.' },
  { state: 'listening', ms: 3600, who: 'You', line: 'Can you move my 3pm with Priya to tomorrow?' },
  { state: 'thinking', ms: 2600, line: 'Checking both calendars…' },
  { state: 'speaking', ms: 4600, who: 'Buddy', line: 'Done! Moved to Thursday at 10:30 — Priya’s free then too.' },
]

function GlassBubbleBuddyDemo() {
  const [state, setState] = React.useState<BubbleBuddyState>('idle')
  const [auto, setAuto] = React.useState(true)
  const [step, setStep] = React.useState(0)
  const [hue, setHue] = React.useState(212)
  React.useEffect(() => {
    if (!auto) return
    const cur = BUDDY_SCRIPT[step]
    setState(cur.state)
    const id = window.setTimeout(() => setStep((i) => (i + 1) % BUDDY_SCRIPT.length), cur.ms)
    return () => window.clearTimeout(id)
  }, [auto, step])
  const pick = (s: BubbleBuddyState) => {
    setAuto(false)
    setState(s)
  }
  const caption = auto ? BUDDY_SCRIPT[step] : null
  const chip = (active: boolean) =>
    'rounded-full px-3 py-1.5 text-[11px] font-medium capitalize outline-none transition-colors focus-visible:ring-2 focus-visible:ring-sky-400 ' +
    (active
      ? 'bg-zinc-900/[0.06] text-zinc-900 ring-1 ring-black/10 dark:bg-white/12 dark:text-white dark:ring-white/15'
      : 'text-zinc-500 hover:bg-black/5 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-200')
  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-5 rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#eef1f6)] px-6 pb-8 pt-10 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] ring-1 ring-black/[0.06] dark:bg-[radial-gradient(90%_70%_at_50%_30%,#0f1626,#040508)] dark:shadow-none dark:ring-white/5">
      <GlassBubbleBuddy
        state={state}
        hue={hue}
        size={210}
        onClick={() => pick(BUDDY_STATES[(BUDDY_STATES.indexOf(state) + 1) % BUDDY_STATES.length])}
      />
      <p aria-live="polite" className="flex h-5 items-center gap-2 text-center text-[12px] text-zinc-500 dark:text-zinc-400">
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
          <span>Click the buddy for a boing — hover for a shy smile.</span>
        )}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-1" role="radiogroup" aria-label="Assistant state">
        <button type="button" role="radio" aria-checked={auto} className={chip(auto)} onClick={() => { setAuto(true); setStep(0) }}>
          Auto
        </button>
        {BUDDY_STATES.map((s) => (
          <button key={s} type="button" role="radio" aria-checked={!auto && state === s} className={chip(!auto && state === s)} onClick={() => pick(s)}>
            {s}
          </button>
        ))}
        <span className="mx-2 h-4 w-px bg-black/10 dark:bg-white/10" />
        {BUDDY_HUES.map((h) => (
          <button
            key={h.hue}
            type="button"
            aria-label={h.name}
            aria-pressed={hue === h.hue}
            onClick={() => setHue(h.hue)}
            className={'mx-0.5 h-5 w-5 rounded-full outline-none ring-offset-2 ring-offset-white transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:ring-offset-[#0b0d14] dark:focus-visible:ring-white ' + (hue === h.hue ? 'ring-2 ring-zinc-900/60 dark:ring-white/70' : '')}
            style={{ background: `hsl(${h.hue} 90% 68%)` }}
          />
        ))}
      </div>
      <div className="flex items-end justify-center gap-6 border-t border-black/5 pt-6 dark:border-white/5">
        <GlassBubbleBuddy size={64} hue={262} state="listening" label="Mini assistant" />
        <GlassBubbleBuddy size={84} hue={160} state="thinking" label="Mini assistant" />
        <GlassBubbleBuddy size={64} hue={18} state="speaking" label="Mini assistant" />
        <GlassBubbleBuddy size={64} hue={212} mood="sleepy" label="Sleepy assistant" />
      </div>
    </div>
  )
}

const demo: React.ReactNode = <GlassBubbleBuddyDemo />

export default demo
