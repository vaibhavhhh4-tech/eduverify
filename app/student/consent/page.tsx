'use client'

import {
  FileText,
  Lock,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import { toast } from 'sonner'
import { DemoBadge } from '@/components/brand/logo'
import { PageHeader, Panel } from '@/components/dashboard/shared'
import { AppShell } from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { store, useAppState } from '@/lib/storage'
import { formatDateTime } from '@/lib/utils'

export default function StudentConsentPage() {
  const { consents } = useAppState()

  function handleToggleConsent(consentId: string, currentStatus: string) {
    const nextStatus = currentStatus === 'Granted' ? 'Revoked' : 'Granted'
    store.updateConsent(consentId, nextStatus)
    toast.info(`Updated consent authorization to ${nextStatus}`)
  }

  return (
    <AppShell role="student">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Data Consent & Access Management"
          description="Control which government portals, scholarship boards, and employers can verify your academic records."
          badge={<DemoBadge label="PRIVACY CONTROLS" />}
        />

        <Panel
          title="Active Third-Party Authorizations"
          description="Explicit consents recorded under National Digital Student Privacy Guidelines"
        >
          <div className="flex flex-col divide-y divide-border/60">
            {consents.map((c) => (
              <div key={c.id} className="flex flex-col justify-between py-4 sm:flex-row sm:items-center gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-gov-blue/10 text-gov-blue">
                    <ShieldCheck className="size-4" />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm">{c.party}</span>
                      <Badge
                        variant={c.status === 'Granted' ? 'default' : 'outline'}
                        className={c.status === 'Granted' ? 'bg-india-green text-[10px]' : 'text-[10px]'}
                      >
                        {c.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{c.purpose}</p>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono mt-0.5">
                      <span>Scope: {c.scope}</span>
                      <span>·</span>
                      <span>Granted on: {formatDateTime(c.at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:shrink-0">
                  <Button
                    variant={c.status === 'Granted' ? 'outline' : 'default'}
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => handleToggleConsent(c.id, c.status)}
                  >
                    {c.status === 'Granted' ? 'Revoke Consent' : 'Grant Access'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  )
}
