'use client'

import { useState } from 'react'
import {
  KeyRound,
  Save,
  ShieldCheck,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import { DemoBadge } from '@/components/brand/logo'
import { PageHeader, Panel } from '@/components/dashboard/shared'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSession } from '@/lib/auth'
import { store, useAppState } from '@/lib/storage'

export default function OfficerSettingsPage() {
  const session = useSession()
  const { profiles } = useAppState()

  const currentProfile = profiles.officer ?? {
    name: session?.name || 'Neha Bhatnagar',
    designation: session?.designation || 'Verification Officer, Demo Scholarship Cell',
    email: session?.email || 'officer@edverify.demo',
    phone: '+91 94120 54321',
    notifyEmail: true,
    notifyAlerts: true,
    notifyWeekly: false,
  }

  const [profile, setProfile] = useState(currentProfile)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    store.saveProfile('officer', profile)
    toast.success('Officer profile saved')
  }

  function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (session?.email) {
      store.setPasswordOverride(session.email, newPassword)
      toast.success('Password updated successfully for Verification Officer!')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  return (
    <AppShell role="officer">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Verification Officer Settings"
          description="Manage officer credentials, department affiliation, and security settings."
          badge={<DemoBadge label="OFFICER CONFIG" />}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Officer Profile */}
          <Panel title="Officer Profile" description="Identity verification authority contact">
            <form onSubmit={handleProfileSave} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="off-name">Officer Name</Label>
                <Input
                  id="off-name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="off-desig">Designation & Cell</Label>
                <Input
                  id="off-desig"
                  value={profile.designation}
                  onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="off-email">Official Email</Label>
                <Input
                  id="off-email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit">
                  <Save className="size-3.5 mr-1" />
                  Save Profile
                </Button>
              </div>
            </form>
          </Panel>

          {/* Change Demo Password */}
          <Panel title="Security & Password Override (Demo UI)" description="Update credentials for officer@edverify.demo">
            <form onSubmit={handlePasswordChange} className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="off-new-pass">New Password</Label>
                <Input
                  id="off-new-pass"
                  type="password"
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="off-conf-pass">Confirm Password</Label>
                <Input
                  id="off-conf-pass"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end pt-1">
                <Button type="submit">
                  <KeyRound className="size-3.5 mr-1" />
                  Update Password
                </Button>
              </div>
            </form>
          </Panel>
        </div>
      </div>
    </AppShell>
  )
}
