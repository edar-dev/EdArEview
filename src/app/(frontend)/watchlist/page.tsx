import type { Metadata } from 'next'
import Link from 'next/link'

import { CoverImage } from '@/components/CoverImage'
import { RatingBadge } from '@/components/RatingBadge'
import { getWorkPath, MEDIA_TYPE_LABELS } from '@/lib/media-types'
import { getCoverUrl } from '@/lib/payload/cover'
import { getPublicWatchlist, WATCHLIST_LABELS, type WatchlistStatus } from '@/lib/payload/queries'

export const metadata: Metadata = {
  title: 'Watchlist',
  description: 'Cosa sto consumando, cosa ho in programma e cosa è in pausa.',
}

const ORDER: WatchlistStatus[] = ['watching', 'planned', 'on_hold']

export default async function WatchlistPage() {
  const grouped = await getPublicWatchlist()
  const hasItems = ORDER.some((status) => grouped[status].length > 0)

  return (
    <main className="container py-10 md:py-14">
      <div className="mb-8 max-w-2xl space-y-2">
        <p className="text-muted-foreground text-sm">Consumo</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Watchlist</h1>
        <p className="text-muted-foreground">
          Opere con stato <strong>In corso</strong>, <strong>In programma</strong> o{' '}
          <strong>In pausa</strong> (da scheda opera o recensione in admin).
        </p>
      </div>

      {!hasItems ? (
        <p className="text-muted-foreground rounded-lg border border-dashed p-8 text-center">
          Nessuna opera in watchlist. Imposta lo stato consumo su Media Works o sulle recensioni.
        </p>
      ) : (
        <div className="space-y-12">
          {ORDER.map((status) => {
            const items = grouped[status]
            if (items.length === 0) return null

            return (
              <section key={status}>
                <h2 className="mb-4 text-xl font-semibold">{WATCHLIST_LABELS[status]}</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map(({ work, review }) => {
                    const href = getWorkPath(work)
                    const cover = getCoverUrl(work)

                    return (
                      <article className="bg-card overflow-hidden rounded-xl border" key={work.id}>
                        <Link className="block" href={href}>
                          <div className="bg-muted relative aspect-[2/3] w-full">
                            <CoverImage alt={work.title} className="object-cover" src={cover} />
                          </div>
                        </Link>
                        <div className="space-y-2 p-4">
                          <h3 className="font-medium">
                            <Link className="hover:underline" href={href}>
                              {work.title}
                            </Link>
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {MEDIA_TYPE_LABELS[work.mediaType]}
                            {work.year ? ` · ${work.year}` : ''}
                          </p>
                          {review && <RatingBadge rating={review.rating} />}
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </main>
  )
}
