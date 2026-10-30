import type { BranchCode, Category, CourseCode, Gender, SeatType, Student } from '@/types'
import { BRANCHES, INSTITUTION } from '@/lib/mock-data'
import { isApaarFormatValid, normaliseApaar } from '@/lib/validation'

export const CSV_COLUMNS = [
  'enrollmentNumber',
  'name',
  'dob',
  'gender',
  'email',
  'mobile',
  'apaarId',
  'institution',
  'course',
  'branch',
  'academicYear',
  'admissionDate',
  'category',
  'seatType',
] as const

export const SAMPLE_CSV = `${CSV_COLUMNS.join(',')}
SI26CSE901,Mehul Kapoor,2008-04-16,Male,mehul.kapoor901@student.siem.demo,9876501234,581203946712,Sahyadri Institute of Engineering & Management,B.Tech,CSE,2026-27,2026-08-04,General,Regular
SI26ECE901,Sana Qureshi,2008-11-02,Female,sana.qureshi901@student.siem.demo,9876505678,not-an-apaar,Sahyadri Institute of Engineering & Management,B.Tech,ECE,2026-27,2026-08-05,OBC-NCL,Regular
SI26CSE001,Duplicate Enrollee,2008-01-12,Male,dup@student.siem.demo,9876509999,458127390164,Sahyadri Institute of Engineering & Management,B.Tech,CSE,2026-27,2026-08-06,General,Regular
,Missing Name Fields,2008-02-02,Female,missing@student.siem.demo,9876501111,702394815562,Sahyadri Institute of Engineering & Management,B.Tech,IT,2026-27,2026-08-07,EWS,Regular
`

function parseLine(line: string): string[] {
  const out: string[] = []
  let cur = ''
  let quoted = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"'
        i++
      } else if (ch === '"') quoted = false
      else cur += ch
    } else if (ch === '"') quoted = true
    else if (ch === ',') {
      out.push(cur.trim())
      cur = ''
    } else cur += ch
  }
  out.push(cur.trim())
  return out
}

export interface CsvIssue {
  field: string
  message: string
}

export interface CsvRowPreview {
  rowNumber: number
  values: Record<string, string>
  valid: boolean
  issues: CsvIssue[]
  student?: Student
}

const GENDERS: Gender[] = ['Male', 'Female', 'Other']
const COURSES: CourseCode[] = ['B.Tech', 'MBA']
const BRANCHES_OK: BranchCode[] = ['CSE', 'ECE', 'ME', 'EE', 'CE', 'IT', 'MBA']
const CATEGORIES: Category[] = ['General', 'OBC-NCL', 'SC', 'ST', 'EWS']
const SEATS: SeatType[] = ['Regular', 'Management Quota', 'TFWS']

