'use client'

import { useSyncExternalStore } from 'react'
import type { Role, Session } from '@/types'

/**
 * Demo-only authentication. Credentials are checked locally in the browser and
 * the session is kept in localStorage. This is NOT production-grade security.
 */

const SESSION_KEY = 'eduverify.session'

export const ROLE_LABEL: Record<Role, string> = {
  institution: 'Institution Administrator',
  aicte: 'AICTE Administrator',
  officer: 'Verification Officer',
  student: 'Student',
}

export const ROLE_HOME: Record<Role, string> = {
  institution: '/institution',
  aicte: '/aicte',
  officer: '/verification',
  student: '/student',
}

export const DEMO_ACCOUNTS: { role: Role; email: string; altId?: string; password: string; name: string; designation: string }[] = [
  { role: 'institution', email: 'institution@edverify.demo', altId: '1-44120593', password: 'Demo@123', name: 'Prof. Rajesh Deshpande', designation: 'Registrar, SIEM Pune' },
  { role: 'aicte', email: 'aicte@edverify.demo', password: 'Demo@123', name: 'Dr. S. Venkataraman', designation: 'Deputy Director (Demo), Approvals Bureau' },
  { role: 'officer', email: 'officer@edverify.demo', password: 'Demo@123', name: 'Neha Bhatnagar', designation: 'Verification Officer, Demo Scholarship Cell' },
  { role: 'student', email: 'student@edverify.demo', password: 'Demo@123', name: 'Ananya Rao', designation: 'B.Tech CSE, 2026-27' },
]

export type LoginResult = { ok: true; session: Session } | { ok: false; field: 'identifier' | 'password' | 'role'; message: string }

export async function mockLogin(identifier: string, password: string, role: Role): Promise<LoginResult> {
  await new Promise((r) => setTimeout(r, 900))
  const id = identifier.trim().toLowerCase()
  const account = DEMO_ACCOUNTS.find((a) => a.email === id || a.altId?.toLowerCase() === id)
  if (!account) return { ok: false, field: 'identifier', message: 'No demo account found with this email or institutional ID.' }
  if (account.password !== password) return { ok: false, field: 'password', message: 'Incorrect password. Please check the Demo Access section.' }
  if (account.role !== role)
    return { ok: false, field: 'role', message: `This account is registered as "${ROLE_LABEL[account.role]}". Please select the correct role.` }
  const session: Session = { role, email: account.email, name: account.name, designation: account.designation, loggedInAt: new Date().toISOString() }
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  cached = session
  emit()
  return { ok: true, session }
}

export function logout() {
  window.localStorage.removeItem(SESSION_KEY)
  cached = null
  emit()
}

let cached: Session | null | undefined
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

function read(): Session | null {
  if (cached !== undefined) return cached
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    cached = raw ? (JSON.parse(raw) as Session) : null
  } catch {
    cached = null
  }
  return cached
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

/** Returns undefined until the client has read storage, then the session or null. */
export function useSession(): Session | null | undefined {
  return useSyncExternalStore(subscribe, read, () => undefined)
}
