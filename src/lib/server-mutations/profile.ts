'use server'

import { revalidatePath } from 'next/cache'
import { routes } from '@/constants/routes'

import { MutationReturnType } from '@/types/actions'
import { ProfileInputType } from '@/types/collections'
import { getSession } from '@/lib/supabase-server'
import { profileSchema } from '@/lib/validations/profile'

import { RequestErrorType } from '../errors'

interface PayloadData {
  [key: string]: any
}

export async function updateProfile(
  values: Omit<ProfileInputType, 'id' | 'avatar_url'>
): Promise<MutationReturnType> {
  const { supabase, session } = await getSession()
  const payload = profileSchema.safeParse(values)

  if (!session) return { error: { message: 'You must log in.' } }

  if (!payload.success) {
    return { error: { message: 'The form validation has not passed.' } }
  }

  const dataToUpdate: PayloadData = Object.entries(payload.data).reduce(
    (result: PayloadData, [key, value]: [string, any]) => {
      if (value) {
        result[key] = value
      }
      return result
    },
    {}
  )

  let { error } = await supabase
    .from('profiles')
    .update({
      updated_at: new Date().toISOString(),
      ...dataToUpdate,
    })
    .eq('id', session.user.id)

  if (error) {
    console.log('Error updating user: ', { error })
    let errorMessage: RequestErrorType = { message: error.message }
    if (error.message.includes('profiles_username_key')) {
      errorMessage = {
        message: 'Error updating user',
        form: {
          username:
            "Oops, it seems someone beat you to that username. Let's find an available one that suits you just as well.",
        },
      }
    }
    return {
      error: errorMessage,
    }
  }

  revalidatePath(routes.ACCOUNT)

  return { error: null }
}
