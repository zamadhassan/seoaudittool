import type { AuditReport } from '@/types/audit'
import { env } from '@/lib/env'
import { prisma } from '@/lib/db'

const reports = new Map<string, AuditReport>()

function jsonValue(value: unknown) {
  return JSON.parse(JSON.stringify(value)) as never
}

function canUseDatabase() {
  return Boolean(env.databaseUrl)
}

export async function saveReport(report: AuditReport) {
  reports.set(report.id, report)
  if (canUseDatabase()) {
    await prisma.auditReport.create({
      data: {
        id: report.id,
        url: report.url,
        finalUrl: report.finalUrl,
        domain: report.domain,
        overallScore: report.scores.overall,
        technicalScore: report.scores.technical,
        performanceScore: report.scores.performance,
        accessibilityScore: report.scores.accessibility,
        securityScore: report.scores.security,
        crawlabilityScore: report.scores.crawlability,
        indexabilityScore: report.scores.indexability,
        onPageScore: report.scores.onPage,
        croScore: report.scores.cro,
        mobileScore: report.scores.mobile,
        aiSeoScore: report.scores.aiSeo,
        summaryJson: jsonValue(report.summary),
        rawJson: jsonValue(report.raw),
        issues: {
          create: report.issues.map((item) => ({
            title: item.title,
            description: item.description,
            category: item.category,
            severity: item.severity,
            priority: item.priority,
            scoreImpact: item.scoreImpact,
            recommendation: item.recommendation,
            whyItMatters: item.whyItMatters,
            howToFix: item.howToFix,
            businessImpact: item.businessImpact,
            seoImpact: item.seoImpact,
            croImpact: item.croImpact,
            affectedUrl: item.affectedUrl,
            evidenceJson: item.evidence ? jsonValue(item.evidence) : undefined
          }))
        },
        pages: { create: report.pages }
      }
    }).catch(() => undefined)
  }
  return report
}

export async function getReport(id: string) {
  const memoryReport = reports.get(id)
  if (memoryReport) return memoryReport
  if (!canUseDatabase()) return null

  const stored = await prisma.auditReport.findUnique({
    where: { id },
    include: { issues: true, pages: true }
  }).catch(() => null)
  if (!stored) return null

  return {
    id: stored.id,
    url: stored.url,
    finalUrl: stored.finalUrl,
    domain: stored.domain,
    createdAt: stored.createdAt.toISOString(),
    scores: {
      overall: stored.overallScore,
      technical: stored.technicalScore,
      performance: stored.performanceScore,
      accessibility: stored.accessibilityScore,
      security: stored.securityScore,
      crawlability: stored.crawlabilityScore,
      indexability: stored.indexabilityScore,
      onPage: stored.onPageScore,
      cro: stored.croScore,
      mobile: stored.mobileScore,
      aiSeo: stored.aiSeoScore
    },
    issues: stored.issues.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      severity: item.severity,
      priority: item.priority,
      scoreImpact: item.scoreImpact,
      recommendation: item.recommendation,
      whyItMatters: item.whyItMatters || undefined,
      howToFix: item.howToFix || undefined,
      businessImpact: item.businessImpact || undefined,
      seoImpact: item.seoImpact || undefined,
      croImpact: item.croImpact || undefined,
      affectedUrl: item.affectedUrl || undefined,
      evidence: typeof item.evidenceJson === 'object' && item.evidenceJson !== null ? item.evidenceJson as Record<string, unknown> : undefined
    })),
    summary: stored.summaryJson as AuditReport['summary'],
    pages: stored.pages.map((page) => ({
      url: page.url,
      statusCode: page.statusCode,
      contentType: page.contentType,
      title: page.title,
      metaDescription: page.metaDescription,
      h1: page.h1,
      wordCount: page.wordCount,
      internalLinks: page.internalLinks,
      externalLinks: page.externalLinks,
      imageCount: page.imageCount
    })),
    raw: stored.rawJson as Record<string, unknown>
  }
}

export async function listReports() {
  const memoryReports = Array.from(reports.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  if (memoryReports.length || !canUseDatabase()) return memoryReports

  const stored = await prisma.auditReport.findMany({
    orderBy: { createdAt: 'desc' },
    take: 25,
    include: { issues: true, pages: true }
  }).catch(() => [])

  return Promise.all(stored.map((report) => getReport(report.id))).then((items) => items.filter(Boolean) as AuditReport[])
}
