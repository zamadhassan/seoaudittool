import type { AuditIssue } from '@/types/audit'

const severityClass = {
  critical: 'bg-red-500/15 text-red-200 border-red-400/30',
  warning: 'bg-yellow-500/15 text-yellow-100 border-yellow-400/30',
  notice: 'bg-blue-500/15 text-blue-100 border-blue-400/30',
  passed: 'bg-emerald-500/15 text-emerald-100 border-emerald-400/30'
}

export function IssueCard({ issue }: { issue: AuditIssue }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityClass[issue.severity]}`}>{issue.severity}</span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300">{issue.category}</span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300">{issue.priority} priority</span>
        {issue.scoreImpact > 0 ? <span className="text-xs text-zinc-500">-{issue.scoreImpact} pts</span> : null}
      </div>
      <h3 className="mt-4 text-lg font-bold">{issue.title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{issue.description}</p>
      <p className="mt-3 text-sm text-zinc-300"><span className="font-semibold text-white">Fix:</span> {issue.howToFix || issue.recommendation}</p>
    </article>
  )
}
