import { site } from './site'

export type PreviewPrompt = {
  component: string
  slug: string
  values: Record<string, unknown>
  notes?: string
}

export function buildPreviewPrompt({ component, slug, values, notes }: PreviewPrompt) {
  return [
    `Apply these props where RicoUI ${component} is used.`,
    `Reference: ${site.url}/r/${slug}.json`,
    ...(notes ? [notes] : []),
    '',
    '```json',
    JSON.stringify(values, null, 2),
    '```',
  ].join('\n')
}
