import { routes } from '@/constants/routes'
import useSWR, { useSWRConfig } from 'swr'
import useSWRMutation from 'swr/mutation'

import { Document, DocumentType, Project } from '@/types/collections'
import { fetcher } from '@/lib/fetcher'

const fetchDocuments = (url: string) => fetcher<Document[]>(url)

const createDocument = (
  url: string,
  {
    arg,
  }: { arg: { projectId: string; values: { name: string; content: string } } }
) => fetcher(url, 'POST', undefined, arg.values)

export function useDocuments(projectId: string) {
  const { mutate: mutateCache } = useSWRConfig()
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    routes.API_DOCUMENTS(projectId),
    fetchDocuments
  )

  const { trigger, isMutating: isPending } = useSWRMutation(
    routes.API_DOCUMENTS(projectId),
    createDocument
  )

  const create = async (values: { name: string; content: string }) => {
    return trigger(
      { projectId, values },
      {
        populateCache: (newDocument: DocumentType, documents) => {
          const updatedDocuments = [...documents]
          updatedDocuments.push(newDocument)

          /**
           * Update the cache on projects page to show the new project document
           */
          mutateCache(routes.API_PROJECTS, undefined, {
            populateCache: (_, projects) => {
              if (!projects) return
              const updatedProjects = [...projects]
              const index = projects.findIndex(
                (p: Project) => p.id === projectId
              )
              if (index !== -1) {
                const documentObject = {
                  id: newDocument.id,
                  name: newDocument.name,
                }
                const prevDocuments = projects[index].documents ?? []
                prevDocuments.push(documentObject)
                updatedProjects.splice(index, 1, {
                  ...projects[index],
                  documents: prevDocuments,
                })
              }

              return updatedProjects
            },
          })

          return updatedDocuments
        },
        revalidate: true,
      }
    )
  }

  return {
    data: data ?? [],
    isLoading,
    error,
    isValidating,
    mutate,
    create,
    isPending,
  }
}
