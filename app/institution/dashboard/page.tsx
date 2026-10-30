'use client'

import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Fingerprint,
  FolderLock,
  Layers,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Upload,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react'
import { DemoBadge } from '@/components/brand/logo'
import { SimpleBarChart, SimplePieChart } from '@/components/charts/gov-charts'
import { PageHeader, Panel, StatCard } from '@/components/dashboard/shared'
import { AppShell } from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { HISTORICAL_ENROLMENT, INSTITUTION } from '@/lib/mock-data'
import { branchBreakdown, institutionStats } from '@/lib/stats'
import { useAppState } from '@/lib/storage'
import { cn, formatDateTime } from '@/lib/utils'

export default function InstitutionDashboardPage() {
  const { students, alerts, activities, academicYear } = useAppState()
  const stats = institutionStats(students, alerts, academicYear)
  const branches = branchBreakdown(students, academicYear)

  const utilizationPct = stats.approved > 0 ? Math.round((stats.enrolled / stats.approved) * 100) : 0
  const verifiedPct = stats.enrolled > 0 ? Math.round((stats.verified / stats.enrolled) * 100) : 0

  const branchChartData = branches.map((b) => ({
    name: b.branch,
    Approved: b.approved,
    Enrolled: b.total,
  }))

  const verificationPieData = [
    { name: 'Verified', value: stats.verified },
    { name: 'Pending', value: stats.pending - stats.flagged },
    { name: 'Requires Review', value: stats.flagged },
  ]

  const recentActivities = activities.slice(0, 6)

  return (
    <AppShell role="institution">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Institution Administrator Dashboard"
          description={`${INSTITUTION.name} (${INSTITUTION.code}) · AICTE Approval ID: ${INSTITUTION.aicteId} · Academic Year: ${academicYear}`}
          badge={<DemoBadge label="SIEM PUNE PORTAL" />}
          actions={
            <div className="flex items-center gap-2">
              <Link href="/institution/upload" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                <Upload className="size-4" data-icon="inline-start" />
                Bulk CSV Upload
              </Link>
              <Link href="/institution/students" className={buttonVariants({ size: 'sm' })}>
                <Users className="size-4" data-icon="inline-start" />
                Manage Students
              </Link>
            </div>
          }
        />

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Enrolled Students"
            value={stats.enrolled}
            icon={Users}
            tone="blue"
            hint={`Approved Intake: ${stats.approved} seats`}
            footer={
              <div className="mt-2 flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Intake Utilization</span>
                  <span className="font-semibold text-foreground">{utilizationPct}%</span>
                </div>
                <Progress value={Math.min(utilizationPct, 100)} className="h-1.5" />
              </div>
            }
          />
          <StatCard
            label="Verified APAAR IDs"
            value={stats.verified}
            icon={Fingerprint}
            tone="green"
            hint={`${verifiedPct}% verified against national standard`}
            footer={
              <div className="mt-2 flex items-center gap-1.5 text-xs text-india-green">
                <CheckCircle2 className="size-3.5" />
                <span>Compliant with One Student One ID</span>
              </div>
            }
          />
          <StatCard
            label="Pending APAAR Verification"
            value={stats.pending}
            icon={Clock}
            tone="saffron"
            hint={`${stats.flagged} records flagged for review`}
            footer={
              <Link href="/institution/apaar-verification" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-gov-blue hover:underline">
                Process verifications <ArrowRight className="size-3" />
              </Link>
            }
          />
          <StatCard
            label="Active Duplicate Alerts"
            value={stats.duplicateAlerts}
            icon={AlertTriangle}
            tone={stats.duplicateAlerts > 0 ? 'red' : 'navy'}
            hint={`${stats.openAlerts} total compliance flags`}
            footer={
              <Link href="/institution/duplicates" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-destructive hover:underline">
                Resolve conflicts <ArrowRight className="size-3" />
              </Link>
            }
          />
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Link
            href="/institution/students"
            className="flex flex-col items-center gap-2 rounded-xl border bg-card p-3.5 text-center shadow-xs transition hover:border-gov-blue/50 hover:bg-secondary/40"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-gov-blue/10 text-gov-blue">
              <Users className="size-5" />
            </span>
            <span className="text-xs font-semibold text-foreground">Student Directory</span>
          </Link>
          <Link
            href="/institution/upload"
            className="flex flex-col items-center gap-2 rounded-xl border bg-card p-3.5 text-center shadow-xs transition hover:border-gov-blue/50 hover:bg-secondary/40"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-india-green/10 text-india-green">
              <Upload className="size-5" />
            </span>
            <span className="text-xs font-semibold text-foreground">Bulk Upload CSV</span>
          </Link>
          <Link
            href="/institution/apaar-verification"
            className="flex flex-col items-center gap-2 rounded-xl border bg-card p-3.5 text-center shadow-xs transition hover:border-gov-blue/50 hover:bg-secondary/40"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Fingerprint className="size-5" />
            </span>
            <span className="text-xs font-semibold text-foreground">APAAR Lookup</span>
          </Link>
          <Link
            href="/institution/digilocker"
            className="flex flex-col items-center gap-2 rounded-xl border bg-card p-3.5 text-center shadow-xs transition hover:border-gov-blue/50 hover:bg-secondary/40"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-saffron/15 text-[oklch(0.5_0.13_55)]">
              <FolderLock className="size-5" />
            </span>
            <span className="text-xs font-semibold text-foreground">DigiLocker Demo</span>
          </Link>
          <Link
            href="/institution/admissions"
            className="flex flex-col items-center gap-2 rounded-xl border bg-card p-3.5 text-center shadow-xs transition hover:border-gov-blue/50 hover:bg-secondary/40"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-gov-blue/10 text-gov-blue">
              <TrendingUp className="size-5" />
            </span>
            <span className="text-xs font-semibold text-foreground">Admission Intake</span>
          </Link>
          <Link
            href="/institution/duplicates"
            className="flex flex-col items-center gap-2 rounded-xl border bg-card p-3.5 text-center shadow-xs transition hover:border-gov-blue/50 hover:bg-secondary/40"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <ShieldAlert className="size-5" />
            </span>
            <span className="text-xs font-semibold text-foreground">Duplicate Detection</span>
          </Link>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Panel
            title="Department-Wise Enrolment vs Approved Intake"
            description="Comparison of current admissions against approved quota for AY 2026-27"
            className="lg:col-span-2"
            actions={
              <Link href="/institution/admissions" className="text-xs font-medium text-gov-blue hover:underline">
                Detailed view
              </Link>
            }
          >
            <div className="h-64 w-full">
              <SimpleBarChart
                data={branchChartData}
                xKey="name"
                bars={[
                  { key: 'Approved', color: '#13306b', name: 'Approved Intake' },
                  { key: 'Enrolled', color: '#1e56a0', name: 'Current Enrolment' },
                ]}
                height={250}
              />
            </div>
          </Panel>

          <Panel
            title="APAAR Verification Status"
            description="Distribution of student identity verification records"
            actions={
              <Link href="/institution/apaar-verification" className="text-xs font-medium text-gov-blue hover:underline">
                Verify
              </Link>
            }
          >
            <div className="h-64 w-full">
              <SimplePieChart data={verificationPieData} nameKey="name" valueKey="value" height={220} />
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-md bg-india-green/10 p-1.5 text-india-green">
                <span className="block font-bold">{stats.verified}</span>
                <span className="text-[11px]">Verified</span>
              </div>
              <div className="rounded-md bg-saffron/15 p-1.5 text-[oklch(0.5_0.13_55)]">
                <span className="block font-bold">{stats.pending - stats.flagged}</span>
                <span className="text-[11px]">Pending</span>
              </div>
              <div className="rounded-md bg-destructive/10 p-1.5 text-destructive">
                <span className="block font-bold">{stats.flagged}</span>
                <span className="text-[11px]">Flagged</span>
              </div>
            </div>
          </Panel>
        </div>

        {/* Branch-wise breakdown summary table and Recent Activities */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Panel
            title="Intake Compliance Status by Programme"
            description="Branch-wise enrolment, vacancy and compliance"
            className="lg:col-span-2"
            actions={
              <Link href="/institution/admissions" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                View Full Table
              </Link>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-xs font-medium text-muted-foreground">
                    <th className="pb-2.5 font-semibold">Programme</th>
                    <th className="pb-2.5 text-center font-semibold">Approved</th>
                    <th className="pb-2.5 text-center font-semibold">Enrolled</th>
                    <th className="pb-2.5 text-center font-semibold">Remaining</th>
                    <th className="pb-2.5 text-center font-semibold">Utilization</th>
                    <th className="pb-2.5 text-right font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {branches.map((b) => {
                    const pct = Math.round((b.total / b.approved) * 100)
                    return (
                      <tr key={b.branch} className="hover:bg-muted/40">
                        <td className="py-2.5 font-medium text-foreground">
                          <div>{b.label}</div>
                          <div className="text-[11px] text-muted-foreground font-mono">{b.branch} · {b.course}</div>
                        </td>
                        <td className="py-2.5 text-center font-mono">{b.approved}</td>
                        <td className="py-2.5 text-center font-mono font-semibold">{b.total}</td>
                        <td className="py-2.5 text-center font-mono text-muted-foreground">{b.remaining}</td>
                        <td className="py-2.5 text-center">
                          <span className={cn('font-mono font-medium', pct > 100 ? 'text-destructive' : 'text-foreground')}>
                            {pct}%
                          </span>
                        </td>
                        <td className="py-2.5 text-right">
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

          {/* Recent Activity Stream */}
          <Panel
            title="Recent Activity & Audit Log"
            description="Recent institutional enrolment and verification events"
            actions={
              <Link href="/institution/reports" className="text-xs font-medium text-gov-blue hover:underline">
                View audit
              </Link>
            }
          >
            <div className="flex flex-col divide-y divide-border/60">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-2.5 py-3">
                  <span className="mt-0.5 flex size-2 shrink-0 rounded-full bg-gov-blue" />
                  <div className="flex flex-col gap-0.5 text-xs">
                    <span className="text-foreground leading-snug">{act.message}</span>
                    <span className="text-[11px] text-muted-foreground">{formatDateTime(act.at)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  )
}
