import 'server-only'
import { RequestError } from '@/lib/errors'
import { getSession } from '@/lib/supabase-server'
import { editProjectSchema, projectSchema } from '@/lib/validations/project'

export async function createProject(values: { [x: string]: any }) {
  try {
    const { supabase, error: sessionError } = await getSession()

    if (sessionError) {
      throw new RequestError({
        message:
          sessionError?.message ?? 'There is no connection with the database.',
        status: sessionError?.status,
      })
    }

    const payload = projectSchema.safeParse(values)

    if (!payload.success) {
      return { error: { message: 'The form validation has not passed.' } }
    }

    const { data: project, error } = await supabase
      .from('projects')
      .insert(payload.data)
      .select()
      .single()

    if (error) {
      throw new RequestError({
        message: error?.message ?? 'Error creting the new project.',
      })
    }

    return project
  } catch (error) {
    throw error
  }
}

export async function updateProject(id: string, values: { [x: string]: any }) {
  try {
    const { supabase, error: sessionError } = await getSession()

    if (sessionError) {
      throw new RequestError({
        message:
          sessionError?.message ?? 'There is no connection with the database.',
        status: sessionError?.status,
      })
    }

    const payload = editProjectSchema.safeParse(values)

    if (!payload.success) {
      throw new RequestError({
        message: 'The form validation has not passed.',
      })
    }

    const parsedValues = payload.data

    const projectUpdatePromise = supabase
      .from('projects')
      .update({ name: parsedValues.name })
      .eq('id', id)
      .select()
      .single()

    const documentsUpdatePromise = supabase
      .from('documents')
      .delete()
      .in('id', parsedValues.removedDocs)
      .select('id, name')

    const [project, documents] = await Promise.all([
      projectUpdatePromise,
      documentsUpdatePromise,
    ])

    const error = project.error || documents.error

    if (error) {
      throw new RequestError({
        message: error?.message,
      })
    }

    const data = { ...project.data, documents: documents.data }
    return data
  } catch (error) {
    throw error
  }
}

export async function removeProject(id: string) {
  try {
    const { supabase, error: sessionError } = await getSession()

    if (sessionError) {
      throw new RequestError({
        message:
          sessionError?.message ?? 'There is no connection with the database.',
        status: sessionError?.status,
      })
    }

    const { error } = await supabase.from('projects').delete().eq('id', id)

    if (error) {
      throw new RequestError({
        message: error?.message,
      })
    }
    return { id }
  } catch (error) {
    throw error
  }
}
