import 'server-only'
import { Member, MemberRole } from '@/types/collections'
import { RequestError } from '@/lib/request-error-handler'
import { supabase as admin, getSession } from '@/lib/supabase-server'

export const getProjectDocuments = async (id: string) => {
  try {
    const { supabase, error: sessionError } = await getSession()

    if (sessionError) {
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
  } catch (error) {
    throw error
  }
}

export const getDocument = async (id: string) => {
  try {
    const { supabase, error: sessionError } = await getSession()

    if (sessionError) {
      throw new RequestError({
        message:
          sessionError?.message ?? 'There is no connection with the database.',
        status: sessionError?.status,
      })
    }

    // Get the last document update data
    const lastDocumentPromise = supabase
      .from('documents_history')
      .select(
        'id, content, document_id,updated_at, document:documents(*), updated_by:profiles(id, username, avatar_url)'
      )
      .eq('document_id', id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    // Get the document members
    const teamPromise = supabase
      .from('documents_members')
      .select('role, profile:profiles(id, username, avatar_url)', {
        count: 'exact',
      })
      .eq('document_id', id)
      .order('added_at', { ascending: true })

    const [lastDocument, team] = await Promise.all([
      lastDocumentPromise,
      teamPromise,
    ])

    const error = lastDocument.error || team.error
    if (error) {
      console.log({ error })
      throw new RequestError({ message: error.message })
    }

    // Get the decrypted content
    const { data: content, error: decryptionError } = await admin
      .from('decrypted_documents_history')
      .select('decrypted_content')
      .eq('id', lastDocument?.data?.id)
      .limit(1)
      .single()

    if (decryptionError) {
      console.log('Decryption error:', decryptionError)
    }

    const members: Member[] = []

    if (team) {
      for (const member of team.data) {
        const { role, profile } = member
        if (profile && !Array.isArray(profile)) {
          const avatarUrl = profile.avatar_url
          const avatar = avatarUrl
            ? supabase.storage.from('avatars').getPublicUrl(avatarUrl).data
                .publicUrl
            : null
          const userRole = role as MemberRole

          members.push({ role: userRole, avatar, ...profile })
        }
      }
    }

    const documentData = Array.isArray(lastDocument.data.document)
      ? lastDocument.data.document[0]
      : lastDocument.data.document
    const updatedBy = Array.isArray(lastDocument.data.updated_by)
      ? lastDocument.data.updated_by[0]
      : lastDocument.data.updated_by

    const data = {
      ...documentData!,
      updated_at: lastDocument.data.updated_at!,
      updated_by: updatedBy!,
      content: content?.decrypted_content ?? '',
      team: { members, count: team.count ?? 0 },
    }

    return data
  } catch (error) {
    throw error
  }
}
