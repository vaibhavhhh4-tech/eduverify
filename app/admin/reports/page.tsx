'use client'

import { useState } from 'react'
import {
  Download,
  FileSpreadsheet,
  Globe,
  MapPin,
  Printer,
} from 'lucide-react'
import { toast } from 'sonner'
import { DemoBadge } from '@/components/brand/logo'
import { PageHeader, Panel } from '@/components/dashboard/shared'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { downloadCsv, downloadPdf } from '@/lib/export'
import { INSTITUTIONS, STATE_STATS } from '@/lib/mock-data'

export default function AicteReportsPage() {
  function handleExportStatesCsv() {
    const rows = STATE_STATS.map((s) => ({
      'State Code': s.code,
      'State Name': s.name,
      'Approved Institutions': s.institutions,
      'Total Enrolment': s.enrolment,
      'APAAR Verified Pct': `${s.verifiedPct}%`,
    }))
    downloadCsv(rows, 'aicte_national_state_statistics.csv')
    toast.success('Exported National State Statistics CSV')
  }

  function handleExportInstitutionsCsv() {
    const rows = INSTITUTIONS.map((inst) => ({
      'Institution Name': inst.name,
      'AICTE ID': inst.aicteId,
      'Code': inst.code,
      'State': inst.state,
      'Type': inst.type,
      'Sanctioned Intake': inst.approvedIntake,
      'Current Enrolment': inst.enrolment,
      'APAAR Verified': inst.apaarVerified,
      'Compliance Status': inst.submissionStatus,
    }))
    downloadCsv(rows, 'aicte_institutions_compliance_audit.csv')
    toast.success('Exported Institutions Compliance Audit CSV')
  }

  return (
    <AppShell role="aicte">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="National Accreditation & Verification Reports"
          description="Regulatory documentation, state-wise data packages and AICTE compliance exports."
          badge={<DemoBadge label="APEX REGULATORY EXPORT" />}
          actions={
            <Button size="sm" onClick={handleExportStatesCsv}>
              <Download className="size-4" data-icon="inline-start" />
              Export State Statistics CSV
            </Button>
          }
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Panel
            title="State-Wise Enrolment & Compliance Matrix"
            description="Aggregated performance data across 28 states and UTs"
            actions={
              <Button variant="outline" size="sm" onClick={handleExportStatesCsv}>
                <Download className="size-3.5 mr-1" />
                CSV
              </Button>
            }
          >
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs">
                <thead className="border-b bg-muted/40 font-semibold text-muted-foreground sticky top-0">
                  <tr>
                    <th className="px-3 py-2.5">State</th>
                    <th className="px-3 py-2.5 text-center">Institutions</th>
                    <th className="px-3 py-2.5 text-center">Total Enrolment</th>
                    <th className="px-3 py-2.5 text-right">APAAR Verified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {STATE_STATS.map((st) => (
                    <tr key={st.code} className="hover:bg-muted/30">
                      <td className="px-3 py-2.5 font-bold">{st.name}</td>
                      <td className="px-3 py-2.5 text-center font-mono">{st.institutions}</td>
                      <td className="px-3 py-2.5 text-center font-mono font-semibold">
                        {st.enrolment.toLocaleString('en-IN')}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-india-green font-semibold">
                        {st.verifiedPct}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel
            title="Institutional Audit Roster"
            description="Sample accredited institution directory with intake and compliance records"
            actions={
              <Button variant="outline" size="sm" onClick={handleExportInstitutionsCsv}>
                <Download className="size-3.5 mr-1" />
                CSV
              </Button>
            }
          >
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs">
                <thead className="border-b bg-muted/40 font-semibold text-muted-foreground sticky top-0">
                  <tr>
                    <th className="px-3 py-2.5">College</th>
                    <th className="px-3 py-2.5 text-center">Intake</th>
                    <th className="px-3 py-2.5 text-center">Enrolled</th>
                    <th className="px-3 py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {INSTITUTIONS.map((inst) => (
                    <tr key={inst.code} className="hover:bg-muted/30">
                      <td className="px-3 py-2.5 font-medium">
                        <div>{inst.name}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{inst.city}, {inst.state}</div>
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono">{inst.approvedIntake}</td>
                      <td className="px-3 py-2.5 text-center font-mono font-bold">{inst.enrolment}</td>
                      <td className="px-3 py-2.5 text-right">
                        <span className="text-[11px] font-semibold text-india-green">{inst.submissionStatus}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  )
}
