import type { CheerioAPI } from 'cheerio'
import type { CrawledPage, FetchResult } from '@/types/audit'
import { getWordCount } from '@/features/audit/analyzers/content'

export function extractPage($: CheerioAPI, fetchResult: FetchResult): CrawledPage {
  const base = new URL(fetchResult.finalUrl)
  let internalLinks = 0
  let externalLinks = 0

  $('a[href]').each((_, el) => {
    try {
      const url = new URL($(el).attr('href') || '', fetchResult.finalUrl)
      if (url.hostname === base.hostname) internalLinks += 1
      else externalLinks += 1
    } catch {}
  })

  return {
    url: fetchResult.finalUrl,
    statusCode: fetchResult.statusCode,
    contentType: fetchResult.contentType,
    title: $('title').first().text().trim(),
    metaDescription: $('meta[name="description"]').attr('content')?.trim() || '',
    h1: $('h1').first().text().trim(),
    wordCount: getWordCount($),
    internalLinks,
    externalLinks,
    imageCount: $('img').length
  }
}
