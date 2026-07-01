# Nexora Audit Pro — Technical SEO + CRO Audit Tool SRS for OpenCode

## 0. Instruction for OpenCode

Build this as a real production-ready Next.js application, not a mockup.
The product should work like a Rank Math-style technical SEO audit tool plus CRO audit system.

Important rules:

- Do not use paid SEO APIs.
- Do not use Ahrefs, Semrush, Moz, DataForSEO, SerpAPI, Screaming Frog API, Similarweb API, or any paid third-party SEO data provider.
- Use open-source libraries and custom crawler logic.
- Only optional external APIs allowed:
  - Google PageSpeed Insights API if environment key exists.
  - AI provider API for recommendations using Gemini, OpenRouter, or Grok/xAI-compatible endpoint.
- If PageSpeed API is missing or fails, the audit must still work using Lighthouse/custom checks.
- Search Console API must not be used.
- The app must be deployable on Vercel.
- Keep code modular, typed, secure, and scalable.

---

## 1. Project Name

Nexora Audit Pro

## 2. Product Goal

Create a web-based audit tool where a user enters a website URL and receives a detailed report covering:

- Technical SEO
- On-page SEO
- Crawlability
- Indexability
- Performance
- Core Web Vitals
- Accessibility
- Security
- Schema
- Mobile UX
- CRO
- Lead generation readiness
- Google Ads landing page readiness
- AI SEO / GEO / AEO readiness

The tool should help agencies, freelancers, and local businesses understand what is wrong with a website and what to fix first.

---

## 3. Target Users

Primary users:

- Nexora Creation internal team
- Freelancers doing SEO audits
- Agencies sending audits to clients
- Local business owners
- Website owners
- Google Ads landing page owners

---

## 4. Core User Flow

1. User visits homepage.
2. User enters website URL.
3. App validates and normalizes URL.
4. App starts audit.
5. Audit engine crawls homepage and optionally a limited number of internal pages.
6. Audit modules run in parallel.
7. Scores are calculated.
8. AI recommendation engine generates simple fix suggestions.
9. Report page displays result.
10. User can export PDF.
11. User can share report link.

---

## 5. Tech Stack

Use:

- Next.js latest App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Prisma ORM
- PostgreSQL
- Cheerio
- Playwright
- Lighthouse
- axe-core
- robots-parser
- xml2js or fast-xml-parser
- zod
- lucide-react
- recharts
- jspdf or react-pdf
- html-to-image if needed for PDF charts
- p-limit for concurrency
- undici or native fetch
- nanoid
- date-fns

Optional:

- Redis / Upstash Redis for caching and queue state
- BullMQ only if running worker outside Vercel

Important Vercel note:

- Heavy Lighthouse/Playwright jobs can hit serverless limits.
- Build the architecture so homepage-level audits work on Vercel.
- Add config flags to disable heavy modules if environment does not support them.
- For future scaling, keep worker-ready architecture.

---

## 6. Environment Variables

Create `.env.example`:

```env
DATABASE_URL="postgresql://user:password@host:5432/nexora_audit_pro"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional PageSpeed API
PAGESPEED_API_KEY=""

# AI provider config
AI_PROVIDER="openrouter"
AI_API_KEY=""
AI_BASE_URL="https://openrouter.ai/api/v1"
AI_MODEL="google/gemini-flash-1.5"

# Optional Grok / xAI-compatible config
GROK_API_KEY=""
GROK_BASE_URL="https://api.x.ai/v1"
GROK_MODEL="grok-3-mini"

# Optional Gemini direct config
GEMINI_API_KEY=""
GEMINI_MODEL="gemini-1.5-flash"

# Audit limits
MAX_CRAWL_PAGES=10
MAX_LINK_CHECKS=50
AUDIT_TIMEOUT_MS=60000
FETCH_TIMEOUT_MS=15000
CACHE_TTL_HOURS=24
```

---

## 7. Pages

### 7.1 Homepage `/`

