import * as React from 'react'
import { Progress } from '@/components/ui/progress'

function ProgressDemo() {
  const [v, setV] = React.useState(35)
  React.useEffect(() => {
    const id = window.setInterval(() => setV((x) => (x >= 100 ? 10 : x + 8)), 900)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="w-full max-w-sm space-y-6">
      <Progress value={v} label="Uploading assets" showValue />
      <Progress value={100} tone="success" label="Build complete" showValue size="sm" />
      <Progress value={0} indeterminate tone="neutral" label="Deploying to edge" size="sm" />
    </div>
  )
}

const demo: React.ReactNode = <ProgressDemo />

export default demo
