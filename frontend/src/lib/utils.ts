import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(minutes: number): string {
  if (minutes < 1) return '< 1 min'
  if (minutes < 60) return `${Math.round(minutes)} min`
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  return `${hours}h ${mins}m`
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}

export function formatRiskScore(score: number): { level: string; color: string } {
  if (score < 0.2) return { level: 'Very Low', color: 'text-green-600' }
  if (score < 0.4) return { level: 'Low', color: 'text-green-500' }
  if (score < 0.6) return { level: 'Medium', color: 'text-yellow-600' }
  if (score < 0.8) return { level: 'High', color: 'text-orange-600' }
  return { level: 'Very High', color: 'text-red-600' }
}

export function getRiskColor(score: number): string {
  if (score < 0.2) return 'bg-green-500'
  if (score < 0.4) return 'bg-green-400'
  if (score < 0.6) return 'bg-yellow-500'
  if (score < 0.8) return 'bg-orange-500'
  return 'bg-red-500'
}

export function formatNumber(num: number, decimals = 1): string {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}