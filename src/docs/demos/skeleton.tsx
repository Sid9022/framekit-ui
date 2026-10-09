import type * as React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const demo: React.ReactNode = (
    <div className="flex w-full max-w-sm items-center gap-3">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-[75%]" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )

export default demo
