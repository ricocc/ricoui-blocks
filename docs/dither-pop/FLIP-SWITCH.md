# Flip Switch

系列视觉规范见 [DITHER-POP.md](DITHER-POP.md)。分类为 `dither-pop`。

Published 2026-11-09. Category: Dither Pop (`dither-pop`). Design style: Dither Pop.

## Component

`registry/flip-switch.tsx` exports `FlipSwitch` and `FlipSwitchProps`. React + Motion, with no external assets, icons or website dependencies. All geometry, gradients and halftone patterns are inline SVG; IDs are unique per instance.

The base remains horizontal. A single spring drives the central rocker projection, including its face and side walls above a fixed bearing. OFF depresses the orange O side; ON depresses the yellow I side. A short held-pointer/key response moves the paddle toward its midpoint before release. Three strokes follow the active side, change length on hover/focus and briefly animate after state changes. The indicator moves smoothly between sides.

## API and behavior

- `checked` / `onCheckedChange`: controlled state.
- `defaultChecked`: initial uncontrolled state, false by default.
- `size`: sm 120px, md 180px (default), lg 240px, or custom width 64-600px. Responsive max-width 100%; minimum 44px button height.
- `baseColor`, `offColor`, `onColor`: CSS colors; defaults blue #0955ff, orange #ff8619, yellow #ffda00.
- `showRays`: optional decorative feedback, true by default.
- Native button attributes include disabled, aria-label, className and style. Default type is button; role is switch and aria-checked is boolean. The control does not submit a hidden form value.
- Click, Enter and Space toggle. Left/Home sets OFF; Right/End sets ON. Preventing the consumer click/key event prevents its associated state request.
- Disabled prevents activation. Keyboard focus has a visible dashed contour. Reduced motion jumps directly to the new pose and keeps rays static.

Preview background theme and state caption belong only to the website. The SVG keeps its own bright palette on either background. Configuration and Copy prompt are excluded from Registry source.

## Verification

Browser checks: pointer press/toggle, keyboard, stable dimensions, configuration and copied prompt, disabled, narrow viewport, reduced motion, standalone controlled/uncontrolled usage, prevented click and unique SVG IDs.

TypeScript, production build, Registry validation/build and shadcn install dry run passed. A separate React + Motion consumer rendered and toggled the generated Registry source successfully; one source file and the Motion dependency are distributed.

Visual refinement: 330px website preview; the rocker has a narrower, lower profile with more white plate visible around the screws. The complete rocker and its feedback strokes share one projection scale.

Pointer refinement: enlarged raised rays follow the hovered half independently of checked state. The concave rocker profile lowers its center seam. A shared spring-driven perspective tilt keeps the housing assembled; offset shadow and face lighting respond to pointer direction. Reduced motion disables tilt and jumps the indicator position.

The horizontal housing includes a thin plate bevel, recessed screw seats, subtle casting shading and a lower contact edge. The rocker seam has paired shadow/highlight edges; pointer glare is restrained to preserve saturated colors.

Pop shading refinement: horizontal housing, aligned screw centers, saturated flat casting facets, local halftone side shading and a crisp offset ground shadow. Highlights use filled bevel shapes; no blur filters or full-face white wash.

Panel detail refinement: pure-white face with one aligned lower bevel, contour-derived rocker highlights and a fine dotted ground shadow. Removed the stacked plate outlines and rectangular casting patches.
