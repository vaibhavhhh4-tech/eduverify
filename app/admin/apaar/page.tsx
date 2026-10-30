'use client'

import {
  CheckCircle2,
  Clock,
  Download,
  Fingerprint,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import { DemoBadge } from '@/components/brand/logo'
import { SimpleBarChart, SimpleLineChart } from '@/components/charts/gov-charts'
import { PageHeader, Panel, StatCard } from '@/components/dashboard/shared'
import { AppShell } from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { APAAR_TREND, STATE_STATS } from '@/lib/mock-data'

export default function AicteApaarPage() {
  const trendData = APAAR_TREND.map((t) => ({
    name: t.month,
    Verified: t.verified,
    Pending: t.pending,
  }))

  const topStates = [...STATE_STATS].sort((a, b) => b.verifiedPct - a.verifiedPct).slice(0, 8)

  return (
    <AppShell role="aicte">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="National APAAR Adoption & Identity Depository Analytics"
          description="Progress tracking for One Student, One Academic Identity implementation across India."
          badge={<DemoBadge label="NAD / APAAR PROGRESS" />}
        />

        {/* Top metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Total National APAAR IDs Issued"
            value="7,82,000"
            icon={Fingerprint}
            tone="green"
            hint="92.0% coverage across enrolled students"
          />
          <StatCard
            label="Pending APAAR Generation"
            value="68,000"
            icon={Clock}
            tone="saffron"
            hint="Awaiting Aadhaar-based OTP verification"
          />
          <StatCard
            label="Top Performing State"
            value="Maharashtra (95.4%)"
            icon={ShieldCheck}
            tone="blue"
            hint="Highest verified student proportion"
          />
        </div>

        {/* Monthly Adoption Trend Chart */}
        <Panel
          title="Monthly National Verification Velocity (AY 2026-27)"
          description="Cumulative verified identities vs pending records"
        >
          <div className="h-64 w-full">
            <SimpleLineChart
              data={trendData}
              xKey="name"
              lines={[
                { key: 'Verified', color: '#1e56a0', name: 'Verified Identities' },
                { key: 'Pending', color: '#c97816', name: 'Pending Generation' },
              ]}
              height={250}
            />
          </div>
        </Panel>

        {/* State Performance Leaderboard */}
        <Panel
          title="State-Wise APAAR Integration Leaderboard"
          description="Ranking of States by digital student identity verification percentage"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {topStates.map((st, i) => (
              <div key={st.code} className="flex flex-col gap-1.5 rounded-lg border bg-card p-3.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-sm flex items-center gap-1.5">
                    <span className="text-muted-foreground text-xs">#{i + 1}</span>
                    {st.name}
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {st.code}
                  </Badge>
                </div>
                <div className="flex items-baseline justify-between border-t pt-1.5 mt-1">
                  <span className="text-muted-foreground text-xs">Verification Rate</span>
                  <span className="font-mono font-bold text-india-green text-sm">{st.verifiedPct}%</span>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {st.institutions} institutes · {st.enrolment.toLocaleString('en-IN')} students
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  )
}
