import { createFileRoute } from '@tanstack/react-router'
import { robots, textResponse } from '../lib/seo-content'

export const Route = createFileRoute('/robots.txt')({ server: { handlers: { GET: () => textResponse(robots()) } } })
