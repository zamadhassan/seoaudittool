import { env } from '@/lib/env'
import type { FetchResult } from '@/types/audit'
import { validateAndNormalizeUrl } from './validateUrl'

export async function fetchHtml(inputUrl: string): Promise<FetchResult> {
  let currentUrl = await validateAndNormalizeUrl(inputUrl)
  const redirectChain: string[] = []
  const started = Date.now()

  for (let redirectCount = 0; redirectCount <= 5; redirectCount += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), env.fetchTimeoutMs)
    const response = await fetch(currentUrl, {
      redirect: 'manual',
      signal: controller.signal,
      headers: { 'user-agent': 'NexoraAuditPro/0.1 (+https://nexoracreation.com)' }
    }).finally(() => clearTimeout(timeout))

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location')
      if (!location) break
      const nextUrl = new URL(location, currentUrl).toString()
      if (redirectChain.includes(nextUrl)) throw new Error('Redirect loop detected.')
      redirectChain.push(nextUrl)
      currentUrl = await validateAndNormalizeUrl(nextUrl)
      continue
    }

    const contentType = response.headers.get('content-type') || ''
    const html = await response.text()
    const headers = Object.fromEntries(response.headers.entries())

    return {
      requestedUrl: inputUrl,
      finalUrl: currentUrl,
      statusCode: response.status,
      contentType,
      headers,
      html,
      responseTimeMs: Date.now() - started,
      redirectChain
    }
  }

  throw new Error('Too many redirects.')
}
