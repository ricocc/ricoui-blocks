# File Organizer

系列视觉规范见 [DITHER-POP.md](DITHER-POP.md)。分类为 `dither-pop`。

`registry/file-organizer.tsx` exports `FileOrganizer`, `FileOrganizerProps` and `FileOrganizerItem`. Requires React, Tailwind CSS 4 and `motion`; no images, icons, host theme variables or website helpers.

## Usage

```tsx
import { FileOrganizer } from '@/components/ui/file-organizer'

<FileOrganizer title="Projects" defaultOpen={false} />
```

Controlled usage:

```tsx
const [open, setOpen] = useState(false)

<FileOrganizer
  title="Studio"
  open={open}
  onOpenChange={setOpen}
  items={[
    { id: 'research', title: 'Research', color: 'white' },
    { id: 'identity', title: 'Identity', color: 'orange' },
    { id: 'release', title: 'Release notes', color: 'yellow' },
  ]}
/>
```

Items are ordered back to front with stable unique IDs. Three items are the intended composition. Empty arrays are supported. Long labels are visually shortened; the accessible description retains full titles. The permanent blue backing uses `title`. `className` controls outer presentation; default width is 100%, max-width 540px. The SVG scales proportionally on a transparent background and reserves space for expansion.

## Interaction and layers

- Each folder is a focusable SVG button with a full accessible label and focus-visible contour. Hover/focus lifts only that folder; click, Enter or Space toggles the whole group.
- Opening proceeds back to front; closing reverses the order. A 380ms visual spring duration and bounded 120ms stagger keep the sequence compact. An already-open hovered folder lifts another 5 SVG units.
- Clicking outside the folder controls (including the box and surrounding whitespace) or pressing Escape closes the group. Pointer leave only resets tilt and hover. Document listeners are mounted only while open and cleaned up on close/unmount.
- `open` / `onOpenChange` support normal controlled use; `defaultOpen` initializes uncontrolled use. Individual expansion overrides are no longer used.
- Connected cavity, front and side share a single SVG projection so their seams cannot drift under tilt. Only loose folders receive bounded depth-weighted parallax inside a stationary shell-space clip. Pointer tilt remains bounded to 7 degrees horizontally and 5 vertically; the separate ground shadow stays flat. This replaces the earlier independent translateZ planes, which opened structural seams.
- The ground shadow is a separate sibling outside the rotated volume and responds only through a subtle offset and scale. SVG patterns draw the folder, side and shadow halftone; IDs are unique per component instance.
- Three larger blue rays appear outside the active folder upper-left corner and animate their lengths with staggered cycles. A single persistent indicator springs between targets and fades in/out, preserving its animation phase; backing-specific spacing clears the curved edge. Reduced motion shows static rays. Hover lift is 8 units for files and 10 for the backing; content insets fade in only when expanded.
- Hover selection follows actual pointer movement, avoiding enter/leave loops when an animated edge moves beneath a stationary pointer. Transparent 3D wrappers do not intercept file hit targets. The opaque box foreground shields lower file areas.
- Reduced motion responds to live preference changes, disables perspective/hover travel and immediately changes the expanded arrangement. Fixed aspect ratio reserves expansion space without layout movement.

The website settings dock edits all four labels, toggles the group and resets defaults. Preview code and screenshot artwork are not distributed. Route: `/components/file-organizer`.

## Verification (2026-11-07)

- TypeScript / production build and shadcn Registry validation / build passed.
- shadcn install dry-run resolves one component file and the `motion` dependency.
- Browser checks cover pointer hover, click, keyboard, repeated activation, settings, constant layout dimensions, mobile overflow, controlled/uncontrolled modes, custom and empty data, instance IDs and reduced motion. No browser runtime errors.

## Click modes (2026-11-08)

`interactionMode="all"` preserves staggered group expansion. `interactionMode="single"` opens only the activated folder, switches selection on another click, and closes it when activated again. Controlled `open` remains the overall visibility; an initially open single-mode instance selects the back folder. Enter/Space, outside click and Escape work in both modes. The preview exposes Click behavior and includes it in Copy prompt.

Expanded lift was reduced on 2026-11-08: Projects 48 SVG units; front files 60/52/44 units back-to-front. Indicator anchors use the same offsets in all and single modes.

## Compact seated proportions (2026-11-10)

The blue backing's top is 32 SVG units lower than the original (raised 10 units from the initial compact revision, about 4%), with the left/right shoulder difference reduced from 34 to 24 units. Its bottom remains at 264. The Projects label is approximately 10% smaller and positioned lower within the revised upper shoulder.

Front-file shoulder insets interpolate from 10 units at the back to zero at the front: the default white Roadmap drops 10 units from the original, orange Guidelines drops 5 units, and yellow Launch Plan stays unchanged. The compact revision was raised by 14 units for Roadmap (about 6%) and 7 units for Guidelines (about 3%) so both titles clear the next folder. Only exposed shoulder geometry, labels and corresponding highlights change; the bottom contours, box, clipping and expansion travel stay fixed. Hover-ray anchors follow the new shoulder positions in both click modes.

Verified group expansion, keyboard dismissal, stable layout and browser rendering; updated catalog artwork and generated Registry source.

On 2026-11-10, Projects expanded travel increased from 48 to 52 SVG units (approximately 8%). The matching ray anchor uses the same travel in both click modes; the closed pose is unchanged.
