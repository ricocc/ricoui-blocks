import type { ReactNode } from 'react'

export function CatalogShell({ children }: { children: ReactNode }) {
  return <div className="catalog-shell">{children}</div>
}
