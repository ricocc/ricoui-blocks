export const componentCategories = [
  { slug: 'display', label: 'Display' },
  { slug: 'dither-pop', label: 'Dither Pop' },
  { slug: 'typography', label: 'Typography' },
  { slug: 'buttons', label: 'Buttons' },
  { slug: 'backgrounds', label: 'Backgrounds' },
  { slug: 'preloader', label: 'Preloader' },
] as const

export type ComponentCategory = (typeof componentCategories)[number]['slug']

export type ComponentSource =
  | { type: 'original' }
  | {
      type: 'inspired'
      name: string
      url: string
      author?: string
    }
  | {
      type: 'based-on'
      name: string
      url: string
      author?: string
      license: string
    }

export type ComponentProp = {
  defaultValue?: string
  description: string
  name: string
  type: string
}

export type ComponentMeta = {
  category: ComponentCategory
  dependencies: string[]
  description: string
  featured?: boolean
  interactionType?: string
  name: string
  /** First publication date (YYYY-MM-DD); editing a component does not change it. */
  publishedAt?: string
  props?: ComponentProp[]
  registryFile?: string
  slug: string
  source: ComponentSource
  usage?: string
}

const preloaderCommonProps: ComponentProp[] = [
  { name: 'progress', type: 'number', description: 'Required real loading progress, clamped to 0–100. Pass 100 when the application is ready.' },
  { name: 'onComplete', type: '() => void', description: 'Called once after the exit finishes. Keep mounted until this callback, then remove the overlay and restore focus. Change React key to replay.' },
  { name: 'className', type: 'string', description: 'Outer container classes. Give the parent an explicit height; use a fixed inset-0 wrapper for a full-screen overlay.' },
  { name: 'style', type: 'CSSProperties', description: 'Outer container styles. Uses optional host theme variables and a monospace font, with standalone color and font fallbacks.' },
]

