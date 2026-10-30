'use client'

import { useMemo, useState } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileSearch,
  Filter,
  Info,
  Layers,
  Scale,
  ShieldAlert,
  ShieldCheck,
  UserX,
  X,
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
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { inconsistentRecords, similarNameGroups } from '@/lib/services/records'
import { store, useAppState } from '@/lib/storage'
import { cn, formatDateTime } from '@/lib/utils'
import type { Alert, AlertSeverity, AlertStatus } from '@/types'

export default function DuplicateDetectionPage() {
  const { alerts, students } = useAppState()

  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [severityFilter, setSeverityFilter] = useState<string>('ALL')
  const [activeAlert, setActiveAlert] = useState<Alert | null>(null)
  const [resolutionNote, setResolutionNote] = useState<string>('')

  // Rule-based heuristic queries
  const similarNames = useMemo(() => similarNameGroups(students), [students])
  const inconsistent = useMemo(() => inconsistentRecords(students), [students])

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (statusFilter !== 'ALL' && a.status !== statusFilter) return false
      if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false
      return true
    })
  }, [alerts, statusFilter, severityFilter])

  const openCount = alerts.filter((a) => a.status === 'Open').length
  const underReviewCount = alerts.filter((a) => a.status === 'Under Review').length
  const resolvedCount = alerts.filter((a) => a.status === 'Resolved').length

  // Action: Mark Reviewed
  function handleMarkReviewed(alertId: string) {
    store.updateAlert(alertId, { status: 'Under Review' }, 'Flagged for officer review and document cross-check')
    toast.info('Alert status updated to Under Review')
  }

  // Action: Resolve Alert
  function handleResolve(alertId: string) {
    const note = resolutionNote.trim() || 'Resolved by Institution Administrator after manual document review.'
    store.updateAlert(alertId, { status: 'Resolved' }, note)
    toast.success('Alert marked as Resolved')
    setActiveAlert(null)
    setResolutionNote('')
  }

  return (
    <AppShell role="institution">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Duplicate Identity & Record Anomaly Detection"
          description="Algorithmic cross-checking of APAAR numbers, enrolment identifiers, and phonetic name clustering."
          badge={<DemoBadge label="RULE-BASED SCANNER" />}
        />

        {/* Explainable Detection Notice */}
        <div className="flex items-start gap-3 rounded-xl border border-gov-blue/30 bg-gov-blue/5 p-4 text-xs">
          <Info className="size-5 shrink-0 text-gov-blue mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-foreground">
              Explainable Rule-Based Verification · Ethical AI Guarantee
            </span>
            <p className="text-muted-foreground leading-relaxed">
              Detection rules highlight discrepancies such as multi-institution APAAR collisions, duplicate enrolment IDs, and phonetic name overlap. Alerts represent investigative leads for administrative verification; students are never automatically flagged or penalized without manual human review.
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Open Actionable Alerts"
            value={openCount}
            icon={ShieldAlert}
            tone={openCount > 0 ? 'red' : 'green'}
            hint="Requires administrative investigation"
          />
          <StatCard
            label="Under Review"
            value={underReviewCount}
            icon={Clock}
            tone="saffron"
            hint="Awaiting student documentation"
          />
          <StatCard
            label="Resolved Discrepancies"
            value={resolvedCount}
            icon={CheckCircle2}
            tone="green"
            hint="Cleared with audit explanation"
          />
        </div>

        {/* Heuristic Signals Bar */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
          <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-saffron/15 text-[oklch(0.5_0.13_55)]">
                <Layers className="size-4.5" />
              </span>
              <div>
                <span className="font-semibold text-foreground text-sm block">Phonetic Name Clusters</span>
                <span className="text-muted-foreground">{similarNames.length} clusters with identical phonetic spellings</span>
              </div>
            </div>
            <Badge variant="outline">{similarNames.length} groups</Badge>
          </div>
          <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileSearch className="size-4.5" />
              </span>
              <div>
                <span className="font-semibold text-foreground text-sm block">Record Schema Inconsistencies</span>
                <span className="text-muted-foreground">{inconsistent.length} records with syntax or course-branch mismatches</span>
              </div>
            </div>
            <Badge variant="outline">{inconsistent.length} records</Badge>
          </div>
        </div>

        {/* Filter Controls */}
        <Panel className="border-muted bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Status:</span>
                <NativeSelect
                  size="sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <NativeSelectOption value="ALL">All Statuses</NativeSelectOption>
                  <NativeSelectOption value="Open">Open</NativeSelectOption>
                  <NativeSelectOption value="Under Review">Under Review</NativeSelectOption>
                  <NativeSelectOption value="Resolved">Resolved</NativeSelectOption>
                </NativeSelect>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Severity:</span>
                <NativeSelect
                  size="sm"
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                >
                  <NativeSelectOption value="ALL">All Severities</NativeSelectOption>
                  <NativeSelectOption value="Critical">Critical</NativeSelectOption>
                  <NativeSelectOption value="High">High</NativeSelectOption>
                  <NativeSelectOption value="Medium">Medium</NativeSelectOption>
                  <NativeSelectOption value="Low">Low</NativeSelectOption>
                </NativeSelect>
              </div>
            </div>

            <span className="text-xs text-muted-foreground">
              Showing <strong className="text-foreground">{filteredAlerts.length}</strong> alerts
            </span>
          </div>
        </Panel>

        {/* Alerts List */}
        <div className="flex flex-col gap-3">
          {filteredAlerts.length === 0 ? (
            <Panel className="py-12 text-center text-muted-foreground text-xs">
              No duplicate or compliance alerts match the selected criteria.
            </Panel>
          ) : (
            filteredAlerts.map((alt) => (
              <div
                key={alt.id}
                className={cn(
                  'flex flex-col justify-between rounded-xl border bg-card p-4 text-xs shadow-xs transition hover:border-gov-blue/50 sm:flex-row sm:items-center gap-4',
                  alt.status === 'Resolved' && 'opacity-65',
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg',
                      alt.severity === 'Critical'
                        ? 'bg-destructive/10 text-destructive'
                        : alt.severity === 'High'
                        ? 'bg-saffron/15 text-[oklch(0.5_0.13_55)]'
                        : 'bg-primary/10 text-primary',
                    )}
                  >
                    <ShieldAlert className="size-4" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-foreground text-sm">{alt.subject}</span>
                      <Badge
                        variant={
                          alt.severity === 'Critical'
                            ? 'destructive'
                            : alt.severity === 'High'
                            ? 'default'
                            : 'outline'
                        }
                        className="text-[10px]"
                      >
                        {alt.severity}
                      </Badge>
                      <Badge
                        variant={alt.status === 'Resolved' ? 'default' : 'outline'}
                        className={cn('text-[10px]', alt.status === 'Resolved' && 'bg-india-green')}
                      >
                        {alt.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed max-w-3xl">
                      {alt.description}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1 font-mono">
                      <span>ID: {alt.id}</span>
                      <span>·</span>
                      <span>Logged: {alt.date}</span>
                      <span>·</span>
                      <span>Institution: {alt.institution}</span>
                    </div>

                    {alt.notes && alt.notes.length > 0 && (
                      <div className="mt-2 rounded-md bg-muted/40 p-2 text-[11px] text-muted-foreground">
                        <span className="font-semibold text-foreground">Audit Notes: </span>
                        {alt.notes[alt.notes.length - 1]}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setActiveAlert(alt)}
                  >
                    <Scale className="size-3.5" data-icon="inline-start" />
                    Investigate
                  </Button>
                  {alt.status === 'Open' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => handleMarkReviewed(alt.id)}
                    >
                      Mark Reviewed
                    </Button>
                  )}
                  {alt.status !== 'Resolved' && (
                    <Button
                      size="sm"
                      className="h-8 text-xs bg-india-green hover:bg-india-green/90"
                      onClick={() => handleResolve(alt.id)}
                    >
                      <CheckCircle2 className="size-3.5" data-icon="inline-start" />
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Side-by-Side Comparison Investigation Modal */}
        <Dialog open={!!activeAlert} onOpenChange={(open) => !open && setActiveAlert(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Investigate Identity Discrepancy #{activeAlert?.id}</span>
                {activeAlert && (
                  <Badge variant={activeAlert.severity === 'Critical' ? 'destructive' : 'outline'}>
                    {activeAlert.severity} Risk
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription>
                Side-by-side comparison of claimed records to evaluate APAAR or enrolment collision.
              </DialogDescription>
            </DialogHeader>

            {activeAlert && (
              <div className="flex flex-col gap-4 text-xs">
                <div className="rounded-lg border bg-muted/40 p-3">
                  <span className="font-semibold text-foreground">{activeAlert.subject}</span>
                  <p className="text-muted-foreground mt-0.5">{activeAlert.description}</p>
                </div>

                {/* Comparison Columns */}
                {activeAlert.comparison && activeAlert.comparison.length >= 2 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {activeAlert.comparison.map((rec, i) => (
                      <div key={i} className="flex flex-col gap-2 rounded-lg border bg-card p-3 shadow-xs">
                        <span className="font-bold text-gov-blue text-sm border-b pb-1">
                          Record {i + 1}: {rec.source}
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
                ) : (
                  <div className="rounded-lg border border-dashed p-4 text-center text-muted-foreground">
                    Direct comparison data synthesized from institutional audit registry.
                  </div>
                )}

                {/* Resolution Note Input */}
                <div className="flex flex-col gap-1.5 border-t pt-3">
                  <label htmlFor="res-note" className="font-semibold text-foreground">
                    Resolution Justification Note:
                  </label>
                  <Input
                    id="res-note"
                    placeholder="e.g. Verified original physical Aadhaar/APAAR card and Class X certificate..."
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                  />
                </div>
              </div>
            )}

            <DialogFooter className="mt-2">
              <Button variant="outline" onClick={() => setActiveAlert(null)}>
                Close
              </Button>
              {activeAlert?.status !== 'Resolved' && (
                <Button onClick={() => activeAlert && handleResolve(activeAlert.id)}>
                  Confirm & Resolve Discrepancy
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
