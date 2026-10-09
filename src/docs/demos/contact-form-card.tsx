import * as React from 'react'
import { ContactFormCard } from '@/components/ui/contact-form-card'
import { Switch } from '@/components/ui/switch'
import { wait } from './_shared/wait'

function PfFlagSwitch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex min-h-11 items-center gap-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
      {label}
    </label>
  )
}

function ContactFormDemo() {
  const [fail, setFail] = React.useState(false)
  const failRef = React.useRef(false)
  failRef.current = fail
  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-3">
      <ContactFormCard headingAs="h2" onSubmit={async () => { await wait(900); if (failRef.current) throw new Error('offline') }} />
      <PfFlagSwitch label="Simulate failure" checked={fail} onChange={setFail} />
    </div>
  )
}

const demo: React.ReactNode = <ContactFormDemo />

export default demo
