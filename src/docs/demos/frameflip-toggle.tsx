import type * as React from 'react'
import { FrameflipToggle } from '@/components/ui/frameflip-toggle'
import { TogglePlay } from './_shared/toggle-play'

const demo: React.ReactNode = (
    <TogglePlay>{(on, set) => <FrameflipToggle checked={on} onCheckedChange={set} />}</TogglePlay>
  )

export default demo
