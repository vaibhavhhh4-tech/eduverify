'use client'

import { useState } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  Layers,
  Scale,
  ShieldAlert,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { DemoBadge } from '@/components/brand/logo'
import { PageHeader, Panel, StatCard } from '@/components/dashboard/shared'
import { AppShell } from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { store, useAppState } from '@/lib/storage'
import { cn } from '@/lib/utils'
import type { Alert } from '@/types'

export default function AicteDuplicatesPage() {
  const { alerts } = useAppState()
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)

  function handleNoticeSend(alertId: string) {
    store.updateAlert(alertId, { status: 'Under Review' }, 'Issued regulatory inquiry notice to participating institutions.')
    toast.success('Inquiry notice transmitted to both institutions')
  }

  function handleResolve(alertId: string) {
    store.updateAlert(alertId, { status: 'Resolved' }, 'Resolved by AICTE Approvals Bureau after verification of bonafide admission.')
    toast.success('Alert resolved at national bureau level')
    setSelectedAlert(null)
  }

  return (
    <AppShell role="aicte">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="National Multi-Institution Duplicate Registry"
          description="Algorithmic cross-institution collision detection across state borders and academic councils."
          badge={<DemoBadge label="CROSS-INSTITUTION RADAR" />}
        />

        {/* Top summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Total Active Collisions"
            value={alerts.length}
            icon={ShieldAlert}
            tone="red"
            hint="Same APAAR enrolled in >1 institution"
          />
          <StatCard
            label="Under Regional Bureau Review"
            value={alerts.filter((a) => a.status === 'Under Review').length}
            icon={Clock}
            tone="saffron"
            hint="Notices issued to registrars"
          />
          <StatCard
            label="Resolved Collisions"
            value={alerts.filter((a) => a.status === 'Resolved').length}
            icon={CheckCircle2}
            tone="green"
            hint="Dual enrolment cancelled or cleared"
          />
        </div>

        {/* Alerts List */}
        <div className="flex flex-col gap-3">
          {alerts.map((alt) => (
            <div
              key={alt.id}
              className={cn(
                'flex flex-col justify-between rounded-xl border bg-card p-4 text-xs shadow-xs transition sm:flex-row sm:items-center gap-4',
                alt.status === 'Resolved' && 'opacity-65',
              )}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                  <ShieldAlert className="size-4" />
                </span>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-foreground text-sm">{alt.subject}</span>
                    <Badge variant={alt.severity === 'Critical' ? 'destructive' : 'default'} className="text-[10px]">
                      {alt.severity} Severity
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {alt.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed max-w-3xl">
                    {alt.description}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono mt-0.5">
                    <span>Alert ID: {alt.id}</span>
                    <span>·</span>
                    <span>Reporting Entity: {alt.institution}</span>
                    <span>·</span>
                    <span>Date Logged: {alt.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setSelectedAlert(alt)}
                >
                  <Scale className="size-3.5 mr-1" />
                  Investigate Dossier
                </Button>
                {alt.status === 'Open' && (
                  <Button
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => handleNoticeSend(alt.id)}
                  >
                    Issue Inquiry Notice
                  </Button>
                )}
                {alt.status !== 'Resolved' && (
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-india-green hover:bg-india-green/90"
                    onClick={() => handleResolve(alt.id)}
                  >
                    Clear Alert
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Dossier Modal */}
        <Dialog open={!!selectedAlert} onOpenChange={(open) => !open && setSelectedAlert(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>AICTE Cross-Institution Investigation #{selectedAlert?.id}</DialogTitle>
              <DialogDescription>
                Comparison of conflicting student admissions logged across accredited institutions.
              </DialogDescription>
            </DialogHeader>

            {selectedAlert && (
              <div className="flex flex-col gap-4 text-xs">
                <div className="rounded-lg border bg-muted/40 p-3">
                  <span className="font-semibold">{selectedAlert.subject}</span>
                  <p className="text-muted-foreground mt-0.5">{selectedAlert.description}</p>
                </div>

                {selectedAlert.comparison && (
                  <div className="grid grid-cols-2 gap-3">
                    {selectedAlert.comparison.map((rec, i) => (
                      <div key={i} className="flex flex-col gap-2 rounded-lg border bg-card p-3 shadow-xs">
                        <span className="font-bold text-gov-blue text-sm border-b pb-1">
                          {rec.source}
                        </span>
                        <div className="flex flex-col gap-1.5 text-[11px]">
                          {Object.entries(rec.fields).map(([k, v]) => (
                            <div key={k} className="flex flex-col">
                              <span className="text-muted-foreground text-[10px] uppercase font-semibold">{k}</span>
                              <span className="font-medium text-foreground">{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedAlert(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
