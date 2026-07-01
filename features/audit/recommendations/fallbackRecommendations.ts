import type { AuditIssue, AuditSummary } from '@/types/audit'

export function buildFallbackSummary(issues: AuditIssue[]): AuditSummary {
  const topIssues = issues
    .filter((item) => item.severity !== 'passed')
    .sort((a, b) => b.scoreImpact - a.scoreImpact)
    .slice(0, 5)

  return {
    executiveSummary: topIssues.length
      ? `The audit found ${topIssues.length} high-impact opportunities to improve SEO, conversion readiness, accessibility, and trust signals.`
      : 'The audited page passed the main baseline checks. Continue monitoring performance, content quality, and conversion paths.',
    topFixes: topIssues.map((item) => ({
      title: item.title,
      priority: item.priority,
      whyItMatters: item.whyItMatters || item.description,
      howToFix: item.howToFix || item.recommendation,
      expectedImpact: item.businessImpact || item.seoImpact || item.croImpact || 'Improves audit score and user experience.'
    })),
    businessImpact: 'Prioritize fixes that make the offer clearer, increase trust, and reduce friction for visitors.',
    seoImpact: 'Fix indexability, metadata, headings, internal links, and crawlable content before advanced SEO work.',
    croImpact: 'Make the primary CTA obvious, add proof, and give users multiple low-friction ways to contact the business.'
  }
}
