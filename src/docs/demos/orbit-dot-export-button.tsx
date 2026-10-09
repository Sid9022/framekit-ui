import * as React from 'react'
import { OrbitDotExportButton } from '@/components/ui/orbit-dot-export-button'
import { FailSwitch } from './_shared/fail-switch'

function OrbitDotExportDemo() {
  const [fail, setFail] = React.useState(false)
  const failing = (report: (p: number) => void) =>
    new Promise<void>((resolve, reject) => {
      let p = 0
      const t = window.setInterval(() => {
        p += 0.06
        report(p)
        if (fail && p > 0.55) {
          window.clearInterval(t)
          reject(new Error('export failed'))
        } else if (p >= 1) {
          window.clearInterval(t)
          resolve()
        }
      }, 120)
    })
  return (
    <div className="flex w-full max-w-lg flex-col items-center justify-center gap-6 rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#f0eff4)] shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] dark:shadow-none dark:bg-[radial-gradient(120%_100%_at_50%_0%,#1b1924,#0c0b10)] px-6 py-12 ring-1 ring-black/[0.06] dark:ring-white/5">
      <OrbitDotExportButton onExport={fail ? failing : undefined} />
      <div className="flex flex-wrap items-start justify-center gap-4">
        <OrbitDotExportButton dot="diamond" accent="#7dd3fc" label="Export CSV" doneLabel="Open CSV" />
        <OrbitDotExportButton dot="spark" accent="#c4b5fd" label="Render" doneLabel="Preview" />
      </div>
      <FailSwitch on={fail} onChange={setFail} />
    </div>
  )
}

const demo: React.ReactNode = <OrbitDotExportDemo />

export default demo
