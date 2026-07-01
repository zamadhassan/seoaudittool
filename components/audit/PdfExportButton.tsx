'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import type { AuditIssue, AuditReport } from '@/types/audit'

type PdfDoc = import('jspdf').jsPDF

const brand = {
  black: [13, 13, 13] as const,
  yellow: [254, 203, 47] as const,
  white: [255, 255, 255] as const,
  gray: [105, 105, 105] as const,
  light: [246, 246, 246] as const,
  red: [214, 40, 40] as const,
  orange: [245, 158, 11] as const,
  blue: [37, 99, 235] as const,
  green: [22, 163, 74] as const
}

function setFill(doc: PdfDoc, color: readonly [number, number, number]) {
  doc.setFillColor(color[0], color[1], color[2])
}

function setText(doc: PdfDoc, color: readonly [number, number, number]) {
  doc.setTextColor(color[0], color[1], color[2])
}

function addWrappedText(doc: PdfDoc, text: string, x: number, y: number, maxWidth: number, lineHeight = 5) {
  const lines = doc.splitTextToSize(text, maxWidth) as string[]
  lines.forEach((line, index) => doc.text(line, x, y + index * lineHeight))
  return y + lines.length * lineHeight
}

function footer(doc: PdfDoc) {
  setText(doc, brand.gray)
  doc.setFontSize(8)
  doc.text('Powered by Nexora Creation', 20, 286)
  doc.text('nexoracreation.com', 158, 286)
}

function newPage(doc: PdfDoc, title: string) {
  doc.addPage()
  setFill(doc, brand.white)
  doc.rect(0, 0, 210, 297, 'F')
  setFill(doc, brand.yellow)
  doc.rect(0, 0, 210, 8, 'F')
  setText(doc, brand.black)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text(title, 20, 25)
  footer(doc)
  return 38
}

function ensurePage(doc: PdfDoc, y: number, title = 'Detailed Findings') {
  return y < 270 ? y : newPage(doc, title)
}

function severityColor(severity: AuditIssue['severity']) {
  if (severity === 'critical') return brand.red
  if (severity === 'warning') return brand.orange
  if (severity === 'notice') return brand.blue
  return brand.green
}

function scoreLabel(score: number) {
  if (score >= 90) return 'Excellent'
  if (score >= 75) return 'Good'
  if (score >= 60) return 'Needs Improvement'
  if (score >= 40) return 'Poor'
  return 'Critical'
}

