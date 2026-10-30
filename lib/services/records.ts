import type { Alert, Student } from '@/types'
import { getRegistry } from '@/lib/mock-data'
import { isApaarFormatValid, normaliseApaar } from '@/lib/validation'

export type MockApaarOutcome = 'Verified' | 'Pending' | 'Requires Review' | 'Not Found' | 'Invalid Format'

export function displayVerification(status: Student['verification']): 'Verified' | 'Pending' | 'Requires Review' {
  if (status === 'Verified') return 'Verified'
  if (status === 'Flagged') return 'Requires Review'
  return 'Pending'
}

export function lookupApaar(query: string, students: Student[]) {
  const q = normaliseApaar(query).toLowerCase()
  const formatOk = isApaarFormatValid(query)
  const local = students.filter((s) => !s.archived && (normaliseApaar(s.apaarId) === normaliseApaar(query) || s.id.toLowerCase() === query.trim().toLowerCase() || s.name.toLowerCase().includes(query.trim().toLowerCase())))
  const registry = getRegistry().filter((r) => normaliseApaar(r.apaarId) === normaliseApaar(query))
  const duplicates = students.filter((s) => s.apaarId && normaliseApaar(s.apaarId) === normaliseApaar(query) && !s.archived)
  let outcome: MockApaarOutcome = 'Not Found'
  if (!query.trim()) outcome = 'Not Found'
  else if (!formatOk && !local.length) outcome = 'Invalid Format'
  else if (duplicates.length > 1 || registry.length) outcome = 'Requires Review'
  else if (local[0]?.verification === 'Flagged') outcome = 'Requires Review'
  else if (local[0]?.verification === 'Verified') outcome = 'Verified'
  else if (local[0]) outcome = 'Pending'
  return { formatOk, local, registry, duplicates, outcome, query: q }
}

export function similarNameGroups(students: Student[]) {
  const map = new Map<string, Student[]>()
  for (const s of students.filter((x) => !x.archived)) {
    const key = s.name.toLowerCase().replace(/[^a-z]/g, '')
    if (!key) continue
    const list = map.get(key) ?? []
    list.push(s)
    map.set(key, list)
  }
  return [...map.values()].filter((g) => g.length > 1)
}

export function inconsistentRecords(students: Student[]) {
  return students.filter((s) => {
    if (s.archived) return false
    if (s.course === 'MBA' && s.branch !== 'MBA') return true
    if (s.course !== 'MBA' && s.branch === 'MBA') return true
    if (s.email && !s.email.includes('@')) return true
    if (s.apaarId && !isApaarFormatValid(s.apaarId)) return true
    return false
  })
}

export function categoryDistribution(students: Student[]) {
  const counts: Record<string, number> = { General: 0, 'OBC-NCL': 0, SC: 0, ST: 0, EWS: 0 }
  for (const s of students) counts[s.category] = (counts[s.category] ?? 0) + 1
  return Object.entries(counts).map(([category, count]) => ({ category, count }))
}

export function suspiciousAdmissionPatterns(alerts: Alert[]) {
  return alerts.filter((a) => a.type === 'Intake Exceeded')
}
