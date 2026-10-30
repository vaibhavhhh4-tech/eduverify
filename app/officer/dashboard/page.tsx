'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileCheck,
  Fingerprint,
  History,
  QrCode,
  Scan,
  Search,
  ShieldCheck,
  UserCheck,
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
import { INSTITUTION } from '@/lib/mock-data'
import { store, useAppState } from '@/lib/storage'
import { formatDate, formatDateTime } from '@/lib/utils'
import { normaliseApaar } from '@/lib/validation'
import type { Student } from '@/types'

export default function OfficerDashboardPage() {
  const { students, verificationLogs } = useAppState()

  const [query, setQuery] = useState('')
  const [matchedStudents, setMatchedStudents] = useState<Student[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [qrScanning, setQrScanning] = useState(false)
  const [inspectedStudent, setInspectedStudent] = useState<Student | null>(null)

  // Handle Search
  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return

    const q = query.trim().toLowerCase()
    const found = students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        (s.apaarId && normaliseApaar(s.apaarId).includes(normaliseApaar(q))) ||
        s.email.toLowerCase().includes(q),
    )

    setMatchedStudents(found)
    setHasSearched(true)

    // Log query in audit trail
    store.addVerificationLog({
      reference: query.trim(),
      studentName: found[0]?.name || 'Direct Officer Search',
      result: found.length > 0 ? (found[0].verification === 'Verified' ? 'VERIFIED' : 'PENDING') : 'NOT VERIFIED',
      method: 'Student ID',
      by: 'Verification Officer (Scholarship Cell)',
    })
  }

  // Handle Simulated QR Scan
  async function handleSimulateQrScan() {
    setQrScanning(true)
    await new Promise((r) => setTimeout(r, 1200))

    // Match sample student Ananya Rao (Demo Student)
    const target = students.find((s) => s.email === 'student@edverify.demo') || students[0]
    setQrScanning(false)
    setQrModalOpen(false)

    if (target) {
      setMatchedStudents([target])
      setHasSearched(true)
      setQuery(target.apaarId || target.id)

      store.addVerificationLog({
        reference: `QR-${target.apaarId || target.id}`,
        studentName: target.name,
        result: 'VERIFIED',
        method: 'QR Code',
        by: 'Verification Officer (Scholarship Cell)',
      })

      toast.success(`Scanned & Cryptographically Verified QR Credential for ${target.name}`)
    }
  }

  // Action: Mark Student Verified
  function handleOfficerVerify(studentId: string) {
    store.updateStudent(studentId, { verification: 'Verified' }, 'Officially verified by Verification Officer (Demo Scholarship Cell)')
    toast.success('Student verified & cleared for scholarship disbursal')
    if (inspectedStudent) setInspectedStudent(null)
    // Update local state
    setMatchedStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, verification: 'Verified' } : s)),
    )
  }

  // Action: Flag discrepancy
  function handleOfficerFlag(studentId: string) {
    store.updateStudent(studentId, { verification: 'Flagged' }, 'Flagged by Verification Officer for discrepancy in academic records')
    toast.warning('Student record flagged for institutional review')
    if (inspectedStudent) setInspectedStudent(null)
    setMatchedStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, verification: 'Flagged' } : s)),
    )
  }

  return (
    <AppShell role="officer">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Verification Officer Portal – Academic Identity Validation"
          description="Direct verification tool for Scholarship Officers, Employers, and State Higher Education Boards."
          badge={<DemoBadge label="OFFICER PORTAL" />}
          actions={
            <Button size="sm" onClick={() => setQrModalOpen(true)}>
              <QrCode className="size-4" data-icon="inline-start" />
              Simulate QR Scan
            </Button>
          }
        />

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Officer Verification Inquiries"
            value={verificationLogs.length}
            icon={ShieldCheck}
            tone="blue"
            hint="Logged in current session"
          />
          <StatCard
            label="Verified Academic Dossiers"
            value={verificationLogs.filter((v) => v.result === 'VERIFIED').length}
            icon={CheckCircle2}
            tone="green"
            hint="Cryptographically authentic"
          />
          <StatCard
            label="Flagged Identity Anomalies"
            value={verificationLogs.filter((v) => v.result === 'NOT VERIFIED').length}
            icon={AlertTriangle}
            tone="red"
            hint="Discrepancies reported to institute"
          />
        </div>

        {/* Search Panel */}
        <Panel
          title="Student Record & APAAR Identity Verification"
          description="Search by Student Name, 12-digit APAAR ID, or Institutional Enrolment Number"
        >
          <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="e.g. Ananya Rao, 581203946712, or SI26CSE001..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 font-mono text-xs"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setHasSearched(false)
                    setMatchedStudents([])
                  }}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <Button type="submit">
              <Search className="size-4" data-icon="inline-start" />
              Search & Verify
            </Button>
          </form>

          {/* Quick Demo Pre-fill Chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Quick sample searches:</span>
            <button
              type="button"
              onClick={() => {
                setQuery('Ananya Rao')
                const found = students.filter((s) => s.name.toLowerCase().includes('ananya rao'))
                setMatchedStudents(found)
                setHasSearched(true)
              }}
              className="rounded border bg-muted px-2 py-0.5 font-mono text-[11px] hover:border-gov-blue hover:text-foreground"
            >
              Ananya Rao (Student Demo)
            </button>
            <button
              type="button"
              onClick={() => {
                setQuery('SI26CSE001')
                const found = students.filter((s) => s.id === 'SI26CSE001')
                setMatchedStudents(found)
                setHasSearched(true)
              }}
              className="rounded border bg-muted px-2 py-0.5 font-mono text-[11px] hover:border-gov-blue hover:text-foreground"
            >
              SI26CSE001 (B.Tech CSE)
            </button>
          </div>
        </Panel>

        {/* Search Results Display */}
        {hasSearched && (
          <Panel
            title="Search Verification Results"
            description={`Found ${matchedStudents.length} matching candidate record(s)`}
          >
            {matchedStudents.length === 0 ? (
              <p className="py-8 text-center text-xs text-muted-foreground">
                No matching student records found in the national registry. Please verify the enrollment number or APAAR ID.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {matchedStudents.map((st) => (
                  <div key={st.id} className="flex flex-col justify-between rounded-xl border bg-card p-4 text-xs shadow-xs">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-foreground text-sm">{st.name}</h4>
                          <span className="font-mono text-muted-foreground">{st.id} · {st.email}</span>
                        </div>
                        <Badge
                          variant={
                            st.verification === 'Verified'
                              ? 'default'
                              : st.verification === 'Flagged'
                              ? 'destructive'
                              : 'outline'
                          }
                          className="text-xs"
                        >
                          {st.verification}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 rounded-lg border bg-muted/40 p-3 text-[11px]">
                        <div>
                          <span className="text-muted-foreground">APAAR ID</span>
                          <p className="font-mono font-bold text-gov-blue">
                            {st.apaarId ? st.apaarId.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3') : 'Not Assigned'}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Institution</span>
                          <p className="font-medium text-foreground">{INSTITUTION.shortName}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Course & Branch</span>
                          <p className="font-medium text-foreground">{st.course} · {st.branch}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Date of Birth</span>
                          <p className="font-medium text-foreground">{formatDate(st.dob)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Category</span>
                          <p className="font-medium text-foreground">{st.category}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">DigiLocker Status</span>
                          <p className="font-medium text-india-green">{st.digilocker}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2 border-t pt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setInspectedStudent(st)}
                      >
                        <Eye className="size-3.5 mr-1" />
                        Full Dossier
                      </Button>
                      {st.verification !== 'Verified' && (
                        <Button
                          size="sm"
                          className="h-8 text-xs bg-india-green hover:bg-india-green/90"
                          onClick={() => handleOfficerVerify(st.id)}
                        >
                          <CheckCircle2 className="size-3.5 mr-1" />
                          Approve Record
                        </Button>
                      )}
                      {st.verification !== 'Flagged' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => handleOfficerFlag(st.id)}
                        >
                          Flag Discrepancy
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        )}

        {/* Verification History Log */}
        <Panel
          title="Recent Officer Verification Log"
          description="Traceable audit log of candidate verifications processed by this cell"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="px-3 py-2.5">Date & Time</th>
                  <th className="px-3 py-2.5">Candidate Name</th>
                  <th className="px-3 py-2.5">Identifier / Code</th>
                  <th className="px-3 py-2.5">Scan Method</th>
                  <th className="px-3 py-2.5 text-right">Verification Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {verificationLogs.slice(0, 6).map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30">
                    <td className="px-3 py-2.5 font-mono text-muted-foreground">{formatDateTime(log.at)}</td>
                    <td className="px-3 py-2.5 font-bold text-foreground">{log.studentName}</td>
                    <td className="px-3 py-2.5 font-mono text-muted-foreground">{log.reference}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{log.method}</td>
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

        {/* Simulated QR Scan Modal */}
        <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <QrCode className="size-5 text-gov-blue" />
                Simulated QR Scanner
              </DialogTitle>
              <DialogDescription>
                Emulate scanning a student's Digital Academic Identity Card QR code.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center gap-4 py-6">
              <div className="relative flex size-44 items-center justify-center rounded-2xl border-2 border-dashed border-gov-blue bg-gov-blue/5">
                <Scan className={qrScanning ? 'size-20 text-gov-blue animate-pulse' : 'size-16 text-muted-foreground'} />
                {qrScanning && (
                  <div className="absolute inset-x-2 top-1/2 h-0.5 bg-gov-blue animate-ping" />
                )}
              </div>
              <p className="text-center text-xs text-muted-foreground max-w-xs">
                {qrScanning
                  ? 'Decoding cryptographic seal and querying National Depository...'
                  : 'Click below to simulate immediate camera capture of a student PVC card QR.'}
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setQrModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSimulateQrScan} disabled={qrScanning}>
                {qrScanning ? 'Scanning...' : 'Trigger Mock QR Scan'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Full Dossier Modal */}
        <Dialog open={!!inspectedStudent} onOpenChange={(open) => !open && setInspectedStudent(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Academic Identity Dossier</DialogTitle>
              <DialogDescription>
                Verified identity record for scholarship and official clearance.
              </DialogDescription>
            </DialogHeader>

            {inspectedStudent && (
              <div className="flex flex-col gap-3 rounded-lg border bg-muted/40 p-4 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-muted-foreground">Full Name</span>
                    <p className="font-bold text-sm">{inspectedStudent.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Enrolment ID</span>
                    <p className="font-mono font-bold text-sm">{inspectedStudent.id}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">APAAR ID</span>
                    <p className="font-mono font-bold text-gov-blue">{inspectedStudent.apaarId || 'Not Assigned'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Institution</span>
                    <p className="font-medium">{INSTITUTION.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Programme</span>
                    <p className="font-medium">{inspectedStudent.course} ({inspectedStudent.branch})</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">DOB & Gender</span>
                    <p className="font-medium">{formatDate(inspectedStudent.dob)} ({inspectedStudent.gender})</p>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setInspectedStudent(null)}>
                Close
              </Button>
              {inspectedStudent && inspectedStudent.verification !== 'Verified' && (
                <Button onClick={() => handleOfficerVerify(inspectedStudent.id)}>
                  Approve Record
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
