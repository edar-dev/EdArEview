'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatWorkRef } from '@/lib/compare-works'
import { MEDIA_TYPE_LABELS } from '@/lib/media-types'
import type { MediaWork } from '@/payload-types'

type ComparePickerProps = {
  works: MediaWork[]
  initialA?: string | null
  initialB?: string | null
}

export function ComparePicker({ works, initialA, initialB }: ComparePickerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [workA, setWorkA] = useState(initialA ?? '')
  const [workB, setWorkB] = useState(initialB ?? '')

  const options = works.map((work) => ({
    value: formatWorkRef(work),
    label: `${work.title} (${MEDIA_TYPE_LABELS[work.mediaType]})`,
  }))

  const submit = () => {
    if (!workA || !workB || workA === workB) return

    startTransition(() => {
      router.push(`/compare?a=${encodeURIComponent(workA)}&b=${encodeURIComponent(workB)}`)
    })
  }

  return (
    <div className="bg-card grid gap-4 rounded-xl border p-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
      <div className="space-y-2">
        <Label htmlFor="compare-a">Opera A</Label>
        <Select onValueChange={setWorkA} value={workA || undefined}>
          <SelectTrigger id="compare-a">
            <SelectValue placeholder="Seleziona…" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="compare-b">Opera B</Label>
        <Select onValueChange={setWorkB} value={workB || undefined}>
          <SelectTrigger id="compare-b">
            <SelectValue placeholder="Seleziona…" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button disabled={!workA || !workB || workA === workB || isPending} onClick={submit} type="button">
        Confronta
      </Button>
    </div>
  )
}
