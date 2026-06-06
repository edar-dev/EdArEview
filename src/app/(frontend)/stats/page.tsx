import type { Metadata } from 'next'
import Link from 'next/link'

import { StatBar, StatSummary } from '@/components/StatBar'
import { getReviewStatistics } from '@/lib/payload/queries'

export const metadata: Metadata = {
  title: 'Statistiche',
  description: 'Panoramica del catalogo recensioni su EdArEview.',
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function parseYearParam(value: string | string[] | undefined): number | null {
  const raw = Array.isArray(value) ? value[0] : value
  if (!raw) return null
  const year = Number.parseInt(raw, 10)
  return Number.isFinite(year) && year >= 1900 && year <= 2100 ? year : null
}

export default async function StatsPage({ searchParams }: PageProps) {
  const year = parseYearParam((await searchParams).year)
  const stats = await getReviewStatistics(year)

  const maxMediaTypeCount = Math.max(...stats.byMediaType.map((entry) => entry.count), 1)
  const maxPublishedYearCount = Math.max(...stats.byPublishedYear.map((entry) => entry.count), 1)
  const maxWorkYearCount = Math.max(...stats.byWorkYear.map((entry) => entry.count), 1)
  const maxTagCount = Math.max(...stats.topTags.map((entry) => entry.count), 1)

  return (
    <main className="container py-10 md:py-14">
      <div className="mb-8 max-w-2xl space-y-2">
        <p className="text-muted-foreground text-sm">Panoramica</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Statistiche</h1>
        <p className="text-muted-foreground">
          Numeri del catalogo{year ? ` nel ${year}` : ''}: tipi, anni e tag più frequenti.
        </p>
      </div>

      {stats.availablePublishedYears.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              year === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-secondary/80'
            }`}
            href="/stats"
          >
            Tutti gli anni
          </Link>
          {stats.availablePublishedYears.map((publishedYear) => (
            <Link
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                year === publishedYear
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
              href={`/stats?year=${publishedYear}`}
              key={publishedYear}
            >
              {publishedYear}
            </Link>
          ))}
        </div>
      )}

      {stats.totalReviews === 0 ? (
        <p className="text-muted-foreground rounded-lg border border-dashed p-8 text-center">
          Nessuna recensione pubblicata{year ? ` nel ${year}` : ''}.
        </p>
      ) : (
        <div className="space-y-10">
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatSummary label="Recensioni" value={String(stats.totalReviews)} />
            <StatSummary
              label="Voto medio"
              value={stats.averageRating !== null ? `${stats.averageRating}/10` : '—'}
            />
            <StatSummary label="Tipi coperti" value={String(stats.byMediaType.length)} />
          </section>

          {stats.byMediaType.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Per tipo</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {stats.byMediaType.map((entry) => (
                  <StatBar
                    key={entry.mediaType}
                    label={
                      entry.averageRating !== null
                        ? `${entry.label} (media ${entry.averageRating}/10)`
                        : entry.label
                    }
                    max={maxMediaTypeCount}
                    value={entry.count}
                    suffix={entry.count === 1 ? 'recensione' : 'recensioni'}
                  />
                ))}
              </div>
            </section>
          )}

          {stats.byPublishedYear.length > 0 && !year && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Recensioni per anno di pubblicazione</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {stats.byPublishedYear.map((entry) => (
                  <StatBar
                    key={entry.year}
                    label={String(entry.year)}
                    max={maxPublishedYearCount}
                    value={entry.count}
                    suffix={entry.count === 1 ? 'recensione' : 'recensioni'}
                  />
                ))}
              </div>
            </section>
          )}

          {stats.byWorkYear.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Opere per anno di uscita</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {stats.byWorkYear.slice(0, 12).map((entry) => (
                  <StatBar
                    key={entry.year}
                    label={String(entry.year)}
                    max={maxWorkYearCount}
                    value={entry.count}
                    suffix={entry.count === 1 ? 'opera' : 'opere'}
                  />
                ))}
              </div>
            </section>
          )}

          {stats.topTags.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Tag più usati</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {stats.topTags.map((entry) => (
                  <StatBar
                    key={entry.tag.id}
                    label={entry.tag.name}
                    max={maxTagCount}
                    value={entry.count}
                    suffix={entry.count === 1 ? 'volta' : 'volte'}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  )
}
