import { routes } from '@/constants/routes'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

import { Project, ProjectInputType } from '@/types/collections'
import { fetcher } from '@/lib/fetcher'

const fetchProjects = (url: string) => fetcher<Project[]>(url)

const createProject = (url: string, { arg }: { arg: ProjectInputType }) =>
  fetcher(url, 'POST', undefined, arg)

export function useProjects() {
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    routes.API_PROJECTS,
    fetchProjects
  )

  const { trigger: create, isMutating: isPending } = useSWRMutation(
    routes.API_PROJECTS,
    createProject
  )

  return {
    data,
    isLoading,
    isValidating,
    error,
    mutate,
    create,
    isPending,
  }
}
