import { NextResponse } from 'next/server'
import { z } from 'zod'
import { runAudit } from '@/features/audit/engine/runAudit'
import { saveReport } from '@/features/audit/cache/auditCache'

const requestSchema = z.object({
  url: z.string().min(3),
  options: z.object({
    crawlLimit: z.number().optional(),
    runAI: z.boolean().optional(),
    runPageSpeed: z.boolean().optional(),
    runLighthouse: z.boolean().optional()
  }).optional()
})

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json())
    const report = await runAudit(body.url)
    await saveReport(report)

    return NextResponse.json({
      reportId: report.id,
      status: 'completed',
      reportUrl: `/report/${report.id}`,
      report
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Audit failed.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
