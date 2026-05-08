export default function MonthNav({ prevLabel, currentLabel, nextLabel, onPrev, onNext, onToday }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="rounded-full border border-[var(--border)] bg-white px-3 py-2 text-sm font-medium text-[var(--ink)] shadow-sm transition hover:border-[var(--ink)]"
          onClick={onPrev}
          aria-label="Previous month"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">Prev</span>
          <span className="ml-2 font-semibold">{prevLabel}</span>
        </button>
        <button
          type="button"
          className="rounded-full border border-[var(--border)] bg-white px-3 py-2 text-sm font-medium text-[var(--ink)] shadow-sm transition hover:border-[var(--ink)]"
          onClick={onToday}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">Today</span>
          <span className="ml-2 font-semibold">{currentLabel}</span>
        </button>
        <button
          type="button"
          className="rounded-full border border-[var(--border)] bg-white px-3 py-2 text-sm font-medium text-[var(--ink)] shadow-sm transition hover:border-[var(--ink)]"
          onClick={onNext}
          aria-label="Next month"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">Next</span>
          <span className="ml-2 font-semibold">{nextLabel}</span>
        </button>
      </div>
    </div>
  )
}
