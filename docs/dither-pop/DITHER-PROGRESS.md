# Dither Progress

系列视觉规范见 [DITHER-POP.md](DITHER-POP.md)。分类为 `dither-pop`。

Published 2026-11-09 · Display · Dither Pop.

`registry/dither-progress.tsx` exports `DitherProgress` and `DitherProgressProps`.
Independent React + inline SVG; no external artwork, fonts, helpers or runtime dependencies.
The housing is horizontal and front-facing. Its sidewall, cloud-shaped lightning badge,
colored halftone fill and dotted ground shadow preserve the illustration style.

## Usage

```tsx
import { DitherProgress } from '@/components/ui/dither-progress'

<DitherProgress value={75} aria-label="Uploading files" />
```

Install through `https://blocks.ricoui.com/r/dither-progress.json` after publishing,
or copy the source. Pass actual progress; no timer or simulated data is bundled.

- `value`: required number, clamped to 0–100; non-finite input becomes 0.
- `size`: sm / md / lg = 300 / 440 / 580px, or custom width 180–900px. Responsive to parent width.
- `baseColor`, `fillColor`, `highlightColor`: CSS colors; default blue #1756ff, orange #ff782b, yellow #ffd528.
- `animated`: true by default; false disables tweening, hover movement and decorative animation.
- `duration`: update duration in ms, default 700, clamped to 0–5000.
- `aria-label`: accessible task name; defaults to Progress. Root has progressbar semantics and exposes the target value.
- `className`, `style`: root presentation overrides.

Updates ease out from the currently displayed value, including decreasing values and
interrupted transitions. The percentage and fill use the same animated value. Dot size
and coverage increase as progress rises; completion changes the badge to a check and
changes the loading rays from blue to yellow while preserving their continuous staggered animation. Initial progress is rendered directly, including on the server.
System reduced motion takes priority. Animation frames are canceled on updates/unmount;
no JavaScript animation loop runs when the value is settled.

Loading shows three staggered blue rays and a yellow halftone scan moving upward inside the lightning glyph. Pointer motion gently rotates the housing in perspective; the ground shadow moves oppositely and the shell highlight follows the pointer. Leaving or window blur restores the front view. Touch, reduced motion and animated=false disable pointer tilt. The shadow is a separate stationary-plane SVG, not part of the rotated object.

The component is a read-only indicator, not a slider. Its pointer feedback does not change
progress. The website-only preview provides Play/Pause/Replay, preset progress buttons,
a range input, colors, width, motion settings and background theme. None are distributed.

## Validation

Browser checks cover start/middle/complete, replay/pause, reduced motion, settings and
mobile bounds. Registry validation/build, shadcn install dry run and production/TypeScript builds passed. The generated source was independently rendered and checked for clamped/non-finite input, interrupted updates, unique instance IDs and narrow containers.

Pointer entry and exit share a stable untransformed hit area. Decorative layers ignore pointer events; tilt, shadow and highlight interpolate back smoothly. Loading and completed rays share one continuous animation, with only the stroke color changing.
