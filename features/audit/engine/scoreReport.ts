import { clampScore } from '@/lib/utils'
import type { AuditIssue, AuditScores } from '@/types/audit'

const categoryMap: Record<keyof Omit<AuditScores, 'overall'>, string[]> = {
  technical: ['Technical SEO', 'Schema', 'Links', 'Images'],
  performance: ['Performance'],
  accessibility: ['Accessibility'],
  security: ['Security'],
  crawlability: ['Crawlability'],
  indexability: ['Indexability'],
  onPage: ['On-page SEO', 'Content', 'Headings', 'Meta'],
  cro: ['CRO', 'Google Ads'],
  mobile: ['Mobile UX'],
  aiSeo: ['AI SEO']
}

const weights = {
  technical: 0.25,
  performance: 0.2,
  cro: 0.2,
  crawlability: 0.06,
  indexability: 0.06,
  accessibility: 0.08,
  security: 0.07,
  onPage: 0.05,
  mobile: 0,
  aiSeo: 0.03
}

function scoreCategory(issues: AuditIssue[], categories: string[]) {
  const penalty = issues
    .filter((item) => categories.includes(item.category) && item.severity !== 'passed')
    .reduce((total, item) => total + item.scoreImpact, 0)
  return clampScore(100 - penalty)
}

export function scoreReport(issues: AuditIssue[]): AuditScores {
  const scores = {
    technical: scoreCategory(issues, categoryMap.technical),
    performance: scoreCategory(issues, categoryMap.performance),
    accessibility: scoreCategory(issues, categoryMap.accessibility),
    security: scoreCategory(issues, categoryMap.security),
    crawlability: scoreCategory(issues, categoryMap.crawlability),
    indexability: scoreCategory(issues, categoryMap.indexability),
    onPage: scoreCategory(issues, categoryMap.onPage),
    cro: scoreCategory(issues, categoryMap.cro),
    mobile: scoreCategory(issues, categoryMap.mobile),
    aiSeo: scoreCategory(issues, categoryMap.aiSeo)
  }

  const overall = clampScore(Object.entries(weights).reduce((total, [key, weight]) => total + scores[key as keyof typeof scores] * weight, 0))
  return { overall, ...scores }
}
