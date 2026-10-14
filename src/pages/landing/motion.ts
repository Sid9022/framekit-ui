import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger, useGSAP }
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'
export const REDUCED = '(prefers-reduced-motion: reduce)'

/** Offset (px) that moves an in-flow child's centre to a point relative to its container's centre. Ignores transforms. */
export function toPoint(el: HTMLElement, box: HTMLElement, px: number, py: number) {
  const cx = el.offsetLeft + el.offsetWidth / 2
  const cy = el.offsetTop + el.offsetHeight / 2
  return { x: box.offsetWidth / 2 + px - cx, y: box.offsetHeight / 2 + py - cy }
}
