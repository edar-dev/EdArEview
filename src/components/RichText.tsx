import type { Review } from '@/payload-types'
import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'

import { cn } from '@/utilities/ui'

export function RichText({
  className,
  data,
}: {
  className?: string
  data: Review['body']
}) {
  return (
    <div className={cn('prose prose-neutral dark:prose-invert max-w-none', className)}>
      <PayloadRichText data={data} />
    </div>
  )
}
