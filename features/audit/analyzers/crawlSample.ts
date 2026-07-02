import { issue, pass } from '@/features/audit/engine/issueFactory'
import type { AuditIssue, CrawledPage } from '@/types/audit'

export function analyzeCrawlSample(pages: CrawledPage[], requestedLimit: number): AuditIssue[] {
  const sampledPages = pages.slice(1)
  const issues: AuditIssue[] = []

  if (sampledPages.length) {
    issues.push(pass('Internal page crawl completed', 'Crawlability', `The audit sampled ${sampledPages.length} internal page${sampledPages.length === 1 ? '' : 's'} from this site.`, { crawledPages: pages.length, requestedLimit }))
  } else {
    issues.push(issue({
      title: 'No internal pages were crawled',
      category: 'Crawlability',
      description: 'The homepage did not expose crawlable internal HTML links in the sample, or the linked pages could not be fetched.',
      severity: 'notice',
      priority: 'low',
      scoreImpact: 2,
      recommendation: 'Make sure important service, contact, blog, and location pages are linked from the homepage or main navigation.',
      whyItMatters: 'Internal links help users and search engines discover important pages.'
    }))
  }

  for (const page of sampledPages) {
    if (!page.title) {
      issues.push(issue({
        title: 'Internal page missing title tag',
        category: 'On-page SEO',
        description: 'A crawled internal page does not have a title tag.',
        severity: 'warning',
        priority: 'medium',
        scoreImpact: 4,
        recommendation: 'Add a unique title tag to every important internal page.',
        affectedUrl: page.url,
        evidence: { url: page.url }
      }))
    }
    if (!page.metaDescription) {
      issues.push(issue({
        title: 'Internal page missing meta description',
        category: 'On-page SEO',
        description: 'A crawled internal page does not have a meta description.',
        severity: 'notice',
        priority: 'medium',
        scoreImpact: 2,
        recommendation: 'Add a clear meta description that explains the page and encourages clicks.',
        affectedUrl: page.url,
        evidence: { url: page.url }
      }))
    }
    if (!page.h1) {
      issues.push(issue({
        title: 'Internal page missing H1',
        category: 'Headings',
        description: 'A crawled internal page does not have a primary H1 heading.',
        severity: 'warning',
        priority: 'medium',
        scoreImpact: 4,
        recommendation: 'Add one clear H1 heading that describes the page purpose.',
        affectedUrl: page.url,
        evidence: { url: page.url }
      }))
    }
    if (page.wordCount > 0 && page.wordCount < 200) {
      issues.push(issue({
        title: 'Internal page may have thin content',
        category: 'Content',
        description: 'A crawled internal page has very little visible text.',
        severity: 'notice',
        priority: 'low',
        scoreImpact: 2,
        recommendation: 'Add helpful copy, proof, FAQs, and next steps where this page is important for SEO or conversion.',
        affectedUrl: page.url,
        evidence: { url: page.url, wordCount: page.wordCount }
      }))
    }
  }

  return issues
}
