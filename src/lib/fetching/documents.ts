import { Member, MemberRole } from '@/types/collections'

import { RequestError } from '../request-error-handler'
import { getSession } from '../supabase-server'

export const getProjectDocuments = async (id: string) => {
  try {
    const { supabase, error: sessionError } = await getSession()

    if (sessionError || !supabase) {
      throw new RequestError({
        message:
          sessionError?.message ?? 'There is no connection with the database.',
        status: sessionError?.status,
      })
    }

    const { data: documents, error } = await supabase
      .from('documents')
      .select()
      .eq('project_id', id)
      .order('created_at', { ascending: true })

    if (error) {
      console.log({ error })
      throw new RequestError({ message: error.message })
    }

    const data = []

    // Fetch the document data
    for (const document of documents) {
      // Get the last document history
      const lastUpdate = supabase
        .from('documents_history')
        .select('updated_at')
        .eq('document_id', document.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      // Get the document members
      const documentTeam = supabase
        .from('documents_members')
        .select('role, profile:profiles(id, username, avatar_url)', {
          count: 'exact',
        })
        .eq('document_id', document.id)
        .order('added_at', { ascending: true })
        .limit(3)

      const [lastUpdateData, teamData] = await Promise.all([
        lastUpdate,
        documentTeam,
      ])

      const documentError = lastUpdateData.error || teamData.error

      if (documentError) {
        console.log({ documentError })
        continue
      }

      const team: Member[] = []

      if (teamData) {
        for (const member of teamData.data) {
          const { role, profile } = member
          if (profile && !Array.isArray(profile)) {
            const avatarUrl = profile.avatar_url
            const avatar = avatarUrl
              ? supabase.storage.from('avatars').getPublicUrl(avatarUrl).data
                  .publicUrl
              : null
            const userRole = role as MemberRole

            team.push({ role: userRole, avatar, ...profile })
          }
        }
      }

      data.push({
        ...document,
        ...lastUpdateData.data,
        team: {
          members: team,
          count: teamData.count ?? 0,
        },
      })
    }

    return data
  } catch (error: any) {
    throw error
  }
}
