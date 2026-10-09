import type * as React from 'react'
import { TideglassToggle } from '@/components/ui/tideglass-toggle'
import { TogglePlay } from './_shared/toggle-play'

const demo: React.ReactNode = (
    <TogglePlay>{(on, set) => <TideglassToggle checked={on} onCheckedChange={set} />}</TogglePlay>
  )

export default demo
