import type { CheerioAPI } from 'cheerio'
import { issue, pass } from '@/features/audit/engine/issueFactory'
import type { AuditIssue, FetchResult } from '@/types/audit'

export function analyzeSecurity($: CheerioAPI, fetchResult: FetchResult): AuditIssue[] {
  const headers = fetchResult.headers
  const finalUrl = new URL(fetchResult.finalUrl)
  const mixedContent = $('[src^="http://"],[href^="http://"]').length
  const issues: AuditIssue[] = []

  issues.push(finalUrl.protocol === 'https:' ? pass('HTTPS enabled', 'Security', 'The final URL uses HTTPS.') : issue({ title: 'HTTPS is not enabled', category: 'Security', description: 'The final audited URL is not using HTTPS.', severity: 'critical', priority: 'high', scoreImpact: 15, recommendation: 'Install TLS and redirect HTTP traffic to HTTPS.' }))
  issues.push(headers['strict-transport-security'] ? pass('HSTS header present', 'Security', 'Strict-Transport-Security is configured.') : issue({ title: 'Missing HSTS header', category: 'Security', description: 'The site does not send Strict-Transport-Security.', severity: 'notice', priority: 'medium', scoreImpact: 3, recommendation: 'Add an HSTS header after confirming HTTPS is correctly configured.' }))
  issues.push(headers['content-security-policy'] ? pass('CSP header present', 'Security', 'Content-Security-Policy is configured.') : issue({ title: 'Missing Content-Security-Policy', category: 'Security', description: 'A CSP can reduce cross-site scripting risk.', severity: 'notice', priority: 'medium', scoreImpact: 3, recommendation: 'Add a practical CSP that allows required first-party and trusted third-party assets.' }))
  if (mixedContent > 0) issues.push(issue({ title: 'Mixed content references found', category: 'Security', description: 'HTTPS pages should not load HTTP assets or links.', severity: 'warning', priority: 'medium', scoreImpact: 5, recommendation: 'Replace HTTP asset URLs with HTTPS URLs.', evidence: { mixedContent } }))

  return issues
}
