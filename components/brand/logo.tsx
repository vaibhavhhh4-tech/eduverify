import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('relative inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground', className)}
    >
      <ShieldCheck className="size-5" />
      <span className="absolute inset-x-1.5 bottom-1 flex h-0.5 overflow-hidden rounded-full">
        <span className="flex-1 bg-saffron" />
        <span className="flex-1 bg-white" />
        <span className="flex-1 bg-india-green" />
      </span>
    </span>
  )
}

export function Logo({ href = '/', inverted = false, compact = false }: { href?: string; inverted?: boolean; compact?: boolean }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2">
      <BrandMark className={inverted ? 'bg-white text-primary' : undefined} />
      <span className="flex flex-col leading-tight">
        <span className={cn('text-lg font-bold tracking-tight', inverted ? 'text-white' : 'text-primary')}>EduVerify</span>
        {!compact && (
          <span className={cn('hidden text-[11px] font-medium sm:block', inverted ? 'text-white/70' : 'text-muted-foreground')}>
            APAAR-Based National Student Identity & Verification System
          </span>
        )}
      </span>
    </Link>
  )
}

export function TricolorRule({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('flex h-1 w-full', className)}>
      <div className="flex-1 bg-saffron" />
      <div className="flex-1 bg-white" />
      <div className="flex-1 bg-india-green" />
    </div>
  )
}

export function DemoBadge({ label = 'DEMO MODE', className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border border-saffron/40 bg-saffron/10 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-[oklch(0.45_0.12_55)]',
        className,
      )}
    >
      {label}
    </span>
  )
}
