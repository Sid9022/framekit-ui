import type * as React from 'react'
import { Button } from '@/components/ui/button'

const demo: React.ReactNode = (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="framekit">Framekit</Button>
      <Button variant="destructive" size="sm">Delete</Button>
    </div>
  )

export default demo
