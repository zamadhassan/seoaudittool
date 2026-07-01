'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { IssueCard } from '@/components/audit/IssueCard'
import { PdfExportButton } from '@/components/audit/PdfExportButton'
import { ScoreCard } from '@/components/audit/ScoreCard'
import { scoreLabel } from '@/lib/utils'
import type { AuditIssue, AuditReport } from '@/types/audit'

const scoreCards = [
  ['Technical SEO', 'technical', 'Metadata, crawl signals, schema, links, and image SEO.'],
  ['Performance', 'performance', 'Initial response, caching, and lightweight delivery signals.'],
  ['CRO', 'cro', 'CTA, lead form, trust, contact, and landing page readiness.'],
  ['Accessibility', 'accessibility', 'Language, alt text, link labels, and semantic signals.'],
  ['Security', 'security', 'HTTPS, mixed content, security headers, and safer links.'],
  ['Crawlability', 'crawlability', 'Crawler access, redirects, and response health.'],
  ['Indexability', 'indexability', 'Robots directives and search visibility blockers.'],
  ['On-page SEO', 'onPage', 'Title, description, headings, and content depth.'],
  ['Mobile UX', 'mobile', 'Viewport and mobile conversion readiness.'],
  ['AI SEO', 'aiSeo', 'FAQ, structured data, and answer-ready content.']
] as const

const reportSections = [
  { title: 'CRO & Lead Generation', categories: ['CRO', 'Google Ads'], description: 'Conversion clarity, CTA strength, lead capture, proof, and landing page trust.' },
  { title: 'Technical SEO', categories: ['Technical SEO', 'Crawlability', 'Indexability', 'Schema'], description: 'Crawl access, status health, canonical signals, and search engine understanding.' },
  { title: 'On-page Content', categories: ['Meta', 'Headings', 'Content'], description: 'Search snippet quality, heading structure, page depth, and topical clarity.' },
  { title: 'Performance & UX', categories: ['Performance', 'Mobile UX'], description: 'Response speed, cache signals, mobile rendering, and user experience friction.' },
  { title: 'Accessibility & Security', categories: ['Accessibility', 'Security'], description: 'Usability, safe browsing signals, and baseline compliance checks.' },
  { title: 'Links & Images', categories: ['Links', 'Images'], description: 'Internal navigation, accessible anchors, image SEO, and media optimization.' },
  { title: 'AI SEO Readiness', categories: ['AI SEO'], description: 'Answer engine readiness, entity clarity, FAQ signals, and structured support.' }
]

function severityCounts(issues: AuditIssue[]) {
  return {
    critical: issues.filter((issue) => issue.severity === 'critical').length,
    warning: issues.filter((issue) => issue.severity === 'warning').length,
    notice: issues.filter((issue) => issue.severity === 'notice').length,
    passed: issues.filter((issue) => issue.severity === 'passed').length
  }
}

function scoreValue(report: AuditReport, key: (typeof scoreCards)[number][1]) {
  return report.scores[key]
}

function sectionIssues(report: AuditReport, categories: string[]) {
  return report.issues.filter((issue) => categories.includes(issue.category)).sort((a, b) => b.scoreImpact - a.scoreImpact)
}

