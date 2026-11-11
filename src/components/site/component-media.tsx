import { useEffect, useRef, useState } from 'react'
import { getComponentMedia } from '../../data/browse-media'

export function ComponentMedia({ slug, mode, active = false, paused }: {
  slug: string
  mode: 'auto' | 'hover'
  active?: boolean
  paused?: boolean
}) {
  const { image, video } = getComponentMedia(slug)
  const container = useRef<HTMLSpanElement>(null)
  const player = useRef<HTMLVideoElement>(null)
  const [visible, setVisible] = useState(false)
  const [reduced, setReduced] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const shouldPlay = visible && !videoFailed && (mode === 'auto' ? !(paused ?? reduced) : !reduced && active)

  useEffect(() => {
    const element = container.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const element = player.current
    if (!element) return
    let current = true
    const update = () => {
      if (shouldPlay && !document.hidden) {
        void element.play().catch(() => {
          if (current && element.paused) setPlaying(false)
        })
      } else {
        element.pause()
        if (mode === 'hover') setPlaying(false)
        if (mode === 'hover' && !active) element.currentTime = 0
      }
    }
    update()
    document.addEventListener('visibilitychange', update)
    return () => {
      current = false
      document.removeEventListener('visibilitychange', update)
    }
  }, [active, mode, shouldPlay])

  return <span ref={container} className="component-media">
    {image && !imageFailed
      ? <img src={image} alt="" loading="lazy" decoding="async" draggable={false} onError={() => setImageFailed(true)} />
      : <span className="browse-media-empty">Preview coming soon</span>}
    {video && !videoFailed && <video
      ref={player}
      src={video}
      muted
      loop
      playsInline
      autoPlay={shouldPlay}
      preload="none"
      aria-hidden="true"
      className={playing ? 'is-playing' : undefined}
      onPlaying={() => { if (shouldPlay && !document.hidden) setPlaying(true) }}
      onError={() => { setVideoFailed(true); setPlaying(false) }}
    />}
  </span>
}
