import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EdArEview',
  description: 'Personal catalog and reviews for anime, manga, TV, movies, and games.',
}

export default function HomePage() {
  return (
    <main className="container py-16">
      <h1 className="text-4xl font-bold tracking-tight">EdArEview</h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">
        Catalogo personale e recensioni per anime, manga, serie TV, film e videogiochi. Il frontend
        pubblico arriva in Fase 4 — usa il pannello admin per inserire contenuti.
      </p>
      <p className="mt-8">
        <a className="underline" href="/admin">
          Apri admin
        </a>
      </p>
    </main>
  )
}
