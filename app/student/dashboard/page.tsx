'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  Copy,
  Download,
  Eye,
  EyeOff,
  FileCheck,
  FileText,
  Fingerprint,
  FolderLock,
  GraduationCap,
  IdCard,
  QrCode,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import { BrandMark, DemoBadge, TricolorRule } from '@/components/brand/logo'
import { PageHeader, Panel } from '@/components/dashboard/shared'
import { AppShell } from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { useSession } from '@/lib/auth'
import { INSTITUTION } from '@/lib/mock-data'
import { useAppState } from '@/lib/storage'
import { formatDate } from '@/lib/utils'

export default function StudentDashboardPage() {
  const session = useSession()
  const { students, studentDigilocker } = useAppState()

  // Find active student record (Ananya Rao by default for student role)
  const student =
    students.find((s) => s.email === session?.email) ||
    students.find((s) => s.email === 'student@edverify.demo') ||
    students[0]

  const [showApaar, setShowApaar] = useState(false)

  const apaarRaw = student?.apaarId || '581203946712'
  const formattedApaar = apaarRaw.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')
  const maskedApaar = `•••• •••• ${apaarRaw.slice(-4)}`

  function handleCopyApaar() {
    navigator.clipboard.writeText(apaarRaw)
    toast.success('Copied APAAR ID to clipboard')
  }

  return (
    <AppShell role="student">
      <div className="flex flex-col gap-6">
        <PageHeader
          title={`Welcome, ${student?.name || 'Student'}`}
          description={`Permanent Academic Identity & Digital Credentials Portal · Enrolment: ${student?.id || 'SI26CSE042'}`}
          badge={<DemoBadge label="STUDENT IDENTITY PORTAL" />}
          actions={
            <div className="flex items-center gap-2">
              <Link href="/student/id-card" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                <IdCard className="size-4" data-icon="inline-start" />
                View Full ID Card
              </Link>
              <Link href="/student/documents" className={buttonVariants({ size: 'sm' })}>
                <FolderLock className="size-4" data-icon="inline-start" />
                DigiLocker Records
              </Link>
            </div>
          }
        />

        {/* Identity & APAAR Highlights Card */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Academic ID Banner */}
          <div className="flex flex-col justify-between rounded-2xl border bg-gradient-to-br from-primary to-gov-blue p-6 text-white shadow-md lg:col-span-2">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <BrandMark className="bg-white text-primary" />
                  <div>
                    <h3 className="font-bold text-lg leading-tight">EduVerify Academic Identity</h3>
                    <p className="text-xs text-white/75">One Student · One Persistent National ID</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-white/40 bg-white/10 text-white text-xs">
                  <CheckCircle2 className="size-3 mr-1 text-india-green" />
                  Verified Bonafide
                </Badge>
              </div>

              {/* Student Demographics */}
              <div className="grid grid-cols-2 gap-4 border-t border-white/15 pt-4 text-xs sm:grid-cols-4">
                <div>
                  <span className="text-white/65">Full Name</span>
                  <p className="font-bold text-sm text-white mt-0.5">{student?.name}</p>
                </div>
                <div>
                  <span className="text-white/65">Enrolment Number</span>
                  <p className="font-mono font-bold text-sm text-white mt-0.5">{student?.id}</p>
                </div>
                <div>
                  <span className="text-white/65">Programme & Branch</span>
                  <p className="font-semibold text-white mt-0.5">{student?.course} - {student?.branch}</p>
                </div>
                <div>
                  <span className="text-white/65">Academic Year</span>
                  <p className="font-semibold text-white mt-0.5">{student?.academicYear}</p>
                </div>
              </div>

              {/* APAAR ID Section with Privacy Masking Toggle */}
              <div className="rounded-xl bg-white/10 p-4 ring-1 ring-white/15">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white/80 flex items-center gap-1.5">
                    <Fingerprint className="size-4 text-saffron" />
                    Automated Permanent Academic Account Registry (APAAR ID)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowApaar((v) => !v)}
                      className="inline-flex items-center gap-1 rounded bg-white/15 px-2 py-0.5 text-xs text-white hover:bg-white/25"
                    >
                      {showApaar ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      <span>{showApaar ? 'Hide' : 'Show'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyApaar}
                      className="inline-flex items-center gap-1 rounded bg-white/15 px-2 py-0.5 text-xs text-white hover:bg-white/25"
                      title="Copy APAAR ID"
                    >
                      <Copy className="size-3.5" />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-xl font-mono font-bold tracking-wider text-saffron">
                  {showApaar ? formattedApaar : maskedApaar}
                </div>
                <p className="mt-1 text-[11px] text-white/60">
                  Protected under National Student Privacy Guidelines. Never share your APAAR ID with unauthorized third parties.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-white/70">
              <span>Institution: {INSTITUTION.name}</span>
              <span>AICTE ID: {INSTITUTION.aicteId}</span>
            </div>
          </div>

          {/* Quick PVC Card Preview */}
          <div className="flex flex-col justify-between rounded-2xl border bg-card p-5 shadow-xs">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-xs font-bold text-foreground">Digital Identity Card</span>
                <Badge variant="outline" className="text-[10px]">
                  PVC Ready
                </Badge>
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 p-4 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-gov-blue/10 text-gov-blue">
                  <GraduationCap className="size-7" />
                </div>
                <h4 className="mt-2 font-bold text-sm text-foreground">{student?.name}</h4>
                <p className="text-xs text-muted-foreground">{student?.course} ({student?.branch})</p>
                <div className="mt-2 font-mono text-xs font-semibold text-gov-blue">{student?.id}</div>

                <div className="mt-3 flex size-20 items-center justify-center rounded-lg bg-white p-1 shadow-xs border">
                  <QrCode className="size-16 text-primary" />
                </div>
              </div>
            </div>

            <Link href="/student/id-card" className={buttonVariants({ variant: 'outline', size: 'sm', className: 'mt-3 w-full' })}>
              <IdCard className="size-3.5 mr-1" />
              Download Official Card
            </Link>
          </div>
        </div>

        {/* Academic Profile & DigiLocker Documents */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Institutional Enrolment Info */}
          <Panel title="Institutional Registration Details" description="Affiliated Institute & Degree Parameters">
            <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/40 p-3.5 text-xs">
              <div>
                <span className="text-muted-foreground">College / University</span>
                <p className="font-bold text-foreground text-sm">{INSTITUTION.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">College Code</span>
                <p className="font-mono font-medium text-foreground">{INSTITUTION.code}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Current Semester</span>
                <p className="font-medium text-foreground">Semester 1 (First Year)</p>
              </div>
              <div>
                <span className="text-muted-foreground">Admission Category</span>
                <p className="font-medium text-foreground">{student?.category} ({student?.seatType})</p>
              </div>
              <div>
                <span className="text-muted-foreground">Registered Email</span>
                <p className="font-mono text-foreground">{student?.email}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Registered Mobile</span>
                <p className="font-mono text-foreground">{student?.mobile}</p>
              </div>
            </div>
          </Panel>

          {/* Linked DigiLocker Documents */}
          <Panel
            title="DigiLocker Linked Documents"
            description="Verified certificates fetched from National Depository"
            actions={
              <Link href="/student/documents" className="text-xs font-medium text-gov-blue hover:underline">
                View all
              </Link>
            }
          >
            <div className="flex flex-col divide-y divide-border/60">
              {studentDigilocker.documents.slice(0, 3).map((doc) => (
                <div key={doc.id} className="flex items-center justify-between py-2.5 text-xs">
                  <div className="flex items-center gap-2.5">
                    <FileCheck className="size-4 text-gov-blue shrink-0" />
                    <div>
                      <span className="font-bold text-foreground block">{doc.name}</span>
                      <span className="text-[11px] text-muted-foreground">{doc.issuer} · {doc.issuedOn}</span>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-india-green text-[10px]">
                    {doc.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  )
}
