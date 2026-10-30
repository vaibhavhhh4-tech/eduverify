import { Activity, Fingerprint, LockKeyhole } from 'lucide-react'
import { Logo } from '@/components/brand/logo'

const HIGHLIGHTS = [
  { icon: LockKeyhole, title: 'Secure student records', text: 'Role-based access with full audit history for every change.' },
  { icon: Fingerprint, title: 'APAAR-based identity verification', text: 'One persistent academic identity across institutions.' },
  { icon: Activity, title: 'Real-time enrolment monitoring', text: 'Intake compliance tracked course-wise as admissions happen.' },
]

export function LoginIntro() {
  return (
    <section aria-labelledby="welcome-title" className="flex flex-col justify-between gap-10 bg-primary px-6 py-10 text-primary-foreground sm:px-10 lg:py-14">
      <Logo inverted />
      <div className="flex max-w-lg flex-col gap-5">
        <h1 id="welcome-title" className="text-balance text-3xl font-bold tracking-tight">
          Welcome to EduVerify
        </h1>
        <p className="text-pretty leading-relaxed text-white/80">
          An integrated academic identity and student verification platform designed to improve transparency, accuracy and accountability across
          AICTE-approved institutions.
        </p>
        <ul className="mt-2 flex flex-col gap-3">
          {HIGHLIGHTS.map((h) => (
            <li key={h.title} className="flex gap-3 rounded-lg bg-white/[0.07] p-4 ring-1 ring-white/10">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white/10">
                <h.icon className="size-4.5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-semibold">{h.title}</span>
                <span className="block text-sm text-white/70">{h.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className="max-w-lg text-xs leading-relaxed text-white/60">
        Prototype for Smart India Hackathon. Not affiliated with or endorsed by AICTE, APAAR or DigiLocker. All data shown is fictional.
      </p>
    </section>
  )
}
