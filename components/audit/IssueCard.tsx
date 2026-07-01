import type { AuditIssue } from '@/types/audit'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleInfo, faTriangleExclamation, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'

const severityClass = {
  critical: 'bg-red-500/15 text-red-200 border-red-400/30',
  warning: 'bg-yellow-500/15 text-yellow-100 border-yellow-400/30',
  notice: 'bg-blue-500/15 text-blue-100 border-blue-400/30',
  passed: 'bg-emerald-500/15 text-emerald-100 border-emerald-400/30'
}

const severityIcon = {
  critical: faXmarkCircle,
  warning: faTriangleExclamation,
  notice: faCircleInfo,
  passed: faCircleCheck
}

export function IssueCard({ issue }: { issue: AuditIssue }) {
  return (
    <article className="rounded-[10px] border border-white/10 bg-white/[0.035] p-5 transition hover:border-yellow-300/30 hover:bg-white/[0.055]">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${severityClass[issue.severity]}`}><FontAwesomeIcon icon={severityIcon[issue.severity]} className="h-3 w-3" />{issue.severity}</span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300">{issue.category}</span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300">{issue.priority} priority</span>
        {issue.scoreImpact > 0 ? <span className="text-xs text-zinc-500">-{issue.scoreImpact} pts</span> : null}
      </div>
      <h3 className="mt-4 text-lg font-bold">{issue.title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{issue.description}</p>
      <div className="mt-4 rounded-[10px] border border-white/10 bg-black/20 p-4 text-sm leading-6 text-zinc-300">
        <p><span className="font-semibold text-white">Recommended fix:</span> {issue.howToFix || issue.recommendation}</p>
        {issue.whyItMatters ? <p className="mt-2"><span className="font-semibold text-white">Why it matters:</span> {issue.whyItMatters}</p> : null}
        {issue.businessImpact ? <p className="mt-2"><span className="font-semibold text-white">Business impact:</span> {issue.businessImpact}</p> : null}
      </div>
      {issue.evidence ? (
        <details className="mt-3 rounded-[10px] border border-white/10 bg-black/20 p-4 text-xs text-zinc-400">
          <summary className="cursor-pointer font-semibold text-zinc-200">Evidence</summary>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap">{JSON.stringify(issue.evidence, null, 2)}</pre>
        </details>
      ) : null}
    </article>
  )
}
