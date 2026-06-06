import type { Metadata } from 'next'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { AdminBar } from '@/components/AdminBar'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { getSiteSettings } from '@/lib/payload/queries'
import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { draftMode } from 'next/headers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'

import './globals.css'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [{ isEnabled }, settings] = await Promise.all([draftMode(), getSiteSettings()])

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="it" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />
          <SiteHeader />
          {children}
          <SiteFooter settings={settings} />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: 'EdArEview',
    template: '%s | EdArEview',
  },
  description:
    'Catalogo personale e recensioni per anime, manga, serie TV, film e videogiochi.',
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
  },
}
