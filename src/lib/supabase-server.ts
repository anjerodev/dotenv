import { cookies } from 'next/headers'

import 'server-only'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

import { Profile } from '@/types/collections'
import type { Database } from '@/types/supabase'

import { RequestError } from './errors'

/**
 * It is needed to create a supabase client with supabase-js and the service_role key
 * in order to make encryption work properly, if not, the error 'permission denied
 * for function crypto_aead_det_decrypt' will be throw when try to access/modify
 * the encrypted data with the auth helpers client
 */
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const createServerClient = () => {
  return createServerComponentClient<Database>({
    cookies,
  })
}

export const getSession = async () => {
  try {
    const supabase = createServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      throw new RequestError({ message: 'Unauthorized', status: 401 })
    }

    return { supabase, session }
  } catch (error) {
    throw error
  }
}

export const getAuthUser = async (): Promise<Profile | null> => {
  try {
    const { session } = await getSession()

    const authUser = session.user

    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()

    const avatar = user?.avatar_url
      ? supabase.storage.from('avatars').getPublicUrl(user?.avatar_url).data
          .publicUrl
      : null

    if (error || !user) {
      // console.log(error)
      return null
    } else {
      return { avatar, ...user }
    }
  } catch (error) {
    return null
  }
}
