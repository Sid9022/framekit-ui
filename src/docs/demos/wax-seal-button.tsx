import type * as React from 'react'
import { WaxSealButton } from '@/components/ui/wax-seal-button'

const demo: React.ReactNode = (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <WaxSealButton />
      <WaxSealButton monogram="AR" accent="#1e3a8a" label="Seal the contract" sealedLabel="Contract sealed" />
    </div>
  )

export default demo
