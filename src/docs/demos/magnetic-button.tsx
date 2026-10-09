import type * as React from 'react'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { ArrowRight as UpArrow } from 'lucide-react'

const demo: React.ReactNode = (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <MagneticButton>
        Get started <UpArrow aria-hidden className="h-4 w-4" />
      </MagneticButton>
      <MagneticButton variant="glass">View docs</MagneticButton>
    </div>
  )

export default demo
