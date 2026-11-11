import { Link } from '@tanstack/react-router'
import { useRef, useState, type ReactNode } from 'react'
import { componentCategories, publishedComponents, type ComponentMeta } from '../../data/components'
import { site } from '../../lib/site'
import { Icon } from './icon'
import { ThemeToggle } from './theme-toggle'

function DetailRail({ to, from = 0, active = false }: { to: number; from?: number; active?: boolean }) {
  return <span className={'detail-directory-rail ' + (active ? 'is-active' : 'is-hovered')} style={{ top: from, height: Math.max(0, to - 6 - from) }} aria-hidden="true">
    <span className="detail-directory-rail-line" />
    <svg className="detail-directory-rail-corner" width="13" height="7" viewBox="0 0 13 7" fill="none" aria-hidden="true"><path d="M.5 0a6 6 0 0 0 6 6H13" stroke="currentColor" strokeDasharray="2 2" /></svg>
  </span>
}

function DetailNavigationGroup({ label, items, activeSlug, onNavigate }: {
  label: string
  items: ComponentMeta[]
  activeSlug: string
  onNavigate?: () => void
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const activeIndex = items.findIndex(component => component.slug === activeSlug)
  const activeY = (activeIndex + .5) * 34
  const hoverY = hoverIndex === null ? 0 : (hoverIndex + .5) * 34
  const hoverFrom = activeIndex < 0 ? 0 : hoverY > activeY ? activeY : Math.max(0, hoverY - 6)
  return <section className="detail-directory-group">
    <h2>{label}</h2>
    <div className="detail-directory-items" onMouseLeave={() => setHoverIndex(null)}>
      {hoverIndex !== null && hoverIndex !== activeIndex && <DetailRail from={hoverFrom} to={hoverY} />}
      {activeIndex >= 0 && <DetailRail to={activeY} active />}
      {items.map((component, index) => <Link
        key={component.slug}
        className="detail-directory-link"
        to="/components/$slug"
        params={{ slug: component.slug }}
        aria-current={component.slug === activeSlug ? 'page' : undefined}
        onMouseEnter={() => setHoverIndex(index)}
        onFocus={() => setHoverIndex(index)}
        onBlur={() => setHoverIndex(null)}
        onClick={onNavigate}
      >{component.name}</Link>)}
    </div>
  </section>
}

function DetailNavigation({ activeSlug, onNavigate }: { activeSlug: string; onNavigate?: () => void }) {
  return <>
    <Link to="/components" className="detail-directory-title" onClick={onNavigate}>Components</Link>
    <nav className="detail-directory-scroll" aria-label="Component directory">
      {componentCategories.map(category => {
        const items = publishedComponents.filter(component => component.category === category.slug)
        if (!items.length) return null
        return <DetailNavigationGroup key={category.slug} label={category.label} items={items} activeSlug={activeSlug} onNavigate={onNavigate} />
      })}
    </nav>
    <div className="detail-directory-actions">
      <ThemeToggle />
      <a className="icon-button" href={site.github} target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub"><Icon name="github" /></a>
    </div>
  </>
}

export function DetailShell({ activeSlug, children }: { activeSlug: string; children: ReactNode }) {
  const [navOpen, setNavOpen] = useState(true)
  const dialog = useRef<HTMLDialogElement>(null)
  const mobileTrigger = useRef<HTMLButtonElement>(null)

  return <div className="component-detail-shell" data-nav-open={navOpen}>
    <button type="button" className="detail-nav-trigger icon-button" aria-label={navOpen ? 'Close component navigation' : 'Open component navigation'} aria-expanded={navOpen} onClick={() => setNavOpen(!navOpen)}><Icon name="panel" /></button>
    <button ref={mobileTrigger} type="button" className="detail-mobile-nav-trigger icon-button" aria-label="Open component navigation" onClick={() => dialog.current?.showModal()}><Icon name="panel" /></button>
    <aside className="detail-directory" inert={!navOpen}>
      <DetailNavigation activeSlug={activeSlug} />
    </aside>
    <div className="detail-main">
      {children}
    </div>
    <dialog ref={dialog} className="detail-mobile-directory" onClose={() => mobileTrigger.current?.focus()} onClick={event => { if (event.target === dialog.current) dialog.current.close() }}>
      <button type="button" className="detail-directory-close icon-button" aria-label="Close component navigation" onClick={() => dialog.current?.close()}><Icon name="close" /></button>
      <DetailNavigation activeSlug={activeSlug} onNavigate={() => dialog.current?.close()} />
    </dialog>
  </div>
}
