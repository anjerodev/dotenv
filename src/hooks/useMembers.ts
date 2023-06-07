import { useState } from 'react'
import { routes } from '@/constants/routes'
import { useSWRConfig } from 'swr'
import useSWRMutation from 'swr/mutation'

import { Member } from '@/types/collections'
import { fetcher } from '@/lib/fetcher'

const fetchMembers = (url: string, data: { [x: string]: any }) =>
  fetcher<Member[]>(url, 'POST', undefined, data)

const updateDocumentMembers = (
  url: string,
  {
    arg,
  }: {
    arg: { projectId: string; documentId: string; members: Partial<Member>[] }
  }
) => fetcher(url, 'PATCH', undefined, arg)

export function useMembers() {
  const { mutate: mutateCache } = useSWRConfig()
  const [loading, setLoading] = useState(false)

  const { trigger: updateMutation, isMutating: isPending } = useSWRMutation(
    routes.API_MEMBERS,
    updateDocumentMembers
  )

  const fetch = async (values: { username: string; email: string }) => {
    try {
      setLoading(true)
      const members = await fetchMembers(routes.API_MEMBERS, values)
      return members
    } catch (error) {
      // console.error(error)
      return []
    } finally {
      setLoading(false)
    }
  }

  const update = async ({
    projectId,
    documentId,
    members,
  }: {
    projectId: string
    documentId: string
    members: Partial<Member>[]
  }) => {
    return updateMutation({ projectId, documentId, members })
      .then(() => {
        // Update cache in document, project and projects page
        // TODO: Update cache programatically for a better user experience.
        mutateCache(routes.API_DOCUMENT(documentId), undefined, {
          revalidate: true,
        })
        mutateCache(routes.API_PROJECT(projectId), undefined, {
          revalidate: true,
        })
        mutateCache(routes.API_PROJECTS, undefined, {
          revalidate: true,
        })
      })
      .catch((error) => {
        throw error
      })
  }

  return { loading, fetch, update, isPending }
}
