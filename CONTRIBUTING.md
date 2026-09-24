# Contributing to Forge UI

Thanks for helping forge better components.

## Development

```bash
npm install
npm run dev
```

## Adding a component

1. Create `src/components/ui/<name>.tsx` — self-contained, copy-paste friendly.
2. Add a demo in `src/docs/demos.tsx`.
3. Add a `?raw` import in `src/docs/sources.ts`.
4. Register metadata in `src/docs/registry.ts`.
5. Prefer accessible markup, Tailwind tokens, and `prefers-reduced-motion` for motion.

## Pull requests

- Keep components original (no pasted third-party source).
- Run `npm run build` before opening a PR.
- Update docs screenshots if the landing or docs chrome changes.
