'use server'

import { revalidatePath } from 'next/cache'
import { routes } from '@/constants/routes'

import { MutationReturnType } from '@/types/actions'
import { ProfileInputType } from '@/types/collections'
import { createServerClient } from '@/lib/supabase-server'
import { profileSchema } from '@/lib/validations/profile'

export async function updateProfile(
  id: string,
  values: Omit<ProfileInputType, 'id' | 'avatar_url'>
): Promise<MutationReturnType> {
  const supabase = createServerClient()
  const payload = profileSchema.safeParse(values)

  if (!payload.success) {
    return { error: { message: 'The form validation has not passed.' } }
  }

  let { error } = await supabase.from('profiles').upsert({
    id,
    updated_at: new Date().toISOString(),
    ...payload.data,
  })

  if (error) return { error: { message: error.message } }

  revalidatePath(routes.ACCOUNT)

  return { error: null }
}
