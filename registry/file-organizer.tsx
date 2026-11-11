"use client"

import { useEffect, useId, useRef, useState, useSyncExternalStore, type PointerEvent, type KeyboardEvent, type FocusEvent, type ReactNode } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'

export interface FileOrganizerItem {
  id: string
  title: string
  color: 'blue' | 'orange' | 'yellow' | 'white'
}

export interface FileOrganizerProps {
  title?: string
  /** Ordered back to front. Use unique IDs; three items work best. */
  items?: FileOrganizerItem[]
  /** Expand all folders together, or only the activated folder. */
  interactionMode?: 'all' | 'single'
  open?: boolean
  defaultOpen?: boolean
  /** Called when a folder is activated, outside is clicked, or Escape is pressed. */
  onOpenChange?: (open: boolean) => void
  className?: string
}

const defaultItems: FileOrganizerItem[] = [
  { id: 'roadmap', title: 'Roadmap', color: 'white' },
  { id: 'brand', title: 'Guidelines', color: 'orange' },
  { id: 'launch', title: 'Launch Plan', color: 'yellow' },
]
const ink = '#101e3c'
const colors = { blue: '#2463ff', orange: '#ff9c41', yellow: '#ffda26', white: '#fffefa' }
// Lower only the exposed shoulder; the seated bottom and box occlusion stay fixed.
const folderPath = (inset = 0) => `M0 ${20+inset}Q0 ${inset} 20 ${inset}H151Q162 ${inset} 169 ${9+inset}L180 ${22+inset}Q186 ${29+inset} 199 ${29+inset}H286Q310 ${29+inset} 310 ${53+inset}V230Q310 246 294 246H17Q0 246 0 229Z`
// Fixed warm halftone follows the folder surface and continues behind the box.
const yellowDots = Array.from({ length: 460 }, (_, index) => {
  const row = Math.floor(index / 20)
  const x = 150 + (index % 20) * 8 + (row % 2) * 4
  const y = 66 + row * 8
  const coverage = 1 - ((x - 284) / 124) ** 2 - ((y - 153) / 86) ** 2
  const radius = .65 + Math.max(0, coverage) * 2.05
  return { x, y, radius, coverage }
}).filter(dot => dot.coverage > 0 && dot.x + dot.radius < 306)
const folder = folderPath()
const shoulderInset = (depth: number) => 10 * (1 - depth)
const back = 'M0 82C0 49 25 22 57 22H101Q116 22 125 12Q137-2 157-2H265C296-2 316 22 316 54V264H0Z'

