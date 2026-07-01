import type { AuditIssue, AuditPriority, AuditSeverity } from '@/types/audit'

export function issue(input: Omit<AuditIssue, 'severity' | 'priority' | 'scoreImpact'> & {
  severity?: AuditSeverity
  priority?: AuditPriority
  scoreImpact?: number
}): AuditIssue {
  return {
    severity: input.severity || 'notice',
    priority: input.priority || 'low',
    scoreImpact: input.scoreImpact || 1,
    ...input
  }
}

export function pass(title: string, category: string, description: string, evidence?: Record<string, unknown>): AuditIssue {
  return issue({
    title,
    category,
    description,
    severity: 'passed',
    priority: 'low',
    scoreImpact: 0,
    recommendation: 'No action needed.',
    evidence
  })
}
