'use client'

import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { AuditReport } from '@/types/audit'

const colors = ['#FECB2F', '#60A5FA', '#34D399', '#F87171', '#A78BFA', '#FB923C', '#22D3EE']

export function ReportCharts({ report }: { report: AuditReport }) {
  const categoryData = [
    { name: 'Overall', score: report.scores.overall },
    { name: 'Technical', score: report.scores.technical },
    { name: 'Performance', score: report.scores.performance },
    { name: 'Crawl', score: report.scores.crawlability },
    { name: 'A11y', score: report.scores.accessibility },
    { name: 'Security', score: report.scores.security },
    { name: 'On-page', score: report.scores.onPage }
  ]
  const severityData = ['critical', 'warning', 'notice', 'passed'].map((severity) => ({
    name: severity,
    value: report.issues.filter((issue) => issue.severity === severity).length
  }))
  const passed = report.issues.filter((issue) => issue.severity === 'passed').length
  const failed = report.issues.length - passed
  const passedData = [{ name: 'Passed', value: passed }, { name: 'Needs Work', value: failed }]

  return (
    <section className="mt-8 grid gap-4 lg:grid-cols-[1.3fr_0.7fr_0.7fr]">
      <div className="glass-card rounded-[10px] p-5">
        <h2 className="text-xl font-black">Category score chart</h2>
        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff' }} />
              <Bar dataKey="score" radius={[8, 8, 0, 0]} fill="#FECB2F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="glass-card rounded-[10px] p-5">
        <h2 className="text-xl font-black">Issue severity</h2>
        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={severityData} innerRadius={58} outerRadius={92} paddingAngle={3} dataKey="value">
                {severityData.map((entry, index) => <Cell key={entry.name} fill={colors[index]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="glass-card rounded-[10px] p-5">
        <h2 className="text-xl font-black">Passed vs failed</h2>
        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={passedData} innerRadius={58} outerRadius={92} paddingAngle={3} dataKey="value">
                <Cell fill="#34D399" />
                <Cell fill="#FECB2F" />
              </Pie>
              <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
