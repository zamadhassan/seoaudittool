import { NextResponse } from 'next/server'
import { getReport } from '@/features/audit/cache/auditCache'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const report = await getReport(id)
  return NextResponse.json(report ? { status: 'completed', progress: 100, currentStep: 'Report ready' } : { status: 'failed', progress: 0, currentStep: 'Report not found' })
}
