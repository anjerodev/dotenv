import { routes } from '@/constants/routes'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

import { Project } from '@/types/collections'
import { fetcher } from '@/lib/fetcher'

const fetchProject = (url: string) => fetcher<Project>(url)

const updateProject = (
  url: string,
  {
    arg,
  }: { arg: { id: string; values: { name: string; removedDocs: string[] } } }
) => fetcher(routes.API_PROJECT(arg.id), 'PATCH', undefined, arg.values)

const removeProject = (url: string, { arg }: { arg: { id: string } }) =>
  fetcher(routes.API_PROJECT(arg.id), 'DELETE')

export function useProject(id: string) {
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    id ? routes.API_PROJECT(id) : null,
    fetchProject
  )

  const { trigger: updateMutation, isMutating: isPending } = useSWRMutation(
    routes.API_PROJECTS,
    updateProject
  )

  const { trigger: removeMutation, isMutating: isRemoving } = useSWRMutation(
    routes.API_PROJECTS,
    removeProject
  )

  const update = async (values: { name: string; removedDocs: string[] }) => {
    return await updateMutation(
      { id, values },
      {
        populateCache: (updatedProject: Project, projects) => {
          const curr = [...projects]
          const index = projects.findIndex(
            (p: Project) => p.id === updatedProject.id
          )
          if (index !== -1) {
            curr.splice(index, 1, {
              ...projects[index],
              name: updatedProject.name,
              documents: projects[index].documents.filter(
                (doc: any) =>
                  !updatedProject.documents.some(
                    (removedDocument) => removedDocument.id === doc.id
                  )
              ),
            })
          }

          return curr
        },
        revalidate: false,
      }
    )
  }

  const remove = async () => {
    return await removeMutation(
      { id },
      {
        populateCache: (removedProject, projects) => {
          const filteredProjects = projects.filter(
            (pr: Project) => pr.id !== removedProject.id
          )
          return filteredProjects
        },
        revalidate: false,
      }
    )
  }

  return {
    data,
    isLoading,
    isValidating,
    error,
    mutate,
    update,
    remove,
    isPending,
    isRemoving,
  }
}
