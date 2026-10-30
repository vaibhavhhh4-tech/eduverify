'use client'

import { useMemo, useState } from 'react'
import {
  Building2,
  CheckCircle2,
  Download,
  Eye,
  Filter,
  MapPin,
  Search,
  ShieldAlert,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { DemoBadge } from '@/components/brand/logo'
import { PageHeader, Panel } from '@/components/dashboard/shared'
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
import { downloadCsv } from '@/lib/export'
import { INSTITUTIONS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import type { Institution } from '@/types'

export default function AicteInstitutionsPage() {
  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [selectedInst, setSelectedInst] = useState<Institution | null>(null)

  const states = useMemo(() => {
    return Array.from(new Set(INSTITUTIONS.map((i) => i.state))).sort()
  }, [])

  const filtered = useMemo(() => {
    return INSTITUTIONS.filter((inst) => {
      if (stateFilter !== 'ALL' && inst.state !== stateFilter) return false
      if (typeFilter !== 'ALL' && inst.type !== typeFilter) return false
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        inst.name.toLowerCase().includes(q) ||
        inst.code.toLowerCase().includes(q) ||
        inst.city.toLowerCase().includes(q) ||
        inst.aicteId.toLowerCase().includes(q)
      )
    })
  }, [search, stateFilter, typeFilter])

  function handleExportCsv() {
    const rows = filtered.map((i) => ({
      'Institution Name': i.name,
      'Code': i.code,
      'AICTE ID': i.aicteId,
      'City': i.city,
      'State': i.state,
      'Type': i.type,
      'Approved Intake': i.approvedIntake,
      'Enrolment': i.enrolment,
      'APAAR Verified': i.apaarVerified,
      'Duplicate Alerts': i.alerts,
      'Status': i.submissionStatus,
      'Last Submission': i.lastSubmission,
    }))
    downloadCsv(rows, 'aicte_approved_institutions.csv')
    toast.success(`Exported ${filtered.length} institutions to CSV`)
  }

  return (
    <AppShell role="aicte">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="National Institution Directory"
          description="Roster of AICTE-approved institutions with sanctioned capacity and real-time student verification data."
          badge={<DemoBadge label="INSTITUTION ROSTER" />}
          actions={
            <Button size="sm" onClick={handleExportCsv}>
              <Download className="size-4" data-icon="inline-start" />
              Export Directory CSV
            </Button>
          }
        />

        {/* Filter Bar */}
        <Panel className="border-muted bg-card">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search college, city, or AICTE ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <NativeSelect
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="[&_select]:h-9"
            >
              <NativeSelectOption value="ALL">All States / UTs</NativeSelectOption>
              {states.map((st) => (
                <NativeSelectOption key={st} value={st}>
                  {st}
                </NativeSelectOption>
              ))}
            </NativeSelect>

            <NativeSelect
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="[&_select]:h-9"
            >
              <NativeSelectOption value="ALL">All Institution Types</NativeSelectOption>
              <NativeSelectOption value="Government">Government</NativeSelectOption>
              <NativeSelectOption value="Private">Private</NativeSelectOption>
              <NativeSelectOption value="Autonomous">Autonomous</NativeSelectOption>
              <NativeSelectOption value="Deemed">Deemed University</NativeSelectOption>
            </NativeSelect>
          </div>
        </Panel>

        {/* Institutions Table */}
        <Panel className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="px-3 py-3">Institution Name</th>
                  <th className="px-3 py-3">AICTE ID</th>
                  <th className="px-3 py-3">Location</th>
                  <th className="px-3 py-3 text-center">Type</th>
                  <th className="px-3 py-3 text-center">Approved Intake</th>
                  <th className="px-3 py-3 text-center">Enrolment</th>
                  <th className="px-3 py-3 text-center">APAAR Verified</th>
                  <th className="px-3 py-3 text-center">Alerts</th>
                  <th className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((inst) => (
                  <tr key={inst.code} className="hover:bg-muted/30">
                    <td className="px-3 py-3 font-bold text-foreground">
                      <div>{inst.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{inst.code}</div>
                    </td>
                    <td className="px-3 py-3 font-mono text-muted-foreground">{inst.aicteId}</td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {inst.city}, {inst.state}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="rounded bg-muted px-2 py-0.5 font-medium">{inst.type}</span>
                    </td>
                    <td className="px-3 py-3 text-center font-mono font-semibold">{inst.approvedIntake}</td>
                    <td className="px-3 py-3 text-center font-mono font-bold text-foreground">{inst.enrolment}</td>
                    <td className="px-3 py-3 text-center font-mono text-india-green font-semibold">
                      {inst.apaarVerified} ({Math.round((inst.apaarVerified / inst.enrolment) * 100)}%)
                    </td>
                    <td className="px-3 py-3 text-center font-mono">
                      {inst.alerts > 0 ? (
                        <span className="text-destructive font-bold">{inst.alerts}</span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setSelectedInst(inst)}
                      >
                        <Eye className="size-3 mr-1" />
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Institution Details Modal */}
        <Dialog open={!!selectedInst} onOpenChange={(open) => !open && setSelectedInst(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedInst?.name}</DialogTitle>
              <DialogDescription>
                AICTE Approval Reference: {selectedInst?.aicteId} · Institutional Code: {selectedInst?.code}
              </DialogDescription>
            </DialogHeader>

            {selectedInst && (
              <div className="flex flex-col gap-3 rounded-lg border bg-muted/40 p-4 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-muted-foreground">State / Region</span>
                    <p className="font-semibold">{selectedInst.state} ({selectedInst.city})</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Institution Type</span>
                    <p className="font-semibold">{selectedInst.type}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sanctioned Intake</span>
                    <p className="font-mono font-bold text-sm">{selectedInst.approvedIntake} seats</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Admitted Students</span>
                    <p className="font-mono font-bold text-sm">{selectedInst.enrolment} students</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">APAAR Verification Rate</span>
                    <p className="font-mono font-bold text-india-green text-sm">
                      {selectedInst.apaarVerified} / {selectedInst.enrolment} ({Math.round((selectedInst.apaarVerified / selectedInst.enrolment) * 100)}%)
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Active Duplicate Alerts</span>
                    <p className="font-mono font-bold text-destructive text-sm">{selectedInst.alerts}</p>
                  </div>
                </div>

                <div className="border-t pt-2">
                  <span className="text-muted-foreground">Last Compliance Submission: </span>
                  <span className="font-mono font-medium">{selectedInst.lastSubmission}</span>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedInst(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
