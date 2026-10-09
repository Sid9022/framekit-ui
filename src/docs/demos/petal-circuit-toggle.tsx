import type * as React from 'react'
import { PetalCircuitToggle } from '@/components/ui/petal-circuit-toggle'
import { TogglePlay } from './_shared/toggle-play'

const demo: React.ReactNode = (
    <TogglePlay>{(on, set) => <PetalCircuitToggle checked={on} onCheckedChange={set} />}</TogglePlay>
  )

export default demo
