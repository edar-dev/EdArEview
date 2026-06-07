import type { Metadata } from 'next'
import Link from 'next/link'

import { RichText } from '@/components/RichText'
import { CoverImage } from '@/components/CoverImage'
import { getCoverUrl } from '@/lib/payload/cover'
import { getSiteSettings } from '@/lib/payload/queries'

export const metadata: Metadata = {
  title: 'Chi sono',
  description: 'Chi c’è dietro EdArEview — catalogo e recensioni personali.',
}

export default async function AboutPage() {
  const settings = await getSiteSettings()
  const avatar =
    settings?.avatar && typeof settings.avatar === 'object' ? settings.avatar : null

  return (
    <main className="container py-10 md:py-14">
      <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-[160px_1fr]">
        {avatar?.url && (
          <div className="mx-auto md:mx-0">
            <CoverImage
              alt={settings?.siteName ?? 'EdArEview'}
              className="aspect-square rounded-full object-cover"
              src={avatar.url}
            />
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm uppercase tracking-[0.2em]">About</p>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {settings?.siteName ?? 'EdArEview'}
            </h1>
            {settings?.tagline && (
              <p className="text-muted-foreground text-lg">{settings.tagline}</p>
            )}
          </div>

          {settings?.aboutPage ? (
            <RichText data={settings.aboutPage} />
          ) : settings?.bio ? (
            <p className="text-muted-foreground leading-relaxed">{settings.bio}</p>
          ) : (
            <p className="text-muted-foreground rounded-lg border border-dashed p-8 text-center">
              Aggiungi bio o contenuto About da Site Settings in admin.
            </p>
          )}

          {(settings?.socialLinks?.length ?? 0) > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold">Social</h2>
              <ul className="flex flex-wrap gap-3 text-sm">
                {settings!.socialLinks!.map((link) => (
                  <li key={`${link.platform}-${link.url}`}>
                    <Link
                      className="text-primary underline-offset-4 hover:underline"
                      href={link.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {link.platform}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
