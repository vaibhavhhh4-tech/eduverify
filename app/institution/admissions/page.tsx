'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Download,
  Info,
  TrendingUp,
  Users,
} from 'lucide-react'
import { DemoBadge } from '@/components/brand/logo'
import { SimpleBarChart } from '@/components/charts/gov-charts'
import { PageHeader, Panel, StatCard } from '@/components/dashboard/shared'
import { AppShell } from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { downloadCsv } from '@/lib/export'
import { BRANCHES, INSTITUTION } from '@/lib/mock-data'
import { branchBreakdown, institutionStats } from '@/lib/stats'
import { useAppState } from '@/lib/storage'
import { cn } from '@/lib/utils'

export default function AdmissionMonitoringPage() {
  const { students, alerts, academicYear } = useAppState()
  const stats = institutionStats(students, alerts, academicYear)
  const branches = branchBreakdown(students, academicYear)

  const totalApproved = branches.reduce((s, b) => s + b.approved, 0)
  const totalEnrolled = branches.reduce((s, b) => s + b.total, 0)
  const totalRegular = branches.reduce((s, b) => s + b.regular, 0)
  const totalSupernumerary = branches.reduce((s, b) => s + b.supernumerary, 0)
  const totalForeign = branches.reduce((s, b) => s + b.foreign, 0)
  const totalRemaining = branches.reduce((s, b) => s + b.remaining, 0)
  const overallUtilization = totalApproved > 0 ? Math.round((totalRegular / totalApproved) * 100) : 0

  const exceedingBranches = branches.filter((b) => b.regularVariance > 0)

  // Category allocation calculations
  const categoryStats = useMemo(() => {
    const active = students.filter(
      (s) => s.institutionCode === INSTITUTION.code && s.academicYear === academicYear && !s.archived,
    )
    const counts: Record<string, number> = { General: 0, 'OBC-NCL': 0, SC: 0, ST: 0, EWS: 0 }
    for (const s of active) counts[s.category] = (counts[s.category] ?? 0) + 1

    return [
      { name: 'General', policyPct: 40.5, count: counts.General, actualPct: Math.round((counts.General / active.length) * 100) },
      { name: 'OBC-NCL', policyPct: 27.0, count: counts['OBC-NCL'], actualPct: Math.round((counts['OBC-NCL'] / active.length) * 100) },
      { name: 'SC', policyPct: 15.0, count: counts.SC, actualPct: Math.round((counts.SC / active.length) * 100) },
      { name: 'ST', policyPct: 7.5, count: counts.ST, actualPct: Math.round((counts.ST / active.length) * 100) },
      { name: 'EWS', policyPct: 10.0, count: counts.EWS, actualPct: Math.round((counts.EWS / active.length) * 100) },
    ]
  }, [students, academicYear])

  function handleExportAdmissions() {
    const rows = branches.map((b) => ({
      'Branch': b.branch,
      'Programme': b.label,
      'Course': b.course,
      'Approved Regular Intake': b.approved,
      'Regular Enrolment': b.regular,
      'Supernumerary Enrolment': b.supernumerary,
      'Foreign/NRI Enrolment': b.foreign,
      'Total Enrolment': b.total,
      'Remaining Regular Seats': b.remaining,
      'Intake Variance': b.regularVariance,
      'Compliance Status': b.status,
    }))
    downloadCsv(rows, `admission_monitoring_${academicYear}.csv`)
  }

  return (
    <AppShell role="institution">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Admission & Intake Monitoring"
          description={`Live tracking of sanctioned seat capacity, supernumerary quotas, and category reservations for ${INSTITUTION.shortName}.`}
          badge={<DemoBadge label={`AY ${academicYear}`} />}
          actions={
            <Button variant="outline" size="sm" onClick={handleExportAdmissions}>
              <Download className="size-4" data-icon="inline-start" />
              Export Intake Audit CSV
            </Button>
          }
        />

        {/* Top Summary Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Approved Intake"
            value={totalApproved}
            icon={ClipboardCheck}
            tone="blue"
            hint="AICTE sanctioned regular seats"
          />
          <StatCard
            label="Regular Enrolment"
            value={totalRegular}
            icon={Users}
            tone="navy"
            hint={`${overallUtilization}% regular intake filled`}
            footer={
              <Progress value={Math.min(overallUtilization, 100)} className="h-1.5 mt-2" />
            }
          />
          <StatCard
            label="Supernumerary & Quota"
            value={totalSupernumerary + totalForeign}
            icon={TrendingUp}
            tone="green"
            hint={`${totalSupernumerary} TFWS/J&K + ${totalForeign} NRI/FN`}
          />
          <StatCard
            label="Intake Over-Enrolment Flags"
            value={exceedingBranches.length}
            icon={AlertTriangle}
            tone={exceedingBranches.length > 0 ? 'red' : 'green'}
            hint={
              exceedingBranches.length > 0
                ? `${exceedingBranches.map((b) => b.branch).join(', ')} exceeds limit`
                : 'All branches within intake limits'
            }
          />
        </div>

        {/* Over-enrollment alert if any */}
        {exceedingBranches.length > 0 && (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-xs text-destructive">
            <AlertTriangle className="size-5 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-sm">
                Compliance Notice: Approved Seat Cap Exceeded in {exceedingBranches.length} Programme(s)
              </span>
              <p className="opacity-90 leading-relaxed">
                Regular admissions in {exceedingBranches.map((b) => `${b.label} (+${b.regularVariance})`).join(', ')} exceed sanctioned AICTE approval. Supernumerary or lateral entry students must be verified to prevent compliance penalties.
              </p>
            </div>
          </div>
        )}

        {/* Programme-wise Intake Detailed Table */}
        <Panel
          title="Branch-Wise Seat Allocation & Vacancy Audit"
          description="Detailed breakdown of approved intake vs regular, supernumerary and foreign seats"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="px-3 py-3">Programme</th>
                  <th className="px-3 py-3 text-center">Approved Regular</th>
                  <th className="px-3 py-3 text-center">Regular Enrolled</th>
                  <th className="px-3 py-3 text-center">Supernumerary (TFWS/EWS)</th>
                  <th className="px-3 py-3 text-center">Foreign / NRI</th>
                  <th className="px-3 py-3 text-center">Total Enrolled</th>
                  <th className="px-3 py-3 text-center">Utilization</th>
                  <th className="px-3 py-3 text-right">Compliance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {branches.map((b) => {
                  const utilPct = Math.round((b.regular / b.approved) * 100)
                  return (
                    <tr key={b.branch} className="hover:bg-muted/30">
                      <td className="px-3 py-3">
                        <div className="font-bold text-foreground text-sm">{b.branch}</div>
                        <div className="text-[11px] text-muted-foreground">{b.label} · {b.course}</div>
                      </td>
                      <td className="px-3 py-3 text-center font-mono font-semibold">{b.approved}</td>
                      <td className="px-3 py-3 text-center font-mono font-bold text-foreground">{b.regular}</td>
                      <td className="px-3 py-3 text-center font-mono text-muted-foreground">
                        {b.supernumerary} / max {b.supernumeraryApproved}
                      </td>
                      <td className="px-3 py-3 text-center font-mono text-muted-foreground">
                        {b.foreign} / max {b.foreignApproved}
                      </td>
                      <td className="px-3 py-3 text-center font-mono font-bold text-gov-blue">{b.total}</td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={cn('font-mono font-semibold', utilPct > 100 ? 'text-destructive' : 'text-foreground')}>
                            {utilPct}%
                          </span>
                          <Progress
                            value={Math.min(utilPct, 100)}
                            className={cn('h-1 w-16', utilPct > 100 && '[&>div]:bg-destructive')}
                          />
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <Badge
                          variant={
                            b.status === 'Within Intake'
                              ? 'outline'
                              : b.status === 'Exceeds Intake'
                              ? 'destructive'
                              : 'default'
                          }
                          className="text-[11px]"
                        >
                          {b.status}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Category Reservation Policy Compliance */}
        <Panel
          title="Reservation Policy Compliance"
          description="Enrolment distribution across mandated reservation categories"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 text-xs">
            {categoryStats.map((c) => (
              <div key={c.name} className="flex flex-col gap-2 rounded-lg border bg-card p-3.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-sm">{c.name}</span>
                  <Badge variant="outline" className="text-[10px]">
                    Target: {c.policyPct}%
                  </Badge>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold font-mono text-foreground">{c.count}</span>
                  <span className="text-xs text-muted-foreground font-mono">{c.actualPct}% of cohort</span>
                </div>
                <Progress value={c.actualPct} className="h-1.5" />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  )
}
