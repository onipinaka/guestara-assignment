import { useEffect, useMemo, useState } from 'react'
import BookingPanel from './components/BookingPanel.jsx'
import CalendarGrid from './components/CalendarGrid.jsx'
import FiltersBar from './components/FiltersBar.jsx'
import Legend from './components/Legend.jsx'
import MonthNav from './components/MonthNav.jsx'
import SearchBar from './components/SearchBar.jsx'
import StatsBar from './components/StatsBar.jsx'
import {
  WEEKDAY_LABELS,
  addDays,
  addMonths,
  formatLongDate,
  formatMonthYear,
  getMonthGrid,
  normalizeRange,
  parseISODate,
  startOfDay,
  startOfMonth,
  toISODate,
  endOfMonth,
} from './utils/date.js'
import {
  bookingOccupiesDate,
  bookingOverlapsRange,
  getBookingNights,
  getSelectionRangeEndExclusive,
  isCancelled,
  normalizeBooking,
} from './utils/booking.js'
import { bookingsToCSV, downloadCSV } from './utils/csv.js'

const WEEK_STARTS_ON = 1
const FALLBACK_ROOM_COUNT = 10

function matchesSearch(booking, searchTerm) {
  if (!searchTerm) return true
  return booking.guestName.toLowerCase().includes(searchTerm)
}

function matchesRoom(booking, roomTerm) {
  if (!roomTerm) return true
  return String(booking.roomNumber || '').toLowerCase().includes(roomTerm)
}

function getUniqueValues(bookings, key) {
  const values = new Set()
  bookings.forEach((booking) => {
    const value = booking[key]
    if (value) values.add(value)
  })
  return Array.from(values).sort((a, b) => String(a).localeCompare(String(b)))
}

function getTopRoomType(bookings) {
  if (!bookings.length) return 'N/A'
  const counts = new Map()
  bookings.forEach((booking) => {
    const value = booking.roomType || 'Unspecified'
    counts.set(value, (counts.get(value) || 0) + 1)
  })
  let top = 'N/A'
  let topCount = 0
  counts.forEach((count, value) => {
    if (count > topCount) {
      top = value
      topCount = count
    }
  })
  return top
}

