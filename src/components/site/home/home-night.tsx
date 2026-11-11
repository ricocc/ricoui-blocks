import { useEffect, useRef } from 'react'
import { siteLinks } from '../../../data/site-navigation'
import { SceneAtmosphere } from './scene-atmosphere'

export function HomeNight() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    function syncPlayback() {
      if (visible && !document.hidden && !reduced.matches) {
        void video!.play().catch(() => {})
      } else {
        video!.pause()
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      syncPlayback()
    })
    observer.observe(video)
    document.addEventListener('visibilitychange', syncPlayback)
    reduced.addEventListener('change', syncPlayback)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', syncPlayback)
      reduced.removeEventListener('change', syncPlayback)
      video.pause()
    }
  }, [])

  return (
    <section className="home-night" aria-labelledby="night-title">
      {/* <video ref={videoRef} className="home-night-art" src="/images/home/ascii-animation.mp4" poster="/images/home/ascii-animation.jpg" muted loop playsInline preload="none" aria-hidden="true" /> */}
      <img className="home-night-art" src="/images/home/dither.jpg" alt="" loading="lazy" decoding="async" />
      <SceneAtmosphere variant="night" />
      <div className="home-night-copy"><h2 id="night-title">Still making little things worth sharing.<br />New designs are on the way.</h2><a className="button" href={siteLinks.x} target="_blank" rel="noreferrer">Follow on X</a></div>
    </section>
  )
}
