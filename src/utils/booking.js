import { addDays, differenceInDays, parseISODate, startOfDay } from './date.js'

export function normalizeBooking(raw) {
  const checkIn = parseISODate(raw.checkIn || raw.check_in || raw.startDate)
  const checkOut = parseISODate(raw.checkOut || raw.check_out || raw.endDate)

  return {
    id: raw.id || `${raw.guestName || raw.guest || 'guest'}-${raw.roomNumber || raw.room || 'room'}-${raw.checkIn}`,
    guestName: raw.guestName || raw.guest || 'Unknown Guest',
    roomNumber: raw.roomNumber || raw.room || 'Unknown',
    roomType: raw.roomType || raw.room_type || 'Unspecified',
    status: raw.status || 'unknown',
    source: raw.source || raw.channel || 'Direct',
    checkIn: checkIn ? startOfDay(checkIn) : null,
    checkOut: checkOut ? startOfDay(checkOut) : null,
    totalPrice: raw.totalPrice ?? raw.totalAmount ?? raw.amount ?? raw.price ?? null,
  }
}

export function isCancelled(booking) {
  return String(booking.status || '').toLowerCase().startsWith('cancel')
}

export function bookingOccupiesDate(booking, date) {
  if (!booking.checkIn || !booking.checkOut) return false
  return booking.checkIn <= date && date < booking.checkOut
}

export function bookingOverlapsRange(booking, rangeStart, rangeEndExclusive) {
  if (!booking.checkIn || !booking.checkOut) return false
  return booking.checkIn < rangeEndExclusive && booking.checkOut > rangeStart
}

export function getBookingNights(booking) {
  if (!booking.checkIn || !booking.checkOut) return 0
  return Math.max(0, differenceInDays(booking.checkOut, booking.checkIn))
}

export function getSelectionRangeEndExclusive(range) {
  return addDays(range.end, 1)
}
