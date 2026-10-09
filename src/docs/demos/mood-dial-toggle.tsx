import type * as React from 'react'
import { MoodDialToggle } from '@/components/ui/mood-dial-toggle'
import { TogglePlay } from './_shared/toggle-play'

const demo: React.ReactNode = (
    <TogglePlay>{(on, set) => <MoodDialToggle checked={on} onCheckedChange={set} />}</TogglePlay>
  )

export default demo
