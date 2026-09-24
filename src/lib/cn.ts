import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind class names safely. Copy this util into your project. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
