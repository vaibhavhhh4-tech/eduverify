'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { ROLE_HOME } from '@/lib/auth'
import type { Role } from '@/types'

const LABELS: Record<string, string> = {
  institution: 'Institution',
  admin: 'AICTE Admin',
  aicte: 'AICTE Admin',
  officer: 'Verification Officer',
  verification: 'Verification Officer',
  student: 'Student Portal',
  dashboard: 'Dashboard',
  students: 'Student Records',
  new: 'Add Student',
  edit: 'Edit',
  upload: 'Bulk Upload',
  apaar: 'APAAR Verification',
  'apaar-verification': 'APAAR Verification',
  digilocker: 'DigiLocker Integration',
  admissions: 'Admission Monitoring',
  duplicates: 'Duplicate Detection',
  alerts: 'Duplicate Alerts',
  reports: 'Reports',
  settings: 'Settings',
  institutions: 'Institution Directory',
  history: 'Verification Log',
  documents: 'Documents',
  'id-card': 'Academic ID Card',
  consent: 'Consent & Access',
}

export function Breadcrumbs({ role }: { role: Role }) {
  const pathname = usePathname()
  const parts = pathname.split('/').filter(Boolean)
  const crumbs = parts.map((part, i) => {
    const href = '/' + parts.slice(0, i + 1).join('/')
    const label = LABELS[part] ?? part.charAt(0).toUpperCase() + part.slice(1)
    return { href, label }
  })
  return (
    <nav aria-label="Breadcrumb" className="-mt-2 mb-1">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        <li>
          <Link href={ROLE_HOME[role]} className="hover:text-foreground hover:underline">
            Home
          </Link>
        </li>
        {crumbs.map((c) => (
          <li key={c.href} className="flex items-center gap-1">
            <ChevronRight className="size-3" aria-hidden="true" />
            <Link href={c.href} className="hover:text-foreground hover:underline">
              {c.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}
