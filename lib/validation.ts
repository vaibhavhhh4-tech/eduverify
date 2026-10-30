import { z } from 'zod'

/** Mock format check only: 12 digits. This does NOT prove an APAAR ID is genuine. */
export const APAAR_REGEX = /^\d{12}$/

export function normaliseApaar(value: string) {
  return value.replace(/[\s-]/g, '')
}

export function isApaarFormatValid(value: string) {
  return APAAR_REGEX.test(normaliseApaar(value))
}

export function maskApaar(value: string) {
  if (!value) return 'Not provided'
  const v = normaliseApaar(value)
  return `XXXX XXXX ${v.slice(-4)}`
}

export function formatApaar(value: string) {
  const v = normaliseApaar(value)
  return v.replace(/(\d{4})(?=\d)/g, '$1 ')
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INSTITUTION_ID = /^1-\d{8}$/

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, 'Email or Institutional ID is required.')
    .refine((v) => (v.includes('@') ? EMAIL.test(v) : INSTITUTION_ID.test(v)), {
      message: 'Enter a valid email address or an institutional ID in the format 1-XXXXXXXX.',
    }),
  password: z.string().min(1, 'Password is required.'),
  role: z.enum(['institution', 'aicte', 'officer', 'student'], { message: 'Please select your role.' }),
})

export type LoginValues = z.infer<typeof loginSchema>

export const studentSchema = z.object({
  name: z.string().trim().min(3, 'Enter the full name (min. 3 characters).').max(80).regex(/^[A-Za-z .'-]+$/, 'Name may contain letters, spaces, dots and hyphens only.'),
  dob: z
    .string()
    .min(1, 'Date of birth is required.')
    .refine((v) => {
      const d = new Date(v)
      const age = (Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000)
      return age >= 15 && age <= 45
    }, 'Student age must be between 15 and 45 years.'),
  gender: z.enum(['Male', 'Female', 'Other'], { message: 'Select gender.' }),
  email: z.string().trim().regex(EMAIL, 'Enter a valid email address.'),
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number.'),
  apaarId: z.string().trim().refine((v) => isApaarFormatValid(v), 'APAAR ID must be exactly 12 digits (mock format check).'),
  id: z.string().trim().regex(/^[A-Z0-9]{6,14}$/, 'Student ID must be 6–14 uppercase letters/digits.'),
  digilocker: z.enum(['Linked', 'Not Linked', 'Consent Pending']),
  course: z.enum(['B.Tech', 'MBA'], { message: 'Select course.' }),
  branch: z.enum(['CSE', 'ECE', 'ME', 'EE', 'CE', 'IT', 'MBA'], { message: 'Select branch.' }),
  academicYear: z.string().min(1, 'Select academic year.'),
  admissionDate: z.string().min(1, 'Admission date is required.'),
  category: z.enum(['General', 'OBC-NCL', 'SC', 'ST', 'EWS'], { message: 'Select seat category.' }),
  approvedIntake: z.string(),
  seatType: z.enum(['Regular', 'Management Quota', 'TFWS']),
  supernumerary: z.boolean(),
  nri: z.boolean(),
  oci: z.boolean(),
  foreignNational: z.boolean(),
})
  .refine((v) => (v.course === 'MBA' ? v.branch === 'MBA' : v.branch !== 'MBA'), {
    path: ['branch'],
    message: 'Branch does not match the selected course.',
  })
  .refine((v) => [v.nri, v.oci, v.foreignNational].filter(Boolean).length <= 1, {
    path: ['nri'],
    message: 'Select only one of NRI, OCI or Foreign National.',
  })

export type StudentFormValues = z.infer<typeof studentSchema>
