import type * as React from 'react'
import { RibbonUnfurlToast } from '@/components/ui/ribbon-unfurl-toast'
import { Button } from '@/components/ui/button'

const demo: React.ReactNode = (
    <RibbonUnfurlToast>
      {({ push }) => (
        <Button
          variant="framekit"
          onClick={() => push({ title: 'Ribbon unfurled', description: 'A soft banner from the edge.' })}
        >
          Unfurl ribbon
        </Button>
      )}
    </RibbonUnfurlToast>
  )

export default demo
