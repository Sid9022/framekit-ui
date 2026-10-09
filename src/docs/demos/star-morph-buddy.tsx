import * as React from 'react'
import { StarMorphBuddy } from '@/components/ui/star-morph-buddy'
import { FailSwitch } from './_shared/fail-switch'
import { wait } from './_shared/wait'

function StarMorphBuddyDemo() {
  const [fail, setFail] = React.useState(false)
  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-3 rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#eef0fb)] px-6 pb-6 pt-8 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] ring-1 ring-black/[0.06] dark:bg-[radial-gradient(90%_80%_at_50%_20%,#1a1740,#07060f)] dark:shadow-none dark:ring-white/5">
      <StarMorphBuddy
        onActivate={async () => {
          await wait(1400)
          if (fail) throw new Error('offline')
        }}
      />
      <FailSwitch on={fail} onChange={setFail} />
      <div className="mt-2 flex w-full items-center justify-center gap-5 border-t border-black/5 pt-5 dark:border-white/5">
        <StarMorphBuddy size={92} name="Juno" idleText="Need a recipe idea?" hoverText="Juno here — tell me what’s in your fridge." highlight="what’s in your fridge" className="[&_button]:px-2 [&_span]:text-[13px]" />
        <StarMorphBuddy size={92} name="Orbit" idleText="Plan a trip?" hoverText="Orbit here — I’ll sketch a weekend itinerary." highlight="weekend itinerary" className="[&_button]:px-2 [&_span]:text-[13px]" />
      </div>
    </div>
  )
}

const demo: React.ReactNode = <StarMorphBuddyDemo />

export default demo
