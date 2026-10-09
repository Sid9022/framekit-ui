import * as React from 'react'
import { SeatScalePricing } from '@/components/ui/seat-scale-pricing'
import { FailSwitch } from './_shared/fail-switch'
import { wait } from './_shared/wait'

function SeatScaleDemo() {
  const [fail, setFail] = React.useState(false)
  return (
    <div className="flex flex-col items-center gap-4">
      <SeatScalePricing
        onCheckout={async () => {
          await wait(1200)
          return !fail
        }}
      />
      <FailSwitch on={fail} onChange={setFail} />
    </div>
  )
}

const demo: React.ReactNode = <SeatScaleDemo />

export default demo
