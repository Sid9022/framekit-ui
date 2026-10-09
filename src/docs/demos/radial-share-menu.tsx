import * as React from 'react'
import { RadialShareMenu } from '@/components/ui/radial-share-menu'
import { FailSwitch } from './_shared/fail-switch'
import { wait } from './_shared/wait'

function RadialShareDemo() {
  const [fail, setFail] = React.useState(false)
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-[28px] bg-[radial-gradient(120%_90%_at_50%_0%,#f6eee2,#e6d8c3)] px-6 pb-6 pt-8 shadow-[inset_0_1px_0_rgb(255_255_255/0.7)] ring-1 ring-[#d6c4a8]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a7b5f]">Field notes · Issue 14</p>
      <h3 className="text-center text-lg font-semibold tracking-tight text-[#2b211a]">Quiet interfaces, loud details</h3>
      <RadialShareMenu
        url="https://framekit-ui.vercel.app/docs/radial-share-menu"
        onShare={fail ? async () => { await wait(200); throw new Error('nope') } : undefined}
      />
      <FailSwitch on={fail} onChange={setFail} light />
    </div>
  )
}

const demo: React.ReactNode = <RadialShareDemo />

export default demo
