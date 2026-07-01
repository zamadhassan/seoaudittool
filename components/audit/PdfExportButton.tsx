'use client'

import { useState } from 'react'
import type { AuditIssue, AuditReport } from '@/types/audit'

function addWrappedText(doc: import('jspdf').jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight = 6) {
  const lines = doc.splitTextToSize(text, maxWidth) as string[]
  lines.forEach((line, index) => doc.text(line, x, y + index * lineHeight))
  return y + lines.length * lineHeight
}

function ensurePage(doc: import('jspdf').jsPDF, y: number) {
  if (y < 270) return y
  doc.addPage()
  return 20
}

function issueLine(issue: AuditIssue) {
  return `${issue.severity.toUpperCase()} | ${issue.category} | ${issue.title}: ${issue.howToFix || issue.recommendation}`
}

export function PdfExportButton({ report }: { report: AuditReport }) {
  const [exporting, setExporting] = useState(false)

  async function exportPdf() {
    setExporting(true)
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()
      const topIssues = report.issues.filter((issue) => issue.severity !== 'passed').slice(0, 25)
      let y = 20

      doc.setFillColor(13, 13, 13)
      doc.rect(0, 0, 210, 297, 'F')
      doc.setTextColor(254, 203, 47)
      doc.setFontSize(24)
      doc.text('Nexora Audit Pro', 20, y)
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(15)
      y = addWrappedText(doc, `Technical SEO + CRO Audit for ${report.domain}`, 20, 35, 165, 7)
      doc.setFontSize(11)
      doc.setTextColor(210, 210, 210)
      y = addWrappedText(doc, report.finalUrl, 20, y + 6, 170)
      doc.text(`Audit date: ${new Date(report.createdAt).toLocaleString()}`, 20, y + 6)

      doc.setTextColor(254, 203, 47)
      doc.setFontSize(42)
      doc.text(`${report.scores.overall}/100`, 20, 95)
      doc.setFontSize(12)
      doc.setTextColor(255, 255, 255)
      doc.text('Overall Score', 20, 105)

      doc.setFontSize(14)
      doc.setTextColor(254, 203, 47)
      doc.text('Executive Summary', 20, 130)
      doc.setTextColor(230, 230, 230)
      doc.setFontSize(10)
      y = addWrappedText(doc, report.summary.executiveSummary, 20, 140, 170)

      doc.addPage()
      y = 20
      doc.setTextColor(13, 13, 13)
      doc.setFontSize(18)
      doc.text('Category Scores', 20, y)
      y += 12
      doc.setFontSize(10)
      Object.entries(report.scores).forEach(([key, score]) => {
        if (key === 'overall') return
        doc.text(`${key}: ${score}/100`, 22, y)
        y += 7
      })

      y += 8
      doc.setFontSize(18)
      doc.text('Top Priority Fixes', 20, y)
      y += 12
      doc.setFontSize(10)
      report.summary.topFixes.forEach((fix, index) => {
        y = ensurePage(doc, y)
        doc.setFont('helvetica', 'bold')
        y = addWrappedText(doc, `${index + 1}. ${fix.title} (${fix.priority})`, 22, y, 165)
        doc.setFont('helvetica', 'normal')
        y = addWrappedText(doc, fix.howToFix, 26, y + 1, 160)
        y += 5
      })

      doc.addPage()
      y = 20
      doc.setFontSize(18)
      doc.text('Detailed Findings', 20, y)
      y += 12
      doc.setFontSize(9)
      topIssues.forEach((issue) => {
        y = ensurePage(doc, y)
        y = addWrappedText(doc, issueLine(issue), 22, y, 165, 5)
        y += 4
      })

      doc.setProperties({ title: `Nexora Audit - ${report.domain}` })
      doc.save(`nexora-audit-${report.domain}.pdf`)
    } finally {
      setExporting(false)
    }
  }

  return (
    <button onClick={exportPdf} disabled={exporting} className="rounded-full bg-nexora-yellow px-5 py-3 font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60">
      {exporting ? 'Creating PDF...' : 'Export PDF'}
    </button>
  )
}
