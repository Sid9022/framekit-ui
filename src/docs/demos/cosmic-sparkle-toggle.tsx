import type * as React from 'react'
import { CosmicSparkleToggle } from '@/components/ui/cosmic-sparkle-toggle'
import { TogglePlay } from './_shared/toggle-play'

const demo: React.ReactNode = (
    <TogglePlay>{(on, set) => <CosmicSparkleToggle checked={on} onCheckedChange={set} />}</TogglePlay>
  )

export default demo
