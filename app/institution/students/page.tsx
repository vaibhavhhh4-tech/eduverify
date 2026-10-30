'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  Archive,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  Eye,
  FileSpreadsheet,
  Filter,
  Fingerprint,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { DemoBadge } from '@/components/brand/logo'
import { PageHeader, Panel } from '@/components/dashboard/shared'
import { AppShell } from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { downloadCsv } from '@/lib/export'
import { BRANCHES, INSTITUTION } from '@/lib/mock-data'
import { store, useAppState } from '@/lib/storage'
import { cn, formatDate, formatDateTime } from '@/lib/utils'
import { isApaarFormatValid, normaliseApaar } from '@/lib/validation'
import type { BranchCode, Category, CourseCode, Gender, SeatType, Student, VerificationStatus } from '@/types'

const PAGE_SIZE = 12

export default function StudentManagementPage() {
  const { students, academicYear } = useAppState()

  // Search & Filters
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('ALL')
  const [branchFilter, setBranchFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [page, setPage] = useState(1)

  // Dialog states
  const [viewStudent, setViewStudent] = useState<Student | null>(null)
  const [editStudent, setEditStudent] = useState<Student | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [archiveCandidate, setArchiveCandidate] = useState<Student | null>(null)

  // Form states for Add Student
  const [newStudent, setNewStudent] = useState({
    id: '',
    name: '',
    dob: '2008-01-15',
    gender: 'Male' as Gender,
    email: '',
    mobile: '',
    apaarId: '',
    course: 'B.Tech' as CourseCode,
    branch: 'CSE' as BranchCode,
    category: 'General' as Category,
    seatType: 'Regular' as SeatType,
    supernumerary: false,
    admissionDate: new Date().toISOString().split('T')[0],
  })

  // Filter students
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => !s.archived)
      .filter((s) => {
        if (academicYear && s.academicYear !== academicYear) return false
        if (courseFilter !== 'ALL' && s.course !== courseFilter) return false
        if (branchFilter !== 'ALL' && s.branch !== branchFilter) return false
        if (statusFilter !== 'ALL' && s.verification !== statusFilter) return false
        if (categoryFilter !== 'ALL' && s.category !== categoryFilter) return false
        if (!search.trim()) return true

        const q = search.trim().toLowerCase()
        return (
          s.name.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          (s.apaarId && normaliseApaar(s.apaarId).includes(normaliseApaar(q))) ||
          s.email.toLowerCase().includes(q) ||
          s.mobile.includes(q)
        )
      })
  }, [students, academicYear, courseFilter, branchFilter, statusFilter, categoryFilter, search])

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredStudents.slice(start, start + PAGE_SIZE)
  }, [filteredStudents, currentPage])

  // Handle Add Student
  function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newStudent.name.trim()) return toast.error('Student Name is required')
    if (!newStudent.id.trim()) return toast.error('Enrollment Number is required')
    if (!newStudent.email.trim()) return toast.error('Email is required')

    // Check duplicate ID
    const exists = students.some((s) => s.id.toUpperCase() === newStudent.id.trim().toUpperCase())
    if (exists) return toast.error('Enrollment number already exists!')

    const apaarClean = normaliseApaar(newStudent.apaarId)
    const verification: VerificationStatus = apaarClean && isApaarFormatValid(apaarClean) ? 'Verified' : 'Pending'

    const studentRecord: Student = {
      id: newStudent.id.trim().toUpperCase(),
      name: newStudent.name.trim(),
      dob: newStudent.dob,
      gender: newStudent.gender,
      email: newStudent.email.trim(),
      mobile: newStudent.mobile.trim() || '9876543210',
      apaarId: apaarClean,
      course: newStudent.course,
      branch: newStudent.branch,
      academicYear: academicYear || '2026-27',
      admissionDate: newStudent.admissionDate,
      category: newStudent.category,
      seatType: newStudent.seatType,
      supernumerary: newStudent.supernumerary,
      nri: false,
      oci: false,
      foreignNational: false,
      digilocker: 'Not Linked',
      verification,
      semester: 1,
      cgpa: null,
      institutionCode: INSTITUTION.code,
      audit: [
        {
          at: new Date().toISOString(),
          action: 'Record created via Manual Entry',
          by: 'Institution Administrator',
        },
      ],
    }

    store.addStudents([studentRecord], {
      type: 'admission',
      message: `Enrolled new student ${studentRecord.name} (${studentRecord.id}) in ${studentRecord.branch}`,
    })

    toast.success(`Student ${studentRecord.name} added successfully!`)
    setAddOpen(false)
    setNewStudent({
      id: '',
      name: '',
      dob: '2008-01-15',
      gender: 'Male',
      email: '',
      mobile: '',
      apaarId: '',
      course: 'B.Tech',
      branch: 'CSE',
      category: 'General',
      seatType: 'Regular',
      supernumerary: false,
      admissionDate: new Date().toISOString().split('T')[0],
    })
  }

  // Handle Edit Save
  function handleEditSave(e: React.FormEvent) {
    e.preventDefault()
    if (!editStudent) return

    store.updateStudent(
      editStudent.id,
      {
        name: editStudent.name,
        dob: editStudent.dob,
        gender: editStudent.gender,
        email: editStudent.email,
        mobile: editStudent.mobile,
        course: editStudent.course,
        branch: editStudent.branch,
        category: editStudent.category,
        seatType: editStudent.seatType,
        apaarId: normaliseApaar(editStudent.apaarId),
        verification: editStudent.verification,
      },
      'Updated student details from directory',
    )

    toast.success(`Record updated for ${editStudent.name}`)
    setEditStudent(null)
  }

  // Handle Archive
  function handleArchiveConfirm() {
    if (!archiveCandidate) return
    store.updateStudent(archiveCandidate.id, { archived: true }, 'Archived student record')
    toast.info(`Archived record for ${archiveCandidate.name}`)
    setArchiveCandidate(null)
  }

  // Export filtered students as CSV
  function handleExportCsv() {
    const rows = filteredStudents.map((s) => ({
      'Enrollment Number': s.id,
      'Name': s.name,
      'Date of Birth': s.dob,
      'Gender': s.gender,
      'Email': s.email,
      'Mobile': s.mobile,
      'APAAR ID': s.apaarId || 'N/A',
      'Course': s.course,
      'Branch': s.branch,
      'Academic Year': s.academicYear,
      'Category': s.category,
      'Seat Type': s.seatType,
      'Verification Status': s.verification,
      'DigiLocker Status': s.digilocker,
    }))
    downloadCsv(rows, `student_records_${academicYear}.csv`)
    toast.success(`Exported ${filteredStudents.length} student records`)
  }

  return (
    <AppShell role="institution">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Student Records Management"
          description={`Comprehensive student enrolment directory for ${INSTITUTION.shortName}. Showing ${filteredStudents.length} active students.`}
          badge={<DemoBadge label="AY 2026-27" />}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExportCsv}>
                <Download className="size-4" data-icon="inline-start" />
                Export CSV
              </Button>
              <Link href="/institution/upload" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                <FileSpreadsheet className="size-4" data-icon="inline-start" />
                Bulk CSV Upload
              </Link>
              <Button size="sm" onClick={() => setAddOpen(true)}>
                <UserPlus className="size-4" data-icon="inline-start" />
                Add Student
              </Button>
            </div>
          }
        />

        {/* Filter Bar */}
        <Panel className="border-muted bg-card">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {/* Search */}
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Name, APAAR ID, Enrolment No..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  className="pl-9 h-9"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              {/* Course Filter */}
              <NativeSelect
                value={courseFilter}
                onChange={(e) => {
                  setCourseFilter(e.target.value)
                  setPage(1)
                }}
                className="[&_select]:h-9"
              >
                <NativeSelectOption value="ALL">All Programmes</NativeSelectOption>
                <NativeSelectOption value="B.Tech">B.Tech</NativeSelectOption>
                <NativeSelectOption value="MBA">MBA</NativeSelectOption>
              </NativeSelect>

              {/* Branch Filter */}
              <NativeSelect
                value={branchFilter}
                onChange={(e) => {
                  setBranchFilter(e.target.value)
                  setPage(1)
                }}
                className="[&_select]:h-9"
              >
                <NativeSelectOption value="ALL">All Branches</NativeSelectOption>
                {BRANCHES.map((b) => (
                  <NativeSelectOption key={b.branch} value={b.branch}>
                    {b.branch} - {b.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>

              {/* Status Filter */}
              <NativeSelect
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setPage(1)
                }}
                className="[&_select]:h-9"
              >
                <NativeSelectOption value="ALL">All Verification Statuses</NativeSelectOption>
                <NativeSelectOption value="Verified">Verified</NativeSelectOption>
                <NativeSelectOption value="Pending">Pending</NativeSelectOption>
                <NativeSelectOption value="Flagged">Flagged / Requires Review</NativeSelectOption>
              </NativeSelect>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span>
                  Showing <strong className="text-foreground">{paginatedStudents.length}</strong> of{' '}
                  <strong className="text-foreground">{filteredStudents.length}</strong> students
                </span>
                {(courseFilter !== 'ALL' || branchFilter !== 'ALL' || statusFilter !== 'ALL' || categoryFilter !== 'ALL' || search) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCourseFilter('ALL')
                      setBranchFilter('ALL')
                      setStatusFilter('ALL')
                      setCategoryFilter('ALL')
                      setSearch('')
                      setPage(1)
                    }}
                    className="h-6 text-xs text-gov-blue hover:underline p-0"
                  >
                    Clear all filters
                  </Button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-foreground">Category:</span>
                {['ALL', 'General', 'OBC-NCL', 'SC', 'ST', 'EWS'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCategoryFilter(c)
                      setPage(1)
                    }}
                    className={cn(
                      'rounded px-2 py-0.5 text-[11px] font-medium transition',
                      categoryFilter === c
                        ? 'bg-gov-blue text-white font-semibold'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80',
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        {/* Student Records Table */}
        <Panel className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs font-medium text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Enrolment No.</th>
                  <th className="px-4 py-3 font-semibold">Student Name</th>
                  <th className="px-4 py-3 font-semibold">Programme & Branch</th>
                  <th className="px-4 py-3 font-semibold">APAAR ID</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">DigiLocker</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {paginatedStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground">
                      No student records found matching the active filters.
                    </td>
                  </tr>
                ) : (
                  paginatedStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-primary">{s.id}</td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        <div>{s.name}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">{s.email}</div>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <div className="font-semibold text-foreground">{s.branch}</div>
                        <div className="text-muted-foreground">{s.course} · Sem {s.semester}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {s.apaarId ? (
                          <span className="inline-flex items-center gap-1 text-foreground">
                            <Fingerprint className="size-3 text-gov-blue" />
                            {s.apaarId.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3')}
                          </span>
                        ) : (
                          <span className="text-muted-foreground italic">Not Assigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className="rounded bg-muted px-2 py-0.5 font-medium">{s.category}</span>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {s.digilocker === 'Linked' ? (
                          <span className="inline-flex items-center gap-1 text-india-green font-medium">
                            <CheckCircle2 className="size-3.5" /> Linked
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-[11px]">{s.digilocker}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            s.verification === 'Verified'
                              ? 'default'
                              : s.verification === 'Flagged'
                              ? 'destructive'
                              : 'outline'
                          }
                          className="text-[11px]"
                        >
                          {s.verification === 'Flagged' ? 'Requires Review' : s.verification}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            title="View Student Dossier"
                            onClick={() => setViewStudent(s)}
                          >
                            <Eye className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            title="Edit Student Record"
                            onClick={() => setEditStudent(s)}
                          >
                            <Edit className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-destructive hover:text-destructive"
                            title="Archive Record"
                            onClick={() => setArchiveCandidate(s)}
                          >
                            <Archive className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-8 gap-1 px-2.5 text-xs"
                >
                  <ChevronLeft className="size-3.5" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="h-8 gap-1 px-2.5 text-xs"
                >
                  Next <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          )}
        </Panel>

        {/* View Student Dossier Modal */}
        <Dialog open={!!viewStudent} onOpenChange={(open) => !open && setViewStudent(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Student Academic Dossier</span>
                {viewStudent?.verification && (
                  <Badge variant={viewStudent.verification === 'Verified' ? 'default' : 'outline'}>
                    {viewStudent.verification}
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription>
                Permanent student academic profile registered with SIEM Pune.
              </DialogDescription>
            </DialogHeader>

            {viewStudent && (
              <div className="flex flex-col gap-4 text-xs">
                <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/40 p-3.5">
                  <div>
                    <span className="text-muted-foreground">Student Name</span>
                    <p className="font-semibold text-foreground text-sm">{viewStudent.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Enrollment Number</span>
                    <p className="font-mono font-semibold text-foreground text-sm">{viewStudent.id}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">APAAR ID</span>
                    <p className="font-mono font-semibold text-gov-blue">
                      {viewStudent.apaarId ? viewStudent.apaarId.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3') : 'Not Assigned'}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Programme & Branch</span>
                    <p className="font-medium text-foreground">{viewStudent.course} · {viewStudent.branch}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date of Birth</span>
                    <p className="text-foreground">{formatDate(viewStudent.dob)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Gender</span>
                    <p className="text-foreground">{viewStudent.gender}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category & Quota</span>
                    <p className="text-foreground">{viewStudent.category} ({viewStudent.seatType})</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">DigiLocker Status</span>
                    <p className="text-foreground font-medium">{viewStudent.digilocker}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email</span>
                    <p className="font-mono text-foreground">{viewStudent.email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Mobile</span>
                    <p className="font-mono text-foreground">{viewStudent.mobile}</p>
                  </div>
                </div>

                {/* Audit Trail */}
                <div className="flex flex-col gap-2">
                  <span className="font-semibold text-foreground">Audit Log History:</span>
                  <div className="flex max-h-36 flex-col divide-y divide-border/60 overflow-y-auto rounded-lg border bg-card p-2">
                    {viewStudent.audit.map((aud, i) => (
                      <div key={i} className="flex flex-col py-1.5 text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{aud.action}</span>
                          <span className="text-muted-foreground">{formatDateTime(aud.at)}</span>
                        </div>
                        <span className="text-muted-foreground">By: {aud.by}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setViewStudent(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Student Modal */}
        <Dialog open={!!editStudent} onOpenChange={(open) => !open && setEditStudent(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Student Record</DialogTitle>
              <DialogDescription>
                Update demographic or academic details for student #{editStudent?.id}.
              </DialogDescription>
            </DialogHeader>

            {editStudent && (
              <form onSubmit={handleEditSave} className="flex flex-col gap-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="edit-name">Student Full Name</Label>
                    <Input
                      id="edit-name"
                      value={editStudent.name}
                      onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="edit-apaar">APAAR ID (12 Digits)</Label>
                    <Input
                      id="edit-apaar"
                      value={editStudent.apaarId}
                      onChange={(e) => setEditStudent({ ...editStudent, apaarId: e.target.value })}
                      placeholder="123456789012"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="edit-email">Email Address</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editStudent.email}
                      onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="edit-mobile">Mobile Number</Label>
                    <Input
                      id="edit-mobile"
                      value={editStudent.mobile}
                      onChange={(e) => setEditStudent({ ...editStudent, mobile: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="edit-dob">Date of Birth</Label>
                    <Input
                      id="edit-dob"
                      type="date"
                      value={editStudent.dob}
                      onChange={(e) => setEditStudent({ ...editStudent, dob: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="edit-gender">Gender</Label>
                    <NativeSelect
                      id="edit-gender"
                      value={editStudent.gender}
                      onChange={(e) => setEditStudent({ ...editStudent, gender: e.target.value as Gender })}
                    >
                      <NativeSelectOption value="Male">Male</NativeSelectOption>
                      <NativeSelectOption value="Female">Female</NativeSelectOption>
                      <NativeSelectOption value="Other">Other</NativeSelectOption>
                    </NativeSelect>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="edit-branch">Branch</Label>
                    <NativeSelect
                      id="edit-branch"
                      value={editStudent.branch}
                      onChange={(e) => setEditStudent({ ...editStudent, branch: e.target.value as BranchCode })}
                    >
                      {BRANCHES.map((b) => (
                        <NativeSelectOption key={b.branch} value={b.branch}>
                          {b.branch} ({b.course})
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="edit-category">Category</Label>
                    <NativeSelect
                      id="edit-category"
                      value={editStudent.category}
                      onChange={(e) => setEditStudent({ ...editStudent, category: e.target.value as Category })}
                    >
                      <NativeSelectOption value="General">General</NativeSelectOption>
                      <NativeSelectOption value="OBC-NCL">OBC-NCL</NativeSelectOption>
                      <NativeSelectOption value="SC">SC</NativeSelectOption>
                      <NativeSelectOption value="ST">ST</NativeSelectOption>
                      <NativeSelectOption value="EWS">EWS</NativeSelectOption>
                    </NativeSelect>
                  </div>
                </div>

                <DialogFooter className="mt-2">
                  <Button type="button" variant="outline" onClick={() => setEditStudent(null)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Student Modal */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Student Record</DialogTitle>
              <DialogDescription>
                Register a new student enrolment. Fills mock database and updates stats in real time.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddSubmit} className="flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="add-id">Enrolment Number *</Label>
                  <Input
                    id="add-id"
                    placeholder="e.g. SI26CSE099"
                    value={newStudent.id}
                    onChange={(e) => setNewStudent({ ...newStudent, id: e.target.value })}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="add-name">Student Full Name *</Label>
                  <Input
                    id="add-name"
                    placeholder="e.g. Ramesh Chandra"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="add-apaar">APAAR ID (12 Digits)</Label>
                  <Input
                    id="add-apaar"
                    placeholder="e.g. 581203946712"
                    value={newStudent.apaarId}
                    onChange={(e) => setNewStudent({ ...newStudent, apaarId: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="add-email">Email Address *</Label>
                  <Input
                    id="add-email"
                    type="email"
                    placeholder="student@demo.edu"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="add-mobile">Mobile Number</Label>
                  <Input
                    id="add-mobile"
                    placeholder="9876543210"
                    value={newStudent.mobile}
                    onChange={(e) => setNewStudent({ ...newStudent, mobile: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="add-dob">Date of Birth</Label>
                  <Input
                    id="add-dob"
                    type="date"
                    value={newStudent.dob}
                    onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="add-gender">Gender</Label>
                  <NativeSelect
                    id="add-gender"
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value as Gender })}
                  >
                    <NativeSelectOption value="Male">Male</NativeSelectOption>
                    <NativeSelectOption value="Female">Female</NativeSelectOption>
                    <NativeSelectOption value="Other">Other</NativeSelectOption>
                  </NativeSelect>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="add-branch">Programme & Branch</Label>
                  <NativeSelect
                    id="add-branch"
                    value={newStudent.branch}
                    onChange={(e) => {
                      const branch = e.target.value as BranchCode
                      const cfg = BRANCHES.find((b) => b.branch === branch)
                      setNewStudent({
                        ...newStudent,
                        branch,
                        course: cfg?.course || 'B.Tech',
                      })
                    }}
                  >
                    {BRANCHES.map((b) => (
                      <NativeSelectOption key={b.branch} value={b.branch}>
                        {b.branch} - {b.label}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="add-category">Category</Label>
                  <NativeSelect
                    id="add-category"
                    value={newStudent.category}
                    onChange={(e) => setNewStudent({ ...newStudent, category: e.target.value as Category })}
                  >
                    <NativeSelectOption value="General">General</NativeSelectOption>
                    <NativeSelectOption value="OBC-NCL">OBC-NCL</NativeSelectOption>
                    <NativeSelectOption value="SC">SC</NativeSelectOption>
                    <NativeSelectOption value="ST">ST</NativeSelectOption>
                    <NativeSelectOption value="EWS">EWS</NativeSelectOption>
                  </NativeSelect>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="add-seat">Seat Quota</Label>
                  <NativeSelect
                    id="add-seat"
                    value={newStudent.seatType}
                    onChange={(e) => setNewStudent({ ...newStudent, seatType: e.target.value as SeatType })}
                  >
                    <NativeSelectOption value="Regular">Regular</NativeSelectOption>
                    <NativeSelectOption value="Management Quota">Management Quota</NativeSelectOption>
                    <NativeSelectOption value="TFWS">TFWS (Fee Waiver)</NativeSelectOption>
                  </NativeSelect>
                </div>
              </div>

              <DialogFooter className="mt-2">
                <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Enroll Student</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Archive Confirmation Dialog */}
        <Dialog open={!!archiveCandidate} onOpenChange={(open) => !open && setArchiveCandidate(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Record Archival</DialogTitle>
              <DialogDescription>
                Are you sure you want to archive student {archiveCandidate?.name} ({archiveCandidate?.id})?
                The student will be hidden from the active cohort.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setArchiveCandidate(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleArchiveConfirm}>
                Archive Record
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
