import * as React from 'react'
import { Checkbox } from '@/components/ui/checkbox'

function CheckboxDemo() {
  const [a, setA] = React.useState(true)
  const [b, setB] = React.useState(false)
  return (
    <div className="flex flex-col gap-2">
      <Checkbox id="c1" checked={a} onCheckedChange={setA} label="Accept terms" />
      <Checkbox id="c2" checked={b} onCheckedChange={setB} label="Subscribe to updates" />
    </div>
  )
}

const demo: React.ReactNode = <CheckboxDemo />

export default demo
