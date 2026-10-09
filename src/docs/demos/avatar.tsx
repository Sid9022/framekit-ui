import type * as React from 'react'
import { Avatar } from '@/components/ui/avatar'

const demo: React.ReactNode = (
    <div className="flex items-center gap-3">
      <Avatar fallback="FU" />
      <Avatar fallback="Ada" className="h-12 w-12" />
      <Avatar fallback="OK" className="h-8 w-8" />
    </div>
  )

export default demo
