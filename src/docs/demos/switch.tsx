import * as React from 'react'
import { Switch } from '@/components/ui/switch'

function SwitchDemo() {
  const [on, setOn] = React.useState(true)
  return (
    <div className="flex items-center gap-3">
      <Switch checked={on} onCheckedChange={setOn} aria-label="Toggle demo" />
      <span className="text-sm text-zinc-500 dark:text-zinc-400">{on ? 'Enabled' : 'Disabled'}</span>
    </div>
  )
}

const demo: React.ReactNode = <SwitchDemo />

export default demo
