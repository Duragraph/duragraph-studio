import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  const now = new Date()
  const diffInMinutes = Math.round((d.getTime() - now.getTime()) / (1000 * 60))

  // Use Intl.RelativeTimeFormat for relative dates
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(diffInMinutes, 'minute')
  } else if (Math.abs(diffInMinutes) < 1440) {
    // less than 24 hours
    return rtf.format(Math.round(diffInMinutes / 60), 'hour')
  } else {
    return rtf.format(Math.round(diffInMinutes / 1440), 'day')
  }
}

export function formatDuration(start?: string, end?: string): string {
  if (!start) return '-'

  const startTime = new Date(start).getTime()
  const endTime = end ? new Date(end).getTime() : Date.now()
  const duration = endTime - startTime

  const seconds = Math.floor(duration / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  }
  return `${remainingSeconds}s`
}
