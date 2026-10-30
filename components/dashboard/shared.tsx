import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function PageHeader({
  title,
  description,
  actions,
  badge,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
  badge?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
          {badge}
        </div>
        {description && <p className="max-w-3xl text-pretty text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

const TONES = {
  navy: 'bg-primary/8 text-primary',
  blue: 'bg-gov-blue/10 text-gov-blue',
  green: 'bg-india-green/10 text-india-green',
  saffron: 'bg-saffron/15 text-[oklch(0.5_0.13_55)]',
  red: 'bg-destructive/10 text-destructive',
} as const

export type Tone = keyof typeof TONES

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'navy',
  hint,
  footer,
}: {
  label: string
  value: string | number
  icon: LucideIcon
  tone?: Tone
  hint?: string
  footer?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', TONES[tone])}>
          <Icon className="size-4.5" aria-hidden="true" />
        </span>
      </div>
      <span className="text-2xl font-bold tabular-nums tracking-tight text-foreground">{value}</span>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      {footer}
    </div>
  )
}

export function Panel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <section className={cn('flex flex-col rounded-xl border bg-card shadow-xs', className)}>
      {(title || actions) && (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4">
          <div className="flex flex-col gap-0.5">
            {title && <h3 className="text-sm font-semibold text-foreground">{title}</h3>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn('flex-1 p-5', bodyClassName)}>{children}</div>
    </section>
  )
}

const STATUS_STYLES: Record<string, string> = {
  Verified: 'border-india-green/30 bg-india-green/10 text-india-green',
  VERIFIED: 'border-india-green/30 bg-india-green/10 text-india-green',
  Linked: 'border-india-green/30 bg-india-green/10 text-india-green',
  Resolved: 'border-india-green/30 bg-india-green/10 text-india-green',
  Granted: 'border-india-green/30 bg-india-green/10 text-india-green',
  Submitted: 'border-india-green/30 bg-india-green/10 text-india-green',
  'Within Intake': 'border-india-green/30 bg-india-green/10 text-india-green',
  Valid: 'border-india-green/30 bg-india-green/10 text-india-green',
  Pending: 'border-saffron/40 bg-saffron/15 text-[oklch(0.48_0.12_55)]',
  PENDING: 'border-saffron/40 bg-saffron/15 text-[oklch(0.48_0.12_55)]',
  'Consent Pending': 'border-saffron/40 bg-saffron/15 text-[oklch(0.48_0.12_55)]',
  'Under Review': 'border-saffron/40 bg-saffron/15 text-[oklch(0.48_0.12_55)]',
  Simulated: 'border-gov-blue/30 bg-gov-blue/10 text-gov-blue',
  Reviewed: 'border-gov-blue/30 bg-gov-blue/10 text-gov-blue',
  Draft: 'border-gov-blue/30 bg-gov-blue/10 text-gov-blue',
  Open: 'border-destructive/30 bg-destructive/10 text-destructive',
  Flagged: 'border-destructive/30 bg-destructive/10 text-destructive',
  'NOT VERIFIED': 'border-destructive/30 bg-destructive/10 text-destructive',
  Overdue: 'border-destructive/30 bg-destructive/10 text-destructive',
  'Exceeds Intake': 'border-destructive/30 bg-destructive/10 text-destructive',
  'Category Limit Exceeded': 'border-destructive/30 bg-destructive/10 text-destructive',
  Invalid: 'border-destructive/30 bg-destructive/10 text-destructive',
  Critical: 'border-destructive/40 bg-destructive text-white',
  High: 'border-destructive/30 bg-destructive/10 text-destructive',
  Medium: 'border-saffron/40 bg-saffron/15 text-[oklch(0.48_0.12_55)]',
  Low: 'border-border bg-muted text-muted-foreground',
  'Not Linked': 'border-border bg-muted text-muted-foreground',
  Revoked: 'border-border bg-muted text-muted-foreground',
  Expired: 'border-border bg-muted text-muted-foreground',
  Archived: 'border-border bg-muted text-muted-foreground',
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge variant="outline" className={cn('font-medium', STATUS_STYLES[status] ?? 'bg-muted text-muted-foreground', className)}>
      {status}
    </Badge>
  )
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <p className="text-sm font-semibold">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export function SimulationNotice({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex gap-2 rounded-lg border border-saffron/40 bg-saffron/10 px-4 py-3 text-sm text-foreground', className)} role="note">
      <span className="mt-0.5 shrink-0 rounded bg-saffron px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-primary">DEMO</span>
      <span className="text-pretty">{children}</span>
    </div>
  )
}

export function DefinitionList({ items, columns = 2 }: { items: [string, React.ReactNode][]; columns?: 1 | 2 | 3 }) {
  return (
    <dl className={cn('grid gap-x-6 gap-y-3', columns === 2 && 'sm:grid-cols-2', columns === 3 && 'sm:grid-cols-2 lg:grid-cols-3')}>
      {items.map(([k, v]) => (
        <div key={k} className="flex flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground">{k}</dt>
          <dd className="text-sm font-medium text-foreground">{v}</dd>
        </div>
      ))}
    </dl>
  )
}
