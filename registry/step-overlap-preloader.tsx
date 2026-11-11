"use client"

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { gsap } from 'gsap'

export type StepOverlapPreloaderProps = {
  progress: number
  label?: string
  onComplete?: () => void
  className?: string
  style?: CSSProperties
}

export function StepOverlapPreloader({ progress, label = 'Creative Designer', onComplete,
  className = '', style }: StepOverlapPreloaderProps) {
  const root = useRef<HTMLDivElement>(null)
  const sequence = useRef<gsap.core.Timeline | null>(null)
  const started = useRef(false)
  const enteredAt = useRef(0)
  const meter = useRef({ value: 0 })
  const complete = useRef(onComplete)
  const [done, setDone] = useState(false)
  const value = Number.isFinite(progress) ? Math.min(100, Math.max(0, progress)) : 0
  complete.current = onComplete

  useEffect(() => {
    started.current = false
    enteredAt.current = performance.now()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-step-letter]', { x: '1em', filter: 'blur(4px)', opacity: 0 },
        { x: 0, filter: 'blur(0px)', opacity: 1, duration: reduced ? 0 : 1.25, stagger: reduced ? 0 : .1, ease: 'power1.inOut' })
      gsap.fromTo('[data-step-progress]', { opacity: 0, y: -10, filter: 'blur(3px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: reduced ? 0 : 1, ease: 'power1.out' })
      const tl = gsap.timeline({ paused: true, delay: reduced ? 0 : 1, onComplete: () => { setDone(true); complete.current?.() } })
      if (reduced) tl.to(root.current, { opacity: 0, duration: .15 })
      else tl.to('[data-step-title], [data-step-progress]', { opacity: 0, y: -5, filter: 'blur(3px)', duration: .65, ease: 'power1.out' }, 0)
        .to('[data-curtain="front"]', { yPercent: -100, duration: .6, ease: 'power1.out' }, .95)
        .to('[data-curtain="middle"]', { yPercent: -100, duration: .65, ease: 'power1.out' }, 1.05)
        .to('[data-curtain="back"]', { yPercent: -100, duration: .6, ease: 'power1.out' }, 1.2)
      sequence.current = tl
    }, root)
    return () => { sequence.current = null; ctx.revert() }
  }, [])

  useEffect(() => {
    if (started.current) return
    const tween = gsap.to(meter.current, { value, duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : .35,
      ease: 'power1.out', onUpdate: () => {
        const counter = root.current?.querySelector('[data-step-counter]')
        if (counter) counter.textContent = String(Math.floor(meter.current.value))
      }, onComplete: () => {
        if (value === 100) {
          started.current = true
          const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          // Cached loads must still let the title finish its authored entrance.
          const entranceDuration = 1.25 + Math.max(0, label.replace(/\s/g, '').length - 1) * .1
          sequence.current?.delay(reduced ? 0 : Math.max(1, entranceDuration - (performance.now() - enteredAt.current) / 1000)).play()
        }
      },
    })
    return () => { tween.kill() }
  }, [value, label])

  if (done) return null
  return <div ref={root} data-step-preloader className={`relative isolate h-full min-h-64 w-full overflow-hidden [container-type:size] ${className}`}
    style={{ fontFamily: "var(--font-mono, 'SFMono-Regular', Consolas, 'Liberation Mono', monospace)", color: 'var(--foreground, #252c32)', ...style }}>
    <style>{`
      [data-step-preloader] .step-title {font-size:28px;font-weight:400;line-height:normal;text-align:center}
      [data-step-preloader] .step-char {display:inline-block;padding:0 3px;white-space:pre}
      [data-step-preloader] .step-progress {position:absolute;right:40px;bottom:40px;font-size:40px;font-weight:300;letter-spacing:2px;line-height:normal;font-variant-numeric:tabular-nums}
      @container (max-width:767px) {[data-step-preloader] .step-title {font-size:20px}}
      @container (max-width:360px) {[data-step-preloader] .step-progress {right:24px;bottom:24px}}
    `}</style>
    <span className="sr-only" role="progressbar" aria-label="Loading" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value)} />
    <div data-curtain="back" className="absolute inset-0 bg-[var(--brand,#2d6dc3)]" />
    <div data-curtain="middle" className="absolute inset-0 bg-[var(--brand-soft,#edf4ff)]" />
    <div data-curtain="front" className="absolute inset-0 flex items-center justify-center bg-[var(--surface,#ffffff)]">
      <div data-step-title className="step-title" aria-hidden="true">{label.split(' ').map((word, wordIndex) => <span key={wordIndex} className="inline-block whitespace-nowrap">{wordIndex > 0 && '\u00a0'}{Array.from(word).map((char, i) => <span key={i} data-step-letter className="step-char">{char}</span>)}</span>)}</div>
      <div data-step-progress className="step-progress" aria-hidden="true"><span data-step-counter>0</span>%</div>
    </div>
  </div>
}
