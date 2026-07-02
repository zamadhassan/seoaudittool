import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt, faChartLine, faCheckCircle, faGaugeHigh, faLock, faMagnifyingGlassChart, faMousePointer, faRobot, faShieldHalved, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'
import { AuditForm } from '@/components/audit/AuditForm'
import { HeroPreviewCards } from '@/components/audit/HeroPreviewCards'

const features = [
  { icon: faMagnifyingGlassChart, title: 'Technical SEO Audit', text: 'Find title, meta, heading, crawlability, indexability, link, image, and schema issues.', accent: 'from-yellow-300/25 to-transparent' },
  { icon: faMousePointer, title: 'Conversion Readiness', text: 'Review calls to action, lead forms, trust signals, contact paths, and landing page friction.', accent: 'from-emerald-300/20 to-transparent' },
  { icon: faGaugeHigh, title: 'Performance Signals', text: 'Check response speed, cache signals, page delivery basics, and performance improvement opportunities.', accent: 'from-blue-300/20 to-transparent' },
  { icon: faShieldHalved, title: 'Security Review', text: 'Scan HTTPS, mixed content, security headers, and safer external-link behavior.', accent: 'from-red-300/20 to-transparent' },
  { icon: faCheckCircle, title: 'Accessibility Checks', text: 'Identify common usability issues such as missing language, alt text, and accessible link labels.', accent: 'from-purple-300/20 to-transparent' },
  { icon: faRobot, title: 'AI Search Readiness', text: 'Review FAQ, structured data, entity clarity, and answer-focused content signals.', accent: 'from-cyan-300/20 to-transparent' }
]

const proofPoints = [
  { icon: faBolt, label: 'Fast first audit', value: '30-90 sec' },
  { icon: faLock, label: 'Safe URL checks', value: 'SSRF-aware' },
  { icon: faChartLine, label: 'Actionable scoring', value: '0-100' }
]

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <section className="relative px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="absolute left-1/2 top-16 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-yellow-300/15 blur-3xl" />
        <HeroPreviewCards />
        <div className="mx-auto max-w-7xl text-center">
          <div className="animate-fade-up mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-300/30 bg-yellow-300/10 px-4 py-2 text-sm font-medium text-yellow-100 shadow-lg shadow-yellow-500/10">
            <FontAwesomeIcon icon={faWandMagicSparkles} className="h-4 w-4" />
            Professional website audit powered by Nexora Creation
          </div>
          <h1 className="animate-fade-up mx-auto max-w-5xl text-5xl font-black tracking-tight text-white [animation-delay:120ms] sm:text-7xl">Free Technical SEO Audit Tool</h1>
          <p className="animate-fade-up mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-300 [animation-delay:220ms]">
            Analyze SEO, performance, crawlability, accessibility, security, and technical issues in seconds.
          </p>
          <div className="animate-fade-up [animation-delay:320ms]">
            <AuditForm />
          </div>
          <p className="mt-4 text-sm text-zinc-500">No login required. No paid SEO data APIs. Results are generated from real website checks.</p>

          <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-3">
            {proofPoints.map((item, index) => (
              <div key={item.label} className="glass-card soft-transition rounded-[10px] p-4 text-left" style={{ animationDelay: `${index * 90 + 420}ms` }}>
                <FontAwesomeIcon icon={item.icon} className="h-5 w-5 text-nexora-yellow" />
                <div className="mt-3 text-2xl font-black">{item.value}</div>
                <div className="text-sm text-zinc-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-nexora-yellow">What the audit checks</p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">Clear checks, practical fixes, no guesswork.</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-zinc-400">Designed for business owners, marketers, freelancers, and agencies who need a report that is easy to understand and useful to act on.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="glass-card soft-transition group relative overflow-hidden rounded-[10px] p-6">
              <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${feature.accent} opacity-70 transition duration-300 group-hover:opacity-100`} />
              <div className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-yellow-300/25 bg-yellow-300/10 text-nexora-yellow shadow-lg shadow-yellow-500/10">
                <FontAwesomeIcon icon={feature.icon} className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-bold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="glass-card animate-glow-pulse rounded-[10px] p-8 md:p-12">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-nexora-yellow">Workflow</p>
              <h2 className="mt-3 text-3xl font-black">How your audit works</h2>
            </div>
            <a href="https://nexoracreation.com" target="_blank" rel="noreferrer" className="text-sm font-semibold text-nexora-yellow hover:text-yellow-300">Powered by Nexora Creation</a>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {['Securely validate your URL', 'Fetch and analyze real page HTML', 'Run SEO, CRO, UX, and security checks', 'Show scores, priorities, and fixes'].map((step, index) => (
              <div key={step} className="soft-transition rounded-[10px] border border-white/10 bg-black/30 p-5 shadow-xl shadow-black/20">
                <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-nexora-yellow font-black text-black">0{index + 1}</div>
                <div className="mt-4 font-semibold leading-6">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
