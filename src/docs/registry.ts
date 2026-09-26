export type DocCategory =
  | 'Getting Started'
  | 'Animated Backgrounds'
  | 'Buttons'
  | 'Toggles'
  | 'Text Animations'
  | 'Shimmer'
  | 'Loading'
  | '404 Animation'
  | 'Toast'
  | 'Vertical Scroll'
  | 'Cards'
  | 'Navigation'
  | 'Sidebars'
  | 'WhatsApp / Messaging'
  | 'Notifications'
  | 'Widgets'
  | 'Voice Agent'
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
  { slug: 'dispatch-truck-button', title: 'Dispatch Truck Button', description: 'Order pill stretches into a road; a parcel thumps onto a courier flatbed that drives off before a green confirmation pops in.', category: 'Buttons', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Click — parcel drops, courier drives off, order confirms.', props: [
    { name: 'label', type: 'string', default: "'Place order'", description: 'Resting label.' },
    { name: 'successLabel', type: 'string', default: "'On its way'", description: 'Label once the courier leaves.' },
    { name: 'onOrder', type: '() => void | Promise<unknown>', description: 'Async work; the van idles until it settles. Rejecting shows a retry state.' },
    { name: 'resetAfter', type: 'number', default: '2600', description: 'Auto-reset delay in ms (0 keeps success).' },
  ] },
  { slug: 'drop-in-cart-button', title: 'Drop-In Cart Button', description: 'Pill tucks into a cart, a box springs into the basket, the cart rolls away and back while the badge and counter pop.', category: 'Buttons', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Click — box drops in, cart rolls, count pops.', props: [
    { name: 'label', type: 'string', default: "'Add to bag'", description: 'Button label.' },
    { name: 'count / defaultCount', type: 'number', default: '0', description: 'Controlled or uncontrolled item count.' },
    { name: 'onCountChange', type: '(n: number) => void', description: 'Fires after each add or clear.' },
    { name: 'max', type: 'number', default: '99', description: 'Disables the button when reached.' },
    { name: 'showCounter', type: 'boolean', default: 'true', description: 'Show the “N in your bag” line with Clear.' },
  ] },
  { slug: 'fill-progress-download-button', title: 'Fill Progress Download Button', description: 'Arrow sinks away, a deeper blue floods the pill with a live percentage, then it condenses into a calm done chip.', category: 'Buttons', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Click — watch the fill and percentage climb to done.', props: [
    { name: 'label', type: 'string', default: "'Download'", description: 'Resting label.' },
    { name: 'doneLabel', type: 'string', default: "'Saved'", description: 'Completion label.' },
    { name: 'onDownload', type: '(report: (p: number) => void) => Promise<unknown>', description: 'Real work; call report(0..1). Omit for organic simulated progress.' },
    { name: 'fileName', type: 'string', description: 'Optional file hint under the button.' },
    { name: 'resetAfter', type: 'number', default: '2800', description: 'Auto-reset delay in ms (0 keeps done).' },
  ] },
  { slug: 'swallow-delete-button', title: 'Swallow Delete Button', description: 'Bin lid swings open on its hinge, the label’s letters arc inside, the lid snaps shut and a ring traces the receipt.', category: 'Buttons', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Click — letters leap into the bin, ring draws, label returns.', props: [
    { name: 'variant', type: "'violet' | 'neutral' | 'danger'", default: "'violet'", description: 'Color treatment.' },
    { name: 'label', type: 'string', default: "'Delete'", description: 'Letters that get swallowed.' },
    { name: 'confirm', type: 'boolean', default: 'false', description: 'Require a second press (Esc or blur cancels).' },
    { name: 'onDelete', type: '() => void | Promise<unknown>', description: 'Rejecting spits the letters back with a shake.' },
  ] },
  { slug: 'face-scan-pay-button', title: 'Face Scan Pay Button', description: 'Navy pay pill folds into a lit square, a biometric reticle sweeps a face glyph while a comet laps the rim, then it unfolds with a check.', category: 'Buttons', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Click — watch the scan loop, then the paid check.', props: [
    { name: 'label / amount', type: 'string', default: "'Pay' / '$48.00'", description: 'Resting copy; amount repeats in the success label.' },
    { name: 'successLabel / errorLabel', type: 'string', default: "'Paid' / 'Try again'", description: 'Result copy.' },
    { name: 'onPay', type: '() => void | Promise<unknown>', description: 'Payment work; the scan loops until it settles. Rejecting shakes into a retry state.' },
    { name: 'minLoops / loopMs', type: 'number', default: '1 / 1500', description: 'Minimum rim laps and lap duration.' },
    { name: 'resetAfter', type: 'number', default: '2600', description: 'Auto-reset delay in ms (0 keeps success).' },
  ] },
  { slug: 'orbit-dot-export-button', title: 'Orbit Dot Export Button', description: 'Pill tucks down to its ring, a shaped comet orbits with a trailing progress arc, the ring floods solid, the arrow bends into a check and the pill reopens as the next action.', category: 'Buttons', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Click — orbit, fill, arrow morphs to check, then press “Open”.', props: [
    { name: 'dot', type: "'teardrop' | 'diamond' | 'spark' | 'bead'", default: "'teardrop'", description: 'Orbiting marker shape.' },
    { name: 'accent', type: 'string', default: "'#f5b14c'", description: 'Marker, arc and fill colour.' },
    { name: 'label / doneLabel', type: 'string', default: "'Export report' / 'Open file'", description: 'Before/after labels.' },
    { name: 'onExport', type: '(report: (p: number) => void) => Promise<unknown>', description: 'Real work with progress; rejecting shows a retry label.' },
    { name: 'onOpen', type: '() => void', description: 'Pressed in the done state; the button resets afterwards.' },
  ] },
  { slug: 'shredder-delete-button', title: 'Shredder Delete Button', description: 'Pill holds still while its icon works: the lid flips, a sheet feeds in, paper ribbons tumble out below and a tally counts each shred.', category: 'Buttons', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Click — sheet feeds in, strips fall, tally ticks up.', props: [
    { name: 'variant', type: "'violet' | 'light' | 'danger'", default: "'violet'", description: 'Colour treatment.' },
    { name: 'label / busyLabel / doneLabel', type: 'string', default: "'Delete file' / 'Shredding…' / 'Shredded'", description: 'Label per stage.' },
    { name: 'strips', type: 'number', default: '7', description: 'Paper strips per shred (4–9).' },
    { name: 'width', type: 'number', default: '208', description: 'Fixed pill width; the pill never resizes.' },
    { name: 'showCount', type: 'boolean', default: 'true', description: 'Show the running × N tally.' },
    { name: 'onDelete', type: '() => void | Promise<unknown>', description: 'Rejecting jams the shredder and spits the sheet back.' },
  ] },
  { slug: 'cloud-launch-publish-button', title: 'Cloud Launch Publish Button', description: 'The arrow launches out of the cloud on a puff of vapour, a progress seam draws along the bottom edge, and a check drops back into the cloud.', category: 'Buttons', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Click — arrow launches, seam fills, check lands.', props: [
    { name: 'variant', type: "'dark' | 'light'", default: "'dark'", description: 'Surface theme.' },
    { name: 'label / busyLabel / doneLabel', type: 'string', default: "'Publish' / 'Publishing' / 'Live now'", description: 'Label per stage.' },
    { name: 'onPublish', type: '(report: (p: number) => void) => Promise<unknown>', description: 'Real progress; rejecting turns the seam rose with a retry label.' },
    { name: 'resetAfter', type: 'number', default: '2800', description: 'Auto-reset delay in ms (0 keeps done).' },
  ] },
  { slug: 'radial-share-menu', title: 'Radial Share Menu', description: 'Share pill folds into a close button while channel bubbles spring out on an arc; the pick glides to centre, becomes a check and really copies the link.', category: 'Buttons', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Click Share — arrow keys around the arc, Enter to pick, Esc to close.', props: [
    { name: 'url', type: 'string', default: 'location.href', description: 'Link written to the clipboard by copy channels.' },
    { name: 'channels', type: 'ShareChannel[]', default: 'DEFAULT_SHARE_CHANNELS', description: '{ id, label, icon, color, ink?, feedback?, kind?, href? }' },
    { name: 'radius', type: 'number', default: '104', description: 'Arc radius in px.' },
    { name: 'onShare', type: '(channel) => void | Promise<unknown>', description: 'Async hook; rejecting shows a retry bubble.' },
    { name: 'resetAfter', type: 'number', default: '1700', description: 'Confirmation hold before reset (ms).' },
  ] },


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


  // Shimmer
  { slug: 'prism-sweep-shimmer', title: 'Prism Sweep Shimmer', description: 'Diagonal prismatic light band; intensity follows pointer X.', category: 'Shimmer', unique: true, isNew: true, gesture: 'Move horizontally — the prism band tracks X.' },
  { slug: 'mercury-vein-shimmer', title: 'Mercury Vein Shimmer', description: 'Liquid-metal highlight veins crawl a rounded surface.', category: 'Shimmer', unique: true, isNew: true, gesture: 'Watch mercury veins crawl the surface.' },
  { slug: 'glyph-aurora-shimmer', title: 'Glyph Aurora Shimmer', description: 'Aurora shimmer travels letter-by-letter on text.', category: 'Shimmer', unique: true, isNew: true, gesture: 'Watch the aurora sweep glyph by glyph.' },
  { slug: 'edge-flare-shimmer', title: 'Edge Flare Shimmer', description: 'Soft flare travels the border edge (not a full beam).', category: 'Shimmer', unique: true, isNew: true, gesture: 'Watch the localized flare travel the rim.' },
  { slug: 'skeleton-wave-shimmer', title: 'Skeleton Wave Shimmer', description: 'Premium content-block skeleton with a diagonal liquid wave — avatar, lines, media.', category: 'Shimmer', unique: true, isNew: true, gesture: 'Watch the liquid wave sweep bones and media.' },
  { slug: 'card-sheen-loader', title: 'Card Sheen Loader', description: 'Product-card placeholder with traveling chrome sheen and soft breathing.', category: 'Shimmer', unique: true, isNew: true, gesture: 'Watch the chrome sheen travel; card breathes gently.' },
  { slug: 'list-bloom-shimmer', title: 'List Bloom Shimmer', description: 'Stacked list rows bloom in with staggered shimmer and soft shadows.', category: 'Shimmer', unique: true, isNew: true, gesture: 'Watch rows bloom in stagger, then shimmer.' },

  // Loading
  { slug: 'orbital-bead-loader', title: 'Orbital Bead Loader', description: 'Beads orbit a core; hover speeds up.', category: 'Loading', unique: true, isNew: true, gesture: 'Hover — orbit accelerates.' },
  { slug: 'ink-drip-loader', title: 'Ink Drip Loader', description: 'Ink drops merge into a looping puddle.', category: 'Loading', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Watch drops merge into the puddle.' },
  { slug: 'morph-glyph-loader', title: 'Morph Glyph Loader', description: 'Glyph morphs through abstract SVG shapes.', category: 'Loading', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Watch the glyph morph between shapes.' },
  { slug: 'particle-morph-loader', title: 'Particle Morph Loader', description: 'A depth-lit swarm of motes spins in 3D and melts between sphere, ribbon, shell, tetra, ring and helix while a status word rolls underneath.', category: 'Loading', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Watch the swarm morph; pick a shape or tint, or simulate done/error.', props: [
    { name: 'shapes', type: "ParticleShape[]", default: "['sphere','ribbon','shell','tetra','ring','helix']", description: 'Forms to cycle; pass one to lock it.' },
    { name: 'size', type: 'number', default: '180', description: 'Canvas edge in px.' },
    { name: 'color', type: 'string', default: "'#a78bfa'", description: 'Particle tint (#rrggbb).' },
    { name: 'labels', type: 'string[]', description: 'Status words, one per morph.' },
    { name: 'speed / points', type: 'number', default: '1 / 320', description: 'Cadence multiplier and particle count.' },
    { name: 'state', type: "'loading' | 'done' | 'error'", default: "'loading'", description: 'Done condenses to mint; error scatters in rose.' },
    { name: 'onRetry', type: '() => void', description: 'Renders a retry pill in the error state.' },
  ] },
  { slug: 'lattice-pulse-loader', title: 'Lattice Pulse Loader', description: '3×3 nodes pulse in a traveling wave.', category: 'Loading', unique: true, isNew: true, gesture: 'Watch the wave travel the lattice.' },

  // 404 Animation
  { slug: 'constellation-lost-404', title: 'Constellation Lost 404', description: 'Tiny 3D astronaut among reconnecting star “404” with pointer parallax.', category: '404 Animation', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Move to parallax layers; watch stars reconnect.' },
  { slug: 'paper-tear-404', title: 'Paper Tear 404', description: '3D folded paper character peeking through a torn hole; perspective scraps.', category: '404 Animation', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Watch the paper buddy peek and scraps float.' },
  { slug: 'glitch-portal-404', title: 'Glitch Portal 404', description: 'Faceted buddy stuck in a chromatic portal — RGB split, scanlines, rim glow.', category: '404 Animation', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Watch the glitch buddy struggle in the portal.' },
  { slug: 'paper-orbit-404', title: 'Paper Orbit 404', description: 'Layered paper-cut space scene with orbital rings, cratered moons, astronaut, and terracotta home CTA.', category: '404 Animation', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Move for parallax — astronaut bobs, rockets drift, rings rotate.' },
  { slug: 'mars-tether-404', title: 'Mars Tether 404', description: 'Mars-textured sphere as the 0, orange astronaut perched on top, tethered rocket with waving path.', category: '404 Animation', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Watch planet rotate, tether wave, rocket thrust flicker.' },
  { slug: 'mesh-orb-404', title: 'Mesh Orb 404', description: 'Glowing mesh-grid sphere with bloom, pulse synced to fake audio, equatorial waveform ring.', category: '404 Animation', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Move to tilt the sphere; watch mesh rotate and bloom breathe.' },
  { slug: 'lens-reveal-404', title: 'Lens Reveal 404', description: 'A caretaker sweeps beneath a giant amber 404 while a brass loupe follows the pointer and magnifies a hidden message layer.', category: '404 Animation', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Move the loupe (or arrow keys) — find the secret under the lens.', props: [
    { name: 'title / subtitle', type: 'string', description: 'Visible copy outside the lens.' },
    { name: 'secretTitle / secretSubtitle', type: 'string', description: 'Copy that only appears under the lens.' },
    { name: 'radius', type: 'number', default: '76', description: 'Lens radius in px.' },
    { name: 'zoom', type: 'number', default: '1.5', description: 'Magnification inside the lens.' },
    { name: 'homeHref / onHome', type: 'string / () => void', default: "'/'", description: 'Home button target or handler.' },
  ] },


  // Toast (signature — distinct from Core toast)
  { slug: 'gravity-stack-toast', title: 'Gravity Stack Toast', description: 'Gravity-bounce stack with provider/hook.', category: 'Toast', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Trigger toasts — they fall into a bouncing stack.' },
  { slug: 'ribbon-unfurl-toast', title: 'Ribbon Unfurl Toast', description: 'Ribbon unfurl enter animation.', category: 'Toast', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Trigger — ribbon unfurls from the side.' },
  { slug: 'sonar-ping-toast', title: 'Sonar Ping Toast', description: 'Expanding sonar rings on appear.', category: 'Toast', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Trigger — sonar rings expand on appear.' },

  // Vertical Scroll
  { slug: 'parallax-reel-scroll', title: 'Parallax Reel Scroll', description: 'Multi-layer stars/grid + mid art + foreground cards with scrub progress.', category: 'Vertical Scroll', unique: true, isNew: true, gesture: 'Scroll — depth layers lag; scrub bar tracks progress.' },
  { slug: 'snap-magnet-scroll', title: 'Snap Magnet Scroll', description: 'Cinematic full-bleed sections with magnetic overshoot settle and glowing rail.', category: 'Vertical Scroll', unique: true, isNew: true, gesture: 'Scroll, swipe, or ↑↓ — magnets overshoot then settle.' },
  { slug: 'velocity-fade-stack', title: 'Velocity Fade Stack', description: 'Rich cards scale/blur/opacity from distance + inertia velocity; center focus.', category: 'Vertical Scroll', unique: true, isNew: true, gesture: 'Scroll fast then coast — focus blooms as velocity drops.' },

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

  { slug: 'hologram-flip-card', title: 'Hologram Flip Card', description: 'Flip to holographic rear with iridescent sheen.', category: 'Cards', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Click to flip; move for iridescent sheen.' },
  { slug: 'liquid-morph-card', title: 'Liquid Morph Card', description: 'Border/blob morphs toward pointer.', category: 'Cards', unique: true, isNew: true, gesture: 'Move over the card — the blob leans toward you.' },
  { slug: 'gravity-expand-card', title: 'Gravity Expand Card', description: 'Click expands with spring; collapse on second click/outside.', category: 'Cards', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Click to expand; click again or outside to collapse.' },
  { slug: 'flip-checkout-card', title: 'Flip Checkout Card', description: 'Frosted payment card mirrors every keystroke, flips for the security code, and the checkout condenses into a receipt once paid.', category: 'Cards', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Type card details — focus the security code to flip; Pay to finish.', props: [
    { name: 'amount', type: 'number', default: '129', description: 'Charge amount.' },
    { name: 'currency', type: 'string', default: "'USD'", description: 'ISO currency for formatting.' },
    { name: 'merchant', type: 'string', default: "'Atelier Nine'", description: 'Payee shown in form and receipt.' },
    { name: 'issuer', type: 'string', default: "'Lumen'", description: 'Name printed on the card face.' },
    { name: 'onPay', type: '(details) => Promise<unknown> | void', description: 'Async payment; rejecting shows a decline message.' },
  ] },

  // Navigation
  { slug: 'compass-rail', title: 'Compass Rail', description: 'Vertical rail with a shortest-path compass marker.', category: 'Navigation', unique: true, isNew: true, gesture: 'Click items — the compass marker takes the short path.' },
  { slug: 'halo-menu', title: 'Halo Menu', description: 'Center action opens a 6-item halo.', category: 'Navigation', unique: true, isNew: true, gesture: 'Open the menu; use arrow keys to roam the halo.' },
  { slug: 'magnify-dock', title: 'Magnify Dock', description: 'Dock with proximity scaling.', category: 'Navigation', unique: true, dependencies: ['motion'], gesture: 'Slide across icons — neighbors magnify.' },
  { slug: 'orbiting-icons', title: 'Orbiting Icons', description: 'Icons circle a central hub.', category: 'Navigation', unique: true },

  { slug: 'curtain-drop-nav', title: 'Curtain Drop Nav', description: 'Top bar with curtain-reveal dropdown panels.', category: 'Navigation', unique: true, isNew: true, gesture: 'Hover or focus a tab — curtain drops.' },
  { slug: 'morph-pill-header', title: 'Morph Pill Header', description: 'Full header collapses to a floating pill on scroll.', category: 'Navigation', unique: true, isNew: true, gesture: 'Scroll the stage — header morphs into a pill.' },
  { slug: 'radial-toolburst', title: 'Radial Toolburst', description: 'Center control bursts into orbiting tool nodes.', category: 'Navigation', unique: true, isNew: true, gesture: 'Click + to burst tools; arrows to roam.' },
  { slug: 'magnetic-dock-nav', title: 'Magnetic Dock Nav', description: 'Dock with magnetic magnification on hover.', category: 'Navigation', unique: true, isNew: true, gesture: 'Slide across icons — neighbors magnify.' },



  // Sidebars
  { slug: 'rail-bloom-sidebar', title: 'Rail Bloom Sidebar', description: 'Collapsible icon rail that blooms labels and soft glow; liquid active indicator.', category: 'Sidebars', unique: true, isNew: true, gesture: 'Hover to expand — labels bloom; click for liquid active.', dependencies: ['motion'] },
  { slug: 'section-accordion-sidebar', title: 'Section Accordion Sidebar', description: 'Nested sections accordion-open with spring height; sticky workspace header + search.', category: 'Sidebars', unique: true, isNew: true, gesture: 'Toggle sections; search filters leaves.', dependencies: ['motion'] },
  { slug: 'context-drawer-sidebar', title: 'Context Drawer Sidebar', description: 'Slim rail ↔ wide frosted context drawer with animated width and pin toggle.', category: 'Sidebars', unique: true, isNew: true, gesture: 'Hover rail to widen; pin to keep context open.', dependencies: ['motion'] },
  { slug: 'command-tree-sidebar', title: 'Command Tree Sidebar', description: 'Hierarchical tree with ↑↓/Enter, typeahead highlight, morphing path breadcrumb.', category: 'Sidebars', unique: true, isNew: true, gesture: 'Focus the tree — arrows, Enter, or type to filter.', dependencies: ['motion'] },
  { slug: 'glass-workspace-sidebar', title: 'Glass Workspace Sidebar', description: 'Frosted glass pro sidebar with workspace switcher, collapsible groups, notification pip, user footer.', category: 'Sidebars', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Toggle width; expand groups; open workspace switcher.' },
  { slug: 'timeline-rail-sidebar', title: 'Timeline Rail Sidebar', description: 'Vertical ops/CPaaS timeline rail — events as nodes, active glow, scroll-sync scrubber.', category: 'Sidebars', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Click nodes or scrub the bottom rail — active node glows.' },
  { slug: 'mega-flyout-sidebar', title: 'Mega Flyout Sidebar', description: 'Icon rail that opens rich 2-col flyout panels with curtain/slide motion — enterprise marketing feel.', category: 'Sidebars', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Hover or focus icons — flyout panels slide in.' },
  { slug: 'priority-inbox-sidebar', title: 'Priority Inbox Sidebar', description: 'Messaging ops sidebar: Open/Pending/Snoozed filters, channel tabs, search, unread bloom snippets.', category: 'Sidebars', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Filter, search, and select conversations — unread badges bloom.' },
  { slug: 'orbit-switcher-sidebar', title: 'Orbit Switcher Sidebar', description: 'Multi-product switcher orb that morphs between Messaging / Voice / SMS with animated icon swap.', category: 'Sidebars', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Tap orbit icons to morph product context and nav.' },


  // WhatsApp / Messaging
  { slug: 'thread-bubble-stack', title: 'Thread Bubble Stack', description: 'Inbound/outbound chat bubbles with status ticks, timestamps, soft enter animation.', category: 'WhatsApp / Messaging', unique: true, isNew: true, gesture: 'Send a message — ticks advance sent→delivered→read.', dependencies: ['motion'] },
  { slug: 'inbox-pulse-list', title: 'Inbox Pulse List', description: 'Conversation rows with unread bloom badge, preview, channel chip, hover actions.', category: 'WhatsApp / Messaging', unique: true, isNew: true, gesture: 'Hover rows to reveal pin/archive actions.', dependencies: ['motion'] },
  { slug: 'template-message-card', title: 'Template Message Card', description: 'Approved template preview with header media, body vars, footer, CTAs + shimmer approve.', category: 'WhatsApp / Messaging', unique: true, isNew: true, gesture: 'Click Submit review — shimmer settles to Approved.', dependencies: ['motion'] },
  { slug: 'campaign-composer-strip', title: 'Campaign Composer Strip', description: 'Mini broadcast composer: audience chip, channel toggle, schedule pill, send progress.', category: 'WhatsApp / Messaging', unique: true, isNew: true, gesture: 'Toggle channel and hit Send now — watch the ribbon.', dependencies: ['motion'] },
  { slug: 'typing-wave-indicator', title: 'Typing Wave Indicator', description: 'Multi-dot typing indicator with wave and optional agent handoff label.', category: 'WhatsApp / Messaging', unique: true, isNew: true, gesture: 'Watch the wave — Agent is typing.', dependencies: ['motion'] },
  { slug: 'opt-in-consent-banner', title: 'Opt-In Consent Banner', description: 'Soft messaging opt-in compliance banner with animated check and decline.', category: 'WhatsApp / Messaging', unique: true, isNew: true, gesture: 'Accept or decline — animated confirmation states.', dependencies: ['motion'] },
  { slug: 'media-carousel-bubble', title: 'Media Carousel Bubble', description: 'Inbound/outbound bubble with image carousel, dots, and caption.', category: 'WhatsApp / Messaging', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Swipe or tap arrows/dots to change slides.' },
  { slug: 'reaction-chip-bar', title: 'Reaction Chip Bar', description: 'Message reaction emoji chips that pop in, with add-reaction affordance.', category: 'WhatsApp / Messaging', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Tap chips to count up; open smile to add a reaction.' },
  { slug: 'whatsapp-flow-form', title: 'WhatsApp Flow Form', description: 'Interactive Flow / survey card with rating fields and submit — in-chat business flow.', category: 'WhatsApp / Messaging', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Pick a rating, add a note, submit for confirmation.' },
  { slug: 'catalog-product-card', title: 'Catalog Product Card', description: 'Product catalog card with price, image placeholder, and add-to-cart micro interaction.', category: 'WhatsApp / Messaging', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Tap Add — cart check confirms.' },
  { slug: 'session-window-timer', title: 'Session Window Timer', description: '24h messaging session window countdown ring with urgency color shift.', category: 'WhatsApp / Messaging', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Watch the ring drain; urgency shifts as time runs low.' },
  { slug: 'agent-handoff-card', title: 'Agent Handoff Card', description: 'Bot→human handoff card with agent avatar bloom and Connecting you… state.', category: 'WhatsApp / Messaging', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Tap Talk to a person — avatar blooms while connecting.' },
  { slug: 'broadcast-status-board', title: 'Broadcast Status Board', description: 'Mini campaign status: queued/sent/delivered/read/failed with animated counters.', category: 'WhatsApp / Messaging', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Watch counters ease up to live campaign totals.' },
  { slug: 'quick-reply-chip-cloud', title: 'Quick Reply Chip Cloud', description: 'Cloud of quick-reply chips with magnetic hover and select.', category: 'WhatsApp / Messaging', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Hover chips — they magnet toward the pointer; click to select.' },


  // Notifications
  { slug: 'notification-orbit-center', title: 'Notification Orbit Center', description: 'Bell opens a panel; items stack with unread glow; mark-all-read clears glow.', category: 'Notifications', unique: true, isNew: true, gesture: 'Toggle the bell; Mark all read clears the glow.', dependencies: ['motion'] },
  { slug: 'priority-banner-alert', title: 'Priority Banner Alert', description: 'Full-width priority banner (info/warn/critical) with slide-in and auto-dismiss.', category: 'Notifications', unique: true, isNew: true, gesture: 'Pick a tone — banner slides in with progress dismiss.', dependencies: ['motion'] },
  { slug: 'inbox-row-notifier', title: 'Inbox Row Notifier', description: 'Dense notification feed row with glyph, title, meta, relative time, hover actions.', category: 'Notifications', unique: true, isNew: true, gesture: 'Hover rows to reveal mark-read / archive.', dependencies: ['motion'] },
  { slug: 'badge-bloom-counter', title: 'Badge Bloom Counter', description: 'Numeric badge that blooms and scales when the count changes.', category: 'Notifications', unique: true, isNew: true, gesture: 'Tap +/− — badge blooms on each change.', dependencies: ['motion'] },
  { slug: 'push-preview-card', title: 'Push Preview Card', description: 'Mobile-style push notification preview with app icon, title, body, time.', category: 'Notifications', unique: true, isNew: true, gesture: 'Watch the push card settle into the phone frame.', dependencies: ['motion'] },

  // Widgets
  { slug: 'kpi-spark-widget', title: 'KPI Spark Widget', description: 'KPI number ticker with mini sparkline that draws on mount and a trend delta pill.', category: 'Widgets', unique: true, isNew: true, gesture: 'Watch the ticker and sparkline draw on mount.', dependencies: ['motion'] },
  { slug: 'live-meter-dial', title: 'Live Meter Dial', description: 'Animated semicircle gauge for delivery rate / ASR / concurrent calls.', category: 'Widgets', unique: true, isNew: true, gesture: 'Watch the needle breathe with live values.', dependencies: ['motion'] },
  { slug: 'activity-stream-widget', title: 'Activity Stream Widget', description: 'Live-feeling activity feed with staggered row inserts.', category: 'Widgets', unique: true, isNew: true, gesture: 'Watch new events insert at the top.', dependencies: ['motion'] },
  { slug: 'status-heatmap-grid', title: 'Status Heatmap Grid', description: 'Compact hour×day heatmap for message volume with hover tooltip.', category: 'Widgets', unique: true, isNew: true, gesture: 'Hover cells for volume tooltips.' },
  { slug: 'ring-progress-cluster', title: 'Ring Progress Cluster', description: 'Cluster of animated progress rings for queue depth, SLA, and capacity.', category: 'Widgets', unique: true, isNew: true, gesture: 'Watch rings ease as metrics drift.', dependencies: ['motion'] },

  // Voice Agent
  { slug: 'call-control-bar', title: 'Call Control Bar', description: 'Mute / hold / end / keypad with glowing active states and hold pulse.', category: 'Voice Agent', unique: true, isNew: true, gesture: 'Toggle mute, hold, keypad — end to hang up.', dependencies: ['motion'] },
  { slug: 'live-transcript-panel', title: 'Live Transcript Panel', description: 'Scrolling dual-speaker transcript with speaker pills and auto-scroll.', category: 'Voice Agent', unique: true, isNew: true, gesture: 'Watch lines append for caller and agent.', dependencies: ['motion'] },
  { slug: 'agent-state-orb', title: 'Agent State Orb', description: 'Listening / thinking / speaking orb with distinct motion modes.', category: 'Voice Agent', unique: true, isNew: true, gesture: 'Click the orb to cycle listening → thinking → speaking.', dependencies: ['motion'] },
  { slug: 'voice-waveform-lane', title: 'Voice Waveform Lane', description: 'Animated audio waveform bars reacting to simulated level; latency chip.', category: 'Voice Agent', unique: true, isNew: true, gesture: 'Move across the lane to drive the waveform.', dependencies: ['motion'] },
  { slug: 'softphone-dial-pad', title: 'Softphone Dial Pad', description: 'Stylish dial pad with ripple keys, number display, ringing call button.', category: 'Voice Agent', unique: true, isNew: true, gesture: 'Tap keys — ripples; Call rings until hang up.', dependencies: ['motion'] },
  { slug: 'queue-ticket-card', title: 'Queue Ticket Card', description: 'Call queue card with wait ticker, priority, skill tags, claim/transfer actions.', category: 'Voice Agent', unique: true, isNew: true, gesture: 'Watch wait tick; claim or transfer with micro-press.', dependencies: ['motion'] },
  { slug: 'prism-mesh-orb', title: 'Prism Mesh Orb', description: 'Iridescent mesh sphere — idle/listen/speak modes, pointer tilt, equatorial voice wave when speaking.', category: 'Voice Agent', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Switch Idle/Listen/Speak; move to tilt the sphere.' },
  { slug: 'liquid-metal-orb', title: 'Liquid Metal Orb', description: 'Mercury / liquid-metal ball with traveling highlight; morphs slightly when speaking.', category: 'Voice Agent', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Click the orb or mode chips to cycle idle → listen → speak.' },
  { slug: 'aurora-core-orb', title: 'Aurora Core Orb', description: 'Inner aurora ribbons through a translucent shell; outer soft glow rings expand on listen.', category: 'Voice Agent', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Switch modes — listen expands rings; speak speeds aurora.' },
  { slug: 'particle-halo-orb', title: 'Particle Halo Orb', description: 'Core ball + orbiting particle halo that densifies with energy; demo slider or auto level.', category: 'Voice Agent', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Drag energy slider or leave on Auto — halo densifies.' },
  { slug: 'ribbon-helix-wave', title: 'Ribbon Helix Wave', description: 'Premium dual ribbon helix / sine ribbons reacting to amplitude — best-in-class voice visualizer.', category: 'Voice Agent', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Move across the stage to drive amplitude.' },
  { slug: 'radial-sonar-wave', title: 'Radial Sonar Wave', description: 'Circular sonar / polar waveform around a center mic glyph; pulse rings on peaks.', category: 'Voice Agent', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Watch polar bars react; peaks fire sonar rings.' },


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
  'Shimmer',
  'Loading',
  '404 Animation',
  'Toast',
  'Vertical Scroll',
  'Cards',
  'Navigation',
  'Sidebars',
  'WhatsApp / Messaging',
  'Notifications',
  'Widgets',
  'Voice Agent',
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
