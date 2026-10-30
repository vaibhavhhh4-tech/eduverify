'use client'

import { useMemo, useState } from 'react'
import {
  BarChart3,
  CheckCircle2,
  Download,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Filter,
  Layers,
  Printer,
  Table,
} from 'lucide-react'
import { toast } from 'sonner'
import { DemoBadge } from '@/components/brand/logo'
import { PageHeader, Panel } from '@/components/dashboard/shared'
import { AppShell } from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { downloadCsv, downloadPdf } from '@/lib/export'
import { BRANCHES, INSTITUTION } from '@/lib/mock-data'
import { branchBreakdown, institutionStats } from '@/lib/stats'
import { useAppState } from '@/lib/storage'
import { formatDate } from '@/lib/utils'

type ReportType = 'ENROLMENT' | 'APAAR' | 'DUPLICATES' | 'INTAKE'

export default function ReportsPage() {
  const { students, alerts, academicYear } = useAppState()
  const stats = institutionStats(students, alerts, academicYear)
  const branches = branchBreakdown(students, academicYear)

  const [reportType, setReportType] = useState<ReportType>('ENROLMENT')
  const [courseFilter, setCourseFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Generate dataset based on active report type
  const reportData = useMemo(() => {
    if (reportType === 'ENROLMENT') {
      return students
        .filter((s) => !s.archived && s.academicYear === academicYear)
        .filter((s) => (courseFilter === 'ALL' ? true : s.course === courseFilter))
        .filter((s) => (statusFilter === 'ALL' ? true : s.verification === statusFilter))
        .map((s) => ({
          'Enrolment No': s.id,
          'Student Name': s.name,
          'APAAR ID': s.apaarId || 'N/A',
          'Course': s.course,
          'Branch': s.branch,
          'Category': s.category,
          'DOB': formatDate(s.dob),
          'Verification': s.verification,
          'DigiLocker': s.digilocker,
        }))
    }

    if (reportType === 'APAAR') {
      return students
        .filter((s) => !s.archived && s.academicYear === academicYear)
        .filter((s) => (statusFilter === 'ALL' ? true : s.verification === statusFilter))
        .map((s) => ({
          'Student Name': s.name,
          'Enrolment No': s.id,
          'APAAR ID': s.apaarId || 'MISSING',
          'Format Checked': s.apaarId ? 'Compliant' : 'Non-Compliant',
          'Verification Status': s.verification,
          'DigiLocker Linked': s.digilocker === 'Linked' ? 'Yes' : 'No',
        }))
    }

    if (reportType === 'DUPLICATES') {
      return alerts.map((a) => ({
        'Alert ID': a.id,
        'Subject': a.subject,
        'Anomaly Type': a.type,
        'Risk Level': a.severity,
        'Status': a.status,
        'Date Logged': a.date,
        'Institution': a.institution,
      }))
    }

    // INTAKE
    return branches.map((b) => ({
      'Branch': b.branch,
      'Programme': b.label,
      'Approved Intake': b.approved,
      'Regular Enrolled': b.regular,
      'Supernumerary Enrolled': b.supernumerary,
      'Total Enrolled': b.total,
      'Remaining Seats': b.remaining,
      'Compliance Status': b.status,
    }))
  }, [reportType, students, alerts, academicYear, courseFilter, statusFilter, branches])

  // Columns for display & export
  const columns = useMemo(() => {
    if (reportData.length === 0) return []
    return Object.keys(reportData[0])
  }, [reportData])

  // Handle Export CSV
  function handleExportCsv() {
    if (reportData.length === 0) return toast.error('No rows to export')
    downloadCsv(reportData, `eduverify_${reportType.toLowerCase()}_report_${academicYear}.csv`)
    toast.success(`Exported ${reportData.length} rows to CSV`)
  }

  // Handle Export PDF
  async function handleExportPdf() {
    if (reportData.length === 0) return toast.error('No rows to export')
    toast.info('Generating PDF report...')
    try {
      await downloadPdf({
        title: `${INSTITUTION.name} – ${reportType} Report`,
        subtitle: `Academic Year: ${academicYear} · Exported on: ${new Date().toLocaleDateString('en-IN')}`,
        rows: reportData,
        columns,
        filename: `eduverify_${reportType.toLowerCase()}_report.pdf`,
        summary: [
          ['Total Records', String(reportData.length)],
          ['Institution Code', INSTITUTION.code],
          ['AICTE Approval ID', INSTITUTION.aicteId],
        ],
      })
      toast.success('PDF downloaded successfully!')
    } catch (e) {
      console.error(e)
      toast.error('Failed to generate PDF document')
    }
  }

  return (
    <AppShell role="institution">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Audit Reports & Data Export"
          description={`Download compliant institutional data packages and accreditation reports for ${INSTITUTION.shortName}.`}
          badge={<DemoBadge label="CSV & PDF EXPORT" />}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExportPdf}>
                <Printer className="size-4" data-icon="inline-start" />
                Download PDF
              </Button>
              <Button size="sm" onClick={handleExportCsv}>
                <Download className="size-4" data-icon="inline-start" />
                Export CSV Data
              </Button>
            </div>
          }
        />

        {/* Report Selector Pills */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button
            type="button"
            onClick={() => setReportType('ENROLMENT')}
            className={`flex flex-col gap-1 rounded-xl border p-4 text-left transition ${
              reportType === 'ENROLMENT'
                ? 'border-gov-blue bg-gov-blue/10 text-primary font-semibold'
                : 'bg-card hover:bg-muted/50'
            }`}
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-gov-blue/10 text-gov-blue">
              <FileSpreadsheet className="size-4" />
            </span>
            <span className="text-xs font-bold mt-1">Student Enrolment Master</span>
            <span className="text-[11px] text-muted-foreground">Complete student roster with APAAR status</span>
          </button>

          <button
            type="button"
            onClick={() => setReportType('APAAR')}
            className={`flex flex-col gap-1 rounded-xl border p-4 text-left transition ${
              reportType === 'APAAR'
                ? 'border-gov-blue bg-gov-blue/10 text-primary font-semibold'
                : 'bg-card hover:bg-muted/50'
            }`}
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-india-green/10 text-india-green">
              <FileCheck className="size-4" />
            </span>
            <span className="text-xs font-bold mt-1">APAAR Compliance Audit</span>
            <span className="text-[11px] text-muted-foreground">Verification breakdown & missing IDs</span>
          </button>

          <button
            type="button"
            onClick={() => setReportType('INTAKE')}
            className={`flex flex-col gap-1 rounded-xl border p-4 text-left transition ${
              reportType === 'INTAKE'
                ? 'border-gov-blue bg-gov-blue/10 text-primary font-semibold'
                : 'bg-card hover:bg-muted/50'
            }`}
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BarChart3 className="size-4" />
            </span>
            <span className="text-xs font-bold mt-1">Intake & Seat Capacity</span>
            <span className="text-[11px] text-muted-foreground">Sanctioned limits vs actual admissions</span>
          </button>

          <button
            type="button"
            onClick={() => setReportType('DUPLICATES')}
            className={`flex flex-col gap-1 rounded-xl border p-4 text-left transition ${
              reportType === 'DUPLICATES'
                ? 'border-gov-blue bg-gov-blue/10 text-primary font-semibold'
                : 'bg-card hover:bg-muted/50'
            }`}
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <Layers className="size-4" />
            </span>
            <span className="text-xs font-bold mt-1">Duplicate Risk Log</span>
            <span className="text-[11px] text-muted-foreground">Collision anomalies and resolutions</span>
          </button>
        </div>

        {/* Filter Controls for Reports */}
        {reportType === 'ENROLMENT' && (
          <Panel className="border-muted bg-card">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground">Programme:</span>
                <NativeSelect
                  size="sm"
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                >
                  <NativeSelectOption value="ALL">All Programmes</NativeSelectOption>
                  <NativeSelectOption value="B.Tech">B.Tech</NativeSelectOption>
                  <NativeSelectOption value="MBA">MBA</NativeSelectOption>
                </NativeSelect>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground">Verification Status:</span>
                <NativeSelect
                  size="sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <NativeSelectOption value="ALL">All Statuses</NativeSelectOption>
                  <NativeSelectOption value="Verified">Verified Only</NativeSelectOption>
                  <NativeSelectOption value="Pending">Pending Only</NativeSelectOption>
                  <NativeSelectOption value="Flagged">Flagged Only</NativeSelectOption>
                </NativeSelect>
              </div>

              <span className="text-muted-foreground ml-auto">
                Total matching rows: <strong className="text-foreground">{reportData.length}</strong>
              </span>
            </div>
          </Panel>
        )}

        {/* Report Preview Table */}
        <Panel
          title="Report Preview (Live Dataset)"
          description={`Displaying top 20 rows of ${reportData.length} generated records`}
          actions={
            <Badge variant="outline" className="text-xs">
              {reportData.length} Records Generated
            </Badge>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  {columns.map((col) => (
                    <th key={col} className="px-3 py-2.5">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {reportData.slice(0, 20).map((row, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    {columns.map((col) => (
                      <td key={col} className="px-3 py-2.5 font-medium text-foreground">
                        {String((row as any)[col] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {reportData.length > 20 && (
            <div className="border-t p-3 text-center text-xs text-muted-foreground">
              Showing first 20 records. Use "Export CSV Data" or "Download PDF" to retrieve the full {reportData.length} rows.
            </div>
          )}
        </Panel>
      </div>
    </AppShell>
  )
}
