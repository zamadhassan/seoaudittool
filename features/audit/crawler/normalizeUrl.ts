export function normalizeUrl(input: string) {
  const trimmed = input.trim()
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  const url = new URL(withProtocol)
  url.hash = ''
  if (url.pathname === '/') url.pathname = ''
  return url.toString()
}
