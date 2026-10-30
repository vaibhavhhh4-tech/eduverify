'use client'

import { useState } from 'react'
import {
  Building2,
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

export default function AicteSettingsPage() {
  const session = useSession()
  const { profiles } = useAppState()

  const currentProfile = profiles.aicte ?? {
    name: session?.name || 'Dr. S. Venkataraman',
    designation: session?.designation || 'Deputy Director (Demo), Approvals Bureau',
    email: session?.email || 'aicte@edverify.demo',
    phone: '+91 11 2958 1000',
    notifyEmail: true,
    notifyAlerts: true,
    notifyWeekly: true,
  }

  const [profile, setProfile] = useState(currentProfile)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    store.saveProfile('aicte', profile)
    toast.success('AICTE Administrator profile updated')
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
      toast.success('Password updated successfully for AICTE Administrator!')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  return (
    <AppShell role="aicte">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="AICTE Regulatory Bureau Settings"
          description="National oversight officer preferences, authentication credentials, and bureau contacts."
          badge={<DemoBadge label="APEX CONFIG" />}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Officer Profile */}
          <Panel title="AICTE Administrator Profile" description="Authorized bureau representative">
            <form onSubmit={handleProfileSave} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="aicte-name">Official Name</Label>
                <Input
                  id="aicte-name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="aicte-desig">Bureau / Designation</Label>
                <Input
                  id="aicte-desig"
                  value={profile.designation}
                  onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="aicte-email">Official Email</Label>
                <Input
                  id="aicte-email"
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

          {/* Bureau Information & Password */}
          <div className="flex flex-col gap-6">
            <Panel title="Regulatory Bureau Information" description="All India Council for Technical Education">
              <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/40 p-3.5 text-xs">
                <div>
                  <span className="text-muted-foreground">Apex Council</span>
                  <p className="font-bold">AICTE, Ministry of Education</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Headquarters</span>
                  <p className="font-semibold">Nelson Mandela Marg, New Delhi</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Portal Jurisdiction</span>
                  <p className="font-medium">National (Pan-India)</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Approved Bureaus</span>
                  <p className="font-medium">Approvals, Policy & Academic</p>
                </div>
              </div>
            </Panel>

            <Panel title="Change Password (Demo UI)" description="Update credentials for aicte@edverify.demo">
              <form onSubmit={handlePasswordChange} className="flex flex-col gap-3 text-xs">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="aicte-new-pass">New Password</Label>
                  <Input
                    id="aicte-new-pass"
                    type="password"
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="aicte-conf-pass">Confirm Password</Label>
                  <Input
                    id="aicte-conf-pass"
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
      </div>
    </AppShell>
  )
}
