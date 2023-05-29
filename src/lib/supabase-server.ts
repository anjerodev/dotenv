import { cookies, headers } from 'next/headers'

import 'server-only'
import {
  Session,
  createServerComponentSupabaseClient,
} from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

import { Profile } from '@/types/collections'
import type { Database } from '@/types/supabase'

import { RequestError } from './request-error-handler'

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
  return createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })
}

type SupabaseError = {
  message: string
  status: number
}

type SupabaseClientInfo = {
  supabase: ReturnType<typeof createServerComponentSupabaseClient<Database>>
  session: Session
  error: SupabaseError | null
}

export const getSession = async (): Promise<SupabaseClientInfo> => {
  const supabase = createServerClient()

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      throw new RequestError({ message: 'Unauthorized', status: 401 })
    }

    return { supabase, session, error: null }
  } catch (error: any) {
    const errorResponse = {
      message: error.message,
      status: error.status,
    }

    return {
      supabase,
      session: undefined as any,
      error: errorResponse,
    }
  }
}

export const getAuthUser = async (): Promise<Profile> => {
  const { session } = await getSession()

  if (!session) {
    throw new RequestError({ message: 'Unauthorized', status: 401 })
  }

  const authUser = session.user
  const email = authUser.email

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
    console.log(error)
    throw new RequestError({ message: 'No user found', status: 404 })
  } else {
    return { email, avatar, ...user }
  }
}
