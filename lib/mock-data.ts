import type {
  Activity,
  Alert,
  AppNotification,
  BranchCode,
  Category,
  ConsentEntry,
  CourseCode,
  DigiDocument,
  Gender,
  Institution,
  Student,
  VerificationLog,
} from '@/types'

/* All data in this file is fictional and illustrative. */

export const CURRENT_YEAR = '2026-27'
export const ACADEMIC_YEARS = ['2026-27', '2025-26'] as const

export const INSTITUTION = {
  code: 'SIEM-PN-0417',
  aicteId: '1-44120593',
  name: 'Sahyadri Institute of Engineering & Management',
  shortName: 'SIEM Pune',
  city: 'Pune',
  state: 'Maharashtra',
  type: 'Private (Autonomous)',
  principal: 'Dr. Meera Kulkarni',
  email: 'registrar@siem.demo',
}

export interface BranchConfig {
  branch: BranchCode
  course: CourseCode
  label: string
  approved: number
  supernumeraryApproved: number
  foreignApproved: number
  enrolled: Record<string, number>
  supernumerary: Record<string, number>
  foreign: Record<string, number>
}

export const BRANCHES: BranchConfig[] = [
  { branch: 'CSE', course: 'B.Tech', label: 'Computer Science & Engg.', approved: 120, supernumeraryApproved: 6, foreignApproved: 6, enrolled: { '2026-27': 125, '2025-26': 118 }, supernumerary: { '2026-27': 2, '2025-26': 3 }, foreign: { '2026-27': 1, '2025-26': 2 } },
  { branch: 'ECE', course: 'B.Tech', label: 'Electronics & Communication', approved: 90, supernumeraryApproved: 5, foreignApproved: 4, enrolled: { '2026-27': 85, '2025-26': 88 }, supernumerary: { '2026-27': 2, '2025-26': 2 }, foreign: { '2026-27': 1, '2025-26': 0 } },
  { branch: 'ME', course: 'B.Tech', label: 'Mechanical Engineering', approved: 120, supernumeraryApproved: 6, foreignApproved: 6, enrolled: { '2026-27': 110, '2025-26': 112 }, supernumerary: { '2026-27': 2, '2025-26': 2 }, foreign: { '2026-27': 0, '2025-26': 1 } },
  { branch: 'EE', course: 'B.Tech', label: 'Electrical Engineering', approved: 90, supernumeraryApproved: 5, foreignApproved: 4, enrolled: { '2026-27': 88, '2025-26': 86 }, supernumerary: { '2026-27': 2, '2025-26': 1 }, foreign: { '2026-27': 1, '2025-26': 0 } },
  { branch: 'CE', course: 'B.Tech', label: 'Civil Engineering', approved: 60, supernumeraryApproved: 3, foreignApproved: 3, enrolled: { '2026-27': 52, '2025-26': 55 }, supernumerary: { '2026-27': 1, '2025-26': 1 }, foreign: { '2026-27': 0, '2025-26': 0 } },
  { branch: 'IT', course: 'B.Tech', label: 'Information Technology', approved: 60, supernumeraryApproved: 3, foreignApproved: 3, enrolled: { '2026-27': 50, '2025-26': 58 }, supernumerary: { '2026-27': 1, '2025-26': 1 }, foreign: { '2026-27': 1, '2025-26': 1 } },
  { branch: 'MBA', course: 'MBA', label: 'Master of Business Administration', approved: 60, supernumeraryApproved: 3, foreignApproved: 4, enrolled: { '2026-27': 65, '2025-26': 56 }, supernumerary: { '2026-27': 0, '2025-26': 1 }, foreign: { '2026-27': 2, '2025-26': 1 } },
]

export const BRANCH_LABEL: Record<BranchCode, string> = Object.fromEntries(
  BRANCHES.map((b) => [b.branch, b.label]),
) as Record<BranchCode, string>

