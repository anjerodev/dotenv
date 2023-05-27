import { routes } from '@/constants/routes'
import useSWR from 'swr'

import { Document } from '@/types/collections'
import { fetcher } from '@/lib/fetcher'

const fetchDocument = (url: string) => fetcher<Document>(url)

export default function useDocument(id?: string | null) {
  const {
    data,
    isLoading: loading,
    error,
    isValidating,
    mutate,
  } = useSWR(id ? routes.API_DOCUMENT(id) : null, fetchDocument)

  const isLoading = (id && !data) || loading

  return {
    data,
    isLoading,
    isValidating,
    error,
    mutate,
  }
}
