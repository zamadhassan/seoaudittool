'use client'

import { scoreLabel } from '@/lib/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowTrendUp, faCircleCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import CountUp from 'react-countup'

export function ScoreCard({ label, score, detail }: { label: string; score: number; detail?: string }) {
  const icon = score >= 75 ? faCircleCheck : score >= 60 ? faArrowTrendUp : faTriangleExclamation
  const tone = score >= 75 ? 'text-emerald-300 bg-emerald-500/10 border-emerald-300/20' : score >= 60 ? 'text-yellow-100 bg-yellow-500/10 border-yellow-300/20' : 'text-red-200 bg-red-500/10 border-red-300/20'

  return (
    <div className="glass-card soft-transition rounded-[10px] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm text-zinc-400">{label}</div>
        <div className={`flex h-9 w-9 items-center justify-center rounded-[10px] border ${tone}`}>
          <FontAwesomeIcon icon={icon} className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-4">
        <div>
          <div className="text-4xl font-black text-white"><CountUp end={score} duration={1.1} enableScrollSpy /> </div>
          <div className="mt-1 text-sm font-medium text-nexora-yellow">{scoreLabel(score)}</div>
        </div>
        <div className="relative h-16 w-16">
          <svg viewBox="0 0 42 42" className="h-16 w-16 -rotate-90">
            <circle cx="21" cy="21" r="17" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="4" />
            <circle cx="21" cy="21" r="17" fill="none" stroke="#FECB2F" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${score} 100`} pathLength="100" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-zinc-300">/100</div>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-nexora-yellow" style={{ width: `${score}%` }} />
      </div>
      {detail ? <p className="mt-3 text-xs leading-5 text-zinc-500">{detail}</p> : null}
    </div>
  )
}
