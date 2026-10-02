const LOCALE = 'ru-RU'
export const formatCurrency = (value = 0) => new Intl.NumberFormat(LOCALE, { style: 'currency', currency: 'RUB', maximumFractionDigits: 2 }).format(Number(value) || 0)
export const formatAmount = (value = 0) => new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 2 }).format(Number(value) || 0)
export const formatDate = (date) => {
  if (!date) return '—'
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? '—' : new Intl.DateTimeFormat(LOCALE, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(parsed)
}
export const formatShortDate = (date) => {
  if (!date) return '—'
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? '—' : new Intl.DateTimeFormat(LOCALE, { day: '2-digit', month: 'short' }).format(parsed)
}
export const formatMonth = (date) => {
  if (!date) return '—'
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? '—' : new Intl.DateTimeFormat(LOCALE, { month: 'short', year: 'numeric' }).format(parsed)
}
export const formatCompactAmount = (value = 0) => {
  const n = Number(value) || 0
  return Math.abs(n) >= 1_000_000 ? `${(n/1_000_000).toFixed(1)} млн` : Math.abs(n) >= 1000 ? `${Math.round(n/1000)} тыс.` : String(n)
}