export const HISTORICAL_ENROLMENT = [
  { year: '2022-23', approved: 600, enrolled: 548 },
  { year: '2023-24', approved: 600, enrolled: 561 },
  { year: '2024-25', approved: 600, enrolled: 570 },
]

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const MALE = ['Aarav', 'Vihaan', 'Arjun', 'Rohan', 'Kabir', 'Ishaan', 'Aditya', 'Siddharth', 'Pranav', 'Yash', 'Karthik', 'Nikhil', 'Rahul', 'Omkar', 'Harsh', 'Varun', 'Tejas', 'Manish', 'Sahil', 'Devansh', 'Aniket', 'Ritesh', 'Gaurav', 'Abhinav']
const FEMALE = ['Ananya', 'Diya', 'Saanvi', 'Isha', 'Priya', 'Kavya', 'Meera', 'Sneha', 'Aditi', 'Pooja', 'Riya', 'Shruti', 'Tanvi', 'Neha', 'Anjali', 'Swara', 'Gauri', 'Nandini', 'Pallavi', 'Mrunal', 'Lavanya', 'Janhavi']
const LAST = ['Sharma', 'Patil', 'Deshmukh', 'Kulkarni', 'Iyer', 'Reddy', 'Nair', 'Joshi', 'Gupta', 'Verma', 'Pawar', 'Shinde', 'Menon', 'Rao', 'Chavan', 'Bhosale', 'Mishra', 'Das', 'Singh', 'Khan', 'Fernandes', 'Banerjee', 'Pillai', 'Jadhav', 'Agarwal', 'Thakur']

function pickCategory(r: number): Category {
  if (r < 0.4) return 'General'
  if (r < 0.67) return 'OBC-NCL'
  if (r < 0.82) return 'SC'
  if (r < 0.895) return 'ST'
  return 'EWS'
}

/** Indices (within the 2026-27 cohort) that are not yet verified: exactly 43. */
const PENDING_2026 = new Set(Array.from({ length: 43 }, (_, i) => i * 13 + 5))
const FLAGGED_2026 = Array.from({ length: 4 }, (_, i) => i * 13 + 5)
const MISSING_2026 = [4, 5, 6].map((i) => i * 13 + 5)
const PENDING_2025 = new Set([17, 140, 233, 301, 412, 498])

let generatedCache: Student[] | null = null

