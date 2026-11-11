import { createFileRoute } from '@tanstack/react-router'
import { siteLinks } from '../data/site-navigation'
import { pageHead } from '../lib/site'
import '../components/site/docs.css'

export const Route = createFileRoute('/privacy')({
  head: () => pageHead('Privacy', 'How RicoUI Blocks uses browser storage, optional analytics, and third-party services.', '/privacy'),
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <main id="main-content" className="docs-page docs-guide privacy-page">
      <header className="docs-heading">
        <div><h1>Privacy</h1><p>How information is handled when you browse RicoUI Blocks.</p></div>
        <p className="privacy-updated">Last updated <time dateTime="2026-10-15">October 15, 2026</time></p>
      </header>
      <article className="docs-content" aria-label="Privacy policy">
        <section aria-labelledby="privacy-overview">
          <h2 id="privacy-overview">Browsing the site</h2>
          <p>You can browse components, read documentation, and copy source without creating an account or submitting personal information through a form on this site.</p>
        </section>
        <section aria-labelledby="privacy-storage">
          <h2 id="privacy-storage">Browser storage</h2>
          <p>When you choose a light or dark theme, the site saves that preference in your browser’s local storage. It stays there until you change it or clear the site’s stored data.</p>
          <p>Template repository star counts are cached in session storage for up to ten minutes before they need refreshing. The cache stays in your browser for the tab’s session. The navigation’s GitHub count is fetched again on each page entry without using this cache. You can remove preferences and cached values through your browser settings.</p>
        </section>
        <section aria-labelledby="privacy-github">
          <h2 id="privacy-github">GitHub information</h2>
          <p>To display repository star counts, your browser may request public repository information directly from GitHub’s API. GitHub receives the connection information needed to handle that request, such as your IP address and browser headers. See the <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noreferrer">GitHub Privacy Statement</a> for details.</p>
        </section>
        <section aria-labelledby="privacy-analytics">
          <h2 id="privacy-analytics">Optional analytics</h2>
          <p>Production versions of this site may enable Google Analytics 4 to understand visits and improve the collection. Analytics loads only when it is configured for that deployment.</p>
          <p>When enabled, Google Analytics uses cookies and similar technologies to measure page views and interactions, along with information about devices, browsers, and approximate location. Read <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">how Google uses information from sites that use its services</a>.</p>
          <p>You can manage cookies through your browser settings or use Google’s <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer">Analytics opt-out browser add-on</a> where supported.</p>
        </section>
        <section aria-labelledby="privacy-hosting">
          <h2 id="privacy-hosting">Hosting and external links</h2>
          <p>The website is hosted on Cloudflare. Cloudflare processes connection and request information, such as IP addresses, requested URLs, and technical logs, to deliver and protect the site. See <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noreferrer">Cloudflare’s Privacy Policy</a>.</p>
          <p>Links to GitHub, X, template previews, and other websites take you to services with their own privacy policies. Following an external link makes a request to that service.</p>
        </section>
        <section aria-labelledby="privacy-contact">
          <h2 id="privacy-contact">Contact and updates</h2>
          <p>For privacy questions or collaboration inquiries, contact <a href={siteLinks.x} target="_blank" rel="noreferrer">@ricouii on X</a>. Information you share there is handled through X.</p>
          <p>This page will be updated when the site’s data practices change. The date above shows the latest revision.</p>
        </section>
      </article>
    </main>
  )
}
