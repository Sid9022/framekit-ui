import type * as React from 'react'
import { TumblerLockOtp } from '@/components/ui/tumbler-lock-otp'

function TumblerLockDemo() {
  return (
    <TumblerLockOtp
      hint="Demo: 246810 unlocks — any other code fails."
      onVerify={(code) => code === '246810'}
    />
  )
}

const demo: React.ReactNode = <TumblerLockDemo />

export default demo
