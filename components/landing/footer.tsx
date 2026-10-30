'use client'

import { useState } from 'react'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Logo, TricolorRule } from '@/components/brand/logo'
import { FormField } from '@/components/forms/form-field'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function Contact() {
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (values.name.trim().length < 2) next.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Please enter a valid email address.'
    if (values.message.trim().length < 10) next.message = 'Message should be at least 10 characters.'
    setErrors(next)
    if (Object.keys(next).length) return
    setSending(true)
    await new Promise((r) => setTimeout(r, 700))
    setSending(false)
    setValues({ name: '', email: '', message: '' })
    toast.success('Query recorded (demo)', { description: 'In this prototype, messages are not sent to any server.' })
  }

  return (
    <section id="contact" className="scroll-mt-28 bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-gov-blue">Contact</p>
          <h2 className="text-balance text-2xl font-bold tracking-tight text-primary sm:text-3xl">Help desk for institutions and verifiers</h2>
          <p className="text-muted-foreground">Reach the EduVerify project team for onboarding questions, demo access or feedback on the prototype.</p>
          <ul className="mt-2 flex flex-col gap-3 text-sm">
            <li className="flex items-center gap-3"><Mail className="size-4 text-gov-blue" aria-hidden="true" /> helpdesk@eduverify.demo</li>
            <li className="flex items-center gap-3"><Phone className="size-4 text-gov-blue" aria-hidden="true" /> 1800-000-0000 (demo, Mon–Fri 9:30–17:30)</li>
            <li className="flex items-center gap-3"><MapPin className="size-4 text-gov-blue" aria-hidden="true" /> Smart India Hackathon Project Team, New Delhi</li>
          </ul>
        </div>
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-xs">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="c-name" label="Name" required error={errors.name}>
              <Input id="c-name" className="h-10" value={values.name} aria-invalid={!!errors.name} onChange={(e) => setValues({ ...values, name: e.target.value })} />
            </FormField>
            <FormField id="c-email" label="Email" required error={errors.email}>
              <Input id="c-email" type="email" className="h-10" value={values.email} aria-invalid={!!errors.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
            </FormField>
          </div>
          <FormField id="c-msg" label="Message" required error={errors.message}>
            <Textarea id="c-msg" rows={4} value={values.message} aria-invalid={!!errors.message} onChange={(e) => setValues({ ...values, message: e.target.value })} />
          </FormField>
          <Button type="submit" size="lg" className="w-fit" disabled={sending}>
            <Send data-icon="inline-start" />
            {sending ? 'Sending…' : 'Submit Query'}
          </Button>
        </form>
      </div>
    </section>
  )
}

const POLICIES = {
  privacy: {
    title: 'Privacy Policy (Prototype)',
    body: [
      'This prototype stores demo data only in your browser’s localStorage. No information is transmitted to any server.',
      'All student, institution and national figures are fictional and illustrative.',
      'A production deployment would require consent-based processing aligned with applicable Indian data-protection law, purpose limitation and audited access controls.',
    ],
  },
  terms: {
    title: 'Terms of Use (Prototype)',
    body: [
      'EduVerify is a Smart India Hackathon prototype and is not an official service of AICTE, the Ministry of Education, APAAR or DigiLocker.',
      'Integrations shown in the interface are simulated. Verification outcomes in this demo carry no legal validity.',
      'Do not enter real personal information into this demo.',
    ],
  },
}

export function SiteFooter() {
  const [policy, setPolicy] = useState<keyof typeof POLICIES | null>(null)
  const active = policy ? POLICIES[policy] : null
  return (
    <footer className="bg-primary text-primary-foreground">
      <TricolorRule />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <Logo inverted />
          <p className="max-w-sm text-sm text-white/75">One Student. One Academic Identity. Trusted Everywhere.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-2 text-sm">
          <span className="font-semibold">Platform</span>
          <a href="#about" className="text-white/75 hover:text-white">About EduVerify</a>
          <a href="#features" className="text-white/75 hover:text-white">Features</a>
          <a href="#contact" className="text-white/75 hover:text-white">Contact</a>
        </nav>
        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold">Policies</span>
          <button type="button" onClick={() => setPolicy('privacy')} className="w-fit text-left text-white/75 hover:text-white">Privacy Policy</button>
          <button type="button" onClick={() => setPolicy('terms')} className="w-fit text-left text-white/75 hover:text-white">Terms of Use</button>
        </div>
      </div>
      <div className="border-t border-white/15">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs leading-relaxed text-white/70 sm:px-6">
          <strong className="text-white">Prototype disclaimer:</strong> EduVerify is a Smart India Hackathon prototype. It is not affiliated with,
          owned or endorsed by AICTE, the Government of India, APAAR or DigiLocker. AICTE is depicted as the intended regulatory stakeholder only.
          All data is fictional and all integrations are simulated.
        </p>
      </div>
      <Dialog open={!!policy} onOpenChange={(o) => !o && setPolicy(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{active?.title}</DialogTitle>
            <DialogDescription>Applies to this demonstration build only.</DialogDescription>
          </DialogHeader>
          <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-muted-foreground">
            {active?.body.map((b) => <li key={b}>{b}</li>)}
          </ul>
          <DialogFooter>
            <Button onClick={() => setPolicy(null)}>I understand</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </footer>
  )
}
