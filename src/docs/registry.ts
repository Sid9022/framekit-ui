export type DocCategory =
  | 'Getting Started'
  | 'Animated Backgrounds'
  | 'Buttons'
  | 'Toggles'
  | 'Text Animations'
  | 'Cards'
  | 'Navigation'
  | 'Cursors'
  | 'Search / Inputs'
  | 'Core'

export type DocEntry = {
  slug: string
  title: string
  description: string
  category: DocCategory
  unique?: boolean
  isNew?: boolean
  gesture?: string
  dependencies?: string[]
  props?: { name: string; type: string; default?: string; description: string }[]
}

const toggleProps: DocEntry['props'] = [
  { name: 'checked', type: 'boolean', description: 'Controlled on/off state.' },
  { name: 'defaultChecked', type: 'boolean', default: 'false', description: 'Uncontrolled initial state.' },
  { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Fires when the value flips.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables pointer and keyboard.' },
]

export const DOCS: DocEntry[] = [
  { slug: 'introduction', title: 'Introduction', description: 'What Framekit UI is and how to use it.', category: 'Getting Started' },
  { slug: 'installation', title: 'Installation', description: 'Copy-paste setup for Framekit UI components.', category: 'Getting Started' },
  { slug: 'theming', title: 'Theming', description: 'Colors, dark mode, and Tailwind tokens.', category: 'Getting Started' },

  // Animated Backgrounds
  { slug: 'prism-tidal-field', title: 'Prism Tidal Field', description: 'Soft lilac tidal bands that bend toward pointer velocity.', category: 'Animated Backgrounds', unique: true, isNew: true, gesture: 'Move your cursor — tides lean toward velocity.' },
  { slug: 'constellation-breathing-grid', title: 'Constellation Breathing Grid', description: 'Sparse nodes breathe and link when close.', category: 'Animated Backgrounds', unique: true, isNew: true, gesture: 'Move near nodes — links brighten on proximity.' },
  { slug: 'paperfold-gradient-plane', title: 'Paperfold Gradient Plane', description: 'Folded translucent ribbons shift with the pointer.', category: 'Animated Backgrounds', unique: true, isNew: true, gesture: 'Move across the plane — folds follow your hand.' },
  { slug: 'aurora-background', title: 'Aurora Background', description: 'Drifting mesh aurora backdrop.', category: 'Animated Backgrounds', unique: true },
  { slug: 'ink-ripple-grid', title: 'Ink Ripple Grid', description: 'Click blooms ink ripples on a grid.', category: 'Animated Backgrounds', unique: true, gesture: 'Click the grid to spill ink.' },

  { slug: 'silk-shear-field', title: 'Silk Shear Field', description: 'Shearing silk ribbons that bend toward the pointer.', category: 'Animated Backgrounds', unique: true, isNew: true, gesture: 'Move — silk ribbons shear toward you.' },
  { slug: 'void-lattice-drift', title: 'Void Lattice Drift', description: 'Faint perspective lattice drifting in a void.', category: 'Animated Backgrounds', unique: true, isNew: true, gesture: 'Move — the lattice drifts with your gaze.' },
  { slug: 'ember-drift', title: 'Ember Drift', description: 'Warm particles rising with soft bloom.', category: 'Animated Backgrounds', unique: true, isNew: true, gesture: 'Watch embers rise and bloom.' },
  { slug: 'chromatic-mist', title: 'Chromatic Mist', description: 'Dual-tone mist with chromatic split on motion.', category: 'Animated Backgrounds', unique: true, isNew: true, gesture: 'Move quickly — mist splits chromatically.' },
  { slug: 'pulse-rings', title: 'Pulse Rings', description: 'Concentric soft rings expand from pointer/click.', category: 'Animated Backgrounds', unique: true, isNew: true, gesture: 'Click or drag — rings pulse outward.' },


  // Buttons
  { slug: 'googly-gaze-button', title: 'Googly Gaze Button', description: 'Eyes track the cursor and smirk on click.', category: 'Buttons', unique: true, isNew: true, gesture: 'Move nearby — eyes follow; click to smirk.' },
  { slug: 'slide-confirm-button', title: 'Slide Confirm Button', description: 'Drag the knob (or press Enter) to confirm.', category: 'Buttons', unique: true, isNew: true, gesture: 'Drag the knob fully across, or press Enter.' },
  { slug: 'shimmer-chrome-button', title: 'Shimmer Chrome Button', description: 'Quiet chrome pill with a traveling shimmer.', category: 'Buttons', unique: true, isNew: true, gesture: 'Watch the highlight sweep; click to press.' },
  { slug: 'orbit-commit', title: 'Orbit Commit', description: 'Hold to confirm while an icon orbits the rim.', category: 'Buttons', unique: true, isNew: true, gesture: 'Press and hold (or Space) until the orbit completes.', dependencies: ['motion'] },
  { slug: 'inkline-action', title: 'Inkline Action', description: 'Text action with a seeded ink underline.', category: 'Buttons', unique: true, isNew: true, gesture: 'Hover from left or right — ink draws that way.' },
  { slug: 'focus-bloom-button', title: 'Focus Bloom Button', description: 'Focus/hover bloom steered by pointer.', category: 'Buttons', unique: true, isNew: true, gesture: 'Hover or focus — bloom tracks the pointer.' },
  { slug: 'magnetic-button', title: 'Magnetic Button', description: 'Button that magnetically follows the cursor.', category: 'Buttons', unique: true, gesture: 'Move near the button — it pulls toward you.', dependencies: ['motion'] },
  { slug: 'spark-button', title: 'Spark Button', description: 'Click bursts into particle sparks.', category: 'Buttons', unique: true, dependencies: ['motion'], gesture: 'Click — sparks erupt from the hit point.' },

  { slug: 'liquid-fill-button', title: 'Liquid Fill Button', description: 'Liquid rises to fill on hover or press.', category: 'Buttons', unique: true, isNew: true, gesture: 'Hover — liquid rises to fill.' },
  { slug: 'split-reveal-button', title: 'Split Reveal Button', description: 'Face splits open to reveal the label.', category: 'Buttons', unique: true, isNew: true, gesture: 'Hover — panels split to reveal.' },
  { slug: 'gravity-drop-button', title: 'Gravity Drop Button', description: 'Icon falls in with a bounce on hover.', category: 'Buttons', unique: true, isNew: true, gesture: 'Hover — icon drops with bounce.' },
  { slug: 'neon-stroke-button', title: 'Neon Stroke Button', description: 'SVG stroke draws around on hover.', category: 'Buttons', unique: true, isNew: true, gesture: 'Hover — neon stroke draws the rim.' },


  // Toggles (hero category)
  { slug: 'watchful-eye-toggle', title: 'Watchful Eye Toggle', description: 'A soft eye opens and closes; the pupil tracks when open.', category: 'Toggles', unique: true, isNew: true, gesture: 'Click or press Space — lids open/close; move to track.', props: toggleProps },
  { slug: 'day-night-capsule', title: 'Day Night Capsule', description: 'Illustrated mini sky that morphs day↔night.', category: 'Toggles', unique: true, isNew: true, gesture: 'Click the capsule to switch day and night.', props: toggleProps },
  { slug: 'glass-orb-switch', title: 'Glass Orb Switch', description: 'Translucent glass sphere slides on a dark track.', category: 'Toggles', unique: true, isNew: true, gesture: 'Click track or orb to toggle light/dark.', props: toggleProps },
  { slug: 'cosmic-sparkle-toggle', title: 'Cosmic Sparkle Toggle', description: 'OFF/ON pill with a glowing star badge and halo.', category: 'Toggles', unique: true, isNew: true, gesture: 'Click the pill to sparkle on or off.', props: toggleProps },
  { slug: 'blinker-switch', title: 'Blinker Switch', description: 'Classic switch whose knob blinks like an eyelid.', category: 'Toggles', unique: true, isNew: true, gesture: 'Toggle — the knob blinks as it travels.', props: toggleProps },
  { slug: 'mood-dial-toggle', title: 'Mood Dial Toggle', description: 'Tiny face dial springs between two moods.', category: 'Toggles', unique: true, isNew: true, gesture: 'Click to rotate between moods.', props: toggleProps },
  { slug: 'ink-bloom-toggle', title: 'Ink Bloom Toggle', description: 'Track fills with a blooming ink blot when on.', category: 'Toggles', unique: true, isNew: true, gesture: 'Click — ink blooms across the track.', props: toggleProps },
  { slug: 'pulsebeat-switch', title: 'Pulsebeat Switch', description: 'Soft heartbeat pulse when on; flat when off.', category: 'Toggles', unique: true, isNew: true, gesture: 'Turn on to feel the pulse.', props: toggleProps },
  { slug: 'frameflip-toggle', title: 'Frameflip Toggle', description: 'Tiny illustrated card flips between two states.', category: 'Toggles', unique: true, isNew: true, gesture: 'Click to flip the frame.', props: toggleProps },

  { slug: 'moth-lantern-toggle', title: 'Moth Lantern Toggle', description: 'A moth settles into lantern glow when on.', category: 'Toggles', unique: true, isNew: true, gesture: 'Toggle — moth settles into the glow.', props: toggleProps },
  { slug: 'petal-circuit-toggle', title: 'Petal Circuit Toggle', description: 'Petals fold inward to complete a circuit.', category: 'Toggles', unique: true, isNew: true, gesture: 'Toggle — petals fold to complete the circuit.', props: toggleProps },
  { slug: 'tideglass-toggle', title: 'Tideglass Toggle', description: 'Waterline rises and falls in a glass pane.', category: 'Toggles', unique: true, isNew: true, gesture: 'Toggle — tide rises or falls.', props: toggleProps },
  { slug: 'weather-vane-toggle', title: 'Weather Vane Toggle', description: 'Vane pivots; grain shifts with wind.', category: 'Toggles', unique: true, isNew: true, gesture: 'Toggle — vane pivots with the wind.', props: toggleProps },


  // Text Animations
  { slug: 'glyph-weather', title: 'Glyph Weather', description: 'Glyphs drift with scroll direction.', category: 'Text Animations', unique: true, isNew: true, gesture: 'Scroll the page — characters lean with the wind.' },
  { slug: 'wordloom', title: 'Wordloom', description: 'Words weave out as threads and resolve the next.', category: 'Text Animations', unique: true, isNew: true, gesture: 'Click (or Enter) to weave the next word.', dependencies: ['motion'] },
  { slug: 'momentum-caption', title: 'Momentum Caption', description: 'Caption briefly follows pointer velocity.', category: 'Text Animations', unique: true, isNew: true, gesture: 'Sweep the pointer quickly — caption trails, then settles.' },
  { slug: 'scramble-text', title: 'Scramble Text', description: 'Characters decode from noise into place.', category: 'Text Animations', unique: true, gesture: 'Hover to re-scramble and decode.' },
  { slug: 'morphing-text', title: 'Morphing Text', description: 'Crossfading phrase morph.', category: 'Text Animations', unique: true, dependencies: ['motion'] },
  { slug: 'typewriter', title: 'Typewriter', description: 'Types and deletes through phrases.', category: 'Text Animations', unique: true },
  { slug: 'number-ticker', title: 'Number Ticker', description: 'Animates numbers when scrolled into view.', category: 'Text Animations', unique: true },
  { slug: 'infinite-marquee', title: 'Infinite Marquee', description: 'Seamless looping marquee strip.', category: 'Text Animations', unique: true },

  // Cards
  { slug: 'tide-deck', title: 'Tide Deck', description: 'Drag a deck whose depth reacts to velocity.', category: 'Cards', unique: true, isNew: true, gesture: 'Drag sideways or use arrows to advance the deck.', dependencies: ['motion'] },
  { slug: 'windowpane-story-card', title: 'Windowpane Story Card', description: 'Frosted pane slides to reveal evidence.', category: 'Cards', unique: true, isNew: true, gesture: 'Click Reveal — the frosted pane slides down.' },
  { slug: 'topographic-stack', title: 'Topographic Stack', description: 'Contour-offset layers separate on hover.', category: 'Cards', unique: true, isNew: true, gesture: 'Hover to separate layers; click to select.' },
  { slug: 'spotlight-card', title: 'Spotlight Card', description: 'Radial glow that tracks your pointer.', category: 'Cards', unique: true, gesture: 'Move across the card — the spotlight follows.' },
  { slug: 'tilt-card', title: 'Tilt Card', description: '3D perspective tilt on hover.', category: 'Cards', unique: true, dependencies: ['motion'], gesture: 'Move over the card to tilt in 3D.' },
  { slug: 'glass-card', title: 'Glass Card', description: 'Frosted liquid-glass surface.', category: 'Cards', unique: true },
  { slug: 'swipe-cards', title: 'Swipe Cards', description: 'Stacked deck with drag-to-dismiss.', category: 'Cards', unique: true, dependencies: ['motion'] },
  { slug: 'border-beam', title: 'Border Beam', description: 'Light travelling around a border.', category: 'Cards', unique: true },
  { slug: 'pixel-reveal', title: 'Pixel Reveal', description: 'Cascading pixel-grid image reveal.', category: 'Cards', unique: true },

  // Navigation
  { slug: 'compass-rail', title: 'Compass Rail', description: 'Vertical rail with a shortest-path compass marker.', category: 'Navigation', unique: true, isNew: true, gesture: 'Click items — the compass marker takes the short path.' },
  { slug: 'halo-menu', title: 'Halo Menu', description: 'Center action opens a 6-item halo.', category: 'Navigation', unique: true, isNew: true, gesture: 'Open the menu; use arrow keys to roam the halo.' },
  { slug: 'magnify-dock', title: 'Magnify Dock', description: 'Dock with proximity scaling.', category: 'Navigation', unique: true, dependencies: ['motion'], gesture: 'Slide across icons — neighbors magnify.' },
  { slug: 'orbiting-icons', title: 'Orbiting Icons', description: 'Icons circle a central hub.', category: 'Navigation', unique: true },

  { slug: 'curtain-drop-nav', title: 'Curtain Drop Nav', description: 'Top bar with curtain-reveal dropdown panels.', category: 'Navigation', unique: true, isNew: true, gesture: 'Hover or focus a tab — curtain drops.' },
  { slug: 'morph-pill-header', title: 'Morph Pill Header', description: 'Full header collapses to a floating pill on scroll.', category: 'Navigation', unique: true, isNew: true, gesture: 'Scroll the stage — header morphs into a pill.' },
  { slug: 'radial-toolburst', title: 'Radial Toolburst', description: 'Center control bursts into orbiting tool nodes.', category: 'Navigation', unique: true, isNew: true, gesture: 'Click + to burst tools; arrows to roam.' },
  { slug: 'magnetic-dock-nav', title: 'Magnetic Dock Nav', description: 'Dock with magnetic magnification on hover.', category: 'Navigation', unique: true, isNew: true, gesture: 'Slide across icons — neighbors magnify.' },


  // Cursors
  { slug: 'pill-trail-cursor', title: 'Pill Trail Cursor', description: 'Pointer leaves a springing trail of word pills.', category: 'Cursors', unique: true, isNew: true, gesture: 'Move inside the stage to leave pill trails.' },
  { slug: 'halftone-bloom-cursor', title: 'Halftone Bloom Cursor', description: 'Pointer blooms a lilac halftone matrix.', category: 'Cursors', unique: true, isNew: true, gesture: 'Move to bloom the halftone field.' },
  { slug: 'cursor-trail', title: 'Cursor Trail', description: 'Glowing trail following the pointer.', category: 'Cursors', unique: true, gesture: 'Move inside the stage to leave a trail.' },

  { slug: 'ribbon-trail-cursor', title: 'Ribbon Trail Cursor', description: 'Soft ribbon trail with springy spacing.', category: 'Cursors', unique: true, isNew: true, gesture: 'Move — a lilac ribbon follows.' },
  { slug: 'lens-flare-cursor', title: 'Lens Flare Cursor', description: 'Soft optical flare that lags behind the pointer.', category: 'Cursors', unique: true, isNew: true, gesture: 'Move — flare lags behind.' },
  { slug: 'ink-stamp-cursor', title: 'Ink Stamp Cursor', description: 'Small ink stamps that fade behind the pointer.', category: 'Cursors', unique: true, isNew: true, gesture: 'Move — ink stamps fade out.' },
  { slug: 'orbit-ring-cursor', title: 'Orbit Ring Cursor', description: 'Thin ring orbits the pointer.', category: 'Cursors', unique: true, isNew: true, gesture: 'Move — ring orbits the tip.' },


  // Search / Inputs
  { slug: 'morph-search-capsule', title: 'Morph Search Capsule', description: 'Compact search pill expands into a typing capsule.', category: 'Search / Inputs', unique: true, isNew: true, gesture: 'Click the icon — the capsule expands to type.' },
  { slug: 'elastic-slider', title: 'Elastic Slider', description: 'Thumb stretches elastically while dragging.', category: 'Search / Inputs', unique: true, dependencies: ['motion'] },
  { slug: 'signal-pebble', title: 'Signal Pebble', description: 'Procedural noise pebble with a status verb.', category: 'Search / Inputs', unique: true, isNew: true, gesture: 'Watch the pebble breathe — status text is the fallback.' },

  // Core
  { slug: 'button', title: 'Button', description: 'Versatile button with variants and sizes.', category: 'Core', dependencies: ['clsx', 'tailwind-merge'] },
  { slug: 'badge', title: 'Badge', description: 'Compact status and label chips.', category: 'Core' },
  { slug: 'card', title: 'Card', description: 'Composable surface for content blocks.', category: 'Core' },
  { slug: 'input', title: 'Input', description: 'Accessible text field with focus ring.', category: 'Core' },
  { slug: 'textarea', title: 'Textarea', description: 'Multi-line text input.', category: 'Core' },
  { slug: 'switch', title: 'Switch', description: 'Plain animated boolean switch.', category: 'Core' },
  { slug: 'checkbox', title: 'Checkbox', description: 'Checkbox with optional label.', category: 'Core' },
  { slug: 'tabs', title: 'Tabs', description: 'Keyboard-friendly tabbed panels.', category: 'Core' },
  { slug: 'accordion', title: 'Accordion', description: 'Expandable sections with motion.', category: 'Core', dependencies: ['motion'] },
  { slug: 'dialog', title: 'Dialog', description: 'Accessible modal dialog.', category: 'Core', dependencies: ['motion'] },
  { slug: 'tooltip', title: 'Tooltip', description: 'Hover/focus hint bubbles.', category: 'Core' },
  { slug: 'dropdown-menu', title: 'Dropdown Menu', description: 'Action menu anchored to a trigger.', category: 'Core' },
  { slug: 'toast', title: 'Toast', description: 'Transient notifications with a provider.', category: 'Core', dependencies: ['motion'] },
  { slug: 'avatar', title: 'Avatar', description: 'User image with initials fallback.', category: 'Core' },
  { slug: 'skeleton', title: 'Skeleton', description: 'Loading placeholders.', category: 'Core' },
  { slug: 'progress', title: 'Progress', description: 'Determinate progress bar.', category: 'Core' },
  { slug: 'breathing-dot', title: 'Breathing Dot', description: 'Soft pulsating status indicator.', category: 'Core', unique: true },
]

export const gettingStarted = DOCS.filter((d) => d.category === 'Getting Started')
export const componentDocs = DOCS.filter((d) => d.category !== 'Getting Started')

export function getDoc(slug: string) {
  return DOCS.find((d) => d.slug === slug)
}

const NAV_ORDER: DocCategory[] = [
  'Getting Started',
  'Animated Backgrounds',
  'Buttons',
  'Toggles',
  'Text Animations',
  'Cards',
  'Navigation',
  'Cursors',
  'Search / Inputs',
  'Core',
]

export function getNavGroups() {
  return NAV_ORDER.map((title) => ({
    title,
    items: DOCS.filter((d) => d.category === title),
  })).filter((g) => g.items.length > 0)
}
