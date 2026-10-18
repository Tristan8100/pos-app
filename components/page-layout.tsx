import type { ReactNode } from 'react'

type PageLayoutProps = {
  title: string
  description: string
  badge?: ReactNode
  actions?: ReactNode
  children: ReactNode
}

export function PageLayout({
  title,
  description,
  badge,
  actions,
  children
}: PageLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {badge}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {actions}
      </div>

      <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
        {children}
      </div>
    </div>
  )
}
