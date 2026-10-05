---
name: interaction-feedback-patterns
description: >-
  Use this when designing or reviewing UI interactions: animation/micro-interaction specs, component state machines, feedback, loading and error states, forms, navigation, search, gestures, emotional tone/copy by state, or UX writing.
---
# Interaction & feedback patterns

Companion to `premium-ui-motion-craft` (which owns the look/feel, spring motion recipes and the ship checklist); this skill supplies the generic reference material beneath it. Cross-references to skill names not listed below point to the upstream pack and can be ignored. Where numbers conflict (e.g. durations/easing), prefer the premium-ui-motion-craft values for Framekit and treat these as sane defaults.

## Motion & state

### animation-principles
_Source scope: Apply animation principles — easing, staging, follow-through — to one specific UI motion. Use when tuning how an animation feels. For product-wide duration and easing tokens use `motion-system` (design-systems); for a full interaction spec use `micro-interaction-spec`._

You are an expert in applying motion design principles to create purposeful UI animations.
#### What You Do
You apply animation principles to make interfaces feel natural, guide attention, and communicate state changes.
#### Core UI Animation Principles
##### Easing
- Ease-out: decelerating (entering elements)
- Ease-in: accelerating (exiting elements)
- Ease-in-out: both (moving between positions)
- Linear: only for continuous animations (progress bars)
##### Duration
- Micro (50-100ms): button states, toggles
- Short (150-250ms): tooltips, fades, small movements
- Medium (250-400ms): page transitions, modals
- Long (400-700ms): complex choreography
##### Motion Principles
- **Purposeful**: every animation communicates something
- **Quick**: faster is almost always better in UI
- **Natural**: follow physics (acceleration, deceleration)
- **Choreographed**: related elements move in coordinated sequence
- **Interruptible**: animations can be cancelled mid-flight
#### Animation Types
- **Entrance**: fade in, slide in, scale up
- **Exit**: fade out, slide out, scale down
- **Emphasis**: pulse, shake, bounce
- **Transition**: morph, crossfade, shared element
- **Loading**: skeleton shimmer, spinner, progress
#### Stagger and Sequence
- Stagger related items by 30-50ms each
- Lead with the most important element
- Limit total sequence duration to under 700ms
- Use consistent direction for related movements
#### Best Practices
- Support prefers-reduced-motion
- Don't animate for the sake of it
- Test on low-powered devices
- Keep animations under 400ms for responsive feel
- Use will-change or transform for performance

### micro-interaction-spec
_Source scope: Specify one micro-interaction completely — trigger, rules, feedback, loops, and modes. Use when handing a single interaction to engineering. For motion craft alone use `animation-principles`; for multi-state components use `state-machine`._

You are an expert in designing micro-interactions that make interfaces feel alive and intuitive.
#### What You Do
You specify micro-interactions using a structured framework covering trigger, rules, feedback, and loops.
#### Micro-Interaction Framework
##### 1. Trigger
What initiates the interaction: user action (click, hover, swipe), system event (notification, completion), or conditional (time-based, threshold).
##### 2. Rules
What happens once triggered: the logic and sequence of the interaction, conditions and branching.
##### 3. Feedback
How the user perceives the result: visual change (color, size, position), motion (animation, transition), audio (click, chime), haptic (vibration patterns).
##### 4. Loops and Modes
Does the interaction repeat? Does it change over time? First-time vs repeat behavior, progressive disclosure.
#### Common Micro-Interactions
- Toggle switches with state animation
- Pull-to-refresh with progress indication
- Like/favorite with celebratory animation
- Form validation with inline feedback
- Button press with depth/scale response
- Swipe actions with threshold feedback
- Long-press with radial progress
#### Specification Format
For each micro-interaction: name, trigger, rules (sequence), feedback (visual/audio/haptic), duration/easing, loop behavior, accessibility considerations.
#### Best Practices
- Every micro-interaction should have a purpose
- Keep durations short (100-500ms for most)
- Provide immediate feedback for user actions
- Respect reduced-motion preferences
- Test on target devices for performance

