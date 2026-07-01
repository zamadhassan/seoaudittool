# Nexora Audit Pro

Production-oriented Next.js technical SEO and CRO audit tool. Users enter a URL, the app securely validates it, fetches real HTML, runs modular checks, scores the page, and renders a shareable report with PDF export.

## Features

- Secure URL normalization and validation with localhost/private IP blocking.
- Real homepage HTML fetch with timeout and redirect-loop protection.
- Cheerio-powered checks for metadata, headings, content, images, links, security, CRO, schema, mobile, accessibility, and AI SEO readiness signals.
- Weighted 0-100 scoring and practical fallback recommendations.
- Report page, dashboard, JSON report API, audit status API, and PDF export route.
- Prisma PostgreSQL schema included for durable persistence.
- No paid SEO APIs are used.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM + PostgreSQL schema
- Cheerio
- zod
- jsPDF
- lucide-react

## Setup

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run dev
```

Open `http://localhost:3000` and run an audit.

## Environment Variables

See `.env.example` for all supported variables. Heavy browser-based checks are controlled by `ENABLE_LIGHTHOUSE` and `ENABLE_PLAYWRIGHT`; they default to `false` for Vercel-safe operation.

## Database

The Prisma schema defines users, projects, reports, issues, page crawls, and audit cache. The current MVP keeps reports in process memory for fast local use; the schema is ready for the next step of replacing the memory store with Prisma-backed persistence.

## Deploy To Vercel

1. Push to GitHub.
2. Import the repository into Vercel.
3. Add environment variables.
4. Add a PostgreSQL database and set `DATABASE_URL`.
5. Deploy.

## Limitations

- Current implementation audits the homepage only.
- Playwright, Lighthouse, PageSpeed, AI provider calls, authentication, durable Prisma storage, and crawl queue workers are planned follow-up modules.
- Reports stored in memory disappear on server restart until Prisma persistence is connected.

## No Paid API Policy

This project does not use Ahrefs, Semrush, Moz, DataForSEO, SerpAPI, SimilarWeb, or paid SEO data providers. Optional future integrations are limited to PageSpeed Insights and AI recommendation providers when keys are supplied.
