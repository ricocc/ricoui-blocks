import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

type ComponentCardProps = {
  category: string
  description: string
  name: string
  preview: ReactNode
  slug: string
}

export function ComponentCard({
  category,
  description,
  name,
  preview,
  slug,
}: ComponentCardProps) {
  return (
    <article className="group">
      <div className="min-h-64 overflow-hidden rounded-[16px] border border-[var(--border)] bg-[var(--surface)] transition-colors duration-200 group-hover:border-[#bdbdb7]">
        {preview}
      </div>
      <div className="flex items-start justify-between gap-6 px-1 pb-1 pt-4">
        <div>
          <h3 className="font-medium tracking-[-0.02em] text-[var(--foreground)]">
            <Link
              to="/components/$slug"
              params={{ slug }}
              className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--link)]"
            >
              {name}
            </Link>
          </h3>
          <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
            {description}
          </p>
        </div>
        <span className="shrink-0 pt-0.5 text-xs text-[var(--foreground-faint)]">
          {category}
        </span>
      </div>
    </article>
  )
}
