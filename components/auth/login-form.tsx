'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, ArrowLeft, ChevronDown, Eye, EyeOff, KeyRound, Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { FormField } from '@/components/forms/form-field'
import { Button, buttonVariants } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { DEMO_ACCOUNTS, ROLE_HOME, ROLE_LABEL, mockLogin, useSession } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { loginSchema, type LoginValues } from '@/lib/validation'
import type { Role } from '@/types'

export function LoginForm() {
  const router = useRouter()
  const session = useSession()
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [forgotOpen, setForgotOpen] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '', role: '' as unknown as Role },
  })

  async function onSubmit(values: LoginValues) {
    setFormError(null)
    const res = await mockLogin(values.identifier, values.password, values.role)
    if (!res.ok) {
      setError(res.field, { message: res.message })
      setFormError(res.message)
      return
    }
    toast.success(`Signed in as ${ROLE_LABEL[res.session.role]}`, { description: `Welcome, ${res.session.name}.` })
    router.push(ROLE_HOME[res.session.role])
  }

  function fillDemo(role: Role) {
    const acc = DEMO_ACCOUNTS.find((a) => a.role === role)!
    setValue('identifier', acc.email, { shouldValidate: true })
    setValue('password', acc.password, { shouldValidate: true })
    setValue('role', role, { shouldValidate: true })
    setFormError(null)
  }

  return (
    <div className="w-full max-w-md">
      {session && (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-lg border bg-secondary p-3 text-sm">
          <span>
            Signed in as <strong>{session.name}</strong>
          </span>
          <Link href={ROLE_HOME[session.role]} className={buttonVariants({ size: 'sm' })}>
            Continue
          </Link>
        </div>
      )}
      <div className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight">Login to Portal</h2>
          <p className="text-sm text-muted-foreground">Use your registered email or institutional ID.</p>
        </div>

        {formError && (
          <div role="alert" className="mb-5 flex gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <FormField id="identifier" label="Email / Institutional ID" required error={errors.identifier?.message} hint="e.g. institution@edverify.demo or 1-44120593">
            <Input
              id="identifier"
              autoComplete="username"
              className="h-10"
              aria-invalid={!!errors.identifier}
              aria-describedby={errors.identifier ? 'identifier-error' : 'identifier-hint'}
              {...register('identifier')}
            />
          </FormField>

          <FormField id="password" label="Password" required error={errors.password?.message}>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="h-10 pr-10"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </FormField>

          <FormField id="role" label="Role" required error={errors.role?.message}>
            <NativeSelect id="role" className="w-full [&_select]:h-10" aria-invalid={!!errors.role} {...register('role')}>
              <NativeSelectOption value="">Select your role</NativeSelectOption>
              {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
                <NativeSelectOption key={r} value={r}>
                  {ROLE_LABEL[r]}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </FormField>

          <div className="flex justify-end">
            <button type="button" onClick={() => setForgotOpen(true)} className="text-sm font-medium text-gov-blue hover:underline">
              Forgot Password?
            </button>
          </div>

          <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <LogIn data-icon="inline-start" />}
            {isSubmitting ? 'Verifying credentials…' : 'Login'}
          </Button>
          <Link href="/" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'w-full')}>
            <ArrowLeft data-icon="inline-start" />
            Back to Home
          </Link>
        </form>

        <Collapsible open={demoOpen} onOpenChange={setDemoOpen} className="mt-6 rounded-lg border bg-muted/50">
          <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 px-4 py-3 text-sm font-medium">
            <span className="flex items-center gap-2">
              <KeyRound className="size-4 text-saffron" aria-hidden="true" />
              Demo Access
            </span>
            <ChevronDown className={cn('size-4 transition-transform', demoOpen && 'rotate-180')} aria-hidden="true" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-col gap-2 px-4 pb-4">
              <p className="text-xs text-muted-foreground">Password for all accounts: <code className="font-mono font-semibold text-foreground">Demo@123</code>. Click a row to autofill.</p>
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.role}
                  type="button"
                  onClick={() => fillDemo(a.role)}
                  className="flex flex-col items-start rounded-md border bg-card px-3 py-2 text-left transition-colors hover:border-gov-blue/50 hover:bg-secondary"
                >
                  <span className="text-xs font-semibold text-primary">{ROLE_LABEL[a.role]}</span>
                  <span className="font-mono text-xs text-muted-foreground">{a.email}</span>
                </button>
              ))}
              <p className="pt-1 text-[11px] text-muted-foreground">
                Mock authentication is simulated in the browser for this prototype and is not production-grade security.
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset password</DialogTitle>
            <DialogDescription>
              In a production system, a reset link would be sent to your registered institutional email after identity checks. In this demo, all
              accounts use the password <code className="font-mono font-semibold">Demo@123</code>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setForgotOpen(false)
                setDemoOpen(true)
              }}
            >
              Show demo accounts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
