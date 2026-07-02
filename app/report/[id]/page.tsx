'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BrainCircuit, Gauge, Sparkles, TrendingUp } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowTrendUp, faBullseye, faCircleCheck, faExclamationCircle, faLightbulb, faRotateRight, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { IssueCard } from '@/components/audit/IssueCard'
import { PdfExportButton } from '@/components/audit/PdfExportButton'
import { ReportCharts } from '@/components/audit/ReportCharts'
import { ScoreCard } from '@/components/audit/ScoreCard'
import { ShareReportButton } from '@/components/audit/ShareReportButton'
import { WebsiteIcon } from '@/components/audit/WebsiteIcon'
import { Badge } from '@/components/ui/badge'
import { scoreLabel } from '@/lib/utils'
import type { AuditIssue, AuditReport } from '@/types/audit'

const scoreCards = [
  ['Overall', 'overall', 'Complete website health score across all audit categories.'],
  ['Technical SEO', 'technical', 'Metadata, crawl signals, schema, links, and image SEO.'],
  ['Performance', 'performance', 'Initial response, caching, and lightweight delivery signals.'],
  ['Crawlability', 'crawlability', 'Crawler access, redirects, and response health.'],
  ['Accessibility', 'accessibility', 'Language, alt text, link labels, and semantic signals.'],
  ['Security', 'security', 'HTTPS, mixed content, security headers, and safer links.'],
  ['On-page SEO', 'onPage', 'Title, description, headings, and content depth.']
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

function scoreGuidance(score: number) {
  if (score >= 90) return 'Strong foundation. Keep monitoring and improve minor opportunities.'
  if (score >= 75) return 'Good foundation. Fix warnings to unlock stronger growth.'
  if (score >= 60) return 'Usable but needs focused SEO and conversion improvements.'
  if (score >= 40) return 'High-impact issues are likely limiting traffic, trust, or leads.'
  return 'Critical issues need attention before scaling SEO or ads.'
}

function pageSpeedData(report: AuditReport) {
  const pageSpeed = report.raw.pageSpeed as { mobile?: { performanceScore?: number | null; firstContentfulPaint?: string | null; largestContentfulPaint?: string | null; cumulativeLayoutShift?: string | null; totalBlockingTime?: string | null; speedIndex?: string | null } | null; desktop?: { performanceScore?: number | null; firstContentfulPaint?: string | null; largestContentfulPaint?: string | null; cumulativeLayoutShift?: string | null; totalBlockingTime?: string | null; speedIndex?: string | null } | null } | null | undefined
  return pageSpeed || null
}

function aiMeta(report: AuditReport) {
  const ai = report.raw.ai as { status?: string; provider?: string; model?: string; message?: string } | undefined
  return {
    status: ai?.status || 'unknown',
    provider: ai?.provider || 'fallback',
    model: ai?.model,
    message: ai?.message
  }
}

export default function ReportPage() {
  const params = useParams<{ id: string }>()
  const [report, setReport] = useState<AuditReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeSeverity, setActiveSeverity] = useState<'all' | AuditIssue['severity']>('all')
  const [activeCategory, setActiveCategory] = useState('all')

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
        <div className="rounded-[10px] border border-white/10 bg-white/[0.04] p-8 text-zinc-300">Loading detailed report...</div>
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
  const categories = Array.from(new Set(report.issues.map((issue) => issue.category))).sort()
  const visibleIssues = (activeSeverity === 'all' ? failedIssues : report.issues.filter((issue) => issue.severity === activeSeverity))
    .filter((issue) => activeCategory === 'all' || issue.category === activeCategory)
  const page = report.pages[0]
  const responseTime = typeof report.raw.responseTimeMs === 'number' ? report.raw.responseTimeMs : null
  const pageSpeed = pageSpeedData(report)
  const ai = aiMeta(report)
  const aiGenerated = ai.status === 'generated' && ai.provider === 'groq'

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <section className="premium-panel relative overflow-hidden p-5 sm:p-6 md:p-8">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-yellow-300/12 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-nexora-yellow">Website Audit Report</p>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              <WebsiteIcon src={report.favicon} domain={report.domain} />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="break-words text-3xl font-black tracking-tight md:text-5xl">{report.domain}</h1>
                  <Badge variant="passed">Completed</Badge>
                  <Badge variant={aiGenerated ? 'brand' : 'default'}>{aiGenerated ? 'Groq AI Summary' : 'Fallback Summary'}</Badge>
                </div>
                <p className="mt-2 break-all text-zinc-300">{report.finalUrl}</p>
              </div>
            </div>
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
          <div className="rounded-[10px] border border-yellow-300/30 bg-black/45 p-5 shadow-2xl shadow-yellow-500/10 sm:p-6">
            <div className="flex items-center gap-2 text-sm text-zinc-400"><FontAwesomeIcon icon={faBullseye} className="h-4 w-4 text-nexora-yellow" /> Website Health Score</div>
            <div className="mt-3 flex items-end gap-3">
              <div className="text-6xl font-black text-nexora-yellow sm:text-7xl">{report.scores.overall}</div>
              <div className="pb-3 text-xl font-bold text-white">/100</div>
            </div>
            <div className="mt-2 text-lg font-semibold text-white">{scoreLabel(report.scores.overall)}</div>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{scoreGuidance(report.scores.overall)}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <PdfExportButton report={report} />
              <ShareReportButton />
              <Link href={`/audit?url=${encodeURIComponent(report.finalUrl)}`} className="soft-transition rounded-full border border-white/15 px-5 py-3 font-bold text-white hover:border-yellow-300/50"><FontAwesomeIcon icon={faRotateRight} className="mr-2 h-4 w-4" />Re-run</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="premium-panel p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-yellow-300/10 text-nexora-yellow ring-1 ring-yellow-300/25">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-black">{aiGenerated ? 'Groq AI Summary' : 'Audit Summary'}</h2>
                <p className="text-sm text-zinc-500">{aiGenerated ? `Generated with ${ai.model || 'Groq'}` : ai.message || 'Fallback recommendations are being shown.'}</p>
              </div>
            </div>
            <Badge variant={aiGenerated ? 'brand' : 'warning'}>{aiGenerated ? 'AI generated' : 'Fallback'}</Badge>
          </div>
          <p className="mt-5 text-base leading-8 text-zinc-300">{report.summary.executiveSummary}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-[10px] border border-white/10 bg-black/25 p-4"><Sparkles className="h-4 w-4 text-nexora-yellow" /><p className="mt-3 text-sm leading-6 text-zinc-400"><span className="font-bold text-white">SEO:</span> {report.summary.seoImpact}</p></div>
            <div className="rounded-[10px] border border-white/10 bg-black/25 p-4"><TrendingUp className="h-4 w-4 text-emerald-300" /><p className="mt-3 text-sm leading-6 text-zinc-400"><span className="font-bold text-white">CRO:</span> {report.summary.croImpact}</p></div>
            <div className="rounded-[10px] border border-white/10 bg-black/25 p-4"><Gauge className="h-4 w-4 text-blue-300" /><p className="mt-3 text-sm leading-6 text-zinc-400"><span className="font-bold text-white">Business:</span> {report.summary.businessImpact}</p></div>
          </div>
        </div>
        <div className="premium-panel p-6">
          <h2 className="text-xl font-black">Top Priority Fixes</h2>
          <p className="mt-2 text-sm text-zinc-500">Highest impact actions based on this audit.</p>
          <div className="mt-5 space-y-3">
            {report.summary.topFixes.slice(0, 3).map((fix, index) => (
              <div key={`${fix.title}-${index}`} className="rounded-[10px] border border-white/10 bg-white/[0.035] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-white">{fix.title}</p>
                  <Badge variant="brand">{fix.priority}</Badge>
                </div>
                <p className="mt-2 text-xs leading-5 text-zinc-500">{fix.expectedImpact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="glass-card soft-transition rounded-[10px] p-5"><FontAwesomeIcon icon={faExclamationCircle} className="h-5 w-5 text-red-300" /><div className="mt-3 text-3xl font-black text-red-200">{counts.critical}</div><div className="text-sm text-red-100/80">Critical issues</div></div>
        <div className="glass-card soft-transition rounded-[10px] p-5"><FontAwesomeIcon icon={faTriangleExclamation} className="h-5 w-5 text-yellow-100" /><div className="mt-3 text-3xl font-black text-yellow-100">{counts.warning}</div><div className="text-sm text-yellow-100/80">Warnings</div></div>
        <div className="glass-card soft-transition rounded-[10px] p-5"><FontAwesomeIcon icon={faLightbulb} className="h-5 w-5 text-blue-100" /><div className="mt-3 text-3xl font-black text-blue-100">{counts.notice}</div><div className="text-sm text-blue-100/80">Opportunities</div></div>
        <div className="glass-card soft-transition rounded-[10px] p-5"><FontAwesomeIcon icon={faCircleCheck} className="h-5 w-5 text-emerald-100" /><div className="mt-3 text-3xl font-black text-emerald-100">{counts.passed}</div><div className="text-sm text-emerald-100/80">Passed checks</div></div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {scoreCards.map(([label, key, detail]) => <ScoreCard key={key} label={label} score={scoreValue(report, key)} detail={detail} />)}
      </section>

      <ReportCharts report={report} />

      {pageSpeed ? (
        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {(['mobile', 'desktop'] as const).map((strategy) => {
            const data = pageSpeed[strategy]
            return (
              <div key={strategy} className="glass-card rounded-[10px] p-6">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-xl font-black capitalize">PageSpeed {strategy}</h2>
                  <Badge variant={data?.performanceScore && data.performanceScore >= 80 ? 'passed' : 'warning'}>{data?.performanceScore ?? 'N/A'}/100</Badge>
                </div>
                {data ? (
                  <div className="mt-4 grid gap-3 text-sm text-zinc-400 sm:grid-cols-2">
                    <p><span className="font-semibold text-white">FCP:</span> {data.firstContentfulPaint || 'N/A'}</p>
                    <p><span className="font-semibold text-white">LCP:</span> {data.largestContentfulPaint || 'N/A'}</p>
                    <p><span className="font-semibold text-white">CLS:</span> {data.cumulativeLayoutShift || 'N/A'}</p>
                    <p><span className="font-semibold text-white">TBT:</span> {data.totalBlockingTime || 'N/A'}</p>
                    <p><span className="font-semibold text-white">Speed Index:</span> {data.speedIndex || 'N/A'}</p>
                  </div>
                ) : <p className="mt-4 text-sm text-zinc-500">PageSpeed data was not available for this strategy.</p>}
              </div>
            )
          })}
        </section>
      ) : null}

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="premium-panel p-6">
          <h2 className="text-2xl font-black">Website summary</h2>
          <p className="mt-4 text-sm leading-7 text-zinc-400">This section gives a quick technical snapshot of the audited page so clients can understand what was actually checked.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[10px] border border-white/10 bg-black/25 p-4"><div className="text-xs text-zinc-500">Overall score</div><div className="mt-1 text-2xl font-black text-nexora-yellow">{report.scores.overall}/100</div></div>
            <div className="rounded-[10px] border border-white/10 bg-black/25 p-4"><div className="text-xs text-zinc-500">Audit status</div><div className="mt-1 text-2xl font-black text-emerald-200">Completed</div></div>
          </div>
        </div>
        <div className="premium-panel p-6">
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
            <div key={`${fix.title}-${index}`} className="glass-card soft-transition rounded-[10px] p-6">
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

      <section className="glass-card mt-8 rounded-[10px] p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h2 className="text-2xl font-black">Detailed audit findings</h2>
            <p className="mt-2 text-sm text-zinc-400">Filter by severity or review each section to understand what to fix and why it matters.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', 'critical', 'warning', 'notice', 'passed'] as const).map((severity) => (
              <button key={severity} onClick={() => setActiveSeverity(severity)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${activeSeverity === severity ? 'border-yellow-300 bg-yellow-300 text-black' : 'border-white/10 bg-black/20 text-zinc-300 hover:border-yellow-300/50'}`}>{severity}</button>
            ))}
            <select value={activeCategory} onChange={(event) => setActiveCategory(event.target.value)} className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm font-semibold text-zinc-200 outline-none focus:border-yellow-300/50">
              <option value="all">All categories</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
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
            <div key={section.title} className="glass-card rounded-[10px] p-6">
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

      <section className="glass-card animate-glow-pulse mt-8 rounded-[10px] p-6 text-center">
        <h2 className="text-2xl font-black">Need help improving this score?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-300">Nexora Creation can help turn these audit findings into a practical SEO, website performance, and conversion improvement plan.</p>
        <a href="https://nexoracreation.com" target="_blank" rel="noreferrer" className="soft-transition mt-5 inline-flex rounded-full bg-nexora-yellow px-6 py-3 font-bold text-black hover:bg-yellow-300"><FontAwesomeIcon icon={faArrowTrendUp} className="mr-2 h-4 w-4" />Visit Nexora Creation</a>
      </section>
    </main>
  )
}
