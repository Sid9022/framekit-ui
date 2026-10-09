import type * as React from 'react'
import { Tooltip } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'

const demo: React.ReactNode = (
    <Tooltip content="Crafted with care">
      <Button variant="outline">Hover me</Button>
    </Tooltip>
  )

export default demo
