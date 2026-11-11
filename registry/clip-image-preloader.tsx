"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { gsap } from 'gsap'

export type ClipImagePreloaderProps = {
  progress: number
  /** Supply up to seven preloaded image URLs. Images are not bundled. */
  images: string[]
  logo?: ReactNode
  label?: string
  onComplete?: () => void
  className?: string
  style?: CSSProperties
}

export function ClipImagePreloader({ progress, images, logo, label = 'Loading', onComplete,
  className = '', style }: ClipImagePreloaderProps) {
  const root = useRef<HTMLDivElement>(null)
  const sequence = useRef<gsap.core.Timeline | null>(null)
  const started = useRef(false)
  const complete = useRef(onComplete)
  const meter = useRef({ value: 0 })
  const [done, setDone] = useState(false)
  const value = Number.isFinite(progress) ? Math.min(100, Math.max(0, progress)) : 0
  const imagesKey = JSON.stringify(images.slice(0, 7))
  complete.current = onComplete

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    started.current = false
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, onComplete: () => { setDone(true); complete.current?.() } })
      if (reduced) { tl.to(root.current, { opacity: 0, duration: .15 }); sequence.current = tl; return }
      tl.to('[data-clip-status]', { y: -25, opacity: 0, duration: .75, delay: .5, ease: 'power1.out' })
      const cards = Array.from(root.current!.querySelectorAll<HTMLElement>('[data-clip-image]'))
      // The reference staggers masks by .35s while all image zooms share one start.
      const montageStart = tl.duration()
      let montageEnd = montageStart
      cards.forEach((card, index) => {
        const maskStart = montageStart + index * .35
        tl.fromTo(card, { clipPath: 'inset(100%)' }, { clipPath: 'inset(0%)', duration: 2, ease: 'power1.out' }, maskStart)
          .fromTo(card.querySelector('img'), { scale: 1.8 }, { scale: 1, duration: 2, ease: 'power1.out' }, montageStart)
        montageEnd = maskStart + 2
      })
      // Keep the montage still: a solid veil covers it, then lifts to reveal the page.
      tl.fromTo('[data-clip-shade]', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: .9, ease: 'power4.inOut' }, montageEnd + .55)
        .set('[data-clip-image]', { visibility: 'hidden' })
        .fromTo(root.current, { clipPath: 'inset(0 0 0% 0)' }, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'power4.inOut' }, '+=.12')
      sequence.current = tl
    }, root)
    return () => { sequence.current = null; ctx.revert() }
  }, [imagesKey])

  useEffect(() => {
    if (started.current) return
    const tween = gsap.to(meter.current, { value, duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : .35,
      ease: 'power1.out', onUpdate: () => {
        const counter = root.current?.querySelector('[data-clip-counter]')
        if (counter) counter.textContent = String(Math.floor(meter.current.value))
      }, onComplete: () => { if (value === 100) { started.current = true; sequence.current?.play() } },
    })
    return () => { tween.kill() }
  }, [value, imagesKey])

  if (done) return null
  return <div ref={root} data-clip-preloader className={`relative isolate h-full min-h-64 w-full overflow-hidden bg-[var(--surface,#ffffff)] text-[var(--foreground,#252c32)] [container-type:size] ${className}`}
    style={{ fontFamily: "var(--font-mono, 'SFMono-Regular', Consolas, 'Liberation Mono', monospace)", ...style }}>
    <style>{`
      [data-clip-preloader] .clip-status {position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center}
      [data-clip-preloader] .clip-logo {display:flex;align-items:center;justify-content:center;min-height:50px;font-size:34px;font-weight:500;color:var(--brand,#2d6dc3)}
      [data-clip-preloader] .clip-logo img,[data-clip-preloader] .clip-logo svg {height:50px;width:auto}
      [data-clip-preloader] .clip-progress {margin:16px 0 0;font-size:24px;font-weight:400;letter-spacing:1px;line-height:normal;font-variant-numeric:tabular-nums}
      [data-clip-preloader] .clip-images {position:absolute;inset:0;display:flex;align-items:center;justify-content:center;margin:0;padding:0;list-style:none}
      [data-clip-preloader] .clip-image {position:absolute;top:20cqh;height:auto;overflow:hidden;clip-path:inset(100%)}
      [data-clip-preloader] .clip-image:nth-child(1) {width:60cqw;aspect-ratio:3/4;margin-top:15cqw}
      [data-clip-preloader] .clip-image:nth-child(2) {width:36cqw;aspect-ratio:3/2;transform:translate(-30cqw,23cqh)}
      [data-clip-preloader] .clip-image:nth-child(3) {width:24cqw;aspect-ratio:5/6;transform:translate(-30cqw,45cqh)}
      [data-clip-preloader] .clip-image:nth-child(4) {width:32cqw;aspect-ratio:3/4;transform:translate(30cqw,10cqh)}
      [data-clip-preloader] .clip-image:nth-child(5) {width:30cqw;aspect-ratio:3/2;transform:translate(25cqw,-8cqh)}
      [data-clip-preloader] .clip-image:nth-child(6) {width:35cqw;aspect-ratio:3/2;transform:translate(28cqw,40cqh)}
      [data-clip-preloader] .clip-image:nth-child(7) {width:38cqw;aspect-ratio:5/3;transform:translate(-22cqw,-5cqh)}
      @container (min-width:467px) {[data-clip-preloader] .clip-image:nth-child(1) {width:40cqw;margin-top:5cqw}}
      @container (min-width:768px) {
        [data-clip-preloader] .clip-image:nth-child(1) {width:30cqw;margin-top:0}
        [data-clip-preloader] .clip-image:nth-child(2) {width:20cqw;transform:translate(-17cqw,3cqh)}
        [data-clip-preloader] .clip-image:nth-child(3) {width:13cqw;transform:translate(-18cqw,36cqh)}
        [data-clip-preloader] .clip-image:nth-child(4) {width:12.5cqw;transform:translate(20cqw,10cqh)}
        [data-clip-preloader] .clip-image:nth-child(5) {width:15cqw;transform:translate(14cqw,-10cqh)}
        [data-clip-preloader] .clip-image:nth-child(6) {width:16cqw;transform:translate(16cqw,38cqh)}
        [data-clip-preloader] .clip-image:nth-child(7) {width:11cqw;transform:translate(-14cqw,-14.5cqh)}
      }
      @container (min-width:1023px) {
        [data-clip-preloader] .clip-image:nth-child(1) {width:25cqw;max-width:400px}
        [data-clip-preloader] .clip-image:nth-child(3) {width:10.5cqw;transform:translate(-18cqw,32cqh)}
        [data-clip-preloader] .clip-image:nth-child(5) {width:10.5cqw;transform:translate(12cqw,-10cqh)}
      }
      @container (min-width:1400px) {[data-clip-preloader] .clip-image:nth-child(1) {width:18.75cqw}}
      @container (max-width:767px) {[data-clip-preloader] .clip-image {width:65cqw!important;aspect-ratio:3/4!important;margin:0 auto!important;transform:none!important;top:auto!important}}
    `}</style>
    <span className="sr-only" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value)} />
    <div data-clip-status className="clip-status" aria-hidden="true"><div className="clip-logo">{logo ?? label}</div><div className="clip-progress"><span data-clip-counter>0</span>%</div></div>
    <ul className="clip-images" aria-hidden="true">{images.slice(0, 7).map((src, i) => <li key={`${i}-${src}`} data-clip-image className="clip-image"><img src={src} alt="" className="h-full w-full object-cover" style={{ transform: 'scale(1.8)' }} /></li>)}</ul>
    <div data-clip-shade className="pointer-events-none absolute inset-0 bg-[var(--brand,#2d6dc3)]" style={{ clipPath: 'inset(100% 0 0 0)', zIndex: 2, backgroundColor: 'var(--brand, #2d6dc3)' }} />
  </div>
}
