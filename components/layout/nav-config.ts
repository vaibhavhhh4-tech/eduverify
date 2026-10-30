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
    { href: '/institution/dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, exact: true },
    { href: '/institution/students', label: 'Student Management', icon: Users },
    { href: '/institution/upload', label: 'Bulk Upload', icon: Upload },
    { href: '/institution/apaar-verification', label: 'APAAR Verification', icon: Fingerprint },
    { href: '/institution/digilocker', label: 'DigiLocker Integration', icon: FolderLock },
    { href: '/institution/admissions', label: 'Admission Monitoring', icon: ClipboardCheck },
    { href: '/institution/duplicates', label: 'Duplicate Detection', icon: AlertTriangle, badge: 'alerts' },
    { href: '/institution/reports', label: 'Reports & Analytics', icon: BarChart3 },
    { href: '/institution/settings', label: 'Settings', icon: Settings },
  ],
  aicte: [
    { href: '/admin/dashboard', label: 'AICTE Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/institutions', label: 'Institution Directory', icon: Building2 },
    { href: '/admin/duplicates', label: 'National Duplicate Alerts', icon: AlertTriangle, badge: 'alerts' },
    { href: '/admin/apaar', label: 'APAAR Analytics', icon: Fingerprint },
    { href: '/admin/reports', label: 'National Reports', icon: BarChart3 },
    { href: '/admin/settings', label: 'AICTE Settings', icon: Settings },
  ],
  officer: [
    { href: '/officer/dashboard', label: 'Record & QR Verification', icon: QrCode, exact: true },
    { href: '/officer/history', label: 'Verification Log', icon: History },
    { href: '/officer/settings', label: 'Officer Settings', icon: Settings },
  ],
  student: [
    { href: '/student/dashboard', label: 'Student Portal & ID Card', icon: LayoutDashboard, exact: true },
    { href: '/student/documents', label: 'DigiLocker Documents', icon: FolderLock },
    { href: '/student/id-card', label: 'Digital Identity Card', icon: IdCard },
    { href: '/student/consent', label: 'Consent & Access', icon: FileText },
    { href: '/student/settings', label: 'Student Settings', icon: Settings },
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
