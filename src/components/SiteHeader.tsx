'use client'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import Link from 'next/link'

import { EdArEviewLogo } from '@/components/EdArEviewLogo'
import { MEDIA_TYPE_NAV } from '@/lib/media-types'

export function SiteHeader() {
  return (
    <header className="border-border bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <EdArEviewLogo className="shrink-0 text-lg" />

        <nav className="hidden items-center gap-5 text-sm md:flex">
          {MEDIA_TYPE_NAV.map((item) => (
            <Link
              className="text-muted-foreground hover:text-foreground transition-colors"
              href={`/${item.route}`}
              key={item.route}
            >
              {item.label}
            </Link>
          ))}
          <Link
            className="text-muted-foreground hover:text-foreground transition-colors"
            href="/reviews"
          >
            Recensioni
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeSelector />
          <Link
            className="text-muted-foreground hover:text-foreground text-sm underline md:hidden"
            href="/reviews"
          >
            Recensioni
          </Link>
        </div>
      </div>
    </header>
  )
}
