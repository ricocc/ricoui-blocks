import { Link, createFileRoute } from '@tanstack/react-router'
import { publishedComponents } from '../data/components'
import { ShowcaseCard } from '../components/site/showcase-card'
import { Icon } from '../components/site/icon'
import { pageHead, site } from '../lib/site'

export const Route = createFileRoute('/home')({
  head: () => {
    const head = pageHead('Original homepage — design comparison', site.description, '/home')
    return { ...head, meta: [...head.meta, { name: 'robots', content: 'noindex, follow' }] }
  },
  component: HomePage,
})

function HomePage() {
  const featured = publishedComponents.slice(0, 3)
  return <main id="main-content" className="home-page">
    <section className="hero">
      <div className="hero-kicker"><span className="status-dot" /> RICOUI BLOCKS</div>
      <div className="hero-layout"><h1>Small details.<br /><span className="hero-second">Lasting <em>impressions.</em></span></h1><div className="hero-aside"><p>Thoughtful components for the web.<br />A little movement. A lot of character.<br />Ready to make your own.</p><Link className="button primary" to="/components">Explore components <Icon name="arrow" /></Link><a className="quiet-link" href={site.github} target="_blank" rel="noreferrer">View the source <Icon name="external" width="14" /></a></div></div>
      <div className="hero-foot"><span>REACT <i>+</i> TAILWIND CSS</span></div>
    </section>
    <section className="selected-section" id="selected"><div className="section-heading"><div><span className="eyebrow">THE WORK, IN MOTION</span><h2>A few things to <em>play with.</em></h2></div><Link className="text-link" to="/components">View collection <span className="count-pill">{publishedComponents.length.toString().padStart(2, '0')}</span><Icon name="arrow" /></Link></div>
      <div className="editorial-grid">{featured.map(c => <ShowcaseCard key={c.slug} component={c} />)}</div>
    </section>
    <section className="philosophy"><span className="eyebrow">LESS FRICTION. MORE EXPRESSION.</span><h2>Good interfaces are felt.<br /><em>Build one worth feeling.</em></h2><div className="principles"><article><span>01 /</span><h3>Start with a feeling.</h3><p>Explore real interactions. Find the detail that makes your next project feel different.</p></article><article><span>02 /</span><h3>Take the source.</h3><p>Copy a component or install with the shadcn CLI. React and Tailwind, ready for your stack.</p></article><article><span>03 /</span><h3>Make it your own.</h3><p>Change the color, tune the movement, and keep building. The final expression is yours.</p></article></div></section>
  </main>
}
