'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { UIFieldClientComponent } from 'payload'

import {
  Banner,
  Button,
  FieldLabel,
  toast,
  useAllFormFields,
  useDebounce,
  useFormFields,
} from '@payloadcms/ui'

import type { MediaType, MetadataSearchResult } from '@/lib/metadata/types'

import './index.scss'

const baseClass = 'metadata-search-field'

export const MetadataSearchField: UIFieldClientComponent = ({ field }) => {
  const [, dispatchFields] = useAllFormFields()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<MetadataSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const debouncedQuery = useDebounce(query, 450)

  const mediaType = useFormFields(([fields]) => {
    const value = fields.mediaType?.value
    return typeof value === 'string' ? (value as MediaType) : 'anime'
  })

  const updateField = useCallback(
    (path: string, value: unknown) => {
      dispatchFields({
        type: 'UPDATE',
        path,
        value,
      })
    },
    [dispatchFields],
  )

  const applyResult = useCallback(
    (result: MetadataSearchResult) => {
      updateField('title', result.title)
      updateField('titleOriginal', result.titleOriginal ?? '')
      updateField('mediaType', mediaType)
      updateField('externalSource', result.externalSource)
      updateField('externalId', result.externalId)
      updateField('year', result.year ?? null)
      updateField(
        'genres',
        result.genres.map((genre) => ({ genre })),
      )
      updateField('coverUrl', result.coverUrl ?? '')
      updateField('metadata', result.raw)
      setSelectedId(`${result.externalSource}:${result.externalId}`)
      toast.success(`Imported "${result.title}" from ${result.externalSource.toUpperCase()}`)
    },
    [mediaType, updateField],
  )

  const runSearch = useCallback(async (searchQuery: string, type: MediaType) => {
    const trimmed = searchQuery.trim()

    if (trimmed.length < 2) {
      setResults([])
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        type,
        q: trimmed,
      })

      const response = await fetch(`/api/metadata/search?${params.toString()}`, {
        credentials: 'include',
      })

      const payload = (await response.json()) as {
        results?: MetadataSearchResult[]
        error?: string
      }

      if (!response.ok) {
        const message = payload.error || 'Catalog temporarily unavailable'
        setResults([])
        setError(message)
        if (response.status >= 500 || response.status === 503) {
          toast.error(message)
        }
        return
      }

      setResults(payload.results ?? [])
      if (!payload.results?.length) {
        setError('No results found. Try another title or media type.')
      }
    } catch {
      const message = 'Catalog temporarily unavailable'
      setError(message)
      setResults([])
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void runSearch(debouncedQuery, mediaType)
  }, [debouncedQuery, mediaType, runSearch])

  const helperText = useMemo(() => {
    switch (mediaType) {
      case 'anime':
      case 'manga':
        return 'Powered by AniList'
      case 'tv':
      case 'movie':
        return 'Powered by TMDB'
      case 'game':
        return 'Powered by IGDB'
      default:
        return ''
    }
  }, [mediaType])

  return (
    <div className={baseClass}>
      <FieldLabel label={field.label || 'Import from catalog'} />
      <p className={`${baseClass}__description`}>
        Search an external catalog and fill in title, cover, year, genres, and metadata. Uses the
        current <strong>Media type</strong> field ({helperText}).
      </p>

      <div className={`${baseClass}__controls`}>
        <input
          className={`${baseClass}__input`}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title…"
          type="search"
          value={query}
        />
        <Button
          buttonStyle="secondary"
          disabled={loading || query.trim().length < 2}
          onClick={() => void runSearch(query, mediaType)}
          size="small"
        >
          {loading ? 'Searching…' : 'Search'}
        </Button>
      </div>

      {error && !loading && (
        <Banner type={results.length ? 'info' : 'error'}>
          <p>{error}</p>
        </Banner>
      )}

      {results.length > 0 && (
        <ul className={`${baseClass}__results`}>
          {results.map((result) => {
            const key = `${result.externalSource}:${result.externalId}`
            const isSelected = selectedId === key

            return (
              <li key={key}>
                <button
                  className={`${baseClass}__result${isSelected ? ` ${baseClass}__result--selected` : ''}`}
                  onClick={() => applyResult(result)}
                  type="button"
                >
                  {result.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt=""
                      className={`${baseClass}__cover`}
                      height={72}
                      src={result.coverUrl}
                      width={48}
                    />
                  ) : (
                    <div className={`${baseClass}__cover ${baseClass}__cover--placeholder`} />
                  )}
                  <span className={`${baseClass}__meta`}>
                    <strong>{result.title}</strong>
                    {result.titleOriginal && result.titleOriginal !== result.title && (
                      <span className={`${baseClass}__original`}>{result.titleOriginal}</span>
                    )}
                    <span className={`${baseClass}__details`}>
                      {[result.year, result.externalSource.toUpperCase(), ...result.genres.slice(0, 3)]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                    {result.summary && (
                      <span className={`${baseClass}__summary`}>
                        {result.summary.length > 140
                          ? `${result.summary.slice(0, 140)}…`
                          : result.summary}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default MetadataSearchField
