import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Nexora Audit Pro',
  description: 'Free technical SEO and CRO audit tool for real website checks.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-nexora-black font-sans antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
