import { cookies } from 'next/headers'

import 'server-only'

import {
  createServerComponentClient,
  createRouteHandlerClient as supabaseCreateRouteHandlerClient,
} from '@supabase/auth-helpers-nextjs'
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
export const createAdminSupabase = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

export const createServerClient = () =>
  createServerComponentClient<Database>({
    cookies,
  })
export const createRouterHandleClient = () =>
  supabaseCreateRouteHandlerClient<Database>({ cookies })

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

export const getRouteHandlerSession = async () => {
  try {
    const supabase = createRouterHandleClient()
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
    const supabase = createServerClient()

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
      throw new RequestError({ message: 'Unauthorized', status: 401 })
    }

    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (error || !user) {
      // console.log(error)
      return null
    } else {
      return user
    }
  } catch (error) {
    return null
  }
}
