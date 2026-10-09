import type * as React from 'react'
import { BlinkerSwitch } from '@/components/ui/blinker-switch'
import { TogglePlay } from './_shared/toggle-play'

const demo: React.ReactNode = (
    <TogglePlay>{(on, set) => <BlinkerSwitch checked={on} onCheckedChange={set} />}</TogglePlay>
  )

export default demo
