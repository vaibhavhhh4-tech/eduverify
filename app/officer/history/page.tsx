'use client'

import {
  Download,
  History,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { DemoBadge } from '@/components/brand/logo'
import { PageHeader, Panel } from '@/components/dashboard/shared'
import { AppShell } from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { downloadCsv } from '@/lib/export'
import { useAppState } from '@/lib/storage'
import { formatDateTime } from '@/lib/utils'

export default function OfficerHistoryPage() {
  const { verificationLogs } = useAppState()

  function handleExportCsv() {
    const rows = verificationLogs.map((l) => ({
      'Log ID': l.id,
      'Timestamp': l.at,
      'Student Name': l.studentName,
      'Reference / APAAR': l.reference,
      'Method': l.method,
      'Verification Result': l.result,
      'Verified By': l.by,
    }))
    downloadCsv(rows, 'officer_verification_log.csv')
    toast.success('Exported verification log to CSV')
  }

  return (
    <AppShell role="officer">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Verification Audit Log & History"
          description="Detailed chronological log of candidate verifications processed by this officer cell."
          badge={<DemoBadge label="OFFICER AUDIT" />}
          actions={
            <Button size="sm" onClick={handleExportCsv}>
              <Download className="size-4" data-icon="inline-start" />
              Export Audit CSV
            </Button>
          }
        />

        <Panel
          title="All Logged Verification Inquiries"
          description={`Showing ${verificationLogs.length} total verification events`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="px-3 py-2.5">Date & Time</th>
                  <th className="px-3 py-2.5">Candidate Name</th>
                  <th className="px-3 py-2.5">Reference / APAAR ID</th>
                  <th className="px-3 py-2.5">Method</th>
                  <th className="px-3 py-2.5">Verified By</th>
                  <th className="px-3 py-2.5 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {verificationLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30">
                    <td className="px-3 py-2.5 font-mono text-muted-foreground">{formatDateTime(log.at)}</td>
                    <td className="px-3 py-2.5 font-bold text-foreground">{log.studentName}</td>
                    <td className="px-3 py-2.5 font-mono text-muted-foreground">{log.reference}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{log.method}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{log.by}</td>
                    <td className="px-3 py-2.5 text-right">
                      <Badge
                        variant={
                          log.result === 'VERIFIED'
                            ? 'default'
                            : log.result === 'NOT VERIFIED'
                            ? 'destructive'
                            : 'outline'
                        }
                        className="text-[10px]"
                      >
                        {log.result}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </AppShell>
  )
}
