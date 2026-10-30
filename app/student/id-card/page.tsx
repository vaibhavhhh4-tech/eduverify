'use client'

import { useRef } from 'react'
import {
  CheckCircle2,
  Download,
  Fingerprint,
  GraduationCap,
  IdCard,
  Printer,
  QrCode,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { BrandMark, DemoBadge, TricolorRule } from '@/components/brand/logo'
import { PageHeader, Panel } from '@/components/dashboard/shared'
import { AppShell } from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useSession } from '@/lib/auth'
import { INSTITUTION } from '@/lib/mock-data'
import { useAppState } from '@/lib/storage'
import { formatDate } from '@/lib/utils'

export default function StudentIdCardPage() {
  const session = useSession()
  const { students } = useAppState()

  const student =
    students.find((s) => s.email === session?.email) ||
    students.find((s) => s.email === 'student@edverify.demo') ||
    students[0]

  const apaarFormatted = (student?.apaarId || '581203946712').replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3')

  function handlePrint() {
    window.print()
  }

  function handleDownloadCard() {
    toast.success('Downloaded official Digital Academic Identity Card (PDF/PNG)')
  }

  return (
    <AppShell role="student">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Digital Academic Identity Card"
          description="High-resolution, verifiable academic identity credential conforming to national standards."
          badge={<DemoBadge label="OFFICIAL PVC FORMAT" />}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="size-4" data-icon="inline-start" />
                Print Card
              </Button>
              <Button size="sm" onClick={handleDownloadCard}>
                <Download className="size-4" data-icon="inline-start" />
                Download Card
              </Button>
            </div>
          }
        />

        {/* Card Presentation Container */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border-2 border-primary/20 bg-card shadow-xl">
            {/* Header */}
            <div className="bg-primary px-5 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BrandMark className="bg-white text-primary size-9" />
                  <div>
                    <h3 className="font-bold text-sm tracking-tight">EduVerify Student ID</h3>
                    <p className="text-[10px] text-white/75">Ministry of Education · AICTE Approved</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-white/30 text-[10px] text-white bg-white/10">
                  AY 2026-27
                </Badge>
              </div>
            </div>

            <TricolorRule />

            {/* Card Body */}
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                {/* Photo Placeholder */}
                <div className="flex size-24 shrink-0 flex-col items-center justify-center rounded-xl border-2 border-muted bg-muted/60 text-muted-foreground">
                  <GraduationCap className="size-10 text-primary/60" />
                  <span className="text-[9px] font-semibold mt-1">PHOTO</span>
                </div>

                <div className="flex flex-col gap-1 flex-1 text-xs">
                  <h4 className="font-bold text-base text-foreground leading-tight">{student?.name}</h4>
                  <span className="font-mono font-semibold text-gov-blue">{student?.id}</span>
                  <p className="text-muted-foreground font-medium">{student?.course} - {student?.branch}</p>
                  <p className="text-muted-foreground text-[11px]">{INSTITUTION.name}</p>
                </div>
              </div>

              {/* APAAR Identifier Band */}
              <div className="rounded-xl border border-gov-blue/20 bg-gov-blue/5 p-3 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    APAAR ID Number
                  </span>
                  <span className="font-mono font-bold text-sm text-foreground tracking-wide">
                    {apaarFormatted}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-india-green">
                  <CheckCircle2 className="size-3.5" />
                  <span>Verified</span>
                </div>
              </div>

              {/* Demographic Details Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] border-t pt-3">
                <div>
                  <span className="text-muted-foreground">Date of Birth:</span>
                  <p className="font-medium text-foreground">{formatDate(student?.dob || '2008-01-15')}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Gender:</span>
                  <p className="font-medium text-foreground">{student?.gender || 'Female'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <p className="font-medium text-foreground">{student?.category || 'General'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Valid Through:</span>
                  <p className="font-medium text-foreground">30 June 2030</p>
                </div>
              </div>

              {/* QR and Security Seal */}
              <div className="flex items-center justify-between border-t pt-3">
                <div className="flex flex-col text-[10px] text-muted-foreground leading-tight max-w-[200px]">
                  <span>Scan QR code with authorized officer portal to verify bonafide status.</span>
                  <span className="font-mono text-[9px] mt-1 text-muted-foreground/80">SEAL: SHA256-EDV-{student?.id}</span>
                </div>
                <div className="flex size-16 items-center justify-center rounded-lg border bg-white p-1 shadow-xs">
                  <QrCode className="size-14 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
