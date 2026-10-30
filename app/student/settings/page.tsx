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

export default function StudentSettingsPage() {
  const session = useSession()
  const { students } = useAppState()

  const student =
    students.find((s) => s.email === session?.email) ||
    students.find((s) => s.email === 'student@edverify.demo') ||
    students[0]

  const [mobile, setMobile] = useState(student?.mobile || '9876501234')
  const [email, setEmail] = useState(student?.email || 'student@edverify.demo')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    if (student) {
      store.updateStudent(student.id, { mobile, email }, 'Updated personal contact information')
      toast.success('Contact details updated')
    }
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
      toast.success('Password updated successfully for Student Account!')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  return (
    <AppShell role="student">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Student Account & Profile Settings"
          description="Manage student contact details, communication channels, and security credentials."
          badge={<DemoBadge label="STUDENT ACCOUNT" />}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Contact Details */}
          <Panel title="Contact & Notification Information" description="Self-service student contact update">
            <form onSubmit={handleProfileSave} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="st-name">Student Full Name</Label>
                <Input id="st-name" value={student?.name || ''} disabled className="bg-muted text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Official name is locked to AICTE enrolment record.</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="st-email">Contact Email Address</Label>
                <Input
                  id="st-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="st-mobile">Mobile Number (SMS Alerts)</Label>
                <Input
                  id="st-mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit">
                  <Save className="size-3.5 mr-1" />
                  Save Contact Information
                </Button>
              </div>
            </form>
          </Panel>

          {/* Password Change */}
          <Panel title="Security & Password Override (Demo UI)" description="Update credentials for student@edverify.demo">
            <form onSubmit={handlePasswordChange} className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="st-new-pass">New Password</Label>
                <Input
                  id="st-new-pass"
                  type="password"
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="st-conf-pass">Confirm Password</Label>
                <Input
                  id="st-conf-pass"
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
