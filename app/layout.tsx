import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Nexora Audit Pro | Free SEO & CRO Website Audit',
  description: 'Run a free technical SEO, performance, accessibility, security, and CRO audit for your website. Powered by Nexora Creation.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} min-h-screen bg-nexora-black font-sans antialiased`}>
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
          <Toaster theme="dark" richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
