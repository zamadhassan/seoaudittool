import Link from 'next/link'
import { listReports } from '@/features/audit/cache/auditCache'

export default async function DashboardPage() {
  const reports = await listReports()

  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black">Dashboard</h1>
      <p className="mt-3 text-zinc-400">Recent audits from this running instance. Connect PostgreSQL for durable saved history.</p>
      <div className="mt-8 grid gap-4">
        {reports.length === 0 ? <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-zinc-400">No audits yet.</div> : null}
        {reports.map((report) => (
          <Link key={report.id} href={`/report/${report.id}`} className="flex flex-col justify-between gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-5 hover:border-yellow-300/40 md:flex-row md:items-center">
            <div>
              <div className="font-bold">{report.domain}</div>
              <div className="text-sm text-zinc-500">{report.finalUrl}</div>
            </div>
            <div className="text-2xl font-black text-nexora-yellow">{report.scores.overall}</div>
          </Link>
        ))}
      </div>
    </main>
  )
}
