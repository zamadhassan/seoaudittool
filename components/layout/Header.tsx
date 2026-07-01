import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b border-white/10 bg-black/30 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Nexora <span className="text-nexora-yellow">Audit Pro</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-zinc-300">
          <a href="https://nexoracreation.com" target="_blank" rel="noreferrer" className="hidden hover:text-white sm:inline">Nexora Creation</a>
          <Link href="/dashboard" className="hidden hover:text-white sm:inline">Reports</Link>
          <a href="/#audit" className="rounded-full bg-nexora-yellow px-4 py-2 font-semibold text-black hover:bg-yellow-300">Start Free Audit</a>
        </nav>
      </div>
    </header>
  )
}
