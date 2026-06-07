import type { Metadata } from 'next'

import { ComparePicker } from '@/components/ComparePicker'
import { CompareView } from '@/components/CompareView'
import { getAllPublishedWorksForCompareSelect, getComparePair } from '@/lib/payload/queries'

export const metadata: Metadata = {
  title: 'Confronto opere',
  description: 'Confronta due opere del catalogo EdArEview.',
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function readParam(value: string | string[] | undefined): string | null {
  const raw = Array.isArray(value) ? value[0] : value
  return raw?.trim() || null
}

export default async function ComparePage({ searchParams }: PageProps) {
  const params = await searchParams
  const refA = readParam(params.a)
  const refB = readParam(params.b)

  const [works, pair] = await Promise.all([
    getAllPublishedWorksForCompareSelect(),
    refA && refB ? getComparePair(refA, refB) : Promise.resolve(null),
  ])

  return (
    <main className="container py-10 md:py-14">
      <div className="mb-8 max-w-2xl space-y-2">
        <p className="text-muted-foreground text-sm">Confronto</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Opera vs opera</h1>
        <p className="text-muted-foreground">
          Seleziona due schede pubblicate e confronta generi, voti e tag in comune.
        </p>
      </div>

      <ComparePicker initialA={refA} initialB={refB} works={works} />

      <div className="mt-10">
        {refA && refB && !pair && (
          <p className="text-muted-foreground rounded-lg border border-dashed p-8 text-center">
            Una o entrambe le opere selezionate non sono state trovate.
          </p>
        )}

        {pair && (
          <CompareView
            reviewA={pair.reviewA}
            reviewB={pair.reviewB}
            workA={pair.workA}
            workB={pair.workB}
          />
        )}
      </div>
    </main>
  )
}