export function PdfExportButton({ report }: { report: AuditReport }) {
  const [exporting, setExporting] = useState(false)

  async function exportPdf() {
    setExporting(true)
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()
      const findings = report.issues.filter((issue) => issue.severity !== 'passed').sort((a, b) => b.scoreImpact - a.scoreImpact)
      const counts = {
        critical: report.issues.filter((issue) => issue.severity === 'critical').length,
        warning: report.issues.filter((issue) => issue.severity === 'warning').length,
        notice: report.issues.filter((issue) => issue.severity === 'notice').length,
        passed: report.issues.filter((issue) => issue.severity === 'passed').length
      }

      setFill(doc, brand.black)
      doc.rect(0, 0, 210, 297, 'F')
      setFill(doc, brand.yellow)
      doc.rect(0, 0, 210, 10, 'F')
      doc.setFont('helvetica', 'bold')
      setText(doc, brand.yellow)
      doc.setFontSize(24)
      doc.text('Nexora Audit Pro', 20, 32)
      setText(doc, brand.white)
      doc.setFontSize(16)
      addWrappedText(doc, `Website Growth Audit for ${report.domain}`, 20, 45, 170, 7)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      setText(doc, [215, 215, 215])
      addWrappedText(doc, report.finalUrl, 20, 62, 170)
      doc.text(`Generated ${new Date(report.createdAt).toLocaleString()}`, 20, 76)

      setFill(doc, [28, 28, 28])
      doc.roundedRect(20, 95, 78, 54, 5, 5, 'F')
      setText(doc, brand.yellow)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(40)
      doc.text(`${report.scores.overall}`, 30, 128)
      doc.setFontSize(14)
      doc.text('/100', 72, 128)
      setText(doc, brand.white)
      doc.setFontSize(11)
      doc.text(`Overall: ${scoreLabel(report.scores.overall)}`, 30, 140)

      setFill(doc, [28, 28, 28])
      doc.roundedRect(108, 95, 82, 54, 5, 5, 'F')
      setText(doc, brand.white)
      doc.setFontSize(12)
      doc.text('Finding Summary', 118, 112)
      doc.setFontSize(10)
      setText(doc, brand.red)
      doc.text(`${counts.critical} Critical`, 118, 124)
      setText(doc, brand.orange)
      doc.text(`${counts.warning} Warnings`, 118, 134)
      setText(doc, brand.blue)
      doc.text(`${counts.notice} Notices`, 118, 144)

      doc.setFontSize(13)
      setText(doc, brand.yellow)
      doc.text('Executive Summary', 20, 172)
      doc.setFont('helvetica', 'normal')
      setText(doc, [230, 230, 230])
      addWrappedText(doc, report.summary.executiveSummary, 20, 184, 170, 6)
      setText(doc, brand.gray)
      doc.setFontSize(9)
      doc.text('Powered by Nexora Creation | nexoracreation.com', 20, 280)

      let y = newPage(doc, 'Category Scores')
      const scoreRows = [
        ['Technical SEO', report.scores.technical], ['Performance', report.scores.performance], ['CRO', report.scores.cro],
        ['Accessibility', report.scores.accessibility], ['Security', report.scores.security], ['Crawlability', report.scores.crawlability],
        ['Indexability', report.scores.indexability], ['On-page SEO', report.scores.onPage], ['Mobile UX', report.scores.mobile], ['AI SEO', report.scores.aiSeo]
      ] as const
      scoreRows.forEach(([label, score], index) => {
        const x = index % 2 === 0 ? 20 : 110
        const rowY = y + Math.floor(index / 2) * 23
        setFill(doc, brand.light)
        doc.roundedRect(x, rowY, 80, 16, 3, 3, 'F')
        setText(doc, brand.black)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.text(label, x + 4, rowY + 6)
        setText(doc, score >= 75 ? brand.green : score >= 60 ? brand.orange : brand.red)
        doc.text(`${score}/100`, x + 58, rowY + 6)
        doc.setFont('helvetica', 'normal')
        setText(doc, brand.gray)
        doc.setFontSize(8)
        doc.text(scoreLabel(score), x + 4, rowY + 12)
      })

      y = newPage(doc, 'Top Priority Fixes')
      report.summary.topFixes.forEach((fix, index) => {
        y = ensurePage(doc, y, 'Top Priority Fixes')
        setFill(doc, [255, 249, 229])
        doc.roundedRect(20, y - 5, 170, 35, 4, 4, 'F')
        setText(doc, brand.black)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        y = addWrappedText(doc, `${index + 1}. ${fix.title} (${fix.priority} priority)`, 26, y + 3, 155, 5)
        doc.setFont('helvetica', 'normal')
        setText(doc, brand.gray)
        y = addWrappedText(doc, fix.howToFix, 26, y + 1, 155, 5)
        y += 12
      })

      y = newPage(doc, 'Detailed Findings')
      findings.slice(0, 30).forEach((issue) => {
        y = ensurePage(doc, y)
        setText(doc, severityColor(issue.severity))
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.text(`${issue.severity.toUpperCase()} | ${issue.category} | -${issue.scoreImpact} pts`, 20, y)
        setText(doc, brand.black)
        doc.setFontSize(10)
        y = addWrappedText(doc, issue.title, 20, y + 6, 170, 5)
        doc.setFont('helvetica', 'normal')
        setText(doc, brand.gray)
        y = addWrappedText(doc, issue.howToFix || issue.recommendation, 20, y + 1, 170, 5)
        y += 8
      })

      y = newPage(doc, 'Next Steps')
      setText(doc, brand.black)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      y = addWrappedText(doc, '1. Fix critical issues first because they can block search visibility, user trust, or conversions.', 20, y, 170, 7)
      y = addWrappedText(doc, '2. Improve the top CRO recommendations to make the page clearer and easier to convert.', 20, y + 4, 170, 7)
      y = addWrappedText(doc, '3. Re-run the audit after updates to confirm progress and track score improvements.', 20, y + 4, 170, 7)
      setText(doc, brand.yellow)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.text('Powered by Nexora Creation', 20, 245)
      setText(doc, brand.black)
      doc.setFontSize(11)
      doc.text('https://nexoracreation.com', 20, 255)

      doc.setProperties({ title: `Nexora Audit - ${report.domain}`, subject: 'SEO and CRO website audit report', author: 'Nexora Creation' })
      doc.save(`nexora-audit-${report.domain}.pdf`)
    } finally {
      setExporting(false)
    }
  }

  return (
    <button onClick={exportPdf} disabled={exporting} className="rounded-full bg-nexora-yellow px-5 py-3 font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60">
      <span className="inline-flex items-center gap-2">
        <FontAwesomeIcon icon={faDownload} className="h-4 w-4" />
        {exporting ? 'Preparing PDF...' : 'Download PDF Report'}
      </span>
    </button>
  )
}
