import * as React from 'react'
import { CloudLaunchPublishButton } from '@/components/ui/cloud-launch-publish-button'
import { FailSwitch } from './_shared/fail-switch'

function CloudLaunchDemo() {
  const [fail, setFail] = React.useState(false)
  const failing = (report: (p: number) => void) =>
    new Promise<void>((_, reject) => {
      let p = 0
      const t = window.setInterval(() => {
        p += 0.05
        report(p)
        if (p > 0.62) {
          window.clearInterval(t)
          reject(new Error('publish failed'))
        }
      }, 110)
    })
  return (
    <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
      <div className="flex flex-col items-center justify-center gap-5 rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#f0eff4)] shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] dark:shadow-none dark:bg-[radial-gradient(120%_100%_at_50%_0%,#1a1d29,#0b0c12)] px-6 py-14 ring-1 ring-black/[0.06] dark:ring-white/5">
        <CloudLaunchPublishButton onPublish={fail ? failing : undefined} />
        <FailSwitch on={fail} onChange={setFail} />
      </div>
      <div className="dark flex flex-col items-center justify-center gap-5 rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#1a1d29,#0b0c12)] px-6 py-14 ring-1 ring-white/5">
        <CloudLaunchPublishButton variant="dark" label="Publish site" doneLabel="Deployed" />
        <span className="text-[11px] font-medium text-slate-400">variant=&quot;dark&quot; · always dark</span>
      </div>
    </div>
  )
}

const demo: React.ReactNode = <CloudLaunchDemo />

export default demo
