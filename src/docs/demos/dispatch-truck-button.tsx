import type * as React from 'react'
import { DispatchTruckButton } from '@/components/ui/dispatch-truck-button'

const demo: React.ReactNode = (
    <div className="flex w-full max-w-lg flex-col items-center justify-center gap-6 rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#f0eff4)] shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] dark:shadow-none dark:bg-[radial-gradient(120%_100%_at_50%_0%,#1b1924,#0c0b10)] px-6 py-12 ring-1 ring-black/[0.06] dark:ring-white/5">
      <DispatchTruckButton />
    </div>
  )

export default demo
