'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock,
  Eye,
  FileSpreadsheet,
  Fingerprint,
  Globe,
  Layers,
  MapPin,
  Search,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react'
import { DemoBadge } from '@/components/brand/logo'
import { SimpleBarChart, SimpleLineChart, SimplePieChart } from '@/components/charts/gov-charts'
import { PageHeader, Panel, StatCard } from '@/components/dashboard/shared'
import { AppShell } from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  APAAR_TREND,
  COMPLIANCE,
  COURSE_NATIONAL,
  INSTITUTIONS,
  NATIONAL_TOTALS,
  NATIONAL_TREND,
  STATE_STATS,
} from '@/lib/mock-data'
import { useAppState } from '@/lib/storage'
import { cn } from '@/lib/utils'
import type { Institution } from '@/types'

export default function AicteAdminDashboardPage() {
  const { alerts } = useAppState()
  const [selectedInst, setSelectedInst] = useState<Institution | null>(null)
  const [searchInst, setSearchInst] = useState('')

  const courseData = COURSE_NATIONAL.map((c) => ({
    name: c.course,
    Students: c.students,
  }))

  const trendData = NATIONAL_TREND.map((t) => ({
    name: t.year,
    Approved: t.approved,
    Admissions: t.admissions,
  }))

  const filteredInstitutions = useMemo(() => {
    if (!searchInst.trim()) return INSTITUTIONS.slice(0, 8)
    const q = searchInst.toLowerCase()
    return INSTITUTIONS.filter(
      (inst) =>
        inst.name.toLowerCase().includes(q) ||
        inst.code.toLowerCase().includes(q) ||
        inst.state.toLowerCase().includes(q) ||
        inst.city.toLowerCase().includes(q),
    ).slice(0, 8)
  }, [searchInst])

  return (
    <AppShell role="aicte">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="AICTE National Portal – APAAR Verification & Intake Oversight"
          description="Apex monitoring system across 1,250 AICTE-approved technical and management institutions in India."
          badge={<DemoBadge label="APEX REGULATORY OVERVIEW" />}
          actions={
            <div className="flex items-center gap-2">
              <Link href="/admin/reports" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                <FileSpreadsheet className="size-4" data-icon="inline-start" />
                National Reports
              </Link>
              <Link href="/admin/institutions" className={buttonVariants({ size: 'sm' })}>
                <Building2 className="size-4" data-icon="inline-start" />
                Institution Directory
              </Link>
            </div>
          }
        />

        {/* Disclaimer Notice */}
        <div className="flex items-center justify-between rounded-xl border border-saffron/40 bg-saffron/10 p-3.5 text-xs text-[oklch(0.5_0.13_55)]">
          <div className="flex items-center gap-2">
            <Globe className="size-4 shrink-0" />
            <span>
              All national data shown is simulated for demonstration purposes under the Smart India Hackathon prototype.
            </span>
          </div>
          <Badge variant="outline" className="border-saffron/40 text-[10px]">
            SYNTHETIC REGISTRY
          </Badge>
        </div>

        {/* Top National Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Approved Institutions"
            value="1,250"
            icon={Building2}
            tone="blue"
            hint="Technical & Management Institutes"
          />
          <StatCard
            label="Total National Enrolment"
            value="8,50,000"
            icon={Users}
            tone="navy"
            hint="Sanctioned Intake: 9,02,000 seats"
          />
          <StatCard
            label="APAAR Verified Records"
            value="7,82,000"
            icon={ShieldCheck}
            tone="green"
            hint="92.0% national verification rate"
          />
          <StatCard
            label="Cross-Institution Duplicate Alerts"
            value={alerts.length + 18}
            icon={ShieldAlert}
            tone="red"
            hint="Flagged for multi-seat claims"
          />
        </div>

        {/* National Trends & Course Distribution Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Panel
            title="National Enrolment vs Approved Intake (5-Year Trend)"
            description="Macro trends across AICTE institutions from 2022 to 2027"
            className="lg:col-span-2"
          >
            <div className="h-64 w-full">
              <SimpleLineChart
                data={trendData}
                xKey="name"
                lines={[
                  { key: 'Approved', color: '#13306b', name: 'Sanctioned Intake' },
                  { key: 'Admissions', color: '#1e56a0', name: 'Actual Admissions' },
                ]}
                height={250}
              />
            </div>
          </Panel>

          <Panel
            title="Course-Wise National Admissions"
            description="Student distribution by major discipline"
          >
            <div className="h-64 w-full">
              <SimpleBarChart
                data={courseData}
                xKey="name"
                bars={[{ key: 'Students', color: '#2f7a4a', name: 'Students' }]}
                height={250}
              />
            </div>
          </Panel>
        </div>

        {/* State-Wise Statistics Table */}
        <Panel
          title="State-Wise Enrolment & APAAR Compliance Summary"
          description="Verification metrics and institutional density across Indian States and UTs"
          actions={
            <Link href="/admin/reports" className="text-xs font-medium text-gov-blue hover:underline">
              View all 28 states
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="px-3 py-2.5">State / UT</th>
                  <th className="px-3 py-2.5 text-center">Approved Institutions</th>
                  <th className="px-3 py-2.5 text-center">Total Enrolment</th>
                  <th className="px-3 py-2.5 text-center">APAAR Verified %</th>
                  <th className="px-3 py-2.5 text-right">Intake Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {STATE_STATS.slice(0, 7).map((st) => (
                  <tr key={st.code} className="hover:bg-muted/30">
                    <td className="px-3 py-2.5 font-bold text-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-muted-foreground" />
                        <span>{st.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">({st.code})</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-center font-mono font-medium">{st.institutions}</td>
                    <td className="px-3 py-2.5 text-center font-mono font-bold text-foreground">
                      {st.enrolment.toLocaleString('en-IN')}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <div className="inline-flex items-center gap-1 font-mono font-semibold text-india-green">
                        <CheckCircle2 className="size-3" />
                        {st.verifiedPct}%
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <Badge variant="outline" className="text-[10px]">
                        Within Cap
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Institution Directory Preview */}
        <Panel
          title="Sample AICTE Institutional Directory"
          description="Real-time lookup of approved technical colleges and universities"
          actions={
            <Link href="/admin/institutions" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
              View Full Directory
            </Link>
          }
        >
          <div className="mb-4 max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search college by name, city or AICTE ID..."
                value={searchInst}
                onChange={(e) => setSearchInst(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="px-3 py-2.5">Institution Name</th>
                  <th className="px-3 py-2.5">AICTE Approval ID</th>
                  <th className="px-3 py-2.5">State & City</th>
                  <th className="px-3 py-2.5 text-center">Approved Intake</th>
                  <th className="px-3 py-2.5 text-center">Enrolment</th>
                  <th className="px-3 py-2.5 text-center">APAAR Verified</th>
                  <th className="px-3 py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredInstitutions.map((inst) => (
                  <tr key={inst.code} className="hover:bg-muted/30">
                    <td className="px-3 py-2.5 font-bold text-foreground">
                      <div>{inst.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{inst.type} · {inst.code}</div>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-muted-foreground">{inst.aicteId}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{inst.city}, {inst.state}</td>
                    <td className="px-3 py-2.5 text-center font-mono">{inst.approvedIntake}</td>
                    <td className="px-3 py-2.5 text-center font-mono font-bold text-foreground">{inst.enrolment}</td>
                    <td className="px-3 py-2.5 text-center font-mono text-india-green font-semibold">
                      {inst.apaarVerified} ({Math.round((inst.apaarVerified / inst.enrolment) * 100)}%)
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <Badge
                        variant={
                          inst.submissionStatus === 'Submitted'
                            ? 'default'
                            : inst.submissionStatus === 'Overdue'
                            ? 'destructive'
                            : 'outline'
                        }
                        className={cn('text-[10px]', inst.submissionStatus === 'Submitted' && 'bg-india-green')}
                      >
                        {inst.submissionStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </AppShell>
  )
}
