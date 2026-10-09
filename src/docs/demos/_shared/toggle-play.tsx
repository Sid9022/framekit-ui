/* Demo helper shared by several docs demos. */
import * as React from 'react'

export function TogglePlay({ children }: { children: (on: boolean, set: (v: boolean) => void) => React.ReactNode }) {
  const [on, setOn] = React.useState(false)
  return (
    <div className="flex flex-col items-center gap-3">
      {children(on, setOn)}
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400">{on ? 'On' : 'Off'}</p>
    </div>
  )
}