export const components: ComponentMeta[] = [
  {
    slug: 'github-repo', name: 'GitHub Repo', publishedAt: '2026-11-11', category: 'dither-pop',
    dependencies: [], registryFile: 'registry/github-repo.tsx', source: { type: 'original' },
    description: 'A tactile repository card with a blue clasp, vector Octocat badge, warm halftone star button, and layered contact shadows.',
    interactionType: 'Pointer movement gently tilts the card. Hover sweeps light across the fixed badge and reveals blue rays above Stars. Press the star button to open GitHub. Counts are supplied by the caller. Reduced motion disables decorative movement.',
    props: [
      { name: 'owner', type: 'string', description: 'GitHub repository owner.' },
      { name: 'name', type: 'string', description: 'Repository name.' },
      { name: 'description', type: 'string', description: 'Repository description.' },
      { name: 'stars', type: 'number', defaultValue: '0', description: 'Star count supplied by your application.' },
      { name: 'forks', type: 'number', defaultValue: '0', description: 'Fork count supplied by your application.' },
      { name: 'visibility', type: 'string', defaultValue: 'Public', description: 'Repository visibility label.' },
      { name: 'starsLabel', type: 'string', defaultValue: 'stars', description: 'Custom star caption.' },
      { name: 'forksLabel', type: 'string', defaultValue: 'forks', description: 'Custom fork caption.' },
      { name: 'className', type: 'string', description: 'Additional outer container classes.' },
    ],
    usage: '<GithubRepo owner="ricocc" name="ricoui-blocks" stars={274} forks={39} />',
  },
  {
    slug: 'bell-button', name: 'Bell Button', publishedAt: '2026-11-10', category: 'buttons',
    dependencies: [], registryFile: 'registry/bell-button.tsx', source: { type: 'original' },
    description: 'A notification button with a bell, optional count badge, and the beveled light and dark finishes of RicoUI Button.',
    interactionType: 'Hover plays one damped swing around the top of the bell. Click, Enter, or Space activates the button. Control pressed for follow or notification toggles. Loading keeps the bell visible inside a spinning arc and prevents activation. Reduced motion keeps the arc and bell still.',
    props: [
      { name: 'pressed', type: 'boolean', description: 'Controlled toggle state. Update it in onClick and provide a stable aria-label when the visible label changes.' },
      { name: 'muted', type: 'boolean', defaultValue: 'false', description: 'Show a slashed, subdued bell. Pair with pressed for an accessible mute toggle.' },
      { name: 'count', type: 'number', description: 'Nonnegative integer displayed as a formatted badge on text buttons.' },
      { name: 'variant', type: '"primary" | "secondary" | "outline"', defaultValue: 'pressed ? "primary" : "secondary"', description: 'Set the finish independently of the toggle state.' },
      { name: 'size', type: '"sm" | "md" | "lg" | "icon"', defaultValue: '"md"', description: 'Use icon for a square bell. Its default accessible name is Notifications.' },
      { name: 'isLoading', type: 'boolean', defaultValue: 'false', description: 'Show the busy arc and block activation while saving.' },
      { name: 'loadingText', type: 'string', defaultValue: '"Saving…"', description: 'Visible label while a text button is busy.' },
      { name: 'theme', type: '"light" | "dark" | "inherit"', defaultValue: '"inherit"', description: 'Use a fixed palette or inherit the nearest CSS color-scheme.' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disable the native button.' },
      { name: 'children', type: 'ReactNode', description: 'Label for text sizes. Defaults to Notify me or Following.' },
    ],
    usage: `import { useState } from "react"
import { BellButton } from "@/components/ui/ricoui/bell-button"

// For manual installation, copy RicoUI Button (button.tsx) beside bell-button.tsx.
export function FollowButton() {
  const [following, setFollowing] = useState(false)
  return (
    <BellButton
      pressed={following}
      aria-label="Follow updates"
      count={1072}
      onClick={() => setFollowing(value => !value)}
    />
  )
}`,
  },
  {
    slug: 'button', name: 'Button', publishedAt: '2026-11-10', category: 'buttons',
    dependencies: [], registryFile: 'registry/button.tsx', source: { type: 'original' },
    description: 'A native button in the RicoUI palette, with light and dark themes, six variants, and built-in loading and disabled states.',
    interactionType: 'Click, Enter, or Space activates the button. Keyboard focus has a visible outline. Loading prevents activation and shows a spinner that stays still with reduced motion.',
    props: [
      { name: 'variant', type: '"primary" | "secondary" | "outline" | "ghost" | "destructive" | "success"', defaultValue: '"primary"', description: 'Visual treatment.' },
      { name: 'size', type: '"sm" | "md" | "lg" | "icon"', defaultValue: '"md"', description: 'Button size. Give icon-only buttons an accessible name with aria-label.' },
      { name: 'theme', type: '"light" | "dark" | "inherit"', defaultValue: '"inherit"', description: 'Set the palette explicitly or follow the nearest CSS color-scheme.' },
      { name: 'isLoading', type: 'boolean', defaultValue: 'false', description: 'Show a spinner, mark the button busy, and disable activation.' },
      { name: 'loadingText', type: 'string', description: 'Optional loading label for text buttons. Defaults to the current children.' },
      { name: 'leftIcon / rightIcon', type: 'ReactNode', description: 'Decorative icons before or after the label.' },
      { name: 'fullWidth', type: 'boolean', defaultValue: 'false', description: 'Fill the width of the parent.' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disable pointer and keyboard activation.' },
      { name: 'type', type: '"button" | "submit" | "reset"', defaultValue: '"button"', description: 'Native button type. Use submit for form submission.' },
      { name: 'className / style', type: 'string / CSSProperties', description: 'Additional styling. Other native button props, including ref, are forwarded.' },
    ],
    usage: `import { Button } from "@/components/ui/button"

export function SaveButton({ saving }: { saving: boolean }) {
  return <Button type="submit" isLoading={saving} loadingText="Saving…">Save changes</Button>
}`,
  },
  {
    slug: 'dither-progress', name: 'Dither Progress', publishedAt: '2026-11-09', category: 'dither-pop',
    dependencies: [], registryFile: 'registry/dither-progress.tsx', source: { type: 'original' },
    description: 'A horizontal Dither Pop progress bar with a blue capsule, lightning badge and warm halftone fill that grows denser as progress advances.',
    interactionType: 'Real progress drives the printed dots and percentage together with interruptible ease-out motion. Blue loading rays pulse while a yellow halftone scan travels upward through the lightning. Pointer movement tilts the housing with responsive highlights and an opposing ground shadow; completion reveals a check and yellow rays. Reduced motion and instant updates are supported. Demo playback is not part of the component.',
    props: [
      { name: 'value', type: 'number', description: 'Required actual progress from 0 to 100. Out-of-range values are clamped; non-finite values become zero.' },
      { name: 'size', type: '"sm" | "md" | "lg" | number', defaultValue: '"md"', description: 'Width: 300 / 440 / 580px, or custom width clamped to 180–900px. Shrinks to fit the parent.' },
      { name: 'baseColor', type: 'string', defaultValue: '"#1756ff"', description: 'Housing and printed ground-shadow color.' },
      { name: 'fillColor', type: 'string', defaultValue: '"#ff782b"', description: 'Warm dense-fill color.' },
      { name: 'highlightColor', type: 'string', defaultValue: '"#ffd528"', description: 'Sparse-fill and completion-ray color.' },
      { name: 'animated', type: 'boolean', defaultValue: 'true', description: 'Animate updates and decorative feedback. System reduced-motion preference takes priority.' },
      { name: 'duration', type: 'number', defaultValue: '700', description: 'Update duration in milliseconds, clamped to 0–5000. New updates continue from the current displayed value.' },
      { name: 'aria-label', type: 'string', defaultValue: '"Progress"', description: 'Accessible label for the task being measured. Standard progressbar semantics are included.' },
      { name: 'className / style', type: 'string / CSSProperties', description: 'Root presentation overrides. No external artwork, fonts or runtime dependencies.' },
    ],
    usage: `import { DitherProgress } from "@/components/ui/dither-progress"

export function Example({ progress }: { progress: number }) {
  return <DitherProgress value={progress} aria-label="Uploading files" />
}`,
  },
  {
    slug: 'flip-switch', name: 'Flip Switch', publishedAt: '2026-11-09', category: 'dither-pop',
    dependencies: ['motion'], registryFile: 'registry/flip-switch.tsx', source: { type: 'original' },
    description: 'A horizontal Dither Pop rocker switch with a blue housing, warm two-tone paddle and fine halftone details.',
    interactionType: 'Click, Enter or Space toggles ON/OFF. Left/Home selects OFF; Right/End selects ON. The paddle pivots around its center while the base stays still. Three animated rays respond to hover, keyboard focus and state changes. Disabled and reduced-motion states are supported.',
    props: [
      { name: 'checked', type: 'boolean', description: 'Controlled switch state. Pair with onCheckedChange.' },
      { name: 'defaultChecked', type: 'boolean', defaultValue: 'false', description: 'Initial ON/OFF state in uncontrolled usage.' },
      { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Receives the next state when the switch is activated. Disabled switches do not fire this callback.' },
      { name: 'size', type: '"sm" | "md" | "lg" | number', defaultValue: '"md"', description: 'Visual width: 120 / 180 / 240px, or a custom number clamped to 64-600px. Shrinks to fit its container.' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables pointer and keyboard activation and softens the colors.' },
      { name: 'baseColor', type: 'string', defaultValue: '"#0955ff"', description: 'Blue housing and animated ray color. Accepts CSS colors.' },
      { name: 'offColor', type: 'string', defaultValue: '"#ff8619"', description: 'Left OFF paddle color.' },
      { name: 'onColor', type: 'string', defaultValue: '"#ffda00"', description: 'Right ON paddle color.' },
      { name: 'showRays', type: 'boolean', defaultValue: 'true', description: 'Show the three feedback strokes on hover, keyboard focus and after toggling. Reduced motion uses static strokes.' },
      { name: 'aria-label', type: 'string', defaultValue: '"Power"', description: 'Accessible switch name; describe the setting controlled by this switch.' },
      { name: 'className / style', type: 'string / CSSProperties', description: 'Standard button presentation props. The artwork is transparent and uses no external assets.' },
    ],
    usage: `import { useState } from "react"
import { FlipSwitch } from "@/components/ui/flip-switch"

export function Example() {
  const [enabled, setEnabled] = useState(false)
  return <FlipSwitch checked={enabled} onCheckedChange={setEnabled} aria-label="Enable notifications" />
}`,
  },
  {
    slug: 'magnifier', name: 'Magnifier', publishedAt: '2026-11-07', category: 'display',
    dependencies: [], registryFile: 'registry/magnifier.tsx', source: { type: 'original' },
    description: 'A precision optical magnifier with a projected metal housing, inertial drag and a curved magnifying lens.',
    interactionType: 'Drag the lens or handle. Arrow keys move it; Home or Escape resets. Configurable return-to-center, optics, housing, springs and finishes. Idle, offscreen and hidden-tab rendering pauses; reduced motion disables tilt and springs. Only supplied Canvas content is magnified, not arbitrary DOM.',
    props: [
      { name: 'theme', type: '"light" | "dark" | "auto"', defaultValue: 'light', description: 'Surface theme passed to drawContent; also tunes glass and shadows.' },
      { name: 'lens', type: 'Partial<MagnifierLens>', description: 'Radius, bezel, housing depth, magnification (1.45 by default), texture quality, ticks and handle geometry. Values are clamped to safe ranges.' },
      { name: 'motion', type: 'Partial<MagnifierMotion>', description: 'Resting pitch/yaw, maximum inclination, springs, velocity response, pressScale, shadowStrength, shadowSoftness and glareStrength. Angles are degrees.' },
      { name: 'palette', type: 'Partial<MagnifierPalette>', description: 'Six-digit hex accent, handle and metal colors.' },
      { name: 'drawContent', type: '(context: CanvasRenderingContext2D, surface: MagnifierSurface) => void', description: 'Optional same-origin Canvas drawing callback. Called on resize/theme/content changes. No background or specimen copy is bundled. Keep the callback stable with useCallback when appropriate.' },
      { name: 'contentVersion', type: 'string | number', description: 'Invalidate cached drawing after external content changes.' },
      { name: 'returnToCenter', type: 'boolean', defaultValue: 'true', description: 'Return after drag release; false keeps the new position.' },
      { name: 'ariaLabel', type: 'string', defaultValue: 'Interactive magnifying glass', description: 'Accessible canvas name; keyboard instructions are supplied.' },
      { name: 'className / style', type: 'string / CSSProperties', description: 'Responsive wrapper; default aspect ratio 8:5, minimum height 320px. No forced background.' },
    ],
    usage: `import { Magnifier } from "@/components/ui/magnifier"

<Magnifier theme="light" lens={{ magnification: 1.45 }} />`,
  },

  {
    slug: 'file-organizer', name: 'File Organizer', publishedAt: '2026-11-07', category: 'dither-pop',
    dependencies: ['motion'], registryFile: 'registry/file-organizer.tsx', source: { type: 'original' },
    description: 'A colorful desktop file box with layered folders, crisp halftone surfaces and a staggered opening sequence.',
    interactionType: 'Hover an individual folder to lift it; activate any folder to open or close the whole group in sequence. Click outside or press Escape to close. Tab navigates folders. Pointer motion keeps the connected box shell rigid while loose folders receive subtle parallax. Three animated blue rays mark the hovered folder; the ground shadow stays flat. Reduced motion changes states immediately.',
    props: [
      { name: 'interactionMode', type: '"all" | "single"', defaultValue: 'all', description: 'Click to expand all folders, or only the activated folder. In single mode selecting another folder replaces the previous selection; outside click or Escape closes it.' },
      { name: 'title', type: 'string', defaultValue: 'Projects', description: 'Label on the blue back folder. Long visual labels are shortened; accessible labels retain the full text.' },
      { name: 'items', type: 'FileOrganizerItem[]', description: 'Back-to-front folders with unique id, title and blue / orange / yellow / white color. Defaults to Roadmap, Guidelines and Launch Plan. Three items work best; an empty array shows the back folder only.' },
      { name: 'open', type: 'boolean', description: 'Controlled group expansion. Pair with onOpenChange.' },
      { name: 'defaultOpen', type: 'boolean', defaultValue: 'false', description: 'Initial state in uncontrolled mode.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called with the requested group state on activation, outside click or Escape.' },
      { name: 'className', type: 'string', description: 'Outer sizing and presentation. Transparent background; defaults to width: 100% and max-width: 540px.' },
    ],
    usage: `import { FileOrganizer } from "@/components/ui/file-organizer"

<FileOrganizer title="Projects" />`,
  },

 {slug:'contribution-graph',name:'Contribution Graph',publishedAt:'2026-11-03',category:'display',dependencies:[],registryFile:'registry/contribution-graph.tsx',source:{type:'original'},description:'A five-level blue contribution heatmap with ASCII details and an interactive canvas companion.',interactionType:'Move your pointer to guide the companion; hover or click to pet it. Hover or focus a day for details. Arrow keys explore the calendar. Missing dates count as zero; duplicate dates are summed. A quiet final day preserves the previous streak. Arrow keys, Home and End navigate dates. Mobile calendars start at the latest week.',props:[{name:'data',type:'ContributionDay[]',description:'Daily YYYY-MM-DD dates and nonnegative counts.'},{name:'endDate',type:'string',description:'Last date, YYYY-MM-DD. Defaults to the latest data date, or today in UTC when empty.'},{name:'animation',type:"'always' | 'none'",defaultValue:'always',description:'Controls ambient and interaction motion; reduced motion is always respected.'},{name:'onDayHover',type:'(day: ContributionDay | null) => void',description:'Called when pointer or focus changes the active day, and with null on leave.'},{name:'title',type:'string',defaultValue:'Contribution activity',description:'Heading.'},{name:'className / style',type:'string / CSSProperties',description:'Container presentation.'}],usage:'<ContributionGraph data={[{ date: "2026-11-03", count: 12 }]} endDate="2026-11-03" />'},
  {
    slug: 'empty-states', name: 'Empty States', publishedAt: '2026-10-27', category: 'display',
    description: 'Twelve precision-crafted empty states with porcelain surfaces, recessed panels, chamfered frames and engraved details. Original SVG scenes with layered mechanical animation.',
    dependencies: [], registryFile: 'registry/empty-states.tsx',
    source: { type: 'original' },
    interactionType: 'All twelve states appear together. Each scene animates across several regions: a lens searches inside a pulsing radar, folder sheets float, tabs spread, list rows respond, disconnected ports and waves pulse, a lock rattles, an hourglass turns, and bell rings expand. All states start together and share a synchronized 5.6-second loop; each scene keeps its internal action sequence. Light and Dark controls stay in the configuration panel. Reduced motion and animated=false show static scenes. Illustrated controls are decorative.',
    props: [
      { name: 'state', type: '"blockedPage" | "noResults" | "noCommands" | "noTabs" | "emptyFolder" | "emptyList" | "loadFailed" | "nothing" | "offline" | "accessDenied" | "sessionExpired" | "noNotifications"', defaultValue: '"emptyFolder"', description: 'The product scenario to illustrate.' },
      { name: 'theme', type: '"light" | "dark" | "auto"', defaultValue: '"auto"', description: 'Auto follows prefers-color-scheme, independently of the host website theme.' },
      { name: 'title', type: 'string', defaultValue: 'State description', description: 'Accessible SVG title. Pass an empty string when adjacent text already describes the state.' },
      { name: 'animated', type: 'boolean', defaultValue: 'true', description: 'Enable state-specific looping micro-animations. Set false for a static illustration; reduced motion always disables animation.' },
      { name: 'width / height', type: 'number | string', defaultValue: '240 / 180', description: 'SVG dimensions. The viewBox stays 240 x 180.' },
      { name: 'className / style', type: 'string / CSSProperties', description: 'Standard SVG presentation props. All scene and symbol geometry is original; no icon package or external assets are required.' },
    ],
    usage: `import { EmptyStates } from "@/components/ui/empty-states"

<div className="flex flex-col items-center gap-4">
  <EmptyStates state="emptyFolder" theme="auto" title="" />
  <p>No bookmarks yet</p>
</div>`,
  },
  {

  slug: 'kubai-empty-states', name: 'Kubai Empty States', publishedAt: '2026-10-25', category: 'display',
    description: 'Twelve miniature product interfaces for empty, unavailable, and failed states. Self-contained SVG with light, dark, and system themes.',
    dependencies: [], registryFile: 'registry/kubai-empty-states.tsx',
    source: { type: 'inspired', name: 'Lumno · lumno.kubai.design', author: '枯白啃设计 (@Kubai087)', url: 'https://lumno.kubai.design' },
    interactionType: 'All twelve states appear together. Use the configuration panel to switch from Light (default) to Dark. SVG parts animate in place: trays slide, a shackle locks, a folder flap opens, a bell clapper swings, and disconnected signal arcs fade. Other states retain contextual search, typing, selection, and retry gestures. All share six-second loops with long rests and staggered phases. Includes offline, access denied, session expired, and no notifications. Reduced motion disables animation. Illustration controls are decorative; place your own real actions beside the SVG.',
    props: [
      { name: 'state', type: '"blockedPage" | "noResults" | "noCommands" | "noTabs" | "emptyFolder" | "emptyList" | "loadFailed" | "nothing" | "offline" | "accessDenied" | "sessionExpired" | "noNotifications"', defaultValue: '"emptyFolder"', description: 'The product scenario to illustrate.' },
      { name: 'theme', type: '"light" | "dark" | "auto"', defaultValue: '"auto"', description: 'Auto follows prefers-color-scheme, independently of the host website theme.' },
      { name: 'title', type: 'string', defaultValue: 'State description', description: 'Accessible SVG title. Pass an empty string when adjacent text already describes the state.' },
      { name: 'animated', type: 'boolean', defaultValue: 'true', description: 'Enable state-specific looping micro-animations. Set false for a static illustration; reduced motion always disables animation.' },
      { name: 'width / height', type: 'number | string', defaultValue: '160 / 120', description: 'SVG dimensions. The viewBox stays 160 × 120.' },
      { name: 'className / style', type: 'string / CSSProperties', description: 'Standard SVG presentation props. Icons are embedded Remix Icon v4.6.0 paths; their Apache-2.0 license is included in the source.' },
    ],
    usage: `import { KubaiEmptyStates } from "@/components/ui/kubai-empty-states"

<div className="flex flex-col items-center gap-4">
  <KubaiEmptyStates state="emptyFolder" theme="auto" title="" />
  <p>No bookmarks yet</p>
</div>`,
  },
  {
    slug: 'popin-preloader', name: 'Popin Preloader', publishedAt: '2026-10-22', category: 'preloader',
    description: 'A pale blue-gray loading screen with a brand-blue sweep, elastic Ready letters, and an upward curtain exit.',
    dependencies: ['gsap'], registryFile: 'registry/popin-preloader.tsx', source: { type: 'original' },
    interactionType: 'When loading finishes, the blue layer sweeps across and Ready appears letter by letter. The counter follows the color sweep. Ready waits for a click or keyboard activation before the curtain lifts.',
    props: [...preloaderCommonProps,
      { name: 'label', type: 'string', defaultValue: '"Loading"', description: 'Short loading text.' },
      { name: 'readyLabel', type: 'string', defaultValue: '"Ready"', description: 'Elastic ready text.' },
      { name: 'loadingStatus', type: 'string', defaultValue: '"Loading"', description: 'Pointer-following status with automatic animated dots while loading; fixed on touch devices and with reduced motion.' },
      { name: 'readyStatus', type: 'string', defaultValue: '"Click enter"', description: 'Ready status prompt and accessible activation label.' },
      { name: 'waitForInteraction', type: 'boolean', defaultValue: 'true', description: 'Wait for click or keyboard activation; false exits after the letters finish.' },
    ],
    usage: `import { useState } from "react"
import { PopinPreloader } from "@/components/ui/popin-preloader"

export function LoadingOverlay({ ready }: { ready: boolean }) {
  const [finished, setFinished] = useState(false)
  if (finished) return null
  return <div className="fixed inset-0 z-50">
    <PopinPreloader progress={ready ? 100 : 0} onComplete={() => setFinished(true)} />
  </div>
}`,
  },
  {
    slug: 'clip-image-preloader', name: 'Clip Image Preloader', publishedAt: '2026-10-22', category: 'preloader',
    description: 'A logo and counter lead into seven clipped photographs, arranged as a responsive montage, then darkened and lifted away.',
    dependencies: ['gsap'], registryFile: 'registry/clip-image-preloader.tsx', source: { type: 'original' },
    interactionType: 'Loading completion fades the logo and counter upward. Image masks open with a 350ms stagger, then a blue veil sweeps over the stationary images and lifts to reveal the page.',
    props: [...preloaderCommonProps,
      { name: 'images', type: 'string[]', description: 'Required image URLs, up to seven. Preload them before passing 100. Preview photos are not distributed.' },
      { name: 'logo', type: 'ReactNode', description: 'Your logo, image, SVG, or wordmark. Logo images and SVGs are 50px high.' },
      { name: 'label', type: 'string', defaultValue: '"Loading"', description: 'Accessible progress name and fallback wordmark when logo is omitted.' },
    ],
    usage: `import { ClipImagePreloader } from "@/components/ui/clip-image-preloader"

<ClipImagePreloader progress={progress}
  images={["/photos/01.jpg", "/photos/02.jpg", "/photos/03.jpg"]}
  logo={<img src="/logo.svg" alt="Studio" />}
  onComplete={hideOverlay} />`,
  },
  {
    slug: 'step-overlap-preloader', name: 'Step Overlap Preloader', publishedAt: '2026-10-22', category: 'preloader',
    description: 'A softly blurred letter entrance and corner counter, followed by white, pale blue, and brand-blue curtains that lift in sequence.',
    dependencies: ['gsap'], registryFile: 'registry/step-overlap-preloader.tsx', source: { type: 'original' },
    interactionType: 'Letters reveal from the right with blur. At 100%, a one-second hold precedes the text fade and three staggered curtain exits.',
    props: [...preloaderCommonProps,
      { name: 'label', type: 'string', defaultValue: '"Creative Designer"', description: 'Custom text displayed in the center and animated letter by letter. Omit it to display Creative Designer.' },
    ],
    usage: `import { StepOverlapPreloader } from "@/components/ui/step-overlap-preloader"

<StepOverlapPreloader
  label="Your Studio"
  progress={progress}
  onComplete={hideOverlay}
/>`,
  },
  {
    slug: 'social-card',
    name: 'Social Card',
    publishedAt: '2026-10-16',
    category: 'display',
    description: 'A stack of social links with luminous gradients, blurred color, and fine grain. Hover or focus to spread the centered cards in both directions; touch devices show an open grid. Includes a standalone HTML version.',
    dependencies: [],
    interactionType: 'Hover or focus the centered stack to reveal every link. Cards scale to fit their container and lift on hover; touch and reduced motion use a spread layout.',
    registryFile: 'registry/social-card.tsx',
    props: [
        { name: 'items', type: 'SocialCardItem[]', description: 'Required links: platform, href, username, and an optional accessible label. Platforms: github, twitter, behance, dribbble, email. Filter or reorder this array to choose the visible cards.' },
      { name: 'layout', type: '"stack" | "grid"', defaultValue: '"stack"', description: 'Use a hover-to-spread stack on mouse devices, or keep the cards in an open grid. Stacked cards shrink to fit narrow containers.' },
      { name: 'direction', type: '"left" | "center" | "right"', defaultValue: '"center"', description: 'Anchor the stack left, center or right. Center keeps the first card in place and alternates later cards left and right; right spreads right to left.' },
      { name: 'size', type: 'number', defaultValue: '120', description: 'Square card size in pixels, clamped to 64–240.' },
      { name: 'className', type: 'string', description: 'Classes applied to the outer container.' },
      { name: 'style', type: 'CSSProperties', description: 'Inline styles applied to the outer container.' },
      { name: 'aria-label', type: 'string', defaultValue: '"Social links"', description: 'Accessible name for the list of social links.' },
    ],
    usage: `import { SocialCard, type SocialCardItem } from "@/components/ui/social-card"

const links: SocialCardItem[] = [
  { platform: "github", href: "https://github.com/ricocc", username: "author" },
  { platform: "twitter", href: "https://x.com/ricouii", username: "author" },
  { platform: "email", href: "mailto:hello@example.com", username: "author" },
]

export function Example() {
  return <SocialCard items={links} />
}`,
    source: { type: 'original' },
  },
  {
    slug:'ascii-background',name:'ASCII Background',
    publishedAt: '2026-10-13',
    description:'Blue ASCII currents drift across light and dark canvases, with ripples that follow your pointer. Available as a React component or a standalone HTML file.',
    category:'backgrounds',dependencies:[],
    interactionType:'Move your pointer to scatter the field and create ripples. Animation pauses offscreen and respects reduced motion.',
    registryFile:'registry/ascii-background.tsx',
    props:[
      {name:'theme',type:'"light" | "dark"',defaultValue:'"light"',description:'Choose the background and glyph palette.'},
      {name:'paused',type:'boolean',defaultValue:'false',description:'Pause animation and pointer interaction.'},
      {name:'className',type:'string',description:'Classes applied to the background container.'},
      {name:'style',type:'CSSProperties',description:'Override container size and positioning.'},
    ],
    usage:`import { AsciiBackground } from "@/components/ui/ascii-background"

export function Example() {
  return <AsciiBackground style={{ height: 480 }} />
}`,
    source:{type:'original'},
  },
  {
    slug: 'smoke-test',
    name: 'Smoke Test',
    description:
      'A temporary catalog entry used to verify metadata, filtering, and detail routing before the first distributable component is added.',
    category: 'display',
    dependencies: [],
    interactionType: 'Static catalog validation.',
    featured: true,
    source: { type: 'original' },
  },
]

export const publishedComponents = components.filter(component => Boolean(component.registryFile))

export function getComponentBySlug(slug: string) {
  return components.find((component) => component.slug === slug)
}

export function getCategoryLabel(category: ComponentCategory) {
  return componentCategories.find((item) => item.slug === category)?.label ?? category
}
