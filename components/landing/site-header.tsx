'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Landmark, LogIn, Menu } from 'lucide-react'
import { Logo, TricolorRule } from '@/components/brand/logo'
import { buttonVariants } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About the Platform' },
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#contact', label: 'Contact' },
]

export function GovStrip() {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 text-xs sm:px-6">
        <span className="flex items-center gap-2">
          <Landmark className="size-3.5" aria-hidden="true" />
          <span>Academic governance prototype · Intended regulatory stakeholder: AICTE</span>
        </span>
        <a href="#main" className="hidden underline-offset-2 hover:underline sm:inline">
          Skip to main content
        </a>
      </div>
      <TricolorRule />
    </div>
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
      <GovStrip />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-primary">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className={cn(buttonVariants(), 'hidden sm:inline-flex')}>
            <LogIn data-icon="inline-start" />
            Login
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'lg:hidden')} aria-label="Open menu">
              <Menu />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
                {NAV.map((n) => (
                  <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted">
                    {n.label}
                  </a>
                ))}
                <Link href="/login" className={cn(buttonVariants(), 'mt-3')}>
                  <LogIn data-icon="inline-start" />
                  Login to Portal
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
