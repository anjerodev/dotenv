'use server'

import { revalidatePath } from 'next/cache'
import { routes } from '@/constants/routes'

import { MutationReturnType } from '@/types/actions'
import { DocumentInputType, MemberRole } from '@/types/collections'
import { supabase as admin, getSession } from '@/lib/supabase-server'

export async function addDocument(
  values: DocumentInputType & { content: string }
) {
  if (!values) return { error: { message: 'No values has been passed.' } }

  const { supabase, session, error: sessionError } = await getSession()

  if (sessionError) {
    return {
      error: {
        message:
          sessionError?.message ?? 'There is no connection with the database.',
      },
    }
  }

  // Check that there is not a document with the same name in the project
  const { data: prevDoc } = await supabase
    .from('documents')
    .select('id')
    .match({ name: values.name, project_id: values.project_id })
    .limit(1)
    .single()

  if (prevDoc) {
    return {
      error: {
        message: 'Validation fail.',
        form: {
          name: 'The document already exist, please, use another name.',
        },
      },
    }
  }

  const { data: document, error } = await supabase
    .from('documents')
    .insert({ name: values.name, project_id: values.project_id })
    .select()
    .single()

  if (error) {
    console.error(error)
    return { error: { message: 'Error creating the new document.' } }
  }

  const insertValues = {
    document_id: document.id,
    content: values.content,
    updated_by: session.user.id,
  }

  // Avoid the creation of the encrypted content value if it is not provided
  const historyPromise = values.content
    ? await admin.from('documents_history').insert(insertValues)
    : await supabase.from('documents_history').insert(insertValues)

  const memberPromise = supabase.from('documents_members').insert({
    document_id: document.id,
    role: MemberRole.Owner,
    user_id: session.user.id,
    project_id: values.project_id,
  })

  const [history, member] = await Promise.all([historyPromise, memberPromise])

  const creationError = history.error || member.error

  if (creationError) {
    console.error(creationError)
    return {
      error: {
        message: 'Error creating the new document.',
      },
    }
  }

  revalidatePath(routes.PROJECT(values.project_id))
  revalidatePath(routes.PROJECTS)
  return { error: null }
}

interface UpdateDocumentInput {
  name: string | null
  content: string
}

export async function updateDocument({
  projectId,
  id,
  values,
}: {
  projectId: string
  id: string
  values: UpdateDocumentInput
}): Promise<MutationReturnType> {
  const { supabase, session, error: sessionError } = await getSession()

  if (sessionError) {
    return {
      error: {
        message:
          sessionError?.message ?? 'There is no connection with the database.',
      },
    }
  }

  if (!projectId || !id || !values)
    return { error: { message: 'No values has been passed.' } }

  if (values.name) {
    // Check that there is not a document with the same name in the project
    const { data: prevDoc } = await supabase
      .from('documents')
      .select('id')
      .match({ name: values.name, project_id: projectId })
      .limit(1)
      .single()

    if (prevDoc) {
      return {
        error: {
          message: 'Validation fail.',
          form: {
            name: 'The document already exist, please, use another name.',
          },
        },
      }
    }

    const { error } = await supabase
      .from('documents')
      .update({ name: values.name })
      .eq('id', id)

    if (error) {
      console.log(error)
      return {
        error: {
          message: 'The document name could not be updated.',
        },
      }
    }
  }

  const insertValues = {
    document_id: id,
    content: values.content,
    updated_by: session.user.id,
  }

  const { error } = values.content
    ? await admin.from('documents_history').insert(insertValues)
    : await supabase.from('documents_history').insert(insertValues)

  if (error) {
    return { error: { message: 'Error creating the new document.' } }
  }

  revalidatePath(routes.PROJECT(projectId))
  revalidatePath(routes.PROJECTS)

  return { error: null }
}
