'use client'

import { useState } from 'react'
import {
  Download,
  Eye,
  FileCheck,
  FileText,
  FolderLock,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { DemoBadge } from '@/components/brand/logo'
import { PageHeader, Panel } from '@/components/dashboard/shared'
import { AppShell } from '@/components/layout/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAppState } from '@/lib/storage'
import type { DigiDocument } from '@/types'

export default function StudentDocumentsPage() {
  const { studentDigilocker } = useAppState()
  const [selectedDoc, setSelectedDoc] = useState<DigiDocument | null>(null)

  function handleDownload(docName: string) {
    toast.success(`Downloaded official digital copy of ${docName}`)
  }

  return (
    <AppShell role="student">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Digital Academic Certificates & Credentials"
          description="Access cryptographically sealed marksheets, migration certificates, and identity records fetched via DigiLocker."
          badge={<DemoBadge label="DIGILOCKER VERIFIED" />}
        />

        <Panel
          title="Repository Documents"
          description="Electronic certificates linked to your APAAR account"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="px-3 py-2.5">Document Title</th>
                  <th className="px-3 py-2.5">Issuing Authority</th>
                  <th className="px-3 py-2.5">Document ID</th>
                  <th className="px-3 py-2.5">Issue Date</th>
                  <th className="px-3 py-2.5">Verification Status</th>
                  <th className="px-3 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {studentDigilocker.documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-muted/30">
                    <td className="px-3 py-2.5 font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        <FileCheck className="size-4 text-gov-blue shrink-0" />
                        <span>{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{doc.issuer}</td>
                    <td className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">{doc.id}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{doc.issuedOn}</td>
                    <td className="px-3 py-2.5">
                      <Badge variant="default" className="bg-india-green text-[10px]">
                        {doc.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => setSelectedDoc(doc)}
                        >
                          <Eye className="size-3 mr-1" />
                          Inspect
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleDownload(doc.name)}
                        >
                          <Download className="size-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Inspect Document Modal */}
        <Dialog open={!!selectedDoc} onOpenChange={(open) => !open && setSelectedDoc(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedDoc?.name}</DialogTitle>
              <DialogDescription>
                DigiLocker electronic academic document metadata.
              </DialogDescription>
            </DialogHeader>

            {selectedDoc && (
              <div className="flex flex-col gap-3 rounded-lg border bg-muted/40 p-4 text-xs">
                <div className="flex items-center justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Issuing Authority</span>
                  <span className="font-semibold text-foreground">{selectedDoc.issuer}</span>
                </div>
                <div className="flex items-center justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Document Identifier</span>
                  <span className="font-mono text-foreground">{selectedDoc.id}</span>
                </div>
                <div className="flex items-center justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Issued Date</span>
                  <span className="text-foreground">{selectedDoc.issuedOn}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Depository Verification</span>
                  <Badge variant="default" className="bg-india-green">
                    Cryptographically Validated
                  </Badge>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedDoc(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
