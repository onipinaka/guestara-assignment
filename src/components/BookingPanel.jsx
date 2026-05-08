function StatusPill({ status }) {
  const value = String(status || 'unknown')
  const lowered = value.toLowerCase()
  const isCancelled = lowered.startsWith('cancel')

  const styles = isCancelled
    ? 'border-[var(--accent-strong)] text-[var(--accent-strong)]'
    : 'border-[var(--border)] text-[var(--ink)]'

  return (
    <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${styles}`}>
      {value}
    </span>
  )
}

export default function BookingPanel({ title, subtitle, bookings, onExport, canExport, emptyMessage }) {
  return (
    <aside className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
            {title}
          </div>
          {subtitle ? (
            <div className="mt-2 text-lg font-semibold text-[var(--ink)]">
              {subtitle}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onExport}
          disabled={!canExport}
          className="rounded-full border border-[var(--border)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-strong)] transition hover:border-[var(--accent-strong)] disabled:opacity-40"
        >
          Export CSV
        </button>
      </div>

      <div className="mt-6">
        <div className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
          Bookings
        </div>
        {bookings.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] p-4 text-sm text-[var(--ink-muted)]">
            {emptyMessage}
          </div>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold text-[var(--ink)]">
                      {booking.guestName}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                      Room {booking.roomNumber} / {booking.roomType}
                    </div>
                  </div>
                  <StatusPill status={booking.status} />
                </div>
                <div className="mt-3 text-sm text-[var(--ink)]">
                  {booking.checkInLabel} to {booking.checkOutLabel}
                  <span className="ml-2 text-[var(--ink-muted)]">({booking.nights} nights)</span>
                </div>
                <div className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                  Source: {booking.source}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}
