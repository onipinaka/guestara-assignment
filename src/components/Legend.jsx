const HEAT_SCALE = ['#f5f1ea', '#efe1c6', '#e6c79e', '#d9a46e', '#c97a51', '#b2593f']

export default function Legend({ roomCount }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-xs text-[var(--ink-muted)] shadow-sm">
      <span>Low occupancy</span>
      <div className="flex items-center gap-1">
        {HEAT_SCALE.map((color) => (
          <span
            key={color}
            className="h-4 w-6 rounded"
            style={{ backgroundColor: color }}
          ></span>
        ))}
      </div>
      <span>High occupancy ({roomCount} rooms)</span>
    </div>
  )
}
