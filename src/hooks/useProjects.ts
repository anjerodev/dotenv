import { routes } from '@/constants/routes'
import useSWR from 'swr'

import { Project } from '@/types/collections'
import { fetcher } from '@/lib/fetcher'

const countProjects = (url: string) =>
  fetcher<{ count: number; projects: string[] }>(url)
const fetchProjects = ({ url, data }: { url: string; data: string[] }) =>
  fetcher<Project[]>(url, 'POST', data)

export default function useProjects() {
  const {
    data: projectList,
    error: projectListError,
    isLoading: projectListLoading,
  } = useSWR(routes.API_COUNT_PROJECTS, countProjects)

  const {
    data: projects,
    error: projectsError,
    isLoading: projectsLoading,
  } = useSWR(
    projectList
      ? {
          url: routes.API_LIST_PROJECTS,
          data: { projectsIds: projectList.projects },
        }
      : null,
    fetchProjects
  )

  const isLoading = projectListLoading || projectsLoading
  const error = projectListError ?? projectsError

  return {
    count: projectList?.count || 1,
    isLoading,
    data: projects ?? [],
    error,
  }
}
