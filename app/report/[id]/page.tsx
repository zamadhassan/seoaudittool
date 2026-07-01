'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { IssueCard } from '@/components/audit/IssueCard'
import { ScoreCard } from '@/components/audit/ScoreCard'
import type { AuditReport } from '@/types/audit'

export default function ReportPage() {
  const params = useParams<{ id: string }>()
  const [report, setReport] = useState<AuditReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const id = params.id
    const cached = localStorage.getItem(`nexora-report-${id}`)
    if (cached) {
      try {
        setReport(JSON.parse(cached) as AuditReport)
        setLoading(false)
      } catch {
        localStorage.removeItem(`nexora-report-${id}`)
      }
    }

    fetch(`/api/report/${id}`)
      .then(async (response) => {
        if (!response.ok) {
          if (cached) return null
          throw new Error('Report not found. Re-run the audit to generate a fresh report.')
        }
        return response.json() as Promise<AuditReport>
      })
      .then((data) => {
        if (!data) return
        localStorage.setItem(`nexora-report-${data.id}`, JSON.stringify(data))
        setReport(data)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) {
    return <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 text-zinc-300 sm:px-6 lg:px-8">Loading report...</main>
  }

  if (!report) {
    return (
      <main className="mx-auto min-h-[70vh] max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black">Report not found</h1>
        <p className="mt-4 text-zinc-400">{error || 'This report is no longer available on the server.'}</p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-nexora-yellow px-5 py-3 font-bold text-black">Run a new audit</Link>
      </main>
    )
  }

  const failedIssues = report.issues.filter((issue) => issue.severity !== 'passed')
  const passedIssues = report.issues.filter((issue) => issue.severity === 'passed')

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-yellow-300/[0.08] p-6 md:p-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-nexora-yellow">Audit Report</p>
            <h1 className="mt-3 break-words text-4xl font-black md:text-5xl">{report.domain}</h1>
            <p className="mt-3 break-all text-zinc-300">{report.finalUrl}</p>
            <p className="mt-2 text-sm text-zinc-500">Audited {new Date(report.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex gap-3">
            <a href={`/api/pdf/${report.id}`} className="rounded-full bg-nexora-yellow px-5 py-3 font-bold text-black">Export PDF</a>
            <Link href={`/audit?url=${encodeURIComponent(report.finalUrl)}`} className="rounded-full border border-white/15 px-5 py-3 font-bold text-white">Re-run</Link>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ScoreCard label="Overall" score={report.scores.overall} />
        <ScoreCard label="Technical SEO" score={report.scores.technical} />
        <ScoreCard label="CRO" score={report.scores.cro} />
        <ScoreCard label="Performance" score={report.scores.performance} />
      </section>

      <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <h2 className="text-2xl font-black">Executive summary</h2>
        <p className="mt-3 leading-7 text-zinc-300">{report.summary.executiveSummary}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <p className="text-sm text-zinc-400"><span className="font-bold text-white">SEO:</span> {report.summary.seoImpact}</p>
          <p className="text-sm text-zinc-400"><span className="font-bold text-white">CRO:</span> {report.summary.croImpact}</p>
          <p className="text-sm text-zinc-400"><span className="font-bold text-white">Business:</span> {report.summary.businessImpact}</p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-black">Top priority fixes</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {report.summary.topFixes.map((fix) => (
            <div key={fix.title} className="rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-nexora-yellow">{fix.priority} priority</div>
              <h3 className="mt-2 font-bold">{fix.title}</h3>
              <p className="mt-2 text-sm text-zinc-300">{fix.howToFix}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-black">Issues</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {failedIssues.map((issue, index) => <IssueCard key={`${issue.title}-${index}`} issue={issue} />)}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-black">Passed checks</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {passedIssues.map((issue, index) => <IssueCard key={`${issue.title}-${index}`} issue={issue} />)}
        </div>
      </section>
    </main>
  )
}
