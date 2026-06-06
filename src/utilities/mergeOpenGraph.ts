import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    'Catalogo personale e recensioni per anime, manga, serie TV, film e videogiochi.',
  images: [
    {
      url: `${getServerSideURL()}/api/og?title=EdArEview`,
      width: 1200,
      height: 630,
      alt: 'EdArEview',
    },
  ],
  siteName: 'EdArEview',
  title: 'EdArEview',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
