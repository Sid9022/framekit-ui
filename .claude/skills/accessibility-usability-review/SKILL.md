---
name: accessibility-usability-review
description: >-
  Use this when auditing a UI against WCAG 2.2, planning accessibility or usability tests, running a heuristic evaluation, or doing a design QA pass on a built component or page.
---
# Accessibility & usability review

Companion to `premium-ui-motion-craft` (which owns the look/feel, spring motion recipes and the ship checklist); this skill supplies the generic reference material beneath it. Cross-references to skill names not listed below point to the upstream pack and can be ignored. Where numbers conflict (e.g. durations/easing), prefer the premium-ui-motion-craft values for Framekit and treat these as sane defaults.

## Accessibility

### accessibility-audit
_Source scope: Audit an existing interface against WCAG, producing findings with severity ratings and remediation steps. Use when you have a design or build to assess now. Not for planning future sessions with assistive-technology users — use `accessibility-test-plan` (prototyping-testing)._

You are an expert in digital accessibility, WCAG guidelines, and inclusive design.
#### What You Do
You conduct thorough accessibility audits identifying barriers and providing remediation guidance.
#### WCAG 2.2 Principles (POUR)
- **Perceivable**: Text alternatives, captions, adaptable content, color contrast
- **Operable**: Keyboard access, time limits, no seizures, navigation, input modalities
- **Understandable**: Readable, predictable, input assistance
- **Robust**: Assistive tech compatibility, semantic markup, ARIA
#### Severity Ratings
1. Critical — blocks access entirely
2. Major — significant difficulty
3. Minor — inconvenience with workarounds
4. Enhancement — beyond compliance improvement
#### Issue Format
Description, location, WCAG criterion, severity, impact, remediation steps, code examples.
#### Best Practices
- Test with real assistive technologies
- Include users with disabilities when possible
- Audit across devices and browsers
- Check static and interactive states
- Prioritize by severity and user impact

### accessibility-test-plan
_Source scope: Plan accessibility testing — assistive technologies, participant criteria, WCAG coverage, and session protocol. Use when scheduling testing with real AT users. Not for evaluating a design yourself — use `accessibility-audit` (design-systems)._

You are an expert in planning comprehensive accessibility testing.
#### What You Do
You create testing plans that systematically evaluate accessibility across assistive technologies and WCAG criteria.
#### Testing Layers
##### 1. Automated Testing
- Axe, Lighthouse, WAVE tools
- Catches approximately 30-40% of issues
- Run on every page/state
- Integrate into CI/CD pipeline
##### 2. Manual Testing
- Keyboard-only navigation
- Screen reader walkthrough
- Zoom to 200% and 400%
- High contrast mode
- Reduced motion mode
##### 3. Assistive Technology Testing
- Screen readers: VoiceOver (Mac/iOS), NVDA (Windows), TalkBack (Android)
- Voice control: Voice Control (Mac/iOS), Dragon
- Switch control
- Screen magnification
##### 4. User Testing with Disabilities
- Recruit participants with relevant disabilities
- Include variety (vision, motor, cognitive, hearing)
- Test with their own devices and settings
- Focus on real tasks, not compliance checkboxes
#### Test Matrix
For each key user flow, test across: keyboard only, VoiceOver, NVDA, zoom 200%, high contrast, reduced motion.
#### WCAG Criteria Checklist
Organize by principle (Perceivable, Operable, Understandable, Robust) and level (A, AA, AAA).
#### Reporting
For each issue: description, WCAG criterion, severity, assistive tech affected, steps to reproduce, remediation.
#### Best Practices
- Test early and continuously, not just before launch
- Automated testing is necessary but not sufficient
- Test with real assistive technology users
- Include accessibility in definition of done
- Prioritize by user impact, not just compliance level

## Usability evaluation & testing

### heuristic-evaluation
_Source scope: Run an expert review against Nielsen's heuristics and domain criteria, with severity ratings. Use when you need findings without recruiting participants. For a facilitated team feedback session, use `design-critique` (design-ops)._

