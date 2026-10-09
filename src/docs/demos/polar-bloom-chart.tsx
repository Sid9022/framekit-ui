import * as React from 'react'
import { DEFAULT_POLAR_SERIES, PolarBloomChart } from '@/components/ui/polar-bloom-chart'
import { FailSwitch } from './_shared/fail-switch'
import { demoChip } from './_shared/demo-chip'
import { wait } from './_shared/wait'

function PolarBloomDemo() {
  const [fail, setFail] = React.useState(false)
  const [nonce, setNonce] = React.useState(0)
  const failRef = React.useRef(fail)
  failRef.current = fail
  const load = React.useCallback(async () => {
    await wait(900)
    if (failRef.current) throw new Error('Network')
    return DEFAULT_POLAR_SERIES
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce])
  return (
    <div className="flex flex-col items-center gap-4">
      <PolarBloomChart load={load} />
      <div className="flex items-center gap-2">
        <FailSwitch on={fail} onChange={setFail} label="Fail next load" />
        <button type="button" className={demoChip(false)} onClick={() => setNonce((n) => n + 1)}>Reload data</button>
      </div>
    </div>
  )
}

const demo: React.ReactNode = <PolarBloomDemo />

export default demo