Build a modern SaaS landing page using Nexora-style dark/yellow branding.

Sections:

- Hero
- URL audit form
- Feature cards
- Audit category preview
- How it works
- Example report preview
- CRO audit preview
- CTA
- Footer

Hero copy:

Title:
`Free Technical SEO & CRO Audit Tool`

Subtitle:
`Analyze any website for SEO, performance, crawlability, accessibility, security, UX, and conversion issues using real audit checks.`

CTA:
`Run Free Audit`

Input placeholder:
`Enter website URL e.g. https://example.com`

---

### 7.2 Audit Running Page `/audit?url=`

Show progress UI:

- Validating URL
- Fetching website
- Parsing HTML
- Running SEO checks
- Running performance checks
- Running CRO checks
- Generating recommendations
- Building report

Use polling if audit is stored asynchronously.

---

### 7.3 Report Page `/report/[id]`

Sections:

- Website URL
- Audit date
- Overall score
- Score cards
- Critical issues
- Warnings
- Passed checks
- Category filters
- Priority fixes
- AI summary
- Technical SEO section
- CRO section
- Performance section
- Accessibility section
- Security section
- Schema section
- Links section
- Images section
- PDF export button
- Share report button
- Re-run audit button

---

### 7.4 Dashboard `/dashboard`

For saved reports:

- Recent audits
- Saved websites
- Score history
- Exported reports
- Settings

Guest mode can work without login, but logged-in users can save reports.

---

## 8. Authentication

Implement simple optional authentication.

Options:

- Better Auth preferred
- NextAuth acceptable

Features:

- Guest audit allowed
- Login required for saved history
- Google login optional
- Email/password optional

Do not block basic audit behind login.

---

## 9. Database Schema

Use Prisma.

### 9.1 User

Fields:

- id
- name
- email
- image
- createdAt
- updatedAt

### 9.2 Project

Fields:

- id
- userId nullable
- domain
- name
- createdAt
- updatedAt

### 9.3 AuditReport

Fields:

- id
- userId nullable
- projectId nullable
- url
- finalUrl
- domain
- status: `pending | running | completed | failed`
- overallScore
- technicalScore
- performanceScore
- accessibilityScore
- securityScore
- crawlabilityScore
- indexabilityScore
- onPageScore
- croScore
- mobileScore
- aiSeoScore
- summaryJson
- rawJson
- createdAt
- updatedAt

### 9.4 AuditIssue

Fields:

- id
- reportId
- title
- description
- category
- severity: `critical | warning | notice | passed`
- priority: `high | medium | low`
- scoreImpact
- recommendation
- whyItMatters
- howToFix
- businessImpact
- seoImpact
- croImpact
- affectedUrl nullable
- evidenceJson nullable
- createdAt

### 9.5 PageCrawl

Fields:

- id
- reportId
- url
- statusCode
- contentType
- title
- metaDescription
- h1
- wordCount
- internalLinks
- externalLinks
- imageCount
- createdAt

### 9.6 AuditCache

Fields:

- id
- urlHash
- url
- resultJson
- expiresAt
- createdAt

---

## 10. TypeScript Types

Create `types/audit.ts`.

```ts
export type AuditSeverity = 'critical' | 'warning' | 'notice' | 'passed'
export type AuditPriority = 'high' | 'medium' | 'low'

export type AuditIssue = {
  id?: string
  title: string
  description: string
  category: string
  severity: AuditSeverity
  priority: AuditPriority
  scoreImpact: number
  recommendation: string
  whyItMatters?: string
  howToFix?: string
  businessImpact?: string
  seoImpact?: string
  croImpact?: string
  affectedUrl?: string
  evidence?: Record<string, unknown>
}

export type AuditScores = {
  overall: number
  technical: number
  performance: number
  accessibility: number
  security: number
  crawlability: number
  indexability: number
  onPage: number
  cro: number
  mobile: number
  aiSeo: number
}

export type AuditReport = {
  url: string
  finalUrl: string
  domain: string
  createdAt: string
  scores: AuditScores
  issues: AuditIssue[]
  summary: AuditSummary
  pages: CrawledPage[]
  raw: Record<string, unknown>
}
```