export function parseStudentCsv(text: string, existing: Student[]): { rows: CsvRowPreview[]; headerOk: boolean } {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter((l) => l.trim().length)
  if (!lines.length) return { rows: [], headerOk: false }
  const header = parseLine(lines[0]).map((h) => h.replace(/\s+/g, ''))
  const headerOk = CSV_COLUMNS.every((c) => header.includes(c))
  const mapIdx = Object.fromEntries(header.map((h, i) => [h, i])) as Record<string, number>
  const seenEnrol = new Map<string, number>()
  const seenApaar = new Map<string, number>()
  const existingIds = new Set(existing.map((s) => s.id.toUpperCase()))
  const existingApaar = new Map(existing.filter((s) => s.apaarId).map((s) => [s.apaarId, s.id]))

  const rows: CsvRowPreview[] = lines.slice(1).map((line, idx) => {
    const cols = parseLine(line)
    const values: Record<string, string> = {}
    for (const c of CSV_COLUMNS) values[c] = cols[mapIdx[c]] ?? ''
    const issues: CsvIssue[] = []
    const rowNumber = idx + 2
    const id = values.enrollmentNumber.trim().toUpperCase()
    const apaar = normaliseApaar(values.apaarId)
    if (!id) issues.push({ field: 'enrollmentNumber', message: 'Enrollment number is required.' })
    else if (!/^[A-Z0-9]{6,14}$/.test(id)) issues.push({ field: 'enrollmentNumber', message: 'Enrollment number must be 6–14 letters/digits.' })
    if (id && seenEnrol.has(id)) issues.push({ field: 'enrollmentNumber', message: `Duplicate enrollment number in file (also row ${seenEnrol.get(id)}).` })
    if (id && existingIds.has(id)) issues.push({ field: 'enrollmentNumber', message: 'Enrollment number already exists in the mock database.' })
    if (id) seenEnrol.set(id, rowNumber)
    if (!values.name.trim()) issues.push({ field: 'name', message: 'Student name is required.' })
    if (!values.dob) issues.push({ field: 'dob', message: 'Date of birth is required.' })
    if (!GENDERS.includes(values.gender as Gender)) issues.push({ field: 'gender', message: 'Gender must be Male, Female or Other.' })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) issues.push({ field: 'email', message: 'Valid email is required.' })
    if (!/^[6-9]\d{9}$/.test(values.mobile)) issues.push({ field: 'mobile', message: 'Valid 10-digit mobile is required.' })
    if (!apaar) issues.push({ field: 'apaarId', message: 'APAAR ID is required.' })
    else if (!isApaarFormatValid(apaar)) issues.push({ field: 'apaarId', message: 'APAAR ID failed mock format check (12 digits). This is not official verification.' })
    if (apaar && isApaarFormatValid(apaar) && seenApaar.has(apaar))
      issues.push({ field: 'apaarId', message: `Possible duplicate APAAR ID in file (also row ${seenApaar.get(apaar)}).` })
    if (apaar && existingApaar.has(apaar))
      issues.push({ field: 'apaarId', message: `Possible duplicate APAAR ID already held by ${existingApaar.get(apaar)}.` })
    if (apaar && isApaarFormatValid(apaar)) seenApaar.set(apaar, rowNumber)
    if (!COURSES.includes(values.course as CourseCode)) issues.push({ field: 'course', message: 'Course must be B.Tech or MBA.' })
    if (!BRANCHES_OK.includes(values.branch as BranchCode)) issues.push({ field: 'branch', message: 'Unknown branch code.' })
    if (!values.academicYear) issues.push({ field: 'academicYear', message: 'Academic year is required.' })
    if (!values.admissionDate) issues.push({ field: 'admissionDate', message: 'Admission date is required.' })
    if (!CATEGORIES.includes(values.category as Category)) issues.push({ field: 'category', message: 'Unknown category.' })
    if (values.seatType && !SEATS.includes(values.seatType as SeatType)) issues.push({ field: 'seatType', message: 'Unknown seat type.' })
    const inst = values.institution.trim()
    if (inst && inst !== INSTITUTION.name && inst !== INSTITUTION.code)
      issues.push({ field: 'institution', message: `This demo import is limited to ${INSTITUTION.name}.` })

    const valid = issues.length === 0
    const branchCfg = BRANCHES.find((b) => b.branch === values.branch)
    const student: Student | undefined = valid
      ? {
          id,
          name: values.name.trim(),
          dob: values.dob,
          gender: values.gender as Gender,
          email: values.email.trim().toLowerCase(),
          mobile: values.mobile.trim(),
          apaarId: apaar,
          course: values.course as CourseCode,
          branch: (values.branch as BranchCode) || (branchCfg?.branch ?? 'CSE'),
          academicYear: values.academicYear,
          admissionDate: values.admissionDate,
          category: values.category as Category,
          seatType: (values.seatType as SeatType) || 'Regular',
          supernumerary: values.seatType === 'TFWS',
          nri: false,
          oci: false,
          foreignNational: false,
          digilocker: 'Not Linked',
          verification: existingApaar.has(apaar) ? 'Flagged' : 'Pending',
          semester: 1,
          cgpa: null,
          institutionCode: INSTITUTION.code,
          audit: [
            { at: new Date().toISOString(), action: 'Record imported from CSV (demo)', by: 'Institution Administrator' },
            { at: new Date().toISOString(), action: 'APAAR ID format validated (mock)', by: 'EduVerify System' },
          ],
        }
      : undefined
    return { rowNumber, values, valid, issues, student }
  })
  return { rows, headerOk }
}