export default function ReportPage() {
  const params = useParams<{ id: string }>()
  const [report, setReport] = useState<AuditReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeSeverity, setActiveSeverity] = useState<'all' | AuditIssue['severity']>('all')

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
    return (
      <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-zinc-300">Loading detailed report...</div>
      </main>
    )
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

  const counts = severityCounts(report.issues)
  const failedIssues = report.issues.filter((issue) => issue.severity !== 'passed')
  const visibleIssues = activeSeverity === 'all' ? failedIssues : report.issues.filter((issue) => issue.severity === activeSeverity)
  const page = report.pages[0]
  const responseTime = typeof report.raw.responseTimeMs === 'number' ? report.raw.responseTimeMs : null

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#111] p-6 shadow-2xl shadow-yellow-500/10 md:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(254,203,47,0.22),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-nexora-yellow">Website Audit Report</p>
            <h1 className="mt-3 break-words text-4xl font-black md:text-6xl">{report.domain}</h1>
            <p className="mt-4 break-all text-zinc-300">{report.finalUrl}</p>
            <p className="mt-3 text-sm text-zinc-400">
              Powered by{' '}
              <a href="https://nexoracreation.com" target="_blank" rel="noreferrer" className="font-semibold text-nexora-yellow hover:text-yellow-300">
                Nexora Creation
              </a>
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Audited {new Date(report.createdAt).toLocaleString()}</span>
              {responseTime ? <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">HTML response {responseTime}ms</span> : null}
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">{report.issues.length} checks reviewed</span>
            </div>
          </div>
          <div className="rounded-[2rem] border border-yellow-300/30 bg-black/35 p-6">
            <div className="text-sm text-zinc-400">Website Health Score</div>
            <div className="mt-2 flex items-end gap-3">
              <div className="text-7xl font-black text-nexora-yellow">{report.scores.overall}</div>
              <div className="pb-3 text-xl font-bold text-white">/100</div>
            </div>
            <div className="mt-2 text-lg font-semibold text-white">{scoreLabel(report.scores.overall)}</div>
            <div className="mt-6 flex flex-wrap gap-3">
              <PdfExportButton report={report} />
              <Link href={`/audit?url=${encodeURIComponent(report.finalUrl)}`} className="rounded-full border border-white/15 px-5 py-3 font-bold text-white transition hover:border-yellow-300/50">Re-run</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-5"><div className="text-3xl font-black text-red-200">{counts.critical}</div><div className="text-sm text-red-100/80">Critical issues</div></div>
        <div className="rounded-3xl border border-yellow-400/20 bg-yellow-500/10 p-5"><div className="text-3xl font-black text-yellow-100">{counts.warning}</div><div className="text-sm text-yellow-100/80">Warnings</div></div>
        <div className="rounded-3xl border border-blue-400/20 bg-blue-500/10 p-5"><div className="text-3xl font-black text-blue-100">{counts.notice}</div><div className="text-sm text-blue-100/80">Notices</div></div>
        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5"><div className="text-3xl font-black text-emerald-100">{counts.passed}</div><div className="text-sm text-emerald-100/80">Passed checks</div></div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {scoreCards.map(([label, key, detail]) => <ScoreCard key={key} label={label} score={scoreValue(report, key)} detail={detail} />)}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black">Executive summary</h2>
          <p className="mt-4 leading-7 text-zinc-300">{report.summary.executiveSummary}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <p className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-zinc-400"><span className="font-bold text-white">SEO impact:</span> {report.summary.seoImpact}</p>
            <p className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-zinc-400"><span className="font-bold text-white">CRO impact:</span> {report.summary.croImpact}</p>
            <p className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-zinc-400"><span className="font-bold text-white">Business impact:</span> {report.summary.businessImpact}</p>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black">Crawled page snapshot</h2>
          {page ? (
            <div className="mt-4 space-y-3 text-sm text-zinc-400">
              <p><span className="font-semibold text-white">Status:</span> {page.statusCode}</p>
              <p><span className="font-semibold text-white">Title:</span> {page.title || 'Missing'}</p>
              <p><span className="font-semibold text-white">H1:</span> {page.h1 || 'Missing'}</p>
              <p><span className="font-semibold text-white">Words:</span> {page.wordCount}</p>
              <p><span className="font-semibold text-white">Links:</span> {page.internalLinks} internal, {page.externalLinks} external</p>
              <p><span className="font-semibold text-white">Images:</span> {page.imageCount}</p>
            </div>
          ) : <p className="mt-4 text-sm text-zinc-500">No page snapshot available.</p>}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-black">Recommended priority fixes</h2>
            <p className="mt-2 text-sm text-zinc-400">Start with these actions to improve search visibility, user trust, and lead generation.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {report.summary.topFixes.map((fix, index) => (
            <div key={`${fix.title}-${index}`} className="rounded-3xl border border-yellow-300/20 bg-yellow-300/10 p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="text-xs font-bold uppercase tracking-wider text-nexora-yellow">Fix #{index + 1}</div>
                <div className="rounded-full bg-black/25 px-3 py-1 text-xs text-yellow-100">{fix.priority} priority</div>
              </div>
              <h3 className="mt-3 text-xl font-bold">{fix.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{fix.whyItMatters}</p>
              <p className="mt-3 text-sm leading-6 text-white"><span className="font-semibold text-nexora-yellow">How to fix:</span> {fix.howToFix}</p>
              <p className="mt-3 text-sm leading-6 text-zinc-400"><span className="font-semibold text-white">Expected impact:</span> {fix.expectedImpact}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h2 className="text-2xl font-black">Detailed audit findings</h2>
            <p className="mt-2 text-sm text-zinc-400">Filter by severity or review each section to understand what to fix and why it matters.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', 'critical', 'warning', 'notice', 'passed'] as const).map((severity) => (
              <button key={severity} onClick={() => setActiveSeverity(severity)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${activeSeverity === severity ? 'border-yellow-300 bg-yellow-300 text-black' : 'border-white/10 bg-black/20 text-zinc-300 hover:border-yellow-300/50'}`}>{severity}</button>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {visibleIssues.length ? visibleIssues.map((issue, index) => <IssueCard key={`${issue.title}-${index}`} issue={issue} />) : <p className="text-sm text-zinc-500">No findings match this filter.</p>}
        </div>
      </section>

      <section className="mt-8 space-y-5">
        <h2 className="text-2xl font-black">Category breakdown</h2>
        {reportSections.map((section) => {
          const issues = sectionIssues(report, section.categories)
          return (
            <div key={section.title} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                <div>
                  <h3 className="text-xl font-bold">{section.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{section.description}</p>
                </div>
                <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300">{issues.length} checks</span>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {issues.length ? issues.map((issue, index) => <IssueCard key={`${section.title}-${issue.title}-${index}`} issue={issue} />) : <p className="text-sm text-zinc-500">No checks returned for this category yet.</p>}
              </div>
            </div>
          )
        })}
      </section>

      <section className="mt-8 rounded-3xl border border-yellow-300/20 bg-yellow-300/10 p-6 text-center">
        <h2 className="text-2xl font-black">Need help improving this score?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-300">Nexora Creation can help turn these audit findings into a practical SEO, website performance, and conversion improvement plan.</p>
        <a href="https://nexoracreation.com" target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full bg-nexora-yellow px-6 py-3 font-bold text-black hover:bg-yellow-300">Visit Nexora Creation</a>
      </section>
    </main>
  )
}
