# Cook Loading

An illustrated chef cooks while the host application loads. The `cook-loading` registry item contains the complete
component and an embedded eight-pose WebP, so installs do not depend on this site's public assets or an image CDN.

## Install and use

After this change is published:

```sh
npx shadcn@latest add https://framekit-ui.vercel.app/r/cook-loading.json
```

Before publishing, test the built local URL as described in [GUIDE §7](../GUIDE.md#7-test-the-shadcn-install).

```tsx
import { CookLoading } from '@/components/ui/cook-loading'

// Indeterminate: replace with content when your actual request finishes.
export function Page({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return <main className="flex min-h-[70vh] flex-col items-center justify-center">
    <div aria-busy={loading}>{loading ? null : children}</div>
    {loading && <CookLoading label="Preparing your workspace…" />}
  </main>
}
```

```tsx
// Determinate: progress is supplied by your upload, import, or loading task.
<CookLoading progress={uploadPercent} label="Adding your recipes…" />

// Optional error recovery: the parent owns both retry work and the state change.
<CookLoading
  state={failed ? 'error' : ready ? 'done' : 'loading'}
  onRetry={retryRequest}
  errorLabel="We couldn’t load your kitchen."
  description={failed ? 'Check your connection, then try again.' : undefined}
/>

// Compact and theme-scoped. Animation can be controlled independently of the task.
<CookLoading size={180} theme="dark" accent="#bb653a" paused={paused} onPausedChange={setPaused} />
```

The loader does not fetch data, fake progress, hold up navigation, trap focus, lock scroll, or wait for an animation
before allowing the host to show content. Mount it in the loading region, then unmount it when loading finishes.
For brief requests, apply any show-delay/minimum-duration policy in the host rather than to the network operation.

## Behavior and accessibility

- Without `progress`, the progressbar is indeterminate and omits `aria-valuenow`. It has no misleading numeric fill.
- Finite progress is clamped to 0–100; `NaN`/infinity become indeterminate. There is no self-incrementing percentage.
- When `state` is omitted, progress 100 selects `done`. Explicit `state` takes priority, including `error` at 100%.
- Pause freezes the illustration and steam. It never pauses the host operation or hides progress updates.
- `paused` is controlled when supplied; update it from `onPausedChange`. Otherwise `defaultPaused` initializes local state.
- Done/error stop cooking and show distinct icons and captions. Retry appears only when `onRetry` is provided.
- Keyboard users can operate native pause/retry buttons. Touch targets are at least 44 px.
- Reduced motion uses the first chef pose with no steam or looping frames. Progress and state information remain available.
- A polite live region announces state changes and 10% progress milestones rather than every animation frame.
- `showLabel={false}` hides captions visually while retaining the accessible progress name and status.
- The host region should use `aria-busy`; avoid putting the loader's own live region inside an `aria-busy` region if
  announcements must be delivered during loading (place the status outside that busy region).

## Assets and performance

The source asset is [chef-sprite.webp](../assets/cook-loading/chef-sprite.webp), 1774×887 pixels, about 242 KB.
It was generated with the built-in imagegen tool using the user-supplied chef as a style reference; the original source
file stays outside the runtime. [Asset provenance and exact prompt](../assets/cook-loading/README.md).

The component embeds a base64 copy to honor the library's one-file registry contract. This increases the source file size;
consider lazy-loading the component for routes that don't need it. Content Security Policy must permit `img-src data:`
for this embedded image. There are no new runtime packages and no external image requests.

The canvas has a fixed aspect ratio, DPR capped at 2, and a ResizeObserver. Its frame loop stops when offscreen,
the tab is hidden, paused, reduced-motion is enabled, the state is done/error, or the component unmounts.
`size` clamps to 160–480 and shrinks to its container; speed clamps to 0.5–2. The orange backdrop can be recolored with
`accent`; the chef's ink/ivory raster palette remains fixed. `theme` controls the surface accents and canvas steam.

When replacing the asset, retain the 4×2 layout, update `FRAMES` to match its alpha bounds if needed, then run
`node scripts/embed-cook-sprite.mjs` and the usual wiring/build/install checks. Do not hand-edit generated registry JSON.

## Verification

Start the docs server, then run `node scripts/test-cook-loading.mjs` (uses installed Chrome and the repo's Playwright).
Screenshots are written to ignored `.shots/`. The demo supplies state controls and optional manual progress so integration
states can be inspected without an artificial timer. Also test-installed via shadcn in a separate React/Tailwind app.
Browser automation covers interaction and rendering, not a full NVDA/VoiceOver or physical-device audit.

Reference guidance consulted: [Motion animation](https://motion.dev/docs/react-animation),
[Motion transitions](https://motion.dev/docs/react-transitions),
[WAI range values](https://www.w3.org/WAI/ARIA/apg/practices/range-related-properties/), and
[WAI progress announcements](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA25).
