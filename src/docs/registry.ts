export type DocCategory =
  | 'Getting Started'
  | 'Hero'
  | 'Portfolio'
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
  | 'Inputs / Forms'
  | 'Product UI'
  | 'Website Sections'
  | 'Motion Showcase'
  | 'Data Widgets'
  | 'Core'

export type DocEntry = {
  slug: string
  title: string
  description: string
  category: DocCategory
  unique?: boolean
  isNew?: boolean
  gesture?: string
  /** Full-scene component that paints its own backdrop (still overridable via className/props). */
  ownBackground?: boolean
  /** Short note shown under the preview for full-scene components. */
  backgroundNote?: string
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
  { slug: 'installation', title: 'Installation', description: 'Install components with the shadcn CLI registry — or copy-paste them by hand.', category: 'Getting Started' },
  { slug: 'theming', title: 'Theming', description: 'Colors, dark mode, and Tailwind tokens.', category: 'Getting Started' },

  // Hero
  { slug: 'split-flap-hero', ownBackground: true, backgroundNote: 'Paints its own warm-paper (light) / ink (dark) backdrop via dark: variants; the flap board itself stays charcoal in both. Override the surface with className (bg-*, rounded-*, py-*).', title: 'Split-Flap Hero', description: 'A landing hero whose key phrase lives on a mechanical departure board — every character clacks through the alphabet on hinged 3D leaves before landing, with flap counters underneath.', category: 'Hero', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Watch the board flip; use the arrows or pause button bottom-right.', props: [
    { name: 'words', type: 'string[]', default: 'DEFAULT_SPLIT_FLAP_WORDS', description: 'Phrases cycled on the board (upper-cased, up to 12 characters).' },
    { name: 'prefix', type: 'string', default: '\'Interfaces that\'', description: 'Static headline line above the board.' },
    { name: 'description / eyebrow', type: 'string', description: 'Supporting copy and the pill above the headline.' },
    { name: 'ctaLabel / onCta', type: 'string / () => void', default: '\'Get your ticket\'', description: 'Primary button.' },
    { name: 'secondaryLabel / onSecondary', type: 'string / () => void', description: 'Ghost button; omit label to hide.' },
    { name: 'stats', type: '{ value, label }[]', description: 'Small amber flap counters under the CTAs.' },
    { name: 'interval', type: 'number', default: '3400', description: 'ms each phrase rests on the board.' },
    { name: 'autoPlay', type: 'boolean', default: 'true', description: 'Cycle automatically; pause/next/prev controls are always rendered.' },
    { name: 'onWordChange', type: '(word, index) => void', description: 'Fires when the board lands on a new phrase.' },
  ] },
  { slug: 'ridgeline-horizon-hero', ownBackground: true, backgroundNote: 'Paints its own canvas sky and terrain and adapts on its own: theme=\'auto\' follows the nearest .dark / .light ancestor (dusk violet on dark, apricot dawn on light). Force a look with theme and restyle the frame with className.', title: 'Ridgeline Horizon Hero', description: 'Headline words rise out of masks above a canvas terrain of stacked ridgelines receding to a sunrise; the pointer raises a swell that rolls back to the horizon and clicks send a ripple.', category: 'Hero', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Move across the hero to raise a swell; click to send a ripple.', props: [
    { name: 'title / highlight', type: 'string', description: 'Headline and the phrase that gets the dawn gradient.' },
    { name: 'description / eyebrow', type: 'string', description: 'Supporting copy and pill.' },
    { name: 'ctaLabel / onCta', type: 'string / () => void', default: '\'Start the climb\'', description: 'Primary button.' },
    { name: 'secondaryLabel / onSecondary', type: 'string / () => void', description: 'Ghost button; omit label to hide.' },
    { name: 'lines', type: 'number', default: '30', description: 'Ridgeline count (12–48).' },
    { name: 'interactive', type: 'boolean', default: 'true', description: 'Pointer swell and click ripple.' },
    { name: 'theme', type: "'auto' | 'light' | 'dark'", default: "'auto'", description: 'auto follows the nearest .dark / .light ancestor; light / dark force a palette.' },
  ] },

  // Animated Backgrounds
  { slug: 'iron-filings-field', ownBackground: true, backgroundNote: 'Paints its own paper (light) / graphite (dark) canvas and adapts on its own: theme=\'auto\' follows the nearest .dark / .light ancestor. Force a look with theme and restyle the frame with className.', title: 'Iron Filings Field', description: 'Thousands of steel needles on paper swing with a little inertia to align with the magnetic field of a few poles; the pointer carries a north pole and clicks drop new poles.', category: 'Animated Backgrounds', unique: true, isNew: true, dependencies: [], gesture: 'Move to carry a pole; click to pin it (you get the opposite one). Double-click clears.', props: [
    { name: 'spacing', type: 'number', default: '16', description: 'Grid spacing of filings (10–40px).' },
    { name: 'interactive', type: 'boolean', default: 'true', description: 'Pointer pole, click-to-drop and the pole buttons.' },
    { name: 'drift', type: 'boolean', default: 'true', description: 'Idle poles orbit slowly.' },
    { name: 'children', type: 'ReactNode', description: 'Content layered over the field.' },
    { name: 'theme', type: "'auto' | 'light' | 'dark'", default: "'auto'", description: 'auto follows the nearest .dark / .light ancestor; light / dark force a palette.' },
  ] },
  { slug: 'glow-arc-hero', ownBackground: true, backgroundNote: 'Paints its own backdrop with light and dark: variants — off-white with soft coloured shadows on light pages, deep ink with neon glow on dark. Override the surface with className (e.g. bg-*, rounded-*, h-*).', title: 'Glow Arc Hero', description: 'A rainbow of glossy tiles fans in around a centred headline; each tile breathes its own coloured halo while the arc sways and tilts toward the pointer.', category: 'Animated Backgrounds', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Move across the hero to tilt the arc; hover a tile to lift it.', props: [
    { name: 'items', type: 'GlowArcItem[]', default: 'DEFAULT_GLOW_ARC_ITEMS', description: '{ id, label, src?, hue?, icon? } — pass src to drop real artwork into the tiles.' },
    { name: 'title / highlight', type: 'string', description: 'Headline and the words that get gradient ink.' },
    { name: 'description / eyebrow', type: 'string', description: 'Supporting copy and the pill above the headline.' },
    { name: 'ctaLabel / onCta', type: 'string / () => void', default: "'Start building'", description: 'Primary pill button.' },
    { name: 'secondaryLabel / onSecondary', type: 'string / () => void', description: 'Ghost button; omit label to hide.' },
    { name: 'onItemSelect', type: '(item) => void', description: 'Makes tiles focusable buttons.' },
    { name: 'parallax', type: 'boolean', default: 'true', description: 'Pointer tilt of the arc.' },
    { name: 'drift', type: 'boolean', default: 'true', description: 'Slow pendulum sway of the arc.' },
  ] },
  { slug: 'prism-tidal-field', props: [{ name: 'theme', type: "'auto' | 'light' | 'dark'", default: "'auto'", description: 'auto follows the nearest .dark / .light ancestor; light / dark force a palette.' }],  ownBackground: true, backgroundNote: "Paints its own canvas backdrop and adapts on its own: theme='auto' (default) follows the nearest .dark / .light ancestor. Force a look with theme='light' or theme='dark', and restyle the frame (radius, size, border) with className.", title: 'Prism Tidal Field', description: 'Soft lilac tidal bands that bend toward pointer velocity.', category: 'Animated Backgrounds', unique: true, isNew: true, gesture: 'Move your cursor — tides lean toward velocity.' },
  { slug: 'constellation-breathing-grid', props: [{ name: 'theme', type: "'auto' | 'light' | 'dark'", default: "'auto'", description: 'auto follows the nearest .dark / .light ancestor; light / dark force a palette.' }],  ownBackground: true, backgroundNote: "Paints its own canvas backdrop and adapts on its own: theme='auto' (default) follows the nearest .dark / .light ancestor. Force a look with theme='light' or theme='dark', and restyle the frame (radius, size, border) with className.", title: 'Constellation Breathing Grid', description: 'Sparse nodes breathe and link when close.', category: 'Animated Backgrounds', unique: true, isNew: true, gesture: 'Move near nodes — links brighten on proximity.' },
  { slug: 'paperfold-gradient-plane', ownBackground: true, backgroundNote: 'Paints its own backdrop with light and dark: variants, so it matches the host page. Override the surface with className (e.g. bg-*, rounded-*).', title: 'Paperfold Gradient Plane', description: 'Folded translucent ribbons shift with the pointer.', category: 'Animated Backgrounds', unique: true, isNew: true, gesture: 'Move across the plane — folds follow your hand.' },
  { slug: 'aurora-background', ownBackground: true, backgroundNote: 'Paints its own backdrop with light and dark: variants, so it matches the host page. Override the surface with className (e.g. bg-*, rounded-*).', title: 'Aurora Background', description: 'Drifting mesh aurora backdrop.', category: 'Animated Backgrounds', unique: true },
  { slug: 'ink-ripple-grid', ownBackground: true, backgroundNote: 'Paints its own backdrop with light and dark: variants, so it matches the host page. Override the surface with className (e.g. bg-*, rounded-*).', title: 'Ink Ripple Grid', description: 'Click blooms ink ripples on a grid.', category: 'Animated Backgrounds', unique: true, gesture: 'Click the grid to spill ink.' },

  { slug: 'silk-shear-field', props: [{ name: 'theme', type: "'auto' | 'light' | 'dark'", default: "'auto'", description: 'auto follows the nearest .dark / .light ancestor; light / dark force a palette.' }],  ownBackground: true, backgroundNote: "Paints its own canvas backdrop and adapts on its own: theme='auto' (default) follows the nearest .dark / .light ancestor. Force a look with theme='light' or theme='dark', and restyle the frame (radius, size, border) with className.", title: 'Silk Shear Field', description: 'Shearing silk ribbons that bend toward the pointer.', category: 'Animated Backgrounds', unique: true, isNew: true, gesture: 'Move — silk ribbons shear toward you.' },
  { slug: 'void-lattice-drift', props: [{ name: 'theme', type: "'auto' | 'light' | 'dark'", default: "'auto'", description: 'auto follows the nearest .dark / .light ancestor; light / dark force a palette.' }],  ownBackground: true, backgroundNote: "Paints its own canvas backdrop and adapts on its own: theme='auto' (default) follows the nearest .dark / .light ancestor. Force a look with theme='light' or theme='dark', and restyle the frame (radius, size, border) with className.", title: 'Void Lattice Drift', description: 'Faint perspective lattice drifting in a void.', category: 'Animated Backgrounds', unique: true, isNew: true, gesture: 'Move — the lattice drifts with your gaze.' },
  { slug: 'ember-drift', props: [{ name: 'theme', type: "'auto' | 'light' | 'dark'", default: "'auto'", description: 'auto follows the nearest .dark / .light ancestor; light / dark force a palette.' }],  ownBackground: true, backgroundNote: "Paints its own canvas backdrop and adapts on its own: theme='auto' (default) follows the nearest .dark / .light ancestor. Force a look with theme='light' or theme='dark', and restyle the frame (radius, size, border) with className.", title: 'Ember Drift', description: 'Warm particles rising with soft bloom.', category: 'Animated Backgrounds', unique: true, isNew: true, gesture: 'Watch embers rise and bloom.' },
  { slug: 'chromatic-mist', props: [{ name: 'theme', type: "'auto' | 'light' | 'dark'", default: "'auto'", description: 'auto follows the nearest .dark / .light ancestor; light / dark force a palette.' }],  ownBackground: true, backgroundNote: "Paints its own canvas backdrop and adapts on its own: theme='auto' (default) follows the nearest .dark / .light ancestor. Force a look with theme='light' or theme='dark', and restyle the frame (radius, size, border) with className.", title: 'Chromatic Mist', description: 'Dual-tone mist with chromatic split on motion.', category: 'Animated Backgrounds', unique: true, isNew: true, gesture: 'Move quickly — mist splits chromatically.' },
  { slug: 'pulse-rings', props: [{ name: 'theme', type: "'auto' | 'light' | 'dark'", default: "'auto'", description: 'auto follows the nearest .dark / .light ancestor; light / dark force a palette.' }],  ownBackground: true, backgroundNote: "Paints its own canvas backdrop and adapts on its own: theme='auto' (default) follows the nearest .dark / .light ancestor. Force a look with theme='light' or theme='dark', and restyle the frame (radius, size, border) with className.", title: 'Pulse Rings', description: 'Concentric soft rings expand from pointer/click.', category: 'Animated Backgrounds', unique: true, isNew: true, gesture: 'Click or drag — rings pulse outward.' },


  // Buttons
  { slug: 'wax-seal-button', title: 'Wax Seal Button', description: 'A paper-and-ink send button: press it and a drop of wax falls into the slot and spreads into an uneven puddle, a brass stamp thumps down and lifts away leaving an embossed monogram, and the label settles on "Sealed & sent".', category: 'Buttons', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Click (or Enter) to seal; click again to reset.', props: [
    { name: 'label / busyLabel / sealedLabel / errorLabel', type: 'string', description: 'Copy for each state.' },
    { name: 'monogram', type: 'string', default: "'M'", description: 'One or two letters pressed into the wax.' },
    { name: 'accent', type: 'string', default: "'#a3122a'", description: 'Wax colour.' },
    { name: 'onSeal', type: '() => void | Promise<unknown>', description: 'Runs while the wax pours; a returned promise holds the pour, a rejection shows the error state.' },
    { name: 'resetAfter', type: 'number', default: '2800', description: 'ms the sealed state is held; 0 keeps it sealed.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button.' },
  ] },
  { slug: 'googly-gaze-button', title: 'Googly Gaze Button', description: 'Eyes track the cursor and smirk on click.', category: 'Buttons', unique: true, isNew: true, gesture: 'Move nearby — eyes follow; click to smirk.' },
  { slug: 'slide-confirm-button', title: 'Slide Confirm Button', description: 'Drag the knob (or press Enter) to confirm.', category: 'Buttons', unique: true, isNew: true, gesture: 'Drag the knob fully across, or press Enter.' },
  { slug: 'shimmer-chrome-button', title: 'Shimmer Chrome Button', description: 'Quiet chrome pill with a traveling shimmer.', category: 'Buttons', unique: true, isNew: true, gesture: 'Watch the highlight sweep; click to press.' },
  { slug: 'orbit-commit', title: 'Orbit Commit', description: 'Hold to confirm while an icon orbits the rim.', category: 'Buttons', unique: true, isNew: true, gesture: 'Press and hold (or Space) until the orbit completes.', dependencies: ['motion'] },
  { slug: 'inkline-action', title: 'Inkline Action', description: 'Text action with a seeded ink underline.', category: 'Buttons', unique: true, isNew: true, gesture: 'Hover from left or right — ink draws that way.' },
  { slug: 'focus-bloom-button', title: 'Focus Bloom Button', description: 'Focus/hover bloom steered by pointer.', category: 'Buttons', unique: true, isNew: true, gesture: 'Hover or focus — bloom tracks the pointer.' },
  { slug: 'magnetic-button', title: 'Magnetic Button', description: 'Button that magnetically follows the cursor; the label leans a little further for parallax, with a spring press state. Solid, accent and glass surfaces.', category: 'Buttons', unique: true, gesture: 'Move near the button — it pulls toward you. Press to feel the spring.', dependencies: ['motion'], props: [
    { name: 'strength', type: 'number', default: '0.35', description: 'How far the button follows the pointer (fraction of the offset).' },
    { name: 'variant', type: '\'solid\' | \'accent\' | \'glass\'', default: '\'solid\'', description: 'Surface style.' },
    { name: '...props', type: 'ButtonHTMLAttributes', default: '—', description: 'Forwarded to the button.' },
  ] },
  { slug: 'spark-button', title: 'Spark Button', description: 'Click bursts into particle sparks.', category: 'Buttons', unique: true, dependencies: ['motion'], gesture: 'Click — sparks erupt from the hit point.' },

  { slug: 'liquid-fill-button', title: 'Liquid Fill Button', description: 'Liquid rises to fill on hover or press.', category: 'Buttons', unique: true, isNew: true, gesture: 'Hover — liquid rises to fill.' },
  { slug: 'split-reveal-button', title: 'Split Reveal Button', description: 'Face splits open to reveal the label.', category: 'Buttons', unique: true, isNew: true, gesture: 'Hover — panels split to reveal.' },
  { slug: 'gravity-drop-button', title: 'Gravity Drop Button', description: 'Icon falls in with a bounce on hover.', category: 'Buttons', unique: true, isNew: true, gesture: 'Hover — icon drops with bounce.' },
  { slug: 'neon-stroke-button', title: 'Neon Stroke Button', description: 'SVG stroke draws around on hover.', category: 'Buttons', unique: true, isNew: true, gesture: 'Hover — neon stroke draws the rim.' },
  { slug: 'loop-flight-send-button', title: 'Loop Flight Send Button', description: 'The pill folds into a circle, the paper plane launches right and writes a looping cursive trail around the button — holding in orbit while the request is pending — then glides back in from the left, folds into a check and the pill springs open to “Sent!”.', category: 'Buttons', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Click — the plane loops out and back; toggle slow network to watch it hold in orbit.', props: [
    { name: 'label / sentLabel / errorLabel', type: 'string', default: "'Send' / 'Sent!' / 'Retry'", description: 'Label per stage.' },
    { name: 'sendingLabel', type: 'string', default: "'Sending'", description: 'Announced (and shown with reduced motion) while in flight.' },
    { name: 'onSend', type: '() => void | Promise<unknown>', description: 'Async work; the plane keeps looping until it settles. Rejecting lands a rose retry state.' },
    { name: 'resetAfter', type: 'number', default: '2400', description: 'Auto-reset delay in ms (0 keeps the sent state).' },
    { name: 'trail', type: 'boolean', default: 'true', description: 'Draw the tapered ink trail.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button.' },
  ] },
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
    { name: 'variant', type: "'auto' | 'dark' | 'light'", default: "'auto'", description: 'Surface theme. auto follows the nearest .dark / .light ancestor.' },
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
  { slug: 'pull-cord-lamp-toggle', title: 'Pull-Cord Lamp Toggle', description: 'A pendant lamp switched by its pull cord: drag the bead down until it clicks, the cord snaps back elastically and sways, the shade rocks on its wire and the bulb warms into a cone of light with drifting dust.', category: 'Toggles', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Drag the cord bead down and let go — or focus it and press Space.', props: [
    ...(toggleProps ?? []),
    { name: 'label', type: 'string', default: "'Reading lamp'", description: 'Accessible name and caption.' },
    { name: 'height', type: 'number', default: '300', description: 'Scene height in px.' },
  ] },
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
  { slug: 'ink-bleed-text', title: 'Ink Bleed Text', description: 'A serif headline that soaks into the page: each word lands as a wet blot of ink that spreads through the paper fibres (an SVG turbulence displacement relaxing to zero), then dries crisp from a soft blur, word by word.', category: 'Text Animations', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Scroll it into view; press Replay to bleed the ink again.', props: [
    { name: 'text', type: 'string', default: "'Good ideas spread slowly, then all at once.'", description: 'The sentence (kept intact for screen readers).' },
    { name: 'highlight', type: 'string', default: "'spread slowly'", description: 'Word(s) inside text printed in italic accent ink.' },
    { name: 'as', type: "'h1' | 'h2' | 'h3' | 'p'", default: "'h2'", description: 'Element to render.' },
    { name: 'trigger', type: "'inView' | 'mount'", default: "'inView'", description: 'Start when scrolled into view or immediately.' },
    { name: 'stagger / duration', type: 'number', default: '90 / 1400', description: 'ms between words (30–200) and per-word drying time (600–3000).' },
    { name: 'accent', type: 'string', default: "'#9f1239'", description: 'Ink colour for the highlight and blots.' },
    { name: 'showReplay / onComplete', type: 'boolean / () => void', default: 'true', description: 'Replay button; callback when the ink has dried.' },
  ] },
  { slug: 'tumble-letters', title: 'Tumble Letters', description: 'A headline of physical letters: drop them and they fall, spin, bounce and pile against each other on the floor; hover lifts letters in a wave, any letter can be grabbed and flung, and Reassemble springs them home.', category: 'Text Animations', unique: true, isNew: true, dependencies: ['lucide-react'], gesture: 'Drop the letters, then drag and fling any of them.', props: [
    { name: 'text / highlight', type: 'string', description: 'Headline and the words in accent ink.' },
    { name: 'autoDrop', type: 'number', default: '0', description: 'ms after mount to drop automatically (0 = never).' },
    { name: 'gravity', type: 'number', default: '2400', description: 'px/s².' },
    { name: 'bounce', type: 'number', default: '0.38', description: 'Floor restitution.' },
    { name: 'onDrop / onAssemble', type: '() => void', description: 'Lifecycle callbacks.' },
  ] },
  { slug: 'glyph-weather', title: 'Glyph Weather', description: 'Glyphs drift with scroll direction.', category: 'Text Animations', unique: true, isNew: true, gesture: 'Scroll the page — characters lean with the wind.' },
  { slug: 'wordloom', title: 'Wordloom', description: 'Words weave out as threads and resolve the next.', category: 'Text Animations', unique: true, isNew: true, gesture: 'Click (or Enter) to weave the next word.', dependencies: ['motion'] },
  { slug: 'momentum-caption', title: 'Momentum Caption', description: 'Caption briefly follows pointer velocity.', category: 'Text Animations', unique: true, isNew: true, gesture: 'Sweep the pointer quickly — caption trails, then settles.' },
  { slug: 'scramble-text', title: 'Scramble Text', description: 'Characters decode from noise into place.', category: 'Text Animations', unique: true, gesture: 'Hover to re-scramble and decode.' },
  { slug: 'morphing-text', title: 'Morphing Text', description: 'Overlapping blur-morph between phrases, aligned for inline sentences; pauses on hover.', category: 'Text Animations', unique: true, dependencies: ['motion'], gesture: 'Hover the word to hold it.', props: [
    { name: 'phrases', type: 'string[]', default: '—', description: 'Phrases to cycle through.' },
    { name: 'interval', type: 'number', default: '2200', description: 'ms per phrase.' },
    { name: 'align', type: '\'start\' | \'center\'', default: '\'start\'', description: 'Alignment inside the reserved width.' },
    { name: 'animateWidth', type: 'boolean', default: 'false', description: 'Spring the width to each phrase instead of reserving the longest.' },
    { name: 'pauseOnHover', type: 'boolean', default: 'true', description: 'Hold the current phrase while hovered.' },
  ] },
  { slug: 'typewriter', title: 'Typewriter', description: 'Types and deletes through phrases.', category: 'Text Animations', unique: true },
  { slug: 'number-ticker', title: 'Number Ticker', description: 'Counts to a value when scrolled into view with locale-aware grouping and tabular figures; re-animates from the current value when it changes.', category: 'Text Animations', unique: true, props: [
    { name: 'value', type: 'number', default: '—', description: 'Target value.' },
    { name: 'duration', type: 'number', default: '1400', description: 'Count length in ms (expo-out).' },
    { name: 'decimals', type: 'number', default: '0', description: 'Fraction digits.' },
    { name: 'prefix / suffix', type: 'string', default: '\'\'', description: 'Text around the number.' },
    { name: 'startValue', type: 'number', default: '0', description: 'Where the first count starts.' },
    { name: 'locale', type: 'string', default: 'browser', description: 'BCP 47 locale for grouping.' },
    { name: 'separator', type: 'boolean', default: 'true', description: 'Group thousands (12,840).' },
    { name: 'delay', type: 'number', default: '0', description: 'Delay before the first count (ms).' },
  ] },
  { slug: 'infinite-marquee', title: 'Infinite Marquee', description: 'Seamless looping strip with masked edge fades; pauses on hover, focus or with an optional pause button. Wraps statically under reduced motion.', category: 'Text Animations', unique: true, dependencies: ['lucide-react'], gesture: 'Hover to pause, or use the Pause button.', props: [
    { name: 'children', type: 'ReactNode', default: '—', description: 'Items (rendered twice for the loop; the copy is inert).' },
    { name: 'speed', type: 'number', default: '28', description: 'Seconds per loop.' },
    { name: 'reverse', type: 'boolean', default: 'false', description: 'Scroll the other way.' },
    { name: 'fade', type: 'boolean', default: 'true', description: 'Mask both edges.' },
    { name: 'pauseOnHover', type: 'boolean', default: 'true', description: 'Pause on hover / focus-within.' },
    { name: 'gap', type: 'number', default: '32', description: 'Space between items (px).' },
    { name: 'showControls', type: 'boolean', default: 'false', description: 'Visible pause / play button.' },
    { name: 'label', type: 'string', default: '\'Scrolling list\'', description: 'Accessible region name.' },
  ] },


  // Shimmer
  { slug: 'prism-sweep-shimmer', title: 'Prism Sweep Shimmer', description: 'Diagonal prismatic light band; intensity follows pointer X.', category: 'Shimmer', unique: true, isNew: true, gesture: 'Move horizontally — the prism band tracks X.' },
  { slug: 'mercury-vein-shimmer', title: 'Mercury Vein Shimmer', description: 'Liquid-metal highlight veins crawl a rounded surface.', category: 'Shimmer', unique: true, isNew: true, gesture: 'Watch mercury veins crawl the surface.' },
  { slug: 'glyph-aurora-shimmer', title: 'Glyph Aurora Shimmer', description: 'Aurora shimmer travels letter-by-letter on text.', category: 'Shimmer', unique: true, isNew: true, gesture: 'Watch the aurora sweep glyph by glyph.' },
  { slug: 'edge-flare-shimmer', title: 'Edge Flare Shimmer', description: 'Soft flare travels the border edge (not a full beam).', category: 'Shimmer', unique: true, isNew: true, gesture: 'Watch the localized flare travel the rim.' },
  { slug: 'skeleton-wave-shimmer', title: 'Skeleton Wave Shimmer', description: 'Premium content-block skeleton with a diagonal liquid wave — avatar, lines, media.', category: 'Shimmer', unique: true, isNew: true, gesture: 'Watch the liquid wave sweep bones and media.' },
  { slug: 'card-sheen-loader', title: 'Card Sheen Loader', description: 'Product-card placeholder with traveling chrome sheen and soft breathing.', category: 'Shimmer', unique: true, isNew: true, gesture: 'Watch the chrome sheen travel; card breathes gently.' },
  { slug: 'list-bloom-shimmer', title: 'List Bloom Shimmer', description: 'Stacked list rows bloom in with staggered shimmer and soft shadows.', category: 'Shimmer', unique: true, isNew: true, gesture: 'Watch rows bloom in stagger, then shimmer.' },

  // Loading
  { slug: 'hourglass-loader', title: 'Hourglass Loader', description: 'A brass-and-glass hourglass: sand drains from the upper bulb through a trickling stream into a growing mound, and in endless mode the glass turns itself over on a spring when the top runs dry. Pass progress for a determinate progressbar.', category: 'Loading', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Watch it pour and flip; the right one tracks a real progress value.', props: [
    { name: 'progress', type: 'number', description: '0–100 for a determinate progressbar; omit for the endless pour.' },
    { name: 'label', type: 'string', description: 'Status line under the glass (announced politely).' },
    { name: 'duration', type: 'number', default: '6', description: 'Seconds per pour in endless mode (2–20).' },
    { name: 'accent', type: 'string', default: "'#d4a24c'", description: 'Sand colour.' },
    { name: 'size', type: 'number', default: '168', description: 'Height in px.' },
  ] },
  { slug: 'orbital-bead-loader', title: 'Orbital Bead Loader', description: 'Beads orbit a core; hover speeds up.', category: 'Loading', unique: true, isNew: true, gesture: 'Hover — orbit accelerates.' },
  { slug: 'ink-drip-loader', title: 'Ink Drip Loader', description: 'Ink drops merge into a looping puddle.', category: 'Loading', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Watch drops merge into the puddle.' },
  { slug: 'morph-glyph-loader', title: 'Morph Glyph Loader', description: 'Glyph morphs through abstract SVG shapes.', category: 'Loading', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Watch the glyph morph between shapes.' },
  { slug: 'liquid-charge-capsule', title: 'Liquid Charge Capsule', description: 'A glass capsule with a two-layer sloshing liquid that rises to the charge level. Colour warms from ember red to calm emerald as it fills, bubbles rise and pop while charging, a brushed-metal bolt floats in the glass and a soft pulse celebrates a full charge.', category: 'Loading', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Watch Auto charge and drain — or drag the capsule / use arrow keys to set the level.', props: [
    { name: 'level', type: 'number', default: '64', description: 'Charge 0–100; the liquid springs to it and sloshes.' },
    { name: 'charging', type: 'boolean', default: 'false', description: 'Bubbles, stirring surface and the floating bolt.' },
    { name: 'height', type: 'number', default: '232', description: 'Capsule height in px (width follows).' },
    { name: 'lowThreshold', type: 'number', default: '20', description: 'At or below: red liquid and a low-battery status.' },
    { name: 'showReadout', type: 'boolean', default: 'true', description: 'Counting percentage and status line.' },
    { name: 'onLevelChange', type: '(level: number) => void', description: 'Turns it into a vertical slider (drag, arrows, Home/End).' },
    { name: 'onFull', type: '() => void', description: 'Fires when it reaches 100 while charging (with a celebration pulse).' },
    { name: 'label', type: 'string', default: "'Battery'", description: 'Accessible name; exposed as a meter (or slider).' },
  ] },
  { slug: 'ghost-gobbler-skull', title: 'Ghost Gobbler Skull', description: 'A glossy vinyl-toy skull that tracks little black-smoke ghosts drifting in from every direction, drops its jaw, slurps each one in like spaghetti and CHOMPS — then levels up: glowing eyes, blush, cracks of light, star catchlights, orbiting embers, flames and finally a crown with a smoke-ring burp. Works as a determinate or endless loader, an async task wrapper with a sad dizzy failure, or an idle mascot.', category: 'Loading', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Watch it eat 8 ghosts to the finale. Move your pointer — the eyes follow; hover for a cheeky grin; click or press Enter to chomp.', props: [
    { name: 'mode', type: "'determinate' | 'indeterminate' | 'idle'", default: "'determinate'", description: 'Eat `total` ghosts then finale, loop forever (levels cycle), or mascot-only idle life.' },
    { name: 'progress', type: 'number', description: '0–1. Allows round(progress × total) ghosts to be eaten; omit in determinate mode to autoplay to the finale. A lurking ghost circles while it waits.' },
    { name: 'total', type: 'number', default: '8', description: 'Ghosts in a full run (the 8 transformation levels are spread across them).' },
    { name: 'size / spread', type: 'number', default: '200 / 1.9', description: 'Skull width in px and the stage size relative to it (room for ghosts to fly in).' },
    { name: 'ghostColor', type: 'string', default: "'#16121c'", description: 'Smoke colour (#rrggbb). On dark pages the smoke gets a faint moonlit halo.' },
    { name: 'glowPalette', type: 'string[]', default: 'DEFAULT_GHOST_GLOW', description: 'Eight eye-glow colours, one per level.' },
    { name: 'speed', type: 'number', default: '1', description: 'Flight / suction speed multiplier.' },
    { name: 'interactive', type: 'boolean', default: 'true', description: 'Focusable; eyes follow the pointer, hover = cheeky grin, click / Enter / Space = chomp.' },
    { name: 'task', type: '() => Promise<unknown>', description: 'Eats endlessly while pending; resolve → finale, reject → sad dizzy skull, ghosts escape, Retry re-runs the task.' },
    { name: 'onComplete / onError', type: '() => void / (error) => void', description: 'Finale reached / task rejected.' },
    { name: 'label / showLabel', type: 'string / boolean', default: "'Loading' / true", description: 'Accessible name + aria-live status (“Loading, 3 of 8”) and the visible caption row with progress dots.' },
    { name: 'replayable / resetKey', type: 'boolean / Key', default: 'true', description: 'Replay button after the finale; change resetKey to restart from zero.' },
  ] },
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
  { slug: 'snake-loader', title: 'Snake Loader', description: 'A progress loader whose visual is a tiny snake board. The snake plays itself while you wait, progress fills a row of tiles beneath it, and the status line carries the label, current step and percentage. Done offers continue; an error crashes the snake and offers a retry. Click the board and the snake is yours.', category: 'Loading', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Watch it load — or click the board (or press an arrow key) to steer the snake while you wait.', props: [
    { name: 'progress', type: 'number', description: '0–100, drawn as a row of tiles plus a counting percentage. Omit for an indeterminate wave. 100 counts as done.' },
    { name: 'state', type: "'loading' | 'done' | 'error'", default: "'loading'", description: 'Done shows a check; error crashes the snake, tints the tiles rose and is announced as an alert.' },
    { name: 'label / description', type: 'string', default: "'Loading'", description: 'Status line and an optional secondary line (current step, counts, ETA).' },
    { name: 'readyLabel / errorLabel', type: 'string', default: "'Ready' / 'Something went wrong'", description: 'Status line for the done and error states.' },
    { name: 'onContinue / continueLabel', type: '() => void / string', default: "'Continue'", description: 'Adds a continue button when done.' },
    { name: 'onRetry / retryLabel', type: '() => void / string', default: "'Try again'", description: 'Adds a retry button on error.' },
    { name: 'showPercent / showProgress', type: 'boolean', default: 'true', description: 'Hide the percentage or the tile progress row.' },
    { name: 'variant', type: "'card' | 'plain'", default: "'card'", description: 'plain drops the card surface so the loader sits inside your own layout.' },
    { name: 'color', type: 'string', description: 'Accent (#rrggbb) for the snake, trail and progress. Defaults to emerald.' },
    { name: 'interactive', type: 'boolean', default: 'true', description: 'Let people take over the snake. false makes it a pure animation.' },
    { name: 'autoPlay', type: 'boolean', default: 'true', description: 'The snake plays itself (always off under reduced motion).' },
    { name: 'cols / rows', type: 'number', default: '18 / 10', description: 'Board size in tiles (cols 10–30, rows 6–20).' },
    { name: 'speed / wrap', type: 'number / boolean', default: '120 / false', description: 'ms per step while someone plays; wrap makes walls pass-through.' },
    { name: 'skin', type: "'tiles' | 'lcd'", default: "'tiles'", description: 'Glossy snake on soft tiles, or a pixel nod to the classic phone screen.' },
    { name: 'theme', type: "'auto' | 'light' | 'dark'", default: "'auto'", description: 'auto follows the nearest .dark / .light ancestor.' },
    { name: 'onGameOver', type: '(score, best) => void', description: 'Fires when a played round ends.' },
    { name: 'className / boardClassName', type: 'string', description: 'Style the wrapper and the board.' },
  ] },

  // 404 Animation
  { slug: 'constellation-lost-404', ownBackground: true, backgroundNote: 'An intentional deep-space scene that stays dark on any page, which reads as a framed illustration on light sites. Override the frame (bg-*, border, shadow, radius) via className.', title: 'Constellation Lost 404', description: 'Tiny 3D astronaut among reconnecting star “404” with pointer parallax.', category: '404 Animation', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Move to parallax layers; watch stars reconnect.' },
  { slug: 'paper-tear-404', ownBackground: true, backgroundNote: 'Ships a daylight paper scene and a night-desk variant through dark: classes, so it follows the host theme. Override the surface via className.', title: 'Paper Tear 404', description: '3D folded paper character peeking through a torn hole; perspective scraps.', category: '404 Animation', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Watch the paper buddy peek and scraps float.' },
  { slug: 'glitch-portal-404', ownBackground: true, backgroundNote: 'An intentional deep-space scene that stays dark on any page, which reads as a framed illustration on light sites. Override the frame (bg-*, border, shadow, radius) via className.', title: 'Glitch Portal 404', description: 'Faceted buddy stuck in a chromatic portal — RGB split, scanlines, rim glow.', category: '404 Animation', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Watch the glitch buddy struggle in the portal.' },
  { slug: 'paper-orbit-404', ownBackground: true, backgroundNote: 'An intentional deep-space scene that stays dark on any page, which reads as a framed illustration on light sites. Override the frame (bg-*, border, shadow, radius) via className.', title: 'Paper Orbit 404', description: 'Layered paper-cut space scene with orbital rings, cratered moons, astronaut, and terracotta home CTA.', category: '404 Animation', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Move for parallax — astronaut bobs, rockets drift, rings rotate.' },
  { slug: 'mars-tether-404', ownBackground: true, backgroundNote: 'An intentional deep-space scene that stays dark on any page, which reads as a framed illustration on light sites. Override the frame (bg-*, border, shadow, radius) via className.', title: 'Mars Tether 404', description: 'Mars-textured sphere as the 0, orange astronaut perched on top, tethered rocket with waving path.', category: '404 Animation', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Watch planet rotate, tether wave, rocket thrust flicker.' },
  { slug: 'mesh-orb-404', ownBackground: true, backgroundNote: 'An intentional deep-space scene that stays dark on any page, which reads as a framed illustration on light sites. Override the frame (bg-*, border, shadow, radius) via className.', title: 'Mesh Orb 404', description: 'Glowing mesh-grid sphere with bloom, pulse synced to fake audio, equatorial waveform ring.', category: '404 Animation', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Move to tilt the sphere; watch mesh rotate and bloom breathe.' },
  { slug: 'lens-reveal-404', ownBackground: true, backgroundNote: 'A warm paper-and-ink scene that looks the same on light and dark pages. Override the frame via className.', title: 'Lens Reveal 404', description: 'A caretaker sweeps beneath a giant amber 404 while a brass loupe follows the pointer and magnifies a hidden message layer.', category: '404 Animation', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Move the loupe (or arrow keys) — find the secret under the lens.', props: [
    { name: 'title / subtitle', type: 'string', description: 'Visible copy outside the lens.' },
    { name: 'secretTitle / secretSubtitle', type: 'string', description: 'Copy that only appears under the lens.' },
    { name: 'radius', type: 'number', default: '76', description: 'Lens radius in px.' },
    { name: 'zoom', type: 'number', default: '1.5', description: 'Magnification inside the lens.' },
    { name: 'homeHref / onHome', type: 'string / () => void', default: "'/'", description: 'Home button target or handler.' },
  ] },


  // Toast (signature — distinct from Core toast)
  { slug: 'receipt-print-toast', title: 'Receipt Print Toast', description: 'Order confirmations that print: a thermal printer slot blinks, then a strip of receipt paper feeds out line by line in little stepped jolts with a torn zig-zag edge. After a few seconds it tears off and drops away; hover or focus holds it.', category: 'Toast', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Press "Place order" to print a receipt; hover to hold it.', props: [
    { name: 'receipt', type: 'Receipt | null', description: '{ title, subtitle?, lines: { label, qty?, amount }[], total?, footer? } — prints whenever the object changes.' },
    { name: 'samples', type: 'Receipt[]', default: 'DEFAULT_RECEIPTS', description: 'Orders cycled by the built-in trigger.' },
    { name: 'triggerLabel / showTrigger', type: 'string / boolean', default: "'Place order' / true", description: 'Built-in trigger button.' },
    { name: 'duration', type: 'number', default: '6000', description: 'ms before it tears off (0 = until dismissed); paused on hover / focus.' },
    { name: 'onDismiss', type: '(receipt) => void', description: 'Fires when a receipt tears off or is dismissed.' },
  ] },
  { slug: 'gravity-stack-toast', title: 'Gravity Stack Toast', description: 'Gravity-bounce stack with provider/hook.', category: 'Toast', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Trigger toasts — they fall into a bouncing stack.' },
  { slug: 'ribbon-unfurl-toast', title: 'Ribbon Unfurl Toast', description: 'Ribbon unfurl enter animation.', category: 'Toast', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Trigger — ribbon unfurls from the side.' },
  { slug: 'sonar-ping-toast', title: 'Sonar Ping Toast', description: 'Expanding sonar rings on appear.', category: 'Toast', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Trigger — sonar rings expand on appear.' },

  // Vertical Scroll
  { slug: 'parallax-reel-scroll', props: [{ name: 'viewportClassName', type: 'string', description: 'Classes merged onto the scrolling viewport (surface, border, radius, height).' }],  ownBackground: true, backgroundNote: 'A cinematic dark reel that keeps its backdrop on any page. Restyle the scrolling surface with viewportClassName (e.g. a lighter bg-* and border), and the outer box with className.', title: 'Parallax Reel Scroll', description: 'Multi-layer stars/grid + mid art + foreground cards with scrub progress.', category: 'Vertical Scroll', unique: true, isNew: true, gesture: 'Scroll — depth layers lag; scrub bar tracks progress.' },
  { slug: 'snap-magnet-scroll', props: [{ name: 'viewportClassName', type: 'string', description: 'Classes merged onto the scrolling viewport (surface, border, radius, height).' }],  ownBackground: true, backgroundNote: 'A cinematic dark reel that keeps its backdrop on any page. Restyle the scrolling surface with viewportClassName (e.g. a lighter bg-* and border), and the outer box with className.', title: 'Snap Magnet Scroll', description: 'Cinematic full-bleed sections with magnetic overshoot settle and glowing rail.', category: 'Vertical Scroll', unique: true, isNew: true, gesture: 'Scroll, swipe, or ↑↓ — magnets overshoot then settle.' },
  { slug: 'velocity-fade-stack', props: [{ name: 'viewportClassName', type: 'string', description: 'Classes merged onto the scrolling viewport (surface, border, radius, height).' }],  ownBackground: true, backgroundNote: 'A cinematic dark reel that keeps its backdrop on any page. Restyle the scrolling surface with viewportClassName (e.g. a lighter bg-* and border), and the outer box with className.', title: 'Velocity Fade Stack', description: 'Rich cards scale/blur/opacity from distance + inertia velocity; center focus.', category: 'Vertical Scroll', unique: true, isNew: true, gesture: 'Scroll fast then coast — focus blooms as velocity drops.' },

  // Cards
  { slug: 'editorial-spread-card', title: 'Editorial Spread Card', description: 'A magazine cover on real CSS 3D: hover and it lifts off its spine, click and it swings open on a hinge while the issue slides to centre, revealing a two-page spread with a pull quote, deck and drop-cap columns.', category: 'Cards', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Hover to lift the cover; click (or Enter) to open the spread, Esc to close.', props: [
    { name: 'masthead / issue', type: 'string', default: "'Meridian' / 'No. 27 — Autumn'", description: 'Magazine name and issue line.' },
    { name: 'coverLine / coverNotes', type: 'string / string[]', description: 'Main and secondary cover lines.' },
    { name: 'headline / deck / byline / body', type: 'string / string[]', description: 'Right-page article; the first paragraph gets a drop cap.' },
    { name: 'pullQuote / quoteAttribution', type: 'string', description: 'Inside-cover pull quote.' },
    { name: 'coverSrc / coverAlt', type: 'string', description: 'Your own cover image (replaces the generated art).' },
    { name: 'accent', type: 'string', default: "'#9f1239'", description: 'Ink for kickers, rules, the drop cap and the generated cover.' },
    { name: 'open / defaultOpen / onOpenChange', type: 'boolean', default: 'false', description: 'Controlled / uncontrolled open state.' },
  ] },
  { slug: 'swipe-carousel-post', title: 'Swipe Carousel Post', description: 'An Instagram-style multi-slide post card: drag or swipe the media and the track snaps on a spring, a segmented bar fills with slide progress, the dot pager shrinks toward the edges and a double-tap drops a heart.', category: 'Cards', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Drag the media sideways (or arrow keys); double-click to like.', props: [
    { name: 'slides', type: 'SwipePostSlide[]', default: 'DEFAULT_SWIPE_POST_SLIDES', description: '{ id, title, body?, kicker?, src?, alt? } — generated typographic slides unless you pass src.' },
    { name: 'author / meta / caption / time', type: 'string', description: 'Header and caption copy.' },
    { name: 'likes / comments', type: 'number', default: '1284 / 86', description: 'Counts shown under the media.' },
    { name: 'accent', type: 'string', default: "'#d6336c'", description: 'Accent for the generated slides, avatar ring and active dot.' },
    { name: 'autoPlay / interval', type: 'boolean / number', default: 'true / 4200', description: 'Advance automatically while the progress segment fills; pauses on hover, focus, drag and offscreen, with a pause button.' },
    { name: 'index / defaultIndex / onIndexChange', type: 'number', default: '0', description: 'Controlled / uncontrolled slide index.' },
    { name: 'defaultLiked / onLikeChange', type: 'boolean / (liked) => void', default: 'false', description: 'Like state (double-click the media also likes).' },
    { name: 'defaultSaved / onSaveChange', type: 'boolean / (saved) => void', default: 'false', description: 'Bookmark state.' },
  ] },
  { slug: 'folder-fan-showcase', ownBackground: true, backgroundNote: 'Paints its own blush (light) / wine-black (dark) backdrop with grain via dark: variants; the post cards keep their own colours in both themes. Retint everything with accent and restyle the frame with className.', title: 'Folder Fan Showcase', description: 'Social post cards wait inside a frosted-glass folder, peeking over the rim of a blurred front pocket. Hover or focus and they rise and fan out on staggered springs; pick one and it lifts clear of the pocket and is pulled forward, with a soft mirrored reflection on the floor.', category: 'Cards', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Hover the folder to fan the cards; click one to pull it forward. Arrow keys cycle, Esc tucks it back.', props: [
    { name: 'items', type: 'FolderFanItem[]', default: 'DEFAULT_FOLDER_FAN_ITEMS', description: '{ id, title, body?, kicker?, src?, alt?, accent? } — five generated post layouts rotate (cover, quote, stat, checklist, save); pass src for your own artwork. Use | in body for checklist lines.' },
    { name: 'accent', type: 'string', default: "'#c8143c'", description: 'Signature colour (any CSS colour) for the folder, highlights and generated cards.' },
    { name: 'eyebrow / title / highlight / description', type: 'string', description: 'Copy beside the folder; highlight paints part of the title with the accent.' },
    { name: 'folderLabel / folderMeta / tabLabel', type: 'string', description: 'Text printed on the glass pocket and the folder tab.' },
    { name: 'index / defaultIndex / onIndexChange', type: 'number | null', default: 'null', description: 'Controlled / uncontrolled pulled-forward card (null = none).' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Start fanned out instead of fanning on hover / focus.' },
    { name: 'reflection', type: 'boolean', default: 'true', description: 'Mirrored floor reflection under the folder.' },
    { name: 'ctaLabel / onCta', type: 'string / () => void', default: "'Use this kit'", description: 'Primary button; pass an empty string to hide.' },
    { name: 'titleAs', type: "'h1' | 'h2' | 'h3'", default: "'h2'", description: 'Heading level of the title.' },
  ] },
  { slug: 'origami-unfold-card', title: 'Origami Unfold Card', description: 'A trail ticket that unfolds like a paper map: press the cover and two creased panels swing down in sequence on real CSS-3D hinges, catching light as they flatten, while the route draws itself and the last panel runs an async save.', category: 'Cards', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Press the cover (or Enter) to unfold / fold.', props: [
    { name: 'title / subtitle / tag', type: 'string', description: 'Cover copy.' },
    { name: 'src', type: 'string', description: 'Optional cover image; a generated dawn-ridge illustration otherwise.' },
    { name: 'stops', type: '{ name, time }[]', description: 'Route stops listed on the last panel.' },
    { name: 'stats', type: '{ label, value }[]', description: 'Three small stats.' },
    { name: 'actionLabel / onAction', type: 'string / () => Promise<void | boolean>', default: '\'Save to trail log\'', description: 'Async action; false / reject shows retry.' },
    { name: 'open / defaultOpen / onOpenChange', type: 'boolean', default: 'false', description: 'Controlled or uncontrolled fold state.' },
  ] },
  { slug: 'lenticular-shift-card', title: 'Lenticular Shift Card', description: 'A postcard printed on a ridged lenticular sheet: tilting interlaces the scenes in fine vertical blinds that sweep across the print while a specular band rides the ridges.', category: 'Cards', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Move across the card to tilt it; ←/→ or the chips switch frames.', props: [
    { name: 'items', type: '{ id, label, caption?, src?, hue? }[]', default: 'DEFAULT_LENTICULAR_FRAMES', description: '2–4 frames; pass src for real artwork.' },
    { name: 'title', type: 'string', default: '\'Harbour Light\'', description: 'Caption title.' },
    { name: 'autoRock', type: 'boolean', default: 'true', description: 'Gently rocks the print while idle.' },
    { name: 'index / defaultIndex / onIndexChange', type: 'number', default: '0', description: 'Controlled or uncontrolled frame.' },
  ] },
  { slug: 'curved-tile-wall', ownBackground: true, backgroundNote: 'Paints its own stage with light and dark: variants — warm paper with soft drop shadows on light pages, near-black with cyan hover glow on dark. Override the surface with className (e.g. bg-*, rounded-*).', title: 'Curved Tile Wall', description: 'A gallery bent onto a sphere section in real CSS 3D: mixed-height frames drift, swing with drag, pop toward you on hover and open in a focused lightbox.', category: 'Cards', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Drag or move to swing the wall; hover to pop a frame; click to open.', props: [
    { name: 'items', type: 'CurvedWallItem[]', default: 'DEFAULT_CURVED_WALL_ITEMS', description: '{ id, title, caption?, src?, hue? } — src swaps the generated landscape for your image.' },
    { name: 'eyebrow / title / subtitle', type: 'string', description: 'Heading copy above the wall.' },
    { name: 'drift', type: 'number', default: '10', description: 'Auto-drift amplitude in degrees (0 disables).' },
    { name: 'onItemOpen', type: '(item) => void', description: 'Fires when a frame opens in the lightbox.' },
  ] },
  { slug: 'fan-deck-carousel', ownBackground: true, backgroundNote: 'Paints its own backdrop: a blurred copy of the active card art over off-white (light) or ink (dark), via dark: variants. Override the surface with className (e.g. bg-*, rounded-*).', title: 'Fan Deck Carousel', description: 'Poster cards fanned around an upright hero card; swipe, arrow keys or buttons re-fan the hand on springs while a blurred copy of the active art crossfades behind.', category: 'Cards', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Swipe, use ←/→ or click a side card; hover pauses autoplay.', props: [
    { name: 'items', type: 'FanDeckItem[]', default: 'DEFAULT_FAN_DECK_ITEMS', description: '{ id, title, subtitle?, src?, hue? } — src swaps the generated poster for your image.' },
    { name: 'headline / description', type: 'string', description: 'Copy above the deck.' },
    { name: 'ctaLabel / onCta', type: 'string / (item) => void', default: "'Explore'", description: 'Pill CTA; receives the active item.' },
    { name: 'autoplay', type: 'boolean', default: 'true', description: 'Advances on an interval; pauses on hover, focus, offscreen and reduced motion.' },
    { name: 'interval', type: 'number', default: '4000', description: 'Milliseconds per slide.' },
    { name: 'index / defaultIndex / onIndexChange', type: 'number / number / (i) => void', default: '0', description: 'Controlled or uncontrolled active slide.' },
  ] },
  { slug: 'tide-deck', title: 'Tide Deck', description: 'Drag a deck whose depth reacts to velocity.', category: 'Cards', unique: true, isNew: true, gesture: 'Drag sideways or use arrows to advance the deck.', dependencies: ['motion'] },
  { slug: 'windowpane-story-card', title: 'Windowpane Story Card', description: 'Frosted pane slides to reveal evidence.', category: 'Cards', unique: true, isNew: true, gesture: 'Click Reveal — the frosted pane slides down.' },
  { slug: 'topographic-stack', title: 'Topographic Stack', description: 'Contour-offset layers separate on hover.', category: 'Cards', unique: true, isNew: true, gesture: 'Hover to separate layers; click to select.' },
  { slug: 'spotlight-card', title: 'Spotlight Card', description: 'Radial glow and a lit hairline edge that track your pointer (CSS variables, no re-renders); keyboard focus inside lights it too.', category: 'Cards', unique: true, gesture: 'Move across the card — the spotlight follows.', props: [
    { name: 'spotlightColor', type: 'string', default: '\'rgba(249, 115, 22, 0.16)\'', description: 'Fill glow colour.' },
    { name: 'borderGlow', type: 'boolean', default: 'true', description: 'Light the 1px edge nearest the pointer.' },
    { name: 'edgeColor', type: 'string', default: '\'rgba(249, 115, 22, 0.7)\'', description: 'Edge glow colour.' },
    { name: 'size', type: 'number', default: '360', description: 'Spotlight radius (px).' },
  ] },
  { slug: 'tilt-card', title: 'Tilt Card', description: 'Spring-damped 3D tilt with real perspective, a soft specular glare and a gentle lift. Mouse only; static under reduced motion.', category: 'Cards', unique: true, dependencies: ['motion'], gesture: 'Move over the card to tilt in 3D.', props: [
    { name: 'maxTilt', type: 'number', default: '10', description: 'Maximum rotation (deg).' },
    { name: 'glare', type: 'boolean', default: 'true', description: 'Specular sheen that follows the pointer.' },
    { name: 'scale', type: 'number', default: '1.02', description: 'Scale while hovered.' },
  ] },
  { slug: 'glass-card', title: 'Glass Card', description: 'Liquid-glass surface with specular rim, inner hairline and layered depth; regular (frosted) or clear variants, and a solid fallback for prefers-reduced-transparency.', category: 'Cards', unique: true, props: [
    { name: 'variant', type: '\'regular\' | \'clear\'', default: '\'regular\'', description: 'Frosted and legible, or more transparent over bold backgrounds.' },
    { name: 'tint', type: 'string', default: '—', description: 'CSS colour mixed into the glass.' },
  ] },
  { slug: 'swipe-cards', title: 'Swipe Cards', description: 'Stacked deck: drag, flick, tap or arrow-key cards away with keep/pass stamps; the deck springs forward and every swipe is announced. Fades instead of flying under reduced motion.', category: 'Cards', unique: true, dependencies: ['motion', 'lucide-react'], gesture: 'Drag or flick the top card, or focus the deck and press ← / →.', props: [
    { name: 'cards', type: '{ id, title, subtitle?, color }[]', default: '—', description: 'color accepts any CSS background (colours or gradients).' },
    { name: 'onSwipe', type: '(card, \'left\' | \'right\') => void', default: '—', description: 'Fires after a card leaves.' },
    { name: 'showControls', type: 'boolean', default: 'true', description: 'Pass / reset / keep buttons.' },
    { name: 'labels', type: '{ left, right }', default: '{ left: \'Pass\', right: \'Keep\' }', description: 'Words for stamps, buttons and announcements.' },
  ] },
  { slug: 'border-beam', title: 'Border Beam', description: 'A comet of light travels a crisp masked hairline border, with an optional soft bloom. Static under reduced motion.', category: 'Cards', unique: true, props: [
    { name: 'duration', type: 'number', default: '6', description: 'Seconds per lap.' },
    { name: 'colorFrom / colorTo', type: 'string', default: '\'#f97316\' / \'#fdba74\'', description: 'Tail and head colours.' },
    { name: 'size', type: 'number', default: '70', description: 'Beam length in degrees (20–180).' },
    { name: 'borderWidth', type: 'number', default: '1', description: 'Border thickness (px).' },
    { name: 'glow', type: 'boolean', default: 'true', description: 'Soft bloom under the beam.' },
  ] },
  { slug: 'pixel-reveal', title: 'Pixel Reveal', description: 'Image or generated art dissolves in through a shrinking pixel grid when scrolled into view — random, diagonal or centre-out — with an optional replay.', category: 'Cards', unique: true, dependencies: ['lucide-react'], gesture: 'Press the replay button to run it again.', props: [
    { name: 'src / alt', type: 'string', default: '—', description: 'Image; omit for generated art.' },
    { name: 'cols / rows', type: 'number', default: '12 / 8', description: 'Grid size.' },
    { name: 'pattern', type: '\'random\' | \'diagonal\' | \'center\'', default: '\'random\'', description: 'Dissolve order.' },
    { name: 'duration', type: 'number', default: '900', description: 'Cascade length (ms).' },
    { name: 'showReplay', type: 'boolean', default: 'false', description: 'Replay button.' },
    { name: 'children', type: 'ReactNode', default: '—', description: 'Overlay content (e.g. a caption).' },
  ] },

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
  { slug: 'plucked-string-tabs', title: 'Plucked String Tabs', description: 'Tabs hang from a taut string. Choosing one plucks the string there and the vibration travels as a real damped wave; every tab bobs with the string above it and a glowing bead slides to the active tab. Sweep across the string to strum it.', category: 'Navigation', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Click or ←/→ between tabs; sweep the pointer across the string to strum.', props: [
    { name: 'items', type: '{ id, label, content? }[]', default: 'DEFAULT_STRING_TABS', description: 'Tabs and their panels.' },
    { name: 'value / defaultValue / onValueChange', type: 'string', description: 'Controlled or uncontrolled active tab.' },
    { name: 'strum', type: 'boolean', default: 'true', description: 'Pointer crossings pluck the string.' },
  ] },
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
  { slug: 'swing-price-tag', title: 'Swing Price Tag', description: 'A luxury swing tag hanging from a brass rail on a waxed cord. Brush past it and it swings like a real, lightly damped pendulum that settles and sleeps; tap it and it twirls over to the back for composition, care symbols and an SKU barcode while a foil sheen catches the light.', category: 'Widgets', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Sweep the pointer across the tag to swing it; click (or Enter) to flip. ← → nudge the swing.', props: [
    { name: 'brand / monogram / product / variant', type: 'string', description: 'Front-of-tag copy.' },
    { name: 'price / compareAt / badge', type: 'string', default: "'€248' / '€310' / 'Members −20%'", description: 'Price, struck-through original and the pill at the bottom.' },
    { name: 'details / sku', type: '[label, value][] / string', description: 'Back-of-tag rows and barcode text.' },
    { name: 'flipped / defaultFlipped / onFlippedChange', type: 'boolean', default: 'false', description: 'Controlled / uncontrolled side.' },
    { name: 'swing', type: 'boolean', default: 'true', description: 'Pendulum physics from pointer movement and taps (off under reduced motion).' },
  ] },
  { slug: 'paper-fold-accordion', title: 'Paper Fold Accordion', description: 'FAQ rows that open like a folded letter: two creased paper leaves swing open in CSS 3D (the top from its hinge, the bottom a beat later from the crease), shadows lift off the paper as it flattens and the real text settles underneath.', category: 'Widgets', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Click a question to unfold it; ↑ ↓ Home End move between questions.', props: [
    { name: 'items', type: 'PaperFoldItem[]', default: 'DEFAULT_PAPER_FOLD_ITEMS', description: '{ id, title, content, meta? } — meta shows as a small pill on wider screens.' },
    { name: 'type', type: "'single' | 'multiple'", default: "'single'", description: 'Keep one panel open, or allow several.' },
    { name: 'value / defaultValue / onValueChange', type: 'string[]', default: "[first id]", description: 'Controlled / uncontrolled open panels.' },
    { name: 'headingAs', type: "'h2' | 'h3' | 'h4'", default: "'h3'", description: 'Heading level wrapping each trigger.' },
  ] },
  { slug: 'tear-stub-boarding-pass', ownBackground: true, backgroundNote: 'Paints soft colour blobs behind the frosted glass so the blur reads: blush (light) / near-black (dark) via dark: variants. Restyle the frame with className.', title: 'Tear-Stub Boarding Pass', description: 'A frosted-glass boarding pass with a perforated stub. Drag the stub away and it resists, tears free with a ragged edge and tumbles out of frame while a "Boarded" stamp thumps onto the pass. Lays out vertically on narrow screens.', category: 'Widgets', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Drag the stub away from the perforation, or press "Tear stub".', props: [
    { name: 'pass', type: 'Partial<BoardingPassData>', default: 'DEFAULT_BOARDING_PASS', description: '{ carrier, cabin, flight, from, to, duration, passenger, date, gate, seat, boarding, group } — merged over the defaults.' },
    { name: 'accent', type: 'string', default: "'#be123c'", description: 'Route plane, logo and the Boarded stamp.' },
    { name: 'torn / defaultTorn / onTornChange', type: 'boolean', default: 'false', description: 'Controlled / uncontrolled torn state.' },
  ] },
  { slug: 'seat-scale-pricing', title: 'Seat Scale Pricing', description: 'One pricing card that morphs through every plan as you drag the team size: avatars pop in seat by seat, the price rolls on odometer reels, the tier badge and accent cross-fade, unlocked features slide in with a glow, and yearly billing bursts a savings chip.', category: 'Widgets', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Drag the team-size slider or pick a plan name; toggle billing.', props: [
    { name: 'tiers', type: '{ id, name, minSeats, perSeat, hue, features }[]', default: 'DEFAULT_PRICING_TIERS', description: 'Plans ordered by minimum seats.' },
    { name: 'seats / defaultSeats / onSeatsChange', type: 'number', default: '8', description: 'Controlled or uncontrolled team size.' },
    { name: 'billing / defaultBilling / onBillingChange', type: '\'monthly\' | \'yearly\'', default: '\'yearly\'', description: 'Billing period.' },
    { name: 'maxSeats', type: 'number', default: '150', description: 'Slider maximum.' },
    { name: 'yearlyDiscount', type: 'number', default: '0.2', description: 'Discount applied to yearly billing.' },
    { name: 'currency', type: 'string', default: '\'$\'', description: 'Currency symbol.' },
    { name: 'onCheckout', type: '(sel) => Promise<void | boolean>', description: 'Async CTA; false / reject shows retry.' },
  ] },
  { slug: 'polar-bloom-chart', title: 'Polar Bloom Chart', description: 'A Nightingale rose that blooms: petals unfurl from the bud one after another, re-grow on springs when you switch datasets, and the hovered or arrow-key focused petal lifts out with a coloured glow while the centre counts up.', category: 'Widgets', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Hover petals or focus the chart and use arrow keys; switch datasets below.', props: [
    { name: 'series', type: '{ id, label, values, unit? }[]', default: 'DEFAULT_POLAR_SERIES', description: 'Datasets (one value per label).' },
    { name: 'labels', type: 'string[]', default: 'months', description: 'Petal labels.' },
    { name: 'title', type: 'string', default: '\'Seasonality\'', description: 'Card title.' },
    { name: 'hue / size', type: 'number', default: '190 / 300', description: 'Petal gradient start hue and chart size.' },
    { name: 'load', type: '() => Promise<PolarSeries[]>', description: 'Async loader with loading bud and retry on failure.' },
    { name: 'onPetalSelect', type: '(label, value) => void', description: 'Click / Enter on a petal.' },
  ] },
  { slug: 'glow-leaderboard-list', title: 'Glow Leaderboard List', description: 'Glass pill rows that genuinely compete: scores tick up live, rows re-rank with layout springs, amounts roll and the glowing leader highlight glides to the new #1.', category: 'Widgets', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Watch rows re-rank live; toggle Live to pause; hover a row.', props: [
    { name: 'items', type: 'LeaderboardItem[]', default: 'DEFAULT_LEADERBOARD_ITEMS', description: '{ id, name, score, level?, src?, hue? } — src for real avatars.' },
    { name: 'live / defaultLive / onLiveChange', type: 'boolean / boolean / (v) => void', default: 'true', description: 'Controlled or uncontrolled live ticking.' },
    { name: 'interval', type: 'number', default: '2200', description: 'Milliseconds between score ticks.' },
    { name: 'currency', type: 'string', default: "'$'", description: 'Amount prefix.' },
    { name: 'visibleRows', type: 'number', default: '6', description: 'Rows rendered; the list fades out toward the bottom.' },
    { name: 'title / subtitle / showHeader', type: 'string / string / boolean', description: 'Header copy and the live switch.' },
  ] },
  { slug: 'podium-stack-leaderboard', title: 'Podium Stack Leaderboard', description: 'Gold, silver and bronze cards stacked like a hand of trophies; promoting someone lifts their card past its rival, re-stacks the pile and morphs the medal finishes.', category: 'Widgets', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Click a card to promote it, or Shuffle; hover pauses the auto shuffle.', props: [
    { name: 'items', type: 'PodiumItem[]', default: 'DEFAULT_PODIUM_ITEMS', description: '{ id, name, points, note?, src?, hue? } — src for real avatars.' },
    { name: 'visible', type: 'number', default: '4', description: 'Cards shown; the last one is faded.' },
    { name: 'autoShuffle', type: 'boolean', default: 'true', description: 'Promotes a random rank on an interval.' },
    { name: 'interval', type: 'number', default: '3800', description: 'Milliseconds between automatic promotions.' },
    { name: 'onRankChange', type: '(items) => void', description: 'Fires with the new order after a promotion.' },
  ] },
  { slug: 'kpi-spark-widget', title: 'KPI Spark Widget', description: 'KPI number ticker with mini sparkline that draws on mount and a trend delta pill.', category: 'Widgets', unique: true, isNew: true, gesture: 'Watch the ticker and sparkline draw on mount.', dependencies: ['motion'] },
  { slug: 'live-meter-dial', title: 'Live Meter Dial', description: 'Animated semicircle gauge for delivery rate / ASR / concurrent calls.', category: 'Widgets', unique: true, isNew: true, gesture: 'Watch the needle breathe with live values.', dependencies: ['motion'] },
  { slug: 'activity-stream-widget', title: 'Activity Stream Widget', description: 'Live-feeling activity feed with staggered row inserts.', category: 'Widgets', unique: true, isNew: true, gesture: 'Watch new events insert at the top.', dependencies: ['motion'] },
  { slug: 'status-heatmap-grid', title: 'Status Heatmap Grid', description: 'Compact hour×day heatmap for message volume with hover tooltip.', category: 'Widgets', unique: true, isNew: true, gesture: 'Hover cells for volume tooltips.' },
  { slug: 'ring-progress-cluster', title: 'Ring Progress Cluster', description: 'Cluster of animated progress rings for queue depth, SLA, and capacity.', category: 'Widgets', unique: true, isNew: true, gesture: 'Watch rings ease as metrics drift.', dependencies: ['motion'] },

  // Voice Agent
  { slug: 'glass-bubble-buddy', title: 'Glass Bubble Buddy', description: 'A living blob mascot inside a glossy glass sphere with a tiny expression system (lids, catchlights, brows, blush, mouth) and a springy body. Idle it wanders and notices your cursor, listening it leans in and nods, thinking it ponders with orbiting sparkles, speaking it talks and jiggles — and it gets drowsy when ignored.', category: 'Voice Agent', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Watch Auto, move your cursor near it, hover for a shy smile, click for a boing.', props: [
    { name: 'state', type: "'idle' | 'listening' | 'thinking' | 'speaking'", default: "'idle'", description: 'Each state has its own expression and body language.' },
    { name: 'size', type: 'number', default: '220', description: 'Sphere diameter in px.' },
    { name: 'hue', type: 'number', default: '212', description: 'Body / glass tint hue.' },
    { name: 'level', type: 'number', description: 'External 0–1 voice level (speaking mouth, listening input); simulated speech envelope when omitted.' },
    { name: 'mood', type: "'auto' | 'happy' | 'sleepy'", default: "'auto'", description: 'Baseline temperament; auto gets drowsy when ignored.' },
    { name: 'sleepAfter', type: 'number', default: '20', description: 'Idle seconds without interaction before drowsy eyes and yawns (0 disables).' },
    { name: 'interactive', type: 'boolean', default: 'true', description: 'Watch and react to the pointer.' },
    { name: 'onClick', type: '() => void', description: 'Renders the orb as a button (e.g. push-to-talk). Clicks always boing.' },
    { name: 'label', type: 'string', default: "'Assistant'", description: 'Accessible name prefix.' },
  ] },
  { slug: 'mesh-pill-orb', title: 'Mesh Pill Orb', description: 'A lava-lamp gradient mesh swirls inside a softly wobbling blob with two pill eyes. Idle it drifts and blinks, listening it widens and leans in, thinking it narrows and glances around under spinning orbit arcs, speaking its eyes squash into bars that bounce with the voice — while sonar rings and tiny motes breathe out from the rim.', category: 'Voice Agent', unique: true, isNew: true, dependencies: [], gesture: 'Watch Auto, click the orb to cycle states, move your cursor — the eyes follow.', props: [
    { name: 'state', type: "'idle' | 'listening' | 'thinking' | 'speaking'", default: "'idle'", description: 'Each state has its own eye shape, flow speed and ring/mote behaviour.' },
    { name: 'level', type: 'number', description: 'External 0–1 voice level (bar eyes, rings, swell); simulated per state when omitted.' },
    { name: 'size', type: 'number', default: '240', description: 'Orb diameter in px; the canvas adds room for rings and motes.' },
    { name: 'colors', type: '[string, string, string, string]', default: 'MESH_PILL_ORB_PALETTES.lava', description: 'Mesh colours [cool, hot, deep base, warm]. Presets: lava, lagoon, dusk.' },
    { name: 'rings / particles', type: 'boolean', default: 'true', description: 'Sonar rings and drifting motes.' },
    { name: 'interactive', type: 'boolean', default: 'true', description: 'Eyes glance toward the pointer.' },
    { name: 'theme', type: "'auto' | 'light' | 'dark'", default: "'auto'", description: 'Tints rings and motes for the page; auto follows the nearest .dark / .light ancestor.' },
    { name: 'onClick', type: '() => void', description: 'Renders the orb as a focusable button (e.g. push-to-talk).' },
    { name: 'label', type: 'string', default: "'Voice assistant'", description: 'Accessible name prefix; the state is announced politely.' },
  ] },
  { slug: 'star-morph-buddy', title: 'Star Morph Buddy', description: 'A floating indigo blob with a warm glowing core. Hover or focus and it springs into a soft five-point star — core flares, eyes tilt, cheeks blush, sparkles pop at the tips and the greeting crossfades into an intro with a gradient-inked phrase. Leave and it relaxes back on a softer spring.', category: 'Voice Agent', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Hover or Tab to it — it becomes a star; click or Enter to activate.', props: [
    { name: 'name', type: 'string', default: "'Nova'", description: 'Used in the default intro and the accessible label.' },
    { name: 'idleText', type: 'string', default: "'Hey there — stuck on something?'", description: 'Resting line.' },
    { name: 'hoverText', type: 'string', default: '`I’m ${name} — I turn messy ideas into ${highlight}.`', description: 'Intro shown on hover / focus.' },
    { name: 'highlight', type: 'string', default: "'clear next steps'", description: 'Phrase in hoverText that gets gradient ink (appended if missing).' },
    { name: 'onActivate', type: '() => void | Promise<unknown>', description: 'Click / Enter / Space. A promise shows busy → done; rejecting shows a droopy retry state.' },
    { name: 'busyText / doneText / errorText', type: 'string', description: 'Lines for the async states (announced via aria-live).' },
    { name: 'size', type: 'number', default: '176', description: 'Avatar size in px.' },
    { name: 'interactive', type: 'boolean', default: 'true', description: 'Eyes follow the pointer.' },
    { name: 'forceHover', type: 'boolean', default: 'false', description: 'Pin the star pose.' },
  ] },
  { slug: 'call-control-bar', title: 'Call Control Bar', description: 'Mute / hold / end / keypad with glowing active states and hold pulse.', category: 'Voice Agent', unique: true, isNew: true, gesture: 'Toggle mute, hold, keypad — end to hang up.', dependencies: ['motion'] },
  { slug: 'live-transcript-panel', title: 'Live Transcript Panel', description: 'Scrolling dual-speaker transcript with speaker pills and auto-scroll.', category: 'Voice Agent', unique: true, isNew: true, gesture: 'Watch lines append for caller and agent.', dependencies: ['motion'] },
  { slug: 'agent-state-orb', title: 'Agent State Orb', description: 'Listening / thinking / speaking orb with distinct motion modes.', category: 'Voice Agent', unique: true, isNew: true, gesture: 'Click the orb to cycle listening → thinking → speaking.', dependencies: ['motion'] },
  { slug: 'voice-waveform-lane', title: 'Voice Waveform Lane', description: 'Animated audio waveform bars reacting to simulated level; latency chip.', category: 'Voice Agent', unique: true, isNew: true, gesture: 'Move across the lane to drive the waveform.', dependencies: ['motion'] },
  { slug: 'softphone-dial-pad', title: 'Softphone Dial Pad', description: 'Stylish dial pad with ripple keys, number display, ringing call button.', category: 'Voice Agent', unique: true, isNew: true, gesture: 'Tap keys — ripples; Call rings until hang up.', dependencies: ['motion'] },
  { slug: 'queue-ticket-card', title: 'Queue Ticket Card', description: 'Call queue card with wait ticker, priority, skill tags, claim/transfer actions.', category: 'Voice Agent', unique: true, isNew: true, gesture: 'Watch wait tick; claim or transfer with micro-press.', dependencies: ['motion'] },
  { slug: 'prism-mesh-orb', title: 'Prism Mesh Orb', description: 'Iridescent mesh sphere — idle/listen/speak modes, pointer tilt, equatorial voice wave when speaking.', category: 'Voice Agent', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Switch Idle/Listen/Speak; move to tilt the sphere.' },
  { slug: 'liquid-metal-orb', title: 'Liquid Metal Orb', description: 'Mercury / liquid-metal ball with traveling highlight; morphs slightly when speaking.', category: 'Voice Agent', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Click the orb or mode chips to cycle idle → listen → speak.' },
  { slug: 'aurora-core-orb', title: 'Aurora Core Orb', description: 'Inner aurora ribbons through a translucent shell; outer soft glow rings expand on listen.', category: 'Voice Agent', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Switch modes — listen expands rings; speak speeds aurora.' },
  { slug: 'particle-halo-orb', title: 'Particle Halo Orb', description: 'Core ball + orbiting particle halo that densifies with energy; demo slider or auto level.', category: 'Voice Agent', unique: true, isNew: true, gesture: 'Drag energy slider or leave on Auto — halo densifies.' },
  { slug: 'ribbon-helix-wave', title: 'Ribbon Helix Wave', description: 'Premium dual ribbon helix / sine ribbons reacting to amplitude — best-in-class voice visualizer.', category: 'Voice Agent', unique: true, isNew: true, gesture: 'Move across the stage to drive amplitude.' },
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
  // Inputs / Forms
  { slug: 'signature-pad-field', title: 'Signature Pad Field', description: 'An e-signature field: draw with mouse, pen or finger and the ink thins on fast strokes and pools on slow ones; undo stroke by stroke, or switch to the Type tab for a keyboard-friendly script signature. Adopting it stamps a signed time.', category: 'Inputs / Forms', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Draw a signature on the pad (or use the Type tab), then Adopt & sign.', props: [
    { name: 'label / description', type: 'string', description: 'Field title and the document line under it.' },
    { name: 'name', type: 'string', default: "'Jordan Ellis'", description: 'Signer name; pre-fills the Type tab.' },
    { name: 'submitLabel', type: 'string', default: "'Adopt & sign'", description: 'Primary button copy.' },
    { name: 'onAdopt', type: '(result: SignatureResult) => void', description: '{ method, name, dataUrl, signedAt } — dataUrl is a PNG of the drawn signature.' },
    { name: 'onClear', type: '() => void', description: 'Fires when the pad is cleared.' },
    { name: 'ink', type: '{ light: string; dark: string }', default: "{ light: '#1e2a6e', dark: '#c7d2fe' }", description: 'Ink colour per theme.' },
    { name: 'theme', type: "'auto' | 'light' | 'dark'", default: "'auto'", description: 'Canvas ink follows the nearest .dark / .light ancestor.' },
  ] },
  { slug: 'tumbler-lock-otp', title: 'Tumbler Lock OTP', description: 'A one-time-code field built from combination-lock drums on real CSS-3D cylinders; each digit whirrs a full turn before landing, a padlock checks the code and springs open — or shakes and spins every drum back on failure.', category: 'Inputs / Forms', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Type or paste 246810 to unlock; anything else fails. Esc clears.', props: [
    { name: 'length', type: 'number', default: '6', description: 'Number of drums.' },
    { name: 'value / defaultValue / onValueChange', type: 'string', description: 'Controlled or uncontrolled digits.' },
    { name: 'onVerify', type: '(code) => boolean | Promise<boolean>', description: 'Runs when all drums are set; false / reject shows the error state and resets.' },
    { name: 'onSuccess', type: '(code) => void', description: 'Fires after a successful verify.' },
    { name: 'label / hint', type: 'string', description: 'Field label and helper text.' },
    { name: 'resendAfter / onResend', type: 'number / () => void', default: '30', description: 'Countdown before “Resend code” unlocks (0 hides it).' },
    { name: 'disabled / autoFocus', type: 'boolean', default: 'false', description: 'Standard field flags.' },
  ] },
  { slug: 'crystal-strength-password', title: 'Crystal Strength Password', description: 'A password field that grows an SVG crystal: each satisfied rule springs a faceted shard out of the rock, the cluster shifts from ember to glacier, and a perfect score turns it iridescent with glints. Includes show/hide and a forged suggestion that scrambles in.', category: 'Inputs / Forms', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Type a password or press “Suggest one”.', props: [
    { name: 'value / defaultValue / onValueChange', type: 'string', description: 'Controlled or uncontrolled value.' },
    { name: 'rules', type: '{ id, label, test }[]', default: 'DEFAULT_PASSWORD_RULES', description: 'Up to five rules; each grows one shard.' },
    { name: 'onStrengthChange', type: '(score, label) => void', description: 'Fires when the score changes.' },
    { name: 'label / placeholder / name', type: 'string', description: 'Field copy and form name.' },
    { name: 'showSuggest', type: 'boolean', default: 'true', description: 'Show the password forge button.' },
  ] },
  { slug: 'button', title: 'Button', description: 'Versatile button with variants and sizes.', category: 'Core', dependencies: ['clsx', 'tailwind-merge'] },
  { slug: 'badge', title: 'Badge', description: 'Compact status and label chips.', category: 'Core' },
  { slug: 'card', title: 'Card', description: 'Composable surface with hairline ring and layered shadow; default, raised, glass and outline variants.', category: 'Core', props: [
    { name: 'variant', type: '\'default\' | \'raised\' | \'glass\' | \'outline\'', default: '\'default\'', description: 'Surface treatment.' },
    { name: 'interactive', type: 'boolean', default: 'false', description: 'Hover lift and focus-within ring for clickable cards.' },
    { name: 'CardHeader / CardTitle / CardDescription / CardContent / CardFooter', type: 'HTMLAttributes', default: '—', description: 'Composable slots.' },
  ] },
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
  { slug: 'progress', title: 'Progress', description: 'Progress bar with semantic tones, sizes, an optional label with tabular percentage, and an indeterminate mode.', category: 'Core', props: [
    { name: 'value', type: 'number', default: '—', description: '0–100.' },
    { name: 'tone', type: '\'accent\' | \'success\' | \'warning\' | \'danger\' | \'neutral\'', default: '\'accent\'', description: 'Fill colour.' },
    { name: 'size', type: '\'sm\' | \'md\' | \'lg\'', default: '\'md\'', description: 'Track height.' },
    { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Unknown duration.' },
    { name: 'label', type: 'string', default: '—', description: 'Visible label (also names the bar).' },
    { name: 'showValue', type: 'boolean', default: 'false', description: 'Show the percentage.' },
  ] },
  { slug: 'breathing-dot', title: 'Breathing Dot', description: 'Soft pulsating status indicator.', category: 'Core', unique: true },

  // Portfolio + new heroes
  { slug: 'dealer-deck-testimonials', ownBackground: true, backgroundNote: 'Paints its own linen (light) / ink (dark) table with grain via dark: variants; the card backs use accent. Restyle the frame with className.', title: 'Dealer Deck Testimonials', description: 'Testimonials dealt like playing cards: the top card of a face-down deck slides across the table on a spring, flips face-up mid-flight and lands slightly askew on the pile. Take one back or gather the deck.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Click the deck or "Deal next"; ← → take back / deal.', props: [
    { name: 'items', type: 'DealerTestimonial[]', default: 'DEFAULT_DEALER_TESTIMONIALS', description: '{ id, quote, name, role, rating?, src? } — src replaces the monogram avatar.' },
    { name: 'title / titleAs', type: "string / 'h2' | 'h3'", default: "'Dealt from real projects'", description: 'Heading above the table.' },
    { name: 'accent', type: 'string', default: "'#8c1230'", description: 'Card-back colour (gold guilloche on top).' },
    { name: 'dealt / defaultDealt / onDealtChange', type: 'number', default: '1', description: 'Controlled / uncontrolled number of dealt cards.' },
  ] },
  { slug: 'particle-mesh-gallery', title: 'Particle Mesh Gallery', description: 'An image-colored particle sphere unfolds into a portrait on tap and gathers back on double tap, with original landscape art and a quiet project index.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Tap to reveal; double tap to reform. Enter/Space toggles, Escape reforms, and left/right arrows browse. Pause stops rotation.', props: [
    { name: 'items', type: 'ParticleMeshItem[]', default: '3 generated landscapes', description: 'Unique id, title, category?, src?, alt?, seed?. Images are portrait-cropped; use same-origin or CORS-enabled URLs. Failed images use generated art. Empty arrays show an empty state.' },
    { name: 'value / defaultValue', type: 'string', description: 'Controlled / initial selected item ID. Unknown IDs fall back to the first item.' },
    { name: 'onValueChange', type: '(id: string) => void', description: 'Requested selection change.' },
    { name: 'revealed / defaultRevealed', type: 'boolean', default: 'false', description: 'Controlled / initial image state. False shows the sphere.' },
    { name: 'onRevealedChange', type: '(revealed: boolean) => void', description: 'Requested image/particle state change.' },
    { name: 'particleCount', type: 'number', default: '4200', description: 'Approximate point count, clamped to 600–6000. Lower this on constrained devices.' },
    { name: 'autoRotate', type: 'boolean', default: 'true', description: 'Slow ambient rotation with a visible pause button. Suspends offscreen and in hidden tabs.' },
    { name: 'theme', type: "'auto' | 'light' | 'dark'", default: "'auto'", description: 'Follows the nearest theme scope or forces both canvas and surface colors.' },
    { name: 'label', type: 'string', default: "'Selected work'", description: 'Visible eyebrow and accessible gallery name.' },
    { name: 'className', type: 'string', description: 'Root layout overrides.' },
  ] },
  { slug: 'kinetic-name-hero', ownBackground: true, backgroundNote: 'Paints its own warm-paper (light) / ink (dark) backdrop via light and dark: variants, so it matches the host page. Override the surface with className (e.g. bg-*, rounded-*, min-h-*).', title: 'Kinetic Name Hero', description: 'Your name set huge, every letter on its own spring — letters are pushed away, tilt and swell as the cursor passes, then ease home; a soft light trails the pointer and a badge circles the role.', category: 'Hero', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Move (or drag) across the name — letters scatter and spring back.', props: [
    { name: 'name', type: 'string', default: '\'Nova Reyes\'', description: 'Your name; each word becomes a line.' },
    { name: 'role', type: 'string', default: '\'Design engineer & motion designer\'', description: 'Role line above the name.' },
    { name: 'intro', type: 'string', description: 'Short intro paragraph.' },
    { name: 'ctaLabel / secondaryLabel', type: 'string', default: '\'See selected work\' / \'About me\'', description: 'Button labels.' },
    { name: 'onCta / onSecondary', type: '() => void', description: 'Button handlers.' },
    { name: 'badge', type: 'string', default: '\'Available · Autumn 2026 · \'', description: 'Text circling the rotating badge.' },
    { name: 'radius', type: 'number', default: '230', description: 'Pointer influence radius in px.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'spotlight-reveal-hero', ownBackground: true, backgroundNote: 'Paints its own paper/ink scene and the lit gradient layer via light and dark: variants, so it matches the host page. Override the surface with className (e.g. bg-*, rounded-*, min-h-*).', title: 'Spotlight Reveal Hero', description: 'A quiet paper-and-ink hero with a cursor-lit lens that reveals a saturated, grid-drawn “lit” version of the same message; the beam wanders on its own when idle and locks onto the button on keyboard focus.', category: 'Hero', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Move to aim the spotlight; press to widen it; Tab to the button to pull the light onto it.', props: [
    { name: 'eyebrow', type: 'string', default: '\'Portfolio 2026\'', description: 'Small label above the headline.' },
    { name: 'title', type: 'string', default: '\'Quiet work. Loud results.\'', description: 'Headline in the quiet voice.' },
    { name: 'revealTitle', type: 'string', default: '\'Switch the lights on.\'', description: 'Headline shown inside the spotlight.' },
    { name: 'description', type: 'string', description: 'Supporting paragraph.' },
    { name: 'ctaLabel', type: 'string', description: 'Primary button label.' },
    { name: 'onCta', type: '() => void', description: 'Primary button handler.' },
    { name: 'radius', type: 'number', default: '190', description: 'Spotlight radius in px.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'depth-parallax-hero', ownBackground: true, backgroundNote: 'Paints its own generated landscape (dawn on light, dusk on dark) via light and dark: variants, so it matches the host page. Override the surface with className (e.g. bg-*, rounded-*, min-h-*).', title: 'Depth Parallax Hero', description: 'A layered SVG landscape — sun/moon, three mountain planes and a tree line — shifting at depth-correct factors with the pointer or a slow idle sway; the giant name sits between the planes.', category: 'Hero', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Move the pointer — near layers travel further than far ones.', props: [
    { name: 'eyebrow', type: 'string', description: 'Small label.' },
    { name: 'name', type: 'string', default: '\'Mira Castell\'', description: 'First word becomes the giant backdrop word.' },
    { name: 'title', type: 'string', description: 'Headline.' },
    { name: 'description', type: 'string', description: 'Supporting paragraph.' },
    { name: 'ctaLabel', type: 'string', description: 'Primary button label.' },
    { name: 'onCta', type: '() => void', description: 'Primary button handler.' },
    { name: 'strength', type: 'number', default: '1', description: 'Parallax multiplier (0 disables).' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'role-morph-hero', ownBackground: true, backgroundNote: 'Paints its own soft paper/ink backdrop with a role-coloured wash via light and dark: variants, so it matches the host page. Override the surface with className (e.g. bg-*, rounded-*, min-h-*).', title: 'Role Morph Hero', description: '“a ____.” where the blank cycles through your roles: letters of the old role drop away with a blur, the next role springs up in a stagger, the highlighter springs to the new width and a colour wash shifts.', category: 'Hero', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Watch the role morph; hover to hold, use the dots to jump or the button to pause.', props: [
    { name: 'greeting', type: 'string', default: '\'Hi, I’m Sam Okoye —\'', description: 'Line above the headline.' },
    { name: 'roles', type: '(string | { label: string; color?: string })[]', default: '[\'designer\', \'storyteller\', …]', description: 'Roles to cycle.' },
    { name: 'description', type: 'string', description: 'Supporting paragraph.' },
    { name: 'ctaLabel', type: 'string', description: 'Primary button label.' },
    { name: 'onCta', type: '() => void', description: 'Primary button handler.' },
    { name: 'interval', type: 'number', default: '2600', description: 'ms each role rests.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'photo-strip-hero', ownBackground: true, backgroundNote: 'Paints its own soft paper/ink backdrop and tilted card rails via light and dark: variants, so it matches the host page. Override the surface with className (e.g. bg-*, rounded-*, min-h-*).', title: 'Photo Strip Hero', description: 'A big headline over two tilted rails of photo cards drifting in opposite directions — they slow under the pointer, surge with scroll velocity and lift on hover.', category: 'Hero', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Hover to slow the rails, scroll the page to make them surge, hover a card to lift it.', props: [
    { name: 'eyebrow', type: 'string', description: 'Small label.' },
    { name: 'title', type: 'string', description: 'Headline (words rise out of masks).' },
    { name: 'description', type: 'string', description: 'Supporting paragraph.' },
    { name: 'ctaLabel', type: 'string', description: 'Primary button label.' },
    { name: 'onCta', type: '() => void', description: 'Primary button handler.' },
    { name: 'photos', type: '{ id, title, seed?, src?, alt? }[]', default: '8 generated cards', description: 'Cards for the rails; set src to use real photography.' },
    { name: 'speed', type: 'number', default: '38', description: 'Base speed in px per second.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'terminal-dev-hero', ownBackground: true, backgroundNote: 'Paints its own soft paper/ink backdrop (the terminal stays dark) via light and dark: variants, so it matches the host page. Override the surface with className (e.g. bg-*, rounded-*, min-h-*).', title: 'Terminal Dev Hero', description: 'A developer intro with a live terminal: commands type with human rhythm, outputs stream in, a build bar fills and the window floats in 3D with the pointer. Pause and replay included.', category: 'Hero', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Watch the session type; tilt the window with the pointer; pause or replay from the title bar.', props: [
    { name: 'eyebrow', type: 'string', description: 'Pill label.' },
    { name: 'title', type: 'string', description: 'Headline.' },
    { name: 'description', type: 'string', description: 'Supporting paragraph.' },
    { name: 'ctaLabel', type: 'string', description: 'Primary button label.' },
    { name: 'onCta', type: '() => void', description: 'Primary button handler.' },
    { name: 'script', type: 'TerminalStep[]', default: '9-step demo', description: 'Steps: { type: \'cmd\' | \'out\' | \'progress\', text, tone? }.' },
    { name: 'prompt', type: 'string', default: '\'~/portfolio\'', description: 'Prompt label.' },
    { name: 'loop', type: 'boolean', default: 'true', description: 'Restart when the script finishes.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'project-reveal-list', title: 'Project Reveal List', description: 'An editorial project index: rows dim their siblings and nudge on hover while a tilting preview chases the cursor on a spring and unmasks with a clip-path. Touch gets inline thumbnails.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Hover rows — a preview follows the cursor; Tab to a row to anchor it.', props: [
    { name: 'items', type: 'PortfolioProject[]', default: 'SAMPLE_PROJECTS', description: 'Projects: { id, title, category, year, blurb, src?, seed?, tags?, role?, href? }. Without src, deterministic generated art is drawn from seed.' },
    { name: 'onSelect', type: '(project) => void', description: 'Fires when a row is activated.' },
    { name: 'titleAs', type: '\'h2\' | \'h3\' | \'h4\' | \'p\'', default: '\'h3\'', description: 'Heading element for item titles, so the page outline stays valid.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'project-filter-gallery', title: 'Project Filter Gallery', description: 'Category chips share a sliding pill (layout animation) while the grid reflows: survivors glide to new cells, newcomers bloom in blur-to-sharp. Announces the result count.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Click a category chip — the grid re-flows.', props: [
    { name: 'items', type: 'PortfolioProject[]', default: 'SAMPLE_PROJECTS', description: 'Projects: { id, title, category, year, blurb, src?, seed?, tags?, role?, href? }. Without src, deterministic generated art is drawn from seed.' },
    { name: 'allLabel', type: 'string', default: '\'All work\'', description: 'Label for the show-everything chip.' },
    { name: 'value / defaultValue', type: 'string', description: 'Controlled / uncontrolled category.' },
    { name: 'onValueChange', type: '(category: string) => void', description: 'Fires when the filter changes.' },
    { name: 'onSelect', type: '(project) => void', description: 'Fires when a card is activated.' },
    { name: 'titleAs', type: '\'h2\' | \'h3\' | \'h4\' | \'p\'', default: '\'h3\'', description: 'Heading element for item titles, so the page outline stays valid.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'case-study-scroll', title: 'Case Study Scroll', description: 'Problem → Process → Result as a scroll-driven story: a sticky rail fills as you read and lights the current chapter while chapters rise in with staggered key figures.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Scroll — the rail fills and the chapter lights up.', props: [
    { name: 'client', type: 'string', description: 'Case-study title in the rail.' },
    { name: 'steps', type: 'CaseStudyStep[]', default: 'problem / process / result', description: '{ id, label, title, body, points?, seed?, src? }' },
    { name: 'scrollContainer', type: 'React.RefObject<HTMLElement | null>', default: 'window', description: 'Scroll element when the component lives inside its own scroller.' },
    { name: 'titleAs', type: '\'h2\' | \'h3\'', default: '\'h3\'', description: 'Heading element for item titles, so the page outline stays valid.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'before-after-slider', title: 'Before / After Slider', description: 'Drag, tap or use the arrow keys to wipe between two states. The knob stretches while held, the reveal edge glows and the handle sweeps once on first view.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Drag the handle, click to jump, or focus it and use ←/→ (Shift = ±10, Home/End).', props: [
    { name: 'before / after', type: 'ReactNode', default: 'wireframe / polished mock', description: 'Layers to compare (images, nodes…).' },
    { name: 'beforeLabel / afterLabel', type: 'string', default: '\'Before\' / \'After\'', description: 'Corner labels.' },
    { name: 'value / defaultValue', type: 'number', default: '50', description: 'Position 0–100 (controlled / uncontrolled).' },
    { name: 'onValueChange', type: '(v: number) => void', description: 'Fires while moving.' },
    { name: 'intro', type: 'boolean', default: 'true', description: 'Sweep once when scrolled into view.' },
    { name: 'aspect', type: 'string', default: '\'16 / 10\'', description: 'CSS aspect-ratio.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'career-timeline', title: 'Career Timeline', description: 'A vertical line that draws itself as you scroll with a glowing head; milestone nodes pop on springs and cards slide in from alternating sides.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Scroll — the line draws and milestones pop in.', props: [
    { name: 'entries', type: 'TimelineEntry[]', default: '5 sample roles', description: '{ period, role, org, summary, tags? }' },
    { name: 'scrollContainer', type: 'React.RefObject<HTMLElement | null>', default: 'window', description: 'Scroll element when the component lives inside its own scroller.' },
    { name: 'titleAs', type: '\'h2\' | \'h3\' | \'h4\'', default: '\'h3\'', description: 'Heading element for item titles, so the page outline stays valid.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'skills-marquee', title: 'Skills Marquee', description: 'Two counter-rotating rails of skill pills. Hover or keyboard focus pauses, a visible Pause button covers touch and WCAG 2.2.2, and reduced motion becomes a calm wrapped list.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['lucide-react'], gesture: 'Hover to pause; use the Pause button.', props: [
    { name: 'topRow / bottomRow', type: 'string[]', default: 'sample skills', description: 'Pills for each rail.' },
    { name: 'duration', type: 'number', default: '38', description: 'Seconds per loop.' },
    { name: 'showControl', type: 'boolean', default: 'true', description: 'Show the Pause / Play button.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'skill-meters', title: 'Skill Meters', description: 'Radial gauges that sweep to their value on scroll-in: glowing gradient arc, a comet dot on the tip and a live count-up. Staggered, replayable and exposed as ARIA meters.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Scroll into view — the gauges sweep; press Replay to run again.', props: [
    { name: 'skills', type: '{ label, value, note? }[]', default: '4 sample skills', description: 'Value is 0–100.' },
    { name: 'replayable', type: 'boolean', default: 'true', description: 'Show the Replay button.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'impact-stats', title: 'Impact Stats', description: 'Odometer counters: every digit is a reel spinning to its value on its own spring when the row scrolls in — right-most digits settle last, like a mechanical counter.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Scroll into view — the digits roll.', props: [
    { name: 'stats', type: 'ImpactStat[]', default: '4 sample stats', description: '{ value, label, prefix?, suffix?, decimals?, detail? }' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'testimonial-carousel', title: 'Testimonial Carousel', description: 'Large display-type quotes sliding on direction-aware springs with swipe/drag, arrow keys and a progress-filled dot for auto-advance. Pauses on hover, focus and drag.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Swipe or drag, press ←/→, or use the arrows; hover to pause.', props: [
    { name: 'items', type: '{ quote, name, role, company? }[]', default: '4 sample quotes', description: 'Testimonials.' },
    { name: 'interval', type: 'number', default: '7000', description: 'Auto-advance in ms (0 disables).' },
    { name: 'onChange', type: '(index: number) => void', description: 'Fires when the slide changes.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'client-logo-strip', title: 'Client Logo Strip', description: 'A calm trust row of generated marks with a cursor-following spotlight that lights hairline borders; marks lift and spin a few degrees on hover/focus.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Move across the strip — the spotlight follows; hover a mark.', props: [
    { name: 'clients', type: '{ name, mark?, href? }[]', default: '8 generated marks', description: 'Replace marks with real SVGs in your own copy.' },
    { name: 'heading', type: 'string', description: 'Accessible heading above the strip.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'contact-form-card', title: 'Contact Form Card', description: 'Validated on blur and submit with announced inline errors (shake + focus jump), optional async onSubmit with a sending morph, a drawn-check success scene with a particle burst, and a failure state with Retry that keeps everything typed.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Submit empty to see validation; fill and send; toggle “Simulate failure” to see Retry.', props: [
    { name: 'onSubmit', type: '(values) => void | Promise<unknown>', default: 'simulated 1.1s', description: 'Resolve for success, reject to show the retry state.' },
    { name: 'topics', type: 'string[]', default: '4 topics', description: 'Topic chips.' },
    { name: 'title / description', type: 'string', description: 'Header copy.' },
    { name: 'submitLabel / successTitle / successMessage', type: 'string', description: 'Copy.' },
    { name: 'maxLength', type: 'number', default: '600', description: 'Message length limit.' },
    { name: 'headingAs', type: '\'h2\' | \'h3\'', default: '\'h3\'', description: 'Heading element.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'social-dock', title: 'Social Dock', description: 'A floating link dock whose icons swell with a spring as the pointer (or keyboard focus) nears them, with a coloured halo and a springy label chip. Generic glyphs — bring your own.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Sweep across the dock — icons magnify; Tab through to magnify by keyboard.', props: [
    { name: 'items', type: '{ label, href, icon, color? }[]', default: '6 generic links', description: 'Dock links.' },
    { name: 'size / maxSize', type: 'number', default: '48 / 76', description: 'Resting and peak icon sizes in px.' },
    { name: 'aria-label', type: 'string', default: '\'Find me elsewhere\'', description: 'Accessible name of the nav.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'copy-email-button', title: 'Copy Email Button', description: 'A pill showing your address: the glyph morphs to a check, the label rolls to “Copied”, a ring pulses out and a live region confirms. Falls back to a select hint if the clipboard is blocked.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Click to copy — watch the label roll.', props: [
    { name: 'email', type: 'string', description: 'Address to copy.' },
    { name: 'copiedLabel', type: 'string', default: '\'Copied to clipboard\'', description: 'Success label.' },
    { name: 'resetAfter', type: 'number', default: '2200', description: 'ms until idle again.' },
    { name: 'onCopy', type: '(email: string) => void', description: 'Fires after a successful copy.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'availability-badge', title: 'Availability Badge', description: 'A status pill with a motion language per state: “open” sends two staggered radar ripples, “limited” breathes slowly, “booked” holds still. Copy swaps on a vertical spring; optional live local clock.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Switch the status to watch each state’s motion.', props: [
    { name: 'status', type: '\'open\' | \'limited\' | \'booked\'', default: '\'open\'', description: 'Current availability.' },
    { name: 'labels', type: 'Partial<Record<status, { title, detail }>>', description: 'Override copy per status.' },
    { name: 'timeZone', type: 'string', description: 'IANA zone, e.g. \'Europe/Lisbon\' — shows a live clock.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'portfolio-footer', ownBackground: true, backgroundNote: 'Paints its own ink surface (a dark closing block on both themes) via light and dark: variants, so it matches the host page. Override the surface with className (e.g. bg-*, rounded-*, min-h-*).', title: 'Portfolio Footer', description: 'A closing statement in giant display type — letters rise out of masks on scroll-in and a light follows the cursor across the glyphs — with a slow ribbon marquee, links and back-to-top.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Scroll it into view; move across the headline.', props: [
    { name: 'headline', type: 'string', default: '\'Let’s talk.\'', description: 'Oversized closing line.' },
    { name: 'email', type: 'string', description: 'Mailto address.' },
    { name: 'ribbon', type: 'string', default: '\'Open to new projects\'', description: 'Marquee text.' },
    { name: 'links', type: '{ label, href }[]', default: '4 links', description: 'Footer navigation.' },
    { name: 'name', type: 'string', default: '\'Your Name\'', description: 'Name in the copyright line.' },
    { name: 'onBackToTop', type: '() => void', description: 'Override the scroll-to-top behaviour.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'section-spy-nav', title: 'Section Spy Nav', description: 'Sticky in-page navigation that follows your reading position: a shared pill springs between links as sections cross the reading line, a hairline fills with overall progress, and clicks glide and move focus into the section.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Scroll the page — the pill follows; click a link to glide.', props: [
    { name: 'sections', type: '{ id, label }[]', default: 'work / about / journal / contact', description: 'Ids must exist in the DOM.' },
    { name: 'scrollContainer', type: 'React.RefObject<HTMLElement | null>', default: 'window', description: 'Scroll element when the component lives inside its own scroller.' },
    { name: 'orientation', type: '\'horizontal\' | \'vertical\'', default: '\'horizontal\'', description: 'Layout.' },
    { name: 'value / onValueChange', type: 'string / (id) => void', description: 'Controlled active id.' },
    { name: 'aria-label', type: 'string', default: '\'On this page\'', description: 'Accessible nav name.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'project-lightbox', title: 'Project Lightbox', description: 'Thumbnails open into a detail modal through a shared-element morph — artwork flies from its tile to the hero slot while copy staggers in. Focus trapped and restored, Esc closes, ←/→ browse.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Click a tile; use ←/→ to browse and Esc to close.', props: [
    { name: 'items', type: 'PortfolioProject[]', default: 'SAMPLE_PROJECTS', description: 'Projects: { id, title, category, year, blurb, src?, seed?, tags?, role?, href? }. Without src, deterministic generated art is drawn from seed.' },
    { name: 'openId / onOpenChange', type: 'string | null / (id) => void', description: 'Controlled open project.' },
    { name: 'titleAs', type: '\'h2\' | \'h3\' | \'h4\' | \'p\'', default: '\'h3\'', description: 'Heading element for item titles, so the page outline stays valid.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'intro-preloader', ownBackground: true, backgroundNote: 'Paints its own ink curtain over your content via light and dark: variants, so it matches the host page. Override the surface with className (e.g. bg-*, rounded-*, min-h-*).', title: 'Intro Preloader', description: 'Greeting words flick by while a big counter climbs 0→100, then the ink curtain lifts with a trailing curve that flattens as it leaves and the page settles from a slight zoom. Skippable.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Watch the count and curtain; press Skip (or Esc), or Replay in the demo.', props: [
    { name: 'children', type: 'ReactNode', description: 'Content revealed when the curtain lifts.' },
    { name: 'words', type: 'string[]', default: 'Hello / Bonjour / …', description: 'Greetings cycled while counting.' },
    { name: 'duration', type: 'number', default: '2.6', description: 'Seconds of counting.' },
    { name: 'autoStart / runKey', type: 'boolean / number', default: 'true / 0', description: 'Start automatically; change runKey to replay.' },
    { name: 'onComplete', type: '() => void', description: 'Fires after the curtain has gone.' },
    { name: 'skipLabel', type: 'string', default: '\'Skip intro\'', description: 'Skip button label.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'reading-progress-toc', title: 'Reading Progress + TOC', description: 'A spring-smoothed reading bar and a sticky table of contents that lights the section on screen, with a live “min left” estimate — made for long-form blog posts.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Scroll the article — the bar fills and the contents follow.', props: [
    { name: 'title / meta', type: 'string', description: 'Article heading and meta line.' },
    { name: 'sections', type: '{ id, title, paragraphs[] }[]', default: '4 sections', description: 'Article content.' },
    { name: 'scrollContainer', type: 'React.RefObject<HTMLElement | null>', default: 'window', description: 'Scroll element when the component lives inside its own scroller.' },
    { name: 'wpm', type: 'number', default: '220', description: 'Words per minute for the estimate.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'resume-download-button', title: 'Résumé Download Button', description: 'The document glyph prints itself line by line, then drops into a tray as the file downloads and the label settles on “Saved”. Live status for screen readers.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Click — the sheet prints and drops into the tray.', props: [
    { name: 'href', type: 'string', description: 'File URL; a real download starts when the sheet lands.' },
    { name: 'fileName', type: 'string', default: '\'resume.pdf\'', description: 'Downloaded file name.' },
    { name: 'meta', type: 'string', default: '\'PDF · 184 KB\'', description: 'Meta line.' },
    { name: 'label', type: 'string', default: '\'Download résumé\'', description: 'Button label.' },
    { name: 'onDownload', type: '() => void', description: 'Fires after the animation.' },
    { name: 'duration', type: 'number', default: '1500', description: 'ms of the printing phase.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'services-cards', title: 'Services Cards', description: 'Four offers in one row: hover or focus a card and it swells while the others yield; a cursor-lit border follows the pointer, the icon tile tilts and deliverables stagger in with ticking checks.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Hover or focus a card; tap on touch.', props: [
    { name: 'services', type: 'ServiceItem[]', default: '4 sample offers', description: '{ id, title, summary, deliverables[], price?, icon? }' },
    { name: 'defaultActive', type: 'string', description: 'Initially expanded id.' },
    { name: 'titleAs', type: '\'h2\' | \'h3\' | \'h4\'', default: '\'h3\'', description: 'Heading element for item titles, so the page outline stays valid.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'scroll-reveal', title: 'Scroll Reveal', description: 'A wrapper that animates its content in on scroll: seven effects (rise, fade, blur, scale, clip, slide-left/right), optional child staggering, any scroll container, and a no-motion fallback.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Scroll the frame — each block enters with its effect.', props: [
    { name: 'effect', type: '\'rise\' | \'fade\' | \'blur\' | \'scale\' | \'clip\' | \'slide-left\' | \'slide-right\'', default: '\'rise\'', description: 'Entrance style.' },
    { name: 'stagger', type: 'number', default: '0', description: 'Seconds between direct children (0 = animate as one).' },
    { name: 'delay / distance / amount', type: 'number', default: '0 / 40 / 0.25', description: 'Delay, travel in px, visible fraction.' },
    { name: 'once', type: 'boolean', default: 'true', description: 'Only animate the first time.' },
    { name: 'scrollContainer', type: 'React.RefObject<HTMLElement | null>', default: 'window', description: 'Scroll element when the component lives inside its own scroller.' },
    { name: 'as', type: '\'div\' | \'section\' | \'article\' | \'header\' | \'footer\'', default: '\'div\'', description: 'Rendered element.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'portfolio-studio-template', ownBackground: true, backgroundNote: 'Paints its own full page (paper/ink surfaces on both themes) via light and dark: variants, so it matches the host page. Override the surface with className (e.g. bg-*, rounded-*, min-h-*).', title: 'Studio Folio Template', description: 'A complete one-page designer portfolio composed from Framekit parts — intro preloader, kinetic name hero, spy-nav, impact stats, filterable work with lightbox, services, testimonials, contact form and footer. Installing it pulls in every part.', category: 'Portfolio', unique: true, isNew: true, gesture: 'Scroll the framed page; use the nav.', props: [
    { name: 'name / role', type: 'string', description: 'Identity shown in the hero and footer.' },
    { name: 'projects', type: 'PortfolioProject[]', default: 'SAMPLE_PROJECTS', description: 'Work shown in the gallery.' },
    { name: 'onContactSubmit', type: 'ContactFormCard[\'onSubmit\']', description: 'Async contact handler.' },
    { name: 'intro', type: 'boolean', default: 'true', description: 'Play the preloader first.' },
    { name: 'frameHeight', type: 'number', default: '680', description: 'Height of the scroll frame (0 = render as a normal page).' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'portfolio-developer-template', ownBackground: true, backgroundNote: 'Paints its own full page (paper/ink surfaces on both themes) via light and dark: variants, so it matches the host page. Override the surface with className (e.g. bg-*, rounded-*, min-h-*).', title: 'Dev Folio Template', description: 'A developer-flavoured one-pager composed from Framekit parts — terminal hero, skills marquee, hover-preview project index, scroll-drawn career timeline, skill meters, social dock, copy-email + résumé and a statement footer.', category: 'Portfolio', unique: true, isNew: true, gesture: 'Scroll the framed page; hover projects.', props: [
    { name: 'name / email', type: 'string', description: 'Identity and contact address.' },
    { name: 'projects', type: 'PortfolioProject[]', default: 'SAMPLE_PROJECTS', description: 'Work shown in the project index.' },
    { name: 'resumeHref', type: 'string', description: 'Résumé file URL.' },
    { name: 'frameHeight', type: 'number', default: '680', description: 'Height of the scroll frame (0 = render as a normal page).' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  // p2:start
  { slug: 'year-activity-grid', title: 'Year Activity Grid', description: 'A contribution calendar that blooms in on a diagonal wave, lights a crosshair of the hovered weekday and week, floats a readout above the day and reports streaks. Fully arrow-key navigable.', category: 'Portfolio', unique: true, isNew: true, dependencies: [], gesture: 'Hover a day, or Tab in and use the arrow keys to walk the calendar.', props: [
    { name: 'data', type: '{ date: string; count: number }[]', default: 'generated year', description: 'One entry per day (yyyy-mm-dd). Omit to render a deterministic generated year.' },
    { name: 'endDate', type: 'string | Date', default: 'today', description: 'Last day shown.' },
    { name: 'weeks', type: 'number', default: '53', description: 'Week columns (12–53).' },
    { name: 'tone', type: "'signal' | 'mint' | 'ember' | 'ink'", default: "'signal'", description: 'Colour ramp; level 0 is always neutral.' },
    { name: 'title / unit', type: 'string', default: "'Shipping rhythm' / 'contributions'", description: 'Heading label and the noun used in the summary.' },
    { name: 'seed', type: 'number', default: '7', description: 'Seed for the generated demo data.' },
    { name: 'onSelect', type: '(day) => void', description: 'Fires when a day is clicked or activated.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'now-playing-widget', title: 'Now Playing Widget', description: 'A vinyl slides out of a generated sleeve and spins as a tonearm settles on it, an EQ breathes beside the title and progress ticks live with a scrubbable seek bar. Visual only — wire it to your own player.', category: 'Widgets', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Press play/pause — the record slides and the tonearm lifts; drag the bar to seek.', props: [
    { name: 'tracks', type: '{ title, artist, duration, seed?, src? }[]', default: '4 sample tracks', description: 'Playlist; duration in seconds. Without src, sleeve art is generated from seed.' },
    { name: 'playing / defaultPlaying', type: 'boolean', default: 'true', description: 'Controlled / uncontrolled play state.' },
    { name: 'onPlayingChange', type: '(playing: boolean) => void', description: 'Fires on play/pause.' },
    { name: 'onTrackChange', type: '(track, index) => void', description: 'Fires when the track changes (including auto-advance).' },
    { name: 'playingLabel / pausedLabel', type: 'string', default: "'Now playing' / 'Paused'", description: 'Eyebrow copy.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'world-clock-globe', title: 'World Clock Globe', description: 'A dotted planet you can spin, lit by the real sun — the night side dims along a live terminator, a 24-hour ring tracks the chosen city and every card ticks its own local time. Canvas 2D, no map tiles.', category: 'Widgets', unique: true, isNew: true, dependencies: [], gesture: 'Drag the globe, or pick a city — it rotates to face it.', props: [
    { name: 'cities', type: '{ id, name, tz, lat, lon, note? }[]', default: '6 cities', description: 'Pins; tz is an IANA zone used for the live clock.' },
    { name: 'value / defaultValue', type: 'string', default: 'first city', description: 'Controlled / uncontrolled selected city id.' },
    { name: 'onValueChange', type: '(id: string) => void', description: 'Fires when a city is chosen.' },
    { name: 'theme', type: "'auto' | 'light' | 'dark'", default: "'auto'", description: 'auto follows the nearest .dark / .light ancestor.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'bento-profile-board', title: 'Bento Profile Board', description: 'Your profile as a living dashboard: identity with a pulsing build status, an analogue clock that follows your time zone, weather glyph, now-playing equaliser, visitor odometer, activity strip, stack chips and a CTA — tiles rise in on a stagger and each lights its own border under the cursor.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Move over the tiles — each lights its border; hover the CTA arrow.', props: [
    { name: 'name / role / location', type: 'string', default: 'sample persona', description: 'Identity copy.' },
    { name: 'timeZone', type: 'string', default: "'Europe/Stockholm'", description: 'IANA zone for the analogue clock (day/night face).' },
    { name: 'building', type: 'string', description: 'Completes “Building …” in the status chip.' },
    { name: 'avatarSrc', type: 'string', description: 'Optional photo; otherwise a generated bust is drawn.' },
    { name: 'stack', type: 'string[]', default: '7 tools', description: 'Chips in the tools tile.' },
    { name: 'weather', type: '{ temp, label, kind }', description: 'kind: sun | cloud | rain | moon.' },
    { name: 'nowPlaying', type: '{ title, artist }', description: 'Track in the equaliser tile.' },
    { name: 'visitorNumber', type: 'number', default: '2701', description: 'Odometer target ("You’re the 2,701st").' },
    { name: 'ctaLabel / ctaHref', type: 'string', default: "'Book a call' / '#'", description: 'Contact tile link.' },
    { name: 'headingAs', type: "'h2' | 'h3' | 'h4'", default: "'h3'", description: 'Heading level for the name.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'scatter-desk-collage', title: 'Scatter Desk Collage', description: 'A desk of rotated polaroids, sticky notes, UI clips, quote cards and a sticker that you can really move — the picked card straightens and lifts, arrow keys nudge, and “Tidy up” snaps everything to a grid on springs.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Drag a card around the desk; press Tidy up / Scatter.', props: [
    { name: 'items', type: 'DeskItem[]', default: '8 sample cards', description: '{ id, kind: photo | note | clip | quote | sticker, title, caption?, x, y, w, rotate?, seed?, src? } — x / y / w are % of the desk.' },
    { name: 'aspect', type: 'number', default: '1.55', description: 'Desk width / height ratio.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'kudos-wall', title: 'Kudos Wall', description: 'Praise cards drift past in three columns at different speeds and directions behind a soft fade mask, with underlined key phrases and a cheer toggle on every card. Hover or focus pauses; a Pause button covers touch.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['lucide-react'], gesture: 'Hover to pause the drift; tap ♥ to cheer a card.', props: [
    { name: 'items', type: 'Kudos[]', default: '9 sample quotes', description: '{ id, name, role, text, mark?, hue? } — mark is the phrase to underline.' },
    { name: 'height', type: 'number', default: '460', description: 'Visible height in px.' },
    { name: 'duration', type: 'number', default: '60', description: 'Seconds per loop of the base column.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'book-spine-shelf', title: 'Book Spine Shelf', description: 'A shelf of generated book spines: the hovered book slides out while neighbours lean away, and choosing one swings its cover open on a hinge into a reading card with an optional ribbon. Arrow keys walk the shelf.', category: 'Cards', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Hover the spines, click one to open its cover; use ←/→.', props: [
    { name: 'books', type: 'ShelfBook[]', default: '7 sample books', description: '{ id, title, author, blurb, height?, width?, hue?, badge?, pattern? }.' },
    { name: 'value / defaultValue', type: 'string', description: 'Controlled / uncontrolled open book id.' },
    { name: 'onValueChange', type: '(id: string) => void', description: 'Fires when a book is opened.' },
    { name: 'title', type: 'string', default: "'On my shelf'", description: 'Mono label above the shelf.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'mesh-project-cards', title: 'Mesh Project Cards', description: 'Project cards headed by a living mesh gradient — drifting blurred blobs with film grain — and a status pill that pulses for live and in-progress work. Cards tilt toward the pointer with a travelling glare and the whole card is one link.', category: 'Cards', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Move across a card to tilt it and drag the glare; hover reveals the arrow.', props: [
    { name: 'items', type: 'MeshProject[]', default: '4 sample projects', description: '{ id, title, blurb, status: live | building | shipped | archived, tags, hue?, href? }.' },
    { name: 'onSelect', type: '(project) => void', description: 'Fires when a card is activated (when no href is given it renders a button).' },
    { name: 'titleAs', type: "'h2' | 'h3' | 'h4'", default: "'h3'", description: 'Heading element for titles.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'command-menu', title: 'Command Menu', description: 'A Ctrl/⌘ K palette for hopping around a portfolio: fuzzy search that underlines the letters it matched, grouped results, a highlight pill that springs between rows, key-cap hints and full combobox semantics.', category: 'Navigation', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Click the chip or press Ctrl/⌘ J (⌘ K by default in your app), type “wrk”, use ↑ ↓ and Enter.', props: [
    { name: 'items', type: 'CommandItem[]', default: '10 sample commands', description: '{ id, label, group?, hint?, keywords?, shortcut?, icon?, onSelect? }.' },
    { name: 'onSelect', type: '(item) => void', description: 'Fires after any command is chosen.' },
    { name: 'triggerLabel / placeholder', type: 'string', description: 'Trigger chip text and input placeholder.' },
    { name: 'hotkey', type: 'string', default: "'k'", description: 'Letter used with Ctrl/⌘ to toggle; \'\' disables the global shortcut.' },
    { name: 'open / defaultOpen / onOpenChange', type: 'boolean', description: 'Controlled or uncontrolled visibility.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the trigger.' },
  ] },
  { slug: 'island-section-nav', title: 'Island Section Nav', description: 'A floating pill that tells you where you are — current section with a scroll-progress ring — then swells into a full jump bar on hover, focus or tap with a sliding highlight, and settles back when you leave.', category: 'Navigation', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Scroll the page, then hover or tap the pill to open the jump bar.', props: [
    { name: 'sections', type: '{ id: string; label: string; icon: ReactNode }[]', description: 'Sections to track. Each id must match an element id in the page.' },
    { name: 'scrollContainer', type: 'RefObject<HTMLElement>', description: 'Scrolling element (defaults to the window).' },
    { name: 'label', type: 'string', default: "'Page sections'", description: 'Accessible name of the nav landmark.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the sticky wrapper.' },
  ] },
  { slug: 'sticky-card-stack', title: 'Sticky Card Stack', description: 'Project cards that pin one over the next like a deck being dealt — each card shrinks back and dims as the following one slides up over it, still peeking out by a few pixels. Scroll-driven with sticky positioning, no layout JS.', category: 'Cards', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Scroll the frame — each card pins while the next slides over it.', props: [
    { name: 'items', type: 'PortfolioProject[]', default: 'SAMPLE_PROJECTS (5)', description: 'Projects: { id, title, category, year, blurb, src?, seed?, tags?, href? }. Without src, generated art is drawn from seed.' },
    { name: 'scrollContainer', type: 'RefObject<HTMLElement>', description: 'Scrolling element that holds the stack (defaults to the window).' },
    { name: 'cardHeight', type: 'number', default: '380', description: 'Height of each card in px.' },
    { name: 'onSelect', type: '(project) => void', description: 'Fires when a card is activated (renders a button when there is no href).' },
    { name: 'titleAs', type: "'h2' | 'h3' | 'h4'", default: "'h3'", description: 'Heading element for titles.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'pinned-project-reel', title: 'Pinned Project Reel', description: 'The section pins to the viewport and your vertical scroll slides a film strip of project cards sideways, with a springy counter and progress line. Focusing a card scrolls the page to it; reduced motion becomes a plain snap scroller.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Scroll down — the reel pins and moves sideways; Tab through the cards.', props: [
    { name: 'items', type: 'PortfolioProject[]', default: 'SAMPLE_PROJECTS (6)', description: 'Projects: { id, title, category, year, blurb, src?, seed?, href? }.' },
    { name: 'scrollContainer', type: 'RefObject<HTMLElement>', description: 'Scrolling element (defaults to the window).' },
    { name: 'height', type: 'number | string', default: "'100svh'", description: 'Height of the pinned stage.' },
    { name: 'heading', type: 'string', default: "'Selected work'", description: 'Intro panel title.' },
    { name: 'onSelect', type: '(project) => void', description: 'Fires when a card is activated.' },
    { name: 'titleAs', type: "'h2' | 'h3' | 'h4'", default: "'h3'", description: 'Heading element for card titles.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'scroll-text-fill', title: 'Scroll Text Fill', description: 'A large editorial statement whose words light up one by one as you scroll, each rising a few pixels into place; accent words get a sweeping underline. The full sentence is exposed to screen readers from the start.', category: 'Text Animations', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Scroll — the sentence fills in word by word.', props: [
    { name: 'text', type: 'string', default: 'sample statement', description: 'The statement. Wrap words in [[double brackets]] for the accent treatment.' },
    { name: 'scrollContainer', type: 'RefObject<HTMLElement>', description: 'Scrolling element (defaults to the window).' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the paragraph.' },
  ] },
  { slug: 'xray-lens-cursor', title: 'X-ray Lens Cursor', description: 'A round lens follows the pointer on a spring and shows a second, perfectly aligned layer of the same content — blueprint, wireframe or annotations — through a clip-path. Press to swell the lens. The reveal is decorative and hidden from assistive tech.', category: 'Cursors', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Move over the poster to open the lens; press and hold to swell it.', props: [
    { name: 'children', type: 'ReactNode', description: 'The normal layer everyone reads.' },
    { name: 'reveal', type: 'ReactNode', description: 'The aligned layer shown inside the lens (decorative duplicate of the same layout).' },
    { name: 'size / pressedSize', type: 'number', default: '170 / 250', description: 'Lens diameter in px, resting and while pressed.' },
    { name: 'label', type: 'string', default: "'x-ray'", description: 'Caption on the lens rim (shows live coordinates).' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the frame.' },
  ] },
  { slug: 'charm-text', title: 'Charm Text', description: 'A sentence with a few enchanted words. Hover, focus or tap one and it recolours, draws an underline and a tiny glyph pops out on a spring; click pins it on. A chip variant sets glyph pills inline that hop on hover.', category: 'Text Animations', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Hover, tap or Tab to the highlighted words.', props: [
    { name: 'segments', type: '(string | { text, glyph, tone, hint? })[]', default: 'sample sentence', description: 'Plain strings and charmed words. glyph: spark | drop | bird | leaf | heart | bolt | star | moon; tone: rose | amber | sky | emerald | violet.' },
    { name: 'variant', type: "'ink' | 'chip'", default: "'ink'", description: 'ink recolours the word and sprouts a glyph; chip shows an inline pill.' },
    { name: 'as', type: "'p' | 'h1' | 'h2' | 'h3'", default: "'p'", description: 'Element for the sentence.' },
    { name: 'className', type: 'string', description: 'Extra classes (set the type size here).' },
  ] },
  { slug: 'big-type-footer', ownBackground: true, backgroundNote: "Paints its own paper (light) / ink (dark) surface via dark: variants, so it matches the host page. Override with className (bg-*, rounded-*).", title: 'Big-Type Footer', description: 'A closing section built around one enormous word whose letters swell and lean toward the cursor, with a ticker, quiet link pills, a live local clock and back-to-top. Light paper / dark ink, never a fixed palette.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Sweep the cursor across the giant word.', props: [
    { name: 'word', type: 'string', default: "'Let\\'s talk'", description: 'The oversized word; scales to the width.' },
    { name: 'email', type: 'string', default: "'hello@example.com'", description: 'mailto target shown under the word.' },
    { name: 'eyebrow / credit', type: 'string', description: 'Small copy above the word / in the bottom bar.' },
    { name: 'links', type: '{ label, href }[]', default: '4 links', description: 'Link pills.' },
    { name: 'ticker', type: 'string[]', default: '4 phrases', description: 'Phrases in the marquee band.' },
    { name: 'timeZone', type: 'string', description: 'IANA zone for the live clock; omit to hide.' },
    { name: 'scrollContainer', type: 'RefObject<HTMLElement>', description: 'Scrolling element for the back-to-top button (defaults to window).' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'grain-gradient-field', ownBackground: true, backgroundNote: 'Paints its own base colour, drifting blobs and grain, adapting to the nearest .dark/.light scope. Use as a section background and keep copy on a scrim.', title: 'Grain Gradient Field', description: 'A full-bleed background of four slowly drifting colour blobs under real SVG film grain, with a pointer-following glow. Four palettes, light and dark tuned, still when reduced motion is on.', category: 'Animated Backgrounds', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Move the pointer across the field — the light follows; pick a palette.', props: [
    { name: 'palette', type: "'aurora' | 'ember' | 'lagoon' | 'orchid'", default: "'aurora'", description: 'Colour family of the blobs (light and dark variants built in).' },
    { name: 'grain', type: 'number', default: '0.5', description: 'Film-grain strength, 0–1.' },
    { name: 'speed', type: 'number', default: '1', description: 'Drift speed multiplier; 0 freezes the field.' },
    { name: 'pointerGlow', type: 'boolean', default: 'true', description: 'Soft light that follows the pointer.' },
    { name: 'children', type: 'ReactNode', description: 'Content rendered above the field.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root (size, radius).' },
  ] },
  { slug: 'theme-reveal-toggle', title: 'Theme Reveal Toggle', description: 'A sky-to-night switch: the sun rolls behind a crescent, clouds give way to stars, and the theme change blooms out of the switch as a circular View Transition reveal. Instant swap under reduced motion.', category: 'Toggles', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Click, or focus and press Space — the new theme spreads out from the switch.', props: [
    { name: 'checked / defaultChecked', type: 'boolean', default: 'false', description: 'true = dark. Controlled or uncontrolled.' },
    { name: 'onCheckedChange', type: '(dark: boolean) => void', description: 'Fires inside the view transition, so state updates are captured in the reveal.' },
    { name: 'scopeRef', type: 'RefObject<HTMLElement>', description: 'Element that receives the dark / light class on toggle.' },
    { name: 'applyToRoot', type: 'boolean', default: 'false', description: 'Also toggle the class on <html> for a site-wide switch.' },
    { name: 'size', type: "'md' | 'lg'", default: "'md'", description: 'Visual size; the hit area is always at least 44px.' },
    { name: 'revealScale', type: 'number', default: '1', description: 'Multiplier for the reveal circle radius.' },
    { name: 'onRevealEnd', type: '(dark: boolean) => void', description: 'Called when the transition completes.' },
    { name: 'aria-label', type: 'string', default: "'Dark mode'", description: 'Accessible name of the switch.' },
  ] },
  { slug: 'mini-desktop-os', ownBackground: true, backgroundNote: 'Draws its own wallpaper, menu bar and dock; the windows adapt to the nearest .dark/.light scope.', title: 'Mini Desktop OS', description: 'A tiny windowed desktop for a portfolio: generated wallpaper, menu bar with a live clock, icon grid, draggable windows with close / minimise / maximise, and a dock. Keyboard-movable; sheets on phones.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Open apps from the icons or dock; drag a window by its title bar, or Tab to it and use the arrow keys.', props: [
    { name: 'apps', type: '{ id, title, icon, tone?, content, size? }[]', description: 'Apps shown as desktop icons, dock items and window contents.' },
    { name: 'defaultOpen', type: 'string[]', default: '[]', description: 'App ids opened on mount.' },
    { name: 'brand', type: 'string', default: "'Folio'", description: 'Wordmark in the menu bar.' },
    { name: 'wallpaperSeed / wallpaperSrc', type: 'number / string', default: '14 / —', description: 'Generated wallpaper seed, or your own image URL.' },
    { name: 'height', type: 'number', default: '540', description: 'Desktop height in px.' },
    { name: 'onOpenChange', type: '(ids: string[]) => void', description: 'Fires when windows open or close.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'login-gate-intro', ownBackground: true, backgroundNote: 'The lock screen paints its own generated wallpaper and scrim; the revealed content is whatever you pass as children.', title: 'Login Gate Intro', description: 'A lock-screen preloader: oversized clock, generated avatar card, a password field that types itself, a three-step sign-in sequence, then the site fades up. Skip link included; reduced motion opens instantly.', category: 'Loading', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Press “Sign in as guest” (or Skip intro) — the lock dissolves into the content.', props: [
    { name: 'name / role', type: 'string', default: "'Guest Studio' / 'Design engineer'", description: 'Text on the lock card; initials make the generated avatar.' },
    { name: 'steps', type: 'string[]', default: '3 lines', description: 'Status lines cycled while signing in.' },
    { name: 'cta', type: 'string', default: "'Sign in as guest'", description: 'Button label.' },
    { name: 'wallpaperSeed', type: 'number', default: '9', description: 'Seed for the generated lock-screen art.' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Start already unlocked (returning visitors).' },
    { name: 'onEnter', type: '() => void', description: 'Fires once when the gate opens.' },
    { name: 'children', type: 'ReactNode', description: 'The site revealed after the gate.' },
  ] },
  { slug: 'route-chooser-hero', ownBackground: true, backgroundNote: 'Paints its own generated sky, hills and road; the sky shifts between day, dusk and night with your focus, independent of the page theme. Cards carry their own AA-safe surfaces.', title: 'Route Chooser Hero', description: 'A fork in the road under a sky that follows your attention: hover or focus the left card and the sun climbs, the right one and the moon rises while a lantern walks that branch. Real buttons or links underneath.', category: 'Hero', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Hover or Tab between the two route cards — the sky turns and a lantern walks the road.', props: [
    { name: 'routes', type: '[RouteChoice, RouteChoice]', default: '2 sample routes', description: '{ id, label, title, blurb, cta?, href? } — first is the daylight route, second the night route.' },
    { name: 'eyebrow / headline', type: 'string', description: 'Small label and the main heading.' },
    { name: 'onChoose', type: '(route: RouteChoice) => void', description: 'Fires on click or Enter. Cards render as <a> when href is set.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'discovery-scene', title: 'Discovery Scene', description: 'An illustrated desk (night in dark mode, daylight in light) with six hidden sparkles. Each find lights its object — lamp, steam, spinning record — reveals a fact, and counts toward “found 6 / 6”. Plain list and reset included.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Find the six sparkles around the desk — tap or Tab and press Enter.', props: [
    { name: 'items', type: '{ title: string; text: string }[]', default: '6 sample facts', description: 'Facts mapped in order to window, print, lamp, mug, notebook, record player.' },
    { name: 'title', type: 'string', default: "'Look around the desk'", description: 'Heading above the scene.' },
    { name: 'onComplete', type: '() => void', description: 'Fires when all sparkles are found.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'image-lens', title: 'Image Lens', description: 'A glass loupe that follows the pointer and magnifies the image beneath it: the rim refracts and fringes like real glass, the rest of the frame softly desaturates, and pinch, ctrl+wheel or a click change the zoom. Press and hold on touch to lift the lens above your finger. Optional annotations appear only inside the lens.', category: 'Portfolio', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Hover the image to magnify; click or pinch to zoom further. On touch, press and hold.', props: [
    { name: 'src / alt', type: 'string', description: 'Image to magnify — a full URL (https://…) or a file in your public/ folder (/images/peak.jpg) — and its description. Shows a shimmer while loading and falls back to the built-in vector scene if the image fails. Without src the original vector dusk scene is drawn.' },
    { name: 'zoomSrc', type: 'string', description: 'Optional higher-resolution image used only inside the lens, fetched the first time the lens opens (e.g. the same photo at 2× width).' },
    { name: 'children', type: 'ReactNode', description: 'Magnify any content instead of an image (rendered twice; the lens copy is decorative).' },
    { name: 'zoom / minZoom / maxZoom', type: 'number', default: '2.5 / 1.5 / 5', description: 'Starting magnification and its range. Click cycles three levels; pinch or ctrl+wheel zooms freely.' },
    { name: 'size', type: 'number', default: '190', description: 'Lens diameter in px (capped to 60% of the frame width).' },
    { name: 'shape', type: "'circle' | 'rounded'", default: "'circle'", description: 'Round loupe or a soft squircle.' },
    { name: 'appearance', type: "'glass' | 'minimal' | 'seamless'", default: "'glass'", description: 'glass: rim, colour fringe, refraction and highlight. minimal: a clean crisp edge with only a faint shadow. seamless: no edge at all — the magnified view feathers into the image.' },
    { name: 'annotations', type: '{ x, y, label }[]', description: 'Pins (x / y as 0–1 fractions) that only appear inside the lens; also listed for screen readers.' },
    { name: 'dim', type: 'boolean', default: 'true', description: 'Desaturate and dim everything outside the lens.' },
    { name: 'aspectRatio', type: 'string', default: "'3 / 2'", description: 'Frame aspect ratio (CSS value).' },
    { name: 'caption', type: 'ReactNode', description: 'Optional figcaption under the image.' },
    { name: 'onZoomChange', type: '(zoom: number) => void', description: 'Fires when the magnification changes.' },
  ] },
  // p2:end
  // magic-batch:start
  { slug: 'signal-beam-diagram', title: 'Signal Beam Diagram', description: 'An integration map where light travels: sources fire gradient pulses along hairline S-curves into a glass hub, which relays them to destinations. Select a node to isolate its route and read what flows through it.', category: 'Widgets', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Click (or Tab + Enter) a node to trace its route; use the pause button to stop the pulses.', props: [
    { name: 'sources / targets', type: 'BeamNode[]', default: '4 / 3 nodes', description: '{ id, label, detail?, icon? } on the left and right. `detail` is shown and announced when selected.' },
    { name: 'hub', type: '{ label, detail?, icon? }', default: "{ label: 'Relay' }", description: 'The centre node; icon defaults to an abstract relay mark.' },
    { name: 'duration', type: 'number', default: '2.6', description: 'Seconds for one pulse to travel a path (1–8).' },
    { name: 'colors', type: '[string, string]', default: "['#8b74b5', '#f97316']", description: 'Inbound and outbound pulse colours.' },
    { name: 'curvature', type: 'number', default: '0.55', description: 'Connector bend, 0 (straight) – 1 (deep S).' },
    { name: 'autoPlay', type: 'boolean', default: 'true', description: 'Start with pulses running. A pause button is always shown.' },
    { name: 'onSelect', type: '(id: string | null) => void', description: 'Fires when a node is selected or cleared.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'feature-bento-grid', title: 'Feature Bento Grid', description: 'An asymmetric grid of feature tiles with generated art. Hover or focus a tile: it lifts, a hairline light follows the pointer around its edge, the art drifts up and a call-to-action rises. CTAs stay visible on touch.', category: 'Cards', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Hover a tile (or Tab to its link) — the edge light follows and the CTA rises.', props: [
    { name: 'items', type: 'BentoItem[]', default: 'DEFAULT_BENTO_ITEMS', description: "{ id, title, description, icon?, art?: 'chart' | 'globe' | 'keys' | 'calendar' | 'shield', src?, alt?, href?, cta?, span?: 'wide' | 'tall' | 'full' | 'normal' }." },
    { name: 'titleAs', type: "'h2' | 'h3' | 'h4'", default: "'h3'", description: 'Heading level for tile titles.' },
    { name: 'onSelect', type: '(item) => void', description: 'Fires when a tile without href is activated.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the grid.' },
  ] },
  { slug: 'live-feed-stack', ownBackground: true, backgroundNote: 'Paints a soft generated wallpaper behind the glass cards (set wallpaper={false} to sit on your own backdrop). Adapts to the nearest .dark/.light scope.', title: 'Live Feed Stack', description: 'A notification centre on glass. Alerts drop in at the top on a crisp spring, the list makes room with a layout animation, and older ones fold into a pile you can expand. Times tick; arrivals are announced; the stream can be paused.', category: 'Notifications', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Watch alerts arrive; press “N older” to expand the pile, or pause the stream.', props: [
    { name: 'items', type: 'FeedItem[]', default: 'DEFAULT_FEED', description: "{ id, app, title, body, icon?, tone?: 'violet' | 'orange' | 'emerald' | 'sky' | 'rose' | 'teal' } — arrive in order and loop." },
    { name: 'interval', type: 'number', default: '2600', description: 'ms between arrivals (900–20000).' },
    { name: 'visible', type: 'number', default: '3', description: 'Cards shown before older ones fold into the pile.' },
    { name: 'autoPlay', type: 'boolean', default: 'true', description: 'Start streaming immediately.' },
    { name: 'wallpaper', type: 'boolean', default: 'true', description: 'Paint the generated wallpaper behind the glass.' },
    { name: 'onArrive', type: '(item) => void', description: 'Fires when a notification arrives.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'file-tree-explorer', title: 'File Tree Explorer', description: 'An editor-grade file tree: folders open on a soft height spring, hairline guides show depth, and one highlight glides between selected rows. Full WAI-ARIA tree keyboard support with type-ahead; the selected path is announced.', category: 'Navigation', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Click folders, or focus the tree and use ↑ ↓ ← →, Home/End, Enter and type-ahead.', props: [
    { name: 'data', type: 'TreeNode[]', default: 'DEFAULT_TREE', description: '{ id, name, children? } — nodes with children are folders.' },
    { name: 'defaultExpanded', type: 'string[]', default: "['app', 'components', 'components/ui']", description: 'Folder ids open on mount.' },
    { name: 'value / defaultValue', type: 'string | null', default: "— / 'components/ui/button.tsx'", description: 'Selected file id, controlled or uncontrolled.' },
    { name: 'onValueChange', type: '(id, path: string[]) => void', description: 'Fires when a file is selected.' },
    { name: 'title', type: 'string', default: "'Explorer'", description: 'Header label (also the tree’s accessible name).' },
    { name: 'showPath', type: 'boolean', default: 'true', description: 'Show (and announce) the selected path under the tree.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'device-frame', title: 'Device Frame', description: 'Generic, logo-free device chrome for product shots: a browser with a frosted toolbar and centred address field, or a phone with a machined two-tone rim, punch-hole camera, status bar and floating glass tab bar.', category: 'Cards', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Scroll it into view — it rises in; drop your own screenshot or live UI inside.', props: [
    { name: 'variant', type: "'browser' | 'phone'", default: "'browser'", description: 'Which frame to render.' },
    { name: 'url', type: 'string', default: "'acme.studio/launch'", description: 'Address shown in the browser field.' },
    { name: 'src / alt', type: 'string', description: 'Screenshot placed inside the screen (object-cover, top aligned).' },
    { name: 'children', type: 'ReactNode', description: 'Live screen content; takes priority over src. Defaults to a generated page / app.' },
    { name: 'time', type: 'string', default: "'10:24'", description: 'Clock in the phone status bar.' },
    { name: 'animateIn', type: 'boolean', default: 'true', description: 'Fade and rise into view on first scroll-in.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the frame.' },
  ] },
  { slug: 'avatar-stack', title: 'Avatar Stack', description: 'Overlapping avatars that make room: hover or focus one and it lifts while neighbours part on a spring, revealing a frosted name tag with role and presence. The “+N” chip opens a tidy list of everyone else.', category: 'Core', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Hover or Tab across the faces; open the +N chip (Esc closes).', props: [
    { name: 'people', type: 'StackPerson[]', default: 'DEFAULT_PEOPLE', description: '{ id, name, src?, role?, online? } — generated gradient initials when there is no src.' },
    { name: 'max', type: 'number', default: '5', description: 'Avatars shown before the +N chip.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Avatar size; hit areas stay at least 44px.' },
    { name: 'label', type: 'string', default: "'Editing now'", description: "Caption after the stack ('' hides it)." },
    { name: 'onSelect', type: '(person) => void', description: 'Fires when an avatar or a listed name is activated.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'neon-halo-card', title: 'Neon Halo Card', description: 'A card rimmed by a slow sweep of coloured light: a conic gradient travels a hairline edge while a soft bloom breathes behind it, and the pointer pulls a quiet spotlight across the surface. Restrained on light pages.', category: 'Cards', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Move across the card — the spotlight follows and the halo blooms.', props: [
    { name: 'colors', type: 'string[]', default: "['#a78bfa', '#f97316', '#f472b6', '#a78bfa']", description: '2–4 colours swept around the edge.' },
    { name: 'borderWidth', type: 'number', default: '1.5', description: 'Lit edge width in px (1–4).' },
    { name: 'radius', type: 'number', default: '24', description: 'Corner radius in px; the inner surface stays concentric.' },
    { name: 'glow', type: 'number', default: '0.6', description: 'Outer bloom strength, 0–1 (halved on light until hover).' },
    { name: 'speed', type: 'number', default: '7', description: 'Seconds per sweep; 0 stops it.' },
    { name: 'children', type: 'ReactNode', description: 'Card content. Defaults to a pricing card.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'horizon-grid-field', ownBackground: true, backgroundNote: 'Paints its own sky, horizon glow and perspective floor; dusk and mono palettes each have light and dark variants that follow the nearest .dark/.light scope.', title: 'Horizon Grid Field', description: 'A quiet perspective floor gliding toward you under a softly lit horizon. Hairline grid lines fade into haze, a low glow sits on the vanishing line and, in dark scopes, still stars hang above. Pure CSS 3D.', category: 'Animated Backgrounds', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Watch the floor glide; use the pause button in the corner.', props: [
    { name: 'palette', type: "'dusk' | 'mono'", default: "'dusk'", description: 'Lilac sky + warm horizon, or neutral graphite / paper.' },
    { name: 'cellSize', type: 'number', default: '56', description: 'Grid cell size in px (24–120).' },
    { name: 'angle', type: 'number', default: '74', description: 'Floor tilt in degrees (55–82).' },
    { name: 'speed', type: 'number', default: '1.6', description: 'Seconds to travel one cell; 0 freezes.' },
    { name: 'showControls', type: 'boolean', default: 'true', description: 'Show the Pause / Play control.' },
    { name: 'children', type: 'ReactNode', description: 'Content centred above the field.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root (size, radius).' },
  ] },
  { slug: 'flicker-dot-field', title: 'Flicker Dot Field', description: 'A calm LED-like matrix: each mark drifts between brightness levels on its own clock so the field shimmers without syncing, and marks near the pointer glow. Set flicker to 0 for a still dot pattern. Canvas 2D.', category: 'Animated Backgrounds', unique: true, isNew: true, dependencies: ['lucide-react'], gesture: 'Move the pointer through the field — nearby marks light up.', props: [
    { name: 'shape', type: "'square' | 'dot'", default: "'square'", description: 'LED squares or round dots.' },
    { name: 'size / spacing', type: 'number', default: '3 / 12', description: 'Mark size (1–8) and centre spacing (6–48) in px.' },
    { name: 'flicker', type: 'number', default: '0.5', description: 'Liveliness 0–1; 0 is a still pattern.' },
    { name: 'maxOpacity', type: 'number', default: '0.6', description: 'Brightest a mark gets.' },
    { name: 'color', type: 'string', description: 'Mark colour; defaults to lilac tuned per theme.' },
    { name: 'pointerGlow / vignette', type: 'boolean', default: 'true / true', description: 'Pointer brightening; radial edge fade.' },
    { name: 'showControls', type: 'boolean', default: 'true', description: 'Show the Pause / Play control.' },
    { name: 'theme', type: "'auto' | 'light' | 'dark'", default: "'auto'", description: 'Canvas palette; auto follows the nearest .dark/.light.' },
    { name: 'children', type: 'ReactNode', description: 'Content centred above the field.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'confetti-burst-button', title: 'Confetti Burst Button', description: 'A celebratory primary action: the label rolls to a check while a cone of paper confetti (or your own glyphs) bursts from the button with real drag, gravity and tumble. The canvas exists only while particles do.', category: 'Buttons', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Press it (or Enter / Space) to celebrate.', props: [
    { name: 'label / doneLabel', type: 'string', default: "'Mark as shipped' / 'Shipped'", description: 'Idle and done labels (done is announced).' },
    { name: 'colors', type: 'string[]', default: 'lilac, amber, mint, pink', description: 'Confetti colours.' },
    { name: 'count', type: 'number', default: '110', description: 'Particles per burst (12–220).' },
    { name: 'spread', type: 'number', default: '70', description: 'Cone width in degrees (20–360).' },
    { name: 'glyphs', type: 'string[]', description: "Throw glyphs or emoji instead of paper, e.g. ['✦', '❤']." },
    { name: 'resetAfter', type: 'number', default: '2600', description: 'ms before returning to idle; 0 stays done.' },
    { name: 'icon', type: 'ReactNode', description: 'Idle icon (defaults to a party popper).' },
    { name: 'onBurst', type: '() => void', description: 'Fires on press.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the button.' },
  ] },
  { slug: 'video-lightbox-dialog', title: 'Video Lightbox Dialog', description: 'A cinematic thumbnail with a clear-glass play button that grows into a focused player on a shared-layout spring while the page blurs back. Bring your own video, or use the generated preview with captions.', category: 'Cards', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Press play — the frame grows into a dialog; Esc or the close button returns.', props: [
    { name: 'videoSrc', type: 'string', description: 'Your video file. Without it a generated preview plays with captions.' },
    { name: 'posterSrc', type: 'string', description: 'Poster image; falls back to generated art.' },
    { name: 'title', type: 'string', default: "'Ship a release in 90 seconds'", description: 'Thumbnail caption and dialog title.' },
    { name: 'duration', type: 'string', default: 'preview length', description: 'Thumbnail duration chip.' },
    { name: 'captions', type: 'string[]', default: '4 lines', description: 'Caption lines for the generated preview.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Fires when the dialog opens or closes.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the thumbnail wrapper.' },
  ] },
  { slug: 'word-cycle-text', title: 'Word Cycle Text', description: 'A headline whose key word keeps changing its mind: each word rises letter by letter out of a soft blur inside a tinted capsule that resizes on a spring while the line glides to make room.', category: 'Text Animations', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Hover the line to hold a word; use the pause control below it.', props: [
    { name: 'prefix / suffix', type: 'string', default: "'Interfaces that feel' / ''", description: 'Static text around the rotating word.' },
    { name: 'words', type: 'string[]', default: "['inevitable', 'calm', 'alive', 'yours']", description: 'Words to cycle.' },
    { name: 'interval', type: 'number', default: '2600', description: 'ms per word (1200–10000).' },
    { name: 'as', type: "'h1' | 'h2' | 'h3' | 'p'", default: "'h2'", description: 'Element for the line.' },
    { name: 'pauseOnHover', type: 'boolean', default: 'true', description: 'Hold the current word while hovered.' },
    { name: 'showControls', type: 'boolean', default: 'true', description: 'Pause / Play control with a position counter.' },
    { name: 'onWordChange', type: '(word, index) => void', description: 'Fires on every change.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'highlight-marker-text', title: 'Highlight Marker Text', description: 'Editorial copy annotated by hand: as it scrolls into view a marker sweeps behind one phrase, an underline draws under the next, a pen circle loops another and a strike crosses one out, in sequence. Wraps across lines.', category: 'Text Animations', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Scroll the paragraph into view — the marks draw one after another.', props: [
    { name: 'segments', type: "(string | { text, mark?: 'highlight' | 'underline' | 'circle' | 'box' | 'strike', tone?: 'amber' | 'lilac' | 'mint' | 'rose' })[]", default: 'DEFAULT_SEGMENTS', description: 'Plain strings and marked phrases in reading order.' },
    { name: 'as', type: "'p' | 'h2' | 'h3' | 'blockquote'", default: "'p'", description: 'Element for the text.' },
    { name: 'stagger', type: 'number', default: '320', description: 'ms between marks.' },
    { name: 'once', type: 'boolean', default: 'true', description: 'Draw only on the first scroll-in.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the text.' },
  ] },
  { slug: 'velocity-marquee', title: 'Velocity Marquee', description: 'Oversized editorial rails that idle along, then answer your scroll: scroll faster and the rows speed up and lean into the motion; scroll back and they reverse. Solid and outline rows alternate.', category: 'Vertical Scroll', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Scroll the page quickly up and down — the rails speed up, lean and reverse.', props: [
    { name: 'rows', type: 'string[][]', default: 'DEFAULT_ROWS', description: 'One array of phrases per row.' },
    { name: 'baseVelocity', type: 'number', default: '3', description: 'Idle drift in % of one copy per second (0.5–12).' },
    { name: 'boost', type: 'number', default: '4', description: 'How strongly scroll speed boosts the drift (0–10).' },
    { name: 'scrollContainer', type: 'RefObject<HTMLElement>', description: 'Read velocity from this container instead of the window.' },
    { name: 'showControls', type: 'boolean', default: 'true', description: 'Pause / Play control.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'sparkle-text', title: 'Sparkle Text', description: 'A word that catches the light: four-point stars bloom and fade around it on staggered clocks while the letters carry a soft ink-to-accent gradient. Sparkles on scroll-in or hover, then rests.', category: 'Text Animations', unique: true, isNew: true, dependencies: ['motion'], gesture: 'Hover the word to make it sparkle again.', props: [
    { name: 'text', type: 'string', default: "'Delightful'", description: 'The text.' },
    { name: 'as', type: "'h1' | 'h2' | 'h3' | 'p' | 'span'", default: "'span'", description: 'Element to render.' },
    { name: 'colors', type: 'string[]', default: "['#8b74b5', '#f97316', '#c4b5fd']", description: 'Sparkle colours (cycled).' },
    { name: 'count', type: 'number', default: '10', description: 'Max sparkles alive at once (1–20).' },
    { name: 'restAfter', type: 'number', default: '6000', description: 'ms of sparkling before resting; 0 never rests.' },
    { name: 'gradient', type: 'boolean', default: 'true', description: 'Ink-to-accent gradient fill (AA in both themes).' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  // magic-batch:end
  // website-sections:start
  { slug: 'glass-app-dock', title: 'Glass App Dock', description: 'A macOS-style dock: icons magnify on a spring with a cosine falloff around the pointer, labels float above, launching bounces the icon and lights a running dot. Keyboard focus magnifies too.', category: 'Website Sections', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Sweep across the dock; click to launch; Tab and ← → by keyboard.', props: [
    { name: 'apps', type: 'DockApp[]', default: 'DEFAULT_DOCK_APPS', description: '{ id, label, icon, tint?, running?, separatorBefore? }' },
    { name: 'baseSize / maxSize', type: 'number', default: '44 / 76', description: 'Resting and peak icon size in px.' },
    { name: 'range', type: 'number', default: '150', description: 'Pointer distance over which neighbours magnify.' },
    { name: 'onLaunch', type: '(id) => void', default: '—', description: 'Fires when an icon is clicked.' },
  ] },
  { slug: 'spotlight-command-palette', title: 'Spotlight Command Palette', description: 'A cmdk-style ⌘K launcher: fuzzy grouped results, a highlight that springs between rows, nested pages (Backspace to go back), key-cap hints and full combobox semantics with focus restore.', category: 'Website Sections', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Click the chip or press ⌘/Ctrl J here (⌘ K by default in your app); type, ↑ ↓, Enter; open “Invite teammates” for a nested page.', props: [
    { name: 'items', type: 'PaletteItem[]', default: 'DEFAULT_PALETTE_ITEMS', description: '{ id, label, group, icon?, shortcut?, keywords?, children? }' },
    { name: 'open / defaultOpen / onOpenChange', type: 'boolean', default: 'false', description: 'Controlled or uncontrolled visibility.' },
    { name: 'hotkey', type: 'boolean', default: 'true', description: 'Register the global ⌘K / Ctrl+K shortcut.' },
    { name: 'hotkeyKey', type: 'string', default: "'k'", description: 'Letter paired with ⌘ / Ctrl.' },
    { name: 'onSelect', type: '(item) => void', default: '—', description: 'Fires when a leaf command runs.' },
  ] },
  { slug: 'activity-rings', title: 'Activity Rings', description: 'Apple Watch-style concentric progress rings: gradient strokes sweep in on a spring, overshooting 100% laps over itself with a shadowed tip, and the legend numbers roll up.', category: 'Website Sections', unique: true, isNew: true, ownBackground: true, backgroundNote: 'Paints its own ink watch-face disc in both themes (rings read best on black); the legend adapts with dark: variants.', dependencies: ['motion', 'lucide-react'], gesture: 'Watch the rings close; pass new values to animate.', props: [
    { name: 'rings', type: 'ActivityRing[]', default: 'Move / Exercise / Stand', description: '{ label, value, goal, unit, from, to, track }' },
    { name: 'size / stroke', type: 'number', default: '200 / 20', description: 'Diameter and stroke width in px.' },
    { name: 'showLegend', type: 'boolean', default: 'true', description: 'Show the numeric legend.' },
  ] },
  { slug: 'glass-mega-navbar', title: 'Glass Mega Navbar', description: 'A full-width bar that contracts into a floating glass pill on scroll. Menus open into one mega panel that slides between sections with a blur, a hover pill glides between triggers, and phones get a disclosure sheet.', category: 'Website Sections', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Scroll the frame to shrink the bar; hover or click Product / Resources; Esc closes.', props: [
    { name: 'items', type: 'NavItem[]', default: 'DEFAULT_NAV_ITEMS', description: '{ label, href?, links?, feature? }' },
    { name: 'shrinkAt', type: 'number', default: '24', description: 'Scroll px before the bar becomes a pill.' },
    { name: 'scrollContainer', type: 'RefObject<HTMLElement>', default: 'window', description: 'Element whose scroll drives the shrink.' },
    { name: 'brand / ctaLabel', type: 'ReactNode / string', default: '—', description: 'Logo and CTA copy.' },
  ] },
  { slug: 'pricing-plans', title: 'Pricing Plans', description: 'Three-tier pricing with a sliding monthly/yearly switch whose numerals roll digit by digit, a highlighted ink plan with a light rim, and a “you save” chip that springs in on yearly.', category: 'Website Sections', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Toggle Monthly / Yearly (or ← →) and watch the prices roll.', props: [
    { name: 'plans', type: 'Plan[]', default: 'DEFAULT_PLANS', description: '{ id, name, tagline, monthly, yearly, features, cta, highlighted?, badge? } — null price shows “Custom”.' },
    { name: 'billing / defaultBilling / onBillingChange', type: '\'monthly\' | \'yearly\'', default: '\'yearly\'', description: 'Controlled or uncontrolled period.' },
    { name: 'currency / yearlyNote', type: 'string', default: '\'$\' / \'Save 20%\'', description: 'Currency symbol and toggle chip.' },
    { name: 'onSelect', type: '(plan) => void', default: '—', description: 'CTA click.' },
  ] },
  { slug: 'faq-accordion', title: 'FAQ Accordion', description: 'A two-column FAQ: rows expand on a height spring, the plus rotates into a cross, the open row lifts onto a soft surface and answers un-blur in. ↑ ↓ Home End move between questions.', category: 'Website Sections', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Click a question or use ↑ ↓ and Enter.', props: [
    { name: 'items', type: 'FaqItem[]', default: 'DEFAULT_FAQ', description: '{ q, a }' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow several rows open.' },
    { name: 'defaultOpen', type: 'number[]', default: '[0]', description: 'Initially open rows.' },
    { name: 'title / aside', type: 'string / ReactNode', default: '—', description: 'Heading and side copy.' },
  ] },
  { slug: 'testimonial-wall', title: 'Testimonial Wall', description: 'A masonry wall of quote cards whose columns drift in opposite directions at different speeds, faded at the edges, with a pause button; reduced motion shows a static scrollable wall.', category: 'Website Sections', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Watch the columns drift; press pause to stop.', props: [
    { name: 'items', type: 'Testimonial[]', default: 'DEFAULT_TESTIMONIALS', description: '{ quote, name, role, hue? }' },
    { name: 'columns', type: '2 | 3', default: '3', description: 'Columns on desktop.' },
    { name: 'duration', type: 'number', default: '40', description: 'Seconds per loop.' },
    { name: 'height', type: 'number', default: '560', description: 'Wall height in px.' },
  ] },
  { slug: 'feature-comparison-table', title: 'Feature Comparison Table', description: 'A plan comparison table with a sticky header, collapsible groups, a tinted highlighted column, row hover and a one-plan-at-a-time switcher on phones. Real table semantics with screen-reader labels for ticks.', category: 'Website Sections', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Collapse a group; on phones pick a plan above the table.', props: [
    { name: 'plans', type: 'string[]', default: 'Hobby / Pro / Enterprise', description: 'Column headers.' },
    { name: 'highlight', type: 'number', default: '1', description: 'Highlighted column.' },
    { name: 'groups', type: 'CompareGroup[]', default: 'DEFAULT_COMPARE_GROUPS', description: '{ title, rows: { feature, hint?, values } }' },
  ] },
  { slug: 'cta-glow-banner', title: 'CTA Glow Banner', description: 'A closing call-to-action on an ink panel: a soft lilac and orange aurora trails the pointer behind a fine dot grid, the block rises in on scroll and the arrow nudges on hover.', category: 'Website Sections', unique: true, isNew: true, ownBackground: true, backgroundNote: 'Paints its own ink surface in both themes as a deliberate closing block; override with className (bg-*, rounded-*).', dependencies: ['motion', 'lucide-react'], gesture: 'Move across the banner; the glow follows.', props: [
    { name: 'eyebrow / title / description', type: 'string / ReactNode', default: '—', description: 'Copy.' },
    { name: 'primaryLabel / secondaryLabel', type: 'string', default: '\'Start for free\' / \'Talk to sales\'', description: 'Button labels.' },
    { name: 'onPrimary / onSecondary', type: '() => void', default: '—', description: 'Click handlers.' },
  ] },
  { slug: 'newsletter-signup', title: 'Newsletter Signup', description: 'An inline email capture with inline validation, a button that morphs to a spinner, a shake on error, a polite live region and a success state with undo.', category: 'Website Sections', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Submit an invalid email, then a real one; include “fail” to see the error.', props: [
    { name: 'onSubscribe', type: '(email) => Promise<void>', default: 'fake 1.2 s', description: 'Resolve for success, reject for error.' },
    { name: 'title / description / buttonLabel', type: 'string', default: '—', description: 'Copy.' },
  ] },
  { slug: 'site-footer', title: 'Site Footer', description: 'A calm SaaS footer: link columns with sliding hairline underlines, a live status pill, socials, a language picker and a giant outlined wordmark that rises from the bottom edge.', category: 'Website Sections', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Hover links; scroll the wordmark into view.', props: [
    { name: 'brand / tagline', type: 'string', default: 'Northwind', description: 'Wordmark and line.' },
    { name: 'columns', type: 'FooterColumn[]', default: 'DEFAULT_FOOTER_COLUMNS', description: '{ title, links: { label, href?, badge? } }' },
    { name: 'status', type: 'string | null', default: '\'All systems normal\'', description: 'Status pill; null hides it.' },
  ] },
  { slug: 'cookie-consent', title: 'Cookie Consent', description: 'A floating glass consent card with equal-weight Accept / Reject (no dark patterns) and a Customise drawer of per-category switches that expands in place, plus a chip to reopen settings.', category: 'Website Sections', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Try Customise, flip a switch, Save; reopen with the chip.', props: [
    { name: 'categories', type: 'ConsentCategory[]', default: 'necessary / analytics / marketing', description: '{ id, label, description, required?, defaultOn? }' },
    { name: 'open / defaultOpen', type: 'boolean', default: 'true', description: 'Controlled or uncontrolled.' },
    { name: 'onDecision', type: '(choice) => void', default: '—', description: 'Receives { [id]: boolean }.' },
    { name: 'showReopen', type: 'boolean', default: 'true', description: 'Show the settings chip after deciding.' },
  ] },
  { slug: 'announcement-bar', title: 'Announcement Bar', description: 'A slim ink top bar with a sweeping sheen; messages roll vertically with a blur, dots pick one, hover or focus pauses, and dismissing collapses the height smoothly.', category: 'Website Sections', unique: true, isNew: true, ownBackground: true, backgroundNote: 'Paints its own ink gradient in both themes (an announcement strip); override with className.', dependencies: ['motion', 'lucide-react'], gesture: 'Hover to pause, use the dots, or dismiss with ×.', props: [
    { name: 'messages', type: 'Announcement[]', default: 'DEFAULT_ANNOUNCEMENTS', description: '{ tag?, text, href?, cta? }' },
    { name: 'interval', type: 'number', default: '4500', description: 'ms per message.' },
    { name: 'dismissible / onDismiss', type: 'boolean / () => void', default: 'true', description: 'Show the close button.' },
  ] },
  { slug: 'changelog-timeline', title: 'Changelog Timeline', description: 'Release notes on a timeline with sticky dates, popping dots, generated cover art and a filter (All / New / Improved / Fixed) that re-flows each change list on springs.', category: 'Website Sections', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Pick a filter; scroll to reveal entries.', props: [
    { name: 'entries', type: 'ChangelogEntry[]', default: 'DEFAULT_CHANGELOG', description: '{ version, date, title, summary, changes: { type, text }[], art? }' },
  ] },
  { slug: 'scroll-product-reveal', title: 'Scroll Product Reveal', description: 'An Apple-style pinned product story: scroll scrubs a CSS 3D device through rotation, screen glow and an exploded-layer view while chapter copy cross-fades with a blur. Scrolls inside its own focusable frame.', category: 'Motion Showcase', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Scroll inside the frame (or focus it and use ↓ / Space).', props: [
    { name: 'chapters', type: 'RevealChapter[]', default: 'DEFAULT_CHAPTERS', description: '{ eyebrow, title, body }' },
    { name: 'height', type: 'number', default: '560', description: 'Scroll viewport height in px.' },
  ] },
  { slug: 'app-store-expand-card', title: 'App Store Expand Card', description: 'Story cards that grow into a full detail sheet with a shared-layout spring: art, headline and surface morph from the card, the body rises in behind. Esc or close collapses it and returns focus.', category: 'Motion Showcase', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Click a card; press Esc to collapse.', props: [
    { name: 'cards', type: 'StoryCard[]', default: 'DEFAULT_STORY_CARDS', description: '{ id, eyebrow, title, subtitle, body, from, to }' },
  ] },
  { slug: 'liquid-glass-tab-bar', title: 'Liquid Glass Tab Bar', description: 'An iOS 26-style floating glass tab bar: a refractive lens slides between tabs and stretches with distance like liquid, icons pop on select, plus a floating accessory button.', category: 'Motion Showcase', unique: true, isNew: true, ownBackground: true, backgroundNote: 'Sits on a colourful wallpaper so the glass has something to refract; pass className to change it.', dependencies: ['motion', 'lucide-react'], gesture: 'Tap tabs or use ← → Home End.', props: [
    { name: 'tabs', type: 'GlassTab[]', default: 'DEFAULT_GLASS_TABS', description: '{ id, label, icon }' },
    { name: 'value / defaultValue / onValueChange', type: 'string', default: "'home'", description: 'Controlled or uncontrolled.' },
    { name: 'showAction', type: 'boolean', default: 'true', description: 'Floating accessory button.' },
  ] },
  { slug: 'gradient-mesh-hero', title: 'Gradient Mesh Hero', description: 'A hero over four soft colour fields that drift on slow offset orbits and lean toward the pointer, with fine grain, a glass eyebrow pill and a blur-staggered headline.', category: 'Motion Showcase', unique: true, isNew: true, ownBackground: true, backgroundNote: 'Paints its own white/ink surface behind the mesh; override with className.', dependencies: ['motion', 'lucide-react'], gesture: 'Move the pointer across the hero.', props: [
    { name: 'eyebrow / title / description', type: 'string / ReactNode', default: '—', description: 'Copy.' },
    { name: 'primaryLabel / secondaryLabel / onPrimary / onSecondary', type: 'string / () => void', default: '—', description: 'CTAs.' },
    { name: 'colors', type: '[string, string, string, string]', default: 'indigo / pink / amber / cyan', description: 'Mesh colours.' },
  ] },
  { slug: 'morph-button-modal', title: 'Morph Button Modal', description: 'A pill button that physically becomes its dialog: the surface expands on a shared-layout spring, the label blurs into a form, and submit shrinks it back into a success pill. Focus trapped and restored.', category: 'Motion Showcase', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Click Invite, fill the form, Send; Esc closes.', props: [
    { name: 'label / title', type: 'string', default: "'Invite teammate'", description: 'Button and dialog copy.' },
    { name: 'onSubmit', type: '({ name, email }) => void', default: '—', description: 'Form submit.' },
  ] },
  { slug: 'kinetic-stats-band', title: 'Kinetic Stats Band', description: 'A band of big tabular numbers that count up on an expo curve when scrolled into view, with motion blur on the fast part and sparklines that draw themselves.', category: 'Motion Showcase', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Scroll it into view.', props: [
    { name: 'stats', type: 'KineticStat[]', default: 'DEFAULT_KINETIC_STATS', description: '{ value, prefix?, suffix?, decimals?, label, spark? }' },
    { name: 'duration', type: 'number', default: '1.8', description: 'Count duration in seconds.' },
  ] },
  { slug: 'parallax-depth-stack', title: 'Parallax Depth Stack', description: 'A fanned card stack on CSS 3D layers: the pointer tilts it and each layer parallaxes by depth with a moving sheen; click or Enter sends the front card to the back on a spring.', category: 'Motion Showcase', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Move over the stack; click to cycle.', props: [
    { name: 'cards', type: 'DepthCard[]', default: 'DEFAULT_DEPTH_CARDS', description: '{ title, meta, from, to }' },
  ] },
  { slug: 'spring-stagger-grid', title: 'Spring Stagger Grid', description: 'A filterable tile grid that enters on a diagonal ripple (delay = row + column), re-flows on layout springs when filtered and exits with a quick scale-down.', category: 'Motion Showcase', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Switch filters and watch the ripple.', props: [
    { name: 'items', type: 'StaggerItem[]', default: 'DEFAULT_STAGGER_ITEMS', description: '{ id, title, tag, hue }' },
    { name: 'tags', type: 'string[]', default: "['All', …]", description: 'Filter options.' },
  ] },
  { slug: 'magnetic-dot-grid', title: 'Magnetic Dot Grid', description: 'A canvas field of dots that lean toward the pointer on spring physics, swell and tint near it, then settle with a soft wobble; clicks send a ripple. Theme-aware, static on reduced motion.', category: 'Motion Showcase', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Move across the field; click for a ripple.', props: [
    { name: 'gap / radius / strength', type: 'number', default: '22 / 140 / 0.35', description: 'Dot spacing, influence radius, pull (negative repels).' },
    { name: 'height', type: 'number', default: '420', description: 'Height in px.' },
    { name: 'children', type: 'ReactNode', default: 'headline', description: 'Overlay content.' },
  ] },
  { slug: 'page-curtain-transition', title: 'Page Curtain Transition', description: 'Route changes play a staggered column curtain: panels sweep up to cover, the next page name flashes on the curtain, then they lift away to reveal it. Reduced motion cross-fades.', category: 'Motion Showcase', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Click Studio or Contact in the nav.', props: [
    { name: 'pages', type: 'CurtainPage[]', default: 'DEFAULT_CURTAIN_PAGES', description: '{ id, label, title, body, tint }' },
    { name: 'panels', type: 'number', default: '5', description: 'Curtain columns.' },
  ] },
  { slug: 'lit-product-card-3d', title: 'Lit Product Card 3D', description: 'A product card with real lighting: tilt follows the pointer, a specular highlight tracks the light while the cast shadow moves opposite, the product floats on its own Z layer and swatches recolour on a spring.', category: 'Motion Showcase', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Move over the card; pick a colour.', props: [
    { name: 'name / tagline / price', type: 'string', default: "'Aero Headphones'", description: 'Copy.' },
    { name: 'colors', type: '{ name, value }[]', default: 'Midnight / Sunset / Sage', description: 'Swatches.' },
    { name: 'onAdd', type: '(color) => void', default: '—', description: 'Add to bag.' },
  ] },
  { slug: 'timeline-scrubber', title: 'Timeline Scrubber', description: 'A media scrubber with a waveform that lights up behind the playhead, a thumb that grows while dragging, chapter markers that snap within 1.5 s, a time bubble and full slider keyboard support.', category: 'Motion Showcase', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Drag the waveform, or focus it and use ← → Space.', props: [
    { name: 'duration', type: 'number', default: '84', description: 'Length in seconds.' },
    { name: 'markers', type: 'ScrubMarker[]', default: 'DEFAULT_SCRUB_MARKERS', description: '{ at, label }' },
    { name: 'onTimeChange', type: '(t) => void', default: '—', description: 'Playhead change.' },
  ] },
  { slug: 'spring-reorder-list', title: 'Spring Reorder List', description: 'A priority list reordered by dragging the grip: the lifted row scales and deepens its shadow while siblings part on springs. Keyboard ↑ ↓ on a grip moves rows with live announcements.', category: 'Motion Showcase', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Drag a grip, or focus one and press ↑ / ↓.', props: [
    { name: 'items', type: 'ReorderItem[]', default: 'DEFAULT_REORDER_ITEMS', description: '{ id, title, meta, color }' },
    { name: 'onReorder', type: '(items) => void', default: '—', description: 'New order.' },
  ] },
  { slug: 'blur-cascade-heading', title: 'Blur Cascade Heading', description: 'A keynote-style display headline that resolves out of focus: words or letters rise through a mask from blur to sharp on springs, and highlight words land last in a gradient.', category: 'Motion Showcase', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Scroll it into view, or press Replay.', props: [
    { name: 'text / eyebrow', type: 'string', default: '—', description: 'Copy.' },
    { name: 'highlight', type: 'string[]', default: "['powerful', 'ever.']", description: 'Gradient words.' },
    { name: 'by / stagger', type: "'word' | 'char' / number", default: "'word' / 0.06", description: 'Split mode and delay.' },
    { name: 'replay', type: 'boolean', default: 'true', description: 'Show replay button.' },
  ] },
  // website-sections:end
  // Product UI
  { slug: 'glass-segmented-control', title: 'Glass Segmented Control', description: 'An iOS-style segmented control whose selected thumb is a lifted glass pill that springs between segments with a press squish — native radio semantics, arrow keys and an opaque reduced-transparency fallback.', category: 'Product UI', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Click a segment or focus it and use ← → Home End.', props: [
    { name: 'options', type: 'SegmentOption[]', default: 'DEFAULT_SEGMENTS', description: '{ value, label, icon?, disabled? } per segment.' },
    { name: 'value / defaultValue / onValueChange', type: 'string', default: 'first option', description: 'Controlled or uncontrolled selection.' },
    { name: 'label', type: 'string', default: '\'Time range\'', description: 'Accessible name of the radio group.' },
    { name: 'size', type: '\'sm\' | \'md\'', default: '\'md\'', description: '32 or 40 px tall (44 px on touch).' },
    { name: 'fullWidth / disabled', type: 'boolean', default: 'false', description: 'Stretch to the container; disable the whole control.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'dynamic-status-island', title: 'Dynamic Status Island', description: 'A black capsule that morphs its silhouette between live activities — recording with a level meter, a focus timer with pause, an upload with a progress hairline, a success tick — size and radius on one crisp spring while content cross-fades with a little blur.', category: 'Product UI', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Pick a state under the island; pause the timer from inside it.', props: [
    { name: 'state / defaultState / onStateChange', type: '\'idle\' | \'recording\' | \'timer\' | \'uploading\' | \'success\'', default: '\'idle\'', description: 'Controlled or uncontrolled activity.' },
    { name: 'progress', type: 'number (0–1)', default: 'auto', description: 'Upload progress; auto-advances to success when omitted.' },
    { name: 'idleLabel / fileName', type: 'string', description: 'Copy for the idle and upload states.' },
    { name: 'showControls', type: 'boolean', default: 'true', description: 'Render the state picker under the island.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'detent-sheet', title: 'Detent Sheet', description: 'An Apple-style bottom sheet resting at peek, half and full detents — velocity-aware drag with rubber-banding, the background recedes and dims as it rises, and a grabber that also works with tap and ↑ ↓. Esc closes and focus returns to the trigger.', category: 'Product UI', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Drag the grabber, tap it to step up, or focus it and press ↑ ↓; Esc closes.', props: [
    { name: 'open / defaultOpen / onOpenChange', type: 'boolean', default: 'true', description: 'Controlled or uncontrolled visibility.' },
    { name: 'detent / defaultDetent / onDetentChange', type: '\'peek\' | \'half\' | \'full\'', default: '\'half\'', description: 'Controlled or uncontrolled detent.' },
    { name: 'detents', type: 'Record<SheetDetent, number>', default: '{ peek: .28, half: .55, full: .92 }', description: 'Visible fraction of the frame per detent.' },
    { name: 'title / children', type: 'string / ReactNode', description: 'Sheet heading and body (defaults to a place card).' },
    { name: 'triggerLabel / frameHeight / backdrop', type: 'string / number / ReactNode', default: '\'Show place\' / 560', description: 'Trigger text, frame height, and content behind the sheet.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the frame.' },
  ] },
  { slug: 'vibrancy-context-menu', title: 'Vibrancy Context Menu', description: 'A macOS-grade context menu on regular glass that blooms from the exact pointer position, flips near the edges, glides a highlight capsule between rows, and blinks the chosen item once before dissolving.', category: 'Product UI', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Right-click or long-press the file; or focus it and press Shift+F10, then ↑ ↓, type to jump, Enter.', props: [
    { name: 'items', type: 'ContextMenuItem[]', default: 'DEFAULT_CONTEXT_ITEMS', description: '{ id, label, icon?, shortcut?, destructive?, disabled?, checked?, onSelect? } or { type: \'separator\' }.' },
    { name: 'onSelect', type: '(id: string) => void', description: 'Fires after an item is chosen.' },
    { name: 'children', type: 'ReactNode', default: 'file card', description: 'The area that listens for right-click / long-press.' },
    { name: 'label', type: 'string', default: '\'File actions\'', description: 'Accessible name of the menu.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the target area.' },
  ] },
  { slug: 'deploy-timeline', title: 'Deploy Timeline', description: 'A build pipeline that reads like a calm status page: dots resolve to spinners to ticks, the rail fills as steps complete, elapsed times tick in tabular figures, each row expands into logs, and failures stop the rail in rose with a one-click retry.', category: 'Product UI', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Watch it build; expand a step for logs; Retry build after the failure.', props: [
    { name: 'steps', type: 'DeployStep[]', default: 'DEFAULT_DEPLOY_STEPS', description: '{ id, label, detail?, logs?, duration? } in order.' },
    { name: 'autoPlay', type: 'boolean', default: 'true', description: 'Run the simulated pipeline on mount.' },
    { name: 'failAt', type: 'number', default: '3', description: 'Step that fails on the first run (-1 never fails).' },
    { name: 'commit / branch', type: 'string', description: 'Header copy.' },
    { name: 'onComplete', type: '(result: \'ready\' | \'error\') => void', description: 'Fires when the pipeline ends.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the card.' },
  ] },
  { slug: 'usage-quota-meter', title: 'Usage Quota Meter', description: 'A billing-period usage card: hairline tracks fill with stacked segments on the house ease, figures count up in tabular numerals, a limit tick marks 100%, and bars go amber near the limit and rose when exceeded — always with a text label.', category: 'Product UI', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Scroll it into view; hover or focus a row for its breakdown.', props: [
    { name: 'resources', type: 'UsageResource[]', default: 'DEFAULT_USAGE', description: '{ id, label, unit, limit, segments: { label, value }[], decimals? }.' },
    { name: 'period', type: 'string', default: '\'Oct 1 – Oct 31\'', description: 'Billing period label.' },
    { name: 'warnAt', type: 'number', default: '0.8', description: 'Fraction at which a bar turns amber.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Skeleton that mirrors the final layout.' },
    { name: 'onUpgrade / titleAs', type: '() => void / h2–h4', default: '\'h3\'', description: 'Upgrade action and heading level.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the card.' },
  ] },
  { slug: 'onboarding-stepper', title: 'Onboarding Stepper', description: 'A three-question setup flow on one continuous surface: a progress capsule stretches into the current step with a shared-layout spring, panels slide in the direction of travel, validation speaks inline, and the finish holds its label with a spinner before landing on a tick.', category: 'Product UI', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Type a workspace name, press Enter, pick a role, add emails (try a typo).', props: [
    { name: 'defaultValues', type: 'Partial<{ workspace, role, invites }>', description: 'Initial values.' },
    { name: 'onComplete', type: '(data) => void | Promise<void>', description: 'Submit handler; a rejected promise shows the error state.' },
    { name: 'step / defaultStep / onStepChange', type: 'number', default: '0', description: 'Controlled or uncontrolled step (0–3).' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the card.' },
  ] },
  { slug: 'sortable-data-table', title: 'Sortable Data Table', description: 'A dense, quiet deployments table: sortable headers with aria-sort, search and status filter chips, rows that glide to their new order, hairline hover and selected tints, a bulk-action bar that springs up on selection, and designed loading and empty states.', category: 'Product UI', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Sort a column, filter by status, search “main”, tick a few rows.', props: [
    { name: 'rows', type: 'TableRow[]', default: 'DEFAULT_TABLE_ROWS', description: '{ id, name, branch, status, duration, author, ago }.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Skeleton rows that mirror the layout.' },
    { name: 'onSelectionChange', type: '(ids: string[]) => void', description: 'Fires when the selection changes.' },
    { name: 'caption', type: 'string', default: '\'Recent deployments\'', description: 'Accessible table caption.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the card.' },
  ] },
  { slug: 'date-range-picker', title: 'Date Range Picker', description: 'A calendar that previews the range as you hover with a continuous tinted band between endpoint pills, month pages that slide in the direction you move, preset chips, full grid keyboard support and a live summary.', category: 'Product UI', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Click a start and end day, try a preset, or use arrows / PageUp / PageDown.', props: [
    { name: 'value / defaultValue / onValueChange', type: '{ from: Date | null; to: Date | null }', default: 'last week', description: 'Controlled or uncontrolled range.' },
    { name: 'today', type: 'Date', default: 'new Date()', description: 'Reference day.' },
    { name: 'disableFuture / presets', type: 'boolean', default: 'true', description: 'Block future days; show preset chips.' },
    { name: 'locale', type: 'string', default: 'browser', description: 'BCP 47 locale for labels.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the card.' },
  ] },
  { slug: 'feedback-state-panel', title: 'Feedback State Panel', description: 'One surface for the screens nobody designs — empty, error, offline, permission and success — each with its own glyph and motion character, copy that names the next step, and a primary action with a real loading → success / error loop.', category: 'Product UI', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Switch states below; press Try again on the error state.', props: [
    { name: 'variant / defaultVariant / onVariantChange', type: '\'empty\' | \'error\' | \'offline\' | \'permission\' | \'success\'', default: '\'empty\'', description: 'Controlled or uncontrolled state.' },
    { name: 'title / description / primaryLabel / secondaryLabel', type: 'string', description: 'Override the copy for the current state.' },
    { name: 'onPrimary', type: '(variant) => void | Promise<void>', description: 'Primary action; promise drives the loading state.' },
    { name: 'onSecondary', type: '() => void', description: 'Secondary action.' },
    { name: 'showSwitcher / titleAs', type: 'boolean / h2–h4', default: 'false / \'h3\'', description: 'Render the state switcher; heading level.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'kbd-shortcut-hint', title: 'Keyboard Shortcut Hint', description: 'A cheat sheet of tactile keycaps that knows your platform (⌘ ⌥ ⇧ vs Ctrl Alt Shift); hold real keys and matching caps sink and light up, complete a combo and its row confirms. Exports Kbd for inline hints.', category: 'Product UI', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Hold ⇧ or ⌘ / Ctrl and watch the caps; press Esc or ⇧ ?.', props: [
    { name: 'shortcuts', type: 'Shortcut[]', default: 'DEFAULT_SHORTCUTS', description: '{ id, label, keys: [\'mod\', \'k\'], group? } — \'mod\' is ⌘ or Ctrl.' },
    { name: 'platform', type: '\'auto\' | \'mac\' | \'other\'', default: '\'auto\'', description: 'Glyph set.' },
    { name: 'listen', type: 'boolean', default: 'true', description: 'Light caps from real key presses.' },
    { name: 'onTrigger / title', type: '(s) => void / string', default: '\'Keyboard shortcuts\'', description: 'Combo callback; heading (\'\' hides).' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the card.' },
  ] },
  { slug: 'inset-settings-list', title: 'Inset Settings List', description: 'An iOS-style grouped inset list with tinted icon tiles, hairlines inset to the label edge, switches whose knob stretches on press, and choice rows that push a detail page with a parallax slide and return focus on Back.', category: 'Product UI', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Flip a switch; open Appearance and pick a value, then go Back.', props: [
    { name: 'sections', type: 'SettingsSection[]', default: 'DEFAULT_SETTINGS', description: '{ id, header?, footer?, rows } with toggle, choice and info rows.' },
    { name: 'onChange', type: '(id, value: boolean | string) => void', description: 'Fires on any toggle or choice.' },
    { name: 'title', type: 'string', default: '\'Settings\'', description: 'Root page title.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the frame.' },
  ] },
  { slug: 'rolling-number-stepper', title: 'Rolling Number Stepper', description: 'A quantity field whose changed digits roll in the direction of travel, accelerates on press-and-hold like a hardware stepper, and nudges sideways with a reason at its bounds. A real spinbutton you can type into.', category: 'Product UI', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Press and hold +; use ↑ ↓, PageUp/PageDown, Home/End, or type a number.', props: [
    { name: 'value / defaultValue / onValueChange', type: 'number', default: '8', description: 'Controlled or uncontrolled value.' },
    { name: 'min / max / step', type: 'number', default: '1 / 250 / 1', description: 'Bounds and increment.' },
    { name: 'label / hint / unit', type: 'string', default: '\'Seats\'', description: 'Visible label, helper text and unit.' },
    { name: 'format', type: '(n) => string', default: 'toLocaleString', description: 'Display formatting.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'file-drop-uploader', title: 'File Drop Uploader', description: 'A calm dropzone that lifts and tints on drag-over, then gives each file its own row with a spring progress hairline, a tick that pops on completion, and errors that say what went wrong with one-tap retry.', category: 'Product UI', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Drop files or click to browse; remove a row with ×.', props: [
    { name: 'maxSize / accept', type: 'number / string', default: '25 MB', description: 'Per-file limit and accepted types.' },
    { name: 'upload', type: '(file, onProgress) => Promise<void>', default: 'simulation', description: 'Real uploader; reject to mark a failure.' },
    { name: 'defaultItems / onItemsChange', type: 'UploadItem[]', default: 'SAMPLE_UPLOADS', description: 'Seed rows and change callback.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the dropzone.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'glow-candle-card', title: 'Glow Candle Card', description: 'An ink “Sales Report” card with monospaced rolling numerals, a neon delta and a glowing candlestick chart: candles grow from their midpoints, new ones stream in live and a crosshair shows OHLC on hover or ← →.', category: 'Data Widgets', unique: true, isNew: true, ownBackground: true, backgroundNote: 'Ink card that stays dark in both themes (neon reads best on black); every text pair meets AA on #050505.', dependencies: ['motion', 'lucide-react'], gesture: 'Hover the chart or focus it and press ← →.', props: [
    { name: 'candles', type: 'Candle[]', default: 'generated', description: '{ o, h, l, c, label? } — passing data turns off the live stream.' },
    { name: 'value / delta / subValue', type: 'number / number / string', default: '9134 / 2.5 / “$185,301”', description: 'Headline figures.' },
    { name: 'liveMs', type: 'number', default: '2600', description: 'Stream interval; 0 disables.' },
    { name: 'accent', type: 'string', default: '\'#4dff9a\'', description: 'Neon hue.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'glow-level-card', title: 'Glow Level Card', description: 'The ink stat card with segmented neon level meters: segments light left to right with a bloom, levels re-balance live, and hovering or focusing a row reveals its channel and share.', category: 'Data Widgets', unique: true, isNew: true, ownBackground: true, backgroundNote: 'Ink card that stays dark in both themes (neon reads best on black); every text pair meets AA on #050505.', dependencies: ['motion', 'lucide-react'], gesture: 'Hover or Tab through the rows.', props: [
    { name: 'rows', type: 'LevelRow[]', default: '4 channels', description: '{ label, level }' },
    { name: 'segments', type: 'number', default: '6', description: 'Segments per row.' },
    { name: 'liveMs', type: 'number', default: '3200', description: 'Re-balance interval; 0 disables.' },
    { name: 'accent', type: 'string', default: '\'#7dff6a\'', description: 'Neon hue.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'glow-histogram-card', title: 'Glow Histogram Card', description: 'A neon gradient histogram beside the ink stat card: bars rise on a soft spring with glowing caps that fade into the card, values drift live and hover / ← → lifts a bar with its value.', category: 'Data Widgets', unique: true, isNew: true, ownBackground: true, backgroundNote: 'Ink card that stays dark in both themes (neon reads best on black); every text pair meets AA on #050505.', dependencies: ['motion', 'lucide-react'], gesture: 'Hover the bars or focus and press ← →.', props: [
    { name: 'bins', type: 'HistogramBin[]', default: '8 days', description: '{ label, value }' },
    { name: 'liveMs', type: 'number', default: '2800', description: 'Drift interval; 0 disables.' },
    { name: 'accent', type: 'string', default: '\'#5bff7a\'', description: 'Neon hue.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'budget-area-card', title: 'Budget Area Card', description: 'A soft white squircle with a big rolling total, a delta pill and floating soft-3D banknotes. An indigo stepped area chart draws itself in with drifting sparkles and an end arrow, and a tooltip bubble springs between points.', category: 'Data Widgets', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Hover or drag across the chart, or focus it and press ← →.', props: [
    { name: 'total / change / currency', type: 'number / number / string', default: '30739 / 317 / \'$\'', description: 'Headline figures.' },
    { name: 'points', type: 'BudgetPoint[]', default: 'Sun–Sat', description: '{ label, value }' },
    { name: 'defaultActive', type: 'number', default: '3', description: 'Point highlighted at rest.' },
    { name: 'showIllustration', type: 'boolean', default: 'true', description: 'Soft-3D banknote stack.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'pastel-object-carousel', title: 'Pastel Object Carousel', description: 'A cover-flow of pastel portrait cards with floating caption panels. A heavily damped spring carries drags; neighbours tuck behind at 85%, and each layered CSS-3D object (coins, calendar, key, lock, card) turns on Y with its card’s position.', category: 'Data Widgets', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Drag the cards, use ← → when focused, or tap the dots.', props: [
    { name: 'slides', type: 'PastelSlide[]', default: '5 slides', description: '{ id, title, caption, object: \'coins\'|\'calendar\'|\'key\'|\'lock\'|\'card\', from, to }' },
    { name: 'defaultIndex', type: 'number', default: '1', description: 'Starting slide.' },
    { name: 'onAdd / onIndexChange', type: '(slide) => void / (i) => void', default: '—', description: 'Plus button and slide callbacks.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'sparkline-kpi-tile', title: 'Sparkline KPI Tile', description: 'A compact metric tile with a live dot, rolling numerals, a delta chip and a smooth sparkline that draws in, streams new points and shows a crosshair value on hover or ← →.', category: 'Data Widgets', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Hover the sparkline, or focus it and press ← →.', props: [
    { name: 'label / value / delta', type: 'string / number / number', default: 'Active users', description: 'Headline metric.' },
    { name: 'data', type: 'number[]', default: 'generated', description: '0–100 series; passing data stops the live stream.' },
    { name: 'liveMs', type: 'number', default: '2400', description: 'Stream interval.' },
    { name: 'color', type: 'string', default: '\'#7c5cff\'', description: 'Line hue.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'spend-donut-card', title: 'Spend Donut Card', description: 'A radial spend breakdown whose rounded arcs sweep in one after another; hovering or focusing a category pops its arc outward and rolls the centre total to that amount.', category: 'Data Widgets', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Hover the arcs or Tab through the legend.', props: [
    { name: 'slices', type: 'SpendSlice[]', default: '5 categories', description: '{ label, value, color }' },
    { name: 'title / currency', type: 'string', default: 'Spending · October / $', description: 'Header and currency.' },
    { name: 'size', type: 'number', default: '180', description: 'Donut diameter.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'contribution-heatmap-tile', title: 'Contribution Heatmap Tile', description: 'A weeks × days activity heatmap: cells pop in on a diagonal wave, the total and streak roll up, and the grid is one roving tab stop where arrows move a ring that announces the day.', category: 'Data Widgets', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Hover cells, or focus the grid and use the arrow keys.', props: [
    { name: 'values', type: 'number[][]', default: '16 weeks', description: 'values[week][day], 0–4.' },
    { name: 'weeks', type: 'number', default: '16', description: 'Generated weeks when no values.' },
    { name: 'unit / color', type: 'string', default: 'sessions / \'#22c55e\'', description: 'Unit label and scale hue.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'wallet-balance-card', title: 'Wallet Balance Card', description: 'A fanned stack of payment cards: picking one springs it to the front while the rest tuck behind, the balance rolls to the new amount and an eye toggle blurs the figures.', category: 'Data Widgets', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Click a card behind to bring it forward; toggle the eye.', props: [
    { name: 'cards', type: 'WalletCard[]', default: '3 cards', description: '{ id, name, last4, balance, from, to }' },
    { name: 'currency / defaultIndex', type: 'string / number', default: '\'$\' / 0', description: 'Currency and starting card.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'crypto-ticker-row', title: 'Crypto Ticker Row', description: 'A watchlist with live prices: each tick flashes the price green or red and fades back, mini sparklines morph to the new history and every row is a labelled button.', category: 'Data Widgets', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Watch the prices tick; click a row.', props: [
    { name: 'assets', type: 'TickerAsset[]', default: 'BTC / ETH / SOL / ADA', description: '{ symbol, name, price, change, color, history? }' },
    { name: 'liveMs', type: 'number', default: '1800', description: 'Tick interval; 0 disables.' },
    { name: 'onSelect', type: '(asset) => void', default: '—', description: 'Row click.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'goal-progress-card', title: 'Goal Progress Card', description: 'A savings goal with a liquid progress bar: topping up springs the fill forward under a moving sheen, milestone ticks light as they pass and reaching the goal morphs the button into a check.', category: 'Data Widgets', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Press “Add $250” until the goal is reached.', props: [
    { name: 'title / emoji', type: 'string', default: 'Trip to Kyoto / 🗻', description: 'Goal label.' },
    { name: 'saved / goal / step', type: 'number', default: '2150 / 4000 / 250', description: 'Amounts.' },
    { name: 'milestones', type: 'number[]', default: '[0.25, 0.5, 0.75]', description: 'Tick positions (0–1).' },
    { name: 'onChange', type: '(saved) => void', default: '—', description: 'Called on top-up.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'comparison-bar-card', title: 'Comparison Bar Card', description: 'This period vs last as paired bars: a segmented control slides a pill between Week, Month and Year while bars re-grow on a spring, and hovering or focusing a pair lifts it with both values.', category: 'Data Widgets', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Switch the range (← → in the control); hover or Tab the bars.', props: [
    { name: 'ranges', type: 'Record<string, ComparisonSeries[]>', default: 'Week / Month / Year', description: '{ label, current, previous }' },
    { name: 'defaultRange', type: 'string', default: '\'Week\'', description: 'Starting range.' },
    { name: 'title / currency', type: 'string', default: 'Revenue / \'$\'', description: 'Header and currency.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
  { slug: 'smart-widget-stack', title: 'Smart Widget Stack', description: 'An iOS-style widget stack: the top widget sits at full size with the next ones peeking above; scroll, swipe vertically, use ↑ ↓ or the side dots to flip through on a damped spring while content re-animates on arrival.', category: 'Data Widgets', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Scroll or swipe on the stack, press ↑ ↓, or click the dots.', props: [
    { name: 'widgets', type: 'StackWidget[]', default: 'Balance / Steps / Spend / Bill', description: '{ id, label, tint, render }' },
    { name: 'defaultIndex', type: 'number', default: '0', description: 'Starting widget.' },
    { name: 'autoMs', type: 'number', default: '0', description: 'Idle auto-rotation; pauses on hover and focus.' },
    { name: 'className', type: 'string', description: 'Extra classes merged onto the root.' },
  ] },
]

export const gettingStarted = DOCS.filter((d) => d.category === 'Getting Started')
export const componentDocs = DOCS.filter((d) => d.category !== 'Getting Started')

export function getDoc(slug: string) {
  return DOCS.find((d) => d.slug === slug)
}

const NAV_ORDER: DocCategory[] = [
  'Getting Started',
  'Hero',
  'Portfolio',
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
  'Inputs / Forms',
  'Product UI',
  'Website Sections',
  'Motion Showcase',
  'Data Widgets',
  'Core',
]

export function getNavGroups() {
  return NAV_ORDER.map((title) => ({
    title,
    items: DOCS.filter((d) => d.category === title),
  })).filter((g) => g.items.length > 0)
}

/* ---------- Docs-shell helpers (category pages, prev/next, search) ---------- */

export function categorySlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function getCategoryBySlug(slug: string): DocCategory | undefined {
  return NAV_ORDER.find((c) => categorySlug(c) === slug)
}

/** Flat reading order that matches the sidebar (used by prev / next links). */
export function getDocsInNavOrder() {
  return getNavGroups().flatMap((g) => g.items)
}

export function getPrevNext(slug: string) {
  const all = getDocsInNavOrder()
  const i = all.findIndex((d) => d.slug === slug)
  if (i < 0) return { prev: undefined, next: undefined }
  return { prev: all[i - 1], next: all[i + 1] }
}
