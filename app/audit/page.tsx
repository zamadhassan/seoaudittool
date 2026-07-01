'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const steps = ['Validating website URL', 'Fetching website data', 'Reading page content', 'Checking SEO signals', 'Reviewing conversion readiness', 'Preparing recommendations', 'Building your report']

function AuditRunningContent() {
  const params = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState('')
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setActiveStep((step) => Math.min(step + 1, steps.length - 1)), 900)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const url = params.get('url')
    if (!url) {
      setError('Missing URL.')
      return
    }

    fetch('/api/audit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ url })
    })
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Audit failed.')
        if (data.report?.id) {
          localStorage.setItem(`nexora-report-${data.report.id}`, JSON.stringify(data.report))
        }
        router.push(data.reportUrl)
      })
      .catch((err: Error) => setError(err.message))
  }, [params, router])

  return (
    <main className="mx-auto min-h-[70vh] max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black">Preparing your website audit</h1>
      <p className="mt-3 text-zinc-400">We are checking real website signals for SEO, performance, accessibility, security, and conversion readiness.</p>
      <div className="mt-8 space-y-3">
        {steps.map((step, index) => (
          <div key={step} className={`rounded-[10px] border p-4 ${index <= activeStep ? 'border-yellow-300/40 bg-yellow-300/10 text-yellow-50' : 'border-white/10 bg-white/[0.03] text-zinc-500'}`}>{step}</div>
        ))}
      </div>
      {error ? <div className="mt-6 rounded-[10px] border border-red-400/30 bg-red-500/10 p-4 text-red-100">{error}</div> : null}
    </main>
  )
}

export default function AuditRunningPage() {
  return (
    <Suspense fallback={<main className="mx-auto min-h-[70vh] max-w-3xl px-4 py-20 text-zinc-300">Preparing audit...</main>}>
      <AuditRunningContent />
    </Suspense>
  )
}
