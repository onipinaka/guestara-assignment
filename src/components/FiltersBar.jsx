function FilterGroup({ label, groupKey, values, selectedValues, onToggle }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => {
          const isActive = selectedValues.includes(value)
          return (
            <button
              key={value}
              type="button"
              onClick={() => onToggle(groupKey, value)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                isActive
                  ? 'border-[var(--ink)] bg-[var(--accent-soft)] text-[var(--ink)]'
                  : 'border-[var(--border)] bg-white text-[var(--ink-muted)] hover:border-[var(--ink)]'
              }`}
            >
              {value}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function FiltersBar({ options, filters, onToggle, onClear }) {
  const groups = [
    { key: 'status', label: 'Status', values: options.status },
    { key: 'roomType', label: 'Room type', values: options.roomType },
    { key: 'source', label: 'Source', values: options.source },
  ]

  const hasFilters =
    filters.status.length || filters.roomType.length || filters.source.length

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-[var(--ink)]">
          Filters
        </div>
        <button
          type="button"
          className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-strong)] transition disabled:opacity-40"
          onClick={onClear}
          disabled={!hasFilters}
        >
          Clear
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {groups.map((group) => (
          <FilterGroup
            key={group.key}
            label={group.label}
            groupKey={group.key}
            values={group.values}
            selectedValues={filters[group.key]}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  )
}
