import type * as React from 'react'
import { MothLanternToggle } from '@/components/ui/moth-lantern-toggle'
import { TogglePlay } from './_shared/toggle-play'

const demo: React.ReactNode = (
    <TogglePlay>{(on, set) => <MothLanternToggle checked={on} onCheckedChange={set} />}</TogglePlay>
  )

export default demo
