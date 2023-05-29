'use server'

import { revalidatePath } from 'next/cache'
import { routes } from '@/constants/routes'

import { MutationReturnType } from '@/types/actions'
import { supabase as admin, getSession } from '@/lib/supabase-server'

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
