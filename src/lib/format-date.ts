export function formatPublishedDate(value?: string | null): string {
  if (!value) return ''

  return new Date(value).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
