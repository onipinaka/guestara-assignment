export default function StatsBar({ stats }) {
  const items = [
    { label: 'Total bookings', value: stats.totalBookings },
    { label: 'Avg occupancy', value: stats.avgOccupancy },
    { label: 'Longest stay', value: stats.longestStay },
    { label: 'Top room type', value: stats.topRoomType },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 shadow-sm"
        >
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
            {item.label}
          </div>
          <div className="mt-2 text-lg font-semibold text-[var(--ink)]">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  )
}
