import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ReviewCard } from '@/components/ReviewCard'
import { getEditorialListBySlug, resolveReviewsFromEditorialList } from '@/lib/payload/queries'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const list = await getEditorialListBySlug(slug)

  if (!list) {
    return { title: 'Lista non trovata' }
  }

  return {
    title: list.title,
    description: list.description ?? `Lista editoriale: ${list.title}`,
  }
}

export default async function EditorialListDetailPage({ params }: PageProps) {
  const { slug } = await params
  const list = await getEditorialListBySlug(slug)

  if (!list) {
    notFound()
  }

  const reviews = resolveReviewsFromEditorialList(list)

  return (
    <main className="container py-10 md:py-14">
      <div className="mb-8 max-w-3xl space-y-4">
        <Link
          className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 hover:underline"
          href="/lists"
        >
          ← Tutte le liste
        </Link>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{list.title}</h1>
        {list.description && (
          <p className="text-muted-foreground text-lg leading-relaxed">{list.description}</p>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="text-muted-foreground rounded-lg border border-dashed p-8 text-center">
          Questa lista non contiene recensioni pubblicate.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard compact key={review.id} review={review} />
          ))}
        </div>
      )}
    </main>
  )
}
