import type * as React from 'react'
import { LoginGateIntro } from '@/components/ui/login-gate-intro'
import { MiniDesktopDemo } from './_shared/mini-desktop-demo'

function LoginGateDemo() {
  return (
    <LoginGateIntro name="Guest Studio" role="Design engineer" className="max-w-5xl" onEnter={() => undefined}>
      <MiniDesktopDemo open={['about', 'work']} />
    </LoginGateIntro>
  )
}

const demo: React.ReactNode = <LoginGateDemo />

export default demo
