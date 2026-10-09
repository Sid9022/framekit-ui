# Cook Loading illustration

Generated on 2026-10-08 with the built-in imagegen tool. The user's supplied chef illustration served as the style
reference; the output is an original eight-pose cooking atlas. No reference photo or third-party URL is shipped.

Selected artifact: `chef-sprite.webp`, 1774×887, alpha preserved. Encoded from the generated PNG as WebP at quality 84
and alpha quality 100. No background removal or semantic image editing was performed after generation.
The source PNG is retained in the generation tool's output directory; the runtime embeds this WebP in `cook-loading.tsx`.

## Exact generation prompt

Use case: illustration-story. Asset type: production animation sprite sheet for a web loading component. Use the supplied image as a style reference ONLY; create an original clean editorial cut-paper chef illustration with ivory double-breasted jacket, tall white pleated toque, black featureless face silhouette and black hands, warming amber food in a charcoal wok. NO orange circle, NO background, no decorative flecks outside the food, NO text. Output a precisely aligned 4 columns by 2 rows sprite sheet, eight equal square cells, transparent background, total image 1536x768 or 2048x1024. Same chef and stove in ALL eight cells, waist up with tabletop, identical position and scale. Each cell contains the complete chef, wok, single burner and short counter baseline with generous 10% cell margins. All hats tops at same height and all counter baselines at exactly same height within their cells. Sequential animation poses read left to right, then second row: chef stirring wok with right hand while left hand holds its handle, circular stirring rhythm, hands change gradually, slight head nod, tiny warm pieces of food hop and settle. Frames 1 through 8 form a seamless full stir cycle, small changes only, head/torso/pan/stove stay registered in place. Maintain exact consistent proportions, clothing, illustration linework, pan location and stroke weights in every frame; do not introduce extra utensils or duplicate limbs. Flat ink and cream shapes, subtle elegant hand-drawn contours, restrained golden food accent, no gradients or shadow around the sheet. The outside and between sprites must be actual alpha transparency. No labels, grid lines, numbering, or watermark.

Tool setting: `transparent_background: true`.

## Registration

The tool returned 1774×887 rather than the requested dimensions. The component uses the actual measured alpha bounds
for each pose and paints them at a shared scale and baseline. `scripts/embed-cook-sprite.mjs` updates the inline WebP
without changing those coordinates. If changing the source dimensions/layout, update the frame rectangles too.
