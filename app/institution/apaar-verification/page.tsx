'use client'

import { useState } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Fingerprint,
  Info,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { DemoBadge } from '@/components/brand/logo'
import { PageHeader, Panel } from '@/components/dashboard/shared'
import { AppShell } from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { lookupApaar, type MockApaarOutcome } from '@/lib/services/records'
import { store, useAppState } from '@/lib/storage'
import { cn, formatDate, formatDateTime } from '@/lib/utils'
import { isApaarFormatValid, normaliseApaar } from '@/lib/validation'

export default function ApaarVerificationPage() {
  const { students, verificationLogs } = useAppState()
  const [query, setQuery] = useState('')
  const [searched, setSearched] = useState(false)
  const [activeResult, setActiveResult] = useState<ReturnType<typeof lookupApaar> | null>(null)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return

    const res = lookupApaar(query, students)
    setActiveResult(res)
    setSearched(true)

    // Log the verification query
    store.addVerificationLog({
      reference: query.trim(),
      studentName: res.local[0]?.name || 'Unknown Student',
      result: res.outcome === 'Verified' ? 'VERIFIED' : res.outcome === 'Requires Review' ? 'NOT VERIFIED' : 'PENDING',
      method: 'Student ID',
      by: 'Institution Administrator',
    })
  }

  function handleVerifyStudent(studentId: string) {
    store.updateStudent(studentId, { verification: 'Verified' }, 'APAAR ID verified by Institution Administrator')
    toast.success('Student marked as APAAR Verified')
    if (activeResult) {
      setActiveResult(lookupApaar(query, students))
    }
  }

  function handleFlagStudent(studentId: string) {
    store.updateStudent(studentId, { verification: 'Flagged' }, 'Flagged APAAR discrepancy for officer review')
    toast.warning('Student flagged for verification review')
    if (activeResult) {
      setActiveResult(lookupApaar(query, students))
    }
  }

  return (
    <AppShell role="institution">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="APAAR ID Verification Portal"
          description="Validate 12-digit Automated Permanent Academic Account Registry (APAAR) identities and check for multi-institution duplication."
          badge={<DemoBadge label="SIMULATION ONLY" />}
        />

        {/* Clear Disclaimer Banner */}
        <div className="flex items-start gap-3 rounded-xl border border-gov-blue/30 bg-gov-blue/5 p-4 text-xs">
          <Info className="size-5 shrink-0 text-gov-blue mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-foreground">DEMO MODE · Illustrative Format Validation</span>
            <p className="text-muted-foreground leading-relaxed">
              This module performs local structural format checks (12 numeric digits) and scans our mock institutional and national duplicate registries. It is not connected to live government APAAR or Digilocker servers. Real-world deployments require API integration with the National Academic Depository (NAD).
            </p>
          </div>
        </div>

        {/* Search Bar Panel */}
        <Panel
          title="Lookup APAAR ID or Student Record"
          description="Enter a 12-digit APAAR ID (e.g. 581203946712), enrolment number, or student name"
        >
          <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Fingerprint className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Enter APAAR ID, e.g. 581203946712 or SI26CSE001"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 font-mono"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setSearched(false)
                    setActiveResult(null)
                  }}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <Button type="submit">
              <Search className="size-4" data-icon="inline-start" />
              Validate & Search
            </Button>
          </form>

          {/* Quick Demo Pre-fill Chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Try sample records:</span>
            <button
              type="button"
              onClick={() => {
                setQuery('581203946712')
                const res = lookupApaar('581203946712', students)
                setActiveResult(res)
                setSearched(true)
              }}
              className="rounded border bg-muted px-2 py-0.5 font-mono text-[11px] hover:border-gov-blue hover:text-foreground"
            >
              581203946712 (Valid)
            </button>
            <button
              type="button"
              onClick={() => {
                setQuery('458127390164')
                const res = lookupApaar('458127390164', students)
                setActiveResult(res)
                setSearched(true)
              }}
              className="rounded border bg-muted px-2 py-0.5 font-mono text-[11px] hover:border-gov-blue hover:text-foreground"
            >
              458127390164 (Duplicate)
            </button>
            <button
              type="button"
              onClick={() => {
                setQuery('1234')
                const res = lookupApaar('1234', students)
                setActiveResult(res)
                setSearched(true)
              }}
              className="rounded border bg-muted px-2 py-0.5 font-mono text-[11px] hover:border-gov-blue hover:text-foreground"
            >
              1234 (Invalid Format)
            </button>
          </div>
        </Panel>

        {/* Verification Result Card */}
        {searched && activeResult && (
          <Panel
            title="Verification Analysis"
            description={`Evaluation for query: "${query}"`}
            actions={
              <Badge
                variant={
                  activeResult.outcome === 'Verified'
                    ? 'default'
                    : activeResult.outcome === 'Requires Review'
                    ? 'destructive'
                    : 'outline'
                }
                className="text-xs"
              >
                {activeResult.outcome}
              </Badge>
            }
          >
            <div className="flex flex-col gap-4">
              {/* Status Banner */}
              <div
                className={cn(
                  'flex items-center gap-3 rounded-lg border p-4 text-xs',
                  activeResult.outcome === 'Verified'
                    ? 'border-india-green/30 bg-india-green/10 text-india-green'
                    : activeResult.outcome === 'Requires Review'
                    ? 'border-destructive/30 bg-destructive/10 text-destructive'
                    : 'border-saffron/30 bg-saffron/10 text-[oklch(0.5_0.13_55)]',
                )}
              >
                {activeResult.outcome === 'Verified' ? (
                  <CheckCircle2 className="size-5 shrink-0" />
                ) : activeResult.outcome === 'Requires Review' ? (
                  <AlertTriangle className="size-5 shrink-0" />
                ) : (
                  <Clock className="size-5 shrink-0" />
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-sm">
                    {activeResult.outcome === 'Verified'
                      ? 'APAAR Format Valid & Active Student Record Found'
                      : activeResult.outcome === 'Requires Review'
                      ? 'Attention: Potential Duplicate or Flagged Identity'
                      : activeResult.outcome === 'Invalid Format'
                      ? 'Format Check Failed: Must be 12 digits'
                      : 'Record Status: Pending or Not Found'}
                  </span>
                  <p className="text-[11px] opacity-90">
                    {activeResult.formatOk
                      ? 'Structural validation passed: 12-digit numerical identifier conforming to standard format.'
                      : 'Identifier does not conform to the 12-digit standard specified by the Ministry of Education.'}
                  </p>
                </div>
              </div>

              {/* Matched Local Student Record */}
              {activeResult.local.length > 0 && (
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-foreground">
                    Matched Institutional Enrolment ({activeResult.local.length} match):
                  </span>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {activeResult.local.map((st) => (
                      <div key={st.id} className="flex flex-col justify-between rounded-lg border bg-card p-4 text-xs shadow-xs">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-bold text-foreground text-sm">{st.name}</h4>
                              <span className="font-mono text-muted-foreground">{st.id}</span>
                            </div>
                            <Badge variant={st.verification === 'Verified' ? 'default' : 'outline'}>
                              {st.verification}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 border-t pt-2 text-[11px]">
                            <div>
                              <span className="text-muted-foreground">Programme:</span>
                              <p className="font-medium">{st.course} - {st.branch}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Date of Birth:</span>
                              <p className="font-medium">{formatDate(st.dob)}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">APAAR ID:</span>
                              <p className="font-mono font-semibold text-gov-blue">
                                {st.apaarId ? st.apaarId.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3') : 'Unassigned'}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Category:</span>
                              <p className="font-medium">{st.category}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-end gap-2 border-t pt-3">
                          {st.verification !== 'Verified' && (
                            <Button size="sm" onClick={() => handleVerifyStudent(st.id)}>
                              <CheckCircle2 className="size-3.5" data-icon="inline-start" />
                              Mark Verified
                            </Button>
                          )}
                          {st.verification !== 'Flagged' && (
                            <Button variant="outline" size="sm" onClick={() => handleFlagStudent(st.id)}>
                              <AlertTriangle className="size-3.5 text-saffron" data-icon="inline-start" />
                              Flag for Review
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Duplicate Detection Alerts */}
              {activeResult.duplicates.length > 1 && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3.5 text-xs text-destructive">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertCircle className="size-4" />
                    Internal Duplicate Warning
                  </div>
                  <p className="mt-1">
                    This APAAR ID is associated with {activeResult.duplicates.length} different student records in your institution. Investigate to prevent duplicate seat claims.
                  </p>
                </div>
              )}
            </div>
          </Panel>
        )}

        {/* Verification History Log */}
        <Panel
          title="Recent Verification Audit Log"
          description="Traceable history of all identity queries executed in this session"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="px-3 py-2.5">Timestamp</th>
                  <th className="px-3 py-2.5">Identifier / Reference</th>
                  <th className="px-3 py-2.5">Student Name</th>
                  <th className="px-3 py-2.5">Verification Method</th>
                  <th className="px-3 py-2.5">Verified By</th>
                  <th className="px-3 py-2.5 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {verificationLogs.slice(0, 8).map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30">
                    <td className="px-3 py-2.5 font-mono text-muted-foreground">
                      {formatDateTime(log.at)}
                    </td>
                    <td className="px-3 py-2.5 font-mono font-semibold text-foreground">
                      {log.reference}
                    </td>
                    <td className="px-3 py-2.5 font-medium text-foreground">
                      {log.studentName}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {log.method}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {log.by}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <Badge
                        variant={
                          log.result === 'VERIFIED'
                            ? 'default'
                            : log.result === 'NOT VERIFIED'
                            ? 'destructive'
                            : 'outline'
                        }
                        className="text-[10px]"
                      >
                        {log.result}
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
