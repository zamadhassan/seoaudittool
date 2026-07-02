import { Accessibility, ArrowRight, Bot, CheckCircle2, Gauge, Globe2, Layers3, Radar, SearchCheck, ShieldCheck, Sparkles } from 'lucide-react'
import { AuditForm } from '@/components/audit/AuditForm'

const auditAreas = [
  { icon: SearchCheck, title: 'Technical SEO', text: 'Titles, descriptions, headings, canonicals, schema, and crawl signals.' },
  { icon: Gauge, title: 'Performance', text: 'Response speed, PageSpeed metrics, caching signals, and Core Web Vitals hints.' },
  { icon: Radar, title: 'Crawlability', text: 'Status codes, redirects, indexability blockers, and crawler-friendly signals.' },
  { icon: Accessibility, title: 'Accessibility', text: 'Language, image alt text, link labels, and common usability problems.' },
  { icon: ShieldCheck, title: 'Security', text: 'HTTPS, mixed content, HSTS, CSP, and safer external link practices.' },
  { icon: Bot, title: 'AI Summary', text: 'Groq-powered recommendations when configured, with fallback summaries if unavailable.' }
]

const previewRows = [
  ['Technical SEO', 88],
  ['Performance', 74],
  ['Accessibility', 91],
  ['Security', 82]
]

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <section className="relative px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pb-24 lg:pt-24">
        <div className="yellow-orb -left-28 top-20 h-80 w-80" />
        <div className="yellow-orb -right-28 top-52 h-96 w-96 opacity-70" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300/25 bg-yellow-300/10 px-4 py-2 text-sm font-semibold text-yellow-100 shadow-lg shadow-yellow-500/10">
              <Sparkles className="h-4 w-4" /> Powered by Nexora Creation
            </div>
            <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Free Technical SEO Audit Tool
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
              Analyze SEO, performance, crawlability, accessibility, security, and technical issues in seconds.
            </p>
            <div className="mt-8 max-w-3xl">
              <AuditForm />
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-zinc-400">
              {['No login required', 'Real website checks', 'No paid SEO APIs'].map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
                  <CheckCircle2 className="h-4 w-4 text-nexora-yellow" /> {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="premium-panel relative overflow-hidden p-4 sm:p-5">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-300/70 to-transparent" />
              <div className="rounded-[10px] border border-white/10 bg-black/35 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-nexora-yellow text-black">
                      <Globe2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold">example.com</div>
                      <div className="text-xs text-zinc-500">Live audit preview</div>
                    </div>
                  </div>
                  <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-100">Completed</span>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-[0.75fr_1fr]">
                  <div className="rounded-[10px] border border-yellow-300/20 bg-yellow-300/10 p-5 text-center">
                    <div className="text-6xl font-black text-nexora-yellow">86</div>
                    <div className="mt-1 text-sm text-yellow-100">Overall Score</div>
                  </div>
                  <div className="space-y-3">
                    {previewRows.map(([label, score]) => (
                      <div key={label}>
                        <div className="mb-1 flex justify-between text-xs text-zinc-400"><span>{label}</span><span>{score}/100</span></div>
                        <div className="h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-nexora-yellow" style={{ width: `${score}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  ['Critical', '2', 'text-red-200'],
                  ['Warnings', '9', 'text-yellow-100'],
                  ['Passed', '31', 'text-emerald-100']
                ].map(([label, value, tone]) => (
                  <div key={label} className="rounded-[10px] border border-white/10 bg-white/[0.035] p-4">
                    <div className={`text-2xl font-black ${tone}`}>{value}</div>
                    <div className="text-xs text-zinc-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="subtle-divider mb-10" />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="premium-panel p-6 lg:col-span-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-nexora-yellow text-black"><Layers3 className="h-5 w-5" /></div>
            <h2 className="mt-5 text-3xl font-black">Built for clear decisions, not confusing dashboards.</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-400">Every section is written for clients and business owners, with priorities, impact, and practical next steps.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            {auditAreas.map((item) => (
              <div key={item.title} className="glass-card soft-transition p-5">
                <item.icon className="h-5 w-5 text-nexora-yellow" />
                <h3 className="mt-4 font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="premium-panel overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-nexora-yellow">Workflow</p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">From URL to prioritized fixes.</h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400">The tool fetches your page, reads the HTML, checks real SEO and UX signals, then turns findings into a report your team can act on.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['01', 'Fetch website', 'Validate URL and fetch the live page safely.'],
                ['02', 'Read HTML', 'Extract metadata, headings, links, images, and schema.'],
                ['03', 'Score signals', 'Calculate category scores and severity levels.'],
                ['04', 'Prepare report', 'Create priorities, recommendations, charts, and PDF export.']
              ].map(([step, title, text]) => (
                <div key={step} className="rounded-[10px] border border-white/10 bg-black/30 p-5">
                  <div className="text-xs font-black text-nexora-yellow">{step}</div>
                  <div className="mt-2 font-bold">{title}</div>
                  <div className="mt-2 text-sm leading-6 text-zinc-500">{text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="glass-card flex flex-col justify-between gap-6 p-6 sm:p-8 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-black">Ready to see what is holding your website back?</h2>
            <p className="mt-3 text-sm text-zinc-400">Run a free audit and get a client-friendly technical SEO report.</p>
          </div>
          <a href="#audit" className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-nexora-yellow px-5 py-3 font-bold text-black transition hover:bg-yellow-300">
            Run Free Audit <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </main>
  )
}
