import { routes } from '@/constants/routes'
import useSWR, { mutate } from 'swr'

import { Document } from '@/types/collections'
import { fetcher } from '@/lib/fetcher'

type PostDocumentType = {
  name: string | null
  content: string
}

type UseDocumentType = {
  data: Document | undefined
  isLoading: boolean
  error: any
  addDocument: (data: PostDocumentType) => Promise<void>
  updateDocument: (data: PostDocumentType) => Promise<void>
}

const fetchDocument = (url: string) => fetcher<Document>(url)
const postDocument = (url: string, data: PostDocumentType) =>
  fetcher(url, 'POST', data)
const patchDocument = (url: string, data: PostDocumentType) =>
  fetcher(url, 'PATCH', data)

export default function useDocument({
  projectId,
  documentId,
}: {
  projectId: string
  documentId?: string
}): UseDocumentType {
  const { data, isLoading, error, isValidating } = useSWR(
    documentId ? routes.API_DOCUMENT({ projectId, documentId }) : null,
    fetchDocument
  )

  const addDocument = async (data: PostDocumentType) => {
    return mutate(
      routes.API_LIST_DOCUMENTS(projectId),
      postDocument(routes.API_ADD_DOCUMENT(projectId), data),
      {
        populateCache: (newDocument, documents) => {
          return [...documents, newDocument]
        },
        revalidate: false,
      }
    )
  }

  const updateDocument = async (data: PostDocumentType) => {
    if (!documentId) return

    return mutate(
      routes.API_DOCUMENT({ projectId, documentId }),
      patchDocument(routes.API_DOCUMENT({ projectId, documentId }), data),
      {
        populateCache: (newDocument, prev) => {
          return { ...prev, ...newDocument }
        },
        revalidate: false,
      }
    )
  }

  return {
    data,
    isLoading,
    error,
    addDocument,
    updateDocument,
  }
}
