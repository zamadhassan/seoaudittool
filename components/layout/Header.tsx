import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare, faChartSimple } from '@fortawesome/free-solid-svg-icons'

export function Header() {
  return (
    <header className="border-b border-white/10 bg-black/30 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-nexora-yellow text-black shadow-lg shadow-yellow-500/20">
            <FontAwesomeIcon icon={faChartSimple} className="h-4 w-4" />
          </span>
          <span>Nexora <span className="text-nexora-yellow">Audit Pro</span></span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-zinc-300">
          <a href="https://nexoracreation.com" target="_blank" rel="noreferrer" className="hidden items-center gap-2 hover:text-white sm:inline-flex">Nexora Creation <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-3 w-3" /></a>
          <Link href="/dashboard" className="hidden hover:text-white sm:inline">Reports</Link>
          <Link href="/#audit" className="rounded-full bg-nexora-yellow px-4 py-2 font-semibold text-black hover:bg-yellow-300">Start Free Audit</Link>
        </nav>
      </div>
    </header>
  )
}