function App() {
  const today = useMemo(() => startOfDay(new Date()), [])
  const [viewDate, setViewDate] = useState(() => startOfMonth(today))
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selection, setSelection] = useState(() => ({ start: today, end: today }))
  const [selectionAnchor, setSelectionAnchor] = useState(today)
  const [focusedDate, setFocusedDate] = useState(today)
  const [dragging, setDragging] = useState(false)
  const [filters, setFilters] = useState({ status: [], roomType: [], source: [] })
  const [searchTerm, setSearchTerm] = useState('')
  const [roomSearch, setRoomSearch] = useState('')

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    fetch('/bookings.json')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load bookings.json')
        return response.json()
      })
      .then((data) => {
        if (!isMounted) return
        const normalized = Array.isArray(data) ? data.map(normalizeBooking) : []
        setBookings(normalized)
        setError('')
      })
      .catch((fetchError) => {
        if (!isMounted) return
        setError(fetchError.message || 'Unable to load bookings')
      })
      .finally(() => {
        if (!isMounted) return
        setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const handleMouseUp = () => setDragging(false)
    window.addEventListener('mouseup', handleMouseUp)
    return () => window.removeEventListener('mouseup', handleMouseUp)
  }, [])

  const filterOptions = useMemo(
    () => ({
      status: getUniqueValues(bookings, 'status'),
      roomType: getUniqueValues(bookings, 'roomType'),
      source: getUniqueValues(bookings, 'source'),
    }),
    [bookings],
  )

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const statusOk =
        filters.status.length === 0 || filters.status.includes(booking.status)
      const typeOk =
        filters.roomType.length === 0 || filters.roomType.includes(booking.roomType)
      const sourceOk =
        filters.source.length === 0 || filters.source.includes(booking.source)
      return statusOk && typeOk && sourceOk
    })
  }, [bookings, filters])

  const roomSearchNormalized = roomSearch.trim().toLowerCase()

  const roomFilteredBookings = useMemo(() => {
    return filteredBookings.filter((booking) => matchesRoom(booking, roomSearchNormalized))
  }, [filteredBookings, roomSearchNormalized])

  const activeFilteredBookings = useMemo(
    () => roomFilteredBookings.filter((booking) => !isCancelled(booking)),
    [roomFilteredBookings],
  )

  const searchTermNormalized = searchTerm.trim().toLowerCase()

  const searchMatches = useMemo(() => {
    if (!searchTermNormalized) return new Set()
    const matches = roomFilteredBookings.filter((booking) =>
      matchesSearch(booking, searchTermNormalized),
    )
    const dates = new Set()
    matches.forEach((booking) => {
      if (!booking.checkIn || !booking.checkOut) return
      for (
        let date = booking.checkIn;
        date < booking.checkOut;
        date = addDays(date, 1)
      ) {
        dates.add(toISODate(date))
      }
    })
    return dates
  }, [roomFilteredBookings, searchTermNormalized])

  const roomCount = useMemo(() => {
    const uniqueRooms = new Set(
      bookings
        .map((booking) => booking.roomNumber)
        .filter((value) => value && value !== 'Unknown'),
    )
    return Math.max(uniqueRooms.size || 0, FALLBACK_ROOM_COUNT)
  }, [bookings])

  const days = useMemo(() => {
    return getMonthGrid(viewDate, WEEK_STARTS_ON).map((day) => {
      return {
        ...day,
        iso: toISODate(day.date),
        number: day.date.getDate(),
        label: formatLongDate(day.date),
      }
    })
  }, [viewDate])

  const occupancyByDate = useMemo(() => {
    const map = new Map()
    days.forEach((day) => {
      const rooms = new Set()
      activeFilteredBookings.forEach((booking) => {
        if (bookingOccupiesDate(booking, day.date)) {
          rooms.add(booking.roomNumber)
        }
      })
      map.set(day.iso, rooms.size)
    })
    return map
  }, [days, activeFilteredBookings])

  const selectionRange = useMemo(() => normalizeRange(selection.start, selection.end), [
    selection,
  ])

  const selectionRangeLabel = useMemo(() => {
    if (!selectionRange) return ''
    if (selectionRange.start.getTime() === selectionRange.end.getTime()) {
      return formatLongDate(selectionRange.start)
    }
    return `${formatLongDate(selectionRange.start)} to ${formatLongDate(selectionRange.end)}`
  }, [selectionRange])

  const selectionBookings = useMemo(() => {
    if (!selectionRange) return []
    const rangeEndExclusive = getSelectionRangeEndExclusive(selectionRange)
    return roomFilteredBookings
      .filter((booking) => bookingOverlapsRange(booking, selectionRange.start, rangeEndExclusive))
      .filter((booking) => matchesSearch(booking, searchTermNormalized))
      .map((booking) => ({
        ...booking,
        nights: getBookingNights(booking),
        checkInLabel: booking.checkIn ? formatLongDate(booking.checkIn) : 'N/A',
        checkOutLabel: booking.checkOut ? formatLongDate(booking.checkOut) : 'N/A',
      }))
      .sort((a, b) => {
        const aTime = a.checkIn ? a.checkIn.getTime() : 0
        const bTime = b.checkIn ? b.checkIn.getTime() : 0
        return aTime - bTime
      })
  }, [roomFilteredBookings, selectionRange, searchTermNormalized])

  const searchResults = useMemo(() => {
    if (!searchTermNormalized) return []
    return roomFilteredBookings
      .filter((booking) => matchesSearch(booking, searchTermNormalized))
      .map((booking) => ({
        ...booking,
        nights: getBookingNights(booking),
        checkInLabel: booking.checkIn ? formatLongDate(booking.checkIn) : 'N/A',
        checkOutLabel: booking.checkOut ? formatLongDate(booking.checkOut) : 'N/A',
      }))
      .sort((a, b) => {
        const aTime = a.checkIn ? a.checkIn.getTime() : 0
        const bTime = b.checkIn ? b.checkIn.getTime() : 0
        return aTime - bTime
      })
  }, [roomFilteredBookings, searchTermNormalized])

  const stats = useMemo(() => {
    const monthStart = startOfMonth(viewDate)
    const monthEndExclusive = addDays(endOfMonth(viewDate), 1)
    const monthBookings = activeFilteredBookings.filter((booking) =>
      bookingOverlapsRange(booking, monthStart, monthEndExclusive),
    )
    const longestStayValue = monthBookings.reduce(
      (max, booking) => Math.max(max, getBookingNights(booking)),
      0,
    )
    const occupancyTotal = days
      .filter((day) => day.isCurrentMonth)
      .reduce((sum, day) => sum + (occupancyByDate.get(day.iso) || 0), 0)
    const monthDayCount = days.filter((day) => day.isCurrentMonth).length || 1
    const avgOccupancyPct = Math.round(
      (occupancyTotal / (monthDayCount * roomCount)) * 100,
    )

    return {
      totalBookings: monthBookings.length,
      avgOccupancy: `${avgOccupancyPct}%`,
      longestStay: longestStayValue ? `${longestStayValue} nights` : 'N/A',
      topRoomType: getTopRoomType(monthBookings),
    }
  }, [activeFilteredBookings, days, occupancyByDate, roomCount, viewDate])

  const handleDayMouseDown = (date, event) => {
    if (event.button !== 0) return
    event.preventDefault()
    setDragging(true)
    setSelectionAnchor(date)
    setSelection({ start: date, end: date })
    setFocusedDate(date)
  }

  const handleDayMouseEnter = (date) => {
    if (!dragging) return
    const normalized = normalizeRange(selectionAnchor, date)
    if (normalized) setSelection(normalized)
  }

  const handleGridMouseMove = (event) => {
    if (!dragging) return
    const target = event.target?.closest?.('[data-date]')
    const iso = target?.getAttribute?.('data-date')
    if (!iso) return
    const date = parseISODate(iso)
    if (!date) return
    const normalized = normalizeRange(selectionAnchor, date)
    if (normalized) setSelection(normalized)
  }

  const handleKeyDown = (event) => {
    const moves = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    }
    if (event.key === 'Enter' && focusedDate) {
      setSelection({ start: focusedDate, end: focusedDate })
      setSelectionAnchor(focusedDate)
      return
    }
    if (!moves[event.key]) return
    event.preventDefault()
    const base = focusedDate || selection.start
    const next = addDays(base, moves[event.key])
    if (event.shiftKey) {
      const anchor = selectionAnchor || base
      const normalized = normalizeRange(anchor, next)
      if (normalized) setSelection(normalized)
    } else {
      setSelection({ start: next, end: next })
      setSelectionAnchor(next)
    }
    setFocusedDate(next)
    setViewDate(startOfMonth(next))
  }

  const handleToggleFilter = (groupKey, value) => {
    setFilters((prev) => {
      const nextValues = new Set(prev[groupKey])
      if (nextValues.has(value)) {
        nextValues.delete(value)
      } else {
        nextValues.add(value)
      }
      return { ...prev, [groupKey]: Array.from(nextValues) }
    })
  }

  const handleClearFilters = () => {
    setFilters({ status: [], roomType: [], source: [] })
  }

  const panelBookings = searchTermNormalized ? searchResults : selectionBookings
  const panelTitle = searchTermNormalized ? 'Search results' : 'Selected range'
  const panelSubtitle = searchTermNormalized
    ? `Guest name includes "${searchTermNormalized}"`
    : selectionRangeLabel
  const panelEmptyMessage = searchTermNormalized
    ? 'No bookings match the current search.'
    : 'No bookings overlap this range.'

  const handleExport = () => {
    if (!panelBookings.length) return
    const csvText = bookingsToCSV(panelBookings)
    const safeTerm = searchTermNormalized.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    const fileName = searchTermNormalized
      ? `bookings-search-${safeTerm || 'results'}.csv`
      : `bookings-${toISODate(selectionRange.start)}-to-${toISODate(selectionRange.end)}.csv`
    downloadCSV(fileName, csvText)
  }

  const isLoadingState = loading && !bookings.length
  const showError = Boolean(error)

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-8">
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/guestara-logo.png"
                alt="Guestara"
                className="h-11 w-11 rounded-2xl border border-[var(--border)] bg-white p-2"
              />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                  Guestara occupancy console
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-[var(--ink)] sm:text-4xl">
                  Booking heatmap
                </h1>
              </div>
            </div>
            <MonthNav
              prevLabel={formatMonthYear(addMonths(viewDate, -1))}
              currentLabel={formatMonthYear(viewDate)}
              nextLabel={formatMonthYear(addMonths(viewDate, 1))}
              onPrev={() => setViewDate(addMonths(viewDate, -1))}
              onNext={() => setViewDate(addMonths(viewDate, 1))}
              onToday={() => setViewDate(startOfMonth(today))}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <SearchBar
              label="Guest search"
              placeholder="Search by guest name"
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <SearchBar
              label="Room search"
              placeholder="Search by room number"
              value={roomSearch}
              onChange={setRoomSearch}
            />
          </div>
          <StatsBar stats={stats} />
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="flex flex-col gap-4">
            <FiltersBar
              options={filterOptions}
              filters={filters}
              onToggle={handleToggleFilter}
              onClear={handleClearFilters}
            />

            {isLoadingState ? (
              <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white p-6 text-sm text-[var(--ink-muted)]">
                Loading bookings...
              </div>
            ) : null}

            {showError ? (
              <div className="rounded-2xl border border-[var(--accent-strong)] bg-white p-6 text-sm text-[var(--accent-strong)]">
                {error}
              </div>
            ) : null}

            {!isLoadingState && !showError ? (
              <CalendarGrid
                days={days}
                weekLabels={WEEKDAY_LABELS}
                occupancyByDate={occupancyByDate}
                roomCount={roomCount}
                selectionRange={selectionRange}
                focusedDate={focusedDate}
                searchMatches={searchMatches}
                onDayMouseDown={handleDayMouseDown}
                onDayMouseEnter={handleDayMouseEnter}
                onGridMouseMove={handleGridMouseMove}
                onKeyDown={handleKeyDown}
              />
            ) : null}

            <Legend roomCount={roomCount} />
          </section>

          <BookingPanel
            title={panelTitle}
            subtitle={panelSubtitle}
            bookings={panelBookings}
            onExport={handleExport}
            canExport={panelBookings.length > 0}
            emptyMessage={panelEmptyMessage}
          />
        </div>
      </div>
    </div>
  )
}

export default App
