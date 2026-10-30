import Link from 'next/link'
import { ArrowRight, BadgeCheck, CircleDot, Fingerprint, LogIn, QrCode } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { DemoBadge } from '@/components/brand/logo'
import { cn } from '@/lib/utils'

export function Hero() {
  return (
    <section id="home" className="scroll-mt-28 border-b bg-card">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1.15fr_1fr]">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border bg-secondary px-3 py-1 text-xs font-medium text-primary">
            <CircleDot className="size-3 text-india-green" aria-hidden="true" />
            One Student. One Academic Identity. Trusted Everywhere.
          </span>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-[2.6rem] lg:leading-tight">
            Building a Trusted Academic Identity Ecosystem
          </h1>
          <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            A centralized platform for AICTE-approved institutions to securely manage student enrolment, validate APAAR identities and enable
            transparent academic verification.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/login" className={cn(buttonVariants({ size: 'lg' }))}>
              <LogIn data-icon="inline-start" />
              Login to Portal
            </Link>
            <a href="#features" className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}>
              Explore Platform
              <ArrowRight data-icon="inline-end" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            Smart India Hackathon prototype. Integrations with APAAR and DigiLocker are simulated for demonstration.
          </p>
        </div>

        <div className="relative">
          <div className="rounded-xl border bg-background p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Verification Record</span>
              <DemoBadge label="SAMPLE" />
            </div>
            <div className="mt-4 flex items-center gap-4 rounded-lg bg-card p-4 shadow-xs ring-1 ring-border">
              <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-lg font-semibold text-primary">AR</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">Ananya Rao</p>
                <p className="truncate text-sm text-muted-foreground">B.Tech CSE · SIEM Pune · 2026-27</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-india-green/10 px-2.5 py-1 text-xs font-semibold text-india-green">
                <BadgeCheck className="size-3.5" aria-hidden="true" /> Verified
              </span>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              {[
                { k: 'APAAR ID', v: 'XXXX XXXX 4821', icon: Fingerprint },
                { k: 'Reference', v: 'EVR-SI26CSE001', icon: QrCode },
              ].map((r) => (
                <div key={r.k} className="rounded-lg bg-card p-3 ring-1 ring-border">
                  <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <r.icon className="size-3.5" aria-hidden="true" />
                    {r.k}
                  </dt>
                  <dd className="mt-1 font-mono text-sm font-medium">{r.v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex flex-col gap-2">
              {[
                { label: 'Institution submission', done: true },
                { label: 'APAAR format & association check (simulated)', done: true },
                { label: 'DigiLocker documents (demo)', done: true },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2 text-sm">
                  <BadgeCheck className="size-4 text-india-green" aria-hidden="true" />
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