/** Vector file box: individual hover, sequential group expansion, outside-click dismissal. No external assets or host tokens. */
export function FileOrganizer({ title = 'Projects', items = defaultItems, open, defaultOpen = false, onOpenChange, interactionMode = 'all', className = '' }: FileOrganizerProps) {
  const uid = 'fo-' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const reduced = useSyncExternalStore(subscribeReducedMotion, () => window.matchMedia('(prefers-reduced-motion: reduce)').matches, () => true)
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const [hovered, setHovered] = useState(false)
  const expanded = open ?? internalOpen
  const [selectedFolder, setSelectedFolder] = useState('back')
  const isExpanded = (key: string) => expanded && (interactionMode === 'all' || selectedFolder === key)
  const [activeFolder, setActiveFolder] = useState<string | null>(null)
  const [focusedFolder, setFocusedFolder] = useState<string | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const isActive = (key: string) => (activeFolder ?? focusedFolder) === key
  function changeOpen(next: boolean) {
    if (open === undefined) setInternalOpen(next)
    onOpenChange?.(next)
  }
  function toggleFolder(key: string) {
    if (interactionMode === 'single') { setSelectedFolder(key); changeOpen(!(expanded && selectedFolder === key)) }
    else changeOpen(!expanded)
  }
  useEffect(() => {
    if (!expanded) return
    function dismiss(event: MouseEvent) {
      const target = event.target
      if (target instanceof Element && root.current?.contains(target) && target.closest('[data-folder]')) return
      changeOpen(false)
    }
    function escape(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') { changeOpen(false); setActiveFolder(null) }
    }
    document.addEventListener('click', dismiss, true)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('click', dismiss, true); document.removeEventListener('keydown', escape) }
  }, [expanded, open, onOpenChange])
  function folderKeyboard(event: KeyboardEvent<SVGGElement>, key: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      event.stopPropagation()
      if (!event.repeat) toggleFolder(key)
    }
  }
  function folderEvents(key: string, label: string) {
    return {
      role: 'button', tabIndex: 0, 'data-hover-key': key, 'aria-label': label, 'aria-expanded': isExpanded(key),
      onClick: () => toggleFolder(key),
      onKeyDown: (event: KeyboardEvent<SVGGElement>) => folderKeyboard(event, key),
      onFocus: (event: FocusEvent<SVGGElement>) => setFocusedFolder(event.currentTarget.matches(':focus-visible') ? key : null),
      onBlur: () => setFocusedFolder(previous => previous === key ? null : previous),
    }
  }
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateX = useSpring(pointerX, { stiffness: 190, damping: 25 })
  const rotateY = useSpring(pointerY, { stiffness: 190, damping: 25 })
  const shadowX = useTransform(rotateY, value => reduced ? 0 : value * -.9)
  const shadowY = useTransform(rotateX, value => reduced ? 0 : value * .4)
  const projectLabel = fitLabel(title, 86, 18)
  const indicatorKey = activeFolder ?? focusedFolder
  const indicatorIndex = items.findIndex(item => 'item:' + item.id === indicatorKey)
  const indicatorDepth = items.length <= 1 ? 1 : indicatorIndex / (items.length - 1)
  const indicator = indicatorKey === 'back'
    ? { x: 160, y: 251 + (isExpanded(indicatorKey ?? '') ? -66 : 0) - (reduced ? 0 : isExpanded(indicatorKey ?? '') ? 5 : 10) }
    : indicatorIndex >= 0
      ? { x: 143 - indicatorDepth * 45, y: 259 + indicatorDepth * 78 + shoulderInset(indicatorDepth) + (isExpanded(indicatorKey ?? '') ? -60 + indicatorDepth * 16 : 0) - (reduced ? 0 : isExpanded(indicatorKey ?? '') ? 5 : 8) }
      : null
  useEffect(() => {
    if (reduced) { pointerX.set(0); pointerY.set(0) }
  }, [reduced, pointerX, pointerY])

  function resetPointer() { setHovered(false); setActiveFolder(null); pointerX.set(0); pointerY.set(0) }
  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'touch') return
    // Resolve hover only on real pointer movement. Animated edges must not repeatedly
    // enter/leave a stationary pointer as a folder lifts out from under it.
    const hit = event.target instanceof Element ? event.target.closest('[data-hover-key]') : null
    setActiveFolder(hit?.getAttribute('data-hover-key') ?? null)
    if (reduced) return
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set(Math.max(-5, Math.min(5, -(event.clientY - rect.top - rect.height * .58) / (rect.height * .32) * 5)))
    pointerY.set(Math.max(-7, Math.min(7, (event.clientX - rect.left - rect.width / 2) / (rect.width * .4) * 7)))
  }
  // A bounded 120ms stagger keeps the full sequence short even with more items.
  function transition(index: number) {
    return reduced ? { duration: 0 } : {
      type: 'spring' as const, visualDuration: .38, bounce: .08,
      delay: interactionMode === 'single' ? 0 : (expanded ? index : items.length - index) / Math.max(1, items.length) * .12,
    }
  }
  return <div ref={root} className={`relative w-full max-w-[540px] ${className}`} data-file-organizer="" data-state={expanded ? 'open' : hovered ? 'hover' : 'closed'}>
    <style>{`#${uid}{-webkit-tap-highlight-color:transparent}#${uid} [role="button"]{cursor:pointer;outline:none;pointer-events:visiblePainted}#${uid} .fo-focus-ring{opacity:0;pointer-events:none}#${uid} [role="button"]:focus-visible .fo-focus-ring{opacity:1}#${uid} text{font-family:Arial,Helvetica,sans-serif;letter-spacing:-.6px}`}</style>
    <div id={uid} role="group" className="relative block w-full" aria-label={`${title || 'Files'} organizer`} aria-describedby={`${uid}-contents`}
      onPointerMove={move} onPointerEnter={event => { if (event.pointerType !== 'touch') setHovered(true) }}
      onPointerLeave={resetPointer} onPointerCancel={resetPointer}
      style={{ aspectRatio: '600 / 660', perspective: 1100, touchAction: 'manipulation' }}>
      {/* The ground shadow lives outside the rotated volume. */}
      <svg viewBox="0 0 600 660" fill="none" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <pattern id={`${uid}-dots`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
            <circle cx="1.5" cy="1.5" r=".85" fill={ink} />
          </pattern>
          <pattern id={`${uid}-side`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="skewY(-34)">
            <circle cx="1.5" cy="1.5" r="1.05" fill="#2463ff" />
          </pattern>
          <pattern id={`${uid}-shadow`} width="3" height="3" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r=".75" fill="#9ab6ff" />
          </pattern>
          <clipPath id={`${uid}-cavity-clip`}><path d="M0 0H600V330H482V497H73V330H0Z" /></clipPath>
          <clipPath id={`${uid}-back-clip`}><path d={back} /></clipPath>
          <clipPath id={`${uid}-folder-clip`}><path d={folder} /></clipPath>
        </defs>        <motion.g style={{ x: shadowX, y: shadowY }}>
        {/* Ground shadow stays separate from the floating assembly. */}
        <motion.g initial={false} animate={{ opacity: hovered ? .85 : .95, x: hovered && !reduced ? 4 : 0, scale: hovered && !reduced ? 1.025 : 1 }} transition={{ duration: reduced ? 0 : .25 }} style={{ transformOrigin: '310px 560px' }}>
          <path d="M83 547 382 591Q396 595 411 587L546 516Q561 506 546 499L475 484Z" fill={ink} />
          <path d="M83 547 382 591Q396 595 411 587L546 516Q561 506 546 499L475 484Z" fill={`url(#${uid}-shadow)`} opacity=".55" />
        </motion.g>
        </motion.g>
      </svg>
      <motion.div className="pointer-events-none absolute inset-0" data-organizer-tilt="" style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY, transformOrigin: '50% 74%', transformStyle: 'preserve-3d' }}>
        <svg viewBox="0 0 600 660" fill="none" className="block h-full w-full overflow-visible" data-organizer-shell="">
          {/* Stable inner cavity. Back-to-front DOM order is the painter's order. */}
          <path d="M70 420 169 337Q178 331 188 334L475 348Q485 350 485 360L380 455Z" fill={ink} stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M77 420 176 343 471 358 380 448Z" fill="#20345b" />
        <g clipPath={`url(#${uid}-cavity-clip)`}>
        <FolderPlane depth={-20} horizontal={rotateY} vertical={rotateX} reduced={reduced}>
          <motion.g data-folder="back" {...folderEvents('back', title || 'Projects')} initial={false} animate={{ y: (isExpanded('back') ? -66 : 0) + (isActive('back') && !reduced ? isExpanded('back') ? -5 : -10 : 0), rotate: isExpanded('back') && !reduced ? 1 : 0 }} transition={transition(0)} style={{ transformOrigin: '320px 420px' }}>
            <g transform="matrix(1 .1 0 1 164 199)">
              <path d={back} fill="#2463ff" stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
              <g clipPath={`url(#${uid}-back-clip)`}>
                <path d="M7 79C7 52 29 29 57 29H101Q120 29 131 17Q140 5 157 5H263" stroke="#7ba3ff" strokeWidth="3" opacity=".65" />
                <motion.path d="M0 67H316V264H0Z" fill={`url(#${uid}-dots)`} initial={false} animate={{ opacity: hovered ? .72 : .92 }} transition={{ duration: reduced ? 0 : .25 }} />
              </g>
              <rect x="181.5" y="20" width="101" height="32.5" rx="10" fill="#fffefa" stroke={ink} strokeWidth="2.5" />
              <text x="232" y="37" dominantBaseline="middle" textAnchor="middle" fill={ink} fontWeight="700" fontSize={projectLabel.size}>{projectLabel.text}</text>
              <path className="fo-focus-ring" d={back} stroke="#fffefa" strokeWidth="2.5" strokeDasharray="5 4" />
            </g>
          </motion.g>
        </FolderPlane>
          {items.map((item, index) => {
            const itemKey = 'item:' + item.id
            const expanded = isExpanded(itemKey)
            const depth = items.length <= 1 ? 1 : index / (items.length - 1)
            const inset = shoulderInset(depth)
            const outline = folderPath(inset)
            const label = fitLabel(item.title, 264, 19)
            const x = 145 - depth * 45
            const y = 257 + depth * 78
            return <FolderPlane key={item.id} depth={-10 + depth * 22} horizontal={rotateY} vertical={rotateX} reduced={reduced}><motion.g data-folder={item.id} {...folderEvents(itemKey, item.title || 'Untitled file')} initial={false}
              animate={{ y: (expanded ? -60 + depth * 16 : 0) + (isActive(itemKey) && !reduced ? expanded ? -5 : -8 : 0), rotate: expanded && !reduced ? .6 - depth * 1.2 : 0 }}
              transition={transition(index + 1)} style={{ transformOrigin: `${x + 150}px 440px` }}>
              <g transform={`matrix(1 .1 0 1 ${x} ${y})`}>
                <path d={outline} transform="translate(3 4)" fill={ink} opacity=".16" />
                <path d={outline} fill={colors[item.color]} stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
                <g clipPath={`url(#${uid}-folder-clip)`}>
                  {item.color !== 'yellow' && <path d="M5 22Q5 6 21 6H150Q159 6 165 13L177 27Q185 35 199 35H285" transform={`translate(0 ${inset})`} stroke="#fffefa" strokeWidth="3" opacity=".38" />}
                  {item.color === 'blue' && <path d="M0 65H310V246H0Z" fill={`url(#${uid}-dots)`} opacity=".7" />}
                  {item.color === 'yellow' ? (
                    <g pointerEvents="none">
                      <g fill="#ed931d" opacity=".82">
                        {yellowDots.map((dot, index) => <circle key={index} cx={dot.x} cy={dot.y} r={dot.radius} />)}
                      </g>
                      <g fill="#fff8c5" opacity=".65" transform={`translate(0 ${inset})`}>
                        <path d="M6 25V22Q6 6 22 6H110Q114 6 114 8Q114 10 110 10H23Q10 10 10 24L9 28Q6 30 6 25Z" />
                        <path d="M204 34H269Q273 34 273 36Q273 38 269 38H209Q202 38 201 36Q201 34 204 34Z" />
                      </g>
                    </g>
                  ) : (
                    <motion.g initial={false} animate={{ opacity: expanded ? 1 : 0 }} transition={{ duration: reduced ? 0 : .2 }}>
                      <rect x="16" y="83" width="278" height="137" rx="12" fill="#fffefa" opacity={item.color === 'white' ? .35 : .18} />
                      <g stroke={ink} strokeWidth="4" strokeLinecap="round" opacity=".16">
                        <path d="M29 111H251M29 127H211M29 143H180" />
                      </g>
                      <path d="M25 181H78" stroke={ink} strokeWidth="3" strokeLinecap="round" opacity=".1" />
                    </motion.g>
                  )}
                </g>
                <text x="22" y={(item.color === 'orange' ? 29 : 27) + inset} fill={ink} fontSize={label.size} fontWeight="700">{label.text}</text>
                <path className="fo-focus-ring" d={outline} stroke="#2463ff" strokeWidth="2.5" strokeDasharray="5 4" />
              </g>
            </motion.g></FolderPlane>
          })}
        </g>
        <g style={{ pointerEvents: 'visiblePainted' }}>
          {/* The opaque front and side occlude the lower folder edges throughout the animation. */}
          <path d="M380 455 485 350V482Q485 496 472 505L399 580Q390 590 380 590Z" fill="#fffefa" />
          <path d="M380 455 485 350V482Q485 496 472 505L399 580Q390 590 380 590Z" fill={`url(#${uid}-side)`} />
          <path d="M380 455 485 350V482Q485 496 472 505L399 580Q390 590 380 590" stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M70 420 128 428Q139 430 146 440L157 451Q161 456 171 457L290 473Q301 475 309 468L321 457Q327 452 337 453L369 457Q377 458 385 452L385 588Q377 592 366 590L89 550Q70 547 70 528Z" fill="#fffefa" stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M77 430V526Q77 540 91 542L365 582" stroke="#ffffff" strokeWidth="3" />
          <g transform="matrix(1 .14 0 1 169 483)">
            <rect width="105" height="35" rx="7" fill="#e9edf5" stroke={ink} strokeWidth="3" />
            <path d="M5 29V8Q5 5 9 5H98" stroke="#c9d1e1" strokeWidth="2" />
            <path d="M14 12H91" stroke="#fffefa" strokeWidth="2" />
          </g>
        </g>
        {/* One persistent indicator travels between targets rather than remounting its rays. */}
        <AnimatePresence>
          {indicator && <motion.g key="hover-indicator" data-hover-indicator="" pointerEvents="none" aria-hidden="true"
            initial={{ opacity: 0, x: indicator.x, y: indicator.y }}
            animate={{ opacity: 1, x: indicator.x, y: indicator.y }} exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0 } : { x: { type: 'spring', stiffness: 340, damping: 29 }, y: { type: 'spring', stiffness: 340, damping: 29 }, opacity: { duration: .16 } }}>
            <HoverRays reduced={reduced} />
          </motion.g>}
        </AnimatePresence>
        </svg>
      </motion.div>
    </div>
    <span id={`${uid}-contents`} className="sr-only">{items.length ? items.map(item => item.title).join(', ') : 'No files'}. Hover or focus an individual folder. Activate any folder to expand or collapse all. Click outside or press Escape to close.</span>
  </div>
}

