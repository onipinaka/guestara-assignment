export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const MS_PER_DAY = 24 * 60 * 60 * 1000

export function startOfDay(date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

export function startOfMonth(date) {
  return startOfDay(new Date(date.getFullYear(), date.getMonth(), 1))
}

export function endOfMonth(date) {
  return startOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0))
}

export function addDays(date, amount) {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return startOfDay(next)
}

export function addMonths(date, amount) {
  return startOfDay(new Date(date.getFullYear(), date.getMonth() + amount, 1))
}

export function differenceInDays(end, start) {
  return Math.round((startOfDay(end).getTime() - startOfDay(start).getTime()) / MS_PER_DAY)
}

export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function toISODate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseISODate(value) {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null
  return startOfDay(new Date(year, month - 1, day))
}

export function formatMonthYear(date) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

export function formatShortDate(date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function formatLongDate(date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function getWeekdayIndex(date, weekStartsOn = 1) {
  const day = date.getDay()
  return (day - weekStartsOn + 7) % 7
}

export function getMonthGrid(viewDate, weekStartsOn = 1) {
  const monthStart = startOfMonth(viewDate)
  const monthEnd = endOfMonth(viewDate)
  const leadDays = getWeekdayIndex(monthStart, weekStartsOn)
  const gridStart = addDays(monthStart, -leadDays)
  const days = []
  const today = startOfDay(new Date())

  for (let i = 0; i < 42; i += 1) {
    const date = addDays(gridStart, i)
    days.push({
      date,
      isCurrentMonth: date.getMonth() === viewDate.getMonth(),
      isToday: isSameDay(date, today),
      isBeforeMonth: date < monthStart,
      isAfterMonth: date > monthEnd,
    })
  }

  return days
}

export function normalizeRange(start, end) {
  if (!start || !end) return null
  return start <= end
    ? { start, end }
    : { start: end, end: start }
}

export function isDateInRange(date, range) {
  if (!range) return false
  return date >= range.start && date <= range.end
}
