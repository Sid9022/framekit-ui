/**
 * Lightweight guide index for navigation (sidebar, headers, footer) so the always-loaded shell doesn't pull in the
 * full guide text from ./guides.ts. scripts/check-wiring.mjs verifies it matches GUIDES (slug + navTitle, same order).
 */
export const GUIDE_LINKS = [
  { slug: 'install-animated-react-components-shadcn', navTitle: 'Install with the shadcn CLI' },
  { slug: 'apple-style-spring-animation-values', navTitle: 'Spring animation values' },
  { slug: 'accessible-motion-react-checklist', navTitle: 'Accessible motion checklist' },
] as const
