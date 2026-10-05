---
name: design-system-foundations
description: >-
  Use this when defining or auditing a component library's foundations: design tokens, theming/dark mode, naming, color, type scale, spacing, grid, responsive rules, component specs, docs templates, icons, motion tokens or localization/RTL.
---
# Design system foundations

Companion to `premium-ui-motion-craft` (which owns the look/feel, spring motion recipes and the ship checklist); this skill supplies the generic reference material beneath it. Cross-references to skill names not listed below point to the upstream pack and can be ignored. Where numbers conflict (e.g. durations/easing), prefer the premium-ui-motion-craft values for Framekit and treat these as sane defaults.

## Tokens, theming & naming

### design-token
_Source scope: Define and organise tokens for colour, spacing, type, and elevation with naming and usage rules. Use when establishing the token layer. For auditing existing usage use `design-token-audit` (designer-toolkit); for multi-brand mapping use `theming-system`._

You are an expert in design token architecture and systematic design foundations.
#### What You Do
You help define, organize, and document design tokens — the atomic values that drive visual consistency. You understand token taxonomies, naming hierarchies, and cross-platform mapping.
#### Token Categories
- **Color**: Global palette, alias tokens (surface, text, border), component tokens
- **Spacing**: Base unit (4px/8px), scale (xs through 3xl), contextual (inset, stack, inline)
- **Typography**: Font families, size scale, weights, line heights
- **Elevation**: Shadow levels, z-index scale
- **Border**: Radius scale, width scale, style options
- **Motion**: Duration scale, easing functions
#### Token Tiers
1. **Global tokens** — Raw values (e.g., blue-500: #3B82F6)
2. **Alias tokens** — Semantic references (e.g., color-action-primary)
3. **Component tokens** — Scoped usage (e.g., button-color-primary)
#### Naming Convention
Pattern: {category}-{property}-{variant}-{state}
#### Best Practices
- Start with global tokens, then create semantic aliases
- Never reference raw values in components
- Document each token with usage context
- Version tokens alongside your design system
- Support theming by keeping alias tokens abstract

### theming-system
_Source scope: Design theming architecture — brand variants, dark mode, and high-contrast — mapped through token layers. Use when one system must serve multiple themes. For a single palette use `color-system` (ui-design); for dark mode craft use `dark-mode-design` (ui-design)._

You are an expert in flexible theming architectures for multi-brand, multi-mode design systems.
#### What You Do
You design theming systems allowing one component library to support multiple visual themes through token mapping.
#### Architecture
- **Layer 1**: Global tokens (raw palette)
- **Layer 2**: Semantic tokens (purpose-driven aliases) — themes override here
- **Layer 3**: Component tokens (scoped)
#### Theme Types
- Color modes: light, dark, high contrast, dimmed
- Brand themes: primary, sub-brands, white-label, seasonal
- Density: comfortable, compact, spacious
#### Dark Mode Considerations
- Don't just invert — reduce brightness thoughtfully
- Use lighter surfaces for elevation (not shadows)
- Desaturate colors for dark backgrounds
- Test text legibility carefully
- Provide image/illustration variants
#### Implementation
CSS custom properties, token files per theme, Figma variable modes, runtime switching.
#### Best Practices
- Tokens-first: themes emerge from overrides
- Test every component in every theme
- Respect OS theme preferences
- Document themeable vs fixed tokens

### naming-convention
_Source scope: Establish naming rules for components, tokens, and layers with patterns and worked examples. Use when names are inconsistent or being set. For what the tokens actually contain, use `design-token`._

You are an expert in creating clear, scalable naming systems for design assets, components, and tokens.
#### What You Do
You establish naming conventions that make design systems predictable, searchable, and maintainable.
#### Principles
1. Predictable 2. Consistent 3. Scalable 4. Scannable 5. Unambiguous
#### Patterns
- **Components**: [category]/[name]/[variant]/[state]
- **Tokens**: {category}-{property}-{concept}-{variant}-{state}
- **Files**: [type]-[name]-[variant].[ext]
- **Design files**: Numbered + descriptive pages, PascalCase components
- **Code**: kebab-case CSS, PascalCase React, camelCase props
- **Assets**: icon-[name]-[size], illust-[scene]-[variant]
#### Common Pitfalls
- Abbreviations only the author understands
- Inconsistent separators
- Names based on visual properties instead of purpose
#### Best Practices
- Document rules in a single reference page
- Automate name linting
- Use prefixes for sorting and grouping
- Review names in team critiques

### design-token-audit
_Source scope: Audit token usage across a product for coverage, drift, and hard-coded values. Use when tokens exist and you suspect they are being bypassed. For defining tokens in the first place, use `design-token` (design-systems)._

You are an expert in auditing design token adoption and consistency across products.
#### What You Do
You audit how design tokens are used (or not used) in a product, identifying inconsistencies, gaps, and hard-coded values.
#### Audit Scope
##### Token Coverage
- What percentage of visual properties use tokens?
- Which properties are commonly hard-coded?
- Are the right tier of tokens used (global vs semantic vs component)?
##### Token Consistency
- Are the same tokens used for the same purposes?
- Are there redundant tokens (different names, same value)?
- Are deprecated tokens still in use?
##### Token Gaps
- Are there visual values that should be tokens but are not?
- Are there use cases not covered by the existing token set?
- Do custom values suggest missing token scale steps?
#### Audit Process
1. **Inventory** — Extract all visual values from code/design files
2. **Categorize** — Group by type (color, spacing, typography, etc.)
3. **Map** — Match values to existing tokens
4. **Flag** — Identify hard-coded values, mismatches, and gaps
5. **Prioritize** — Rank issues by frequency and impact
6. **Recommend** — Suggest new tokens, migrations, and cleanup
#### Audit Report Format
- Executive summary (token adoption percentage, key findings)
- Detailed findings by category
- Hard-coded value inventory with suggested token replacements
- Recommended new tokens
- Migration plan and priority
#### Best Practices
- Audit both design files and code
- Automate detection where possible (lint rules)
- Focus on high-impact categories first (color, spacing)
- Track adoption over time
- Make the audit results actionable, not just informational

## Visual foundations

### color-system
_Source scope: Build a product colour system — tonal scales, semantic roles, and contrast compliance. Use when defining or rebuilding colour from scratch. For dark-mode adaptation use `dark-mode-design`; for chart palettes use `data-visualization`; for multi-brand token architecture use `theming-system` (design-systems)._

You are an expert in building systematic, accessible color palettes for digital products.
#### What You Do
You create comprehensive color systems with raw palettes, semantic mapping, and accessibility compliance.
#### Color System Layers
##### 1. Brand Palette
Primary, secondary, and accent colors with full tonal scales (50-950 or equivalent).
##### 2. Neutral Palette
Gray scale for text, backgrounds, borders, and surfaces.
##### 3. Semantic Colors
- Success (green), warning (amber), error (red), info (blue)
- Each with background, foreground, border, and icon variants
##### 4. Extended Palette
Data visualization colors, illustration colors, gradient definitions.
#### Accessibility Requirements
- Text on backgrounds: minimum 4.5:1 contrast (AA) or 7:1 (AAA)
- Large text: minimum 3:1
- UI components: minimum 3:1 against adjacent colors
- Don't rely on color alone to convey meaning
#### Color Relationships
- Tint/shade scales for each hue
- Complementary pairs for contrast
- Analogous sets for harmony
- Neutral pairings for text/surface combinations
#### Best Practices
- Generate full tonal scales, not just single swatches
- Test every foreground/background combination for contrast
- Provide usage guidance for each color
- Design for color blindness (test with simulators)
- Include dark mode mappings from the start

### dark-mode-design
_Source scope: Adapt an existing palette to dark mode — surface elevation, contrast rebalancing, and desaturation rules. Use when you already have a light palette to translate. For building the base palette first, use `color-system`._

You are an expert in designing dark mode interfaces that are comfortable, accessible, and polished.
#### What You Do
You design dark mode experiences that go beyond simple color inversion.
#### Core Principles
- Reduce overall luminance to decrease eye strain
- Use surface elevation through lighter shades (not shadows)
- Desaturate bright colors for dark backgrounds
- Maintain sufficient contrast for readability
#### Surface Hierarchy (Dark Mode)
- Background: darkest (e.g., #121212)
- Surface 1: slightly lighter (elevated cards)
- Surface 2: lighter again (modals, dropdowns)
- Surface 3: lightest dark (tooltips, menus)
#### Color Adaptation
- Primary colors: reduce saturation 10-20%
- Error/warning: adjust for dark background contrast
- Text: off-white (#E0E0E0) not pure white (#FFFFFF)
- Borders: subtle, low-opacity white
#### Images and Media
- Consider dimming images slightly
- Provide dark-variant illustrations
- Logos may need light-on-dark versions
- Avoid large bright areas in imagery
#### Accessibility in Dark Mode
- Minimum 4.5:1 contrast for body text
- Test with screen readers (mode announcements)
- Respect prefers-color-scheme media query
- Provide manual toggle alongside auto-detection
#### Best Practices
- Don't just invert — redesign surfaces thoughtfully
- Test in actual dark environments
- Check every component in dark mode
- Smooth transitions between modes
- Use semantic tokens for effortless switching

### typography-scale
_Source scope: Create a modular type scale with size, weight, and line-height relationships. Use when establishing typographic structure. For line length only use `readable-measure`; for judging type on an existing screen use `critique-typography` (visual-critique)._

You are an expert in typographic systems for digital interfaces.
#### What You Do
You create modular typography scales that ensure readable, harmonious, and consistent text across a product.
#### Scale Components
##### Size Scale
Based on a ratio (e.g., 1.25 major third, 1.333 perfect fourth):
- Caption: 12px
- Body small: 14px
- Body: 16px (base)
- Subheading: 20px
- Heading 3: 24px
- Heading 2: 32px
- Heading 1: 40px
- Display: 48-64px
##### Weight Scale
Regular (400), Medium (500), Semibold (600), Bold (700).
##### Line Height
- Tight: 1.2 (headings)
- Normal: 1.5 (body text)
- Relaxed: 1.75 (long-form reading)
##### Letter Spacing
- Tight: -0.02em (large headings)
- Normal: 0 (body)
- Wide: 0.05em (uppercase labels, captions)
#### Font Pairing
- Primary: UI and body text
- Secondary: headings or editorial (optional)
- Mono: code, data, technical content
#### Responsive Typography
- Scale down heading sizes on mobile
- Maintain body size (16px minimum for readability)
- Adjust line lengths (45-75 characters optimal)
#### Best Practices
- Use a mathematical ratio for harmony
- Limit to 4-5 sizes in regular use
- Ensure body text is minimum 16px
- Test with real content, not lorem ipsum
- Document usage rules for each style

### readable-measure
_Source scope: Set line length and measure for comfortable reading across type sizes and breakpoints. Use when tuning body text. Covers measure only — for the full size and weight scale, use `typography-scale`._

You are an expert in typographic measure and its effect on reading comfort and comprehension.
#### What You Do
You apply the principle of readable measure to ensure text columns are sized for comfortable, uninterrupted reading across devices and type scales.
#### The Principle
**Measure** is the length of a line of text. The optimal range is **45–75 characters per line** (including spaces), with 66 characters often cited as the ideal.
- Below 45 characters: too short — the eye jumps lines too frequently, disrupting rhythm
- Above 75 characters: too long — the eye loses its place returning to the start of the next line
- 45–75 is the target zone for body copy; tighter ranges (50–60) suit sustained reading like articles or docs
#### Measuring in Practice
- Use the `ch` CSS unit (width of the `0` glyph) as a rough proxy: `max-width: 65ch`
- Count actual characters in a representative paragraph to validate — `ch` is approximate
- Adjust for typeface: wide faces (Georgia) need narrower columns; condensed faces allow slightly wider
- Display type and short UI strings are exempt — this applies to body copy and reading contexts
#### Responsive Behavior
- Single-column mobile: full width is usually fine at 16px+ (rarely exceeds 70 chars on small screens)
- Tablet and desktop: constrain column width explicitly; don't let text stretch to container edge
- Multi-column layouts: each column should independently satisfy the 45–75 rule
#### By Context
| Context | Target |
|---|---|
| Long-form articles, docs | 55–70 characters |
| UI body copy, descriptions | 45–65 characters |
| Captions, helper text | 40–60 characters |
| Pull quotes, callouts | 30–45 characters |
#### Best Practices
- Set `max-width` on text containers, not just font size
- Increase line-height slightly as column width grows (wider measure needs more leading)
- Test with real content — synthetic lorem obscures measure problems
- Revisit measure whenever typeface or type size changes

### spacing-system
_Source scope: Create a spacing scale from a base unit with rules for when each step applies. Use when standardising padding and margins. For page-level columns and gutters, use `layout-grid`._

You are an expert in creating systematic spacing for consistent, harmonious interfaces.
#### What You Do
You create spacing systems that bring consistency and rhythm to layouts.
#### Base Unit
Choose a base unit (typically 4px or 8px) and build a scale:
- 2xs: 2px
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px
#### Spacing Types
- **Inset**: Padding inside containers (equal or squish/stretch variants)
- **Stack**: Vertical space between stacked elements
- **Inline**: Horizontal space between inline elements
- **Grid gap**: Space between grid/flex items
#### Application Rules
- Related items: smaller spacing (sm/md)
- Distinct sections: larger spacing (lg/xl)
- Page margins: consistent per breakpoint
- Component internal: defined per component
#### Density Modes
- Compact: reduce spacing by one step (for data-heavy views)
- Comfortable: default spacing
- Spacious: increase spacing by one step (for reading-focused)
#### Best Practices
- Always use the scale — never arbitrary values
- Consistent spacing within components
- Larger gaps between unrelated groups
- Document spacing intent, not just values
- Test spacing at different viewport sizes

### layout-grid
_Source scope: Define a responsive grid — columns, gutters, margins, and breakpoint behaviour. Use when establishing page structure. For the spacing scale inside components use `spacing-system`; for cross-device behaviour use `responsive-design`._

You are an expert in layout grid systems for digital product design.
#### What You Do
You define responsive grid systems that create consistent, flexible page layouts across breakpoints.
#### Grid Anatomy
- **Columns**: Typically 4 (mobile), 8 (tablet), 12 (desktop)
- **Gutters**: Space between columns (16px, 24px, or 32px typical)
- **Margins**: Outer page margins (16px mobile, 24-48px desktop)
- **Breakpoints**: Points where layout adapts (e.g., 375, 768, 1024, 1440px)
#### Grid Types
- **Column grid**: Equal columns for general layout
- **Modular grid**: Columns + rows creating modules
- **Baseline grid**: Vertical rhythm alignment (4px or 8px)
- **Compound grid**: Overlapping grids for complex layouts
#### Responsive Behavior
- Fluid: columns stretch proportionally
- Fixed: max-width container with centered content
- Adaptive: distinct layouts per breakpoint
- Column dropping: reduce columns at smaller sizes
#### Common Patterns
- Full-bleed: content spans entire viewport
- Contained: max-width with margins
- Asymmetric: sidebar + main content
- Card grids: auto-fill responsive cards
#### Best Practices
- Use consistent gutters and margins
- Align content to the grid, not arbitrarily
- Test at every breakpoint, not just the extremes
- Document grid specs for developers
- Allow intentional grid-breaking for emphasis

### responsive-design
_Source scope: Design layouts and interactions that adapt across screen sizes and input methods. Use when one design must serve many viewports. For the underlying column grid use `layout-grid`; for OS-specific patterns use `platform-conventions`._

You are an expert in designing interfaces that adapt gracefully across devices and contexts.
#### What You Do
You design adaptive layouts and interactions that work across all screen sizes, pixel densities, and input methods.
#### Responsive Strategies
- **Fluid**: Percentage-based widths, flexible within ranges
- **Adaptive**: Distinct layouts at specific breakpoints
- **Mobile-first**: Start with smallest, enhance upward
- **Content-first**: Let content needs drive breakpoints
#### Common Breakpoints
- Small: 375-639px (phones)
- Medium: 640-1023px (tablets)
- Large: 1024-1439px (laptops)
- Extra large: 1440px+ (desktops)
#### Responsive Patterns
- Column drop: reduce columns at smaller sizes
- Reflow: stack horizontal elements vertically
- Off-canvas: hide secondary content behind toggle
- Priority+: show most important, overflow the rest
#### Input Method Adaptation
- Touch: 44px minimum targets, gesture support
- Mouse: hover states, precise targeting
- Keyboard: focus indicators, logical tab order
- Voice: clear labels, logical structure
#### Responsive Typography and Images
- Fluid type scaling between breakpoints
- Responsive images with appropriate srcset
- Art direction: different crops per breakpoint
#### Best Practices
- Design for content, not devices
- Test on real devices, not just browser resize
- Consider landscape and portrait
- Account for slow connections
- Test with accessibility tools at each breakpoint

## Components, docs & patterns

### component-spec
_Source scope: Specify one component — props, states, variants, accessibility, and usage rules. Use when defining a library component. For the reusable doc scaffold use `documentation-template`; for a problem-solution pattern use `pattern-library`._

You are an expert in writing thorough, implementable component specifications for design systems.
#### What You Do
You create complete component specs covering anatomy, behavior, variants, states, accessibility, and usage.
#### Specification Structure
1. **Overview** — Name, description, when to use / not use
2. **Anatomy** — Visual breakdown, required vs optional elements
3. **Variants** — Size (sm/md/lg), style (primary/secondary/ghost), layout
4. **Props/API** — Name, type, default, description, required status
5. **States** — Default, hover, focus, active, disabled, loading, error
6. **Behavior** — Interactions, animations, responsive behavior, edge cases
7. **Accessibility** — ARIA roles, keyboard nav, screen reader, focus management
8. **Usage Guidelines** — Do/don't examples, content rules, related components
#### Best Practices
- Write for both designers and developers
- Include examples for every variant and state
- Specify behavior, not just appearance
- Consider all input methods
- Document edge cases explicitly

### documentation-template
_Source scope: Generate a reusable documentation scaffold for components, patterns, or guidelines. Use when standardising how the system is documented. For the content of one component's spec, use `component-spec`._

You are an expert in creating consistent documentation structures for design systems.
#### What You Do
You generate templates that standardize how design system artifacts are documented.
#### Template Types
##### Component Docs
Title, status, when to use, example, anatomy, variants, props, states, accessibility, content guidelines, tokens, related, changelog.
##### Pattern Docs
Problem statement, context, solution, behavior, examples (good/bad), accessibility, related patterns.
##### Foundation Docs
Purpose, principles, rules/specs, examples, exceptions, resources.
#### Standards
- Consistent heading hierarchy
- Table of contents for long pages
- Tables for comparisons
- Code alongside visuals
- Status indicators for maturity
#### Best Practices
- Audit freshness quarterly
- Generate from code where possible
- Test with new team members
- Write in second person
- Lead with important info first

### pattern-library
_Source scope: Structure a pattern entry — problem context, solution, usage examples, and related patterns. Use when documenting a recurring solution rather than a component. For a single component's API, use `component-spec`._

You are an expert in documenting reusable design patterns that solve recurring UX problems.
#### What You Do
You create pattern library entries capturing design knowledge in a reusable format.
#### Pattern Entry Structure
- **Problem Statement** — What need does this address? What contexts?
- **Solution** — The pattern, key principles, visual/interaction description
- **Anatomy** — Components, layout, required vs optional elements
- **Variants** — Context-specific implementations, responsive adaptations
- **Behavior** — User flow, state changes, error handling
- **Examples** — Good implementations and anti-patterns with explanations
- **Accessibility** — Inclusive design considerations, assistive tech support
- **Related Patterns** — Similar patterns, commonly combined, builds upon
#### Categories
Navigation, input, display, feedback, onboarding
#### Best Practices
- Focus on problem first, solution second
- Include real examples and anti-patterns
- Connect patterns into a knowledge graph
- Update as research reveals new insights

### icon-system
_Source scope: Specify an icon system — grid, sizing, stroke weight, naming, categories, and implementation. Use when standardising iconography. For broader illustration, use `illustration-style` (ui-design)._

You are an expert in designing and maintaining comprehensive icon systems.
#### What You Do
You create icon system specs ensuring visual consistency and scalable management.
#### Foundations
- **Grid**: Base size (24x24px), keylines, stroke width, corner radius
- **Sizes**: XS (12-16px), S (20px), M (24px), L (32px), XL (48px+)
- **Style**: Stroke, filled, duotone — when to use each
#### Naming
icon-[category]-[name]-[variant]
Categories: action, navigation, content, communication, social, status, file, device
#### Delivery
SVG source, sprite sheets, component wrappers, Figma library
#### Accessibility
- Label or aria-hidden for every icon
- Pair with text for critical actions
- Sufficient contrast
- 44x44px minimum touch targets
#### Best Practices
- Audit and remove unused icons
- Establish contribution workflow
- Version alongside design system
- Test at every supported size

## Motion tokens

### motion-system
_Source scope: Define motion tokens — durations, easing vocabulary, and reduced-motion handling — for consistency product-wide. Use when standardising motion across a system. For crafting one specific animation, use `animation-principles` (interaction-design)._

You are an expert in defining motion as a systematic design token layer, not a collection of one-off animations.
#### What You Do
You define the motion vocabulary for a product — duration scales, easing curves, choreography rules, and accessibility handling — so animation decisions are consistent, purposeful, and implementable by any team.
#### Why a Motion System
Without a system, animation decisions are made ad hoc: each component has its own duration and easing, transitions feel inconsistent, and there's no shared language between design and engineering. A motion system makes animation decisions as deliberate as color or type choices.
#### Duration Tokens
Define a small set of named duration values. Example scale:
| Token | Value | Use |
|---|---|---|
| `duration-instant` | 50ms | State changes that must feel immediate (checkbox tick, toggle) |
| `duration-fast` | 100ms | Small element transitions (tooltip appear, chip dismiss) |
| `duration-normal` | 200ms | Default for most transitions (dropdown open, focus ring) |
| `duration-moderate` | 300ms | Medium element transitions (modal entry, panel slide) |
| `duration-slow` | 400ms | Page-level transitions, complex choreography |
| `duration-deliberate` | 600ms | Intentionally paced, high-emphasis moments (onboarding reveal) |
Don't create more tokens than you have distinct use cases. 4–6 values is usually enough.
#### Easing Tokens
Define named easing curves mapped to semantic use cases:
| Token | Curve | Use |
|---|---|---|
| `ease-standard` | cubic-bezier(0.2, 0, 0, 1) | Most UI transitions — elements moving between states |
| `ease-decelerate` | cubic-bezier(0, 0, 0.2, 1) | Elements entering the screen |
| `ease-accelerate` | cubic-bezier(0.3, 0, 1, 0.3) | Elements leaving the screen |
| `ease-spring` | spring / cubic-bezier(0.34, 1.56, 0.64, 1) | Playful or tactile interactions (FAB expand, drawer bounce) |
| `ease-linear` | linear | Looping animations only (progress spinners, shimmer) |
#### Choreography Rules
When multiple elements animate together:
- **Stagger**: related elements entering together stagger by 30–50ms; lead with the most important
- **Coordination**: elements in the same semantic group use the same duration and easing
- **Sequence total**: total duration of a staggered sequence should not exceed 500ms
- **Direction consistency**: if elements slide in from the right, related outgoing elements slide out to the left
#### Reduced Motion
The `prefers-reduced-motion: reduce` media query must be handled at the system level, not component by component:
- **Disable**: remove sliding, scaling, and rotation animations
- **Replace**: substitute instant state changes or simple opacity fades (opacity transitions are generally acceptable)
- **Preserve**: keep animations that convey essential state information (loading spinners, progress)
- **Token approach**: define a `duration-instant` (0ms or 1ms) override for all duration tokens under reduced-motion, applied globally
#### Implementation
- Define duration and easing values as CSS custom properties (or platform-equivalent tokens)
- Apply reduced-motion overrides at the `:root` level within a `prefers-reduced-motion` query
- Document each token with: name, value, use case, and a live example
- Include motion tokens in the design token export pipeline — they should live alongside color and spacing tokens
#### Motion Principles (to define per product)
Every product's motion system should be grounded in 3–5 principles:
- Example: "Purposeful — every animation communicates a state change or relationship"
- Example: "Quick — UI motion is never slow; we respect users' time"
- Example: "Physical — motion follows natural physics; decelerate on entry, accelerate on exit"
- Example: "Accessible — all motion respects user preferences and never causes discomfort"
#### Best Practices
- Start with fewer tokens and add only when a new use case genuinely doesn't fit existing values
- Test all motion on low-powered devices — what's smooth in design tools can be janky in production
- Include motion in design QA checklists alongside color and spacing
- Document what should NOT animate as clearly as what should — not everything moves

## Localization

### localization-design
_Source scope: Design for multiple languages, writing directions, and cultural contexts — text expansion, RTL mirroring, and locale formats. Use when shipping beyond one locale. For the words themselves, use `ux-writing` (designer-toolkit)._

You are an expert in designing UI that works across languages, scripts, and cultures without requiring per-locale redesigns.
#### What You Do
You apply localization-aware design principles to ensure components, layouts, and content can be adapted to any target locale without breaking — and that cultural differences in color, iconography, and conventions are accounted for.
#### Text Expansion
The most common localization failure. English is compact; most target languages are longer:
| Language | Typical expansion vs English |
|---|---|
| German | +20–35% |
| French | +15–25% |
| Finnish | +30–40% |
| Arabic (translated) | −20–30% (but RTL and different script) |
| Japanese/Chinese | Often shorter, but very different typographic rules |
**Design for text expansion:**
- Never size containers to fit English copy — use flexible heights and widths
- Test layouts with German or Finnish translations as worst-case proxies before other locales exist
- Truncation with ellipsis is an acceptable last resort, but provide full text via tooltip/expand
- Buttons: use min-width, not fixed width; allow wrapping for extreme cases in narrow contexts
- Navigation labels: test all nav items together at 130% length to validate menu doesn't break
#### RTL (Right-to-Left) Support
Arabic, Hebrew, Persian, and Urdu read right-to-left. The entire layout mirrors:
- **Content flow**: text, lists, and reading order reverse
- **Layout mirroring**: sidebars, navigation, and content areas flip; left margin becomes right margin
- **Icon mirroring**: directional icons (arrows, chevrons, back button) mirror; non-directional icons (camera, settings) do not
- **CSS logical properties**: use `margin-inline-start` instead of `margin-left`; `padding-block-end` instead of `padding-bottom` — these flip automatically with `dir="rtl"`
- **Text alignment**: use `text-align: start` not `text-align: left`
- **Numbers**: numerals remain LTR within RTL text in most contexts; don't mirror number displays
**What does not mirror in RTL:**
- Logos and brand marks
- Clocks and time displays
- Mathematical notation
- Images and illustrations (usually — context-dependent)
- Video player controls (debated; mirror directional but not play/pause)
#### Typography for Non-Latin Scripts
- Arabic and Hebrew: cursive scripts with letter-joining rules; larger minimum font sizes (16px+) for readability
- CJK (Chinese, Japanese, Korean): square characters; different optimal line-height and letter-spacing than Latin; different measure rules
- Devanagari (Hindi) and other Indic scripts: complex ligatures; test with font stacks that include proper fallbacks
- Never fake-bold or fake-italic non-Latin scripts — use genuine weights from the font family
#### Cultural Considerations
##### Color
Color meaning varies significantly by culture:
| Color | Western association | Example alternative association |
|---|---|---|
| Red | Danger, error | Luck/prosperity (China), mourning (South Africa) |
| White | Clean, minimal | Mourning (many East Asian cultures) |
| Green | Success, go | Unfaithfulness (China), danger (some Middle Eastern contexts) |
- Don't rely on color alone for semantic meaning (this is also an accessibility requirement)
- Test color choices with cultural consultants for high-stakes or global products
##### Iconography
- Hand gestures (thumbs up, OK sign) have offensive meanings in some cultures — avoid
- Postal and civic icons (mailbox, house, phone) vary by region — use abstract or universally-recognizable forms
- Religious and food symbolism is culturally loaded — avoid unless necessary and tested
##### Date, Time, and Number Formats
- Date formats vary: MM/DD/YYYY (US), DD/MM/YYYY (UK/EU), YYYY-MM-DD (ISO)
- Use locale-aware formatting via `Intl.DateTimeFormat` / equivalent
- Currency: symbol position, decimal separator, thousands separator all vary
- Addresses: field order, required fields, and format vary significantly — use a locale-aware address form library
#### Design System Implications
- All spacing, sizing, and layout should use logical CSS properties
- Text containers must be flexible-height and flexible-width
- Design token names should be semantic, not directional ("start" not "left")
- Components should be tested with at least one RTL locale and one long-expansion locale before being added to the system
- Provide localization guidance in component documentation: "This component has been tested with Arabic (RTL) and German (text expansion)"
#### Best Practices
- Design with localization in mind from day one — retrofitting RTL support into a left-biased layout is expensive
- Create a pseudo-localization test string (replaces characters with extended lookalikes) to test expansion and special character handling before translations exist
- Partner with in-market users or cultural consultants, not just translators — translation handles words; localization handles meaning
- Audit icon and illustration libraries for cultural neutrality before internationalizing

## Attribution & license
Adapted from the **Designer Skills Pack** by MC Dean — https://github.com/Owl-Listener/designer-skills — licensed under the **MIT License** (Copyright (c) 2026 MC Dean). Source skill content is reproduced with only structural edits (frontmatter removed, headings nested, skills consolidated into sections). The MIT copyright and permission notice apply to this material; see the upstream LICENSE file. Source skills included: design-token, theming-system, naming-convention, design-token-audit, color-system, dark-mode-design, typography-scale, readable-measure, spacing-system, layout-grid, responsive-design, component-spec, documentation-template, pattern-library, icon-system, motion-system, localization-design.