export function generateBaseStudents(): Student[] {
  if (generatedCache) return generatedCache
  const rand = mulberry32(20260417)
  const usedApaar = new Set<string>()
  const students: Student[] = []

  const makeApaar = () => {
    let id = ''
    do {
      id = String(Math.floor(100000000000 + rand() * 899999999999))
    } while (usedApaar.has(id))
    usedApaar.add(id)
    return id
  }

  for (const year of ACADEMIC_YEARS) {
    const yy = year.slice(2, 4)
    let cohortIndex = 0
    for (const cfg of BRANCHES) {
      const total = cfg.enrolled[year]
      const sup = cfg.supernumerary[year]
      const foreign = cfg.foreign[year]
      for (let n = 0; n < total; n++) {
        const idx = cohortIndex++
        const gender: Gender = rand() < 0.46 ? 'Female' : 'Male'
        const first = gender === 'Female' ? FEMALE[Math.floor(rand() * FEMALE.length)] : MALE[Math.floor(rand() * MALE.length)]
        const last = LAST[Math.floor(rand() * LAST.length)]
        const baseYear = Number(`20${yy}`)
        const birthYear = cfg.course === 'MBA' ? baseYear - 22 - Math.floor(rand() * 2) : baseYear - 18 - Math.floor(rand() * 2)
        const month = 1 + Math.floor(rand() * 12)
        const day = 1 + Math.floor(rand() * 28)
        const id = `SI${yy}${cfg.branch}${String(n + 1).padStart(3, '0')}`
        const isSup = n >= total - sup
        const isForeign = !isSup && n >= total - sup - foreign
        const foreignKind = rand()

        const isCurrent = year === '2026-27'
        const pending = isCurrent ? PENDING_2026.has(idx) : PENDING_2025.has(idx)
        const flagged = isCurrent && FLAGGED_2026.includes(idx)
        const missing = isCurrent && MISSING_2026.includes(idx)
        const verification = flagged ? 'Flagged' : pending ? 'Pending' : 'Verified'
        const admissionDate = `20${yy}-0${7 + Math.floor(rand() * 2)}-${String(1 + Math.floor(rand() * 28)).padStart(2, '0')}`

        let name = `${first} ${last}`
        let email = `${first}.${last}${n + 1}@student.siem.demo`.toLowerCase()
        let finalGender = gender
        if (isCurrent && idx === 0) {
          name = 'Ananya Rao'
          email = 'ananya.rao@student.siem.demo'
          finalGender = 'Female'
        }
        let dobOverride: string | null = null
        if (isCurrent && cfg.branch === 'ECE' && n === 13) {
          name = 'Kavya Menon'
          email = 'kavya.menon14@student.siem.demo'
          finalGender = 'Female'
          dobOverride = '2008-05-19'
        }

        const digilocker =
          verification === 'Verified'
            ? rand() < 0.94
              ? 'Linked'
              : 'Consent Pending'
            : rand() < 0.5
              ? 'Not Linked'
              : 'Consent Pending'

        const audit = [
          { at: `${admissionDate}T10:15:00`, action: 'Admission record created', by: 'Institution Administrator' },
        ]
        if (!missing) audit.push({ at: `${admissionDate}T10:16:00`, action: 'APAAR ID format validated (mock)', by: 'EduVerify System' })
        if (verification === 'Verified') audit.push({ at: `${admissionDate}T16:40:00`, action: 'APAAR association verified (simulated)', by: 'EduVerify System' })
        if (flagged) audit.push({ at: `${admissionDate}T16:42:00`, action: 'Flagged: APAAR linked to another institution', by: 'Duplicate Detection Engine' })
        if (digilocker === 'Linked') audit.push({ at: `${admissionDate}T18:05:00`, action: 'DigiLocker documents linked (demo)', by: 'Student' })

        students.push({
          id,
          name,
          dob: dobOverride ?? `${birthYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
          gender: finalGender,
          email,
          mobile: `9${String(Math.floor(rand() * 1e9)).padStart(9, '0')}`,
          apaarId: missing ? '' : makeApaar(),
          course: cfg.course,
          branch: cfg.branch,
          academicYear: year,
          admissionDate,
          category: pickCategory(rand()),
          seatType: isSup ? 'TFWS' : rand() < 0.1 ? 'Management Quota' : 'Regular',
          supernumerary: isSup,
          nri: isForeign && foreignKind < 0.5,
          oci: isForeign && foreignKind >= 0.5 && foreignKind < 0.8,
          foreignNational: isForeign && foreignKind >= 0.8,
          digilocker,
          verification,
          semester: isCurrent ? 1 : 3,
          cgpa: isCurrent ? null : Math.round((6.2 + rand() * 3.4) * 100) / 100,
          institutionCode: INSTITUTION.code,
          audit,
        })
      }
    }
  }
  generatedCache = students
  return students
}

export const STUDENT_ACCOUNT_ID = 'SI26CSE001'

/** Mock national registry entries held by other (fictional) institutions. */
export interface RegistryRecord {
  apaarId: string
  name: string
  dob: string
  institution: string
  state: string
  course: string
  year: string
}

export function getRegistry(): RegistryRecord[] {
  const base = generateBaseStudents()
  const flagged = base.filter((s) => s.verification === 'Flagged')
  const others = [
    { institution: 'Godavari College of Engineering, Nashik', state: 'Maharashtra' },
    { institution: 'Kaveri Institute of Technology, Mysuru', state: 'Karnataka' },
    { institution: 'Narmada Engineering College, Indore', state: 'Madhya Pradesh' },
    { institution: 'Brahmaputra Institute of Technology, Guwahati', state: 'Assam' },
  ]
  const dup: RegistryRecord[] = flagged.map((s, i) => ({
    apaarId: s.apaarId,
    name: i % 2 === 0 ? s.name : s.name.split(' ').reverse().join(' '),
    dob: i === 1 ? s.dob.replace(/-(\d{2})$/, '-15') : s.dob,
    institution: others[i].institution,
    state: others[i].state,
    course: 'B.Tech',
    year: '2026-27',
  }))
  return [
    ...dup,
    { apaarId: '458127390164', name: 'Rhea Kapoor', dob: '2008-03-11', institution: 'Yamuna Institute of Technology, Delhi', state: 'Delhi', course: 'B.Tech', year: '2026-27' },
    { apaarId: '702394815562', name: 'Farhan Siddiqui', dob: '2007-11-02', institution: 'Ganga College of Management, Lucknow', state: 'Uttar Pradesh', course: 'MBA', year: '2026-27' },
  ]
}

export function seedAlerts(): Alert[] {
  const base = generateBaseStudents()
  const registry = getRegistry()
  const flagged = base.filter((s) => s.verification === 'Flagged')
  const severities = ['Critical', 'High', 'High', 'Medium'] as const
  const dupAlerts: Alert[] = flagged.map((s, i) => {
    const other = registry.find((r) => r.apaarId === s.apaarId)!
    return {
      id: `ALT-2026-${String(101 + i).padStart(4, '0')}`,
      subject: `${s.name} (${s.id})`,
      institution: INSTITUTION.name,
      type: 'Duplicate APAAR',
      severity: severities[i],
      date: `2026-10-${String(12 + i * 3).padStart(2, '0')}`,
      status: i === 2 ? 'Under Review' : 'Open',
      studentId: s.id,
      description: `APAAR ID is associated with an active enrolment at ${other.institution}.`,
      comparison: [
        { source: INSTITUTION.name, fields: { Name: s.name, 'Date of Birth': s.dob, 'APAAR ID': s.apaarId, Course: `${s.course} ${s.branch}`, 'Academic Year': s.academicYear, 'Admission Date': s.admissionDate } },
        { source: other.institution, fields: { Name: other.name, 'Date of Birth': other.dob, 'APAAR ID': other.apaarId, Course: other.course, 'Academic Year': other.year, 'Admission Date': '2026-07-22' } },
      ],
      notes: [],
    }
  })
  const missing = base.filter((s) => s.academicYear === CURRENT_YEAR && !s.apaarId)
  return [
    ...dupAlerts,
    {
      id: 'ALT-2026-0105',
      subject: `${missing.length} student records`,
      institution: INSTITUTION.name,
      type: 'Missing APAAR ID',
      severity: 'Medium',
      date: '2026-10-20',
      status: 'Open',
      description: `Records without an APAAR ID: ${missing.map((m) => m.id).join(', ')}.`,
      comparison: missing.map((m) => ({ source: m.id, fields: { Name: m.name, Branch: m.branch, 'APAAR ID': 'Not provided', DigiLocker: m.digilocker } })),
      notes: [],
    },
    {
      id: 'ALT-2026-0106',
      subject: 'B.Tech CSE – Intake 2026-27',
      institution: INSTITUTION.name,
      type: 'Intake Exceeded',
      severity: 'High',
      date: '2026-10-08',
      status: 'Open',
      description: 'Regular enrolment exceeds approved intake of 120 for B.Tech CSE.',
      comparison: [
        { source: 'Approval (illustrative)', fields: { 'Approved Intake': '120', 'Supernumerary Allowed': '6', 'NRI/OCI/FN Allowed': '6' } },
        { source: 'Institution Submission', fields: { 'Regular Enrolled': '122', Supernumerary: '2', 'NRI/OCI/FN': '1' } },
      ],
      notes: [],
    },
    {
      id: 'ALT-2026-0107',
      subject: 'MBA – Intake 2026-27',
      institution: INSTITUTION.name,
      type: 'Intake Exceeded',
      severity: 'High',
      date: '2026-10-09',
      status: 'Open',
      description: 'Regular enrolment exceeds approved intake of 60 for MBA.',
      comparison: [
        { source: 'Approval (illustrative)', fields: { 'Approved Intake': '60', 'Supernumerary Allowed': '3', 'NRI/OCI/FN Allowed': '4' } },
        { source: 'Institution Submission', fields: { 'Regular Enrolled': '63', Supernumerary: '0', 'NRI/OCI/FN': '2' } },
      ],
      notes: [],
    },
    {
      id: 'ALT-2026-0108',
      subject: 'Kavya Menon (SI26ECE014)',
      institution: INSTITUTION.name,
      type: 'Information Mismatch',
      severity: 'Medium',
      date: '2026-10-18',
      status: 'Under Review',
      description: 'Name on Class 12 marksheet (DigiLocker demo) differs from institution record.',
      comparison: [
        { source: 'Institution Record', fields: { Name: 'Kavya Menon', 'Date of Birth': '2008-05-19', 'Board Roll No.': 'Not captured' } },
        { source: 'DigiLocker Document (demo)', fields: { Name: 'Kavya S. Menon', 'Date of Birth': '2008-05-19', 'Board Roll No.': 'KL12-55**21' } },
      ],
      notes: [],
    },
    {
      id: 'ALT-2026-0109',
      subject: 'Pending DigiLocker consent',
      institution: INSTITUTION.name,
      type: 'DigiLocker Pending',
      severity: 'Low',
      date: '2026-10-24',
      status: 'Open',
      description: 'Students have not yet granted DigiLocker consent for document retrieval (demo).',
      notes: [],
    },
  ]
}

export function seedActivities(): Activity[] {
  return [
    { id: 'a1', at: '2026-10-29T15:42:00', type: 'admission', message: 'Admission submitted for Tejas Pawar (B.Tech ME)' },
    { id: 'a2', at: '2026-10-29T13:10:00', type: 'apaar', message: 'APAAR verification completed for 18 CSE records (simulated)' },
    { id: 'a3', at: '2026-10-28T17:25:00', type: 'duplicate', message: 'Duplicate APAAR flagged for record SI26CSE006' },
    { id: 'a4', at: '2026-10-28T11:02:00', type: 'update', message: 'Contact details updated for Priya Nair (B.Tech IT)' },
    { id: 'a5', at: '2026-10-27T09:48:00', type: 'digilocker', message: 'DigiLocker demo sync completed for 42 students' },
  ]
}

export function seedNotifications(): AppNotification[] {
  return [
    { id: 'n1', at: '2026-10-29T16:00:00', title: 'Critical duplicate alert', body: 'APAAR ID of SI26CSE006 is linked to another institution.', href: '/institution/alerts', read: false },
    { id: 'n2', at: '2026-10-29T10:30:00', title: 'Intake compliance warning', body: 'CSE and MBA regular enrolment exceed approved intake.', href: '/institution/admissions', read: false },
    { id: 'n3', at: '2026-10-28T09:00:00', title: 'Submission window', body: 'Annual enrolment submission closes on 15 Nov 2026 (illustrative).', href: '/institution/reports', read: false },
    { id: 'n4', at: '2026-10-26T12:00:00', title: 'DigiLocker demo sync', body: 'Last simulated sync completed successfully.', href: '/institution/digilocker', read: true },
  ]
}

export const DIGILOCKER_DOCS: DigiDocument[] = [
  { id: 'd1', name: 'APAAR ID Card (simulated availability)', issuer: 'APAAR Registry (simulated)', issuedOn: '2025-04-12', status: 'Simulated', docType: 'Identity' },
  { id: 'd2', name: 'Class 10 Marksheet', issuer: 'Maharashtra State Board (demo)', issuedOn: '2024-05-27', status: 'Verified', docType: 'Marksheet' },
  { id: 'd3', name: 'Class 12 Marksheet', issuer: 'Maharashtra State Board (demo)', issuedOn: '2026-05-21', status: 'Verified', docType: 'Marksheet' },
  { id: 'd4', name: 'School Leaving Certificate', issuer: 'Jnana Prabodhini Junior College (demo)', issuedOn: '2026-06-10', status: 'Pending', docType: 'Certificate' },
]

export const CONSENT_SEED: ConsentEntry[] = [
  { id: 'c1', at: '2026-07-14T11:20:00', party: INSTITUTION.name, purpose: 'Admission verification', scope: 'Class 10, Class 12 marksheets', status: 'Granted' },
  { id: 'c2', at: '2026-08-02T15:05:00', party: 'Verification Officer – Demo Scholarship Cell', purpose: 'Scholarship eligibility check', scope: 'Enrolment status, course', status: 'Expired' },
  { id: 'c3', at: '2026-09-19T10:40:00', party: 'Demo Internship Partner', purpose: 'Internship onboarding', scope: 'Enrolment status', status: 'Revoked' },
]

export const VERIFICATION_LOG_SEED: VerificationLog[] = [
  { id: 'v1', at: '2026-10-27T14:12:00', reference: 'EVR-SI26CSE001', studentName: 'Ananya Rao', result: 'VERIFIED', method: 'QR Code', by: 'Demo Scholarship Cell' },
  { id: 'v2', at: '2026-10-21T10:03:00', reference: 'EVR-SI25ME014', studentName: 'Rohan Patil', result: 'VERIFIED', method: 'Student ID', by: 'Demo Employer Verification' },
]

/* ---------------- AICTE national (illustrative) ---------------- */

export const NATIONAL_TOTALS = {
  institutions: 1250,
  students: 850000,
  verified: 782000,
  pending: 68000,
  institutionsWithAlerts: 42,
}

const STATE_WEIGHTS: { code: string; name: string; w: number; inst: number }[] = [
  { code: 'MH', name: 'Maharashtra', w: 118, inst: 168 },
  { code: 'TN', name: 'Tamil Nadu', w: 112, inst: 162 },
  { code: 'UP', name: 'Uttar Pradesh', w: 92, inst: 136 },
  { code: 'KA', name: 'Karnataka', w: 74, inst: 104 },
  { code: 'AP', name: 'Andhra Pradesh', w: 70, inst: 98 },
  { code: 'TG', name: 'Telangana', w: 64, inst: 88 },
  { code: 'MP', name: 'Madhya Pradesh', w: 44, inst: 66 },
  { code: 'RJ', name: 'Rajasthan', w: 38, inst: 58 },
  { code: 'GJ', name: 'Gujarat', w: 40, inst: 60 },
  { code: 'WB', name: 'West Bengal', w: 30, inst: 44 },
  { code: 'KL', name: 'Kerala', w: 28, inst: 42 },
  { code: 'HR', name: 'Haryana', w: 24, inst: 36 },
  { code: 'PB', name: 'Punjab', w: 22, inst: 34 },
  { code: 'OD', name: 'Odisha', w: 22, inst: 32 },
  { code: 'DL', name: 'Delhi', w: 14, inst: 20 },
  { code: 'BR', name: 'Bihar', w: 12, inst: 18 },
  { code: 'UK', name: 'Uttarakhand', w: 9, inst: 14 },
  { code: 'CG', name: 'Chhattisgarh', w: 9, inst: 14 },
  { code: 'JH', name: 'Jharkhand', w: 7, inst: 11 },
  { code: 'HP', name: 'Himachal Pradesh', w: 6, inst: 9 },
  { code: 'AS', name: 'Assam', w: 6, inst: 9 },
  { code: 'JK', name: 'Jammu & Kashmir', w: 5, inst: 8 },
  { code: 'GA', name: 'Goa', w: 3, inst: 5 },
  { code: 'ML', name: 'Meghalaya', w: 1, inst: 2 },
  { code: 'TR', name: 'Tripura', w: 1, inst: 3 },
  { code: 'MN', name: 'Manipur', w: 1, inst: 2 },
  { code: 'NL', name: 'Nagaland', w: 1, inst: 2 },
  { code: 'AR', name: 'Arunachal Pradesh', w: 1, inst: 2 },
  { code: 'MZ', name: 'Mizoram', w: 1, inst: 1 },
  { code: 'SK', name: 'Sikkim', w: 1, inst: 2 },
  { code: 'LA', name: 'Ladakh', w: 0.4, inst: 1 },
]

export interface StateStat {
  code: string
  name: string
  enrolment: number
  institutions: number
  verifiedPct: number
}

export const STATE_STATS: StateStat[] = (() => {
  const totalW = STATE_WEIGHTS.reduce((s, x) => s + x.w, 0)
  const rows = STATE_WEIGHTS.map((s, i) => ({
    code: s.code,
    name: s.name,
    enrolment: Math.round(((s.w / totalW) * NATIONAL_TOTALS.students) / 10) * 10,
    institutions: s.inst,
    verifiedPct: Math.round((86 + ((i * 7) % 12)) * 10) / 10,
  }))
  const diff = NATIONAL_TOTALS.students - rows.reduce((s, r) => s + r.enrolment, 0)
  rows[0].enrolment += diff
  const instDiff = NATIONAL_TOTALS.institutions - rows.reduce((s, r) => s + r.institutions, 0)
  rows[0].institutions += instDiff
  return rows
})()

export const COURSE_NATIONAL = [
  { course: 'B.E./B.Tech', students: 520000 },
  { course: 'MBA/PGDM', students: 110000 },
  { course: 'Diploma', students: 108000 },
  { course: 'MCA', students: 62000 },
  { course: 'B.Pharm', students: 32000 },
  { course: 'B.Arch', students: 18000 },
]

export const NATIONAL_TREND = [
  { year: '2022-23', admissions: 760000, approved: 842000 },
  { year: '2023-24', admissions: 790000, approved: 861000 },
  { year: '2024-25', admissions: 810000, approved: 874000 },
  { year: '2025-26', admissions: 830000, approved: 889000 },
  { year: '2026-27', admissions: 850000, approved: 902000 },
]

export const APAAR_TREND = [
  { month: 'May', verified: 512000, pending: 338000 },
  { month: 'Jun', verified: 584000, pending: 266000 },
  { month: 'Jul', verified: 641000, pending: 209000 },
  { month: 'Aug', verified: 702000, pending: 148000 },
  { month: 'Sep', verified: 748000, pending: 102000 },
  { month: 'Oct', verified: 782000, pending: 68000 },
]

export const COMPLIANCE = [
  { status: 'Within approved intake', institutions: 1146 },
  { status: 'Minor variance (≤5%)', institutions: 62 },
  { status: 'Exceeds intake (>5%)', institutions: 42 },
]

export const INSTITUTIONS: Institution[] = [
  { code: INSTITUTION.code, aicteId: INSTITUTION.aicteId, name: INSTITUTION.name, city: 'Pune', state: 'Maharashtra', stateCode: 'MH', type: 'Autonomous', approvedIntake: 600, enrolment: 575, apaarVerified: 532, alerts: 4, submissionStatus: 'Submitted', lastSubmission: '2026-10-29' },
  { code: 'GCE-NS-0233', aicteId: '1-41928837', name: 'Godavari College of Engineering', city: 'Nashik', state: 'Maharashtra', stateCode: 'MH', type: 'Private', approvedIntake: 540, enrolment: 528, apaarVerified: 501, alerts: 1, submissionStatus: 'Submitted', lastSubmission: '2026-10-25' },
  { code: 'KIT-MY-0118', aicteId: '1-40211563', name: 'Kaveri Institute of Technology', city: 'Mysuru', state: 'Karnataka', stateCode: 'KA', type: 'Private', approvedIntake: 720, enrolment: 744, apaarVerified: 690, alerts: 3, submissionStatus: 'Submitted', lastSubmission: '2026-10-22' },
  { code: 'NEC-IN-0342', aicteId: '1-43380121', name: 'Narmada Engineering College', city: 'Indore', state: 'Madhya Pradesh', stateCode: 'MP', type: 'Government', approvedIntake: 480, enrolment: 452, apaarVerified: 448, alerts: 1, submissionStatus: 'Pending', lastSubmission: '2026-09-30' },
  { code: 'BIT-GH-0075', aicteId: '1-39977410', name: 'Brahmaputra Institute of Technology', city: 'Guwahati', state: 'Assam', stateCode: 'AS', type: 'Government', approvedIntake: 360, enrolment: 341, apaarVerified: 312, alerts: 2, submissionStatus: 'Submitted', lastSubmission: '2026-10-18' },
  { code: 'YIT-DL-0410', aicteId: '1-44900218', name: 'Yamuna Institute of Technology', city: 'New Delhi', state: 'Delhi', stateCode: 'DL', type: 'Deemed', approvedIntake: 900, enrolment: 896, apaarVerified: 871, alerts: 0, submissionStatus: 'Submitted', lastSubmission: '2026-10-27' },
  { code: 'GCM-LK-0291', aicteId: '1-42011785', name: 'Ganga College of Management', city: 'Lucknow', state: 'Uttar Pradesh', stateCode: 'UP', type: 'Private', approvedIntake: 240, enrolment: 262, apaarVerified: 219, alerts: 2, submissionStatus: 'Overdue', lastSubmission: '2026-08-14' },
  { code: 'VEC-CH-0157', aicteId: '1-40877342', name: 'Vaigai Engineering College', city: 'Madurai', state: 'Tamil Nadu', stateCode: 'TN', type: 'Autonomous', approvedIntake: 840, enrolment: 812, apaarVerified: 798, alerts: 0, submissionStatus: 'Submitted', lastSubmission: '2026-10-21' },
  { code: 'KTU-HY-0388', aicteId: '1-43611290', name: 'Krishna Technological Institute', city: 'Hyderabad', state: 'Telangana', stateCode: 'TG', type: 'Private', approvedIntake: 660, enrolment: 655, apaarVerified: 602, alerts: 1, submissionStatus: 'Pending', lastSubmission: '2026-10-02' },
  { code: 'SPI-JP-0204', aicteId: '1-41455067', name: 'Sambhar Polytechnic Institute', city: 'Jaipur', state: 'Rajasthan', stateCode: 'RJ', type: 'Government', approvedIntake: 300, enrolment: 274, apaarVerified: 270, alerts: 0, submissionStatus: 'Submitted', lastSubmission: '2026-10-11' },
  { code: 'SAB-AH-0263', aicteId: '1-42230981', name: 'Sabarmati Institute of Management', city: 'Ahmedabad', state: 'Gujarat', stateCode: 'GJ', type: 'Private', approvedIntake: 180, enrolment: 191, apaarVerified: 166, alerts: 1, submissionStatus: 'Pending', lastSubmission: '2026-09-26' },
  { code: 'HCE-KO-0199', aicteId: '1-40562279', name: 'Hooghly College of Engineering', city: 'Kolkata', state: 'West Bengal', stateCode: 'WB', type: 'Private', approvedIntake: 480, enrolment: 463, apaarVerified: 441, alerts: 0, submissionStatus: 'Submitted', lastSubmission: '2026-10-19' },
  { code: 'PIT-KC-0321', aicteId: '1-43001876', name: 'Periyar Institute of Technology', city: 'Kochi', state: 'Kerala', stateCode: 'KL', type: 'Autonomous', approvedIntake: 420, enrolment: 409, apaarVerified: 403, alerts: 0, submissionStatus: 'Submitted', lastSubmission: '2026-10-23' },
  { code: 'MCE-BH-0144', aicteId: '1-40344521', name: 'Mahanadi College of Engineering', city: 'Bhubaneswar', state: 'Odisha', stateCode: 'OD', type: 'Private', approvedIntake: 360, enrolment: 372, apaarVerified: 330, alerts: 2, submissionStatus: 'Overdue', lastSubmission: '2026-08-30' },
  { code: 'SUT-CD-0412', aicteId: '1-44511902', name: 'Sutlej University of Technology', city: 'Ludhiana', state: 'Punjab', stateCode: 'PB', type: 'Deemed', approvedIntake: 600, enrolment: 588, apaarVerified: 566, alerts: 0, submissionStatus: 'Submitted', lastSubmission: '2026-10-26' },
]

/* Tile-grid layout of states (schematic, not geographic). [col, row] */
export const STATE_TILES: Record<string, [number, number]> = {
  JK: [2, 0], LA: [3, 0],
  PB: [1, 1], HP: [2, 1], UK: [3, 1],
  HR: [1, 2], DL: [2, 2], UP: [3, 2], BR: [4, 2], SK: [5, 2], AR: [7, 2],
  RJ: [0, 3], MP: [1, 3], CG: [2, 3], JH: [3, 3], WB: [4, 3], AS: [6, 3], NL: [7, 3],
  GJ: [0, 4], MH: [1, 4], TG: [2, 4], OD: [3, 4], ML: [5, 4], MN: [7, 4],
  GA: [0, 5], KA: [1, 5], AP: [2, 5], TR: [5, 5], MZ: [6, 5],
  KL: [1, 6], TN: [2, 6],
}
