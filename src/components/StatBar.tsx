type StatBarProps = {
  label: string
  value: number
  max: number
  suffix?: string
}

export function StatBar({ label, value, max, suffix }: StatBarProps) {
  const width = max > 0 ? Math.round((value / max) * 100) : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground tabular-nums">
          {value}
          {suffix ? ` ${suffix}` : ''}
        </span>
      </div>
      <div className="bg-muted h-2 overflow-hidden rounded-full">
        <div
          className="bg-primary h-full rounded-full transition-all"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

type StatSummaryProps = {
  label: string
  value: string
}

export function StatSummary({ label, value }: StatSummaryProps) {
  return (
    <div className="bg-card rounded-xl border p-5">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p>
    </div>
  )
}
