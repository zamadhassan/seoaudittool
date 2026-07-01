'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export function AuditForm() {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (!url.trim()) {
      setError('Please enter a website URL to start your audit.')
      return
    }
    startTransition(() => router.push(`/audit?url=${encodeURIComponent(url.trim())}`))
  }

  return (
    <form id="audit" onSubmit={onSubmit} className="mx-auto mt-8 flex max-w-3xl flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-yellow-500/10 sm:flex-row">
      <div className="flex-1">
        <input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="Enter your website URL, e.g. https://example.com"
          className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 text-white outline-none ring-nexora-yellow/60 placeholder:text-zinc-500 focus:ring-2"
        />
        {error ? <p className="px-2 pt-2 text-sm text-red-300">{error}</p> : null}
      </div>
      <button disabled={isPending} className="h-14 rounded-2xl bg-nexora-yellow px-7 font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60">
        {isPending ? 'Starting audit...' : 'Run Free Audit'}
      </button>
    </form>
  )
}
