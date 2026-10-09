import * as React from 'react'
import { LiquidChargeCapsule } from '@/components/ui/liquid-charge-capsule'
import { demoChip } from './_shared/demo-chip'
import { wait } from './_shared/wait'

function LiquidChargeDemo() {
  const [auto, setAuto] = React.useState(true)
  const [level, setLevel] = React.useState(8)
  const [charging, setCharging] = React.useState(true)
  const [cycle, setCycle] = React.useState(0)
  React.useEffect(() => {
    if (!auto) return
    let alive = true
    let lvl = 8
    setLevel(8)
    setCharging(true)
    const run = async () => {
      await wait(500)
      while (alive && lvl < 100) {
        lvl = Math.min(100, lvl + 2)
        setLevel(lvl)
        await wait(lvl > 90 ? 150 : 95)
      }
      if (!alive) return
      await wait(2800)
      if (!alive) return
      setCharging(false)
      await wait(600)
      while (alive && lvl > 9) {
        lvl = Math.max(9, lvl - 3)
        setLevel(lvl)
        await wait(60)
      }
      await wait(1600)
      if (alive) setCycle((c) => c + 1)
    }
    void run()
    return () => {
      alive = false
    }
  }, [auto, cycle])
  const manual = (fn: () => void) => {
    setAuto(false)
    fn()
  }
  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-6 rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#eef1f4)] px-6 pb-6 pt-10 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] ring-1 ring-black/[0.06] dark:bg-[radial-gradient(90%_70%_at_50%_30%,#0f1a17,#040605)] dark:shadow-none dark:ring-white/5">
      <div className="flex items-end justify-center gap-10">
        <LiquidChargeCapsule level={level} charging={charging} onLevelChange={(v) => manual(() => setLevel(v))} label="Phone battery" />
        <div className="hidden flex-col gap-5 pb-16 sm:flex">
          <LiquidChargeCapsule height={96} level={14} showReadout={false} label="Earbuds battery" />
          <LiquidChargeCapsule height={96} level={52} charging showReadout={false} label="Watch battery" />
        </div>
        <div className="hidden pb-16 sm:block">
          <LiquidChargeCapsule height={96} level={100} showReadout={false} label="Tablet battery" />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1" role="group" aria-label="Battery controls">
        <button type="button" aria-pressed={auto} className={demoChip(auto)} onClick={() => { setAuto(true); setCycle((c) => c + 1) }}>
          Auto
        </button>
        <button type="button" role="switch" aria-checked={charging} className={demoChip(charging)} onClick={() => manual(() => setCharging((c) => !c))}>
          {charging ? 'Plugged in' : 'Unplugged'}
        </button>
        <span className="mx-2 h-4 w-px bg-black/10 dark:bg-white/10" />
        {[
          { name: 'Low', v: 11 },
          { name: 'Half', v: 52 },
          { name: 'Full', v: 100 },
        ].map((p) => (
          <button key={p.name} type="button" className={demoChip(!auto && level === p.v)} onClick={() => manual(() => setLevel(p.v))}>
            {p.name}
          </button>
        ))}
        <button type="button" className={demoChip(false)} onClick={() => manual(() => { setLevel(0); window.setTimeout(() => { setCharging(true); setLevel(100) }, 350) })}>
          Replay fill
        </button>
      </div>
    </div>
  )
}

const demo: React.ReactNode = <LiquidChargeDemo />

export default demo
