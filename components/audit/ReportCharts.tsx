'use client'

import { Bar, BarChart, Cell, Pie, PieChart, PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { AuditReport } from '@/types/audit'

const severityColors: Record<string, string> = {
  Critical: '#EF4444',
  Warning: '#FECB2F',
  Notice: '#60A5FA',
  Passed: '#34D399'
}

function Legend({ data }: { data: Array<{ name: string; value: number; color: string }> }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-zinc-400">
      {data.map((item) => (
        <div key={item.name} className="flex items-center justify-between rounded-[8px] border border-white/10 bg-black px-3 py-2">
          <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />{item.name}</span>
          <span className="font-bold text-white">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

export function ReportCharts({ report }: { report: AuditReport }) {
  const categoryData = [
    { name: 'Overall', score: report.scores.overall },
    { name: 'Technical', score: report.scores.technical },
    { name: 'Performance', score: report.scores.performance },
    { name: 'Crawlability', score: report.scores.crawlability },
    { name: 'Accessibility', score: report.scores.accessibility },
    { name: 'Security', score: report.scores.security },
    { name: 'On-page', score: report.scores.onPage }
  ]
  const severityData = [
    { name: 'Critical', value: report.issues.filter((issue) => issue.severity === 'critical').length, color: severityColors.Critical },
    { name: 'Warning', value: report.issues.filter((issue) => issue.severity === 'warning').length, color: severityColors.Warning },
    { name: 'Notice', value: report.issues.filter((issue) => issue.severity === 'notice').length, color: severityColors.Notice },
    { name: 'Passed', value: report.issues.filter((issue) => issue.severity === 'passed').length, color: severityColors.Passed }
  ]
  const passed = report.issues.filter((issue) => issue.severity === 'passed').length
  const failed = report.issues.length - passed
  const completion = report.issues.length ? Math.round((passed / report.issues.length) * 100) : 0
  const passedData = [{ name: 'Completion', value: completion, fill: '#FECB2F' }]

  return (
    <section className="mt-8 grid gap-4 xl:grid-cols-[1.4fr_0.85fr_0.75fr]">
      <div className="premium-panel p-5">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xl font-black">Category Scores</h2>
            <p className="mt-1 text-sm text-zinc-500">Score distribution across the main audit areas.</p>
          </div>
        </div>
        <div className="mt-5 h-72 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} interval={0} angle={-18} textAnchor="end" height={58} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip cursor={{ fill: 'rgba(254,203,47,0.06)' }} formatter={(value) => [`${value}/100`, 'Score']} contentStyle={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 10, color: '#fff', boxShadow: '0 16px 40px rgba(0,0,0,0.45)' }} />
              <Bar dataKey="score" radius={[6, 6, 2, 2]} fill="#FECB2F" maxBarSize={42} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="premium-panel p-5">
        <h2 className="text-xl font-black">Issue Severity</h2>
        <p className="mt-1 text-sm text-zinc-500">Breakdown of findings by urgency.</p>
        <div className="mt-4 h-56 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={severityData} innerRadius="58%" outerRadius="82%" paddingAngle={4} dataKey="value" stroke="none">
                {severityData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 10, color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <Legend data={severityData} />
      </div>

      <div className="premium-panel p-5">
        <h2 className="text-xl font-black">Passed Checks</h2>
        <p className="mt-1 text-sm text-zinc-500">How much of the audit already looks healthy.</p>
        <div className="relative mt-4 h-56 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart innerRadius="72%" outerRadius="94%" data={passedData} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="value" cornerRadius={10} background={{ fill: 'rgba(255,255,255,0.08)' }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-black text-nexora-yellow">{completion}%</div>
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Passed</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-zinc-400">
          <div className="rounded-[8px] border border-white/10 bg-black p-3"><div className="font-bold text-emerald-200">{passed}</div><div>Passed</div></div>
          <div className="rounded-[8px] border border-white/10 bg-black p-3"><div className="font-bold text-yellow-100">{failed}</div><div>Needs Work</div></div>
        </div>
      </div>
    </section>
  )
}
