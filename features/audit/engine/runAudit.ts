import * as cheerio from 'cheerio'
import { nanoid } from 'nanoid'
import { analyzeContent } from '@/features/audit/analyzers/content'
import { analyzeCro } from '@/features/audit/analyzers/cro'
import { analyzeHeadings } from '@/features/audit/analyzers/headings'
import { analyzeImages } from '@/features/audit/analyzers/images'
import { analyzeLinks } from '@/features/audit/analyzers/links'
import { analyzeMeta } from '@/features/audit/analyzers/meta'
import { pageSpeedIssues, runPageSpeed } from '@/features/audit/analyzers/pageSpeed'
import { analyzeSecurity } from '@/features/audit/analyzers/security'
import { extractPage } from '@/features/audit/crawler/extractPage'
import { extractFavicon } from '@/features/audit/crawler/extractFavicon'
import { fetchHtml } from '@/features/audit/crawler/fetchHtml'
import { issue, pass } from './issueFactory'
import { scoreReport } from './scoreReport'
import { generateGroqSummary } from '@/features/audit/recommendations/groqProvider'
import type { AuditIssue, AuditReport } from '@/types/audit'

function analyzeTechnical(fetchResult: Awaited<ReturnType<typeof fetchHtml>>): AuditIssue[] {
  const issues: AuditIssue[] = []
  issues.push(fetchResult.statusCode === 200 ? pass('HTTP status is 200', 'Technical SEO', 'The page returned a successful HTTP response.', { statusCode: fetchResult.statusCode }) : issue({ title: 'HTTP status is not 200', category: 'Technical SEO', description: `The page returned HTTP ${fetchResult.statusCode}.`, severity: 'critical', priority: 'high', scoreImpact: 15, recommendation: 'Ensure the audited URL returns a 200 response for users and crawlers.' }))
  issues.push(fetchResult.contentType.includes('text/html') ? pass('Content type is HTML', 'Technical SEO', 'The response is HTML.') : issue({ title: 'Non-HTML content type', category: 'Technical SEO', description: 'The response content type does not look like HTML.', severity: 'critical', priority: 'high', scoreImpact: 12, recommendation: 'Audit a valid HTML page URL.' }))
  if (fetchResult.redirectChain.length > 2) issues.push(issue({ title: 'Long redirect chain', category: 'Technical SEO', description: 'The URL redirects more than twice before reaching the final page.', severity: 'warning', priority: 'medium', scoreImpact: 5, recommendation: 'Reduce redirects and point links directly to the final canonical URL.', evidence: { redirectChain: fetchResult.redirectChain } }))
  issues.push(fetchResult.responseTimeMs <= 2000 ? pass('Initial response is fast', 'Performance', 'The HTML response arrived within 2 seconds.', { responseTimeMs: fetchResult.responseTimeMs }) : issue({ title: 'Slow initial response', category: 'Performance', description: 'The HTML response took longer than 2 seconds.', severity: 'warning', priority: 'high', scoreImpact: 8, recommendation: 'Improve hosting, caching, database performance, or edge delivery.', evidence: { responseTimeMs: fetchResult.responseTimeMs } }))
  if (!fetchResult.headers['cache-control']) issues.push(issue({ title: 'Missing cache-control header', category: 'Performance', description: 'The page does not send a cache-control header.', severity: 'notice', priority: 'low', scoreImpact: 2, recommendation: 'Set appropriate cache headers for HTML and static assets.' }))
  return issues
}

function analyzeAiSeo($: cheerio.CheerioAPI): AuditIssue[] {
  const text = $('body').text()
  const hasFaq = /faq|frequently asked|questions/i.test(text)
  const questionHeadings = $('h2,h3').filter((_, el) => /\?$|^(what|why|how|when|where|who)\b/i.test($(el).text().trim())).length
  const jsonLd = $('script[type="application/ld+json"]').length
  const issues: AuditIssue[] = []
  issues.push(hasFaq || questionHeadings > 0 ? pass('Answer-ready content detected', 'AI SEO', 'The page includes FAQ or question-style content.') : issue({ title: 'Limited answer-ready content', category: 'AI SEO', description: 'The page does not appear to include FAQs or direct question-answer sections.', severity: 'notice', priority: 'medium', scoreImpact: 3, recommendation: 'Add concise FAQs, definitions, and direct answers for common buyer questions.' }))
  issues.push(jsonLd > 0 ? pass('Structured data detected', 'Schema', 'JSON-LD structured data exists.', { jsonLd }) : issue({ title: 'No JSON-LD schema detected', category: 'Schema', description: 'Structured data helps search engines understand entities and page purpose.', severity: 'notice', priority: 'medium', scoreImpact: 3, recommendation: 'Add Organization, LocalBusiness, Breadcrumb, FAQ, or relevant schema.' }))
  return issues
}

export async function runAudit(inputUrl: string): Promise<AuditReport> {
  const fetchResult = await fetchHtml(inputUrl)
  const $ = cheerio.load(fetchResult.html)
  const pageSpeed = await runPageSpeed(fetchResult.finalUrl).catch((error) => {
    console.warn('PageSpeed audit failed. Continuing with custom checks.', error instanceof Error ? error.message : error)
    return null
  })
  const analyzerResults = await Promise.allSettled([
    Promise.resolve(analyzeTechnical(fetchResult)),
    Promise.resolve(analyzeMeta($, fetchResult.finalUrl)),
    Promise.resolve(analyzeHeadings($)),
    Promise.resolve(analyzeContent($, fetchResult.html)),
    Promise.resolve(analyzeImages($)),
    Promise.resolve(analyzeLinks($, fetchResult.finalUrl)),
    Promise.resolve(analyzeSecurity($, fetchResult)),
    Promise.resolve(analyzeCro($)),
    Promise.resolve(analyzeAiSeo($)),
    Promise.resolve(pageSpeedIssues(pageSpeed))
  ])

  const issues = analyzerResults.flatMap((result) => result.status === 'fulfilled' ? result.value : [issue({ title: 'Audit module failed', category: 'Technical SEO', description: result.reason instanceof Error ? result.reason.message : 'An audit module failed.', severity: 'notice', priority: 'low', scoreImpact: 1, recommendation: 'Re-run the audit or inspect server logs.' })])
  const scores = scoreReport(issues)
  const final = new URL(fetchResult.finalUrl)
  const favicon = extractFavicon($, fetchResult.finalUrl)
  const aiRecommendations = await generateGroqSummary(issues, final.hostname)

  return {
    id: nanoid(12),
    url: inputUrl,
    finalUrl: fetchResult.finalUrl,
    domain: final.hostname,
    favicon,
    createdAt: new Date().toISOString(),
    scores,
    issues,
    summary: aiRecommendations.summary,
    pages: [extractPage($, fetchResult)],
    raw: {
      statusCode: fetchResult.statusCode,
      contentType: fetchResult.contentType,
      responseTimeMs: fetchResult.responseTimeMs,
      redirectChain: fetchResult.redirectChain,
      headers: fetchResult.headers,
      pageSpeed,
      ai: {
        status: aiRecommendations.status,
        provider: aiRecommendations.provider,
        model: aiRecommendations.model,
        message: aiRecommendations.message
      }
    }
  }
}
