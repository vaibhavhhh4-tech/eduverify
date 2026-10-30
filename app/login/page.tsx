import type { Metadata } from 'next'
import { LoginIntro } from '@/components/auth/login-intro'
import { LoginForm } from '@/components/auth/login-form'
import { GovStrip } from '@/components/landing/site-header'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to the EduVerify academic identity and verification portal (prototype).',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <GovStrip />
      <main id="main" className="grid flex-1 lg:grid-cols-2">
        <LoginIntro />
        <div className="flex items-center justify-center bg-background px-4 py-10 sm:px-8">
          <LoginForm />
        </div>
      </main>
    </div>
  )
}
