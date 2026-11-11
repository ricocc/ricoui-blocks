import portfolioCover from '../assets/templates/portfolio.jpg'
import starterCover from '../assets/templates/starter.jpg'
import saasCover from '../assets/templates/saas.jpg'

export type WebsiteTemplate = {
  slug: string
  name: string
  description: string
  category: 'Portfolio' | 'SaaS' | 'Starter'
  framework: 'Astro'
  cover: { src: string; alt: string }
  previewUrl: string
  githubRepo: `${string}/${string}`
}

// Editorial information only. GitHub star counts are fetched at runtime.
export const templates: WebsiteTemplate[] = [
  {
    slug: 'ricoui-portfolio',
    name: 'RicoUI Portfolio',
    description: 'A portfolio for designers and creative professionals, with your work at the center.',
    category: 'Portfolio',
    framework: 'Astro',
    cover: { src: portfolioCover, alt: 'RicoUI Portfolio website preview' },
    previewUrl: 'https://portfolio.ricoui.com/',
    githubRepo: 'ricocc/ricoui-portfolio',
  },
  {
    slug: 'ricoui-saas',
    name: 'RicoUI SaaS Template',
    description: 'A considered landing page for SaaS products, with a clear structure for telling your product story.',
    category: 'SaaS',
    framework: 'Astro',
    cover: { src: saasCover, alt: 'RicoUI SaaS landing page with a product dashboard preview' },
    previewUrl: 'https://ricofast.pages.dev/',
    githubRepo: 'ricocc/ricoui-saas-template',
  },
  {
    slug: 'ricoui-starter',
    name: 'RicoUI Astro Starter',
    description: 'A lightweight, flexible starting point for content websites and personal projects.',
    category: 'Starter',
    framework: 'Astro',
    cover: { src: starterCover, alt: 'RicoUI Astro Starter website preview' },
    previewUrl: 'https://ricoui-astro-starter.vercel.app',
    githubRepo: 'ricocc/ricoui-astro-starter',
  },
]
