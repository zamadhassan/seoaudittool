import { scoreLabel } from '@/lib/utils'

export function ScoreCard({ label, score }: { label: string; score: number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <div className="text-sm text-zinc-400">{label}</div>
      <div className="mt-3 flex items-end justify-between gap-4">
        <div className="text-4xl font-black text-white">{score}</div>
        <div className="text-sm font-medium text-nexora-yellow">{scoreLabel(score)}</div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-nexora-yellow" style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}
