'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'

export function SpoilerBanner({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)

  if (visible) {
    return <>{children}</>
  }

  return (
    <div className="border-warning bg-warning/15 space-y-4 rounded-lg border p-6">
      <p className="text-sm font-medium">Questa recensione contiene spoiler.</p>
      <Button onClick={() => setVisible(true)} size="sm" type="button" variant="secondary">
        Mostra spoiler
      </Button>
    </div>
  )
}
