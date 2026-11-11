import { Link } from '@tanstack/react-router'
import { Icon } from '../icon'

export function HomeDiscovery() {
  return (
    <section className="home-discovery" aria-labelledby="discovery-title">
      <div className="home-discovery-panel">
        <img className="home-discovery-art home-discovery-art-light" src="/images/home/ascii-explore.jpg" alt="" loading="lazy" decoding="async" width={2172} height={724} />
        <img className="home-discovery-art home-discovery-art-dark" src="/images/home/ascii-explore-dark.jpg" alt="" loading="lazy" decoding="async" width={2172} height={724} />
        <div className="home-discovery-copy">
          <h2 id="discovery-title">Find your<br /><em>next direction.</em></h2>
          <Link to="/browse" className="home-discovery-action">Browse components <Icon name="external" size={18} /></Link>
        </div>
      </div>
    </section>
  )
}
