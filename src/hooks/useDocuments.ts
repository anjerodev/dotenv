import { routes } from '@/constants/routes'
import useSWR, { useSWRConfig } from 'swr'
import useSWRMutation from 'swr/mutation'

import { Document, DocumentType, Project } from '@/types/collections'
import { fetcher } from '@/lib/fetcher'

interface ProjectCard extends Omit<Project, 'documents'> {
  documents: { id: string; name: string }[]
}

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
    projectId ? routes.API_DOCUMENTS(projectId) : null,
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
        populateCache: (newDocument: DocumentType) => {
          /**
           * Using the result return from the populateCache option
           * to update the cache on Projects page, and list the
           * new document.
           */
          mutateCache(routes.API_PROJECTS, undefined, {
            populateCache: (_, projects) => {
              if (!projects) return
              return projects.map((project: ProjectCard) => {
                if (project.id === projectId) {
                  const { documents = [] } = project
                  const documentObject = {
                    id: newDocument.id,
                    name: newDocument.name,
                  }
                  const updatedDocuments = [...documents, documentObject]
                  return { ...project, documents: updatedDocuments }
                }
                return project
              })
            },
          })
        },
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
