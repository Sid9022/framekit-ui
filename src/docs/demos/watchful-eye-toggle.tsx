import type * as React from 'react'
import { WatchfulEyeToggle } from '@/components/ui/watchful-eye-toggle'
import { TogglePlay } from './_shared/toggle-play'

const demo: React.ReactNode = (
    <TogglePlay>{(on, set) => <WatchfulEyeToggle checked={on} onCheckedChange={set} aria-label="Watchful eye" />}</TogglePlay>
  )

export default demo
