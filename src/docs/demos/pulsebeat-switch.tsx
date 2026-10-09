import type * as React from 'react'
import { PulsebeatSwitch } from '@/components/ui/pulsebeat-switch'
import { TogglePlay } from './_shared/toggle-play'

const demo: React.ReactNode = (
    <TogglePlay>{(on, set) => <PulsebeatSwitch checked={on} onCheckedChange={set} />}</TogglePlay>
  )

export default demo
