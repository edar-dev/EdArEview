import type { SiteSetting } from '@/payload-types'
import Link from 'next/link'

import { EdArEviewLogo } from '@/components/EdArEviewLogo'

export function SiteFooter({ settings }: { settings: SiteSetting | null }) {
  const bio = settings?.bio?.trim()
  const socialLinks = settings?.socialLinks ?? []

  return (
    <footer className="border-border mt-auto border-t">
      <div className="container grid gap-8 py-10 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          <EdArEviewLogo />
          {settings?.tagline && (
            <p className="text-muted-foreground text-sm">{settings.tagline}</p>
          )}
          {bio && <p className="text-muted-foreground max-w-prose text-sm leading-relaxed">{bio}</p>}
        </div>

        {socialLinks.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-semibold">Social</h2>
            <ul className="space-y-2 text-sm">
              {socialLinks.map((link) => (
                <li key={`${link.platform}-${link.url}`}>
                  <Link
                    className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
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

      <div className="border-border text-muted-foreground border-t py-4 text-center text-xs">
        © {new Date().getFullYear()} {settings?.siteName ?? 'EdArEview'}
      </div>
    </footer>
  )
}
