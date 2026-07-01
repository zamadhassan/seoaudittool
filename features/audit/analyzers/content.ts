import type { CheerioAPI } from 'cheerio'
import { issue, pass } from '@/features/audit/engine/issueFactory'
import type { AuditIssue } from '@/types/audit'

export function getWordCount($: CheerioAPI) {
  const text = $('body').text().replace(/\s+/g, ' ').trim()
  return text ? text.split(' ').filter(Boolean).length : 0
}

export function analyzeContent($: CheerioAPI, html: string): AuditIssue[] {
  const wordCount = getWordCount($)
  const textLength = $('body').text().replace(/\s+/g, '').length
  const htmlLength = html.length || 1
  const textRatio = Math.round((textLength / htmlLength) * 100)
  const phoneVisible = /(?:\+?\d[\d\s().-]{7,}\d)/.test($('body').text())
  const issues: AuditIssue[] = []

  issues.push(wordCount >= 300 ? pass('Content depth looks adequate', 'Content', 'The page has enough crawlable text for a normal landing page.', { wordCount }) : issue({ title: 'Thin content warning', category: 'Content', description: 'The page has less than 300 words of visible text.', severity: 'warning', priority: 'medium', scoreImpact: 6, recommendation: 'Add useful service, benefit, proof, FAQ, and next-step content.', evidence: { wordCount } }))
  if (textRatio < 5) issues.push(issue({ title: 'Low text-to-HTML ratio', category: 'Content', description: 'The page has very little text compared with markup.', severity: 'notice', priority: 'low', scoreImpact: 2, recommendation: 'Reduce bloated markup and add meaningful crawlable content.', evidence: { textRatio } }))
  issues.push(phoneVisible ? pass('Phone number visible', 'CRO', 'A phone/contact number appears in page text.') : issue({ title: 'No visible phone number detected', category: 'CRO', description: 'Service businesses often convert better with visible phone contact.', severity: 'notice', priority: 'medium', scoreImpact: 3, recommendation: 'Add a click-to-call phone number in the header, hero, or contact section.' }))

  return issues
}
