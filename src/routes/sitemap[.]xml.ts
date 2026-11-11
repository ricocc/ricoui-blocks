import { createFileRoute } from '@tanstack/react-router'
import { sitemap, textResponse } from '../lib/seo-content'

export const Route = createFileRoute('/sitemap.xml')({ server: { handlers: { GET: () => textResponse(sitemap(), 'application/xml') } } })
