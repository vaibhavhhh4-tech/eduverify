import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const inr = new Intl.NumberFormat('en-IN')

export function formatNumber(n: number) {
  return inr.format(n)
}

export function formatDate(value: string | null | undefined) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function percent(part: number, total: number) {
  if (!total) return 0
  return Math.round((part / total) * 1000) / 10
}

/** Demo-only signature (FNV-1a over payload + demo key). Not cryptographically secure. */
export function demoSign(payload: string) {
  const input = `${payload}|EDUVERIFY-DEMO-KEY`
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16).toUpperCase().padStart(8, '0')
}

export interface QrPayload {
  v: 1
  ref: string
  sid: string
  iss: string
  ts: string
  sig: string
}

export function buildQrPayload(studentId: string, institutionCode: string): string {
  const ref = `EVR-${studentId}`
  const ts = '2026-10-30'
  const sig = demoSign(`${ref}|${studentId}|${institutionCode}|${ts}`)
  const payload: QrPayload = { v: 1, ref, sid: studentId, iss: institutionCode, ts, sig }
  return JSON.stringify(payload)
}

export function verifyQrPayload(raw: string): { ok: true; payload: QrPayload; signatureValid: boolean } | { ok: false; error: string } {
  try {
    const p = JSON.parse(raw) as QrPayload
    if (p.v !== 1 || !p.ref || !p.sid || !p.sig) return { ok: false, error: 'QR payload is missing required fields.' }
    const expected = demoSign(`${p.ref}|${p.sid}|${p.iss}|${p.ts}`)
    return { ok: true, payload: p, signatureValid: expected === p.sig }
  } catch {
    return { ok: false, error: 'QR content is not a valid EduVerify demo payload.' }
  }
}
