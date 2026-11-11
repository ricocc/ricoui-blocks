import { site } from '../lib/site'

export const siteLinks = {
  home: '/',
  github: site.github,
  author: 'https://ricoui.com',
  x: 'https://x.com/ricouii',
  privacy: '/privacy',
  brands: '/brands',
  license: `${site.github}/blob/main/LICENSE`,
  llms: '/llms.txt',
  sitemap: '/sitemap.xml',
} as const

export const headerNavigation = [
  { label: 'Home', to: '/' },
  { label: 'Components', to: '/components' },
  { label: 'Templates', to: '/templates' },
  { label: 'Docs', to: '/docs' },
] as const

export const footerExplore = [
  { label: 'Explore', to: '/browse' },
  { label: 'Components', to: '/components' },
  { label: 'Templates', to: '/templates' },
  { label: 'Docs', to: '/docs' },
  { label: 'Brand assets', to: siteLinks.brands },
] as const

export const footerConnect = [
  { label: 'GitHub', href: siteLinks.github, external: true },
  { label: 'X', href: siteLinks.x, external: true },
  { label: 'RICOUI', href: siteLinks.author, external: true },
  { label: 'llms.txt', href: siteLinks.llms, external: false },
] as const

export const footerLegal = [
  { label: 'Privacy', to: siteLinks.privacy },
  { label: 'License', href: siteLinks.license },
] as const

export const compactFooterNavigation = [
  { label: 'Explore', to: '/browse' },
  { label: 'Templates', to: '/templates' },
  { label: 'Docs', to: '/docs' },
  { label: 'Brand assets', to: siteLinks.brands },
  { label: 'Privacy', to: siteLinks.privacy },
  { label: 'License', href: siteLinks.license, external: true },
  { label: 'X', href: siteLinks.x, external: true },
  { label: 'For AI agents', href: siteLinks.llms },
  { label: 'Sitemap', href: siteLinks.sitemap },
] as const

export const footerCopy = {
  brand: 'RICOUI',
  brandSuffix: 'BLOCKS',
  wordmark: 'RICOUI BLOCKS',
  sectionHeadings: { explore: 'EXPLORE', connect: 'CONNECT', legal: 'LEGAL' },
  description: ['Thoughtful React components.', 'Expressive interactions.'],
  authorCredit: 'By RICOUI',
  compactDescription: 'Made with care. Built to be yours.',
  compactAuthorCredit: 'Built by',
  copyright: '© 2026 RICOUI.',
  backToTop: 'Back to top',
} as const
