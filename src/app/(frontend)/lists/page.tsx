import type { Metadata } from 'next'

import { ListCard } from '@/components/ListCard'
import { getPublishedEditorialLists } from '@/lib/payload/queries'

export const metadata: Metadata = {
  title: 'Liste editoriali',
  description: 'Collezioni curate di recensioni su EdArEview.',
}

export default async function EditorialListsPage() {
  const listsResult = await getPublishedEditorialLists()
  const lists = listsResult.docs

  return (
    <main className="container py-10 md:py-14">
      <div className="mb-8 max-w-2xl space-y-2">
        <p className="text-muted-foreground text-sm">Collezioni</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Liste editoriali</h1>
        <p className="text-muted-foreground">
          Selezione curata di recensioni: top list, temi e percorsi di lettura.
        </p>
      </div>

      {lists.length === 0 ? (
        <p className="text-muted-foreground rounded-lg border border-dashed p-8 text-center">
          Nessuna lista pubblicata. Creane una dall&apos;admin in Liste editoriali.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {lists.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      )}
    </main>
  )
}
