import type { CheerioAPI } from 'cheerio'
import { issue, pass } from '@/features/audit/engine/issueFactory'
import type { AuditIssue } from '@/types/audit'

export function analyzeLinks($: CheerioAPI, finalUrl: string): AuditIssue[] {
  const base = new URL(finalUrl)
  const links = $('a[href]')
  let internal = 0
  let external = 0
  let emptyText = 0
  let unsafeBlank = 0
  let ctaLinks = 0

  links.each((_, el) => {
    const href = $(el).attr('href') || ''
    const text = $(el).text().trim()
    if (!text && !$(el).attr('aria-label')) emptyText += 1
    if (/contact|quote|call|book|get started|audit|buy|cart/i.test(`${text} ${href}`)) ctaLinks += 1
    if ($(el).attr('target') === '_blank' && !/noopener|noreferrer/i.test($(el).attr('rel') || '')) unsafeBlank += 1
    try {
      const url = new URL(href, finalUrl)
      if (url.hostname === base.hostname) internal += 1
      else external += 1
    } catch {}
  })

  const issues: AuditIssue[] = [pass('Links extracted', 'Links', 'The crawler found links on the page.', { total: links.length, internal, external })]
  if (internal < 3) issues.push(issue({ title: 'Low internal link count', category: 'Links', description: 'The page has very few internal links.', severity: 'notice', priority: 'low', scoreImpact: 2, recommendation: 'Link to key services, contact, about, and supporting pages.' }))
  if (emptyText > 0) issues.push(issue({ title: 'Links without accessible text', category: 'Accessibility', description: 'Some links have no text or aria-label.', severity: 'warning', priority: 'medium', scoreImpact: 4, recommendation: 'Add descriptive anchor text or aria-labels.', evidence: { emptyText } }))
  if (unsafeBlank > 0) issues.push(issue({ title: 'New-tab links missing rel protection', category: 'Security', description: 'Some target="_blank" links are missing noopener or noreferrer.', severity: 'warning', priority: 'medium', scoreImpact: 4, recommendation: 'Add rel="noopener noreferrer" to external new-tab links.', evidence: { unsafeBlank } }))
  if (ctaLinks === 0) issues.push(issue({ title: 'No clear CTA link detected', category: 'CRO', description: 'The page does not appear to include an action-focused call to action link.', severity: 'warning', priority: 'high', scoreImpact: 7, recommendation: 'Add a prominent CTA such as Get a Quote, Book a Call, or Start Audit.' }))

  return issues
}
