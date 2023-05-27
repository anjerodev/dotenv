'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { routes } from '@/constants/routes'

import { MutationReturnType } from '@/types/actions'
import { ProjectInputType } from '@/types/collections'
import { createServerClient } from '@/lib/supabase-server'
import { projectNameSchema } from '@/lib/validations/project'

export async function createProject(
  values: ProjectInputType
): Promise<MutationReturnType> {
  const supabase = createServerClient()
  const payload = projectNameSchema.safeParse(values)

  if (!payload.success) {
    return { error: { message: 'The form validation has not passed.' } }
  }

  const { error } = await supabase.from('projects').insert(payload.data)

  if (error) return { error: { message: error.message } }

  revalidatePath(routes.PROJECTS)
  return { error: null }
}

export async function removeProject(id: string): Promise<MutationReturnType> {
  const supabase = createServerClient()
  const { error } = await supabase.from('projects').delete().eq('id', id)

  if (error) return { error: { message: error.message } }
  redirect(routes.PROJECTS)
}

interface UpdateProjectInput {
  name: string
  removedDocs: string[]
}

export async function updateProject(
  id: string,
  values: UpdateProjectInput
): Promise<MutationReturnType> {
  const supabase = createServerClient()
  const projectUpdatePromise = supabase
    .from('projects')
    .update({ name: values.name })
    .eq('id', id)

  const documentsUpdatePromise = supabase
    .from('documents')
    .delete()
    .in('id', values.removedDocs)

  const [projectError, documentsError] = await Promise.all([
    projectUpdatePromise,
    documentsUpdatePromise,
  ])

  const error = projectError.error || documentsError.error

  if (error) return { error: { message: error.message } }

  /**
   * For some reason revalidate the path /projects does not works
   * TODO: Find the way to revalidate the /projects page
   */
  revalidatePath(routes.PROJECTS)
  revalidatePath(routes.PROJECT(id))

  return { error: null }
}
