import { env } from '@/lib/env'
import { issue, pass } from '@/features/audit/engine/issueFactory'
import type { AuditIssue } from '@/types/audit'

export type PageSpeedStrategyResult = {
  strategy: 'mobile' | 'desktop'
  performanceScore: number | null
  firstContentfulPaint: string | null
  largestContentfulPaint: string | null
  cumulativeLayoutShift: string | null
  totalBlockingTime: string | null
  speedIndex: string | null
}

export type PageSpeedResult = {
  mobile: PageSpeedStrategyResult | null
  desktop: PageSpeedStrategyResult | null
}

function auditValue(data: unknown, key: string) {
  const audits = (data as { lighthouseResult?: { audits?: Record<string, { displayValue?: string }> } }).lighthouseResult?.audits
  return audits?.[key]?.displayValue || null
}

function performanceScore(data: unknown) {
  const score = (data as { lighthouseResult?: { categories?: { performance?: { score?: number } } } }).lighthouseResult?.categories?.performance?.score
  return typeof score === 'number' ? Math.round(score * 100) : null
}

async function fetchStrategy(url: string, strategy: 'mobile' | 'desktop'): Promise<PageSpeedStrategyResult | null> {
  const requestUrl = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed')
  requestUrl.searchParams.set('url', url)
  requestUrl.searchParams.set('strategy', strategy)
  requestUrl.searchParams.set('category', 'performance')
  requestUrl.searchParams.set('key', env.pageSpeedApiKey)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)
  try {
    const response = await fetch(requestUrl, { signal: controller.signal })
    if (!response.ok) throw new Error(`PageSpeed ${strategy} request failed with ${response.status}`)
    const data = await response.json()
    return {
      strategy,
      performanceScore: performanceScore(data),
      firstContentfulPaint: auditValue(data, 'first-contentful-paint'),
      largestContentfulPaint: auditValue(data, 'largest-contentful-paint'),
      cumulativeLayoutShift: auditValue(data, 'cumulative-layout-shift'),
      totalBlockingTime: auditValue(data, 'total-blocking-time'),
      speedIndex: auditValue(data, 'speed-index')
    }
  } finally {
    clearTimeout(timeout)
  }
}

export async function runPageSpeed(url: string): Promise<PageSpeedResult | null> {
  if (!env.pageSpeedApiKey) {
    console.warn('PAGESPEED_API_KEY is missing. Continuing with custom performance checks only.')
    return null
  }

  const [mobile, desktop] = await Promise.allSettled([fetchStrategy(url, 'mobile'), fetchStrategy(url, 'desktop')])
  return {
    mobile: mobile.status === 'fulfilled' ? mobile.value : null,
    desktop: desktop.status === 'fulfilled' ? desktop.value : null
  }
}

export function pageSpeedIssues(result: PageSpeedResult | null): AuditIssue[] {
  if (!result) return []
  const issues: AuditIssue[] = []
  const values = [result.mobile, result.desktop].filter(Boolean) as PageSpeedStrategyResult[]

  for (const item of values) {
    if (item.performanceScore === null) continue
    if (item.performanceScore >= 80) {
      issues.push(pass(`PageSpeed ${item.strategy} performance is healthy`, 'Performance', `Google PageSpeed ${item.strategy} score is ${item.performanceScore}/100.`, { pageSpeed: item }))
    } else {
      issues.push(issue({
        title: `PageSpeed ${item.strategy} score needs improvement`,
        category: 'Performance',
        description: `Google PageSpeed returned a ${item.strategy} performance score of ${item.performanceScore}/100.`,
        severity: item.performanceScore < 50 ? 'critical' : 'warning',
        priority: item.performanceScore < 50 ? 'high' : 'medium',
        scoreImpact: item.performanceScore < 50 ? 12 : 7,
        recommendation: 'Improve Core Web Vitals, reduce render-blocking resources, optimize images, and improve server response time.',
        whyItMatters: 'Slow pages reduce user trust, organic visibility, and conversion rates.',
        howToFix: 'Start with LCP image optimization, caching, code splitting, unused JavaScript cleanup, and font loading improvements.',
        evidence: { pageSpeed: item }
      }))
    }
  }

  return issues
}
