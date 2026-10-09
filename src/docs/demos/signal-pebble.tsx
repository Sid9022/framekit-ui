import type * as React from 'react'
import { SignalPebble } from '@/components/ui/signal-pebble'

const demo: React.ReactNode = (
    <div className="flex flex-col gap-3">
      <SignalPebble status="working" progress={62} />
      <SignalPebble status="mapping" />
      <SignalPebble status="done" progress={100} />
    </div>
  )

export default demo
