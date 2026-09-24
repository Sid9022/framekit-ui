import * as React from 'react'

export type ToggleBaseProps = {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  id?: string
  'aria-label'?: string
}

export function useToggleState({
  checked,
  defaultChecked = false,
  onCheckedChange,
}: Pick<ToggleBaseProps, 'checked' | 'defaultChecked' | 'onCheckedChange'>) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultChecked)
  const isControlled = checked !== undefined
  const value = isControlled ? checked : uncontrolled
  const set = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolled(next)
      onCheckedChange?.(next)
    },
    [isControlled, onCheckedChange],
  )
  const toggle = React.useCallback(() => set(!value), [set, value])
  return { checked: value, set, toggle }
}
