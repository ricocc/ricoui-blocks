import type { ReactNode } from 'react'

type ComponentDetailLayoutProps = {
  documentation: ReactNode
  preview: ReactNode
}

export function ComponentDetailLayout({
  documentation,
  preview,
}: ComponentDetailLayoutProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.9fr)] lg:gap-12">
      <div className="lg:sticky lg:top-24 lg:self-start">{preview}</div>
      <div>{documentation}</div>
    </div>
  )
}
