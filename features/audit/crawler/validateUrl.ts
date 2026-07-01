import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'
import { z } from 'zod'
import { normalizeUrl } from './normalizeUrl'

const inputSchema = z.string().trim().min(3).max(2048)

function isPrivateIPv4(ip: string) {
  const parts = ip.split('.').map(Number)
  return parts[0] === 10 || parts[0] === 127 || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || (parts[0] === 192 && parts[1] === 168) || (parts[0] === 169 && parts[1] === 254) || parts[0] === 0
}

function isPrivateIPv6(ip: string) {
  const value = ip.toLowerCase()
  return value === '::1' || value.startsWith('fc') || value.startsWith('fd') || value.startsWith('fe80:')
}

function isBlockedHostname(hostname: string) {
  const host = hostname.toLowerCase()
  return host === 'localhost' || host.endsWith('.localhost') || !host.includes('.')
}

export async function validateAndNormalizeUrl(input: string) {
  const parsedInput = inputSchema.parse(input)
  const normalized = normalizeUrl(parsedInput)
  const url = new URL(normalized)

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Only HTTP and HTTPS URLs are allowed.')
  }

  if (isBlockedHostname(url.hostname)) {
    throw new Error('Internal hostnames are not allowed.')
  }

  const directIpVersion = isIP(url.hostname)
  if (directIpVersion === 4 && isPrivateIPv4(url.hostname)) throw new Error('Private IP ranges are not allowed.')
  if (directIpVersion === 6 && isPrivateIPv6(url.hostname)) throw new Error('Private IP ranges are not allowed.')

  const addresses = await lookup(url.hostname, { all: true }).catch(() => [])
  for (const address of addresses) {
    if (address.family === 4 && isPrivateIPv4(address.address)) throw new Error('URL resolves to a private IP range.')
    if (address.family === 6 && isPrivateIPv6(address.address)) throw new Error('URL resolves to a private IP range.')
  }

  return normalized
}
