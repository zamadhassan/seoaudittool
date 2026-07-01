import { scoreLabel } from '@/lib/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowTrendUp, faCircleCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'

export function ScoreCard({ label, score, detail }: { label: string; score: number; detail?: string }) {
  const icon = score >= 75 ? faCircleCheck : score >= 60 ? faArrowTrendUp : faTriangleExclamation
  const tone = score >= 75 ? 'text-emerald-300 bg-emerald-500/10 border-emerald-300/20' : score >= 60 ? 'text-yellow-100 bg-yellow-500/10 border-yellow-300/20' : 'text-red-200 bg-red-500/10 border-red-300/20'

  return (
    <div className="glass-card soft-transition rounded-[1.6rem] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm text-zinc-400">{label}</div>
        <div className={`flex h-9 w-9 items-center justify-center rounded-2xl border ${tone}`}>
          <FontAwesomeIcon icon={icon} className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between gap-4">
        <div className="text-4xl font-black text-white">{score}</div>
        <div className="text-sm font-medium text-nexora-yellow">{scoreLabel(score)}</div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-nexora-yellow" style={{ width: `${score}%` }} />
      </div>
      {detail ? <p className="mt-3 text-xs leading-5 text-zinc-500">{detail}</p> : null}
    </div>
  )
}
