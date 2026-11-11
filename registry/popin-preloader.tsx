"use client"

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { gsap } from 'gsap'

export type PopinPreloaderProps = {
  progress: number
  label?: string
  readyLabel?: string
  loadingStatus?: string
  readyStatus?: string
  waitForInteraction?: boolean
  onComplete?: () => void
  className?: string
  style?: CSSProperties
}

/** Keep mounted through onComplete. Change React key to replay a loading cycle. */
export function PopinPreloader({ progress, label = 'Loading', readyLabel = 'Ready',
  loadingStatus = 'Loading', readyStatus = 'Click enter',
  waitForInteraction = true, onComplete, className = '', style }: PopinPreloaderProps) {
  const root = useRef<HTMLDivElement>(null)
  const status = useRef<HTMLDivElement>(null)
  const sequence = useRef<gsap.core.Timeline | null>(null)
  const exit = useRef<gsap.core.Timeline | null>(null)
  const meter = useRef({ value: 0 })
  const started = useRef(false)
  const leaving = useRef(false)
  const complete = useRef(onComplete)
  const [pressed, setPressed] = useState(false)
  const [ready, setReady] = useState(false)
  const [done, setDone] = useState(false)
  const value = Number.isFinite(progress) ? Math.min(100, Math.max(0, progress)) : 0
  complete.current = onComplete

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    started.current = false
    leaving.current = false
    const ctx = gsap.context(() => {
      const el = root.current!
      exit.current = gsap.timeline({ paused: true, onComplete: () => { setDone(true); complete.current?.() } })
      if (reduced) exit.current.to(el, { opacity: 0, duration: .15 })
      else exit.current.fromTo(el, { clipPath: 'inset(0 0 0% 0)' }, { clipPath: 'inset(0 0 100% 0)', duration: .8, delay: .3, ease: 'power3.inOut' })
        .to('[data-text-window]', { yPercent: -100, duration: .8, ease: 'power3.inOut' }, '<')

      sequence.current = gsap.timeline({ paused: true, onComplete: () => {
        if (!waitForInteraction) { leaving.current = true; exit.current?.play() }
      } })
        .to('[data-fill]', { clipPath: 'inset(0 0% 0 0)', duration: reduced ? 0 : .65, delay: reduced ? 0 : .2, ease: 'power1.inOut' })
        .fromTo('[data-counter]', { backgroundPosition: '100% 100%' }, { backgroundPosition: '0% 100%', duration: reduced ? 0 : .65, ease: 'power1.inOut' }, '<')
        .fromTo(meter.current, { value: 0 }, { value: 100, duration: reduced ? 0 : .65, ease: 'power1.inOut', onUpdate: () => {
          const counter = el.querySelector('[data-counter]')
          if (counter) counter.textContent = `${Math.floor(meter.current.value)}%`
        } }, '<')
        .call(() => setReady(true))
        .addLabel('letters', reduced ? '>' : '>+=0.04')
        .to('[data-loading-letter]', { yPercent: -100, duration: reduced ? 0 : .3, stagger: reduced ? 0 : .055 }, 'letters')
        .fromTo('[data-ready-letter]', { yPercent: 0 }, {
          yPercent: -100, duration: reduced ? 0 : .85, stagger: reduced ? 0 : .055,
          ease: 'elastic.out(1,0.7)',
        }, 'letters')
    }, root)
    return () => { sequence.current = null; exit.current = null; ctx.revert() }
  }, [waitForInteraction])

  useEffect(() => {
    if (started.current) return
    // Business progress gates the reference's visible sweep/count sequence.
    if (value === 100) { started.current = true; sequence.current?.play() }
  }, [value, waitForInteraction])

  function enter() {
    if (!ready || leaving.current) return
    leaving.current = true
    exit.current?.play()
  }
  function resetStatus() {
    setPressed(false)
    const badge = status.current
    if (!badge) return
    badge.style.removeProperty('left')
    badge.style.removeProperty('top')
    badge.style.removeProperty('transform')
  }
  if (done) return null
  return <div ref={root} data-popin-preloader data-ready={ready} data-pressed={pressed} onClick={enter}
    onPointerDown={() => setPressed(true)}
    onPointerUp={() => setPressed(false)}
    onPointerCancel={() => setPressed(false)}
    onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') setPressed(true) }}
    onKeyUp={() => setPressed(false)}
    onBlur={() => setPressed(false)}
    onPointerLeave={resetStatus}
    onPointerMove={event => {
      if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const badge = status.current
      if (!badge) return
      const bounds = event.currentTarget.getBoundingClientRect()
      const x = event.clientX - bounds.left
      const y = event.clientY - bounds.top
      const left = x + 18 + badge.offsetWidth > bounds.width - 12 ? x - badge.offsetWidth - 18 : x + 18
      const top = y + 18 + badge.offsetHeight > bounds.height - 12 ? y - badge.offsetHeight - 18 : y + 18
      badge.style.left = `${Math.max(12, Math.min(left, bounds.width - badge.offsetWidth - 12))}px`
      badge.style.top = `${Math.max(12, Math.min(top, bounds.height - badge.offsetHeight - 12))}px`
      badge.style.transform = 'none'
    }}
    className={`relative isolate h-full min-h-64 w-full overflow-hidden select-none [container-type:size] ${className}`}
    style={{ fontFamily: "var(--font-mono, 'SFMono-Regular', Consolas, 'Liberation Mono', monospace)", fontWeight: 400, textAlign: 'center', ...style }}>
    <style>{`
      [data-popin-preloader] .popin-copy {font-size:clamp(28px,8cqw,96px);line-height:1.25;height:1.25em;width:100%;font-weight:400}
      [data-popin-preloader] .popin-counter {position:absolute;right:clamp(20px,4cqw,56px);bottom:clamp(20px,4cqh,40px);font-size:clamp(20px,3.5cqw,40px);line-height:1.25;font-variant-numeric:tabular-nums;z-index:2;background:linear-gradient(to right,var(--background,#fdfcfc) 50%,var(--brand,#2d6dc3) 50%);background-size:200% 100%;background-position:100% 100%;background-clip:text;-webkit-background-clip:text;color:transparent}
      [data-popin-preloader] .popin-letter {display:inline-block;position:relative;top:0;transition:top .8s cubic-bezier(.17,.67,.36,1.25)}
      [data-popin-preloader] .popin-letter:hover {top:-.2em;transition-duration:.3s}
      [data-popin-preloader] .popin-intro-letter {display:inline-block;white-space:pre;animation:ricoui-popin-arrive .65s linear both;animation-delay:calc(var(--letter-index)*40ms)}
      @keyframes ricoui-popin-arrive {0% {opacity:0;transform:translateY(55%)} 35% {opacity:1;transform:translateY(-8%)} 55% {transform:translateY(3.5%)} 72% {transform:translateY(-1.5%)} 86% {transform:translateY(.5%)} 100% {opacity:1;transform:translateY(0)}}
      [data-popin-preloader] .popin-status {position:absolute;z-index:3;left:50%;top:calc(50% + clamp(56px,9cqw,110px));transform:translateX(-50%);max-width:calc(100% - 24px);padding:10px 16px;border-radius:6px;background:var(--brand,#2d6dc3);color:var(--background,#fdfcfc);font-size:13px;line-height:1.4;pointer-events:none;overflow-wrap:anywhere;transition:background-color .2s,color .2s,scale .35s cubic-bezier(.34,1.56,.64,1)}
      [data-popin-preloader][data-pressed=true] .popin-status {scale:.94;transition-duration:.12s}
      [data-popin-preloader] .popin-dots {display:inline-block;width:3ch;text-align:left;clip-path:inset(0 66.666% 0 0);animation:ricoui-popin-dots 1.2s steps(1,end) infinite}
      @keyframes ricoui-popin-dots {0% {clip-path:inset(0 66.666% 0 0)} 33.333% {clip-path:inset(0 33.333% 0 0)} 66.666%,100% {clip-path:inset(0)}}
      [data-popin-preloader][data-ready=true] .popin-status {background:var(--background,#fdfcfc);color:var(--brand,#2d6dc3)}
      [data-popin-preloader][data-ready=true] {cursor:pointer}
      [data-popin-preloader]:has(button:focus-visible) .popin-status {left:50%!important;top:calc(50% + clamp(56px,9cqw,110px))!important;transform:translateX(-50%)!important}
      @media(prefers-reduced-motion:reduce) {[data-popin-preloader] .popin-intro-letter {animation:none} [data-popin-preloader] .popin-status {transition:none} [data-popin-preloader] .popin-dots {animation:none;clip-path:inset(0)}}
      @media(prefers-reduced-motion:reduce) {[data-popin-preloader] .popin-letter {transition:none;top:0!important}}
    `}</style>
    <span className="sr-only" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value)} />
    <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-[var(--surface-subtle,#f3f5f8)] text-[var(--brand,#2d6dc3)]">
      <div className="popin-copy">{Array.from(label).map((char, i) => <span key={i} className="popin-intro-letter" style={{ '--letter-index': i } as CSSProperties}><span className="popin-letter">{char}</span></span>)}</div>
    </div>
    <div data-fill aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-[var(--brand,#2d6dc3)] text-[var(--background,#fdfcfc)]" style={{ clipPath: 'inset(0 100% 0 0)' }}>
      <div data-text-window className="popin-copy relative overflow-hidden">
        <div className="h-full">{Array.from(label).map((char, i) => <span key={i} data-loading-letter className="inline-block h-full whitespace-pre">{char}</span>)}</div>
        <div className="h-full">{Array.from(readyLabel).map((char, i) => <span key={i} data-ready-letter className="inline-block h-full whitespace-pre"><span className="popin-letter">{char}</span></span>)}</div>
      </div>
    </div>
    <span data-counter aria-hidden="true" className="popin-counter">0%</span>
    <div ref={status} className="popin-status" role="status" aria-live="polite">{ready ? (waitForInteraction ? readyStatus : readyLabel) : <>{loadingStatus.replace(/[.\u2026]+$/, '')}<span className="popin-dots" aria-hidden="true">...</span></>}</div>
    {ready && waitForInteraction && <button type="button" onClick={enter} aria-label={readyStatus}
      className="pointer-events-none absolute inset-0 z-10 bg-transparent text-[var(--background,#fdfcfc)] focus-visible:outline-4 focus-visible:-outline-offset-8 focus-visible:outline-current">
      <span className="sr-only">{readyLabel}</span>
    </button>}
  </div>
}
