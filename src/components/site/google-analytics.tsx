import { useEffect } from 'react'

declare global {
  interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void }
}

/** GA4 enhanced measurement handles History API navigation. */
export function GoogleAnalytics() {
  useEffect(() => {
    const id = import.meta.env.VITE_GOOGLE_ANALYTICS_ID
    if (!import.meta.env.PROD || !id || !/^G-[A-Z0-9]+$/.test(id) || document.getElementById('ricoui-analytics')) return
    window.dataLayer ??= []
    window.gtag = function () { window.dataLayer!.push(arguments) }
    window.gtag('js', new Date())
    window.gtag('config', id)
    const script = document.createElement('script')
    script.id = 'ricoui-analytics'
    script.async = true
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id)
    document.head.appendChild(script)
  }, [])
  return null
}

