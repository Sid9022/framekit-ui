import type * as React from 'react'
import { BreathingDot } from '@/components/ui/breathing-dot'

const demo: React.ReactNode = (
    <div className="flex flex-col gap-3">
      <BreathingDot status="online" />
      <BreathingDot status="away" />
      <BreathingDot status="busy" />
      <BreathingDot status="offline" />
    </div>
  )

export default demo
