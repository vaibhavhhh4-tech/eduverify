'use client'

import { useSyncExternalStore } from 'react'
import type {
  Activity,
  Alert,
  AppNotification,
  Category,
  ConsentEntry,
  DigiLockerState,
  Profile,
  Role,
  Student,
  VerificationLog,
} from '@/types'
import {
  CONSENT_SEED,
  CURRENT_YEAR,
  DIGILOCKER_DOCS,
  VERIFICATION_LOG_SEED,
  generateBaseStudents,
  seedActivities,
  seedAlerts,
  seedNotifications,
} from './mock-data'

const STORAGE_KEY = 'eduverify.demo.v1'
const STATE_VERSION = 1

interface PersistedState {
  version: number
  added: Student[]
  edits: Record<string, Partial<Student>>
  alerts: Alert[]
  activities: Activity[]
  notifications: AppNotification[]
  digilocker: DigiLockerState
  studentDigilocker: DigiLockerState
  verificationLogs: VerificationLog[]
  consents: ConsentEntry[]
  academicYear: string
  profiles: Partial<Record<Role, Profile>>
  reminders: string[]
  passwordOverrides: Record<string, string>
  seatPolicy: Record<Category, number>
}

export interface AppState extends PersistedState {
  students: Student[]
}

function defaults(): PersistedState {
  return {
    version: STATE_VERSION,
    added: [],
    edits: {},
    alerts: seedAlerts(),
    activities: seedActivities(),
    notifications: seedNotifications(),
    digilocker: { connected: false, lastSync: null, documents: [] },
    studentDigilocker: { connected: true, lastSync: '2026-10-26T18:05:00', documents: DIGILOCKER_DOCS },
    verificationLogs: VERIFICATION_LOG_SEED,
    consents: CONSENT_SEED,
    academicYear: CURRENT_YEAR,
    profiles: {},
    reminders: [],
    passwordOverrides: {},
    seatPolicy: { General: 40.5, 'OBC-NCL': 27, SC: 15, ST: 7.5, EWS: 10 },
  }
}

function derive(p: PersistedState): AppState {
  const base = generateBaseStudents()
  const merged = base.map((s) => (p.edits[s.id] ? { ...s, ...p.edits[s.id] } : s))
  const added = p.added.map((s) => (p.edits[s.id] ? { ...s, ...p.edits[s.id] } : s))
  return { ...p, students: [...added, ...merged] }
}

let persisted: PersistedState | null = null
let snapshot: AppState | null = null
let serverSnapshot: AppState | null = null
const listeners = new Set<() => void>()

function load(): PersistedState {
  if (persisted) return persisted
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState
      if (parsed.version === STATE_VERSION) {
        persisted = { ...defaults(), ...parsed }
        return persisted
      }
    }
  } catch {
    // Corrupt storage falls back to fresh demo data.
  }
  persisted = defaults()
  return persisted
}

function getSnapshot(): AppState {
  if (!snapshot) snapshot = derive(load())
  return snapshot
}

function getServerSnapshot(): AppState {
  if (!serverSnapshot) serverSnapshot = derive(defaults())
  return serverSnapshot
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      persisted = null
      snapshot = null
      cb()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(cb)
    window.removeEventListener('storage', onStorage)
  }
}

function update(fn: (s: PersistedState) => PersistedState) {
  persisted = fn(load())
  snapshot = null
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted))
  } catch {
    // Storage quota exceeded; state is kept in memory for this session.
  }
  listeners.forEach((l) => l())
}

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
const now = () => new Date().toISOString()

export function addActivity(type: Activity['type'], message: string) {
  update((s) => ({ ...s, activities: [{ id: uid('act'), at: now(), type, message }, ...s.activities].slice(0, 50) }))
}

export function addNotification(title: string, body: string, href: string) {
  update((s) => ({
    ...s,
    notifications: [{ id: uid('ntf'), at: now(), title, body, href, read: false }, ...s.notifications].slice(0, 30),
  }))
}

export const store = {
  addStudents(list: Student[], activity: { type: Activity['type']; message: string }) {
    update((s) => ({ ...s, added: [...list, ...s.added] }))
    addActivity(activity.type, activity.message)
  },
  updateStudent(id: string, patch: Partial<Student>, action: string, by = 'Institution Administrator') {
    const current = getSnapshot().students.find((x) => x.id === id)
    if (!current) return
    const audit = [...current.audit, { at: now(), action, by }]
    update((s) => ({ ...s, edits: { ...s.edits, [id]: { ...s.edits[id], ...patch, audit } } }))
  },
  updateAlert(id: string, patch: Partial<Alert>, note?: string) {
    update((s) => ({
      ...s,
      alerts: s.alerts.map((a) =>
        a.id === id ? { ...a, ...patch, notes: note ? [...(a.notes ?? []), `${new Date().toLocaleString('en-IN')}: ${note}`] : a.notes } : a,
      ),
    }))
  },
  addAlert(alert: Omit<Alert, 'id'>) {
    const id = `ALT-2026-${String(200 + getSnapshot().alerts.length).padStart(4, '0')}`
    update((s) => ({ ...s, alerts: [{ ...alert, id }, ...s.alerts] }))
    return id
  },
  markNotificationRead(id: string) {
    update((s) => ({ ...s, notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) }))
  },
  markAllNotificationsRead() {
    update((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }))
  },
  setAcademicYear(year: string) {
    update((s) => ({ ...s, academicYear: year }))
  },
  setDigilocker(target: 'institution' | 'student', value: DigiLockerState) {
    update((s) => (target === 'institution' ? { ...s, digilocker: value } : { ...s, studentDigilocker: value }))
  },
  addVerificationLog(log: Omit<VerificationLog, 'id' | 'at'>) {
    update((s) => ({ ...s, verificationLogs: [{ ...log, id: uid('ver'), at: now() }, ...s.verificationLogs].slice(0, 100) }))
  },
  addConsent(entry: Omit<ConsentEntry, 'id' | 'at'>) {
    update((s) => ({ ...s, consents: [{ ...entry, id: uid('con'), at: now() }, ...s.consents] }))
  },
  updateConsent(id: string, status: ConsentEntry['status']) {
    update((s) => ({ ...s, consents: s.consents.map((c) => (c.id === id ? { ...c, status } : c)) }))
  },
  saveProfile(role: Role, profile: Profile) {
    update((s) => ({ ...s, profiles: { ...s.profiles, [role]: profile } }))
  },
  addReminder(code: string) {
    update((s) => ({ ...s, reminders: Array.from(new Set([...s.reminders, code])) }))
  },
  clearNotifications() {
    update((s) => ({ ...s, notifications: [] }))
  },
  setPasswordOverride(email: string, password: string) {
    update((s) => ({ ...s, passwordOverrides: { ...s.passwordOverrides, [email]: password } }))
  },
  setSeatPolicy(seatPolicy: Record<Category, number>) {
    update((s) => ({ ...s, seatPolicy }))
  },
  reset() {
    update(() => defaults())
  },
}

export function getPasswordOverride(email: string) {
  try {
    return load().passwordOverrides[email] ?? null
  } catch {
    return null
  }
}

export function getStudentsSnapshot() {
  return getSnapshot().students
}
