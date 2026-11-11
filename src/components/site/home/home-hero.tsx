import { Link } from '@tanstack/react-router'
import { Icon } from '../icon'
import { HalftoneLandscape } from './halftone-landscape'

export function HomeHero() {
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-hero-copy">
        <h1 id="home-title">Small details.<br /><em>Distinctly yours.</em></h1>
        <p>Animated React components with a visual point of view. Find one you like, copy the source, and take it further.</p>
        <div className="home-actions"><Link to="/browse" className="button primary">Browse components <Icon name="arrow" size={16} /></Link><Link to="/docs" className="home-text-link">Get started <Icon name="external" size={15} /></Link></div>
      </div>
      <HalftoneLandscape />
    </section>
  )
}
