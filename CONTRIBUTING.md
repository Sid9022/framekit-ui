# Contributing to Framekit UI

Thanks for helping Framekit grow.

**Start here → [GUIDE.md](GUIDE.md)**, the full walkthrough from clone to PR, including a working component template.
Using an AI assistant? It should read [AGENTS.md](AGENTS.md). For chat-only LLMs, use [docs/LLM_PROMPT.md](docs/LLM_PROMPT.md).

| Doc | Purpose |
|-----|---------|
| [GUIDE.md](GUIDE.md) | Setup, planning, writing, wiring, verifying, test-installing, PR |
| [AGENTS.md](AGENTS.md) | Condensed rules for AI coding agents (auto-read by most tools) |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Docs site + shadcn registry pipeline + theme system |
| [docs/COMPONENT_STANDARDS.md](docs/COMPONENT_STANDARDS.md) | Quality bar: API, motion, reduced motion, theming, a11y, perf, originality |
| [docs/CHECKLIST.md](docs/CHECKLIST.md) | Pre-PR checklist |
| [`.claude/skills/`](.claude/skills) | Design skill packs (motion craft, design system, interaction, a11y review, visual critique) |

## Development

```bash
npm install
npm run dev            # http://localhost:5173
npm run check:wiring   # component completeness check
npm run build          # must pass before a PR
```

## Adding a component (summary)

1. Create `src/components/ui/<slug>.tsx`: self-contained, copy-paste friendly, typed props with defaults.
2. Register metadata in `src/docs/registry.ts` (`unique: true, isNew: true`, `gesture`, `props`).
3. Add a demo module `src/docs/demos/<slug>.tsx` (`export default` a React node). The Code tab source is picked up automatically.
4. Accessible markup, light + dark, `prefers-reduced-motion`, no horizontal scroll at 390 px.

## Pull requests

- Keep components original (no pasted third-party source, assets, or brand colours). No three.js.
- Never rename existing slugs, exports, or props. Only add optional props.
- Run `npm run check:wiring` and `npm run build` before opening a PR, and fill in [docs/CHECKLIST.md](docs/CHECKLIST.md).
- Update docs screenshots if the landing or docs chrome changes.
