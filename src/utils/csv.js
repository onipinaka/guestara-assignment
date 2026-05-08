function escapeCSV(value) {
  if (value === null || value === undefined) return ''
  const text = String(value)
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

export function bookingsToCSV(bookings) {
  const header = [
    'Guest',
    'Room',
    'Room Type',
    'Status',
    'Source',
    'Check In',
    'Check Out',
    'Nights',
  ]

  const rows = bookings.map((booking) => [
    booking.guestName,
    booking.roomNumber,
    booking.roomType,
    booking.status,
    booking.source,
    booking.checkInLabel,
    booking.checkOutLabel,
    booking.nights,
  ])

  return [header, ...rows].map((row) => row.map(escapeCSV).join(',')).join('\n')
}

export function downloadCSV(filename, csvText) {
  const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
