'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2, Radar } from 'lucide-react'

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
      <div className="glass-card relative overflow-hidden rounded-[10px] p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(254,203,47,0.16),transparent_35%)]" />
        <div className="relative flex flex-col items-center text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} className="flex h-24 w-24 items-center justify-center rounded-full border border-yellow-300/20 bg-yellow-300/10 text-nexora-yellow shadow-2xl shadow-yellow-500/20">
            <Radar className="h-10 w-10" />
          </motion.div>
          <h1 className="mt-6 text-4xl font-black">Preparing your website audit</h1>
          <p className="mt-3 max-w-xl text-zinc-400">We are checking real website signals for SEO, performance, accessibility, security, and conversion readiness.</p>
        </div>
      </div>
      <div className="mt-8 space-y-3">
        {steps.map((step, index) => (
          <motion.div key={step} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className={`flex items-center gap-3 rounded-[10px] border p-4 ${index <= activeStep ? 'border-yellow-300/40 bg-yellow-300/10 text-yellow-50' : 'border-white/10 bg-white/[0.03] text-zinc-500'}`}>
            {index <= activeStep ? <CheckCircle2 className="h-5 w-5 text-nexora-yellow" /> : <Loader2 className="h-5 w-5 animate-spin" />}
            {step}
          </motion.div>
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
