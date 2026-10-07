# Particle Mesh Gallery

Portfolio registry slug: `particle-mesh-gallery`. Export: `ParticleMeshGallery`.
The public registry command works after the updated library is deployed; before deployment use the local registry in GUIDE §7.

```tsx
import { ParticleMeshGallery } from '@/components/ui/particle-mesh-gallery'

export function Work() {
  return <ParticleMeshGallery items={[
    { id: 'coast', title: 'Coastal light', category: 'Photography / 2026',
      src: '/images/coast.jpg', alt: 'Low sunlight over a quiet coastline' },
    { id: 'terrain', title: 'Imagined terrain', category: 'Generative study', seed: 4 },
  ]} particleCount={4200} />
}
```

## Behavior

- Tap/click the sphere to reveal. Two clicks/taps within 350 ms gather it back into a sphere.
- Enter/Space toggles; Escape reforms; left/right arrows browse while the artwork is focused.
- Explicit Reveal/Reform and previous/next buttons provide gesture alternatives. Pause stops ambient rotation.
- Selection preserves the current image/sphere mode. `value`, `defaultValue`, and `onValueChange` use stable item IDs.
- `revealed`, `defaultRevealed`, and `onRevealedChange` control the morph separately. In controlled mode the parent must update its prop.
- An empty `items` array shows an empty state. An unknown selected ID displays the first item.

## Assets and rendering

Each image is cover-cropped to a 4:5 portrait. Use same-origin assets or an image server that permits anonymous CORS;
pixel sampling requires this even if an ordinary image element could display the URL. Failed or blocked assets show
original generated landscape art and an inline fallback notice. The default landscapes are drawn locally with canvas 2D;
there are no network requests, copied photos, WebGL, or extra runtime dependencies.

The canvas samples image colors onto a Fibonacci sphere. A damped spring interpolates those points into the portrait's
pixel grid, then blends in the full-resolution artwork. The spring reverses from its current position on interruption.
Particle count is approximately the requested value, clamped to 600–6000. DPR is capped at 2; resize, intersection,
and document-visibility observers manage drawing. Settled image and paused states stop their animation loops.

Reduced motion removes particles and rotation, switching between a static circular crop and the full portrait.
`theme="auto"` follows the nearest `.light` / `.dark` ancestor; explicit themes scope both the surface and canvas.
Use `className` for root sizing and `label` for the eyebrow and accessible gallery name.

## Review before changing this component

Test pointer double-click, two real touch taps, keyboard toggles, mid-transition reversal, navigation, pause/resume,
light/dark, reduced motion, 390 px width, empty items, a single item, invalid selected IDs, and image-loading failure.
Check controlled callbacks in a consuming app. Verify canvas frames stop offscreen and after unmount.
Use [GUIDE §7](../GUIDE.md#7-test-the-shadcn-install) to test the built registry item outside this repo.

With the dev server on port 5173 and Chrome installed, run `node scripts/test-particle-mesh-gallery.mjs`.
This checks pointer and touch gestures, keyboard navigation, paused/static frames, reduced motion, touch-target sizes,
and mobile overflow; screenshots go into the ignored `.shots/` directory. Set `FRAMEKIT_TEST_URL` to test the zero-prop
demo in a separate consuming app. This browser smoke test does not replace screen-reader or physical-device testing.
