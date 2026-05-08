export default function SearchBar({ label, placeholder, value, onChange }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 shadow-sm">
      <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
        {label}
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent-strong)]"
        />
      </label>
    </div>
  )
}
