import type { ReactNode } from 'react'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'
import { SiteFooter } from '../components/site/site-footer'
import { Header } from '../components/site/header'
import { NotFoundPage } from '../components/site/not-found-page'
import appCss from '../styles.css?url'
import { GoogleAnalytics } from '../components/site/google-analytics'
import { site } from '../lib/site'
import { themeScript } from '../components/site/theme-toggle'
import { GlobalSearchProvider } from '../components/site/global-search'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'RicoUI' },
      {
        name: 'description',
        content: 'Rare, refined motion components for React and Tailwind.',
      },
    ],
    links: [
      { rel: 'preload', href: '/fonts/paper-mono-variable.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.png' },
      { rel: 'alternate', type: 'text/plain', href: '/llms.txt', title: 'RicoUI for AI agents' },
    ],
    scripts: [{
      type: 'application/ld+json',
      children: JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.url, description: site.description, creator: { '@type': 'Person', name: 'Rico' }, sameAs: [site.github] }),
    }],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundPage,
})

function RootComponent() {
  const detail = useRouterState({ select: state =>
    /^\/components\/[^/]+\/?$/.test(state.location.pathname) &&
    !state.matches.some(match => match.status === 'notFound' || match._notFound)
  })
  const home = useRouterState({ select: state => state.location.pathname === '/' })
  const comparison = useRouterState({ select: state => state.location.pathname === '/home' })
  const browse = useRouterState({ select: state => state.location.pathname === '/browse' })
  return (
    <RootDocument>
      <GlobalSearchProvider>
      <div className={comparison ? 'legacy-comparison' : undefined} style={comparison ? undefined : { display: 'contents' }}>
      <a href="#main-content" className="skip-link">Skip to content</a>
      {!detail && <Header />}
      <Outlet />
      {!detail && !browse && !home && <SiteFooter />}
      </div>
      <GoogleAnalytics />
      </GlobalSearchProvider>
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
