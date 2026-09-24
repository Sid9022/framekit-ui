export type DocCategory = 'Getting Started' | 'Core' | 'Animated'

export type DocEntry = {
  slug: string
  title: string
  description: string
  category: DocCategory
  unique?: boolean
  dependencies?: string[]
  props?: { name: string; type: string; default?: string; description: string }[]
}

export const DOCS: DocEntry[] = [
  { slug: 'introduction', title: 'Introduction', description: 'What Forge UI is and how to use it.', category: 'Getting Started' },
  { slug: 'installation', title: 'Installation', description: 'Copy-paste setup for Forge UI components.', category: 'Getting Started' },
  { slug: 'theming', title: 'Theming', description: 'Colors, dark mode, and Tailwind tokens.', category: 'Getting Started' },

  { slug: 'button', title: 'Button', description: 'Versatile button with variants and sizes.', category: 'Core', dependencies: ['clsx', 'tailwind-merge'], props: [
    { name: 'variant', type: "'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'forge'", default: "'default'", description: 'Visual style' },
    { name: 'size', type: "'sm' | 'md' | 'lg' | 'icon'", default: "'md'", description: 'Control size' },
  ]},
  { slug: 'badge', title: 'Badge', description: 'Compact status and label chips.', category: 'Core', dependencies: ['clsx', 'tailwind-merge'] },
  { slug: 'card', title: 'Card', description: 'Composable surface for content blocks.', category: 'Core', dependencies: ['clsx', 'tailwind-merge'] },
  { slug: 'input', title: 'Input', description: 'Accessible text field with focus ring.', category: 'Core', dependencies: ['clsx', 'tailwind-merge'] },
  { slug: 'textarea', title: 'Textarea', description: 'Multi-line text input.', category: 'Core', dependencies: ['clsx', 'tailwind-merge'] },
  { slug: 'switch', title: 'Switch', description: 'Animated boolean toggle.', category: 'Core', dependencies: ['clsx', 'tailwind-merge'] },
  { slug: 'checkbox', title: 'Checkbox', description: 'Checkbox with optional label.', category: 'Core', dependencies: ['clsx', 'tailwind-merge', 'lucide-react'] },
  { slug: 'tabs', title: 'Tabs', description: 'Keyboard-friendly tabbed panels.', category: 'Core', dependencies: ['clsx', 'tailwind-merge'] },
  { slug: 'accordion', title: 'Accordion', description: 'Expandable sections with motion.', category: 'Core', dependencies: ['motion', 'lucide-react'] },
  { slug: 'dialog', title: 'Dialog', description: 'Accessible modal dialog.', category: 'Core', dependencies: ['motion', 'lucide-react'] },
  { slug: 'tooltip', title: 'Tooltip', description: 'Hover/focus hint bubbles.', category: 'Core', dependencies: ['clsx', 'tailwind-merge'] },
  { slug: 'dropdown-menu', title: 'Dropdown Menu', description: 'Action menu anchored to a trigger.', category: 'Core', dependencies: ['clsx', 'tailwind-merge'] },
  { slug: 'toast', title: 'Toast', description: 'Transient notifications with a provider.', category: 'Core', dependencies: ['motion', 'lucide-react'] },
  { slug: 'avatar', title: 'Avatar', description: 'User image with initials fallback.', category: 'Core', dependencies: ['clsx', 'tailwind-merge'] },
  { slug: 'skeleton', title: 'Skeleton', description: 'Loading placeholders.', category: 'Core', dependencies: ['clsx', 'tailwind-merge'] },
  { slug: 'progress', title: 'Progress', description: 'Determinate progress bar.', category: 'Core', dependencies: ['clsx', 'tailwind-merge'] },

  { slug: 'magnetic-button', title: 'Magnetic Button', description: 'Button that magnetically follows the cursor.', category: 'Animated', unique: true, dependencies: ['motion'] },
  { slug: 'spotlight-card', title: 'Spotlight Card', description: 'Radial glow that tracks your pointer.', category: 'Animated', unique: true },
  { slug: 'scramble-text', title: 'Scramble Text', description: 'Characters decode from noise into place.', category: 'Animated', unique: true },
  { slug: 'magnify-dock', title: 'Magnify Dock', description: 'macOS-style dock with proximity scaling.', category: 'Animated', unique: true, dependencies: ['motion'] },
  { slug: 'tilt-card', title: 'Tilt Card', description: '3D perspective tilt on hover.', category: 'Animated', unique: true, dependencies: ['motion'] },
  { slug: 'aurora-background', title: 'Aurora Background', description: 'Drifting mesh aurora backdrop.', category: 'Animated', unique: true },
  { slug: 'infinite-marquee', title: 'Infinite Marquee', description: 'Seamless looping marquee strip.', category: 'Animated', unique: true },
  { slug: 'number-ticker', title: 'Number Ticker', description: 'Animates numbers when scrolled into view.', category: 'Animated', unique: true },
  { slug: 'orbiting-icons', title: 'Orbiting Icons', description: 'Icons circle a central hub.', category: 'Animated', unique: true },
  { slug: 'border-beam', title: 'Border Beam', description: 'Light travelling around a border.', category: 'Animated', unique: true },
  { slug: 'morphing-text', title: 'Morphing Text', description: 'Crossfading phrase morph.', category: 'Animated', unique: true, dependencies: ['motion'] },
  { slug: 'spark-button', title: 'Spark Button', description: 'Click bursts into particle sparks.', category: 'Animated', unique: true, dependencies: ['motion'] },
  { slug: 'cursor-trail', title: 'Cursor Trail', description: 'Glowing trail following the pointer.', category: 'Animated', unique: true },
  { slug: 'glass-card', title: 'Glass Card', description: 'Frosted liquid-glass surface.', category: 'Animated', unique: true },
  { slug: 'swipe-cards', title: 'Swipe Cards', description: 'Stacked deck with drag-to-dismiss.', category: 'Animated', unique: true, dependencies: ['motion'] },
  { slug: 'typewriter', title: 'Typewriter', description: 'Types and deletes through phrases.', category: 'Animated', unique: true },
  { slug: 'pixel-reveal', title: 'Pixel Reveal', description: 'Cascading pixel-grid image reveal.', category: 'Animated', unique: true },
  { slug: 'elastic-slider', title: 'Elastic Slider', description: 'Thumb stretches elastically while dragging.', category: 'Animated', unique: true, dependencies: ['motion'] },
  { slug: 'breathing-dot', title: 'Breathing Dot', description: 'Soft pulsating status indicator.', category: 'Animated', unique: true },
  { slug: 'ink-ripple-grid', title: 'Ink Ripple Grid', description: 'Click blooms ink ripples on a grid.', category: 'Animated', unique: true },
]

export const gettingStarted = DOCS.filter((d) => d.category === 'Getting Started')
export const componentDocs = DOCS.filter((d) => d.category !== 'Getting Started')

export function getDoc(slug: string) {
  return DOCS.find((d) => d.slug === slug)
}

export function getNavGroups() {
  return [
    { title: 'Getting Started', items: gettingStarted },
    { title: 'Core', items: DOCS.filter((d) => d.category === 'Core') },
    { title: 'Animated', items: DOCS.filter((d) => d.category === 'Animated') },
  ]
}
