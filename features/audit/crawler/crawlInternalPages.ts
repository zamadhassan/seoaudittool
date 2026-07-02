import * as cheerio from 'cheerio'
import pLimit from 'p-limit'
import type { CheerioAPI } from 'cheerio'
import { env } from '@/lib/env'
import { extractPage } from './extractPage'
import { fetchHtml } from './fetchHtml'
import type { CrawledPage } from '@/types/audit'

const ignoredExtensions = /\.(?:pdf|zip|jpg|jpeg|png|gif|webp|avif|svg|css|js|mp4|mp3|mov|avi|doc|docx|xls|xlsx|ppt|pptx)$/i

function cleanUrl(value: string) {
  const url = new URL(value)
  url.hash = ''
  return url.toString()
}

export function extractInternalPageUrls($: CheerioAPI, finalUrl: string) {
  const base = new URL(finalUrl)
  const seen = new Set<string>()

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || ''
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) return
    try {
      const url = new URL(href, finalUrl)
      if (!['http:', 'https:'].includes(url.protocol)) return
      if (url.hostname !== base.hostname) return
      if (ignoredExtensions.test(url.pathname)) return
      const cleaned = cleanUrl(url.toString())
      if (cleaned !== cleanUrl(finalUrl)) seen.add(cleaned)
    } catch {}
  })

  return Array.from(seen).slice(0, Math.max(0, env.maxCrawlPages - 1))
}

export async function crawlInternalPages($: CheerioAPI, finalUrl: string): Promise<CrawledPage[]> {
  const urls = extractInternalPageUrls($, finalUrl)
  const limit = pLimit(3)
  const results = await Promise.allSettled(urls.map((url) => limit(async () => {
    const fetched = await fetchHtml(url)
    if (!fetched.contentType.includes('text/html')) return null
    const pageHtml = cheerio.load(fetched.html)
    return extractPage(pageHtml, fetched)
  })))

  return results.flatMap((result) => result.status === 'fulfilled' && result.value ? [result.value] : [])
}
