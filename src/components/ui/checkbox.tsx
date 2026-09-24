import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface CheckboxProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  id?: string
  className?: string
  label?: string
}

export function Checkbox({
  checked = false,
  onCheckedChange,
  disabled,
  id,
  className,
  label,
}: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn('inline-flex cursor-pointer items-center gap-2 text-sm', disabled && 'opacity-50', className)}
    >
      <button
        id={id}
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          'flex h-5 w-5 items-center justify-center rounded-md border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-500',
          checked
            ? 'border-forge-500 bg-forge-500 text-white'
            : 'border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-900',
        )}
      >
        {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </button>
      {label}
    </label>
  )
}
