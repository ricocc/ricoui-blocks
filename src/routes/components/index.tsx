import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { componentCategories, publishedComponents } from '../../data/components'
import { CatalogShell } from '../../components/site/catalog-shell'
import { ShowcaseCard } from '../../components/site/showcase-card'
import { Icon } from '../../components/site/icon'
import { pageHead } from '../../lib/site'
import { SearchTrigger } from '../../components/site/global-search'

export const Route = createFileRoute('/components/')({ head: () => pageHead('The collection', undefined, '/components'), component: ComponentsIndexPage })

function ComponentsIndexPage() {
  const [category, setCategory] = useState('all')
  const visible = publishedComponents.filter(c => category === 'all' || c.category === category)
  const categories = [...componentCategories].filter(item => item.slug !== 'typography' || publishedComponents.some(component => component.category === item.slug)).sort((a, b) => Number(b.slug === 'dither-pop') - Number(a.slug === 'dither-pop'))
  return <CatalogShell><main id="main-content" className="collection-page">
    <header className="collection-heading"><span className="eyebrow">A GROWING COLLECTION</span><h1>Details make<br /><em>the difference.</em></h1><p>Explore, interact, and take what inspires you.<br />Every component comes with its source.</p><span className="collection-count">{String(publishedComponents.length).padStart(2,'0')}<small>COMPONENTS</small></span></header>
    <div className="collection-filters"><div className="filter-tabs" aria-label="Filter by category">{[{ slug: 'all', label: 'All components' }, ...categories].map(c => <button key={c.slug} aria-pressed={category === c.slug} className={category === c.slug ? 'selected' : ''} onClick={() => setCategory(c.slug)}>{c.label} <span className="filter-count">[{c.slug === 'all' ? publishedComponents.length : publishedComponents.filter(item => item.category === c.slug).length}]</span></button>)}</div><SearchTrigger /></div>
    {category === 'dither-pop' && <section className="dither-pop-intro" aria-label="Dither Pop style"><span className="eyebrow">RECOMMENDED</span><h2>Dither Pop <small>网点波普风格</small></h2><p>Halftone Textures · Tactile Objects · Playful Motion</p></section>}
    <p className="result-count" aria-live="polite">{visible.length} component{visible.length !== 1 ? 's' : ''}<span>PREVIEWS</span></p>
    {visible.length ? <div className="collection-grid">{visible.map(c => <ShowcaseCard key={c.slug} component={c} mode="hover" />)}</div> : <div className="empty-state"><Icon name="search" size={28} /><h2>Something good takes time.</h2><p>This category is still in the making. Explore the available components.</p><button className="button secondary" onClick={() => setCategory('all')}>View all components <Icon name="arrow" /></button></div>}
  </main></CatalogShell>
}
