'use client'

import { useState } from 'react'
import { Globe2 } from 'lucide-react'

export function WebsiteIcon({ src, domain, size = 'lg' }: { src: string | null; domain: string; size?: 'sm' | 'lg' }) {
  const [failed, setFailed] = useState(false)
  const className = size === 'sm' ? 'h-8 w-8 rounded-[8px]' : 'h-14 w-14 rounded-[10px]'

  if (!src || failed) {
    return (
      <div className={`${className} flex items-center justify-center border border-yellow-300/25 bg-yellow-300/10 text-nexora-yellow`}>
        <Globe2 className={size === 'sm' ? 'h-4 w-4' : 'h-7 w-7'} aria-label={`${domain} fallback icon`} />
      </div>
    )
  }

  // Favicon domains are user-provided and cannot be configured ahead of time for next/image.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={`${domain} favicon`} onError={() => setFailed(true)} className={`${className} border border-white/10 bg-white object-contain p-1`} />
}