---

## 11. Folder Structure

Use this scalable architecture:

```txt
app/
  page.tsx
  audit/page.tsx
  report/[id]/page.tsx
  dashboard/page.tsx
  api/
    audit/route.ts
    audit/status/[id]/route.ts
    report/[id]/route.ts
    pdf/[id]/route.ts

components/
  audit/
    AuditForm.tsx
    AuditProgress.tsx
    ScoreCard.tsx
    ScoreGrid.tsx
    IssueCard.tsx
    IssueFilters.tsx
    ReportHeader.tsx
    ReportSummary.tsx
    PdfExportButton.tsx
    ShareReportButton.tsx
  layout/
    Header.tsx
    Footer.tsx
  ui/

features/
  audit/
    engine/
      runAudit.ts
      buildReport.ts
      scoreReport.ts
      issueFactory.ts
    crawler/
      normalizeUrl.ts
      validateUrl.ts
      fetchHtml.ts
      renderPage.ts
      crawlInternalPages.ts
      extractLinks.ts
      checkLinks.ts
    analyzers/
      technicalSeo.ts
      onPageSeo.ts
      meta.ts
      headings.ts
      content.ts
      images.ts
      links.ts
      schema.ts
      robots.ts
      sitemap.ts
      security.ts
      accessibility.ts
      performance.ts
      mobile.ts
      cro.ts
      aiSeo.ts
      googleAdsLandingPage.ts
    recommendations/
      aiProvider.ts
      promptBuilder.ts
      fallbackRecommendations.ts
    pdf/
      generatePdf.ts
    cache/
      auditCache.ts

lib/
  db.ts
  env.ts
  logger.ts
  rateLimit.ts
  safeFetch.ts
  utils.ts

prisma/
  schema.prisma
```

---

## 12. URL Security

Before crawling, validate URL using zod.

Rules:

- Accept `example.com` and normalize to `https://example.com`.
- Trim spaces.
- Block localhost.
- Block private IP ranges.
- Block internal hostnames.
- Block file protocol.
- Allow only http and https.
- Limit redirect count to 5.
- Timeout every request.

Blocked ranges:

- 127.0.0.0/8
- 10.0.0.0/8
- 172.16.0.0/12
- 192.168.0.0/16
- 169.254.0.0/16
- ::1
- fc00::/7
- fe80::/10

---

## 13. Audit Engine Pipeline

Main function:

```ts
runAudit(inputUrl: string): Promise<AuditReport>
```

Pipeline:

1. Validate URL
2. Normalize URL
3. Check cache
4. Fetch homepage HTML
5. Follow redirects
6. Capture headers
7. Parse HTML with Cheerio
8. Optionally render with Playwright if JS-heavy
9. Extract internal links
10. Crawl limited internal pages
11. Run audit modules in parallel
12. Run optional PageSpeed API
13. Run optional Lighthouse
14. Calculate scores
15. Generate AI recommendations
16. Save report
17. Return report

Use `Promise.allSettled` so one failed module does not crash the audit.

---

## 14. Audit Categories and Checks

Each check must return an AuditIssue.

### 14.1 Basic URL / HTTP Checks

Checks:

- Final URL detected
- HTTP status code is 200
- Redirect chain exists
- Redirect count under 3
- No redirect loop
- HTTPS enabled
- HTTP redirects to HTTPS
- WWW/non-WWW consistency
- Response time under 2 seconds
- Page size under recommended limit
- Content type is HTML
- Server header present
- Gzip/Brotli compression enabled
- Cache headers present

### 14.2 Meta Tag Checks

Checks:

