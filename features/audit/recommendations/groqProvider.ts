import { env } from '@/lib/env'
import { buildFallbackSummary } from './fallbackRecommendations'
import type { AuditIssue, AuditSummary } from '@/types/audit'

export type AIRecommendationResult = {
  summary: AuditSummary
  status: 'generated' | 'missing_key' | 'failed'
  provider: 'groq' | 'fallback'
  model?: string
  message?: string
}

function parseSummary(value: unknown, fallback: AuditSummary): AuditSummary {
  const data = value as Partial<AuditSummary>
  if (!data || typeof data.executiveSummary !== 'string' || !Array.isArray(data.topFixes)) return fallback
  return {
    executiveSummary: data.executiveSummary || fallback.executiveSummary,
    topFixes: data.topFixes.slice(0, 5).map((fix, index) => ({
      title: typeof fix?.title === 'string' ? fix.title : fallback.topFixes[index]?.title || 'Recommended fix',
      priority: fix?.priority === 'high' || fix?.priority === 'medium' || fix?.priority === 'low' ? fix.priority : fallback.topFixes[index]?.priority || 'medium',
      whyItMatters: typeof fix?.whyItMatters === 'string' ? fix.whyItMatters : fallback.topFixes[index]?.whyItMatters || '',
      howToFix: typeof fix?.howToFix === 'string' ? fix.howToFix : fallback.topFixes[index]?.howToFix || '',
      expectedImpact: typeof fix?.expectedImpact === 'string' ? fix.expectedImpact : fallback.topFixes[index]?.expectedImpact || 'Improves website quality.'
    })),
    businessImpact: typeof data.businessImpact === 'string' ? data.businessImpact : fallback.businessImpact,
    seoImpact: typeof data.seoImpact === 'string' ? data.seoImpact : fallback.seoImpact,
    croImpact: typeof data.croImpact === 'string' ? data.croImpact : fallback.croImpact
  }
}

function parseJsonContent(content: string) {
  try {
    return JSON.parse(content)
  } catch {
    const match = content.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('Groq response did not contain JSON.')
    return JSON.parse(match[0])
  }
}

export async function generateGroqSummary(issues: AuditIssue[], domain: string): Promise<AIRecommendationResult> {
  const fallback = buildFallbackSummary(issues)
  if (!env.groq.apiKey) {
    console.warn('GROQ_API_KEY is missing. Using fallback audit recommendations.')
    return { summary: fallback, status: 'missing_key', provider: 'fallback', message: 'GROQ_API_KEY is not configured.' }
  }

  const findings = issues
    .filter((item) => item.severity !== 'passed')
    .sort((a, b) => b.scoreImpact - a.scoreImpact)
    .slice(0, 20)
    .map((item) => ({
      title: item.title,
      category: item.category,
      severity: item.severity,
      priority: item.priority,
      description: item.description,
      recommendation: item.recommendation,
      scoreImpact: item.scoreImpact
    }))

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        authorization: `Bearer ${env.groq.apiKey}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: env.groq.model,
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: 'You summarize website audits. Use only the provided findings. Do not invent data. Return strict JSON matching: executiveSummary string, topFixes array of objects with title priority whyItMatters howToFix expectedImpact, businessImpact string, seoImpact string, croImpact string. Use simple client-friendly language.'
          },
          {
            role: 'user',
            content: JSON.stringify({ domain, findings })
          }
        ]
      })
    })
    if (!response.ok) throw new Error(`Groq request failed with ${response.status}`)
    const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> }
    const content = data.choices?.[0]?.message?.content
    if (!content) throw new Error('Groq returned an empty response.')
    return { summary: parseSummary(parseJsonContent(content), fallback), status: 'generated', provider: 'groq', model: env.groq.model }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Groq recommendations failed.'
    console.warn('Groq recommendations failed. Using fallback recommendations.', message)
    return { summary: fallback, status: 'failed', provider: 'fallback', model: env.groq.model, message }
  } finally {
    clearTimeout(timeout)
  }
}
