import { Link } from '@tanstack/react-router'
import TechText from './tech-text'
import './not-found-page.css'

export function NotFoundPage() {
  return (
    <main id="main-content" className="not-found-page" aria-labelledby="not-found-title">
      <h1 id="not-found-title" className="sr-only">404 — Page not found</h1>
      <div className="not-found-art">
        <TechText text="404" fontWeight={600} fontSize={440} letterSpacing={-.04} reveal="letter" dashLength={2} dashGap={2} specks={32} strokeWidth={1.5} speed={.9} draggable />
      </div>
      <div className="not-found-copy">
        <h2>A little off the grid.</h2>
        <p>Let’s find you something worth exploring.</p>
        <div className="not-found-actions">
          <Link to="/browse" className="button primary">Browse components</Link>
          <Link to="/" className="button">Back home</Link>
        </div>
      </div>
    </main>
  )
}
