'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Eye,
  FileCheck,
  FileText,
  FolderLock,
  Info,
  Link as LinkIcon,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Unlink,
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
import { DIGILOCKER_DOCS } from '@/lib/mock-data'
import { store, useAppState } from '@/lib/storage'
import { formatDateTime } from '@/lib/utils'
import type { DigiDocument } from '@/types'

export default function DigiLockerPage() {
  const { digilocker } = useAppState()
  const [consentOpen, setConsentOpen] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [previewDoc, setPreviewDoc] = useState<DigiDocument | null>(null)

  // Handle Connect
  async function handleConnect() {
    setConsentOpen(false)
    setConnecting(true)

    // Simulate OAuth handshake
    await new Promise((r) => setTimeout(r, 1200))

    store.setDigilocker('institution', {
      connected: true,
      lastSync: new Date().toISOString(),
      documents: DIGILOCKER_DOCS,
    })

    setConnecting(false)
    toast.success('Connected to DigiLocker Sandbox API (Demo Mode)')
  }

  // Handle Disconnect / Revoke
  function handleDisconnect() {
    store.setDigilocker('institution', {
      connected: false,
      lastSync: null,
      documents: [],
    })
    toast.info('Revoked DigiLocker institutional access')
  }

  return (
    <AppShell role="institution">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="DigiLocker Integration (Demo Simulation)"
          description="Simulated National Digital Locker gateway for direct verification of digital academic credentials, domicile and category certificates."
          badge={<DemoBadge label="SIMULATION · DEMO MODE" />}
        />

        {/* Prominent Demo Mode Banner */}
        <div className="flex items-start gap-3 rounded-xl border border-saffron/40 bg-saffron/10 p-4 text-xs">
          <AlertTriangle className="size-5 shrink-0 text-saffron mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-foreground">
              DEMO SIMULATION NOTICE · No Real-World DigiLocker Credentials Used
            </span>
            <p className="text-muted-foreground leading-relaxed">
              This environment emulates the DigiLocker API OAuth consent flow, document metadata retrieval, and digital certificate verification. It does not establish network connections with MeiTY or Government of India DigiLocker production services.
            </p>
          </div>
        </div>

        {/* Integration Status Panel */}
        <Panel
          title="Institutional DigiLocker Gateway"
          description="Status of repository connector with DigiLocker National Academic Depository"
          actions={
            digilocker.connected ? (
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-india-green text-xs">
                  <CheckCircle2 className="size-3 mr-1" />
                  Active Connection
                </Badge>
                <Button variant="outline" size="sm" onClick={handleDisconnect}>
                  <Unlink className="size-3.5" data-icon="inline-start" />
                  Revoke Access
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => setConsentOpen(true)} disabled={connecting}>
                {connecting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" data-icon="inline-start" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <LinkIcon className="size-3.5" data-icon="inline-start" />
                    Connect Institutional DigiLocker
                  </>
                )}
              </Button>
            )
          }
        >
          {digilocker.connected ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
                <div className="rounded-lg border bg-muted/40 p-3">
                  <span className="text-muted-foreground">Gateway Status</span>
                  <p className="font-semibold text-foreground text-sm flex items-center gap-1.5 mt-0.5">
                    <span className="size-2 rounded-full bg-india-green" />
                    Connected & Synchronized
                  </p>
                </div>
                <div className="rounded-lg border bg-muted/40 p-3">
                  <span className="text-muted-foreground">Last API Sync</span>
                  <p className="font-mono font-medium text-foreground text-xs mt-0.5">
                    {digilocker.lastSync ? formatDateTime(digilocker.lastSync) : 'Just now'}
                  </p>
                </div>
                <div className="rounded-lg border bg-muted/40 p-3">
                  <span className="text-muted-foreground">Retrieved Credentials</span>
                  <p className="font-semibold text-foreground text-sm mt-0.5">
                    {digilocker.documents.length} Academic Certificates
                  </p>
                </div>
              </div>

              {/* Retrieved Documents Table */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-foreground">
                  Simulated Retrieved Verified Documents:
                </span>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b bg-muted/40 font-semibold text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2.5">Document Title</th>
                        <th className="px-3 py-2.5">Issuing Authority</th>
                        <th className="px-3 py-2.5">Doc ID</th>
                        <th className="px-3 py-2.5">Issue Date</th>
                        <th className="px-3 py-2.5">Status</th>
                        <th className="px-3 py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {digilocker.documents.map((doc) => (
                        <tr key={doc.id} className="hover:bg-muted/30">
                          <td className="px-3 py-2.5 font-medium text-foreground">
                            <div className="flex items-center gap-2">
                              <FileCheck className="size-4 text-gov-blue shrink-0" />
                              <span>{doc.name}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-muted-foreground">{doc.issuer}</td>
                          <td className="px-3 py-2.5 font-mono text-[11px]">{doc.id}</td>
                          <td className="px-3 py-2.5 text-muted-foreground">{doc.issuedOn}</td>
                          <td className="px-3 py-2.5">
                            <Badge variant="default" className="bg-india-green text-[10px]">
                              {doc.status}
                            </Badge>
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => setPreviewDoc(doc)}
                            >
                              <Eye className="size-3 mr-1" />
                              Inspect
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-saffron/15 text-[oklch(0.5_0.13_55)]">
                <FolderLock className="size-7" />
              </div>
              <div className="max-w-md">
                <h3 className="font-semibold text-foreground text-sm">
                  DigiLocker Gateway Not Connected
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Connect institutional DigiLocker to enable automated retrieval and verification of Marksheets, APAAR identity credentials, and domicile certificates.
                </p>
              </div>
              <Button onClick={() => setConsentOpen(true)}>
                <LinkIcon className="size-3.5" data-icon="inline-start" />
                Initialize DigiLocker Handshake
              </Button>
            </div>
          )}
        </Panel>

        {/* Consent Modal */}
        <Dialog open={consentOpen} onOpenChange={setConsentOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-gov-blue" />
                DigiLocker Access Consent
              </DialogTitle>
              <DialogDescription>
                Simulated OAuth consent dialog for institutional verification.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 text-xs">
              <p className="text-muted-foreground">
                Sahyadri Institute of Engineering & Management requests read-only authorization to retrieve academic credentials:
              </p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>Automated Permanent Academic Account Registry (APAAR) Identity</li>
                <li>Secondary & Higher Secondary Examination Marksheets (CBSE / State Board)</li>
                <li>Category & Caste Validity Certificates for reserved quota validation</li>
              </ul>
              <div className="rounded-lg bg-muted/50 p-2.5 text-[11px] text-muted-foreground">
                <strong>Simulated Scope:</strong> `edu.aicte.apaar:read`, `edu.digilocker.marksheets:read`
              </div>
            </div>

            <DialogFooter className="mt-2">
              <Button variant="outline" onClick={() => setConsentOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConnect}>Grant Simulated Consent</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Document Inspection Modal */}
        <Dialog open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{previewDoc?.name}</DialogTitle>
              <DialogDescription>
                Electronic certificate fetched from National Academic Depository simulation.
              </DialogDescription>
            </DialogHeader>

            {previewDoc && (
              <div className="flex flex-col gap-3 rounded-lg border bg-muted/40 p-4 text-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground">Issuer</span>
                  <span className="font-semibold text-foreground">{previewDoc.issuer}</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground">Document ID</span>
                  <span className="font-mono text-foreground">{previewDoc.id}</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground">Issued Date</span>
                  <span className="text-foreground">{previewDoc.issuedOn}</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground">Verification Seal</span>
                  <Badge variant="default" className="bg-india-green">
                    Cryptographically Validated
                  </Badge>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setPreviewDoc(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
