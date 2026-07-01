import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)))
}

export function scoreLabel(score: number) {
  if (score >= 90) return 'Excellent'
  if (score >= 75) return 'Good'
  if (score >= 60) return 'Needs improvement'
  if (score >= 40) return 'Poor'
  return 'Critical'
}