### state-machine
_Source scope: Model component behaviour as explicit states, events, and transitions. Use when a component has many interacting states that must be exhaustive. For the feel and feedback of a single interaction, use `micro-interaction-spec`._

You are an expert in modeling complex UI behavior as finite state machines.
#### What You Do
You model UI components and flows as state machines to eliminate impossible states and make behavior predictable.
#### State Machine Components
- **States**: Distinct modes the UI can be in (idle, loading, success, error)
- **Events**: Things that cause transitions (click, submit, timeout, response)
- **Transitions**: Rules for moving between states (on event X in state A, go to state B)
- **Actions**: Side effects during transitions (fetch data, show toast, log event)
- **Guards**: Conditions that must be true for a transition (isValid, hasPermission)
#### Common UI State Machines
##### Form
idle -> editing -> validating -> submitting -> success/error -> idle
##### Data Fetching
idle -> loading -> success/error, error -> retrying -> success/error
##### Authentication
logged-out -> authenticating -> logged-in -> logging-out -> logged-out
##### Multi-Step Wizard
step1 -> step2 -> step3 -> review -> submitting -> complete
#### Modeling Approach
1. List all possible states
2. List all events/triggers
3. Define valid transitions
4. Identify impossible states to prevent
5. Add guards for conditional transitions
6. Define entry/exit actions per state
#### Benefits
- Eliminates impossible states (no loading + error simultaneously)
- Makes edge cases visible
- Shared language between design and engineering
- Testable behavior specification
#### Best Practices
- Start with the happy path, then add error states
- Every state should have a way out (no dead ends)
- Keep state machines focused (one per concern)
- Document with visual diagrams
- Map each state to a UI representation

## Feedback, loading & errors

### feedback-patterns
_Source scope: Design confirmations, status updates, and notifications that tell users an action registered. Use when the system must acknowledge success or change. For waiting states use `loading-states`; for failures use `error-handling-ux`._

You are an expert in designing system feedback that keeps users informed and confident.
#### What You Do
You design feedback mechanisms that confirm actions, communicate status, and guide next steps.
#### Feedback Types
##### Immediate Feedback
- Button state change on click
- Inline validation on input
- Toggle visual response
- Drag position update
##### Confirmation Feedback
- Success toast/snackbar after action
- Checkmark animation on completion
- Summary of what was done
- Undo option for reversible actions
##### Status Feedback
- Progress indicators for ongoing processes
- Status badges (pending, active, complete)
- Activity indicators (typing, uploading, syncing)
- System health indicators
##### Notification Feedback
- In-app notifications for events
- Badge counts for unread items
- Banner alerts for system-wide messages
- Push notifications for time-sensitive items
#### Feedback Channels
- **Visual**: Color change, icon, animation, badge
- **Text**: Toast message, inline text, status label
- **Audio**: Click sound, notification chime, alert tone
- **Haptic**: Tap feedback, success vibration, warning buzz
#### Feedback Hierarchy
1. Inline/contextual — closest to the action (preferred)
2. Component-level — within the current component
3. Page-level — banner or toast at page level
4. System-level — notification outside current view
#### Duration and Dismissal
- Toasts: auto-dismiss after 3-5 seconds
- Errors: persist until resolved or dismissed
- Confirmations: brief display with undo window
- Status: persist while relevant
#### Best Practices
- Acknowledge every user action
- Match feedback intensity to action importance
- Don't interrupt flow for minor confirmations
- Provide undo rather than 'Are you sure?'
- Ensure feedback is accessible (not color-only)
- Test that feedback timing feels right

### loading-states
_Source scope: Design waiting experiences — spinners, skeletons, optimistic updates, and progressive reveal. Use when content takes time to arrive. For the latency budget itself use `doherty-threshold`; for success confirmation use `feedback-patterns`._

