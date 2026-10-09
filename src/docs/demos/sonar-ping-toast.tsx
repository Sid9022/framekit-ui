import type * as React from 'react'
import { SonarPingToast } from '@/components/ui/sonar-ping-toast'
import { Button } from '@/components/ui/button'

const demo: React.ReactNode = (
    <SonarPingToast>
      {({ push }) => (
        <Button
          variant="framekit"
          onClick={() => push({ title: 'Signal acquired', description: 'Sonar rings expanding.' })}
        >
          Ping sonar
        </Button>
      )}
    </SonarPingToast>
  )

export default demo
