import { createFileRoute } from '@tanstack/react-router'
import { llms, textResponse } from '../lib/seo-content'

export const Route = createFileRoute('/llm.text')({ server: { handlers: { GET: () => textResponse(llms()) } } })
