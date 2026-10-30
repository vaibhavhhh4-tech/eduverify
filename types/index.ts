export type Role = 'institution' | 'aicte' | 'officer' | 'student'

export type Gender = 'Male' | 'Female' | 'Other'
export type Category = 'General' | 'OBC-NCL' | 'SC' | 'ST' | 'EWS'
export type SeatType = 'Regular' | 'Management Quota' | 'TFWS'
export type DigiLockerStatus = 'Linked' | 'Not Linked' | 'Consent Pending'
export type VerificationStatus = 'Verified' | 'Pending' | 'Flagged'
export type CourseCode = 'B.Tech' | 'MBA'
export type BranchCode = 'CSE' | 'ECE' | 'ME' | 'EE' | 'CE' | 'IT' | 'MBA'

export interface AuditEntry {
  at: string
  action: string
  by: string
}

export interface Student {
  id: string
  name: string
  dob: string
  gender: Gender
  email: string
  mobile: string
  apaarId: string
  course: CourseCode
  branch: BranchCode
  academicYear: string
  admissionDate: string
  category: Category
  seatType: SeatType
  supernumerary: boolean
  nri: boolean
  oci: boolean
  foreignNational: boolean
  digilocker: DigiLockerStatus
  verification: VerificationStatus
  semester: number
  cgpa: number | null
  institutionCode: string
  archived?: boolean
  draft?: boolean
  audit: AuditEntry[]
}

export interface Institution {
  code: string
  aicteId: string
  name: string
  city: string
  state: string
  stateCode: string
  type: 'Private' | 'Government' | 'Deemed' | 'Autonomous'
  approvedIntake: number
  enrolment: number
  apaarVerified: number
  alerts: number
  submissionStatus: 'Submitted' | 'Pending' | 'Overdue'
  lastSubmission: string
}

export type AlertType =
  | 'Duplicate APAAR'
  | 'Missing APAAR ID'
  | 'Intake Exceeded'
  | 'Information Mismatch'
  | 'DigiLocker Pending'

export type AlertSeverity = 'Critical' | 'High' | 'Medium' | 'Low'
export type AlertStatus = 'Open' | 'Under Review' | 'Reviewed' | 'Resolved'

export interface ComparedRecord {
  source: string
  fields: Record<string, string>
}

export interface Alert {
  id: string
  subject: string
  institution: string
  type: AlertType
  severity: AlertSeverity
  date: string
  status: AlertStatus
  description: string
  studentId?: string
  comparison?: ComparedRecord[]
  notes?: string[]
}

export interface Activity {
  id: string
  at: string
  type: 'admission' | 'apaar' | 'duplicate' | 'update' | 'digilocker' | 'upload' | 'alert'
  message: string
}

export interface AppNotification {
  id: string
  at: string
  title: string
  body: string
  href: string
  read: boolean
}

export interface DigiDocument {
  id: string
  name: string
  issuer: string
  issuedOn: string
  status: 'Verified' | 'Simulated' | 'Pending'
  docType: string
}

export interface DigiLockerState {
  connected: boolean
  lastSync: string | null
  documents: DigiDocument[]
}

export interface VerificationLog {
  id: string
  at: string
  reference: string
  studentName: string
  result: 'VERIFIED' | 'NOT VERIFIED' | 'PENDING'
  method: 'Student ID' | 'QR Code'
  by: string
}

export interface ConsentEntry {
  id: string
  at: string
  party: string
  purpose: string
  scope: string
  status: 'Granted' | 'Revoked' | 'Expired'
}

export interface Session {
  role: Role
  email: string
  name: string
  designation: string
  loggedInAt: string
}

export interface Profile {
  name: string
  designation: string
  phone: string
  email: string
  notifyEmail: boolean
  notifyAlerts: boolean
  notifyWeekly: boolean
}
