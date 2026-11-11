import { Suspense } from 'react'
import { getPreviewBySlug } from '../../data/preview-registry'
import { PreviewLoading } from './preview-loading'

type ComponentPreviewProps = {
  slug: string
}

export function ComponentPreview({ slug }: ComponentPreviewProps) {
  const Preview = getPreviewBySlug(slug)

  if (!Preview) {
    return (
      <div className="flex min-h-64 items-center justify-center bg-[var(--surface-subtle)] p-6 text-center text-sm leading-6 text-[var(--foreground-muted)]">
        Preview unavailable.
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <PreviewLoading />
      }
    >
      <Preview />
    </Suspense>
  )
}
