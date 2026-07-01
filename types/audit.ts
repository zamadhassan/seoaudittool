export type AuditSeverity = 'critical' | 'warning' | 'notice' | 'passed'
export type AuditPriority = 'high' | 'medium' | 'low'

export type AuditIssue = {
  id?: string
  title: string
  description: string
  category: string
  severity: AuditSeverity
  priority: AuditPriority
  scoreImpact: number
  recommendation: string
  whyItMatters?: string
  howToFix?: string
  businessImpact?: string
  seoImpact?: string
  croImpact?: string
  affectedUrl?: string
  evidence?: Record<string, unknown>
}

export type AuditScores = {
  overall: number
  technical: number
  performance: number
  accessibility: number
  security: number
  crawlability: number
  indexability: number
  onPage: number
  cro: number
  mobile: number
  aiSeo: number
}

export type AuditSummary = {
  executiveSummary: string
  topFixes: Array<{
    title: string
    priority: AuditPriority
    whyItMatters: string
    howToFix: string
    expectedImpact: string
  }>
  businessImpact: string
  seoImpact: string
  croImpact: string
}

export type CrawledPage = {
  url: string
  statusCode: number
  contentType: string
  title: string
  metaDescription: string
  h1: string
  wordCount: number
  internalLinks: number
  externalLinks: number
  imageCount: number
}

export type AuditReport = {
  id: string
  url: string
  finalUrl: string
  domain: string
  createdAt: string
  scores: AuditScores
  issues: AuditIssue[]
  summary: AuditSummary
  pages: CrawledPage[]
  raw: Record<string, unknown>
}

export type FetchResult = {
  requestedUrl: string
  finalUrl: string
  statusCode: number
  contentType: string
  headers: Record<string, string>
  html: string
  responseTimeMs: number
  redirectChain: string[]
}
