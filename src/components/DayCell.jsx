export default function DayCell({
  day,
  occupancy,
  roomCount,
  heatColor,
  isSelected,
  isFocused,
  isSearchMatch,
  onMouseDown,
  onMouseEnter,
  dataDate,
}) {
  const muted = !day.isCurrentMonth
  const occupancyLabel = `${occupancy}/${roomCount}`

  return (
    <button
      type="button"
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      className={`group relative flex h-full w-full select-none flex-col items-start justify-between rounded-xl border p-2 text-left text-sm transition focus:outline-none ${
        muted
          ? 'border-transparent text-[var(--ink-muted)] opacity-70'
          : 'border-[var(--border)]'
      } ${
        isSelected
          ? 'border-[var(--accent-strong)] outline outline-2 outline-[var(--accent-strong)] outline-offset-2 shadow-[0_8px_18px_rgba(162,90,28,0.2)]'
          : 'hover:border-[var(--ink)]'
      } ${isFocused ? 'ring-2 ring-[var(--accent-strong)] ring-offset-2' : ''}`}
      style={{ backgroundColor: heatColor }}
      aria-label={`${day.label} occupancy ${occupancyLabel}`}
      data-date={dataDate}
      aria-selected={isSelected}
    >
      <div className="flex w-full items-start justify-between">
        <span className={`text-lg font-semibold ${muted ? 'text-[var(--ink-muted)]' : 'text-[var(--ink)]'}`}>
          {day.number}
        </span>
        {day.isToday ? (
          <span className="rounded-full bg-[var(--ink)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
            Today
          </span>
        ) : null}
      </div>
      <div className="flex w-full items-end justify-between">
        <span className="text-xs font-medium text-[var(--ink-muted)]">
          {occupancyLabel}
        </span>
      </div>
      {isSelected ? (
        <span className="pointer-events-none absolute inset-1 rounded-lg bg-[rgba(255,255,255,0.22)] ring-2 ring-[var(--accent-strong)]"></span>
      ) : null}
      {isSearchMatch ? (
        <span className="pointer-events-none absolute inset-1 rounded-lg border-2 border-[var(--accent-strong)]"></span>
      ) : null}
    </button>
  )
}
