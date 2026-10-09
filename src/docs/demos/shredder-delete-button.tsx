import * as React from 'react'
import { ShredderDeleteButton } from '@/components/ui/shredder-delete-button'
import { FailSwitch } from './_shared/fail-switch'
import { wait } from './_shared/wait'

function ShredderDeleteDemo() {
  const [fail, setFail] = React.useState(false)
  return (
    <div className="flex w-full max-w-xl flex-col items-center justify-center gap-6 rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#f0eff4)] shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] dark:shadow-none dark:bg-[radial-gradient(120%_100%_at_50%_0%,#1b1924,#0c0b10)] px-6 pb-10 pt-12 ring-1 ring-black/[0.06] dark:ring-white/5">
      <div className="flex flex-wrap items-center justify-center gap-5">
        <ShredderDeleteButton variant="violet" onDelete={fail ? async () => { await wait(300); throw new Error('jam') } : undefined} />
        <ShredderDeleteButton variant="light" label="Discard draft" />
        <ShredderDeleteButton variant="danger" label="Purge logs" strips={9} />
      </div>
      <FailSwitch on={fail} onChange={setFail} label="Jam the first one" />
    </div>
  )
}

const demo: React.ReactNode = <ShredderDeleteDemo />

export default demo
