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
      documentId: string
      values: { name: string | null; content: string }
    }
  }
) =>
  fetcher(
    routes.API_PROJECT_DOCUMENT(arg.projectId, arg.documentId),
    'PATCH',
    undefined,
    arg.values
  )

export default function useDocument({
  id,
  initialLoading,
}: {
  id?: string | null
  initialLoading: boolean
}) {
  const { mutate: mutateGlobal } = useSWRConfig()
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    id ? routes.API_DOCUMENT(id) : null,
    fetchDocument
  )
  const { trigger: updateMutation, isMutating: isPending } = useSWRMutation(
    routes.API_PROJECTS,
    updateDocument
  )

  const update = async (
    projectId: string,
    values: { name: string | null; content: string }
  ) => {
    if (!id || !projectId || !data) return
    try {
      await updateMutation(
        { projectId, documentId: id, values },
        {
          populateCache: (_, projects) => {
            if (!projects) return
            /**
             * If the document name change, update the projects page
             * to display the new name
             */
            if (values.name) {
              mutateGlobal(routes.API_DOCUMENTS(projectId), undefined, {
                populateCache: (_, documents) => {
                  return documents.map((doc: Document) => {
                    return doc.id === id ? { ...doc, name: values.name } : doc
                  })
                },
              })

              const updatedProjects = [...projects]
              const index = projects.findIndex(
                (p: Project) => p.id === projectId
              )
              if (index !== -1) {
                const prevDocuments = projects[index].documents ?? []
                const updatedDocuments = prevDocuments.map(
                  (doc: { id: string; name: string }) => {
                    return doc.id === id ? { ...doc, name: values.name } : doc
                  }
                )
                updatedProjects.splice(index, 1, {
                  ...projects[index],
                  documents: updatedDocuments,
                })
              }
              return updatedProjects
            }
          },
        }
      )
      mutate({
        ...data,
        name: values.name ?? data.name,
        content: values.content,
      })
    } catch (error) {
      throw error
    }
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
