'use client'

import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function ShareReportButton() {
  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href)
    toast.success('Report link copied')
  }

  return (
    <Button type="button" variant="outline" onClick={copyLink}>
      <Copy className="h-4 w-4" /> Copy Link
    </Button>
  )
}
