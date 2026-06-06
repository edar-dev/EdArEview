import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPublishedDate } from '@/lib/format-date'
import type { EditorialList } from '@/payload-types'

type ListCardProps = {
  list: EditorialList
}

export function ListCard({ list }: ListCardProps) {
  const entryCount = list.reviews?.length ?? 0

  return (
    <Card className="transition-shadow hover:shadow-md">
      <Link className="block" href={`/lists/${list.slug}`}>
        <CardHeader>
          <CardTitle className="text-lg">{list.title}</CardTitle>
          {list.description && (
            <p className="text-muted-foreground text-sm leading-relaxed">{list.description}</p>
          )}
        </CardHeader>
        <CardContent className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
          <span className="bg-secondary rounded-full px-2 py-1">
            {entryCount} {entryCount === 1 ? 'recensione' : 'recensioni'}
          </span>
          {list.publishedAt && <span>{formatPublishedDate(list.publishedAt)}</span>}
          {list.featured && (
            <span className="bg-primary/10 text-primary rounded-full px-2 py-1">In evidenza</span>
          )}
        </CardContent>
      </Link>
    </Card>
  )
}
