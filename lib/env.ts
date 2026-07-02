const numberFromEnv = (name: string, fallback: number) => {
  const value = process.env[name]
  if (!value) return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL,
  fetchTimeoutMs: numberFromEnv('FETCH_TIMEOUT_MS', 15000),
  auditTimeoutMs: numberFromEnv('AUDIT_TIMEOUT_MS', 60000),
  maxCrawlPages: numberFromEnv('MAX_CRAWL_PAGES', 10),
  maxLinkChecks: numberFromEnv('MAX_LINK_CHECKS', 50),
  cacheTtlHours: numberFromEnv('CACHE_TTL_HOURS', 24),
  enableLighthouse: process.env.ENABLE_LIGHTHOUSE === 'true',
  enablePlaywright: process.env.ENABLE_PLAYWRIGHT === 'true',
  pageSpeedApiKey: process.env.PAGESPEED_API_KEY || '',
  ai: {
    provider: process.env.AI_PROVIDER || 'openrouter',
    apiKey: process.env.AI_API_KEY || process.env.GEMINI_API_KEY || process.env.GROK_API_KEY || '',
    baseUrl: process.env.AI_BASE_URL || process.env.GROK_BASE_URL || 'https://openrouter.ai/api/v1',
    model: process.env.AI_MODEL || process.env.GEMINI_MODEL || process.env.GROK_MODEL || 'google/gemini-flash-1.5'
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY || '',
    model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant'
  }
}
