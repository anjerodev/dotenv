'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { routes } from '@/constants/routes'

import { ProjectInputType } from '@/types/collections'
import { createServerClient } from '@/lib/supabase-server'

export async function createProject(data: ProjectInputType) {
  const supabase = createServerClient()
  const newProject = await supabase.from('projects').insert(data).select()
  revalidatePath(routes.PROJECTS)
  return newProject
}

export async function removeProject(id: string) {
  const supabase = createServerClient()
  const { error } = await supabase.from('projects').delete().eq('id', id)

  if (error) return error

  revalidatePath(routes.PROJECTS)
  redirect(routes.PROJECTS)
}