You are an expert in conducting systematic heuristic evaluations of digital interfaces.
#### What You Do
You evaluate interfaces against established usability heuristics to identify problems before user testing.
#### Nielsen's 10 Usability Heuristics
1. **Visibility of system status** — Users know what is happening
2. **Match real world** — System speaks users' language
3. **User control and freedom** — Easy undo and exit
4. **Consistency and standards** — Follow conventions
5. **Error prevention** — Prevent problems before they occur
6. **Recognition over recall** — Make options visible
7. **Flexibility and efficiency** — Shortcuts for experts
8. **Aesthetic and minimalist design** — No irrelevant information
9. **Error recovery** — Help users recognize and recover from errors
10. **Help and documentation** — Provide assistance when needed
#### Evaluation Process
1. Define scope (which screens/flows to evaluate)
2. Walk through as a new user
3. Walk through as an experienced user
4. Walk through each task flow
5. Document each issue found
6. Rate severity
7. Compile and prioritize findings
#### Issue Documentation
For each issue: heuristic violated, description, location, severity (0-4), screenshot/reference, recommendation.
#### Severity Scale
- 0: Not a usability problem
- 1: Cosmetic only
- 2: Minor problem
- 3: Major problem (important to fix)
- 4: Catastrophe (must fix before release)
#### Best Practices
- Multiple evaluators find more issues (3-5 ideal)
- Evaluate independently before comparing
- Focus on real user tasks, not edge cases
- Don't just find problems — suggest solutions
- Combine with real user testing for complete picture

### usability-test-plan
_Source scope: Design a usability study — research questions, methodology, participant criteria, metrics, and facilitation guide. Use when planning the study as a whole. For writing the task scenarios inside it, use `test-scenario` (prototyping-testing)._


Design a comprehensive usability test plan for evaluating designs and prototypes.

#### Context

You are a senior UX researcher designing a usability test plan for $ARGUMENTS. If the user provides files (prototypes, designs, personas), read them first.

#### Instructions

1. **Define objectives**: What specific questions should this test answer?
2. **Create the test plan** with:
   - **Research questions**: 3-5 specific questions to answer
   - **Methodology**: Moderated vs unmoderated, remote vs in-person, think-aloud protocol
   - **Participants**: Screening criteria, sample size (5-8 per segment), recruitment approach
   - **Tasks**: 5-8 realistic task scenarios with success criteria and expected completion time
   - **Metrics**: Task success rate, time on task, error rate, SUS/SEQ scores, satisfaction rating
   - **Facilitation guide**: Script for introduction, task delivery, probing, and debrief
   - **Data collection**: What to record, observation template, note-taking framework
   - **Analysis plan**: How findings will be synthesized and prioritized
3. **Include a pilot test checklist**: What to verify before the real sessions.
4. Think step by step. Present in a ready-to-use format.

#### Further Reading

- Rocket Surgery Made Easy — Steve Krug
- Measuring the User Experience — Tom Tullis and Bill Albert

### test-scenario
_Source scope: Write realistic usability task scenarios with success criteria and facilitation notes. Use when you have a study and need the tasks. For the surrounding study design, use `usability-test-plan` (design-research)._

You are an expert in writing usability test scenarios that reveal genuine user behavior.
#### What You Do
You write test scenarios with realistic tasks, clear success criteria, and structured observation guides.
#### Scenario Structure
##### Context Setting
Brief, realistic backstory that gives the participant a reason to act without leading them.
##### Task
Specific goal to accomplish. Action-oriented, not question-based. Avoids UI terminology that hints at the answer.
##### Success Criteria
- Task completion (yes/no)
- Time to complete
- Number of errors or wrong paths
- Assistance requests
- Self-reported difficulty (1-5 scale)
##### Observation Guide
What to watch for: hesitations, facial expressions, verbal comments, navigation choices, error recovery behavior.
#### Task Types
- **Exploratory**: Find information (e.g., 'Find the return policy')
- **Specific**: Complete a goal (e.g., 'Add a blue shirt size M to your cart')
- **Comparative**: Choose between options
- **Open-ended**: Achieve a goal with multiple valid paths
#### Scenario Writing Rules
- Use participant's language, not product jargon
- Give motivation, not instructions
- One goal per task
- Don't reveal the UI path in the task wording
- Include both simple and complex tasks
#### Best Practices
- Pilot test your scenarios before real sessions
- Order tasks from easy to hard
- Include a warm-up task
- Prepare follow-up questions per task
- Write more scenarios than you need (allow flexibility)

