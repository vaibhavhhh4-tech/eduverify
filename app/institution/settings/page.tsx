'use client'

import { useState } from 'react'
import {
  Bell,
  Building2,
  CheckCheck,
  KeyRound,
  Lock,
  Save,
  ShieldCheck,
  Trash2,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import { DemoBadge } from '@/components/brand/logo'
import { PageHeader, Panel } from '@/components/dashboard/shared'
import { AppShell } from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useSession } from '@/lib/auth'
import { INSTITUTION } from '@/lib/mock-data'
import { store, useAppState } from '@/lib/storage'
import { formatDateTime } from '@/lib/utils'

export default function InstitutionSettingsPage() {
  const session = useSession()
  const { profiles, notifications } = useAppState()

  // Profile Form state
  const currentProfile = profiles.institution ?? {
    name: session?.name || 'Prof. Rajesh Deshpande',
    designation: session?.designation || 'Registrar, SIEM Pune',
    email: session?.email || 'institution@edverify.demo',
    phone: '+91 98220 12345',
    notifyEmail: true,
    notifyAlerts: true,
    notifyWeekly: false,
  }

  const [profile, setProfile] = useState(currentProfile)

  // Password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Handle Profile Save
  function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    store.saveProfile('institution', profile)
    toast.success('Administrator profile settings saved')
  }

  // Handle Password Change
  function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    if (!newPassword || newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (session?.email) {
      store.setPasswordOverride(session.email, newPassword)
      toast.success('Password updated successfully! Use this new password for next login.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  return (
    <AppShell role="institution">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Institutional Portal Settings"
          description="Manage administrator profile, institutional registration details, notifications, and security credentials."
          badge={<DemoBadge label="CONFIG & ACCESS" />}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Profile Settings */}
          <Panel
            title="Administrator Profile"
            description="Institutional representative contact details"
          >
            <form onSubmit={handleProfileSave} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="prof-name">Full Name & Title</Label>
                <Input
                  id="prof-name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="prof-desig">Designation</Label>
                <Input
                  id="prof-desig"
                  value={profile.designation}
                  onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="prof-email">Official Email</Label>
                  <Input
                    id="prof-email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="prof-phone">Contact Phone</Label>
                  <Input
                    id="prof-phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t pt-3">
                <span className="font-semibold text-foreground">Notification Preferences</span>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-foreground block">Email Compliance Alerts</span>
                    <span className="text-muted-foreground text-[11px]">
                      Receive automated notifications on duplicate APAAR and intake alerts
                    </span>
                  </div>
                  <Switch
                    checked={profile.notifyAlerts}
                    onCheckedChange={(checked) => setProfile({ ...profile, notifyAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-foreground block">Weekly Enrolment Digest</span>
                    <span className="text-muted-foreground text-[11px]">
                      Weekly statistical summary of active admissions
                    </span>
                  </div>
                  <Switch
                    checked={profile.notifyWeekly}
                    onCheckedChange={(checked) => setProfile({ ...profile, notifyWeekly: checked })}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit">
                  <Save className="size-3.5" data-icon="inline-start" />
                  Save Profile Settings
                </Button>
              </div>
            </form>
          </Panel>

          {/* Institutional Information */}
          <div className="flex flex-col gap-6">
            <Panel
              title="Registered Institutional Details"
              description="Official institutional accreditation parameters registered with AICTE"
            >
              <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/40 p-3.5 text-xs">
                <div>
                  <span className="text-muted-foreground">Institution Name</span>
                  <p className="font-bold text-foreground text-sm">{INSTITUTION.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Permanent AICTE ID</span>
                  <p className="font-mono font-bold text-foreground text-sm">{INSTITUTION.aicteId}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Institution Code</span>
                  <p className="font-mono font-medium text-foreground">{INSTITUTION.code}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Institutional Type</span>
                  <p className="font-medium text-foreground">{INSTITUTION.type}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Location</span>
                  <p className="font-medium text-foreground">{INSTITUTION.city}, {INSTITUTION.state}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Principal / Director</span>
                  <p className="font-medium text-foreground">{INSTITUTION.principal}</p>
                </div>
              </div>
            </Panel>

            {/* Change Demo Password */}
            <Panel
              title="Security & Password Override (Demo UI)"
              description="Test credentials update. Changes persist in local browser storage."
            >
              <form onSubmit={handlePasswordChange} className="flex flex-col gap-3 text-xs">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="new-pass">New Password</Label>
                  <Input
                    id="new-pass"
                    type="password"
                    placeholder="Enter new password (min 6 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="conf-pass">Confirm New Password</Label>
                  <Input
                    id="conf-pass"
                    type="password"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <Button type="submit">
                    <KeyRound className="size-3.5" data-icon="inline-start" />
                    Update Password
                  </Button>
                </div>
              </form>
            </Panel>
          </div>
        </div>

        {/* Notification Center */}
        <Panel
          title="Notification Center"
          description="In-app notices and audit notifications for SIEM Pune"
          actions={
            notifications.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    store.markAllNotificationsRead()
                    toast.success('Marked all notifications as read')
                  }}
                >
                  <CheckCheck className="size-3.5" data-icon="inline-start" />
                  Mark All Read
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    store.clearNotifications()
                    toast.info('Cleared all notifications')
                  }}
                >
                  <Trash2 className="size-3.5" data-icon="inline-start" />
                  Clear All
                </Button>
              </div>
            )
          }
        >
          {notifications.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">
              No notifications in your inbox.
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-border/60">
              {notifications.map((n) => (
                <div key={n.id} className="flex items-start justify-between py-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`mt-1 size-2 rounded-full shrink-0 ${
                        n.read ? 'bg-muted-foreground/40' : 'bg-gov-blue'
                      }`}
                    />
                    <div className="flex flex-col gap-0.5">
                      <span className={`text-foreground ${n.read ? 'font-medium' : 'font-bold'}`}>
                        {n.title}
                      </span>
                      <p className="text-muted-foreground">{n.body}</p>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {formatDateTime(n.at)}
                      </span>
                    </div>
                  </div>
                  {!n.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-[11px]"
                      onClick={() => store.markNotificationRead(n.id)}
                    >
                      Mark read
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </AppShell>
  )
}
