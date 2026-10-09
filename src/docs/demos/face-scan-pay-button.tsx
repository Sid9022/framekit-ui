import * as React from 'react'
import { FaceScanPayButton } from '@/components/ui/face-scan-pay-button'
import { FailSwitch } from './_shared/fail-switch'
import { wait } from './_shared/wait'

function FaceScanPayDemo() {
  const [fail, setFail] = React.useState(false)
  return (
    <div className="flex w-full max-w-lg flex-col items-center justify-center gap-5 rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#f0eff4)] shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] dark:shadow-none dark:bg-[radial-gradient(120%_100%_at_50%_0%,#141a2e,#07090f)] px-6 py-12 ring-1 ring-black/[0.06] dark:ring-white/5">
      <FaceScanPayButton
        onPay={async () => {
          await wait(1900)
          if (fail) throw new Error('declined')
        }}
      />
      <FailSwitch on={fail} onChange={setFail} label="Simulate decline" />
    </div>
  )
}

const demo: React.ReactNode = <FaceScanPayDemo />

export default demo
