import { routes } from '@/constants/routes'
import useSWR from 'swr'

import { Project } from '@/types/collections'
import { fetcher } from '@/lib/fetcher'

type UpdateProjectData = {
  name: string
  removedDocs: string[]
}

type UseProjectType = {
  data: Project | undefined
  isLoading: boolean
  error: any
  removeProject: () => Promise<void>
  updateProject: ({ name, removedDocs }: UpdateProjectData) => Promise<void>
}

const fetchProject = (url: string) => fetcher<Project>(url)
const updateProject = (url: string, data: UpdateProjectData) =>
  fetcher(url, 'PATCH', data)

export default function useProject({
  projectId,
}: {
  projectId: string
}): UseProjectType {
  const { data, error, isLoading } = useSWR(
    routes.API_PROJECT(projectId),
    fetchProject
  )

  const removeProject = async () => {
    console.log('Removing project ' + projectId)
    // Rediret to /projects
  }

  const updateProject = async ({ name, removedDocs }: UpdateProjectData) => {
    if (!projectId) return
    console.log({ name, removedDocs })
  }

  return {
    data,
    isLoading,
    error,
    removeProject,
    updateProject,
  }
}
