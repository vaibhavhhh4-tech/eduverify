'use client'

import { useRouter } from 'next/navigation'
import { Bell, CheckCheck, ChevronDown, LogOut, Settings, Trash2, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { ROLE_HOME, ROLE_LABEL, logout } from '@/lib/auth'
import { ACADEMIC_YEARS } from '@/lib/mock-data'
import { store, useAppState } from '@/lib/storage'
import { cn, formatDateTime } from '@/lib/utils'
import type { Role, Session } from '@/types'

function initials(name: string) {
  return name
    .replace(/^(Dr|Prof)\.\s*/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

export function Topbar({ role, session, title, menuButton }: { role: Role; session: Session; title: string; menuButton: React.ReactNode }) {
  const router = useRouter()
  const { notifications, academicYear, profiles } = useAppState()
  const unread = notifications.filter((n) => !n.read).length
  const displayName = profiles[role]?.name ?? session.name
  const showYear = role === 'institution' || role === 'aicte'
  const notificationsForRole = role === 'institution' ? notifications : notifications.map((n) => ({ ...n, href: n.href.replace('/institution', ROLE_HOME[role]) }))

  return (
    <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        {menuButton}
        <h1 className="min-w-0 flex-1 truncate text-lg font-semibold tracking-tight text-primary">{title}</h1>

        {showYear && (
          <div className="hidden items-center gap-2 sm:flex">
            <label htmlFor="academic-year" className="text-xs font-medium text-muted-foreground">
              Academic Year
            </label>
            <NativeSelect
              id="academic-year"
              size="sm"
              value={academicYear}
              onChange={(e) => {
                store.setAcademicYear(e.target.value)
                toast.info(`Academic year set to ${e.target.value}`)
              }}
            >
              {ACADEMIC_YEARS.map((y) => (
                <NativeSelectOption key={y} value={y}>
                  {y}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger
            className="relative flex size-9 items-center justify-center rounded-lg border bg-card text-foreground hover:bg-muted"
            aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
          >
            <Bell className="size-4" />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex size-4.5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unread > 0 && <span className="text-xs font-normal text-muted-foreground">{unread} unread</span>}
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="max-h-80 overflow-y-auto">
              {notificationsForRole.length === 0 && <p className="px-2 py-6 text-center text-sm text-muted-foreground">No notifications</p>}
              {notificationsForRole.map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  className="flex flex-col items-start gap-0.5 py-2"
                  onClick={() => {
                    store.markNotificationRead(n.id)
                    router.push(n.href)
                  }}
                >
                  <span className="flex w-full items-center gap-2">
                    {!n.read && <span className="size-2 shrink-0 rounded-full bg-gov-blue" aria-label="Unread" />}
                    <span className={cn('text-sm', !n.read && 'font-semibold')}>{n.title}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{n.body}</span>
                  <span className="text-[11px] text-muted-foreground">{formatDateTime(n.at)}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            {notificationsForRole.length > 0 && (
              <>
                <DropdownMenuSeparator />
                {unread > 0 && (
                  <DropdownMenuItem
                    onClick={() => {
                      store.markAllNotificationsRead()
                      toast.success('All notifications marked as read')
                    }}
                  >
                    <CheckCheck />
                    Mark all as read
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => {
                    store.clearNotifications()
                    toast.success('Notifications cleared')
                  }}
                >
                  <Trash2 />
                  Clear notifications
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border bg-card py-1 pl-1 pr-2 hover:bg-muted" aria-label="Profile menu">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">{initials(displayName)}</span>
            <span className="hidden max-w-40 flex-col text-left leading-tight md:flex">
              <span className="truncate text-xs font-semibold">{displayName}</span>
              <span className="truncate text-[11px] text-muted-foreground">{ROLE_LABEL[role]}</span>
            </span>
            <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex flex-col">
                <span className="text-sm text-foreground">{displayName}</span>
                <span className="text-xs font-normal">{session.email}</span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(`${ROLE_HOME[role]}/settings`)}>
              <UserRound />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`${ROLE_HOME[role]}/settings#preferences`)}>
              <Settings />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                logout()
                toast.success('You have been logged out.')
                router.push('/login')
              }}
            >
              <LogOut />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
