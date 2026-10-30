import type { Alert, Student } from '@/types'
import { BRANCHES, INSTITUTION } from './mock-data'

export function activeCohort(students: Student[], year: string) {
  return students.filter((s) => s.institutionCode === INSTITUTION.code && s.academicYear === year && !s.archived && !s.draft)
}

export function institutionStats(students: Student[], alerts: Alert[], year: string) {
  const cohort = activeCohort(students, year)
  const approved = BRANCHES.reduce((s, b) => s + b.approved, 0)
  const verified = cohort.filter((s) => s.verification === 'Verified').length
  return {
    approved,
    enrolled: cohort.length,
    verified,
    pending: cohort.length - verified,
    flagged: cohort.filter((s) => s.verification === 'Flagged').length,
    duplicateAlerts: alerts.filter((a) => a.type === 'Duplicate APAAR' && a.status !== 'Resolved').length,
    openAlerts: alerts.filter((a) => a.status !== 'Resolved').length,
  }
}

export interface BranchRow {
  branch: string
  label: string
  course: string
  approved: number
  supernumeraryApproved: number
  foreignApproved: number
  total: number
  supernumerary: number
  foreign: number
  regular: number
  verified: number
  regularVariance: number
  remaining: number
  excess: number
  status: 'Within Intake' | 'Exceeds Intake' | 'Category Limit Exceeded'
}

export function branchBreakdown(students: Student[], year: string): BranchRow[] {
  const cohort = activeCohort(students, year)
  return BRANCHES.map((b) => {
    const list = cohort.filter((s) => s.branch === b.branch)
    const supernumerary = list.filter((s) => s.supernumerary).length
    const foreign = list.filter((s) => !s.supernumerary && (s.nri || s.oci || s.foreignNational)).length
    const regular = list.length - supernumerary - foreign
    const variance = regular - b.approved
    const catExceeded = supernumerary > b.supernumeraryApproved || foreign > b.foreignApproved
    return {
      branch: b.branch,
      label: b.label,
      course: b.course,
      approved: b.approved,
      supernumeraryApproved: b.supernumeraryApproved,
      foreignApproved: b.foreignApproved,
      total: list.length,
      supernumerary,
      foreign,
      regular,
      verified: list.filter((s) => s.verification === 'Verified').length,
      regularVariance: variance,
      remaining: Math.max(0, -variance),
      excess: Math.max(0, variance),
      status: variance > 0 ? 'Exceeds Intake' : catExceeded ? 'Category Limit Exceeded' : 'Within Intake',
    }
  })
}
