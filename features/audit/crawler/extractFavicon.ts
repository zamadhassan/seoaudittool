import type { CheerioAPI } from 'cheerio'

const faviconRels = ['icon', 'shortcut icon', 'apple-touch-icon', 'mask-icon']

export function extractFavicon($: CheerioAPI, finalUrl: string) {
  const base = new URL(finalUrl)
  const candidates: string[] = []

  $('link[rel]').each((_, el) => {
    const rel = ($(el).attr('rel') || '').toLowerCase()
    const href = $(el).attr('href')
    if (!href) return
    if (faviconRels.some((item) => rel.split(/\s+/).includes(item) || rel === item)) {
      candidates.push(href)
    }
  })

  const href = candidates[0]
  if (href) {
    try {
      return new URL(href, finalUrl).toString()
    } catch {}
  }

  return `${base.protocol}//${base.host}/favicon.ico`
}
