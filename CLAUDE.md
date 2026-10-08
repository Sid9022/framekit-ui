@AGENTS.md

## Claude Code specifics

- The project skills in `.claude/skills/` load automatically. When building or reviewing a component, apply
  `premium-ui-motion-craft` first, then the companion skills as needed (see the table in AGENTS.md).
- Before you call a component done: run `npm run check:wiring` and `npm run build`, and open
  `http://localhost:5173/docs/<slug>` to check it in both preview themes (the sun/moon toggle in the preview toolbar),
  at 390 px width, with keyboard only, and with reduced motion emulated.
- Walkthrough and templates: GUIDE.md. Quality patterns: docs/COMPONENT_STANDARDS.md. Final gate: docs/CHECKLIST.md.