- Title exists
- Title length 50–60 characters preferred
- Title not too short
- Title not too long
- Title is unique against H1
- Meta description exists
- Meta description 150–160 characters preferred
- Meta description not duplicated from title
- Meta robots tag valid
- Canonical exists
- Canonical is absolute URL
- Canonical matches final URL or intended URL
- Viewport tag exists
- Charset tag exists
- HTML lang attribute exists
- Favicon exists
- Open Graph title exists
- Open Graph description exists
- Open Graph image exists
- Twitter card exists

### 14.3 Heading Checks

Checks:

- One H1 exists
- No missing H1
- No multiple H1 unless intentionally acceptable
- H1 is descriptive
- H1 is not empty
- H2 count is reasonable
- H3 count is reasonable
- No empty headings
- Heading order does not skip levels badly
- H1 is not same as title exactly

### 14.4 Content Checks

Checks:

- Word count above 300 for normal page
- Thin content warning
- Duplicate title/H1 warning
- Paragraph readability
- Sentence length warning
- Text-to-HTML ratio
- Large DOM size
- Keyword stuffing basic detection
- Contact information visible for local business pages
- Service area mentioned for local businesses
- Main service keyword appears naturally

### 14.5 Image SEO Checks

Checks:

- Total images count
- Missing alt attributes
- Empty alt attributes
- Decorative images handled correctly
- Broken image URLs
- Images without width/height
- Large images over 300 KB warning
- Non-modern formats warning
- WebP/AVIF usage
- Lazy loading usage
- Above-the-fold hero image not lazy-loaded if likely LCP image
- Image filenames descriptive

### 14.6 Link Checks

Checks:

- Total links
- Internal links count
- External links count
- Broken internal links
- Broken external links
- Empty anchor text
- Generic anchor text warning
- Nofollow links count
- HTTP links on HTTPS page
- Links opening new tab have rel noopener/noreferrer
- Mailto links detected
- Tel links detected
- Navigation links exist
- Footer links exist
- Important CTA links exist

### 14.7 Crawlability Checks

Checks:

- robots.txt exists
- robots.txt is reachable
- robots.txt does not block homepage
- robots.txt does not block important directories
- sitemap.xml exists
- Sitemap is reachable
- Sitemap has URLs
- Sitemap URLs are valid
- No noindex meta on important page
- No X-Robots-Tag noindex
- Canonical URL not broken
- Canonical URL not blocked by robots
- Internal pages are crawlable

### 14.8 Indexability Checks

Checks:

- Page is indexable
- No noindex
- No canonical to unrelated page
- Status code indexable
- Content not blocked
- Page not soft 404 based on content
- Meta robots not blocking snippets unnecessarily
- Important pages not orphaned in crawl sample

### 14.9 Schema Checks

Checks:

- JSON-LD exists
- JSON-LD syntax valid
- Microdata exists
- Organization schema exists
- LocalBusiness schema exists if local business signals exist
- Breadcrumb schema exists
- FAQ schema exists if FAQ section exists
- Article schema exists for blog page
- Product schema exists for product page
- Schema has required fields where possible
- Invalid JSON-LD warning

### 14.10 Security Checks

Checks:

- HTTPS enabled
- No mixed content
- HSTS header
- Content-Security-Policy header
- X-Frame-Options header
- X-Content-Type-Options header
- Referrer-Policy header
- Permissions-Policy header
- Forms do not submit to HTTP
- External scripts count warning
- Insecure third-party scripts warning

### 14.11 Accessibility Checks

Use axe-core where possible.

Checks:

- Missing image alt
- Missing button labels
- Missing form labels
- Empty links
- Missing lang attribute
- Missing title tag
- Color contrast via axe
- ARIA misuse via axe
- Keyboard navigation warnings via axe
- Form inputs have labels
- Semantic landmarks exist
- Main landmark exists

### 14.12 Performance Checks

Use Lighthouse and/or PageSpeed when available.

Checks:

- Performance score
- First Contentful Paint
- Largest Contentful Paint
- Cumulative Layout Shift
- Total Blocking Time
- Interaction to Next Paint if available
- Speed Index
- Render-blocking resources
- Unused JavaScript
- Unused CSS
- Large JS bundles
- Large CSS files
- Image optimization
- Font loading
- Caching
- Compression
- Third-party scripts

