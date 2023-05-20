'use client'

import { ChangeEvent, useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { SearchIcon } from 'lucide-react'

import { Input } from '@/components/ui/input'

export default function Search() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()!

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value.trim() === '') {
        params.delete('search')
      } else {
        params.set(name, value)
      }

      return params.toString()
    },
    [searchParams]
  )

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    router.push(pathname + '?' + createQueryString('search', value))
  }

  return (
    <Input
      type="search"
      placeholder="Search project..."
      leftSection={
        <div className="pl-1 text-muted-foreground">
          <SearchIcon size={18} />
        </div>
      }
      onChange={handleChange}
    />
  )
}
