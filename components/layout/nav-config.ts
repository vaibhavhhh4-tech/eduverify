import {
  AlertTriangle,
  BarChart3,
  Building2,
  ClipboardCheck,
  FileText,
  Fingerprint,
  FolderLock,
  History,
  IdCard,
  LayoutDashboard,
  type LucideIcon,
  QrCode,
  Settings,
  Upload,
  UserPlus,
  Users,
} from 'lucide-react'
import type { Role } from '@/types'

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
  badge?: 'alerts'
}

export const NAV: Record<Role, NavItem[]> = {
  institution: [
    { href: '/institution', label: 'Overview', icon: LayoutDashboard, exact: true },
    { href: '/institution/students', label: 'Student Records', icon: Users, exact: true },
    { href: '/institution/students/new', label: 'Add Student', icon: UserPlus },
    { href: '/institution/upload', label: 'Bulk Upload', icon: Upload },
    { href: '/institution/apaar', label: 'APAAR Verification', icon: Fingerprint },
    { href: '/institution/digilocker', label: 'DigiLocker', icon: FolderLock },
    { href: '/institution/admissions', label: 'Admission Monitoring', icon: ClipboardCheck },
    { href: '/institution/alerts', label: 'Duplicate Alerts', icon: AlertTriangle, badge: 'alerts' },
    { href: '/institution/reports', label: 'Reports', icon: BarChart3 },
    { href: '/institution/settings', label: 'Settings', icon: Settings },
  ],
  aicte: [
    { href: '/aicte', label: 'National Overview', icon: LayoutDashboard, exact: true },
    { href: '/aicte/institutions', label: 'Institution Directory', icon: Building2 },
    { href: '/aicte/alerts', label: 'Duplicate Alerts', icon: AlertTriangle, badge: 'alerts' },
    { href: '/aicte/apaar', label: 'APAAR Verification', icon: Fingerprint },
    { href: '/aicte/reports', label: 'Reports', icon: BarChart3 },
    { href: '/aicte/settings', label: 'Settings', icon: Settings },
  ],
  officer: [
    { href: '/verification', label: 'Verify Record', icon: QrCode, exact: true },
    { href: '/verification/history', label: 'Verification Log', icon: History },
    { href: '/verification/settings', label: 'Settings', icon: Settings },
  ],
  student: [
    { href: '/student', label: 'My Academic Record', icon: LayoutDashboard, exact: true },
    { href: '/student/documents', label: 'DigiLocker Documents', icon: FolderLock },
    { href: '/student/id-card', label: 'Academic ID Card', icon: IdCard },
    { href: '/student/consent', label: 'Consent & Access', icon: FileText },
    { href: '/student/settings', label: 'Settings', icon: Settings },
  ],
}

export function isActive(item: NavItem, pathname: string) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`)
}

export function titleFor(role: Role, pathname: string) {
  const items = NAV[role]
  const match = [...items].sort((a, b) => b.href.length - a.href.length).find((i) => isActive(i, pathname) || pathname.startsWith(i.href))
  return match?.label ?? 'Dashboard'
}