### 14.13 Mobile UX Checks

Checks:

- Viewport exists
- Responsive layout signal
- Font size warning
- Tap targets warning via Lighthouse/axe if available
- Horizontal overflow detection using Playwright
- Sticky CTA exists on mobile for local business pages
- Phone CTA visible on mobile
- Forms usable on mobile
- Hero CTA visible above fold

### 14.14 JavaScript SEO Checks

Checks:

- Page has meaningful HTML before JS render
- Title exists in raw HTML
- Meta description exists in raw HTML
- H1 exists in raw HTML
- Links exist in raw HTML
- Content not fully hidden behind JS
- Excessive client-side rendering warning
- Script count warning
- Blocking scripts warning

### 14.15 CSS / Font Checks

Checks:

- Large CSS files
- Render-blocking CSS
- Too many stylesheets
- Inline CSS excessive
- Google Fonts count
- Font display swap used where detectable
- WOFF2 usage
- Preload key fonts warning

---

## 15. CRO Audit Module

This is very important. Build CRO checks like an agency landing page audit.

### 15.1 Hero Section Checks

- Clear headline exists above fold
- Headline explains offer/service
- Subheadline exists
- Primary CTA visible above fold
- CTA text is action-focused
- CTA button is visually prominent
- Hero section does not feel cluttered
- Trust signal near hero exists
- Phone number visible for service business
- Location/service area visible if local business

### 15.2 CTA Checks

- Primary CTA exists
- CTA repeated after key sections
- CTA not generic like “Submit” only
- CTA links to form/contact/phone
- Sticky mobile CTA exists for local service site
- Phone click-to-call link exists
- Multiple contact options available
- CTA contrast is good

### 15.3 Lead Form Checks

- Contact form exists
- Form has labels
- Form has reasonable number of fields
- Form has clear submit button
- Form has privacy/trust note if needed
- Form does not ask too many questions upfront
- Form placement is visible
- Thank-you/success state should exist

### 15.4 Trust Signal Checks

- Reviews/testimonials visible
- Star ratings visible if available
- Case studies or portfolio visible
- Certifications/badges visible
- Years of experience visible
- Client logos visible if applicable
- Real business address/contact visible
- About section exists
- Guarantee/warranty visible if applicable

### 15.5 Navigation CRO Checks

- Navigation is simple
- Contact button in header
- Services page link visible
- No overloaded menu
- Mobile menu exists
- Important pages within 1 click
- Footer contains contact information

### 15.6 Local Business CRO Checks

- Phone number visible
- Address/service area visible
- Business hours visible
- Google Maps embed or directions link exists
- Service pages visible
- Emergency service CTA if relevant
- Location pages visible if multi-city
- Review CTA visible

### 15.7 Google Ads Landing Page Readiness

- One clear offer
- Message match between headline and ad intent
- Minimal distractions
- Strong above-fold CTA
- Trust signals above fold
- Fast loading
- Mobile optimized
- Form/phone visible
- Privacy policy link exists
- Terms/contact details visible
- No misleading claims
- Clear independent business disclaimer if needed

### 15.8 Ecommerce CRO Checks

If ecommerce signals detected:

- Product images visible
- Product price visible
- Add to cart button visible
- Shipping information visible
- Return policy visible
- Reviews visible
- Trust badges visible
- Secure checkout signals
- Cart link visible
- Checkout friction warning

---

## 16. AI SEO / GEO / AEO Readiness Checks

Use custom checks, not paid APIs.

Checks:

- FAQ section exists
- Question-style headings exist
- Clear entity description exists
- Organization schema exists
- LocalBusiness schema where relevant
- Author or company credibility signals
- Service pages are specific
- Content answers direct questions
- Lists/steps/tables where useful
- Internal links to relevant services
- Contact and business details consistent
- Topical clarity
- Clear definitions for main topic

---

## 17. AI Recommendation Engine

AI must be optional.