// Estimate glyph widths, including wide CJK characters, to keep custom copy inside its label.
function fitLabel(value: string, width: number, preferred: number) {
  const characters = Array.from(value)
  const units = (text: string[]) => text.reduce((total, char) => total + (/[^\u0000-\u00ff]/.test(char) ? 1 : /[MW@#%]/.test(char) ? .9 : /[il .,'!]/.test(char) ? .3 : .62), 0)
  const size = Math.max(12, Math.min(preferred, width / Math.max(1, units(characters))))
  if (units(characters) * size <= width) return { text: value, size }
  while (characters.length && (units(characters) + 1) * size > width) characters.pop()
  return { text: characters.join('') + '\u2026', size }
}

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

// Connected box surfaces share one projection. Only loose files receive bounded
// parallax, inside a stationary shell-space clip so their bottoms cannot protrude.
function FolderPlane({ depth, horizontal, vertical, reduced, children }: {
  depth: number; horizontal: MotionValue<number>; vertical: MotionValue<number>; reduced: boolean; children: ReactNode
}) {
  const x = useTransform(horizontal, value => reduced ? 0 : value * depth * .025)
  const y = useTransform(vertical, value => reduced ? 0 : value * depth * -.015)
  return <motion.g data-folder-plane={depth} style={{ x, y }}>{children}</motion.g>
}

function HoverRays({ reduced }: { reduced: boolean }) {
  return <g data-hover-rays="" aria-hidden="true" pointerEvents="none">
    {['M-8-2L-30-8', 'M-3-12L-20-32', 'M10-17L8-41'].map((d, index) => <motion.path key={d} d={d}
      fill="none" stroke="#2463ff" strokeWidth="4.5" strokeLinecap="round"
      initial={false} animate={reduced ? { pathLength: 1, opacity: 1 } : { pathLength: [.55, 1, .55], opacity: [.75, 1, .75] }}
      transition={reduced ? { duration: 0 } : { duration: 1.15, delay: index * .12, repeat: Infinity, ease: 'easeInOut' }} />)}
  </g>
}