You are an expert in designing loading experiences that maintain user confidence and perceived performance.
#### What You Do
You design loading patterns that keep users informed and reduce perceived wait time.
#### Loading Patterns
##### Skeleton Screens
Show the layout shape before content loads. Use for known content structure. Animate with subtle shimmer.
##### Spinner/Progress
Indeterminate spinner for unknown duration. Determinate progress bar when progress is measurable. Keep spinners small and unobtrusive.
##### Progressive Loading
Load critical content first, enhance progressively. Lazy-load below-fold content. Blur-up images (low-res placeholder to full).
##### Optimistic UI
Show the expected result immediately. Reconcile with server response. Roll back if the action fails.
##### Placeholder Content
Show placeholder text/images while loading. Use realistic proportions. Transition smoothly to real content.
#### Duration Guidelines
- Under 100ms: no loading indicator needed
- 100ms-1s: subtle indicator (opacity change, skeleton)
- 1-10s: clear loading state with progress if possible
- Over 10s: detailed progress, time estimate, background option
#### Transition Behavior
- Fade content in (don't pop)
- Stagger items for lists (30-50ms intervals)
- Avoid layout shifts when content loads
- Maintain scroll position on content refresh
#### Best Practices
- Show something immediately (never a blank screen)
- Match skeleton shapes to actual content
- Avoid multiple competing loading indicators
- Provide cancel/back options for long loads
- Test on slow connections
- Respect reduced-motion for shimmer animations

### error-handling-ux
_Source scope: Design error prevention, detection, and recovery across a product — message content, placement, and escape routes. Use when errors span multiple flows. For validation inside a single form, use `form-design`._

You are an expert in designing error experiences that prevent, detect, and help users recover from errors.
#### What You Do
You design error handling that minimizes frustration and helps users succeed.
#### Error Handling Hierarchy
##### 1. Prevention
- Inline validation before submission
- Smart defaults and suggestions
- Confirmation dialogs for destructive actions
- Constraint-based inputs (date pickers, dropdowns)
- Auto-save to prevent data loss
##### 2. Detection
- Real-time field validation
- Form-level validation on submit
- Network error detection
- Timeout handling
- Permission and authentication checks
##### 3. Communication
- Clear, human language (not error codes)
- Explain what happened and why
- Tell the user what to do next
- Place error messages near the source
- Use appropriate severity (error, warning, info)
##### 4. Recovery
- Preserve user input (don't clear forms on error)
- Offer retry for transient failures
- Provide alternative paths
- Auto-retry with backoff for network errors
- Undo for accidental actions
#### Error Message Format
- **What happened**: Brief, clear description
- **Why**: Context if helpful
- **What to do**: Specific action to resolve
#### Error States by Context
- **Forms**: Inline per-field + summary at top
- **Pages**: Full-page error with retry/back options
- **Network**: Toast/banner with retry
- **Empty results**: Helpful empty state with suggestions
- **Permissions**: Explain what access is needed and how to get it
#### Best Practices
- Never blame the user
- Be specific (not just 'Something went wrong')
- Maintain the user's context and data
- Log errors for debugging
- Test error paths as thoroughly as happy paths

### interfaces-that-feel
_Source scope: Apply an emotional resonance lens to a UI that is technically correct but flat, prescribing changes at the copy, motion, and interaction layer. Use when a design tests fine but lands cold. For the polish-perception argument, use `aesthetic-usability` (ui-design)._


You evaluate interfaces through one question: does this feel like it was made by a human who thought about how you'd feel using it?

Technical correctness is the floor. The ceiling is emotional legibility — a product that knows you're a person.

#### What You Do

You translate design intentions into felt experience. You start with the state the person is in (not the task they're performing), find vocabulary for that feeling in the physical world, then map it to behavioral properties in the interface.

#### The Translation Process

**1. Name the felt state** — What is the person actually experiencing when they arrive at this moment? Waiting anxiously. Recovering from an error. Celebrating a small win. Being overwhelmed by options.

**2. Find the physical analogue** — What in the physical world has that quality? Soft surfaces absorb impact. A held breath before exhaling. The slow release of a door. That's the behavioral vocabulary.

**3. Extract the behavioral property** — From the physical analogue: weight, resistance, speed, recovery arc, rhythm.

**4. Apply to the interface** — Which layer carries it? Easing curve, delay, copy tone, color temperature, spacing, animation duration.

#### Emotional Timing Principles

- **Information weight**: heavy news arrives slowly; good news can be instant
- **Recovery space**: after an error, give the user 300–600ms before the next prompt — don't rush the recovery
- **System error shame**: never make the user feel responsible for the system's failure; copy must own it
- **Celebration arc**: micro-wins deserve acknowledgment; don't absorb them silently
- **Loading as mood**: the loading state is not neutral — it sets expectation; match it to what's coming

#### Copy Voice by State

| State | Voice |
|---|---|
| Loading | Present and calm — "Getting your data" not "Loading..." |
| Empty | Invitational — tell them what belongs here |
| Error (user) | Clear, directive, blame-free — one specific next step |
| Error (system) | Own it, apologize briefly, offer a path forward |
| Success | Warm and brief — acknowledge, don't overdo it |
| Onboarding | Contextual, not tutorial — what they can do, not how to use the app |

#### Motion as Emotional Signal

Easing communicates intent. Ease-in means weight and momentum. Ease-out means natural deceleration, like something soft landing. Linear is mechanical — avoid it for anything that touches human feeling.

Spring physics convey responsiveness. Stiffness and damping are emotional decisions: a stiff spring is snappy and confident; a loose spring is playful and forgiving.

Duration: 150–300ms for UI response. 400–600ms for transitions that carry meaning. Never animate longer than the user's patience for the task.

#### Review Checklist

Before and after each design pass:
- What is the person feeling when they hit this state?
- Is the interface acknowledging that feeling or ignoring it?
- Does the copy sound like a person wrote it?
- Does the motion convey intent or just fill time?
- If you stripped all color and imagery, would the emotional signal survive?

#### Reference Aesthetic

How We Feel, Headspace, Gentler Streak, Amie, Arc Browser — products where emotional timing, copy voice, and motion are doing the work, not decoration.

#### Best Practices

- Start with the felt state of the person, not the task
- Treat copy as interaction design — every word is a decision
- Reduce motion before adding it; every animation needs a reason
- Test with reduced-motion preferences enabled
- The absence of friction is not warmth — warmth is active, not passive

## Inputs & navigation

### form-design
_Source scope: Design a form end to end — field order, grouping, validation, and completion. Use when the artifact is a form. For product-wide error strategy use `error-handling-ux`; for first-run signup use `onboarding-design`._

You are an expert in designing forms that are clear, forgiving, and efficient to complete.
#### What You Do
You apply form design principles to reduce abandonment, prevent errors, and make data collection feel effortless — from single-field inputs to complex multi-step flows.
#### Layout
- **Single column**: almost always correct for forms. Two-column layouts disrupt reading flow and create ambiguity about field order.
- **Field width should reflect expected input length**: a postcode field is narrow; a bio field is wide. Width is a affordance for what belongs there.
- **Top-aligned labels**: faster to scan and more resilient to long labels than left-aligned or placeholder-only patterns.
- **Group related fields** using proximity (Law of Proximity) and section headings for longer forms — don't let long forms run as an undifferentiated column.
#### Labels and Instructions
- Every field has a persistent label — never rely on placeholder text as the only label (it disappears on input and fails accessibility)
- Labels are concise and in sentence case; avoid ALL CAPS
- Helper text goes below the label, above the field: "Format: DD/MM/YYYY"
- Required fields: mark optional, not required — if most fields are required, flagging optional reduces visual noise
- Character counts: show remaining characters when limits exist; show them always, not only on approach to the limit
#### Input Types
Match input type to the data being collected:
| Data type | Input type |
|---|---|
| Short text | Text input |
| Long text | Textarea (with visible resize) |
| One from few options (≤5) | Radio buttons (all visible) |
| One from many options (6+) | Select / combobox |
| Multiple from few options | Checkboxes |
| Date | Date picker or segmented inputs (day/month/year) — never a freeform text field for structured dates |
| Phone / card numbers | Formatted text input with masking |
| Password | Password input with show/hide toggle |
#### Validation
- **Inline validation**: validate on blur (when the user leaves the field), not on every keystroke — real-time validation on typing is distracting
- **Error placement**: directly below the field, not at the top of the form
- **Error messages**: explain what went wrong and how to fix it — "Email address must include @" not "Invalid email"
- **Success indication**: a subtle indicator (checkmark) on fields with non-obvious correctness (password strength, username availability)
- **Server-side errors**: surface inline to the field if possible; summarize at the top if multiple fields are affected
#### Multi-Step Forms
- Show progress clearly (step indicator, not just "Step 2 of 5")
- Each step should feel completeable as a unit — related questions together
- Allow back navigation without losing data
- Save progress for long forms (auto-save or explicit "save and continue")
- Confirm before discarding partial input
#### Accessibility
- Every field has a programmatic label (`<label for>` or `aria-label`)
- Error messages are associated with their field (`aria-describedby`)
- Focus order follows visual order
- Error summary at top is keyboard-focusable and links to each field
- Don't use color alone to indicate required or error states
#### Best Practices
- Remove every optional field you can — fewer fields = higher completion
- Default to the most common answer where one exists; don't default to blank for binary choices
- Test forms with real users entering real data — synthetic test data hides length and format edge cases
- Measure field-level abandonment (which fields do users leave the form on?) — this is where to invest optimization effort
- For high-stakes forms (payments, medical, legal), add a review step before final submission

### navigation-patterns
_Source scope: Select and design a navigation pattern — tabs, drawer, hierarchy, or hub — matched to product structure and user tasks. Use when choosing how users move between sections. For the underlying content structure, use `information-architecture` (ux-strategy)._

You are an expert in designing navigation systems that make products legible, traversable, and orientating.
#### What You Do
You select and design the right navigation patterns for a product's information architecture, platform, and usage patterns — so users always know where they are, where they can go, and how to get back.
#### Navigation Types
##### Global Navigation
Present on every screen; provides access to top-level sections.
- **Tab bar** (mobile): 3–5 destinations at bottom of screen; icons + labels; always visible
- **Bottom navigation** (Android/web mobile): Material equivalent; same rules as tab bar
- **Top navigation bar** (desktop/web): horizontal links in header; works for 4–7 destinations
- **Side navigation / sidebar** (desktop apps): vertical list of destinations; scales to more items; supports nested structure
- **Hamburger / drawer**: hides navigation behind a menu icon; reduces discoverability; reserve for secondary nav or screen-constrained contexts
##### Local Navigation
Scoped to the current section.
- **Tabs**: switch between parallel views within a section; all tabs same hierarchy level
- **Segmented control**: compact tab variant for 2–4 tightly related views
- **Sidebar within section**: sub-navigation within a section (settings categories, doc chapters)
- **Breadcrumbs**: show path from root to current page; essential in deep hierarchies
##### Utility Navigation
High-reach, low-frequency: account, notifications, search, settings, help.
- Separate from primary navigation visually (typically top-right on desktop)
- Should not compete with primary nav for visual attention
##### Contextual Navigation
Links between related content.
- In-line links within body content
- Related items (recommended articles, related products)
- "Also in this section" links
#### Choosing the Right Pattern
| Situation | Recommended pattern |
|---|---|
| Mobile, 3–5 primary destinations | Tab bar |
| Desktop app, many destinations or nested structure | Side navigation |
| Simple marketing site or docs | Top nav bar |
| Deep content hierarchy | Breadcrumbs + local sidebar |
| Parallel views of the same content | Tabs or segmented control |
| Occasional, non-primary access | Utility nav or overflow menu |
#### Navigation Design Principles
- **Orientation**: users should always know where they are (active state, breadcrumb, page title)
- **Wayfinding**: users should be able to predict where a destination will take them before clicking
- **Reachability**: on mobile, primary destinations must be in thumb reach (bottom of screen)
- **Consistency**: navigation structure and placement must not change between screens
- **Scent**: labels must accurately describe their destinations — test with first-click tests
#### Active States
Every navigation item needs a clear active/selected state that survives:
- Default and active
- Hover and focus
- Disabled
- Notification badge (when applicable)
Active state must be distinguishable by more than color alone (weight, underline, indicator bar).
#### Common Mistakes
- Using a hamburger menu for primary navigation on desktop — it hides critical paths
- Mixing navigation levels (global + local) in the same visual component
- Inconsistent active states across different sections
- Navigation labels that use internal product names users don't recognize
- Too many top-level destinations (more than 7 creates choice paralysis; revisit IA before adding nav items)
#### Best Practices
- Validate navigation labels with first-click tests before building
- Match platform conventions — users carry expectations from the OS and other apps
- Design navigation before designing individual screens; navigation errors compound across the product
- Test navigation with tasks that require users to cross sections — inter-section navigation is where IA breaks show up

### search-ux
_Source scope: Design search — query input, zero results, refinement, and result presentation. Use when users retrieve rather than browse. For browse structure, use `navigation-patterns`._

You are an expert in designing search systems that are fast, forgiving, and genuinely useful.
#### What You Do
You design the full search experience — query input, results, filtering, zero-results states, and search-as-navigation patterns — so users find what they need with minimal effort and friction.
#### Search Entry
##### The Search Input
- Placeholder text should describe what can be searched: "Search products, brands, or categories" not just "Search…"
- Input width should suggest expected query length — wider inputs invite longer queries
- Auto-focus search input when the search view is opened
- Submit on Enter; provide a clear search icon/button for touch users
- Show a clear/reset button once a query is entered
##### Autocomplete and Suggestions
- Suggest completions after 2–3 characters to reduce typing
- Show recent searches first, then trending/popular, then predicted completions
- Highlight the query term within suggestions (bold the typed portion)
- Limit to 5–8 suggestions; more creates decision overhead (Hick's Law)
- Allow keyboard navigation through suggestions
##### Search-as-Navigation
Some users use search to navigate rather than find: "settings", "invoices", "my profile". Design for this:
- Include navigational destinations in suggestions
- Surface exact-match pages at the top of results
- Don't penalize navigational queries with "no results" when the destination exists
#### Results
##### Results Layout
- **List**: works for most content types; scanning-friendly
- **Grid**: for visual content (images, products, cards) where thumbnail is the primary signal
- **Grouped by type**: when results span heterogeneous content types (files, people, messages)
- Show result count: "142 results for 'onboarding'"
- Show which fields matched (title, body, tags) for complex content types
##### Result Items
Each result should show:
- Title (with query term highlighted)
- Snippet of matching context (with query term highlighted)
- Metadata relevant to the decision (date, author, category, price, status)
- Enough to decide whether to click — not so much it replaces clicking
##### Ranking and Relevance
- Recency, popularity, and exact-match title should score higher
- Personalization (user's recent activity, role, location) improves relevance for logged-in contexts
- Surface the ranking logic to users when it matters: "Sorted by: most recent" with ability to change
#### Filtering and Refinement
- Show filters that are relevant to the current result set, not all possible filters
- Indicate filter counts: "Type: Article (24), Video (8)"
- Applied filters should be visible and individually removable
- "Clear all filters" when multiple are applied
- Faceted search (filter by multiple attributes simultaneously) suits catalog-dense contexts
#### Zero-Results State
The most critical and most often neglected state:
- Confirm what was searched: "No results for 'onbording'"
- Suggest corrections for likely typos
- Suggest related or broader terms
- Offer alternatives: browse categories, contact support, see popular items
- Never show a blank page — the zero-results state is a retention moment
#### Search Analytics
- **Top queries**: what are users searching for? Gaps signal missing content or navigation
- **Zero-results queries**: what are users searching for that the system can't find?
- **Refinement rate**: how often do users modify their query or apply filters?
- **Click position**: which result position is clicked most? Low positions signal poor ranking
- **Search abandonment**: users who search and then leave — often a zero-results or poor-relevance problem
#### Best Practices
- Treat zero-results as a UX failure, not a search failure — every zero-results query is a gap to address
- Don't remove search from mobile to save space — search is often the primary navigation on mobile
- Persist the query in the input field so users can refine without retyping
- Log queries to inform content, IA, and navigation decisions — search is the most honest user feedback you have
- Design search to be tolerant: handle typos, synonyms, plurals, and partial matches

### gesture-patterns
_Source scope: Design gesture interactions for touch and pointer — swipe, drag, long-press, and their discoverability. Use when input is gestural. For OS-standard gestures on iOS and Android, use `platform-conventions` (ui-design)._

You are an expert in designing intuitive gesture-based interactions.
#### What You Do
You design gesture interactions that feel natural and discoverable across touch and pointer devices.
#### Core Gestures
- **Tap**: Select, activate, toggle
- **Double tap**: Zoom, like/favorite
- **Long press**: Context menu, reorder mode, preview
- **Swipe**: Navigate, dismiss, reveal actions
- **Pinch**: Zoom in/out
- **Rotate**: Rotate content (maps, images)
- **Drag**: Move, reorder, adjust values
- **Pull**: Refresh content (pull-to-refresh)
#### Gesture Design Rules
##### Discoverability
- Pair gestures with visible affordances
- Provide visual hints on first use
- Always have a non-gesture alternative (button/menu)
##### Feedback
- Immediate visual response when gesture starts
- Progress indication during gesture
- Threshold indicators (snap points, rubber-banding)
- Completion confirmation
##### Thresholds
- Minimum distance before gesture activates (10-15px)
- Velocity thresholds for flick/swipe
- Direction lock (horizontal vs vertical)
- Cancel zone (return to start to abort)
#### Conflict Resolution
- Scroll vs swipe: direction lock after initial movement
- Tap vs long press: time threshold (500ms typical)
- Pinch vs drag: number of touch points
- System gestures take priority (back swipe, notification pull)
#### Accessibility
- Every gesture must have a non-gesture alternative
- Support switch control and voice control
- Custom gestures should be documented
- Respect reduced-motion preferences for gesture animations
#### Best Practices
- Follow platform conventions
- Keep gestures simple (one or two fingers)
- Provide undo for destructive gesture actions
- Test with one-handed use
- Don't require precision timing

## Microcopy

### ux-writing
_Source scope: Write interface copy — microcopy, error messages, empty states, and CTAs. Use when the words are the deliverable. For content structure and ownership, use `content-strategy` (ux-strategy)._

You are an expert in writing clear, helpful interface copy that guides users and reinforces the product voice.
#### What You Do
You write UI copy that helps users accomplish tasks, understand status, and feel confident.
#### UX Writing Categories
##### Microcopy
- Button labels: action-oriented, specific (not just 'Submit')
- Form labels: clear, concise, no jargon
- Tooltips: brief explanations for complex features
- Placeholder text: example format, not instructions
##### Error Messages
- Say what happened (clear, not technical)
- Say why (if helpful and brief)
- Say what to do next (specific action)
- Use a human tone (not robotic or blaming)
##### Empty States
- Explain what will appear here
- Guide the user to take action
- Use an encouraging, helpful tone
- Provide a clear CTA
##### Confirmation Messages
- Confirm what just happened
- Provide next steps if relevant
- Include undo option for reversible actions
- Keep it brief and positive
##### Onboarding Copy
- Welcome without overwhelming
- One concept at a time
- Action-oriented (do, not just read)
- Allow skipping
##### CTAs (Calls to Action)
- Start with a verb
- Be specific about the outcome
- Match user intent (not business intent)
- Primary CTA should be the most common action
#### Voice and Tone Guidelines
- **Voice** (consistent): brand personality, vocabulary, perspective
- **Tone** (varies): adapts to context (celebration vs error vs instruction)
#### Writing Principles
- Clear over clever
- Concise over comprehensive
- Helpful over promotional
- Consistent over creative
- Inclusive over casual
#### Best Practices
- Write copy before designing the UI (content-first)
- Test copy with real users
- Create a terminology dictionary
- Avoid jargon, abbreviations, and idioms
- Consider translation and localization from the start

## Attribution & license
Adapted from the **Designer Skills Pack** by MC Dean — https://github.com/Owl-Listener/designer-skills — licensed under the **MIT License** (Copyright (c) 2026 MC Dean). Source skill content is reproduced with only structural edits (frontmatter removed, headings nested, skills consolidated into sections). The MIT copyright and permission notice apply to this material; see the upstream LICENSE file. Source skills included: animation-principles, micro-interaction-spec, state-machine, feedback-patterns, loading-states, error-handling-ux, interfaces-that-feel, form-design, navigation-patterns, search-ux, gesture-patterns, ux-writing.
