'use client'

import { ChangeEvent, useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Icons } from '@/components/icons'

export function Search() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()!
  const search = searchParams.get('search') ?? ''

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

  const clearSearch = () => {
    router.push(pathname)
  }

  return (
    <Input
      type="search"
      placeholder="Search project..."
      value={search}
      leftSection={
        <div className="pl-1 text-muted-foreground">
          <Icons.search size={18} />
        </div>
      }
      rightSection={
        search ? (
          <div className="pr-1">
            <Button
              variant="ghost"
              className="size-8 min-w-0 p-2"
              onClick={clearSearch}
            >
              <Icons.close size={18} />
            </Button>
          </div>
        ) : null
      }
      onChange={handleChange}
    />
  )
}
