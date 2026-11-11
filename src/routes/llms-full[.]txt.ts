import { createFileRoute } from '@tanstack/react-router'
import { llms, textResponse } from '../lib/seo-content'

export const Route = createFileRoute('/llms-full.txt')({ server: { handlers: { GET: () => textResponse(llms(true)) } } })