Supported providers:

- OpenRouter-compatible chat completion
- Gemini direct API
- Grok/xAI-compatible chat completion

Create provider abstraction:

```ts
interface AIProvider {
  generateRecommendations(input: AIRecommendationInput): Promise<AIRecommendationOutput>
}
```

If AI key is missing:

- Use fallback static recommendation templates.
- App must not fail.

AI must receive only summarized issue data, not huge raw HTML.

AI output JSON format:

```json
{
  "executiveSummary": "",
  "topFixes": [
    {
      "title": "",
      "priority": "high",
      "whyItMatters": "",
      "howToFix": "",
      "expectedImpact": ""
    }
  ],
  "businessImpact": "",
  "seoImpact": "",
  "croImpact": ""
}
```

Prompt should ask AI to:

- Use simple business language.
- Avoid hallucinating data.
- Only use provided audit findings.
- Give practical fixes.
- Focus on lead generation and SEO impact.

---

## 18. Scoring System

Overall score must be 0–100.

Weighted categories:

- Technical SEO: 25%
- Performance: 20%
- CRO: 20%
- Crawlability/Indexability: 12%
- Accessibility: 8%
- Security: 7%
- On-page SEO: 5%
- AI SEO readiness: 3%

Issue impact:

- Critical: -8 to -15
- Warning: -3 to -7
- Notice: -1 to -2
- Passed: no penalty

Category score starts at 100 and subtracts issue penalties.

Minimum category score: 0.
Maximum category score: 100.

Overall score should be rounded.

Score labels:

- 90–100: Excellent
- 75–89: Good
- 60–74: Needs improvement
- 40–59: Poor
- 0–39: Critical

---

## 19. Issue Format

Every issue card must show:

- Title
- Severity badge
- Category
- Priority
- Description
- Why it matters
- How to fix
- Evidence
- Score impact

Example:

```json
{
  "title": "Missing meta description",
  "description": "This page does not have a meta description tag.",
  "severity": "warning",
  "priority": "medium",
  "category": "On-page SEO",
  "scoreImpact": 5,
  "recommendation": "Add a unique 150–160 character meta description.",
  "whyItMatters": "A good meta description can improve search result CTR.",
  "howToFix": "Add a concise summary of the page offer and include the primary keyword naturally.",
  "evidence": {
    "selector": "head > meta[name='description']",
    "found": false
  }
}
```

---

## 20. API Routes

### 20.1 Start Audit

`POST /api/audit`

Request:

```json
{
  "url": "https://example.com",
  "options": {
    "crawlLimit": 10,
    "runAI": true,
    "runPageSpeed": true,
    "runLighthouse": true
  }
}
```

Response:

```json
{
  "reportId": "abc123",
  "status": "completed",
  "reportUrl": "/report/abc123"
}
```

### 20.2 Audit Status

`GET /api/audit/status/[id]`

Response:

```json
{
  "status": "running",
  "progress": 65,
  "currentStep": "Running CRO checks"
}
```

### 20.3 Get Report

`GET /api/report/[id]`

Response:

Full report JSON.

### 20.4 Export PDF

`GET /api/pdf/[id]`

Returns PDF file.

---

## 21. UI Design

Brand:

- Dark: `#0D0D0D`
- Primary yellow: `#FECB2F`
- White text
- Gray secondary text
- Card borders: subtle gray
- Premium dashboard style

Components:

- Score cards
- Progress circles
- Category tabs
- Issue accordions
- Severity badges
- Charts
- PDF export button
- Share button

Severity colors:

- Critical: red
- Warning: orange/yellow
- Notice: blue/gray
- Passed: green

---

## 22. Report Sections

Report page order:

1. Header
2. Overall score
3. Executive summary
4. Category scores
5. Top 5 priority fixes
6. Critical issues
7. CRO findings
8. Technical SEO findings
9. Performance findings
10. Accessibility findings
11. Security findings
12. Crawlability/indexability findings
13. On-page findings
14. AI SEO readiness
15. Passed checks
16. Export/share CTA

