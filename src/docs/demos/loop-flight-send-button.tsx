import * as React from 'react'
import { LoopFlightSendButton } from '@/components/ui/loop-flight-send-button'
import { FailSwitch } from './_shared/fail-switch'
import { wait } from './_shared/wait'

function LoopFlightSendDemo() {
  const [fail, setFail] = React.useState(false)
  const [slow, setSlow] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const t = window.setTimeout(() => ref.current?.querySelector<HTMLButtonElement>('button[aria-label]')?.click(), 1100)
    return () => window.clearTimeout(t)
  }, [])
  const send = async () => {
    await wait(slow ? 3600 : 500)
    if (fail) throw new Error('network')
  }
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <div ref={ref} className="flex flex-col gap-2 rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#eef0f7)] px-6 pb-5 pt-6 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] ring-1 ring-black/[0.06] dark:bg-[radial-gradient(120%_100%_at_50%_0%,#191a2b,#0a0a12)] dark:shadow-none dark:ring-white/5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[linear-gradient(135deg,#fbbf24,#f472b6)] text-[11px] font-bold text-white">AK</span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-zinc-900 dark:text-white">To: Amara Kent</p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Re: Q3 roadmap draft · “Tightened the milestones, beta moves to week 6.”</p>
          </div>
        </div>
        <div className="grid h-52 place-items-center">
          <LoopFlightSendButton onSend={send} />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 border-t border-black/5 pt-3 dark:border-white/5">
          <FailSwitch on={fail} onChange={setFail} />
          <FailSwitch on={slow} onChange={setSlow} label="Slow network (holds in orbit)" />
        </div>
      </div>
      <div className="dark grid h-56 place-items-center rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#23204a,#09080f)] ring-1 ring-white/5">
        <div className="flex flex-col items-center gap-3">
          <LoopFlightSendButton label="Send invite" sentLabel="Invited!" />
          <span className="text-[11px] font-medium text-zinc-400">inside a .dark wrapper</span>
        </div>
      </div>
    </div>
  )
}

const demo: React.ReactNode = <LoopFlightSendDemo />

export default demo
