import type { CheerioAPI } from 'cheerio'
import { issue, pass } from '@/features/audit/engine/issueFactory'
import type { AuditIssue } from '@/types/audit'

export function analyzeCro($: CheerioAPI): AuditIssue[] {
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim()
  const forms = $('form')
  const buttons = $('button,a').filter((_, el) => /quote|call|book|get|start|buy|contact|schedule|audit/i.test($(el).text()))
  const trustSignals = /review|testimonial|case study|certified|licensed|insured|years|clients|portfolio|rating/i.test(bodyText)
  const contactSignals = /contact|mailto:|tel:|address|privacy/i.test($.html())
  const issues: AuditIssue[] = []

  issues.push($('h1').first().text().trim() ? pass('Hero headline detected', 'CRO', 'The page has a primary headline.') : issue({ title: 'No clear hero headline detected', category: 'CRO', description: 'The above-fold section needs a clear offer headline.', severity: 'critical', priority: 'high', scoreImpact: 10, recommendation: 'Add a specific headline that explains the service, audience, and outcome.' }))
  issues.push(buttons.length > 0 ? pass('Action-focused CTA detected', 'CRO', 'The page includes at least one action-focused CTA.', { ctas: buttons.length }) : issue({ title: 'Weak or missing CTA', category: 'CRO', description: 'The page does not show a strong action-focused CTA.', severity: 'warning', priority: 'high', scoreImpact: 8, recommendation: 'Use CTA text like Get a Free Quote, Book a Call, or Start Free Audit.' }))
  issues.push(forms.length > 0 ? pass('Lead form exists', 'CRO', 'A form is present on the page.', { forms: forms.length }) : issue({ title: 'No lead form detected', category: 'CRO', description: 'Visitors may not have a direct way to submit an inquiry.', severity: 'notice', priority: 'medium', scoreImpact: 4, recommendation: 'Add a short, clearly labeled lead form near a CTA section.' }))
  issues.push(trustSignals ? pass('Trust signals detected', 'CRO', 'The page includes trust-building language.') : issue({ title: 'Trust signals are weak', category: 'CRO', description: 'The page does not clearly show reviews, proof, credentials, or experience.', severity: 'warning', priority: 'medium', scoreImpact: 6, recommendation: 'Add testimonials, ratings, certifications, case studies, or client logos.' }))
  issues.push(contactSignals ? pass('Contact/compliance signals detected', 'Google Ads', 'The page includes contact or policy signals.') : issue({ title: 'Landing page contact signals missing', category: 'Google Ads', description: 'Google Ads landing pages should include clear contact or policy details.', severity: 'warning', priority: 'medium', scoreImpact: 5, recommendation: 'Add contact details, privacy policy, and business information in the footer.' }))

  return issues
}
