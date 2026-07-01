import { Activity, Gauge, Lock, MousePointerClick, Search, Sparkles } from 'lucide-react'
import { AuditForm } from '@/components/audit/AuditForm'

const features = [
  { icon: Search, title: 'Technical SEO Audit', text: 'Find title, meta, heading, crawlability, indexability, link, image, and schema issues.' },
  { icon: MousePointerClick, title: 'Conversion Readiness', text: 'Review calls to action, lead forms, trust signals, contact paths, and landing page friction.' },
  { icon: Gauge, title: 'Performance Signals', text: 'Check response speed, cache signals, page delivery basics, and performance improvement opportunities.' },
  { icon: Lock, title: 'Security Review', text: 'Scan HTTPS, mixed content, security headers, and safer external-link behavior.' },
  { icon: Activity, title: 'Accessibility Checks', text: 'Identify common usability issues such as missing language, alt text, and accessible link labels.' },
  { icon: Sparkles, title: 'AI Search Readiness', text: 'Review FAQ, structured data, entity clarity, and answer-focused content signals.' }
]

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#3b2f0a,transparent_35%),linear-gradient(180deg,#0d0d0d,#111)]" />
        <div className="mx-auto max-w-7xl text-center">
          <div className="mx-auto mb-6 inline-flex rounded-full border border-yellow-300/30 bg-yellow-300/10 px-4 py-2 text-sm font-medium text-yellow-100">Professional website audit powered by Nexora Creation</div>
          <h1 className="mx-auto max-w-5xl text-5xl font-black tracking-tight sm:text-7xl">Free SEO, Performance & CRO Audit Tool</h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-300">Enter your website URL and get a clear, actionable report covering search visibility, speed, accessibility, security, user experience, and lead generation readiness.</p>
          <AuditForm />
          <p className="mt-4 text-sm text-zinc-500">No login required. No paid SEO data APIs. Results are generated from real website checks.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <feature.icon className="h-8 w-8 text-nexora-yellow" />
              <h2 className="mt-5 text-xl font-bold">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-yellow-300/[0.08] p-8 md:p-12">
          <h2 className="text-3xl font-black">How your audit works</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {['Securely validate your URL', 'Fetch and analyze real page HTML', 'Run SEO, CRO, UX, and security checks', 'Show scores, priorities, and fixes'].map((step, index) => (
              <div key={step} className="rounded-2xl bg-black/30 p-5">
                <div className="text-3xl font-black text-nexora-yellow">0{index + 1}</div>
                <div className="mt-3 font-semibold">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
