import * as React from 'react'
import { HourglassLoader } from '@/components/ui/hourglass-loader'

function HourglassDemo() {
  const [p, setP] = React.useState(12)
  React.useEffect(() => {
    const t = window.setInterval(() => setP((v) => (v >= 100 ? 0 : Math.min(100, v + 7))), 900)
    return () => window.clearInterval(t)
  }, [])
  return (
    <div className="flex flex-wrap items-end justify-center gap-14">
      <HourglassLoader />
      <HourglassLoader progress={p} accent="#c2410c" label={p >= 100 ? 'Backup restored' : 'Restoring your backup…'} />
    </div>
  )
}

const demo: React.ReactNode = <HourglassDemo />

export default demo
