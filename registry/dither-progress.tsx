"use client"

import { useEffect, useId, useRef, useState, useSyncExternalStore, type PointerEvent, type HTMLAttributes } from 'react'

export interface DitherProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Actual progress, clamped to 0–100. No simulated loading is bundled. */
  value: number
  size?: 'sm' | 'md' | 'lg' | number
  baseColor?: string
  fillColor?: string
  highlightColor?: string
  animated?: boolean
  duration?: number
}

const ink = '#101342'
const clamp = (value: number) => Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0
const subscribe = (notify: () => void) => {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', notify)
  return () => query.removeEventListener('change', notify)
}
const bolt = 'M90 58 73 80H85L80 98 101 73H88L94 58Z'
const badge = 'M89 43C99 41 110 47 112 57C123 60 128 69 125 79C126 90 118 99 108 101C103 113 89 116 79 109C67 111 57 103 56 93C45 88 42 76 49 66C50 54 60 46 72 49C76 44 82 42 89 43Z'
const dots = Array.from({ length: 180 }, (_, i) => ({ x: 137 + (i % 36) * 7 + (Math.floor(i / 36) % 2) * 3.5, y: 58 + Math.floor(i / 36) * 9, column: i % 36 }))

/** A front-facing, controlled progress indicator with print-style halftone fill. */
export function DitherProgress({ value, size = 'md', baseColor = '#1756ff', fillColor = '#ff782b', highlightColor = '#ffd528', animated = true, duration = 700, className = '', style, onPointerEnter, onPointerMove, onPointerLeave, onPointerCancel, ...props }: DitherProgressProps) {
  const id = 'dp-' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const target = clamp(value)
  const reduced = useSyncExternalStore(subscribe, () => window.matchMedia('(prefers-reduced-motion: reduce)').matches, () => true)
  const [display, setDisplay] = useState(target)
  const current = useRef(target)
  const root = useRef<HTMLDivElement>(null)
  function setLighting(x: number, y: number, active: boolean) {
    const node = root.current
    if (!node) return
    node.style.setProperty('--dp-rx', `${-y * 7}deg`)
    node.style.setProperty('--dp-ry', `${x * 9}deg`)
    node.style.setProperty('--dp-sx', `${-x * 8}px`)
    node.style.setProperty('--dp-sy', `${3 + y * 3}px`)
    node.style.setProperty('--dp-gx', `${x * 130}px`)
    node.style.setProperty('--dp-gy', `${y * 14}px`)
    node.style.setProperty('--dp-gloss', active ? '.24' : '0')
  }
  function trackPointer(event: PointerEvent<HTMLDivElement>) {
    if (event.defaultPrevented || !animated || reduced || event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1))
    const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1))
    setLighting(x, y, true)
  }
  useEffect(() => {
    const reset = () => setLighting(0, 0, false)
    reset()
    window.addEventListener('blur', reset)
    return () => window.removeEventListener('blur', reset)
  }, [animated, reduced])
  useEffect(() => {
    const ms = Number.isFinite(duration) ? Math.max(0, Math.min(5000, duration)) : 700
    if (!animated || reduced || ms === 0) { current.current = target; setDisplay(target); return }
    const from = current.current
    if (from === target) return
    let frame = 0, start: number | undefined
    function tick(now: number) {
      start ??= now
      const t = Math.min(1, (now - start) / ms)
      const next = from + (target - from) * (1 - (1 - t) ** 3)
      current.current = next
      setDisplay(next)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, animated, reduced, duration])
  const width = typeof size === 'number' ? Math.max(180, Math.min(900, Number.isFinite(size) ? size : 440)) : { sm: 300, md: 440, lg: 580 }[size]
  const complete = display >= 99.999
  const running = display > 0 && !complete
  const amount = display / 100
  return <div {...props} ref={root} role="progressbar" aria-label={props['aria-label'] ?? 'Progress'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={target}
    className={className} data-dither-progress={id} data-state={complete ? 'complete' : running ? 'progress' : 'start'} data-animated={animated && !reduced}
    style={{ width, maxWidth: '100%', position: 'relative', ...style }}
    onPointerEnter={event => { onPointerEnter?.(event); trackPointer(event) }}
    onPointerMove={event => { onPointerMove?.(event); trackPointer(event) }}
    onPointerLeave={event => { onPointerLeave?.(event); setLighting(0, 0, false) }}
    onPointerCancel={event => { onPointerCancel?.(event); setLighting(0, 0, false) }}>

    <style>{`
      [data-dither-progress="${id}"] .dp-object{position:relative;pointer-events:none;transform:perspective(850px) rotateX(var(--dp-rx,0deg)) rotateY(var(--dp-ry,0deg));transform-origin:50% 65%;transition:transform 380ms cubic-bezier(.22,.75,.25,1)}
      [data-dither-progress="${id}"] .dp-shadow{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;transform:translate(var(--dp-sx,0px),var(--dp-sy,3px));transition:transform 380ms cubic-bezier(.22,.75,.25,1)}
      [data-dither-progress="${id}"] .dp-gloss{transform:translate(var(--dp-gx,0px),var(--dp-gy,0px));opacity:var(--dp-gloss,0);transition:transform 380ms cubic-bezier(.22,.75,.25,1),opacity 420ms ease-out;pointer-events:none}
      [data-dither-progress="${id}"] .dp-tick,[data-dither-progress="${id}"] .dp-bolt{transition:opacity 200ms}
      [data-dither-progress="${id}"] .dp-tick{opacity:0}
      [data-dither-progress="${id}"][data-state="complete"] .dp-tick{opacity:1}
      [data-dither-progress="${id}"][data-state="complete"] .dp-bolt{opacity:0}
      [data-dither-progress="${id}"] .dp-rays{opacity:0;transform-origin:458px 34px;transition:opacity 280ms ease-out}
      [data-dither-progress="${id}"][data-state="progress"] .dp-rays,[data-dither-progress="${id}"][data-state="complete"] .dp-rays{opacity:1}
      [data-dither-progress="${id}"] .dp-rays path{transition:stroke 220ms ease-out;transform-box:fill-box;transform-origin:center bottom}
      [data-dither-progress="${id}"][data-animated="true"]:is([data-state="progress"],[data-state="complete"]) .dp-rays path{animation:${id}-signal 1.1s ease-in-out infinite}
      [data-dither-progress="${id}"] .dp-rays path:nth-child(2){animation-delay:120ms!important}
      [data-dither-progress="${id}"] .dp-rays path:nth-child(3){animation-delay:240ms!important}
      [data-dither-progress="${id}"] .dp-scan{opacity:0;pointer-events:none}
      [data-dither-progress="${id}"][data-animated="true"][data-state="progress"] .dp-scan{animation:${id}-scan 1.9s linear infinite}
      @keyframes ${id}-signal{0%,100%{opacity:.45;transform:scaleY(.75)}50%{opacity:1;transform:scaleY(1.12)}}
      @keyframes ${id}-scan{0%{opacity:0;transform:translateY(0)}8%{opacity:1}80%{opacity:1}100%{opacity:0;transform:translateY(-78px)}}
      [data-dither-progress="${id}"][data-animated="false"] *{animation:none!important;transition:none!important}
      [data-dither-progress="${id}"][data-animated="false"] .dp-object{transform:none}
      @media(prefers-reduced-motion:reduce){[data-dither-progress="${id}"] *{animation:none!important;transition:none!important}[data-dither-progress="${id}"] .dp-object{transform:none}}
    `}</style>
    <svg className="dp-shadow" viewBox="0 0 520 170" fill="none" aria-hidden="true"><defs><pattern id={`${id}-ground`} width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill={baseColor}/></pattern></defs><rect x="30" y="65" width="471" height="83" rx="41.5" fill={`url(#${id}-ground)`} opacity=".48"/></svg>
    <div className="dp-object"><svg viewBox="0 0 520 170" fill="none" aria-hidden="true" style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}>
      <defs>
        <clipPath id={`${id}-bolt-clip`}><path d={bolt}/></clipPath>
        <clipPath id={`${id}-shell-clip`}><rect x="22" y="38" width="475" height="94" rx="47"/></clipPath>
        <radialGradient id={`${id}-glare`}><stop stopColor="white"/><stop offset="1" stopColor="white" stopOpacity="0"/></radialGradient>
        <pattern id={`${id}-side`} width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".75" fill={ink}/></pattern>
        <linearGradient id={`${id}-density`} x1="0" x2="1"><stop stopColor="white" stopOpacity="0"/><stop offset=".6" stopColor="white" stopOpacity="0"/><stop offset="1" stopColor="white"/></linearGradient>
        <mask id={`${id}-side-mask`}><rect x="20" y="38" width="480" height="108" fill={`url(#${id}-density)`}/></mask>
        <linearGradient id={`${id}-warm`} x1="132" y1="76" x2="385" y2="76" gradientUnits="userSpaceOnUse"><stop stopColor={highlightColor}/><stop offset=".48" stopColor={highlightColor}/><stop offset="1" stopColor={fillColor}/></linearGradient>
        <clipPath id={`${id}-track`}><rect x="132" y="51" width="257" height="53" rx="26.5"/></clipPath>
        <clipPath id={`${id}-fill`}><rect x="132" y="51" width={257 * amount} height="53" rx={Math.min(26.5, 128.5 * amount)}/></clipPath>
      </defs>
      {/* Ground, sidewall and face share a level horizontal baseline. */}
      <rect x="22" y="44" width="475" height="95" rx="47.5" fill={ink}/>
      <rect x="22" y="38" width="475" height="94" rx="47" fill={baseColor} stroke={ink} strokeWidth="4"/>
      <rect x="24" y="44" width="471" height="88" rx="44" fill={`url(#${id}-side)`} mask={`url(#${id}-side-mask)`} opacity=".55"/>
      <path d="M26 80Q26 44 65 43H449Q477 43 489 69Q471 49 447 49H70Q39 49 26 80Z" fill="#94b3ff"/>
      <path d="M28 91Q33 120 60 126L69 128Q47 110 44 92Z" fill="#729cff" opacity=".65"/>
      <g clipPath={`url(#${id}-shell-clip)`}><ellipse className="dp-gloss" cx="220" cy="52" rx="180" ry="58" fill={`url(#${id}-glare)`}/></g>
      <rect x="36" y="49" width="446" height="70" rx="35" fill={ink}/>
      <rect x="36" y="44" width="446" height="70" rx="35" fill="#c6d3ff" stroke={ink} strokeWidth="3"/>
      <rect x="40" y="48" width="438" height="62" rx="31" fill="#fff"/>
      {/* Sparse unfilled guide dots remain distinguishable from actual progress. */}
      <g clipPath={`url(#${id}-track)`}>
        {dots.map((dot, i) => <circle key={i} cx={dot.x} cy={dot.y} r="1.25" fill="#d9ddf2" opacity=".65"/>)}
        <g clipPath={`url(#${id}-fill)`}>
          {dots.map((dot, i) => {
            const across = dot.column / 35
            const radius = .7 + amount * 1.1 + across * amount * 3.2 + Math.max(0, amount - .8) * 16
            return <circle key={i} cx={dot.x} cy={dot.y} r={radius} fill={`url(#${id}-warm)`}/>
          })}
          {/* Tiny paper holes retain the printed texture at high density. */}
          {dots.filter((_, i) => i % 3 === 0).map((dot, i) => <circle key={i} cx={dot.x + 2} cy={dot.y + 2} r=".9" fill="#fff" opacity={Math.max(0, (amount - .65) / .35) * .8}/>)}
        </g>
      </g>
      <text x="434" y="89" fill={ink} fontFamily="ui-sans-serif,system-ui,sans-serif" fontSize="29" fontWeight="850" letterSpacing="-1.3" textAnchor="middle" style={{ fontVariantNumeric: 'tabular-nums' }}>{Math.round(display)}%</text>
      <g className="dp-badge">
        <path d={badge} transform="translate(0 5)" fill={ink}/>
        <path d={badge} fill="#deddf4" stroke={ink} strokeWidth="3.5"/>
        <path d={badge} transform="translate(6.8 6.3) scale(.92)" fill="#fff"/>
        <path className="dp-bolt" d={bolt} fill={ink} stroke={ink} strokeWidth="3" strokeLinejoin="round"/>
        <g clipPath={`url(#${id}-bolt-clip)`}>
          <g className="dp-scan" fill={highlightColor}>
            {Array.from({ length: 117 }, (_, i) => {
              const row = Math.floor(i / 13)
              const density = 1 - Math.abs(row - 4) / 5
              return <circle key={i} cx={69 + (i % 13) * 2.7 + (row % 2) * 1.35} cy={101 + row * 2.5} r={.4 + density * 1.1} opacity={.3 + density * .7}/>
            })}
          </g>
        </g>
        <path className="dp-tick" d="m72 79 10 10 20-24" stroke={ink} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <g className="dp-rays" stroke={complete ? highlightColor : baseColor} strokeWidth="6" strokeLinecap="round"><path d="m451 25-3-11"/><path d="m466 27 6-12"/><path d="m479 35 10-7"/></g>
    </svg></div>
  </div>
}
