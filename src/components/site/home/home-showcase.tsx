import { Link } from '@tanstack/react-router'
import { publishedComponents } from '../../../data/components'
import { Icon } from '../icon'
import { ShowcaseCard } from '../showcase-card'
import { Pause, Play } from 'lucide-react'
import { useMediaPlayback } from '../use-media-playback'

const selectedSlugs = [
  'flip-switch',
  'dither-progress',
  'file-organizer',
  'magnifier',
  'contribution-graph',
  'empty-states',
  'bell-button',
  'social-card',
]

const selectedComponents = selectedSlugs
  .map(slug => publishedComponents.find(component => component.slug === slug))
  .filter(component => component !== undefined)

export function HomeShowcase() {
  const { paused, toggle } = useMediaPlayback()
  return (
    <section className="home-work" aria-label="Selected components">
      <div className="home-work-heading">
        <h2 className="home-section-title">Selected components</h2>
        <button type="button" className="home-media-toggle" onClick={toggle} aria-label={paused ? 'Play component videos' : 'Pause component videos'} title={paused ? 'Play component videos' : 'Pause component videos'}>
          {paused ? <Play size={18} strokeWidth={1.8} /> : <Pause size={18} strokeWidth={1.8} />}
        </button>
      </div>
      <div className="home-gallery editorial-grid">
        {selectedComponents.map(component => <ShowcaseCard key={component.slug} component={component} paused={paused} />)}
        <Link to="/components" className="home-gallery-all" aria-label={`View all ${publishedComponents.length} components`}>
          <span className="home-gallery-all-top"><span>RICOUI / COLLECTION</span><Icon name="external" size={19} /></span>
          <span className="home-gallery-all-bottom"><strong>Explore all<br />components</strong><span>{String(publishedComponents.length).padStart(2, '0')} COMPONENTS AVAILABLE</span></span>
        </Link>
      </div>
    </section>
  )
}
