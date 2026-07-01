import type { CheerioAPI } from 'cheerio'
import { issue, pass } from '@/features/audit/engine/issueFactory'
import type { AuditIssue } from '@/types/audit'

export function analyzeImages($: CheerioAPI): AuditIssue[] {
  const images = $('img')
  const missingAlt = images.filter((_, el) => $(el).attr('alt') === undefined).length
  const emptyAlt = images.filter((_, el) => $(el).attr('alt') === '').length
  const lazy = images.filter((_, el) => $(el).attr('loading') === 'lazy').length
  const issues: AuditIssue[] = []

  issues.push(missingAlt === 0 ? pass('Images include alt attributes', 'Images', 'All images declare alt attributes.', { imageCount: images.length }) : issue({ title: 'Images missing alt attributes', category: 'Images', description: 'Some images do not have alt attributes.', severity: 'warning', priority: 'medium', scoreImpact: Math.min(8, missingAlt), recommendation: 'Add descriptive alt text for meaningful images and empty alt for decorative images.', evidence: { missingAlt, imageCount: images.length } }))
  if (emptyAlt > 0) issues.push(issue({ title: 'Images with empty alt text', category: 'Images', description: 'Some images have empty alt text.', severity: 'notice', priority: 'low', scoreImpact: 2, recommendation: 'Confirm empty alt text is only used for decorative images.', evidence: { emptyAlt } }))
  if (images.length > 5 && lazy === 0) issues.push(issue({ title: 'No lazy-loaded images detected', category: 'Performance', description: 'Images below the fold may be loaded immediately.', severity: 'notice', priority: 'low', scoreImpact: 2, recommendation: 'Lazy load non-critical images while keeping the likely LCP image eager.' }))

  return issues
}
