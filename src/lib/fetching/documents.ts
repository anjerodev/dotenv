import 'server-only'

import { DocumentType, Member, MemberRole } from '@/types/collections'
import { RequestError } from '@/lib/errors'
import { getRouteHandlerSession } from '@/lib/supabase-server'

export const getProjectDocuments = async (id: string) => {
  try {
    const { supabase, session } = await getRouteHandlerSession()
    const { data: userProjectDocuments, error } = await supabase
      .from('documents_members')
      .select('document:documents(*)')
      .match({ project_id: id, user_id: session.user.id })
      .order('created_at', { foreignTable: 'documents', ascending: true })
    if (error) {
      console.log({ error })
      throw new RequestError({ message: error.message })
    }
    const data = []
    const documents = userProjectDocuments.reduce(
      (prev: DocumentType[], current) => {
        if (!current.document) return prev
        return prev.concat([current.document])
      },
      []
    )
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
          if (profile) {
            const userRole = role as MemberRole
            team.push({ role: userRole, ...profile })
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
    const { supabase } = await getRouteHandlerSession()
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
      .select('id, role, profile:profiles(id, username, avatar_url)', {
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
    const { data: content, error: decryptionError } = await supabase
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
      for (const documentMember of team.data) {
        const { id, role, profile } = documentMember
        if (profile) {
          const userRole = role as MemberRole
          members.push({ ref: id, role: userRole, ...profile })
        }
      }
    }
    const documentData = lastDocument.data.document ?? {}
    const data = {
      ...documentData,
      updated_at: lastDocument.data.updated_at!,
      updated_by: lastDocument.data.updated_by!,
      content: content?.decrypted_content ?? '',
      team: { members, count: team.count ?? 0 },
    }
    return data
  } catch (error) {
    throw error
  }
}
