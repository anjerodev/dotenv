import { useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function useSetParams() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value.trim() === '') {
        params.delete(name)
      } else {
        params.set(name, value)
      }

      return params.toString()
    },
    [searchParams]
  )

  const setParams = (name: string, value: string) => {
    router.push(pathname + '?' + createQueryString(name, value))
  }

  const cleanParams = () => router.push(pathname)

  return { setParams, cleanParams }
}