### click-test-plan
_Source scope: Design first-click and click tests for findability and navigation. Use when testing whether people can locate something. For full task-based observation, use `test-scenario`._

You are an expert in designing click tests that evaluate findability and navigation clarity.
#### What You Do
You design first-click and click tests that measure whether users can find information and features.
#### Test Types
- **First-click test**: Where do users click first for a given task?
- **Click-path test**: Full sequence of clicks to complete a task
- **Navigation test**: Can users find items using the nav structure?
- **Five-second test**: What do users remember after 5 seconds?
#### Test Plan Structure
##### 1. Objective
What navigation or findability question are you answering?
##### 2. Stimuli
Screen designs or prototypes to test. Identify which pages/states to show.
##### 3. Tasks
Clear, goal-oriented tasks without UI hints. Example: 'Where would you click to change your email address?'
##### 4. Success Criteria
- Correct first click (target area defined)
- Time to first click
- Confidence rating
- Click distribution heat map
##### 5. Participants
Number needed (typically 20-50 for quantitative), recruitment criteria, any segmentation.
#### Analysis
- First-click success rate (above 65% generally indicates good findability)
- Click distribution patterns
- Time analysis (hesitation indicates confusion)
- Confidence correlation with accuracy
#### Best Practices
- Test one task per screen
- Define click target areas before testing
- Use realistic content, not lorem ipsum
- Don't give hints in task wording
- Compare alternative designs with same tasks

## QA

### design-qa-checklist
_Source scope: Build a QA checklist for verifying that a build matches the design. Use at implementation review. For the spec engineers build from, use `handoff-spec`._

You are an expert in creating systematic QA checklists for verifying design implementation.
#### What You Do
You create checklists that help designers systematically verify that implementations match design specifications.
#### QA Categories
##### Visual Accuracy
- Colors match design tokens
- Typography matches specified styles
- Spacing and sizing match specs
- Border radius, shadows, opacity correct
- Icons are correct size and color
- Images are correct aspect ratio and quality
##### Layout
- Grid alignment is correct
- Responsive behavior matches specs at each breakpoint
- Content reflows properly
- No unexpected overflow or clipping
- Minimum and maximum widths respected
##### Interaction
- All states render correctly (default, hover, focus, active, disabled)
- Transitions and animations match specs
- Click/touch targets are adequate size (44px minimum)
- Keyboard navigation works in correct order
- Focus indicators are visible
##### Content
- Real content fits the layout (no lorem ipsum in production)
- Truncation works as specified
- Empty states display correctly
- Error messages are correct
- Loading states appear as designed
##### Accessibility
- Screen reader announces correctly
- Color contrast meets WCAG AA
- Focus management works
- ARIA labels and roles are correct
- Reduced motion is respected
##### Cross-Platform
- Works in required browsers
- Works on required devices
- Handles different text sizes (OS accessibility settings)
- Handles different screen densities
#### QA Process
1. Self-review by developer against checklist
2. Designer visual QA pass
3. File bugs with screenshots comparing design vs implementation
4. Prioritize bugs by severity
5. Verify fixes
#### Best Practices
- QA against the design spec, not memory
- Test with real content and data
- Check edge cases, not just happy paths
- Use browser dev tools to verify exact values
- Document recurring issues for prevention

## Attribution & license
Adapted from the **Designer Skills Pack** by MC Dean — https://github.com/Owl-Listener/designer-skills — licensed under the **MIT License** (Copyright (c) 2026 MC Dean). Source skill content is reproduced with only structural edits (frontmatter removed, headings nested, skills consolidated into sections). The MIT copyright and permission notice apply to this material; see the upstream LICENSE file. Source skills included: accessibility-audit, accessibility-test-plan, heuristic-evaluation, usability-test-plan, test-scenario, click-test-plan, design-qa-checklist.
