import Link from 'next/link'

import { ReviewCard } from '@/components/ReviewCard'
import { RichText } from '@/components/RichText'
import { MEDIA_TYPE_NAV } from '@/lib/media-types'
import { getPublishedReviews, getSiteSettings } from '@/lib/payload/queries'

export default async function HomePage() {
  const [settings, reviewsResult] = await Promise.all([
    getSiteSettings(),
    getPublishedReviews(6),
  ])

  const reviews = reviewsResult.docs

  return (
    <main className="container py-10 md:py-16">
      <section className="max-w-3xl space-y-4">
        <p className="text-muted-foreground text-sm uppercase tracking-[0.2em]">
          {settings?.tagline ?? 'Catalogo e recensioni personali'}
        </p>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Benvenuto su {settings?.siteName ?? 'EdArEview'}
        </h1>
        {settings?.homepageIntro && (
          <div className="text-muted-foreground text-lg">
            <RichText data={settings.homepageIntro} />
          </div>
        )}
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap gap-2">
          {MEDIA_TYPE_NAV.map((item) => (
            <Link
              className="bg-secondary hover:bg-secondary/80 rounded-full px-4 py-2 text-sm transition-colors"
              href={`/${item.route}`}
              key={item.route}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold">Ultime recensioni</h2>
          {reviews.length > 0 && (
            <Link className="text-primary text-sm underline-offset-4 hover:underline" href="/reviews">
              Vedi tutte
            </Link>
          )}
        </div>

        {reviews.length === 0 ? (
          <p className="text-muted-foreground rounded-lg border border-dashed p-8 text-center">
            Nessuna recensione ancora. Pubblica contenuti dall&apos;admin per vederli qui.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
