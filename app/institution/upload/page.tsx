'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  FileUp,
  Info,
  RefreshCw,
  Sparkles,
  Upload,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { DemoBadge } from '@/components/brand/logo'
import { PageHeader, Panel } from '@/components/dashboard/shared'
import { AppShell } from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { CSV_COLUMNS, parseStudentCsv, SAMPLE_CSV, type CsvRowPreview } from '@/lib/csv'
import { downloadBlob } from '@/lib/export'
import { store, useAppState } from '@/lib/storage'
import { cn } from '@/lib/utils'
import type { Student } from '@/types'

export default function BulkUploadPage() {
  const { students } = useAppState()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [fileName, setFileName] = useState<string | null>(null)
  const [csvContent, setCsvContent] = useState<string>('')
  const [parsedRows, setParsedRows] = useState<CsvRowPreview[]>([])
  const [headerValid, setHeaderValid] = useState<boolean>(true)
  const [importing, setImporting] = useState<boolean>(false)
  const [importSuccess, setImportSuccess] = useState<{ count: number } | null>(null)

  // Download official CSV template
  function handleDownloadTemplate() {
    downloadBlob(SAMPLE_CSV, 'eduverify_student_enrolment_template.csv', 'text/csv;charset=utf-8')
    toast.success('Template downloaded! Fill in student data and upload.')
  }

  // Load sample demo data
  function handleLoadSampleData() {
    setFileName('sample_enrolment_batch_2026.csv')
    setCsvContent(SAMPLE_CSV)
    const { rows, headerOk } = parseStudentCsv(SAMPLE_CSV, students)
    setParsedRows(rows)
    setHeaderValid(headerOk)
    setImportSuccess(null)
    toast.info('Loaded sample CSV data for demonstration')
  }

  // Handle file select
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setImportSuccess(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setCsvContent(text)
      const { rows, headerOk } = parseStudentCsv(text, students)
      setParsedRows(rows)
      setHeaderValid(headerOk)
      if (!headerOk) {
        toast.error('CSV headers do not match expected schema')
      } else {
        toast.success(`Parsed ${rows.length} rows from ${file.name}`)
      }
    }
    reader.readAsText(file)
  }

  // Import confirmed valid records
  async function handleConfirmImport() {
    const validRows = parsedRows.filter((r) => r.valid && r.student)
    if (validRows.length === 0) {
      toast.error('No valid rows found to import')
      return
    }

    setImporting(true)
    await new Promise((r) => setTimeout(r, 800))

    const newStudents: Student[] = validRows.map((r) => r.student!)

    store.addStudents(newStudents, {
      type: 'upload',
      message: `Bulk uploaded ${newStudents.length} student records from ${fileName || 'CSV'}`,
    })

    setImporting(false)
    setImportSuccess({ count: newStudents.length })
    toast.success(`Successfully imported ${newStudents.length} student records!`)
  }

  const validCount = parsedRows.filter((r) => r.valid).length
  const issueCount = parsedRows.filter((r) => !r.valid).length

  return (
    <AppShell role="institution">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Bulk Student Onboarding"
          description="Upload student enrolment rosters via CSV with automated APAAR format checking and duplicate detection."
          badge={<DemoBadge label="CSV IMPORT ENGINE" />}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                <Download className="size-4" data-icon="inline-start" />
                Download CSV Template
              </Button>
              <Button variant="secondary" size="sm" onClick={handleLoadSampleData}>
                <Sparkles className="size-4 text-saffron" data-icon="inline-start" />
                Load Sample Data
              </Button>
            </div>
          }
        />

        {/* Upload Dropzone */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Panel
            title="Upload CSV File"
            description="Accepts UTF-8 encoded .csv files with required headers"
            className="lg:col-span-1"
          >
            <div className="flex flex-col gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gov-blue/30 bg-gov-blue/5 p-6 text-center transition hover:border-gov-blue hover:bg-gov-blue/10"
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-gov-blue/10 text-gov-blue">
                  <FileUp className="size-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-foreground">
                    {fileName ? fileName : 'Click to select CSV file'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Or drag and drop your file here (.csv up to 10MB)
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground block mb-1">Required Headers:</span>
                <p className="font-mono text-[11px] break-all leading-tight">
                  {CSV_COLUMNS.join(', ')}
                </p>
              </div>
            </div>
          </Panel>

          {/* Guidelines & Validation Rules */}
          <Panel
            title="Validation & Duplicate Rules"
            description="Automated pre-flight checks before saving records to mock database"
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
              <div className="flex gap-2.5 rounded-lg border bg-card p-3">
                <CheckCircle2 className="size-4 shrink-0 text-india-green mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground block">APAAR Format Check</span>
                  <span className="text-muted-foreground">
                    Validates 12 numeric digits. Hyphens and spaces are stripped automatically.
                  </span>
                </div>
              </div>
              <div className="flex gap-2.5 rounded-lg border bg-card p-3">
                <AlertTriangle className="size-4 shrink-0 text-saffron mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground block">Internal Duplicate Check</span>
                  <span className="text-muted-foreground">
                    Detects collision against active cohort and against other rows in the same CSV file.
                  </span>
                </div>
              </div>
              <div className="flex gap-2.5 rounded-lg border bg-card p-3">
                <CheckCircle2 className="size-4 shrink-0 text-india-green mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground block">Email & Mobile Syntax</span>
                  <span className="text-muted-foreground">
                    Ensures valid email RFC formatting and standard 10-digit Indian mobile numbers.
                  </span>
                </div>
              </div>
              <div className="flex gap-2.5 rounded-lg border bg-card p-3">
                <Info className="size-4 shrink-0 text-gov-blue mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground block">Approved Intake Safety</span>
                  <span className="text-muted-foreground">
                    Validates branch codes (CSE, ECE, ME, EE, CE, IT, MBA) and seat categories.
                  </span>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        {/* Data Preview Section */}
        {parsedRows.length > 0 && (
          <Panel
            title="File Inspection & Data Preview"
            description={`Showing parsed rows for ${fileName || 'uploaded file'}`}
            actions={
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Total: {parsedRows.length}
                </Badge>
                <Badge variant="default" className="bg-india-green text-xs">
                  Valid: {validCount}
                </Badge>
                {issueCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    Issues: {issueCount}
                  </Badge>
                )}
                <Button
                  size="sm"
                  disabled={validCount === 0 || importing}
                  onClick={handleConfirmImport}
                >
                  {importing ? (
                    'Importing...'
                  ) : (
                    <>
                      <Upload className="size-3.5" data-icon="inline-start" />
                      Import {validCount} Valid Records
                    </>
                  )}
                </Button>
              </div>
            }
          >
            {/* Success notification banner */}
            {importSuccess && (
              <div className="mb-4 flex items-center justify-between rounded-lg border border-india-green/40 bg-india-green/10 p-3.5 text-xs text-india-green">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4" />
                  <span className="font-semibold">
                    Successfully imported {importSuccess.count} students into SIEM Pune active cohort!
                  </span>
                </div>
                <Link
                  href="/institution/students"
                  className={buttonVariants({ size: 'sm', className: 'h-7 text-xs bg-india-green hover:bg-india-green/90' })}
                >
                  View Students <ArrowRight className="size-3" />
                </Link>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b bg-muted/40 font-semibold text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2.5 text-center">Row</th>
                    <th className="px-3 py-2.5">Enrolment No.</th>
                    <th className="px-3 py-2.5">Student Name</th>
                    <th className="px-3 py-2.5">APAAR ID</th>
                    <th className="px-3 py-2.5">Course & Branch</th>
                    <th className="px-3 py-2.5">Category</th>
                    <th className="px-3 py-2.5">Validation Status</th>
                    <th className="px-3 py-2.5">Issues & Warnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {parsedRows.map((row) => (
                    <tr
                      key={row.rowNumber}
                      className={cn('hover:bg-muted/30', !row.valid && 'bg-destructive/5')}
                    >
                      <td className="px-3 py-2.5 text-center font-mono text-muted-foreground">
                        {row.rowNumber}
                      </td>
                      <td className="px-3 py-2.5 font-mono font-semibold text-foreground">
                        {row.values.enrollmentNumber || '—'}
                      </td>
                      <td className="px-3 py-2.5 font-medium text-foreground">
                        <div>{row.values.name || '—'}</div>
                        <div className="text-[10px] text-muted-foreground">{row.values.email}</div>
                      </td>
                      <td className="px-3 py-2.5 font-mono">
                        {row.values.apaarId || '—'}
                      </td>
                      <td className="px-3 py-2.5">
                        {row.values.course} · {row.values.branch}
                      </td>
                      <td className="px-3 py-2.5">
                        {row.values.category}
                      </td>
                      <td className="px-3 py-2.5">
                        {row.valid ? (
                          <Badge variant="default" className="bg-india-green text-[10px]">
                            Ready to Import
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-[10px]">
                            Validation Error
                          </Badge>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        {row.issues.length === 0 ? (
                          <span className="text-[11px] text-india-green">No issues detected</span>
                        ) : (
                          <div className="flex flex-col gap-1">
                            {row.issues.map((iss, i) => (
                              <span key={i} className="text-[11px] text-destructive flex items-center gap-1">
                                <AlertCircle className="size-3 shrink-0" />
                                {iss.message}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        )}
      </div>
    </AppShell>
  )
}
