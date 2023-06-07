import { useState } from 'react'
import { routes } from '@/constants/routes'
import { useSWRConfig } from 'swr'
import useSWRMutation from 'swr/mutation'

import { Document, Member, MemberRole, Project } from '@/types/collections'
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
      .then(
        (result: {
          insert: Member[]
          update: { ref: string; role: MemberRole }[]
          remove: string[]
        }) => {
          /**
           * Mutation to update the document cache
           */
          mutateCache(routes.API_DOCUMENT(documentId), undefined, {
            populateCache(_, currentData) {
              const { members: currentMembers, count } = currentData.team
              const newCount =
                count + result.insert.length - result.remove.length

              const newMembers = [...currentMembers]
              result.update.forEach(({ ref, role }) => {
                const index = newMembers.findIndex((m) => m.ref === ref)
                if (index !== -1) {
                  newMembers.splice(index, 1, { ...newMembers[index], role })
                }
              })
              result.remove.forEach((ref) => {
                const index = newMembers.findIndex((m) => m.ref === ref)
                if (index !== -1) {
                  newMembers.splice(index, 1)
                }
              })
              result.insert.forEach((newMember) => {
                if (newMembers.length < 3) {
                  newMembers.push(newMember)
                }
              })

              const newTeam = { members: newMembers, count: newCount }

              if (result.insert.length || result.remove.length) {
                /**
                 * Mutation to update the project documents cache
                 */
                mutateCache(routes.API_DOCUMENTS(projectId), undefined, {
                  populateCache(_, currentData: Document[]) {
                    const newData = currentData.map((doc) => {
                      if (doc.id === documentId) {
                        return { ...doc, team: newTeam }
                      }
                      return doc
                    })
                    return newData
                  },
                  revalidate: false,
                })

                /**
                 * Mutation to update the projects page
                 */
                mutateCache(routes.API_PROJECTS, undefined, {
                  revalidate: true,
                })
              }

              return {
                ...currentData,
                team: newTeam,
              }
            },
            revalidate: false,
          })
        }
      )
      .catch((error) => {
        throw error
      })
  }

  return { loading, fetch, update, isPending }
}
