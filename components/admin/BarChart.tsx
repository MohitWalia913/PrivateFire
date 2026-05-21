'use client'

export function BarChart({
  items,
}: {
  items: Array<{ label: string; value: number; color: string }>
}) {
  const max = Math.max(1, ...items.map(i => i.value))

  return (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item.label}>
          <div className="mb-1 flex justify-between text-xs">
            <span className="font-medium text-gray-700">{item.label}</span>
            <span className="text-gray-500">{item.value}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(item.value / max) * 100}%`, backgroundColor: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
