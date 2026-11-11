import { useEffect, useRef } from 'react'

export function HomeProcess() {
  const steps = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !steps.current) return
    const animations: Animation[] = []
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      Array.from(entry.target.children).forEach((item, index) => {
        animations.push(item.animate([{ opacity: .3, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 480, delay: index * 80, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' }))
      })
      observer.disconnect()
    }, { threshold: .15 })
    observer.observe(steps.current)
    return () => { observer.disconnect(); animations.forEach(animation => animation.cancel()) }
  }, [])
  return (
    <section className="home-process" aria-labelledby="process-title">
      <div className="home-process-heading"><h2 id="process-title">From first look<br /><em>to your next project.</em></h2></div>
      <div className="home-steps" ref={steps}>{[['Find a starting point.', 'Try the live previews and choose a detail for your project.'], ['Take the source.', 'Copy the component or add it with the shadcn CLI.'], ['Make it yours.', 'Change the colors, tune the motion, and fit it to your design.']].map(([title,copy])=><article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </section>
  )
}
