import Link from 'next/link'

export function EdArEviewLogo({ className }: { className?: string }) {
  return (
    <Link className={className} href="/">
      <span className="font-semibold tracking-tight">
        Ed<span className="logo-r">A</span>rEview
      </span>
    </Link>
  )
}
