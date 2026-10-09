import type * as React from 'react'
import { InkBloomToggle } from '@/components/ui/ink-bloom-toggle'
import { TogglePlay } from './_shared/toggle-play'

const demo: React.ReactNode = (
    <TogglePlay>{(on, set) => <InkBloomToggle checked={on} onCheckedChange={set} />}</TogglePlay>
  )

export default demo
