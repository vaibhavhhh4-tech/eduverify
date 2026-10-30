import Image from 'next/image'
import {
  Activity,
  BarChart3,
  Building2,
  ChevronRight,
  Database,
  FileCheck2,
  Fingerprint,
  FolderLock,
  ScanSearch,
  ShieldCheck,
  Upload,
  Users,
} from 'lucide-react'

const WORKFLOW = [
  { label: 'Institution', icon: Building2 },
  { label: 'Student Data Upload', icon: Upload },
  { label: 'APAAR Validation', icon: Fingerprint },
  { label: 'DigiLocker Verification', icon: FolderLock },
  { label: 'AICTE Repository', icon: Database },
  { label: 'Analytics & Monitoring', icon: BarChart3 },
  { label: 'Secure Verification', icon: ShieldCheck },
]

export function Workflow() {
  return (
    <section aria-labelledby="workflow-title" className="border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 id="workflow-title" className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          End-to-end verification workflow
        </h2>
        <ol className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex lg:items-stretch lg:gap-0">
          {WORKFLOW.map((step, i) => (
            <li key={step.label} className="flex items-center lg:flex-1">
              <div className="flex w-full flex-col items-center gap-2 rounded-lg border bg-card p-4 text-center shadow-xs">
                <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary">
                  <step.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold text-muted-foreground">Step {i + 1}</span>
                <span className="text-sm font-medium leading-snug">{step.label}</span>
              </div>
              {i < WORKFLOW.length - 1 && <ChevronRight className="mx-1 hidden size-5 shrink-0 text-saffron lg:block" aria-hidden="true" />}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function About() {
  return (
    <section id="about" className="scroll-mt-28 border-b bg-card">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border">
          <Image src="/images/campus.png" alt="Students walking across an engineering college campus" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" priority={false} />
        </div>
        <div className="flex flex-col gap-5">
          <p className="text-sm font-semibold uppercase tracking-wider text-gov-blue">About the Platform</p>
          <h2 className="text-balance text-2xl font-bold tracking-tight text-primary sm:text-3xl">A single, trusted academic record for every student</h2>
          <p className="leading-relaxed text-muted-foreground">
            EduVerify is a prototype that demonstrates how AICTE-approved institutions, students and authorized verification stakeholders could
            work on a shared, APAAR-linked academic record. Institutions submit enrolment data once; the platform validates identities, detects
            duplicate enrolments and monitors admissions against approved intake.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: Users, title: 'Institutions', text: 'Manage enrolment and submissions' },
              { icon: Building2, title: 'AICTE (intended)', text: 'National monitoring and compliance' },
              { icon: ScanSearch, title: 'Verifiers', text: 'Consent-based record checks' },
              { icon: FileCheck2, title: 'Students', text: 'Own and share academic identity' },
            ].map((s) => (
              <li key={s.title} className="flex gap-3 rounded-lg border bg-background p-3">
                <s.icon className="mt-0.5 size-5 shrink-0 text-gov-blue" aria-hidden="true" />
                <span>
                  <span className="block text-sm font-semibold">{s.title}</span>
                  <span className="block text-sm text-muted-foreground">{s.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

const FEATURES = [
  {
    icon: Fingerprint,
    title: 'APAAR-Based Identity',
    text: 'Each student record is anchored to a 12-digit APAAR ID, creating one persistent academic identity across institutions and years.',
    accent: 'bg-gov-blue',
  },
  {
    icon: FolderLock,
    title: 'DigiLocker-Assisted Verification',
    text: 'Consent-driven retrieval of marksheets and certificates to cross-check institution submissions against issued documents.',
    accent: 'bg-saffron',
  },
  {
    icon: ScanSearch,
    title: 'Intelligent Duplicate Detection',
    text: 'Flags APAAR IDs associated with multiple active enrolments, missing identities and mismatched personal details.',
    accent: 'bg-destructive',
  },
  {
    icon: Activity,
    title: 'Real-Time Admission Monitoring',
    text: 'Course-wise comparison of actual enrolment against approved intake, with supernumerary and NRI/OCI/FN seats tracked separately.',
    accent: 'bg-india-green',
  },
]

export function Features() {
  return (
    <section id="features" className="scroll-mt-28 border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-gov-blue">Features</p>
          <h2 className="mt-2 text-balance text-2xl font-bold tracking-tight text-primary sm:text-3xl">Built for transparency and accountability</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <article key={f.title} className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border bg-card p-6 shadow-xs transition-shadow hover:shadow-md">
              <span className={`absolute inset-x-0 top-0 h-1 ${f.accent}`} aria-hidden="true" />
              <span className="flex size-11 items-center justify-center rounded-lg bg-secondary text-primary">
                <f.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  { title: 'Institutions submit student information', text: 'Admission data is entered individually or uploaded in bulk using a standard CSV template with APAAR IDs.' },
  { title: 'The platform validates and verifies records', text: 'APAAR format checks, simulated association lookups, DigiLocker document matching and duplicate detection run on every record.' },
  { title: 'Authorized stakeholders access trusted information', text: 'Regulators monitor compliance while verification officers confirm records through consented, QR-referenced checks.' },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-28 border-b bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-gov-blue">How It Works</p>
          <h2 className="mt-2 text-balance text-2xl font-bold tracking-tight text-primary sm:text-3xl">Three steps to a verified academic record</h2>
        </div>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex flex-col gap-3 rounded-xl border bg-background p-6">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
