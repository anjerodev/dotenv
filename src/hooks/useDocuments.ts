import { routes } from '@/constants/routes'
import useSWR from 'swr'

import { Document } from '@/types/collections'
import { fetcher } from '@/lib/fetcher'

type UseDocumentsType = {
  data: Document[] | undefined
  count: number
  isLoading: boolean
  error: any
}

const fetchDocuments = (url: string) => fetcher<Document[]>(url)
const countDocuments = (url: string) => fetcher<{ count: number }>(url)

export default function useDocuments({
  projectId,
}: {
  projectId: string
}): UseDocumentsType {
  const {
    data: documentsCount,
    error: documentsCountError,
    isLoading: documentsCountLoading,
  } = useSWR(routes.API_COUNT_DOCUMENTS(projectId), countDocuments)

  const {
    data,
    error: documentsError,
    isLoading: documentsLoading,
  } = useSWR(routes.API_LIST_DOCUMENTS(projectId), fetchDocuments)

  const error = documentsCountError || documentsError
  const isLoading = documentsCountLoading || documentsLoading

  return {
    data,
    count: documentsCount?.count ?? 1,
    isLoading,
    error,
  }
}
