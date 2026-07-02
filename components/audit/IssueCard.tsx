import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { AuditIssue } from '@/types/audit'

const severityIcon = {
  critical: XCircle,
  warning: AlertTriangle,
  notice: Info,
  passed: CheckCircle2
}

function impactLabel(issue: AuditIssue) {
  if (issue.severity === 'critical' || issue.scoreImpact >= 8) return 'High impact'
  if (issue.severity === 'warning' || issue.scoreImpact >= 4) return 'Medium impact'
  return 'Low impact'
}

function difficultyLabel(issue: AuditIssue) {
  if (/schema|performance|security|javascript|lighthouse|pagespeed/i.test(issue.category + issue.title)) return 'Advanced'
  if (issue.severity === 'critical') return 'Medium'
  return 'Easy'
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function IssueCard({ issue }: { issue: AuditIssue }) {
  const Icon = severityIcon[issue.severity]

  return (
    <article className="rounded-[10px] border border-white/10 bg-white/[0.035] p-5 transition hover:border-yellow-300/30 hover:bg-white/[0.055]">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={issue.severity}><Icon className="h-3.5 w-3.5" />{titleCase(issue.severity)}</Badge>
        <Badge>{issue.category}</Badge>
        <Badge variant="brand">{impactLabel(issue)}</Badge>
        <Badge>{difficultyLabel(issue)} fix</Badge>
        {issue.scoreImpact > 0 ? <span className="text-xs text-zinc-500">-{issue.scoreImpact} pts</span> : null}
      </div>
      <h3 className="mt-4 text-lg font-bold">{issue.title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{issue.description}</p>
      <div className="mt-4 rounded-[10px] border border-white/10 bg-black/20 p-4 text-sm leading-6 text-zinc-300">
        <p><span className="font-semibold text-white">Recommendation:</span> {issue.howToFix || issue.recommendation}</p>
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
