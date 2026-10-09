import type * as React from 'react'
import { DeviceFrame } from '@/components/ui/device-frame'

function DeviceFrameDemo() {
  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-8 md:flex-row md:items-end md:justify-center">
      <DeviceFrame className="md:max-w-xl" />
      <DeviceFrame variant="phone" className="w-[220px]" />
    </div>
  )
}

const demo: React.ReactNode = <DeviceFrameDemo />

export default demo
