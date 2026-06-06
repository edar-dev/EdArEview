import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const MEDIA_TYPE_LABELS: Record<string, string> = {
  anime: 'Anime',
  manga: 'Manga',
  tv: 'TV',
  movie: 'Film',
  games: 'Giochi',
  game: 'Giochi',
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title = searchParams.get('title')?.trim() || 'EdArEview'
  const rating = searchParams.get('rating')
  const type = searchParams.get('type')
  const cover = searchParams.get('cover')

  const typeLabel = type ? (MEDIA_TYPE_LABELS[type] ?? type) : null
  const displayTitle = title.length > 72 ? `${title.slice(0, 69)}…` : title

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #450a0a 100%)',
          color: '#f8fafc',
          padding: '56px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flex: 1,
            border: '1px solid rgba(248, 250, 252, 0.12)',
            borderRadius: '24px',
            overflow: 'hidden',
            background: 'rgba(15, 23, 42, 0.55)',
          }}
        >
          {cover ? (
            <div
              style={{
                width: '320px',
                display: 'flex',
                alignItems: 'stretch',
                borderRight: '1px solid rgba(248, 250, 252, 0.12)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                height={630}
                src={cover}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                width={320}
              />
            </div>
          ) : null}

          <div
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: cover ? '48px' : '56px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {typeLabel ? (
                <div
                  style={{
                    display: 'flex',
                    alignSelf: 'flex-start',
                    borderRadius: '999px',
                    background: 'rgba(230, 57, 70, 0.18)',
                    color: '#fecaca',
                    padding: '8px 16px',
                    fontSize: '22px',
                    fontWeight: 600,
                  }}
                >
                  {typeLabel}
                </div>
              ) : null}
              <div
                style={{
                  display: 'flex',
                  fontSize: cover ? '52px' : '64px',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                }}
              >
                {displayTitle}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', fontSize: '28px', color: '#cbd5e1' }}>
                Ed<span style={{ color: '#E63946' }}>A</span>rEview
              </div>
              {rating ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '8px',
                    color: '#E63946',
                  }}
                >
                  <span style={{ fontSize: '72px', fontWeight: 800, lineHeight: 1 }}>
                    {rating}
                  </span>
                  <span style={{ fontSize: '28px', color: '#94a3b8' }}>/10</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
