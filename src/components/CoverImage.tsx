import Image from 'next/image'

import { cn } from '@/utilities/ui'

export function CoverImage({
  alt,
  src,
  className,
  priority = false,
}: {
  alt: string
  src: string | null
  className?: string
  priority?: boolean
}) {
  if (!src) {
    return (
      <div
        aria-hidden
        className={cn(
          'bg-muted text-muted-foreground flex items-center justify-center text-xs',
          className,
        )}
      >
        No cover
      </div>
    )
  }

  return (
    <Image
      alt={alt}
      className={cn('object-cover', className)}
      fill
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      src={src}
      unoptimized={src.startsWith('http://')}
    />
  )
}
