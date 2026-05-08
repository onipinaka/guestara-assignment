import DayCell from './DayCell.jsx'

const HEAT_SCALE = ['#f5f1ea', '#efe1c6', '#e6c79e', '#d9a46e', '#c97a51', '#b2593f']

function getHeatColor(occupancy, roomCount) {
  if (!roomCount) return HEAT_SCALE[0]
  const ratio = occupancy / roomCount
  const index = Math.min(HEAT_SCALE.length - 1, Math.round(ratio * (HEAT_SCALE.length - 1)))
  return HEAT_SCALE[index]
}

export default function CalendarGrid({
  days,
  weekLabels,
  occupancyByDate,
  roomCount,
  selectionRange,
  focusedDate,
  searchMatches,
  onDayMouseDown,
  onDayMouseEnter,
  onGridMouseMove,
  onKeyDown,
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm">
      <div className="grid grid-cols-7 gap-2 text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
        {weekLabels.map((label) => (
          <div key={label} className="px-1 py-1 text-center">
            {label}
          </div>
        ))}
      </div>
      <div
        className="mt-2 grid grid-cols-7 gap-2 auto-rows-[96px]"
        role="grid"
        tabIndex={0}
        aria-label="Booking calendar grid"
        onKeyDown={onKeyDown}
        onMouseMove={onGridMouseMove}
      >
        {days.map((day) => {
          const iso = day.iso
          const occupancy = occupancyByDate.get(iso) || 0
          const isSelected =
            selectionRange && day.date >= selectionRange.start && day.date <= selectionRange.end
          const isFocused = focusedDate && day.date.getTime() === focusedDate.getTime()
          const isSearchMatch = searchMatches.has(iso)

          return (
            <DayCell
              key={iso}
              day={day}
              occupancy={occupancy}
              roomCount={roomCount}
              heatColor={getHeatColor(occupancy, roomCount)}
              isSelected={isSelected}
              isFocused={isFocused}
              isSearchMatch={isSearchMatch}
              onMouseDown={(event) => onDayMouseDown(day.date, event)}
              onMouseEnter={() => onDayMouseEnter(day.date)}
              dataDate={iso}
            />
          )
        })}
      </div>
    </div>
  )
}