---

## 23. PDF Report

PDF must include:

- Cover page
- Nexora Creation branding
- Website URL
- Audit date
- Overall score
- Category scores
- Executive summary
- Top 5 fixes
- Critical issues
- CRO issues
- Technical SEO issues
- Warnings
- Passed checks summary
- Next steps
- Footer: `Generated by Nexora Audit Pro by Nexora Creation`

Keep PDF professional and agency-ready.

---

## 24. Caching

Avoid repeated expensive audits.

Rules:

- Cache audit by normalized URL for 24 hours.
- Allow user to force re-run.
- Cache robots.txt and sitemap separately.
- Cache link check results for short time.

---

## 25. Rate Limiting

Add basic rate limiting:

- Guest users: 5 audits per day
- Logged-in users: 20 audits per day
- Configurable in env

Use DB-based or Redis-based limiter.

---

## 26. Error Handling

Handle:

- Invalid URL
- DNS failure
- SSL failure
- Timeout
- 403 blocked
- 404 page
- 500 server error
- Redirect loop
- Too many redirects
- Non-HTML response
- PageSpeed API failure
- AI API failure
- Lighthouse failure
- Playwright failure

Report should still show partial audit when possible.

---

## 27. Performance Requirements

Homepage-level audit should complete within 30–90 seconds depending on target site.

Use:

- Timeouts
- Concurrency limits
- Promise.allSettled
- Partial results
- Cache

Do not crawl unlimited pages.

Default limits:

- Max crawl pages: 10
- Max link checks: 50
- Max external links checked: 20
- Max image HEAD checks: 50

---

## 28. No Paid API Policy

Strictly avoid:

- Ahrefs API
- Semrush API
- Moz API
- DataForSEO
- SerpAPI
- SimilarWeb
- SpyFu
- Majestic
- Any backlink/rank tracking paid APIs

Allowed libraries:

- Cheerio
- Playwright
- Lighthouse
- axe-core
- robots-parser
- fast-xml-parser
- zod
- p-limit

Allowed optional APIs:

- Google PageSpeed Insights API
- OpenRouter AI API
- Gemini API
- Grok/xAI-compatible API

---

## 29. Future-Ready Modules

Code should allow future addition of:

- Competitor comparison
- Keyword tracking
- Backlink import from CSV
- Local SEO audit
- GBP audit manual checklist
- Content gap audit
- AI Overview readiness score
- Client portal
- White-label reports
- Scheduled audits
- Email reports

Do not build all future modules now, but keep architecture ready.

---

## 30. README Requirements

Create README with:

- Project overview
- Features
- Tech stack
- Setup instructions
- Env variables
- Database setup
- Prisma migration
- Run dev server
- Deploy to Vercel
- Limitations
- No paid API policy

Commands:

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Deployment:

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Add PostgreSQL database
5. Deploy

---

## 31. Acceptance Criteria

The project is complete when:

- User can enter URL.
- App validates URL securely.
- App crawls real website HTML.
- App runs real technical SEO checks.
- App runs real CRO checks.
- App generates category scores.
- App shows issues with fixes.
- App can generate AI recommendations if key exists.
- App works without AI key using fallback recommendations.
- App works without PageSpeed key using custom checks.
- Report page is clean and responsive.
- PDF export works.
- Reports are stored in database.
- No paid SEO API is used.
- App deploys to Vercel.

---

## 32. Build Priority

Build in this order:

1. Next.js project setup
2. UI theme
3. URL validation
4. Basic crawler
5. Cheerio parser
6. Technical SEO module
7. On-page module
8. CRO module
9. Scoring engine
10. Report UI
11. Database save
12. PDF export
13. AI provider layer
14. Optional PageSpeed/Lighthouse
15. Dashboard/history

---

## 33. Final Note for OpenCode

This should be a real working product, not a static UI.
The main value is accurate real checks, clear scoring, and practical recommendations.
Keep every module isolated so more audit checks can be added later.
