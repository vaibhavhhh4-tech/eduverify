'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2, LogOut, Menu } from 'lucide-react'
import { toast } from 'sonner'
import { BrandMark, DemoBadge, TricolorRule } from '@/components/brand/logo'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { ROLE_HOME, ROLE_LABEL, logout, useSession } from '@/lib/auth'
import { useAppState } from '@/lib/storage'
import { cn } from '@/lib/utils'
import type { Role } from '@/types'
import { NAV, isActive, titleFor } from './nav-config'
import { Topbar } from './topbar'

function SidebarNav({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { alerts } = useAppState()
  const openAlerts = alerts.filter((a) => a.status !== 'Resolved').length

  return (
    <div className="flex h-full flex-col">
      <Link href={ROLE_HOME[role]} onClick={onNavigate} className="flex items-center gap-3 px-5 py-5">
        <BrandMark className="bg-white text-primary" />
        <span className="flex flex-col leading-tight">
          <span className="text-base font-bold text-white">EduVerify</span>
          <span className="text-[11px] text-white/60">{ROLE_LABEL[role]}</span>
        </span>
      </Link>
      <TricolorRule className="h-0.5 opacity-80" />
      <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-0.5">
          {NAV[role].map((item) => {
            const active = isActive(item, pathname)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white',
                    active && 'bg-white text-primary hover:bg-white hover:text-primary',
                  )}
                >
                  <item.icon className="size-4 shrink-0" aria-hidden="true" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge === 'alerts' && openAlerts > 0 && (
                    <span className={cn('rounded-full px-1.5 text-[11px] font-semibold', active ? 'bg-destructive text-white' : 'bg-saffron text-primary')}>
                      {openAlerts}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="flex flex-col gap-3 border-t border-white/10 p-4">
        <DemoBadge label="PROTOTYPE · MOCK DATA" className="w-fit border-saffron/50 bg-saffron/15 text-saffron" />
        <button
          type="button"
          onClick={() => {
            logout()
            toast.success('You have been logged out.')
            router.push('/login')
          }}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Logout
        </button>
      </div>
    </div>
  )
}

export function AppShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const session = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (session === null) router.replace('/login')
    else if (session && session.role !== role) router.replace(ROLE_HOME[session.role])
  }, [session, role, router])

  if (!session || session.role !== role) {
    return (
      <div className="flex min-h-dvh items-center justify-center gap-2 text-sm text-muted-foreground" role="status">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        {session === null ? 'Redirecting to login…' : 'Loading portal…'}
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh">
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-card focus:px-3 focus:py-2">
        Skip to content
      </a>
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 bg-sidebar lg:block">
        <SidebarNav role={role} />
      </aside>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 border-0 bg-sidebar p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarNav role={role} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          role={role}
          session={session}
          title={titleFor(role, pathname)}
          menuButton={
            <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open navigation" onClick={() => setMobileOpen(true)}>
              <Menu />
            </Button>
          }
        />
        <main id="content" className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">{children}</div>
        </main>
        <footer className="border-t bg-card px-4 py-3 text-center text-[11px] text-muted-foreground sm:px-6">
          EduVerify prototype · Illustrative mock data · Not affiliated with or endorsed by AICTE, APAAR or DigiLocker
        </footer>
      </div>
    </div>
  )
}
