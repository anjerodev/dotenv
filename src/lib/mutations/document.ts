import 'server-only'
import { MemberRole } from '@/types/collections'
import { RequestError } from '@/lib/errors'
import { supabase as admin, getSession } from '@/lib/supabase-server'

export async function createDocument(
  projectId: string,
  values: { name: string; content: string }
) {
  try {
    if (!values) return { error: { message: 'No values has been passed.' } }

    const { supabase, session, error: sessionError } = await getSession()

    if (sessionError) {
      throw new RequestError({
        message:
          sessionError?.message ?? 'There is no connection with the database.',
        status: sessionError?.status,
      })
    }

    // Check that there is not a document with the same name in the project
    const { data: prevDoc } = await supabase
      .from('documents')
      .select('id')
      .match({ name: values.name, project_id: projectId })
      .limit(1)
      .single()

    if (prevDoc) {
      throw new RequestError({
        message: 'Validation fail.',
        form: {
          name: 'The document already exist, please, use another name.',
        },
      })
    }

    const { data: document, error } = await supabase
      .from('documents')
      .insert({ name: values.name, project_id: projectId })
      .select()
      .single()

    if (error) {
      console.error(error)
      throw new RequestError({
        message: 'Error creating the new document.',
      })
    }

    const insertValues = {
      document_id: document.id,
      content: values.content,
      updated_by: session.user.id,
    }

    const historyPromise = await admin
      .from('documents_history')
      .insert(insertValues)

    const memberPromise = supabase
      .from('documents_members')
      .insert({
        document_id: document.id,
        role: MemberRole.Owner,
        user_id: session.user.id,
        project_id: projectId,
      })
      .select('role, profile:profiles(id, username, avatar_url)')
      .single()

    const [history, member] = await Promise.all([historyPromise, memberPromise])

    const creationError = history.error || member.error

    if (creationError) {
      console.error(creationError)
      throw new RequestError({
        message: 'Error creating document nested rows',
      })
    }

    const profile =
      member.data.profile && Array.isArray(member.data.profile)
        ? member.data.profile[0]
        : member.data.profile
    const avatar = profile?.avatar_url
      ? supabase.storage.from('avatars').getPublicUrl(profile.avatar_url).data
          .publicUrl
      : null
    const memberData = { role: member.data.role, avatar, ...profile }

    return { ...document, team: { members: [memberData], count: 1 } }
  } catch (error) {
    throw error
  }
}

export async function updateDocument(
  documentId: string,
  args: { projectId: string; values: { name: string; content: string } }
) {
  try {
    const { supabase, session, error: sessionError } = await getSession()

    if (sessionError) {
      throw new RequestError({
        message:
          sessionError?.message ?? 'There is no connection with the database.',
        status: sessionError?.status,
      })
    }

    if (!documentId || !args)
      throw new RequestError({
        message: 'No values has been passed',
      })

    if (args.values.name) {
      // Check that there is not a document with the same name in the project
      const { data: prevDoc } = await supabase
        .from('documents')
        .select('id')
        .match({ name: args.values.name, project_id: args.projectId })
        .limit(1)
        .single()

      if (prevDoc) {
        throw new RequestError({
          message: 'Validation fail.',
          form: {
            name: 'The document already exist, please, use another name.',
          },
        })
      }

      const { error } = await supabase
        .from('documents')
        .update({ name: args.values.name })
        .eq('id', documentId)

      if (error) {
        console.log(error)
        throw new RequestError({
          message: 'The document name could not be updated.',
        })
      }
    }

    const { data: history, error } = await admin
      .from('documents_history')
      .insert({
        document_id: documentId,
        content: args.values.content,
        updated_by: session.user.id,
      })
      .select(
        'id, document_id,updated_at, document:documents(*), updated_by:profiles(id, username, avatar_url)'
      )
      .single()

    if (error) {
      throw new RequestError({
        message: 'Error updating the document.',
      })
    }

    const documentData = Array.isArray(history.document)
      ? history.document[0]
      : history.document

    const updatedBy = Array.isArray(history.updated_by)
      ? history.updated_by[0]
      : history.updated_by

    const data = {
      ...documentData,
      updated_at: history.updated_at,
      updated_by: updatedBy,
      content: args.values.content,
    }

    return data
  } catch (error) {
    throw error
  }
}
