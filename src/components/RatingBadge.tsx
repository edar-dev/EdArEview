import { cn } from '@/utilities/ui'

export function RatingBadge({
  rating,
  className,
}: {
  rating?: number | null
  className?: string
}) {
  if (rating == null) return null

  const tone =
    rating >= 8 ? 'bg-success/20 text-green-700 dark:text-green-300' : rating >= 6
      ? 'bg-warning/20 text-amber-700 dark:text-amber-300'
      : 'bg-error/20 text-red-700 dark:text-red-300'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums',
        tone,
        className,
      )}
    >
      {rating.toFixed(1)}/10
    </span>
  )
}
