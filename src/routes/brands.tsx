import { createFileRoute } from '@tanstack/react-router'
import { Icon } from '../components/site/icon'
import { brandAssets, brandAssetUrl } from '../data/brand-assets'
import { pageHead } from '../lib/site'
import '../components/site/docs.css'
import '../components/site/brands.css'

export const Route = createFileRoute('/brands')({
  head: () => pageHead('Brand assets', 'Download RicoUI logos and brand artwork as PNG files.', '/brands'),
  component: BrandsPage,
})

function BrandsPage() {
  return (
    <main id="main-content" className="docs-page docs-guide brands-page">
      <header className="docs-heading"><div><h1>Brand assets</h1><p>Download RicoUI logos and artwork as PNG files.</p></div></header>
      <div className="brands-grid">
        {brandAssets.map(asset => (
          <figure className="brand-asset" key={asset.file}>
            <div className="brand-asset-preview" data-surface={asset.surface}>
              <img src={brandAssetUrl(asset.file)} alt={asset.name} width={1024} height={1024} loading="lazy" decoding="async" />
            </div>
            <figcaption className="brand-asset-caption">
              <div><h2>{asset.name}</h2><p>{asset.file}</p></div>
              <a className="brand-asset-download" href={brandAssetUrl(asset.file)} download={asset.file} aria-label={'Download ' + asset.file}><Icon name="download" size={16} />Download PNG</a>
            </figcaption>
          </figure>
        ))}
      </div>
    </main>
  )
}
