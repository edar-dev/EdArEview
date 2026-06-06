'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  buildFilterSearchParams,
  parseReviewFilters,
  SORT_OPTIONS,
  WATCH_STATUS_OPTIONS,
  type ReviewFilters,
} from '@/lib/review-filters'
import type { Tag } from '@/payload-types'
import { cn } from '@/utilities/ui'

type FilterBarProps = {
  tags: Tag[]
  className?: string
}

export function FilterBar({ tags, className }: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const current = parseReviewFilters(Object.fromEntries(searchParams.entries()))
  const [query, setQuery] = useState(current.q ?? '')

  useEffect(() => {
    setQuery(current.q ?? '')
  }, [current.q])

  const applyFilters = useCallback(
    (updates: Partial<ReviewFilters>) => {
      const currentFilters = parseReviewFilters(Object.fromEntries(searchParams.entries()))
      const next: ReviewFilters = {
        ...currentFilters,
        ...updates,
        page: updates.page ?? 1,
      }

      if (updates.q !== undefined) {
        next.q = updates.q.trim() || undefined
      }

      for (const key of ['minRating', 'year', 'status', 'tag'] as const) {
        if (key in updates && updates[key] === undefined) {
          delete next[key]
        }
      }

      const params = buildFilterSearchParams(next)
      const href = params.toString() ? `${pathname}?${params.toString()}` : pathname

      startTransition(() => {
        router.push(href, { scroll: false })
      })
    },
    [pathname, router, searchParams],
  )

  const clearFilters = () => {
    setQuery('')
    startTransition(() => {
      router.push(pathname, { scroll: false })
    })
  }

  const hasActiveFilters = Boolean(
    current.q ||
      current.minRating ||
      current.year ||
      current.status ||
      current.tag ||
      (current.sort && current.sort !== 'date'),
  )

  return (
    <div
      className={cn(
        'space-y-4 rounded-lg border bg-card/50 p-4',
        isPending && 'opacity-70',
        className,
      )}
    >
      <form
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        onSubmit={(event) => {
          event.preventDefault()
          applyFilters({ q: query })
        }}
      >
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="filter-q">Cerca</Label>
          <div className="flex gap-2">
            <Input
              id="filter-q"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Titolo opera o recensione…"
              type="search"
              value={query}
            />
            <Button type="submit" variant="secondary">
              Cerca
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-min-rating">Voto minimo</Label>
          <Input
            id="filter-min-rating"
            max={10}
            min={0}
            onChange={(event) => {
              const value = event.target.value
              applyFilters({ minRating: value ? Number(value) : undefined })
            }}
            placeholder="es. 7"
            step={0.5}
            type="number"
            value={current.minRating ?? ''}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-year">Anno</Label>
          <Input
            id="filter-year"
            max={2100}
            min={1900}
            onChange={(event) => {
              const value = event.target.value
              applyFilters({ year: value ? Number(value) : undefined })
            }}
            placeholder="es. 2024"
            type="number"
            value={current.year ?? ''}
          />
        </div>

        <div className="space-y-2">
          <Label>Stato</Label>
          <Select
            onValueChange={(value) =>
              applyFilters({ status: value === 'all' ? undefined : (value as ReviewFilters['status']) })
            }
            value={current.status ?? 'all'}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tutti" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti</SelectItem>
              {WATCH_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Ordina per</Label>
          <Select
            onValueChange={(value) => applyFilters({ sort: value as ReviewFilters['sort'] })}
            value={current.sort ?? 'date'}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <div className="flex items-end">
            <Button onClick={clearFilters} type="button" variant="ghost">
              Azzera filtri
            </Button>
          </div>
        )}
      </form>

      {tags.length > 0 && (
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm">Tag</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const active = current.tag === tag.slug
              return (
                <button
                  className={cn(
                    'rounded-full border px-3 py-1 text-sm transition-colors',
                    active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'hover:bg-secondary',
                  )}
                  key={tag.id}
                  onClick={() => applyFilters({ tag: active ? undefined : tag.slug })}
                  type="button"
                >
                  {tag.name}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
