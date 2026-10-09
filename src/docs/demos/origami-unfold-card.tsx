import * as React from 'react'
import { OrigamiUnfoldCard } from '@/components/ui/origami-unfold-card'
import { FailSwitch } from './_shared/fail-switch'
import { wait } from './_shared/wait'

function OrigamiUnfoldDemo() {
  const [fail, setFail] = React.useState(false)
  return (
    <div className="flex flex-col items-center gap-4 pb-6">
      <OrigamiUnfoldCard
        onAction={async () => {
          await wait(1100)
          return !fail
        }}
      />
      <div className="mt-6"><FailSwitch on={fail} onChange={setFail} /></div>
    </div>
  )
}

const demo: React.ReactNode = <OrigamiUnfoldDemo />

export default demo
