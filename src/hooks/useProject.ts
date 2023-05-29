import { useRouter } from 'next/navigation'
import { routes } from '@/constants/routes'
import useSWR, { useSWRConfig } from 'swr'
import useSWRMutation from 'swr/mutation'

import { Project } from '@/types/collections'
import { fetcher } from '@/lib/fetcher'

const fetchProject = (url: string) => fetcher<Project>(url)

const updateProject = (
  url: string,
  { arg }: { arg: { name: string; removedDocs: string[] } }
) => fetcher(url, 'PATCH', undefined, arg)

const removeProject = (url: string) => fetcher(url, 'DELETE')

export function useProject(id: string) {
  const router = useRouter()
  const { mutate: mutateCache } = useSWRConfig()
  const { data, isLoading, error, isValidating } = useSWR(
    id ? routes.API_PROJECT(id) : null,
    fetchProject
  )

  const { trigger: updateMutation, isMutating: isPending } = useSWRMutation(
    routes.API_PROJECT(id),
    updateProject
  )

  const { trigger: removeMutation, isMutating: isRemoving } = useSWRMutation(
    routes.API_PROJECT(id),
    removeProject,
    { revalidate: false }
  )

  const update = async (values: { name: string; removedDocs: string[] }) => {
    return updateMutation(values)
      .then((updatedProject: Project) => {
        // Update cache in projects page
        mutateCache(routes.API_PROJECTS, undefined, {
          populateCache(_, projects: Project[]) {
            return projects.map((project: Project) => {
              if (project.id === updatedProject.id) {
                return {
                  ...project,
                  name: updatedProject.name,
                  documents: project.documents.filter(
                    (doc: any) =>
                      !updatedProject.documents.some(
                        (removedDocument) => removedDocument.id === doc.id
                      )
                  ),
                }
              }
              return project
            })
          },
          revalidate: false,
        })
      })
      .catch((error) => {
        throw error
      })
  }

  const remove = async () => {
    return removeMutation()
      .then((removedProject) => {
        // Update cache in projects page
        mutateCache(routes.API_PROJECTS, undefined, {
          populateCache(_, projects) {
            const filteredProjects = projects.filter(
              (pr: Project) => pr.id !== removedProject.id
            )
            return filteredProjects
          },
          revalidate: false,
        })
        router.replace(routes.PROJECTS)
      })
      .catch((error) => {
        throw error
      })
  }

  return {
    data,
    isLoading,
    isValidating,
    error,
    update,
    remove,
    isPending,
    isRemoving,
  }
}
