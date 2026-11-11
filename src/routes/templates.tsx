import { createFileRoute } from '@tanstack/react-router'
import { CatalogShell } from '../components/site/catalog-shell'
import { Icon } from '../components/site/icon'
import { RepositoryStars } from '../components/site/repository-stars'
import { templates } from '../data/templates'
import { pageHead } from '../lib/site'
import '../components/site/templates.css'

export const Route = createFileRoute('/templates')({
  head: () => pageHead('Astro templates', 'Website templates for portfolios, SaaS products, and personal projects. Built with Astro by RicoUI.', '/templates'),
  component: TemplatesPage,
})

function TemplatesPage() {
  return <CatalogShell><main id="main-content" className="collection-page templates-page">
    <header className="collection-heading">
      <span className="eyebrow">ASTRO TEMPLATES</span>
      <h1>Templates.<br /><em>For your next site.</em></h1>
      <p>Astro templates for starters, portfolios, SaaS, and more.<br />Choose a starting point and make it entirely your own.</p>
      <span className="collection-count">{String(templates.length).padStart(2, '0')}<small>TEMPLATES</small></span>
    </header>
    <p className="result-count templates-summary">{templates.length} templates<span>BUILT WITH ASTRO</span></p>
    <div className="templates-grid">{templates.map((template, index) => <article className="template-card" key={template.slug}>
      <a className="template-cover" href={template.previewUrl} target="_blank" rel="noreferrer" aria-label={'Preview ' + template.name}>
        <img src={template.cover.src} alt={template.cover.alt} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />
      </a>
      <div className="template-card-content">
        <div className="template-meta"><span className="template-framework">{template.framework}</span><span>{template.category}</span><RepositoryStars repository={template.githubRepo} /></div>
        <h2><a href={template.previewUrl} target="_blank" rel="noreferrer">{template.name}</a></h2>
        <p>{template.description}</p>
        <div className="template-links">
          <a href={template.previewUrl} target="_blank" rel="noreferrer">Live preview <Icon name="external" size={15} /></a>
          <a href={'https://github.com/' + template.githubRepo} target="_blank" rel="noreferrer"><Icon name="github" size={15} /> Source code</a>
        </div>
      </div>
    </article>)}</div>
  </main></CatalogShell>
}
