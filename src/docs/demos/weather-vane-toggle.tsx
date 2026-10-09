import type * as React from 'react'
import { WeatherVaneToggle } from '@/components/ui/weather-vane-toggle'
import { TogglePlay } from './_shared/toggle-play'

const demo: React.ReactNode = (
    <TogglePlay>{(on, set) => <WeatherVaneToggle checked={on} onCheckedChange={set} />}</TogglePlay>
  )

export default demo
