import { publishedComponents } from '../data/components'
import { getSourceCode } from '../data/source-code'
import { site } from './site'
import { siteLinks } from '../data/site-navigation'

const escapeXml = (text: string) => text.replace(/[<>&"']/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]!)

export function sitemap() {
  const paths = ['/', '/browse', '/docs', '/components', '/templates', '/privacy', '/brands', ...publishedComponents.map(c => '/components/' + c.slug)]
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + paths.map(path => '<url><loc>' + escapeXml(site.url + path) + '</loc></url>').join('') + '</urlset>'
}

export function robots() {
  return 'User-agent: *\nAllow: /\nDisallow: /r/\nDisallow: /api/\nDisallow: /ingest/\nSitemap: ' + site.url + '/sitemap.xml\n'
}

export function llms(full = false) {
  const intro = '# RicoUI Blocks\n\n> React + Tailwind CSS 4 components with expressive interactions. Copy source or install with shadcn Registry URLs.\n\n'
    + 'Website: ' + site.url + '\nRepository: ' + site.github + '\n\n'
    + '## Usage\n\nRequires React and Tailwind CSS 4. Components are independent of TanStack Start and do not require shadcn/ui at runtime. '
    + 'Respect reduced-motion preferences. Component code is in registry/; preview controls are website-only. '
    + 'RicoUI’s own code is licensed under MIT: ' + siteLinks.license + '. Preserve the copyright and license notice. Third-party code, fonts, and other assets retain their own licenses; consult their notices and each template repository.\n\n'
    + '## Documentation\n\n- [Getting started](' + site.url + '/docs)\n- [Browse components](' + site.url + '/browse)\n- [Component catalog](' + site.url + '/components)\n- [Privacy](' + site.url + '/privacy)\n- [Complete source and API documentation](' + site.url + '/llms-full.txt)\n\n## Components\n\n'
  return intro + publishedComponents.map(c => {
    const summary = '- [' + c.name + '](' + site.url + '/components/' + c.slug + '): ' + c.description + '\n'
    if (!full) return summary
    return '### ' + c.name + '\n\n' + summary + '\nCategory: ' + c.category + '\nDependencies: ' + (c.dependencies.join(', ') || 'React and Tailwind only') + '\n\n'
      + 'Install: pnpm dlx shadcn@latest add ' + site.url + '/r/' + c.slug + '.json\n\n'
      + 'Props:\n' + (c.props || []).map(p => '- ' + p.name + ' (' + p.type + '): ' + p.description + (p.defaultValue ? ' Default: ' + p.defaultValue : '')).join('\n')
      + '\n\nUsage:\n\n```tsx\n' + (c.usage || '') + '\n```\n\nSource:\n\n```tsx\n' + (getSourceCode(c.slug) || '') + '\n```\n'
  }).join('\n')
}

export function textResponse(body: string, type = 'text/plain') {
  return new Response(body, { headers: { 'Content-Type': type + '; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } })
}
