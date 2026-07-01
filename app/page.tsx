import { Activity, Gauge, Lock, MousePointerClick, Search, Sparkles } from 'lucide-react'
import { AuditForm } from '@/components/audit/AuditForm'

const features = [
  { icon: Search, title: 'Technical SEO', text: 'Metadata, headings, crawlability, indexability, links, images, and schema checks.' },
  { icon: MousePointerClick, title: 'CRO Audit', text: 'CTA clarity, lead forms, trust signals, local business readiness, and landing page friction.' },
  { icon: Gauge, title: 'Performance Signals', text: 'Response timing, caching, page weight signals, and graceful PageSpeed/Lighthouse expansion.' },
  { icon: Lock, title: 'Security Basics', text: 'HTTPS, mixed content, HSTS, CSP, and safer external link behavior.' },
  { icon: Activity, title: 'Accessibility', text: 'Language, alt text, link labels, and semantic baseline checks.' },
  { icon: Sparkles, title: 'AI SEO Readiness', text: 'FAQ, schema, entity clarity, answer-focused content, and practical recommendations.' }
]

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#3b2f0a,transparent_35%),linear-gradient(180deg,#0d0d0d,#111)]" />
        <div className="mx-auto max-w-7xl text-center">
          <div className="mx-auto mb-6 inline-flex rounded-full border border-yellow-300/30 bg-yellow-300/10 px-4 py-2 text-sm font-medium text-yellow-100">Rank Math-style SEO checks plus agency CRO insights</div>
          <h1 className="mx-auto max-w-5xl text-5xl font-black tracking-tight sm:text-7xl">Free Technical SEO & CRO Audit Tool</h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-300">Analyze any website for SEO, performance, crawlability, accessibility, security, UX, and conversion issues using real audit checks.</p>
          <AuditForm />
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
          <h2 className="text-3xl font-black">How it works</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {['Validate URL securely', 'Fetch and parse HTML', 'Run modular audit checks', 'Score and explain fixes'].map((step, index) => (
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
