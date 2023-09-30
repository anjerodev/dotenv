import { routes } from '@/constants/routes'
import useSWR, { useSWRConfig } from 'swr'
import useSWRMutation from 'swr/mutation'

import { Document, Project } from '@/types/collections'
import { fetcher } from '@/lib/fetcher'

const fetchDocument = (url: string) => fetcher<Document>(url)
const updateDocument = (
  url: string,
  {
    arg,
  }: {
    arg: {
      projectId: string
      values: { name: string | null; content: string }
    }
  }
) => fetcher(url, 'PATCH', undefined, arg)

export default function useDocument({
  id,
  initialLoading,
}: {
  id?: string | null
  initialLoading: boolean
}) {
  const { mutate: mutateCache } = useSWRConfig()
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    id ? routes.API_DOCUMENT(id) : null,
    fetchDocument
  )
  const { trigger: updateMutation, isMutating: isPending } = useSWRMutation(
    id ? routes.API_DOCUMENT(id) : null,
    updateDocument
  )

  const update = async (
    projectId: string,
    values: { name: string | null; content: string }
  ) => {
    if (!id || !projectId || !data) return
    return updateMutation({ projectId, values }).then((updatedDocument) => {
      mutateCache(routes.API_DOCUMENTS(projectId), undefined, {
        populateCache(_, documents) {
          return documents.map((doc: Document) => {
            return doc.id === id
              ? {
                  ...doc,
                  name: updatedDocument.name,
                  updated_at: updatedDocument.updated_at,
                }
              : doc
          })
        },
      })

      /**
       * If the document name change, update the projects page
       * to display the new name
       */
      if (values.name) {
        mutateCache(routes.API_PROJECTS, undefined, {
          populateCache(_, projects) {
            if (!projects) return

            return projects.map((project: Project) => {
              if (project.id === projectId) {
                const { documents = [] } = project
                const updatedDocuments = documents.map((doc) => {
                  if (doc.id === id) {
                    return { ...doc, name: values.name }
                  }
                  return doc
                })

                return { ...project, documents: updatedDocuments }
              }
              return project
            })
          },
        })
      }
    })
  }

  return {
    data,
    isLoading: !data && !isLoading ? initialLoading : isLoading,
    isValidating,
    error,
    mutate,
    update,
    isPending,
  }
}
