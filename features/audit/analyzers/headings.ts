import type { CheerioAPI } from 'cheerio'
import { issue, pass } from '@/features/audit/engine/issueFactory'
import type { AuditIssue } from '@/types/audit'

export function analyzeHeadings($: CheerioAPI): AuditIssue[] {
  const h1s = $('h1').map((_, el) => $(el).text().trim()).get().filter(Boolean)
  const emptyHeadings = $('h1,h2,h3,h4,h5,h6').filter((_, el) => !$(el).text().trim()).length
  const h2Count = $('h2').length
  const issues: AuditIssue[] = []

  if (h1s.length === 1) issues.push(pass('One H1 exists', 'Headings', `Found one H1: ${h1s[0]}`))
  if (h1s.length === 0) issues.push(issue({ title: 'Missing H1', category: 'Headings', description: 'The page does not have a visible H1 heading.', severity: 'critical', priority: 'high', scoreImpact: 10, recommendation: 'Add one descriptive H1 that states the primary page topic.' }))
  if (h1s.length > 1) issues.push(issue({ title: 'Multiple H1 headings', category: 'Headings', description: 'Multiple H1 tags can dilute topical clarity.', severity: 'warning', priority: 'medium', scoreImpact: 4, recommendation: 'Use one primary H1 and demote supporting headings to H2/H3.', evidence: { h1s } }))
  if (h2Count === 0) issues.push(issue({ title: 'No H2 structure', category: 'Headings', description: 'The page has no H2 headings to structure sections.', severity: 'notice', priority: 'low', scoreImpact: 2, recommendation: 'Add descriptive H2 headings for major page sections.' }))
  if (emptyHeadings > 0) issues.push(issue({ title: 'Empty headings found', category: 'Headings', description: 'Some heading tags are empty.', severity: 'warning', priority: 'medium', scoreImpact: 3, recommendation: 'Remove empty headings or add descriptive text.', evidence: { emptyHeadings } }))

  return issues
}
