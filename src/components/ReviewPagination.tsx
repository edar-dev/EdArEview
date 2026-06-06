import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { buildFilteredPath, type ReviewFilters } from '@/lib/review-filters'
import { cn } from '@/utilities/ui'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

type ReviewPaginationProps = {
  basePath: string
  filters: ReviewFilters
  page: number
  totalPages: number
  className?: string
}

function getPageNumbers(page: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages: Array<number | 'ellipsis'> = [1]

  if (page > 3) pages.push('ellipsis')

  const start = Math.max(2, page - 1)
  const end = Math.min(totalPages - 1, page + 1)

  for (let current = start; current <= end; current += 1) {
    pages.push(current)
  }

  if (page < totalPages - 2) pages.push('ellipsis')

  pages.push(totalPages)
  return pages
}

export function ReviewPagination({
  basePath,
  filters,
  page,
  totalPages,
  className,
}: ReviewPaginationProps) {
  if (totalPages <= 1) return null

  const pages = getPageNumbers(page, totalPages)
  const prevHref =
    page > 1 ? buildFilteredPath(basePath, { ...filters, page: page - 1 }) : undefined
  const nextHref =
    page < totalPages ? buildFilteredPath(basePath, { ...filters, page: page + 1 }) : undefined

  return (
    <nav
      aria-label="pagination"
      className={cn('mx-auto mt-10 flex w-full justify-center', className)}
      role="navigation"
    >
      <ul className="flex flex-row items-center gap-1">
        <li>
          {prevHref ? (
            <Link
              aria-label="Pagina precedente"
              className={cn(buttonVariants({ variant: 'ghost', size: 'default' }), 'gap-1 pl-2.5')}
              href={prevHref}
              scroll={false}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Precedente</span>
            </Link>
          ) : (
            <span
              aria-disabled
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'default' }),
                'pointer-events-none gap-1 pl-2.5 opacity-50',
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Precedente</span>
            </span>
          )}
        </li>

        {pages.map((item, index) =>
          item === 'ellipsis' ? (
            <li key={`ellipsis-${index}`}>
              <span
                aria-hidden
                className="flex h-9 w-9 items-center justify-center"
              >
                <MoreHorizontal className="h-4 w-4" />
              </span>
            </li>
          ) : (
            <li key={item}>
              <Link
                aria-current={item === page ? 'page' : undefined}
                className={cn(
                  buttonVariants({
                    variant: item === page ? 'outline' : 'ghost',
                    size: 'icon',
                  }),
                )}
                href={buildFilteredPath(basePath, { ...filters, page: item })}
                scroll={false}
              >
                {item}
              </Link>
            </li>
          ),
        )}

        <li>
          {nextHref ? (
            <Link
              aria-label="Pagina successiva"
              className={cn(buttonVariants({ variant: 'ghost', size: 'default' }), 'gap-1 pr-2.5')}
              href={nextHref}
              scroll={false}
            >
              <span>Successiva</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span
              aria-disabled
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'default' }),
                'pointer-events-none gap-1 pr-2.5 opacity-50',
              )}
            >
              <span>Successiva</span>
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  )
}
