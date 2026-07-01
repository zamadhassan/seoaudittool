import type { CheerioAPI } from 'cheerio'
import { issue, pass } from '@/features/audit/engine/issueFactory'
import type { AuditIssue } from '@/types/audit'

export function analyzeMeta($: CheerioAPI, finalUrl: string): AuditIssue[] {
  const title = $('title').first().text().trim()
  const description = $('meta[name="description"]').attr('content')?.trim() || ''
  const canonical = $('link[rel="canonical"]').attr('href') || ''
  const robots = $('meta[name="robots"]').attr('content') || ''
  const viewport = $('meta[name="viewport"]').attr('content') || ''
  const lang = $('html').attr('lang') || ''
  const issues: AuditIssue[] = []

  issues.push(title ? pass('Title tag exists', 'Meta', `Found title: ${title}`, { length: title.length }) : issue({ title: 'Missing title tag', category: 'Meta', description: 'This page does not have a title tag.', severity: 'critical', priority: 'high', scoreImpact: 12, recommendation: 'Add a unique title tag that describes the page.', whyItMatters: 'The title is one of the strongest on-page SEO and click-through signals.', howToFix: 'Write a 50-60 character title including the primary topic and brand.' }))
  if (title && (title.length < 30 || title.length > 65)) issues.push(issue({ title: 'Title length is not ideal', category: 'Meta', description: 'The title should usually be between 50 and 60 characters.', severity: 'warning', priority: 'medium', scoreImpact: 4, recommendation: 'Rewrite the title to be concise and descriptive.', evidence: { length: title.length } }))

  issues.push(description ? pass('Meta description exists', 'Meta', `Found meta description.`, { length: description.length }) : issue({ title: 'Missing meta description', category: 'Meta', description: 'This page does not have a meta description tag.', severity: 'warning', priority: 'medium', scoreImpact: 5, recommendation: 'Add a unique 150-160 character meta description.', whyItMatters: 'A useful description can improve organic search click-through rate.', howToFix: 'Summarize the offer, target audience, and next step in plain language.' }))
  if (description && (description.length < 120 || description.length > 170)) issues.push(issue({ title: 'Meta description length needs work', category: 'Meta', description: 'The meta description is outside the preferred length range.', severity: 'notice', priority: 'low', scoreImpact: 2, recommendation: 'Aim for about 150-160 characters.', evidence: { length: description.length } }))

  issues.push(canonical ? pass('Canonical tag exists', 'Meta', 'A canonical URL is present.', { canonical }) : issue({ title: 'Missing canonical tag', category: 'Meta', description: 'The page does not declare a canonical URL.', severity: 'warning', priority: 'medium', scoreImpact: 4, recommendation: 'Add a canonical link tag pointing to the preferred URL.' }))
  if (canonical && !/^https?:\/\//i.test(canonical)) issues.push(issue({ title: 'Canonical is not absolute', category: 'Meta', description: 'Canonical URLs should be absolute.', severity: 'warning', priority: 'medium', scoreImpact: 4, recommendation: 'Use a full canonical URL including protocol and hostname.', evidence: { canonical, finalUrl } }))

  issues.push(viewport ? pass('Viewport meta tag exists', 'Mobile UX', 'The page declares a viewport tag.') : issue({ title: 'Missing viewport tag', category: 'Mobile UX', description: 'The page may not render correctly on mobile devices.', severity: 'critical', priority: 'high', scoreImpact: 10, recommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.' }))
  issues.push(lang ? pass('HTML lang attribute exists', 'Accessibility', 'The document declares a language.', { lang }) : issue({ title: 'Missing HTML lang attribute', category: 'Accessibility', description: 'Screen readers and search engines cannot determine the page language.', severity: 'warning', priority: 'medium', scoreImpact: 5, recommendation: 'Add a lang attribute to the html element.' }))
  if (/noindex/i.test(robots)) issues.push(issue({ title: 'Page has noindex directive', category: 'Indexability', description: 'The robots meta tag tells search engines not to index this page.', severity: 'critical', priority: 'high', scoreImpact: 15, recommendation: 'Remove noindex if this page should appear in search results.', evidence: { robots } }))

  return issues
}
