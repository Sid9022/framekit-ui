import type * as React from 'react'
import { GlassOrbSwitch } from '@/components/ui/glass-orb-switch'
import { TogglePlay } from './_shared/toggle-play'

const demo: React.ReactNode = (
    <TogglePlay>{(on, set) => <GlassOrbSwitch checked={on} onCheckedChange={set} />}</TogglePlay>
  )

export default demo
