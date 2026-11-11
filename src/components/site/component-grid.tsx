import type { ReactNode } from 'react'

type ComponentGridProps = {
  children: ReactNode
}

export function ComponentGrid({ children }: ComponentGridProps) {
  return (
    <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
      {children}
    </div>
  )
}
