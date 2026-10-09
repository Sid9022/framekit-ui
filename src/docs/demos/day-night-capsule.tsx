import type * as React from 'react'
import { DayNightCapsule } from '@/components/ui/day-night-capsule'
import { TogglePlay } from './_shared/toggle-play'

const demo: React.ReactNode = (
    <TogglePlay>{(on, set) => <DayNightCapsule checked={on} onCheckedChange={set} />}</TogglePlay>
  )

export default demo
